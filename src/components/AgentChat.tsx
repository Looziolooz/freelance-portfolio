"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/components/LangProvider";

interface Message {
  content: string;
  isUser: boolean;
}

interface AgentChatProps {
  agentType: string;
  initialMessage?: string;
  agentInitials: string;
  agentName: string;
  directQuestion?: string;
}

export default function AgentChat({
  agentType,
  initialMessage,
  agentInitials,
  agentName,
  directQuestion,
}: AgentChatProps) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState<Message[]>(
    initialMessage ? [{ content: initialMessage, isUser: false }] : []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Re-seed the greeting when initialMessage changes (e.g. a language switch),
  // adjusting state during render rather than in an effect — React's documented
  // "reset on prop change" pattern (satisfies react-hooks/set-state-in-effect).
  const [prevInitial, setPrevInitial] = useState(initialMessage);
  if (initialMessage !== prevInitial) {
    setPrevInitial(initialMessage);
    setMessages(initialMessage ? [{ content: initialMessage, isUser: false }] : []);
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Abort any in-flight request when the chat unmounts (stops paying for a
  // reply nobody will see).
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isLoading) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setMessages((prev) => [...prev, { content: text, isUser: true }]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch(`/api/agents/${agentType}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, lang }),
          signal: controller.signal,
        });

        const data = await res.json();
        const reply = data?.success ? data?.data?.response : null;
        setMessages((prev) => [
          ...prev,
          { content: reply || t("agent.chat.error"), isUser: false },
        ]);
      } catch (e) {
        // A new send or an unmount aborted this request — not an error.
        if (e instanceof DOMException && e.name === "AbortError") return;
        setMessages((prev) => [
          ...prev,
          { content: t("agent.chat.error"), isUser: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, agentType, isLoading, lang, t]
  );

  useEffect(() => {
    if (
      directQuestion &&
      !processedRef.current.includes(directQuestion)
    ) {
      processedRef.current.push(directQuestion);
      handleSend(directQuestion);
    }
  }, [directQuestion, handleSend]);

  const renderContent = (content: string) => {
    // Escape HTML first so model- or user-supplied text can never inject live
    // tags (prompt-injection / XSS), THEN apply the lightweight markdown.
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    const html = escaped
      .replace(/### (.+)/g, "<strong style='font-size:1.1em'>$1</strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(
        /`(.+?)`/g,
        "<code style='background:var(--line);padding:1px 4px;border-radius:3px;font:var(--font-mono);font-size:0.9em'>$1</code>"
      )
      .replace(/\n/g, "<br/>");
    return { __html: html };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 460,
        border: "1px solid var(--line)",
        borderRadius: 4,
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderBottom: "1px solid var(--line)",
          background: "var(--panel)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: 0.6,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isLoading ? "var(--accent)" : "#3ecf8e",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {agentName} {isLoading ? t("agent.chat.thinking") : t("agent.chat.online")}
      </div>

      {/* messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              maxWidth: "88%",
              alignSelf: msg.isUser ? "flex-end" : "flex-start",
              flexDirection: msg.isUser ? "row-reverse" : "row",
            }}
          >
            {!msg.isUser && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "var(--accentInk)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                  alignSelf: "flex-end",
                }}
              >
                {agentInitials}
              </div>
            )}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 4,
                fontSize: 13,
                lineHeight: 1.55,
                fontFamily: "var(--font-sans)",
                background: msg.isUser ? "var(--fg)" : "var(--panel)",
                color: msg.isUser ? "var(--bg)" : "var(--fg)",
              }}
            >
              <div dangerouslySetInnerHTML={renderContent(msg.content)} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: 10, maxWidth: "88%" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "var(--accentInk)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 600,
                flexShrink: 0,
                alignSelf: "flex-end",
              }}
            >
              {agentInitials}
            </div>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                background: "var(--panel)",
                color: "var(--muted)",
              }}
            >
              {t("agent.chat.think")}<span style={{ animation: "dots 1.5s steps(5,end) infinite" }}>...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid var(--line)",
          background: "var(--bg)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder={t("agent.chat.placeholder")}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid var(--line)",
            borderRadius: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            background: "var(--bg)",
            color: "var(--fg)",
            outline: "none",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading}
          style={{
            padding: "8px 18px",
            background: "var(--accent)",
            color: "var(--accentInk)",
            border: "none",
            borderRadius: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: 500,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {t("agent.chat.send")}
        </button>
      </div>
    </div>
  );
}

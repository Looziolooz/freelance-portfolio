"use client";
import React, { useEffect, useRef, useState } from "react";
// This project ships framer-motion (not the standalone `motion` package); it
// exports the same `motion` + `useInView` API.
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type EncryptedTextProps = {
  text: string;
  className?: string;
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Lower is faster. Defaults to 50ms per character.
   */
  revealDelayMs?: number;
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string;
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 50ms.
   */
  flipDelayMs?: number;
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string;
  /** CSS class for styling the revealed characters */
  revealedClassName?: string;
};

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length);
  return charset.charAt(index);
}

function generateGibberishPreservingSpaces(
  original: string,
  charset: string,
): string {
  if (!original) return "";
  let result = "";
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result += ch === " " ? " " : generateRandomCharacter(charset);
  }
  return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  // Scramble chars are random, so SSR and the first client render would differ.
  // Render a deterministic placeholder until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [revealCount, setRevealCount] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const scrambleCharsRef = useRef<string[]>(
    text ? generateGibberishPreservingSpaces(text, charset).split("") : [],
  );

  useEffect(() => {
    if (!isInView) return;

    // Honour reduced-motion: show the final text immediately, no scrambling.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealCount(text.length);
      return;
    }

    // Reset state for a fresh animation whenever dependencies change
    const initial = text
      ? generateGibberishPreservingSpaces(text, charset)
      : "";
    scrambleCharsRef.current = initial.split("");
    startTimeRef.current = performance.now();
    lastFlipTimeRef.current = startTimeRef.current;
    setRevealCount(0);

    let isCancelled = false;

    const update = (now: number) => {
      if (isCancelled) return;

      const elapsedMs = now - startTimeRef.current;
      const totalLength = text.length;
      const currentRevealCount = Math.min(
        totalLength,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs)),
      );

      setRevealCount(currentRevealCount);

      if (currentRevealCount >= totalLength) {
        return;
      }

      // Re-randomize unrevealed scramble characters on an interval
      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let index = 0; index < totalLength; index += 1) {
          if (index >= currentRevealCount) {
            if (text[index] !== " ") {
              scrambleCharsRef.current[index] =
                generateRandomCharacter(charset);
            } else {
              scrambleCharsRef.current[index] = " ";
            }
          }
        }
        lastFlipTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView, text, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;

        // Revealed, a space, or not yet mounted: plain text, normal flow.
        // Pre-mount (and in the SERVER HTML) that means the REAL text — crawlers
        // and LLMs must never see gibberish in the H1 (SEO audit); the scramble
        // starts only after hydration. Spaces stay unwrapped so the line-break
        // opportunities are exactly those of the final text.
        if (isRevealed || char === " " || !mounted) {
          return (
            <span key={index} className={cn(isRevealed ? revealedClassName : encryptedClassName)}>
              {char}
            </span>
          );
        }

        // Unrevealed: the cell reserves the FINAL character's advance width and
        // the random glyph is painted over it, out of flow.
        //
        // Random glyphs are not the same width as the letters they stand in for,
        // so putting them in the flow re-wrapped the headline on every flip: 52
        // layout shifts and a CLS of 0.40 on the homepage, all from this effect.
        // The ghost in HeroMotion already stops the siblings BELOW from moving,
        // but CLS also counts the headline's own lines moving inside that box.
        const glyph = scrambleCharsRef.current[index] ?? generateRandomCharacter(charset);
        return (
          <span key={index} className={cn("enc-cell", encryptedClassName)}>
            <span className="enc-cell__slot">{char}</span>
            <span className="enc-cell__glyph" aria-hidden="true">{glyph}</span>
          </span>
        );
      })}
    </motion.span>
  );
};

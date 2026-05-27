import os
import requests
from dotenv import load_dotenv

load_dotenv()


def _format_context(ctx: dict, lang: str) -> str:
    parts = []
    if ctx.get("projects"):
        parts.append("## Progetti / Projects / Projekt\n" + "\n".join(
            f"- {p['title']}: {p['description']}" for p in ctx["projects"]
        ))
    if ctx.get("blogPosts"):
        parts.append("## Blog / Articoli / Articles\n" + "\n".join(
            f"- [{a['category']}] {a['title']}: {a['description']}" for a in ctx["blogPosts"]
        ))
    return "\n\n".join(parts) if parts else ""


_AVAILABLE = {
    "it": "Disponibile per progetti · Maggio 2026",
    "en": "Available for projects · May 2026",
    "sv": "Tillgänglig för projekt · Maj 2026",
}
_LOCATION = {
    "it": "Stoccolma, Svezia · Lavoro in Europa · Remoto",
    "en": "Stockholm, Sweden · Works in Europe · Remote",
    "sv": "Stockholm, Sverige · Arbetar i Europa · Distans",
}


class BaseAgent:
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.api_key = os.getenv("GROQ_API_KEY")

    def get_response(self, prompt, ctx=None, lang="it"):
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            context_block = _format_context(ctx or {}, lang)
            available = _AVAILABLE.get(lang, _AVAILABLE["en"])
            location = _LOCATION.get(lang, _LOCATION["en"])

            system_parts = [
                f"You are {self.name}, {self.description}.",
                f"CRITICAL: You MUST respond in {'Italian' if lang == 'it' else 'English' if lang == 'en' else 'Swedish'}. Use that language for all your answers.",
                f"About Lorenzo: {available}. Based in {location}. Specializes in AI orchestration, n8n, web scraping, automation, Next.js, TypeScript, system design, and UI engineering.",
            ]
            if context_block:
                system_parts.append(
                    "Here is REAL data from Lorenzo's portfolio database. Use this to answer questions accurately. "
                    "Do NOT invent projects or blog posts — only reference what is listed below.\n" + context_block
                )
            system_prompt = "\n\n".join(system_parts)

            data = {
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 800
            }

            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=data
            )

            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                return f"Error: {response.status_code} - {response.text}"
        except Exception as e:
            return f"An error occurred: {str(e)}"

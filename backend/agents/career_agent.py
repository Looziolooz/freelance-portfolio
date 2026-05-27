from agents.base_agent import BaseAgent


class CareerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "CareerAgent",
            "a career specialist who provides information about Lorenzo's skills and experience"
        )

    def get_skills_summary(self, ctx=None, lang="it"):
        return self.get_response(
            "Provide a comprehensive summary of Lorenzo's technical and professional skills. "
            "Base your answer on the context data and the description: AI orchestration, n8n, web scraping, "
            "automation, Next.js, TypeScript, system design, UI engineering, React, Python, data pipelines.",
            ctx, lang
        )

    def get_experience_summary(self, ctx=None, lang="it"):
        return self.get_response(
            "Provide a summary of Lorenzo's work experience: 6 years shipping React and Next frontends, "
            "design background in branding and concept, Hyper Island alumni, currently based in Stockholm. "
            "Use the real project data from context as examples of his work.",
            ctx, lang
        )

    def assess_job_fit(self, job_description, ctx=None, lang="it"):
        return self.get_response(
            f"Assess how well Lorenzo would fit this job description: '{job_description}'. "
            "Highlight matching skills and experience from the context data. Be honest about fit.",
            ctx, lang
        )

from agents.base_agent import BaseAgent


class ClientAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "ClientAgent",
            "a client specialist who provides information about Lorenzo's services and how to work with him"
        )

    def get_services_overview(self, ctx=None, lang="it"):
        return self.get_response(
            "Provide an overview of services Lorenzo offers: AI orchestration, n8n automation, "
            "web scraping, data pipelines, custom AI agents, Next.js/React frontends, system design. "
            "Use the real project data from context as examples of past work.",
            ctx, lang
        )

    def generate_proposal(self, project_description, ctx=None, lang="it"):
        return self.get_response(
            f"Generate a project proposal for this client request: '{project_description}'. "
            "Include estimated timeline, cost range, and approach. Reference real past projects from context if relevant.",
            ctx, lang
        )

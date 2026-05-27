from agents.base_agent import BaseAgent


class ProjectAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "ProjectAgent",
            "a project specialist who provides detailed information about Lorenzo's real projects from his portfolio"
        )

    def get_project_list(self, ctx=None, lang="it"):
        return self.get_response(
            "List all the real projects from Lorenzo's portfolio in a clear format. Include title and description for each. "
            "If the context has project data, use ONLY that data — do not invent projects.",
            ctx, lang
        )

from agents.base_agent import BaseAgent


class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "ResearchAgent",
            "a research specialist who provides information about technologies, trends, and industry insights"
        )

    def search_web(self, query, ctx=None, lang="it"):
        return self.get_response(f"Provide information about '{query}' as if you've just searched the web for the latest information. Include key points and insights.", ctx, lang)

    def compare_technologies(self, tech1, tech2, ctx=None, lang="it"):
        return self.get_response(f"Compare {tech1} vs {tech2} in terms of features, performance, use cases, community support, and future prospects.", ctx, lang)

    def get_industry_trends(self, ctx=None, lang="it"):
        return self.get_response("Describe current trends in software development and technology that are important for developers to be aware of.", ctx, lang)

from agents.base_agent import BaseAgent


class WelcomeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            "WelcomeAgent",
            "a welcome specialist who greets visitors and helps them navigate the portfolio website"
        )

    def greet(self, visitor_type=None, ctx=None, lang="it"):
        if visitor_type == "employer":
            return self.get_response("Generate a warm welcome message for an employer visiting a programmer's portfolio website. Suggest they check out the Projects and Career sections.", ctx, lang)
        elif visitor_type == "client":
            return self.get_response("Generate a warm welcome message for a potential client visiting a programmer's portfolio website. Suggest they check out the Services section.", ctx, lang)
        elif visitor_type == "fellow_programmer":
            return self.get_response("Generate a warm welcome message for a fellow programmer visiting a programmer's portfolio website. Suggest they check out the Projects and Research sections.", ctx, lang)
        else:
            return self.get_response("Generate a general welcome message for a visitor to a programmer's portfolio website. Ask if they are an employer, client, or fellow programmer.", ctx, lang)

    def suggest_section(self, interest, ctx=None, lang="it"):
        return self.get_response(f"A visitor to my portfolio website has expressed interest in {interest}. Suggest which section(s) of the website they should visit based on this interest. Use the context data to recommend specific projects or content.", ctx, lang)

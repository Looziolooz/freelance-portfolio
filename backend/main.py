import requests as http_requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

from agents.welcome_agent import WelcomeAgent
from agents.project_agent import ProjectAgent
from agents.career_agent import CareerAgent
from agents.client_agent import ClientAgent
from agents.research_agent import ResearchAgent

load_dotenv()

app = Flask(__name__)
CORS(app)

NEXTJS_URL = os.getenv("NEXTJS_URL", "http://localhost:3000")

welcome_agent = WelcomeAgent()
project_agent = ProjectAgent()
career_agent = CareerAgent()
client_agent = ClientAgent()
research_agent = ResearchAgent()


def fetch_context(lang: str) -> dict:
    try:
        resp = http_requests.get(
            f"{NEXTJS_URL}/api/agent-context?lang={lang.upper()}",
            timeout=5,
        )
        if resp.status_code == 200:
            data = resp.json()
            return data.get("data", {})
    except Exception:
        pass
    return {"projects": [], "blogPosts": [], "lang": lang}


@app.route('/api/welcome', methods=['POST'])
def welcome_endpoint():
    data = request.json
    message = data.get('message', '')
    lang = data.get('lang', 'it')
    ctx = fetch_context(lang)

    visitor_type = None
    if 'employer' in message.lower():
        visitor_type = 'employer'
    elif 'client' in message.lower():
        visitor_type = 'client'
    elif 'programmer' in message.lower() or 'developer' in message.lower():
        visitor_type = 'fellow_programmer'

    if 'interest' in message.lower() or 'looking for' in message.lower():
        interest = message.replace('interest', '').replace('looking for', '').strip()
        response = welcome_agent.suggest_section(interest, ctx, lang)
    else:
        response = welcome_agent.greet(visitor_type, ctx, lang)

    return jsonify({'response': response})


@app.route('/api/project', methods=['POST'])
def project_endpoint():
    data = request.json
    message = data.get('message', '')
    lang = data.get('lang', 'it')
    ctx = fetch_context(lang)

    if 'list' in message.lower() or 'all projects' in message.lower() or 'tutti' in message.lower() or 'progetti' in message.lower():
        response = project_agent.get_project_list(ctx, lang)
    else:
        response = project_agent.get_response(
            f"The user asked: '{message}'. Answer using the real project data provided as context. "
            "If they ask about a specific project, find it in the project list and give detailed info.",
            ctx, lang
        )

    return jsonify({'response': response})


@app.route('/api/career', methods=['POST'])
def career_endpoint():
    data = request.json
    message = data.get('message', '')
    lang = data.get('lang', 'it')
    ctx = fetch_context(lang)

    if 'skills' in message.lower():
        response = career_agent.get_skills_summary(ctx, lang)
    elif 'experience' in message.lower() or 'work history' in message.lower():
        response = career_agent.get_experience_summary(ctx, lang)
    elif 'job' in message.lower() or 'position' in message.lower() or 'role' in message.lower():
        response = career_agent.assess_job_fit(message, ctx, lang)
    else:
        response = career_agent.get_response(
            f"The user asked: '{message}'. Respond in {lang} as a career specialist. "
            "Suggest they ask about skills, experience, or job fit assessment. Use the context data if relevant.",
            ctx, lang
        )

    return jsonify({'response': response})


@app.route('/api/client', methods=['POST'])
def client_endpoint():
    data = request.json
    message = data.get('message', '')
    lang = data.get('lang', 'it')
    ctx = fetch_context(lang)

    if 'services' in message.lower() or 'offerings' in message.lower():
        response = client_agent.get_services_overview(ctx, lang)
    elif 'proposal' in message.lower() or 'quote' in message.lower() or 'estimate' in message.lower():
        response = client_agent.generate_proposal(message, ctx, lang)
    else:
        response = client_agent.get_response(
            f"The user asked: '{message}'. Respond in {lang} as a client specialist. "
            "Suggest they ask about services, the process, or request a proposal. Use the context if relevant.",
            ctx, lang
        )

    return jsonify({'response': response})


@app.route('/api/research', methods=['POST'])
def research_endpoint():
    data = request.json
    message = data.get('message', '')
    lang = data.get('lang', 'it')
    ctx = fetch_context(lang)

    if 'compare' in message.lower() and ('vs' in message.lower() or 'versus' in message.lower()):
        tech_parts = message.lower().replace('compare', '').replace('vs', ' ').replace('versus', ' ').split()
        tech1 = tech_parts[0] if len(tech_parts) > 0 else ''
        tech2 = tech_parts[-1] if len(tech_parts) > 1 else ''
        response = research_agent.compare_technologies(tech1, tech2, ctx, lang)
    elif 'trends' in message.lower() or 'industry' in message.lower():
        response = research_agent.get_industry_trends(ctx, lang)
    else:
        response = research_agent.search_web(message, ctx, lang)

    return jsonify({'response': response})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False, threaded=True)

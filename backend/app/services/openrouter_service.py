import httpx
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

OPENROUTER_BASE = "https://openrouter.ai/api/v1"
DEFAULT_MODEL = "openai/gpt-4o-mini"

def build_prompt(
    title: str,
    description: str,
    features: str | None,
    budget: str | None,
    timeline: str | None,
    tone: str,
) -> str:
    features_text = features if features else "Not specified"
    budget_text = budget if budget else "Not specified"
    timeline_text = timeline if timeline else "Not specified"

    tone_guide = {
        "formal": "Use formal, professional language with precise terminology.",
        "friendly": "Use a warm, approachable tone that feels collaborative and personable.",
        "persuasive": "Use persuasive, compelling language that highlights value and drives action.",
    }

    return f"""You are an expert freelance proposal writer with 10+ years of experience crafting winning proposals.

Generate a complete, polished, and professional project proposal in well-structured Markdown format.

PROJECT DETAILS:
- Title: {title}
- Description: {description}
- Required Features: {features_text}
- Budget: {budget_text}
- Timeline: {timeline_text}
- Tone: {tone} — {tone_guide.get(tone, "")}

IMPORTANT INSTRUCTIONS:
- Structure the proposal with the EXACT sections listed below using Markdown ## headers
- Be specific and reference the project details throughout
- Provide realistic and detailed content — no generic filler
- Make the proposal compelling and client-ready
- The email template should be ready to send directly

REQUIRED SECTIONS (use exactly these ## headers):

## Introduction
## Understanding of Requirements
## Proposed Solution
## Timeline Breakdown
## Pricing Explanation
## Closing Statement
## Professional Email Template

Generate the full proposal now:"""

async def generate_proposal(
    title: str,
    description: str,
    features: str | None,
    budget: str | None,
    timeline: str | None,
    tone: str,
) -> str:
    """
    Generate a proposal using OpenRouter.
    """
    # ─── DEVELOPMENT MOCK MODE ──────────────────────────────────────────────────
    # Instantly returning a high-quality mock response so you can focus on UI
    # development without worrying about API keys, network errors, or rate limits.
    features_list = "\\n".join([f"- {f.strip()}" for f in (features or "Core functionality, Responsive design").split(",")])
    
    mock_md = f"""## Introduction
Thank you for the opportunity to submit a proposal for **{title}**. We are thrilled at the prospect of collaborating with you on this initiative. Our team specializes in delivering high-quality solutions, and we are confident in our ability to meet your goals.

## Understanding of Requirements
Based on your description: "{description}", we understand the primary objective is to create a robust, scalable solution. We recognize the importance of aligning the technical deliverables with your overall strategic vision.

## Proposed Solution
We propose building a tailored application that addresses your core needs. 
Key deliverables will include:
{features_list}

We will ensure the architecture is modern, maintainable, and built employing best practices.

## Timeline Breakdown
Given your expected timeline ({timeline or '4-6 weeks'}), we propose the following sprint structure:
- **Phase 1 (Week 1):** Discovery, Wireframing, and UI/UX Design
- **Phase 2 (Week 2-3):** Core Development & Integration
- **Phase 3 (Week 4):** QA Testing, UAT, and Final Deployment

## Pricing Explanation
Based on your budget indication ({budget or 'Standard Pricing'}), our estimated investment is structured as follows:
- **Design & Prototyping:** 20%
- **Development & Implementation:** 60%
- **Testing, Deployment & Handover:** 20%
*This is a fixed-price estimate and covers all features discussed.*

## Closing Statement
We appreciate your consideration of our proposal. We are ready to begin immediately and look forward to the possibility of working together to bring **{title}** to life!

## Professional Email Template
**Subject:** Proposal for {title}

Hi there,

I hope this email finds you well! 

Please find our detailed proposal for **{title}** above. We have carefully reviewed your requirements ({description[:50]}...) and outlined a strategy that aligns perfectly with your goals and {timeline or 'timeline'}.

I'd love to schedule a quick 15-minute call next week to walk you through our approach and answer any questions. Let me know what day works best for you.

Best regards,
[Your Name]
"""
    import asyncio
    await asyncio.sleep(1) # simulate slight network delay for UI realism
    return mock_md
    # ─────────────────────────────────────────────────────────────────────────────
    
    prompt = build_prompt(title, description, features, budget, timeline, tone)

    payload = {
        "model": DEFAULT_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4096,
        "top_p": 0.9,
    }

    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.frontend_url,
        "X-Title": "AI Client Proposal Generator"
    }

    url = f"{OPENROUTER_BASE}/chat/completions"

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
        except httpx.RequestError as e:
            logger.error(f"Network error calling OpenRouter: {e}")
            raise ValueError("Failed to connect to OpenRouter API. Please check your network.")

    if response.status_code == 200:
        data = response.json()
        try:
            content = data["choices"][0]["message"]["content"]
            logger.info(f"Proposal generated using {DEFAULT_MODEL}")
            return content.strip()
        except (KeyError, IndexError) as e:
            raise ValueError(f"Unexpected response format from OpenRouter: {e}")

    elif response.status_code == 429:
        raise ValueError(
            "AI rate limit or insufficient credits reached on OpenRouter. "
            "Please check your account."
        )
    else:
        error_detail = response.json().get("error", {}).get("message", "Unknown error")
        logger.warning(f"OpenRouter error {response.status_code}: {error_detail}")
        raise ValueError(f"OpenRouter API error: {error_detail}")

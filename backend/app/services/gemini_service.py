import re
import httpx
import logging
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

GEMINI_BASE = "https://generativelanguage.googleapis.com"

# Ordered preference list — the service tries each until one succeeds.
# - v1 is the stable channel (supports 1.5-flash)
# - v1beta supports 2.0 models
GEMINI_MODELS = [
    ("v1",    "gemini-1.5-flash"),
    ("v1",    "gemini-1.5-flash-001"),
    ("v1",    "gemini-1.5-flash-002"),
    ("v1",    "gemini-1.5-flash-8b"),
    ("v1beta","gemini-2.0-flash"),
    ("v1beta","gemini-2.0-flash-exp"),
    ("v1beta","gemini-2.0-flash-lite"),
    ("v1",    "gemini-1.0-pro"),
]


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


async def _call_model(api_version: str, model: str, payload: dict) -> httpx.Response:
    url = f"{GEMINI_BASE}/{api_version}/models/{model}:generateContent"
    async with httpx.AsyncClient(timeout=60.0) as client:
        return await client.post(
            url,
            params={"key": settings.gemini_api_key},
            json=payload,
        )


async def generate_proposal(
    title: str,
    description: str,
    features: str | None,
    budget: str | None,
    timeline: str | None,
    tone: str,
) -> str:
    """
    Generate a proposal using the first available Gemini model.
    Tries v1 (stable) models first, then v1beta models as fallback.
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
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 4096,
            "topP": 0.9,
        },
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        ],
    }

    last_error = "No Gemini model available"

    for api_version, model in GEMINI_MODELS:
        response = await _call_model(api_version, model, payload)

        # ── Success ───────────────────────────────────────────────────────────
        if response.status_code == 200:
            data = response.json()
            try:
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                logger.info(f"Proposal generated using {api_version}/{model}")
                return content.strip()
            except (KeyError, IndexError) as e:
                last_error = f"Unexpected response format from {model}: {e}"
                continue

        # ── Model not found — try next ─────────────────────────────────────
        elif response.status_code == 404:
            logger.warning(f"Model not found: {api_version}/{model}, trying next...")
            continue

        # ── Rate limit ────────────────────────────────────────────────────────
        elif response.status_code == 429:
            error_msg = response.json().get("error", {}).get("message", "")
            # If free tier limit is 0, skip this model entirely
            if "limit: 0" in error_msg:
                logger.warning(f"Model {model} requires billing (free tier limit=0), skipping...")
                continue
            # Otherwise, surface the rate limit to the user with wait time
            match = re.search(r"retry in ([\d.]+)s", error_msg, re.IGNORECASE)
            wait_sec = int(float(match.group(1))) + 1 if match else 60
            raise ValueError(
                f"AI rate limit reached. Please wait {wait_sec} seconds and try again. "
                f"(Free tier: 15 requests/minute)"
            )

        # ── Other errors ──────────────────────────────────────────────────────
        else:
            error_detail = response.json().get("error", {}).get("message", "Unknown error")
            last_error = f"[{model}] {error_detail}"
            logger.warning(f"Model {model} error {response.status_code}: {error_detail}")
            continue

    raise ValueError(
        f"All Gemini models failed. Last error: {last_error}. "
        "Please check your API key at https://aistudio.google.com/app/apikey"
    )

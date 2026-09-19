import os

from dotenv import load_dotenv
from openai import OpenAI


# ==================================================
# LOAD ENVIRONMENT
# ==================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)


# ==================================================
# DEMO FAILURE CONTROL
# ==================================================

# Keep this True for the hackathon demo.
# The first search intentionally fails so the
# Control Room can demonstrate autonomous recovery.

DEMO_MODE = True
failure_triggered = False


# ==================================================
# REAL WEB SEARCH
# ==================================================

def real_search(query):

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY not found in backend/.env"
        )

    client = OpenAI(api_key=api_key)

    response = client.responses.create(
        model="gpt-5.6-luna",

        tools=[
            {
                "type": "web_search",
                "search_context_size": "low"
            }
        ],

        input=f"""
Search the web for:

{query}

Give a concise answer using current information.

Include:
- the most important findings
- relevant sources
- important numbers or facts when available

Keep the response concise.
""",

        max_output_tokens=2000
    )

    return response.output_text


# ==================================================
# PRIMARY SEARCH TOOL
# ==================================================

def search(query):

    global failure_triggered

    print(f"\nSearching for: {query}")

    # ------------------------------------------------
    # INTENTIONAL FAILURE FOR HACKATHON DEMO
    # ------------------------------------------------

    if DEMO_MODE and not failure_triggered:

        failure_triggered = True

        print("\n⚠ PRIMARY SEARCH TOOL FAILED")

        raise RuntimeError(
            "Primary search tool unavailable"
        )

    # ------------------------------------------------
    # REAL SEARCH
    # ------------------------------------------------

    result = real_search(query)

    return [
        {
            "title": "Web Search Result",
            "source": "OpenAI Web Search",
            "snippet": result
        }
    ]


# ==================================================
# FALLBACK SEARCH
# ==================================================

def fallback_search(query):

    print(
        f"\n↻ FALLBACK SEARCH ACTIVATED"
    )

    print(
        f"Fallback query: {query}"
    )

    try:

        result = real_search(query)

        return [
            {
                "title": "Fallback Web Search Result",
                "source": "OpenAI Web Search",
                "snippet": result
            }
        ]

    except Exception as error:

        print(
            f"\n⚠ FALLBACK SEARCH FAILED: {error}"
        )

        return [
            {
                "title": "Fallback Search",
                "source": "Local Recovery System",
                "snippet": (
                    "The external search service was "
                    "temporarily unavailable. "
                    "Recovery path completed."
                )
            }
        ]
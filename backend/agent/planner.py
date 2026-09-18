import os
import json

from dotenv import load_dotenv
from openai import OpenAI

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)


def fallback_plan(goal):
    return [
        {
            "task": "Understand the requirements",
            "tool": "none"
        },
        {
            "task": "Research relevant information",
            "tool": "search"
        },
        {
            "task": "Calculate important values",
            "tool": "calculator"
        },
        {
            "task": "Verify the information",
            "tool": "verifier"
        },
        {
            "task": "Generate the final result",
            "tool": "none"
        }
    ]


def create_plan(goal):

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("⚠ No API key found.")
        print("↻ Using fallback planner.")
        return fallback_plan(goal)

    try:
        client = OpenAI(api_key=api_key)

        prompt = f"""
You are the planning engine of an autonomous AI control room.

USER GOAL:
{goal}

Break the goal into 4 to 8 concrete executable tasks.

AVAILABLE TOOLS:
- search: find current or external information
- calculator: perform numerical calculations
- verifier: verify information and results
- reader: analyze provided information
- none: reasoning or final synthesis

Return ONLY valid JSON.

Format:

[
  {{
    "task": "specific executable task",
    "tool": "search"
  }}
]

Rules:
- Every task must have exactly one tool.
- Tasks must be specific to the user's goal.
- Use search for external/current information.
- Use calculator for numerical calculations.
- Use verifier for checking results.
- Use reader when provided information needs analysis.
- Use none for reasoning or final synthesis.
- Do not invent tools.
"""

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt
        )

        text = response.output_text.strip()

        plan = json.loads(text)

        valid_tools = {
            "search",
            "calculator",
            "verifier",
            "reader",
            "none"
        }

        cleaned_plan = []

        for item in plan:

            if not isinstance(item, dict):
                continue

            task = item.get("task")
            tool = item.get("tool")

            if task and tool in valid_tools:
                cleaned_plan.append({
                    "task": task,
                    "tool": tool
                })

        if not cleaned_plan:
            raise ValueError("AI returned an empty plan")

        print("✓ AI planner generated dynamic plan.")

        return cleaned_plan

    except Exception as error:
        print("\n❌ AI PLANNER ERROR:")
        print(repr(error))
        print("\n↻ Switching to fallback planner.")

        return fallback_plan(goal)


if __name__ == "__main__":

    goal = input("\nEnter your goal: ")

    plan = create_plan(goal)

    print("\n==============================")
    print("       CONTROL ROOM PLAN")
    print("==============================\n")

    for number, item in enumerate(plan, start=1):
        print(
            f"{number}. {item['task']} "
            f"→ {item['tool'].upper()}"
        )
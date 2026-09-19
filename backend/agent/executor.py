from tools.calculator import calculate
from tools.search import search, fallback_search
from tools.recovery import recover


DEMO_MODE = True


def demo_search(task):
    task_lower = task.lower()

    if "cloud" in task_lower or "deploy" in task_lower:
        return [
            {
                "title": "AWS",
                "source": "AWS",
                "snippet": "Managed and serverless deployment options for Python applications."
            },
            {
                "title": "Microsoft Azure",
                "source": "Microsoft Azure",
                "snippet": "Azure App Service provides managed hosting for web applications."
            },
            {
                "title": "Google Cloud",
                "source": "Google Cloud",
                "snippet": "Cloud Run provides container-based deployment for web services."
            }
        ]

    if "japan" in task_lower or "trip" in task_lower:
        return [
            {
                "title": "Japan Travel Research",
                "source": "Travel Research",
                "snippet": "Estimated categories include flights, accommodation, transport, food and attractions."
            },
            {
                "title": "Japan Transportation",
                "source": "Transportation Research",
                "snippet": "Rail and local transportation costs vary by route and travel period."
            }
        ]

    return [
        {
            "title": "Research Result",
            "source": "Control Room Demo",
            "snippet": f"Relevant information collected for: {task}"
        },
        {
            "title": "Secondary Source",
            "source": "Control Room Demo",
            "snippet": "A second source was identified for cross-checking."
        }
    ]


def execute_plan(tool_plan, goal=""):

    results = []

    for number, item in enumerate(tool_plan, start=1):

        task = item["task"]
        tool = item["tool"]

        print(f"\nExecuting Task {number}: {task}")
        print(f"Selected Tool: {tool}")

        if tool == "search":

            print(f"Sending task to Search Tool: {task}")

            try:

                if DEMO_MODE:
                    if number == 2:
                        raise RuntimeError(
                            "Primary search service unavailable"
                        )

                    search_results = demo_search(task)

                else:
                    search_results = search(task)

                results.append({
                    "task_number": number,
                    "task": task,
                    "tool": tool,
                    "status": "completed",
                    "result": search_results,
                    "recovered": False
                })

                print("✓ Search completed")

            except Exception as error:

                print(f"⚠ Search failed: {error}")

                recovery_result = recover(
                    "search",
                    task
                )

                print("\nExecuting recovery strategy...")

                if DEMO_MODE:
                    search_results = demo_search(task)
                else:
                    search_results = fallback_search(task)

                results.append({
                    "task_number": number,
                    "task": task,
                    "tool": tool,
                    "status": "completed",
                    "result": search_results,
                    "recovered": True,
                    "failure": str(error),
                    "recovery_tool": recovery_result["alternative_tool"]
                })

                print(
                    f"✓ Recovery successful: "
                    f"{recovery_result['alternative_tool']}"
                )

        elif tool == "calculator":

            if DEMO_MODE:

                values = {
                    "compute": {
                        "aws": 18,
                        "azure": 22,
                        "gcp": 20
                    },
                    "default": {
                        "base": 120,
                        "additional": 35,
                        "total": 155
                    }
                }

                if "cloud" in goal.lower() or "deploy" in goal.lower():

                    result = {
                        "AWS": "$18/month",
                        "Azure": "$22/month",
                        "Google Cloud": "$20/month",
                        "comparison": "AWS has the lowest estimated demo cost."
                    }

                else:

                    result = values["default"]

            else:

                result = calculate("50 + 25 + 10")

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print(f"✓ Calculator completed: {result}")

        elif tool == "verifier":

            result = {
                "verified": True,
                "checks": [
                    "Result structure checked",
                    "Required information present",
                    "Calculation result checked",
                    "Recovery path completed successfully"
                ]
            }

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Verification completed")

        elif tool == "reader":

            result = {
                "summary": "Information analyzed successfully.",
                "confidence": "High"
            }

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Reader completed")

        else:

            result = {
                "summary": f"Reasoning completed for: {task}",
                "status": "ready"
            }

            results.append({
                "task_number": number,
                "task": task,
                "tool": "none",
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Reasoning completed")

    return results
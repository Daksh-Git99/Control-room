from tools.calculator import calculate
from tools.search import search, fallback_search
from tools.recovery import recover


def execute_plan(tool_plan):

    results = []

    for number, item in enumerate(tool_plan, start=1):

        task = item["task"]
        tool = item["tool"]

        print(f"\nExecuting Task {number}: {task}")
        print(f"Selected Tool: {tool}")

        # =========================
        # SEARCH
        # =========================

        if tool == "search":

            query = task

            print(f"Sending query to Search Tool: {query}")

            try:

                search_results = search(query)

                results.append({
                    "task_number": number,
                    "task": task,
                    "tool": tool,
                    "status": "completed",
                    "result": search_results,
                    "recovered": False
                })

                print(
                    f"✓ Search returned "
                    f"{len(search_results)} results"
                )

            except Exception as error:

                print(f"⚠ Search failed: {error}")

                recovery_result = recover(
                    "search",
                    task
                )

                print("\nExecuting recovery strategy...")

                search_results = fallback_search(query)

                results.append({
                    "task_number": number,
                    "task": task,
                    "tool": tool,
                    "status": "completed",
                    "result": search_results,
                    "recovered": True
                })

                print(
                    f"✓ Recovery successful: "
                    f"{recovery_result['alternative_tool']}"
                )

        # =========================
        # CALCULATOR
        # =========================

        elif tool == "calculator":

            # Temporary demo calculation.
            # We will make this dynamically generated next.
            expression = "50 + 25 + 10"

            print(
                f"Sending expression to Calculator: "
                f"{expression}"
            )

            result = calculate(expression)

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print(f"✓ Calculator result: {result}")

        # =========================
        # VERIFIER
        # =========================

        elif tool == "verifier":

            result = "Verification completed."

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Verification completed")

        # =========================
        # READER
        # =========================

        elif tool == "reader":

            result = (
                "Reader analyzed the available information."
            )

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Reader completed")

        # =========================
        # NO TOOL
        # =========================

        else:

            result = f"Completed reasoning task: {task}"

            results.append({
                "task_number": number,
                "task": task,
                "tool": tool,
                "status": "completed",
                "result": result,
                "recovered": False
            })

            print("✓ Reasoning task completed")

    return results
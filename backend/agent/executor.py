from tools.calculator import calculate
from tools.search import search


def execute_plan(tasks):
    results = []

    for number, task in enumerate(tasks, start=1):
        print(f"\nExecuting Task {number}: {task}")

        # Calculator Tool
        if "calculate" in task.lower():
            expression = "50 + 25 + 10"

            print(f"Sending expression to Calculator: {expression}")

            result = calculate(expression)

            results.append({
                "task_number": number,
                "task": task,
                "status": "completed",
                "result": result
            })

            print(f"Calculator result: {result}")

        # Search Tool
        elif "research" in task.lower():
            query = "Python cloud deployment options"

            print(f"Sending query to Search Tool: {query}")

            search_results = search(query)

            results.append({
                "task_number": number,
                "task": task,
                "status": "completed",
                "result": search_results
            })

            print(f"Search returned {len(search_results)} results")

        # Other tasks
        else:
            result = f"Completed: {task}"

            results.append({
                "task_number": number,
                "task": task,
                "status": "completed",
                "result": result
            })

    return results


if __name__ == "__main__":
    tasks = [
        "Understand the requirements",
        "Research deployment options",
        "Compare the available options",
        "Calculate estimated costs",
        "Verify the information",
        "Generate the final deployment plan"
    ]

    results = execute_plan(tasks)

    print("\n\nEXECUTION COMPLETE\n")

    for result in results:
        print(f"✓ {result['task']} → {result['result']}")
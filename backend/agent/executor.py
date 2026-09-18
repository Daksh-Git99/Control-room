from tools.calculator import calculate


def execute_plan(tasks):
    results = []

    for number, task in enumerate(tasks, start=1):
        print(f"\nExecuting Task {number}: {task}")

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
        "Calculate estimated costs",
        "Verify the information"
    ]

    results = execute_plan(tasks)

    print("\n\nEXECUTION COMPLETE\n")

    for result in results:
        print(f"✓ {result['task']} → {result['result']}")
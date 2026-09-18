def execute_plan(tasks):
    results = []

    for number, task in enumerate(tasks, start=1):
        print(f"\nExecuting Task {number}: {task}")

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
        print(f"✓ {result['task']}")
def select_tool(task):
    task_lower = task.lower()

    if any(word in task_lower for word in [
        "research",
        "search",
        "find",
        "look up"
    ]):
        return "search"

    if any(word in task_lower for word in [
        "calculate",
        "cost",
        "price",
        "compute"
    ]):
        return "calculator"

    if any(word in task_lower for word in [
        "read",
        "summarize",
        "extract"
    ]):
        return "reader"

    if any(word in task_lower for word in [
        "verify",
        "check",
        "validate"
    ]):
        return "verifier"

    return "none"


if __name__ == "__main__":
    test_tasks = [
        "Research deployment options",
        "Calculate estimated costs",
        "Verify the information",
        "Generate the final plan"
    ]

    print("\nTOOL ROUTER TEST\n")

    for task in test_tasks:
        tool = select_tool(task)
        print(f"{task} → {tool}")
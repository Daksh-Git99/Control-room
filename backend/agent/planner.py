def create_plan(goal):
    tasks = [
        "Understand the requirements",
        "Research deployment options",
        "Compare the available options",
        "Calculate estimated costs",
        "Verify the information",
        "Generate the final deployment plan"
    ]

    return tasks


if __name__ == "__main__":
    goal = "Research and compare deployment options for my Python application"

    plan = create_plan(goal)

    print("\nCONTROL ROOM PLAN\n")

    for number, task in enumerate(plan, start=1):
        print(f"{number}. {task}")
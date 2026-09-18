from agent.planner import create_plan
from agent.executor import execute_plan


def run_control_room(goal):
    print("\n==============================")
    print("       CONTROL ROOM")
    print("==============================")

    print("\nGOAL:")
    print(goal)

    print("\nCreating plan...")

    tasks = create_plan(goal)

    print(f"\nPlan created with {len(tasks)} tasks.")

    print("\nStarting execution...")

    results = execute_plan(tasks)

    print("\n==============================")
    print("       FINAL STATUS")
    print("==============================")

    for result in results:
        print(f"✓ {result['task']}")

    return results


if __name__ == "__main__":
    goal = (
        "Research and compare deployment options for "
        "my Python application, calculate the estimated cost, "
        "verify the information, and create a deployment plan."
    )

    run_control_room(goal)
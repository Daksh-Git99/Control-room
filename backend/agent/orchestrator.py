from agent.planner import create_plan
from agent.tool_router import select_tool
from agent.executor import execute_plan
from tools.verifier import verify
from tools.recovery import recover


def run_control_room(goal):
    print("\n==============================")
    print("       CONTROL ROOM")
    print("==============================")

    print("\nGOAL:")
    print(goal)

    # 1. Planning
    print("\n[1] Creating plan...")

    tasks = create_plan(goal)

    print(f"Plan created with {len(tasks)} tasks.")

    # 2. Tool selection
    print("\n[2] Selecting tools...")

    tool_plan = []

    for task in tasks:
        tool = select_tool(task)

        tool_plan.append({
            "task": task,
            "tool": tool
        })

        print(f"  {task} → {tool}")

    # 3. Execution
    print("\n[3] Starting execution...")

    results = execute_plan(tasks)

    # 4. Verification
    print("\n[4] Verifying results...")

    verification_results = []

    for result in results:
        verification = verify(result["result"])

        verification_results.append({
            "task": result["task"],
            "verified": verification["verified"],
            "reason": verification["reason"]
        })

        if verification["verified"]:
            print(f"✓ {result['task']} → VERIFIED")
        else:
            print(f"⚠ {result['task']} → FAILED VERIFICATION")

    # 5. Recovery demonstration
    print("\n[5] Recovery system...")

    recovery_result = recover(
        "search",
        "Research deployment options"
    )

    print("\n==============================")
    print("       FINAL STATUS")
    print("==============================")

    for result in results:
        print(f"✓ {result['task']}")

    print("\nVerification:")
    print(verification_results)

    print("\nRecovery:")
    print(recovery_result)

    return {
        "goal": goal,
        "tasks": tasks,
        "tool_plan": tool_plan,
        "results": results,
        "verification": verification_results,
        "recovery": recovery_result
    }


if __name__ == "__main__":
    goal = (
        "Research and compare deployment options for "
        "my Python application, calculate the estimated cost, "
        "verify the information, and create a deployment plan."
    )

    run_control_room(goal)
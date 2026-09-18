from agent.planner import create_plan
from agent.executor import execute_plan
from tools.verifier import verify


def run_control_room(goal):

    print("\n==============================")
    print("       CONTROL ROOM")
    print("==============================")

    print("\nGOAL:")
    print(goal)

    # =========================
    # 1. AI PLANNING
    # =========================

    print("\n[1] AI PLANNER")

    plan = create_plan(goal)

    print(
        f"✓ Plan created with "
        f"{len(plan)} tasks."
    )

    for number, item in enumerate(plan, start=1):

        print(
            f"  {number}. "
            f"{item['task']} "
            f"→ {item['tool']}"
        )

    # =========================
    # 2. EXECUTION
    # =========================

    print("\n[2] TOOL EXECUTION")

    results = execute_plan(plan)

    # =========================
    # 3. VERIFICATION
    # =========================

    print("\n[3] VERIFICATION")

    verification_results = []

    for result in results:

        verification = verify(
            result["result"]
        )

        verification_results.append({
            "task": result["task"],
            "verified": verification["verified"],
            "reason": verification["reason"]
        })

        if verification["verified"]:

            print(
                f"✓ {result['task']} "
                f"→ VERIFIED"
            )

        else:

            print(
                f"⚠ {result['task']} "
                f"→ FAILED"
            )

    # =========================
    # 4. FINAL STATUS
    # =========================

    recovered_count = sum(
        1 for result in results
        if result.get("recovered")
    )

    verified_count = sum(
        1 for result in verification_results
        if result["verified"]
    )

    print("\n==============================")
    print("       FINAL STATUS")
    print("==============================")

    print(f"Tasks: {len(plan)}")
    print(f"Verified: {verified_count}")
    print(f"Recoveries: {recovered_count}")

    return {
        "goal": goal,
        "tasks": [
            item["task"]
            for item in plan
        ],
        "tool_plan": plan,
        "results": results,
        "verification": verification_results,
        "recovery": {
            "recovered": recovered_count > 0,
            "count": recovered_count
        }
    }


if __name__ == "__main__":

    goal = (
        "Research and compare deployment options "
        "for my Python application, calculate the "
        "estimated cost, verify the information, "
        "and create a deployment plan."
    )

    run_control_room(goal)
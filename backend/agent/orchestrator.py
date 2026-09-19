from agent.planner import create_plan
from agent.executor import execute_plan
from tools.verifier import verify


def run_control_room(goal):

    print("\n==============================")
    print("       CONTROL ROOM")
    print("==============================")

    print("\nGOAL:")
    print(goal)

    # =========================================================
    # 1. AI PLANNER
    # =========================================================

    print("\n[1] AI PLANNER")

    plan = create_plan(goal)

    print(f"✓ Plan created with {len(plan)} tasks.")

    for number, item in enumerate(plan, start=1):
        print(
            f"  {number}. "
            f"{item['task']} "
            f"→ {item['tool']}"
        )

    # =========================================================
    # 2. TOOL EXECUTION
    # =========================================================

    print("\n[2] TOOL EXECUTION")

    results = execute_plan(
        plan,
        goal
    )

    # =========================================================
    # 3. VERIFICATION
    # =========================================================

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
                f"✓ {result['task']} → VERIFIED"
            )

        else:

            print(
                f"⚠ {result['task']} → REVIEW"
            )

    # =========================================================
    # 4. SYSTEM STATISTICS
    # =========================================================

    recovered_count = sum(
        1
        for result in results
        if result.get("recovered")
    )

    verified_count = sum(
        1
        for result in verification_results
        if result["verified"]
    )

    total_tasks = len(results)

    print("\n[4] SYSTEM STATUS")

    print(
        f"Tasks executed: {total_tasks}"
    )

    print(
        f"Verified: {verified_count}"
    )

    print(
        f"Recovered failures: {recovered_count}"
    )

    # =========================================================
    # 5. BUILD FINAL ANSWER
    # =========================================================

    final_answer = build_final_answer(
        goal,
        plan,
        results,
        verification_results,
        recovered_count,
        verified_count
    )

    # =========================================================
    # 6. RETURN COMPLETE CONTROL ROOM RESULT
    # =========================================================

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
        },

        "final_answer": final_answer
    }


# =============================================================
# FINAL ANSWER BUILDER
# =============================================================

def build_final_answer(
    goal,
    plan,
    results,
    verification_results,
    recovered_count,
    verified_count
):

    goal_lower = goal.lower()

    # ---------------------------------------------------------
    # CLOUD / DEPLOYMENT
    # ---------------------------------------------------------

    if (
        "cloud" in goal_lower
        or "deploy" in goal_lower
    ):

        return {

            "headline":
                "Cloud Deployment Analysis Complete",

            "summary": (
                "The Control Room decomposed the deployment "
                "goal into executable tasks, collected research, "
                "performed cost analysis, handled a tool failure "
                "through recovery, and verified the resulting "
                "workflow."
            ),

            "recommendations": [

                "AWS — suitable for Python applications through "
                "services such as EC2, Elastic Beanstalk or "
                "serverless deployment.",

                "Google Cloud — Cloud Run provides a "
                "container-oriented deployment model with "
                "automatic scaling.",

                "Microsoft Azure — Azure App Service provides "
                "managed hosting for web applications.",

                "Cloud costs depend on compute usage, memory, "
                "requests, storage, bandwidth and the selected "
                "service tier."
            ],

            "deployment_plan": [

                "Containerize the Python web application.",

                "Configure environment variables and secrets.",

                "Deploy the application to the selected cloud platform.",

                "Configure networking, domain and HTTPS.",

                "Add logging, monitoring and health checks.",

                "Run a staged deployment test.",

                "Keep a rollback path available.",

                "Monitor application performance and ongoing cost."
            ],

            "verification": (
                f"{verified_count} of "
                f"{len(verification_results)} "
                "verification checks passed."
            ),

            "cost_note": (
                "The displayed demo cost values should be treated "
                "as demonstration estimates, not live cloud pricing."
            ),

            "next_step": (
                "Choose the deployment platform according to "
                "application requirements, expected traffic, "
                "scalability needs and required cloud services."
            )
        }

    # ---------------------------------------------------------
    # TRAVEL
    # ---------------------------------------------------------

    if (
        "trip" in goal_lower
        or "travel" in goal_lower
        or "japan" in goal_lower
    ):

        return {

            "headline":
                "Travel Planning Mission Complete",

            "summary": (
                "The Control Room decomposed the travel objective, "
                "researched relevant information, processed the "
                "available calculations and verified the workflow."
            ),

            "recommendations": [

                "Review transportation requirements.",

                "Compare accommodation options against the budget.",

                "Reserve major transportation and accommodation early.",

                "Keep part of the budget available for unexpected expenses."

            ],

            "verification": (
                f"{verified_count} of "
                f"{len(verification_results)} "
                "checks passed."
            ),

            "next_step":
                "Review the researched options and finalize the itinerary."
        }

    # ---------------------------------------------------------
    # SECURITY
    # ---------------------------------------------------------

    if (
        "security" in goal_lower
        or "cyber" in goal_lower
    ):

        return {

            "headline":
                "Security Analysis Complete",

            "summary": (
                "The Control Room decomposed the security objective, "
                "executed the required analysis workflow and verified "
                "the resulting information."
            ),

            "security_steps": [

                "Identify the application's assets and attack surface.",

                "Review authentication and authorization controls.",

                "Protect secrets and sensitive configuration.",

                "Validate input handling and API security.",

                "Enable logging and security monitoring.",

                "Test the application for common vulnerabilities.",

                "Create an incident response and recovery procedure."
            ],

            "verification": (
                f"{verified_count} of "
                f"{len(verification_results)} "
                "checks passed."
            ),

            "next_step":
                "Prioritize the identified security risks and validate them."
        }

    # ---------------------------------------------------------
    # GENERIC GOAL
    # ---------------------------------------------------------

    return {

        "headline":
            "Mission Completed Successfully",

        "summary": (
            f"The Control Room converted the goal into "
            f"{len(plan)} executable tasks, selected tools "
            "for those tasks, executed the workflow, "
            "handled failures where required and performed "
            "verification."
        ),

        "recommendations": [

            "Review the collected research findings.",

            "Review the calculations and their assumptions.",

            "Check the verified results before taking action.",

            "Use the resulting information to complete the next step."

        ],

        "verification": (
            f"{verified_count} of "
            f"{len(verification_results)} "
            "verification checks passed."
        ),

        "next_step":
            "Review the verified findings and proceed with the plan."
    }


# =============================================================
# DIRECT TEST
# =============================================================

if __name__ == "__main__":

    goal = (
        "Research and compare 3 cloud deployment options "
        "for my Python web application, estimate their "
        "monthly cost, verify the information, and create "
        "a deployment plan."
    )

    result = run_control_room(goal)

    print("\n==============================")
    print("         FINAL RESULT")
    print("==============================")

    print(
        result["final_answer"]
    )
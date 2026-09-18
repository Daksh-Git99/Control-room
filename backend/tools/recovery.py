def recover(tool_name, task):
    print(f"\n⚠ TOOL FAILURE")
    print(f"Failed tool: {tool_name}")
    print(f"Failed task: {task}")

    print("\n↻ RECOVERY INITIATED")
    print("Analyzing available alternatives...")

    if tool_name == "search":
        alternative_tool = "fallback_search"

    elif tool_name == "calculator":
        alternative_tool = "manual_calculation"

    else:
        alternative_tool = "fallback"

    print(f"✓ Alternative selected: {alternative_tool}")

    return {
        "recovered": True,
        "original_tool": tool_name,
        "alternative_tool": alternative_tool
    }


if __name__ == "__main__":
    result = recover(
        "search",
        "Research deployment options"
    )

    print("\nRECOVERY RESULT")
    print(result)
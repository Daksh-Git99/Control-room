def recover(tool_name, task):
    print(f"\n⚠ Tool failure detected: {tool_name}")
    print("↻ Recovery initiated")
    print(f"Selecting alternative for: {task}")

    if tool_name == "search":
        alternative_tool = "reader"

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

    print("\nRECOVERY RESULT\n")
    print(result)
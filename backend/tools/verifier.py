def verify(result):
    if result is None:
        return {
            "verified": False,
            "reason": "No result returned"
        }

    if isinstance(result, str) and result.startswith("Calculation error"):
        return {
            "verified": False,
            "reason": "Calculation failed"
        }

    if isinstance(result, list) and len(result) == 0:
        return {
            "verified": False,
            "reason": "No search results returned"
        }

    return {
        "verified": True,
        "reason": "Result passed basic verification"
    }


if __name__ == "__main__":
    test_result = [
        {
            "title": "Example result",
            "source": "Example source"
        }
    ]

    verification = verify(test_result)

    print("\nVERIFICATION RESULT\n")
    print(verification)
def calculate(expression):
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return result
    except Exception as error:
        return f"Calculation error: {error}"


if __name__ == "__main__":
    expressions = [
        "12 * 5 + 20",
        "50 + 25 + 10",
        "100 * 0.2"
    ]

    for expression in expressions:
        result = calculate(expression)

        print(f"{expression} = {result}")
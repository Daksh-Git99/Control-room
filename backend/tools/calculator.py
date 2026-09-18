def calculate(expression):
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return result
    except Exception as error:
        return f"Calculation error: {error}"


if __name__ == "__main__":
    expression = "12 * 5 + 20"

    result = calculate(expression)

    print(f"Expression: {expression}")
    print(f"Result: {result}")
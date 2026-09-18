DEMO_MODE = True
failure_triggered = False


def search(query):
    global failure_triggered

    print(f"Searching for: {query}")

    # Controlled failure for the hackathon demo
    if DEMO_MODE and not failure_triggered:
        failure_triggered = True
        raise RuntimeError("Primary search tool unavailable")

    results = [
        {
            "title": "AWS Deployment Options",
            "source": "AWS",
            "snippet": "Cloud deployment options for Python applications."
        },
        {
            "title": "Azure App Services",
            "source": "Microsoft Azure",
            "snippet": "Managed hosting options for web applications."
        }
    ]

    return results


def fallback_search(query):
    print(f"Fallback search activated for: {query}")

    results = [
        {
            "title": "Fallback Cloud Deployment Result",
            "source": "Fallback Source",
            "snippet": "Alternative source successfully retrieved deployment information."
        }
    ]

    return results


if __name__ == "__main__":
    query = "Python cloud deployment options"

    try:
        results = search(query)
    except Exception as error:
        print(f"Primary search failed: {error}")
        results = fallback_search(query)

    print("\nSEARCH RESULTS\n")

    for result in results:
        print(f"Title: {result['title']}")
        print(f"Source: {result['source']}")
        print(f"Info: {result['snippet']}")
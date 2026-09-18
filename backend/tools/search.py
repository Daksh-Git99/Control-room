def search(query):
    print(f"Searching for: {query}")

    results = [
        {
            "title": "Example Result 1",
            "source": "Example Source",
            "snippet": "Information found for the search query."
        },
        {
            "title": "Example Result 2",
            "source": "Example Source",
            "snippet": "Another piece of information related to the query."
        }
    ]

    return results


if __name__ == "__main__":
    query = "Python cloud deployment options"

    results = search(query)

    print("\nSEARCH RESULTS\n")

    for result in results:
        print(f"Title: {result['title']}")
        print(f"Source: {result['source']}")
        print(f"Info: {result['snippet']}")
        print()
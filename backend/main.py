from fastapi import FastAPI

app = FastAPI(title="Control Room")


@app.get("/")
def home():
    return {
        "status": "Control Room Online"
    }
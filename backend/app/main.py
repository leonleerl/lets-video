from fastapi import FastAPI

app = FastAPI(title="LetsVideo AI Agent")

@app.get("/")
def health_check():
    return {"message": "LetsVideo AI Agent backend is running"}
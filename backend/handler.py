from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(title="Shakira Dev Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://dev.shakira.dev", "https://shakira.dev", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Shakira Dev Portfolio API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

handler = Mangum(app)
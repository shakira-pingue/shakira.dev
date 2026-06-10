from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(prefix="/tracks", tags=["tracks"])

TRACKS = [
    {
        "id": "folded",
        "title": "Folded",
        "artist": "Kehlani",
        "audioUrl": f"{settings.MEDIA_BASE_URL}/audio/folded.mp3",
        "analysisUrl": f"{settings.MEDIA_BASE_URL}/analysis/folded.json",
    },
    {
        "id": "jolene",
        "title": "Joleene",
        "artist": "Kes",
        "audioUrl": f"{settings.MEDIA_BASE_URL}/audio/jolene.mp3",
        "analysisUrl": f"{settings.MEDIA_BASE_URL}/analysis/jolene.json",
    },
    {
        "id": "who-say",
        "title": "Who Say",
        "artist": "Beres Hammond",
        "audioUrl": f"{settings.MEDIA_BASE_URL}/audio/who-say.mp3",
        "analysisUrl": f"{settings.MEDIA_BASE_URL}/analysis/who-say.json",
    },
]

@router.get("/", response_model=list[dict])
def get_tracks():
    return TRACKS
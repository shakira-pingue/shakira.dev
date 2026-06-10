import librosa
import numpy as np
import json
import sys
import os

def analyse_track(
    file_path: str,
    track_id: str,
    title: str,
    artist: str,
    tempo_correction: float | None = None,
) -> dict:
    print(f"Analysing {title} by {artist}...")

    y, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)

    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr).tolist()

    tempo_value = float(np.asarray(tempo).item())
    if tempo_correction:
        tempo_value = tempo_value * tempo_correction
        beat_times = beat_times[::2]  # take every other beat

    hop_length = 512
    stft = np.abs(librosa.stft(y, hop_length=hop_length))

    n_bands = 16
    freq_bands = []
    band_size = stft.shape[0] // n_bands

    times = librosa.frames_to_time(
        np.arange(stft.shape[1]), sr=sr, hop_length=hop_length
    ).tolist()

    for i in range(n_bands):
        band = stft[i * band_size:(i + 1) * band_size, :]
        energy = np.mean(band, axis=0)
        max_e = energy.max()
        if max_e > 0:
            energy = energy / max_e
        freq_bands.append(energy.tolist())

    rms = librosa.feature.rms(y=y, hop_length=hop_length)[0]
    rms_normalised = (rms / rms.max()).tolist()

    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop_length)
    onset_normalised = (onset_env / onset_env.max()).tolist()

    return {
        "id": track_id,
        "title": title,
        "artist": artist,
        "duration": duration,
        "tempo": tempo_value,
        "beat_times": beat_times,
        "times": times,
        "freq_bands": freq_bands,
        "rms": rms_normalised,
        "onset": onset_normalised,
    }


if __name__ == "__main__":
    tracks = [
        {
            "file": "scripts/audio/folded.mp3",
            "id": "folded",
            "title": "Folded",
            "artist": "Kehlani",
            "tempo_correction": None,
        },
        {
            "file": "scripts/audio/jolene.mp3",
            "id": "jolene",
            "title": "Joleene",
            "artist": "Kes",
            "tempo_correction": None,
        },
        {
            "file": "scripts/audio/who-say.mp3",
            "id": "who-say",
            "title": "Who Say",
            "artist": "Beres Hammond",
            "tempo_correction": 0.5,
        },
    ]

    os.makedirs("scripts/output", exist_ok=True)

    for track in tracks:
        if not os.path.exists(track["file"]):
            print(f"File not found: {track['file']}")
            continue

        result = analyse_track(
            track["file"],
            track["id"],
            track["title"],
            track["artist"],
            track.get("tempo_correction"),
        )

        output_path = f"scripts/output/{track['id']}.json"
        with open(output_path, "w") as f:
            json.dump(result, f)

        print(f"Saved analysis to {output_path}")
        print(f"  Tempo: {result['tempo']:.1f} BPM")
        print(f"  Beats: {len(result['beat_times'])}")
        print(f"  Duration: {result['duration']:.1f}s")
import json
import re
from difflib import SequenceMatcher
from pathlib import Path

from faster_whisper import WhisperModel


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
AUDIO_PATH = REPO_DIR / "public" / "venus-waktu" / "narasi.mp3"
SCRIPT_PATH = PROJECT_DIR / "naskah.txt"
OUTPUT_PATH = PROJECT_DIR / "vo" / "kata.json"


def normalize(text: str) -> list[str]:
    return re.findall(r"\w+", text.lower())


def script_words(text: str) -> list[str]:
    return re.findall(r"\w+(?:['’-]\w+)*[.,!?;:]?", text, re.UNICODE)


def main() -> None:
    if not AUDIO_PATH.is_file():
        raise FileNotFoundError(f"VO audio not found: {AUDIO_PATH}")

    script = SCRIPT_PATH.read_text(encoding="utf-8").strip()
    model = WhisperModel("base", device="cpu", compute_type="int8", local_files_only=True)
    segments, info = model.transcribe(
        str(AUDIO_PATH),
        language="id",
        word_timestamps=True,
        vad_filter=True,
        initial_prompt=script,
    )

    words = [
        [round(word.start, 3), round(word.end, 3), word.word.strip()]
        for segment in segments
        for word in (segment.words or [])
        if word.word.strip()
    ]
    if not words:
        raise RuntimeError("Transcription returned no word timestamps; kata.json was not changed.")

    expected_display = script_words(script)
    expected = [normalize(word)[0] for word in expected_display]
    recognized = normalize(" ".join(word[2] for word in words))
    matcher = SequenceMatcher(None, expected, recognized, autojunk=False)
    aligned: list[list[float | str]] = []
    review_notes: list[str] = []

    for operation, expected_start, expected_end, heard_start, heard_end in matcher.get_opcodes():
        if operation == "equal":
            aligned.extend(
                [word[0], word[1], expected_display[expected_start + offset]]
                for offset, word in enumerate(words[heard_start:heard_end])
            )
        elif operation == "insert":
            extras = ", ".join(
                f"{words[index][2]!r} at {words[index][0]:.2f}s"
                for index in range(heard_start, heard_end)
            )
            review_notes.append(f"ignored words not in the script: {extras}")
        elif operation == "delete":
            missing = " ".join(expected[expected_start:expected_end])
            review_notes.append(f"script words not recognized: {missing!r}")
        else:
            heard_count = heard_end - heard_start
            expected_count = expected_end - expected_start
            if heard_count == expected_count:
                for offset in range(heard_count):
                    start, end, _ = words[heard_start + offset]
                    aligned.append([start, end, expected_display[expected_start + offset]])
                review_notes.append(
                    f"used script spelling for {heard_count} recognized word(s): "
                    f"{' '.join(expected[expected_start:expected_end])!r}"
                )
            else:
                aligned.extend(words[heard_start:heard_start + min(heard_count, expected_count)])
                review_notes.append(
                    f"check transcript around {' '.join(expected[expected_start:expected_end])!r}"
                )

    if not aligned:
        raise RuntimeError("Transcript could not be aligned to the script; kata.json was not changed.")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(aligned, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Language: {info.language}; audio duration: {info.duration:.2f}s")
    print(f"Saved {len(aligned)} script-aligned timestamped words to {OUTPUT_PATH}")
    for note in review_notes:
        print(f"Review: {note}")


if __name__ == "__main__":
    main()

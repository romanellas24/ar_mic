import subprocess
from pathlib import Path

def run_cmd(cmd: list):
    """Run a shell command and print it nicely."""
    print("Running:", " ".join(cmd))
    subprocess.run(cmd, check=True)


def mov_to_webm_with_alpha(input_path: Path):
    output_path = input_path.with_suffix(".webm")
    cmd = [
        "ffmpeg", "-i", str(input_path),
        "-c:v", "libvpx-vp9",
        "-b:v", "0",
        "-crf", "32",
        "-pix_fmt", "yuva420p",
        "-row-mt", "1",
        "-deadline", "good",
        "-threads", "4",
        str(output_path)
    ]
    run_cmd(cmd)
    return output_path


def remove_audio(input_path: Path):
    output_path = input_path.with_name(input_path.stem + "_noaudio" + input_path.suffix)
    cmd = [
        "ffmpeg", "-i", str(input_path),
        "-c", "copy",
        "-an",
        str(output_path)
    ]
    run_cmd(cmd)
    return output_path


def extract_audio_mp3(input_path: Path):
    output_path = input_path.with_suffix(".mp3")
    cmd = [
        "ffmpeg", "-i", str(input_path),
        "-vn",
        "-acodec", "mp3",
        str(output_path)
    ]
    run_cmd(cmd)
    return output_path


if __name__ == "__main__":
    user_input = input("Enter the path to the input .mov file: ").strip()
    input_path = Path(user_input)

    if not input_path.exists():
        print("Error: File not found.")
        exit(1)

    print("\n--- Starting conversion pipeline ---\n")

    webm_file = mov_to_webm_with_alpha(input_path)
    no_audio_file = remove_audio(input_path)
    audio_file = extract_audio_mp3(input_path)

    print("\n--- Done! ---")
    print("WEBM with alpha:", webm_file)
    print("Video without audio:", no_audio_file)
    print("Extracted audio:", audio_file)

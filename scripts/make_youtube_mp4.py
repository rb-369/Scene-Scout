import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using ffmpeg: {ffmpeg_exe}")

video_input = r"public/scenescout_live_demo.webp"
audio_input = r"public/voiceover_3min.mp3"
output_mp4 = r"scenescout_demo_video.mp4"
output_public = r"public/scenescout_demo_video.mp4"
desktop_mp4 = os.path.expanduser(r"~\Desktop\scenescout_demo_video.mp4")

# Check if video and audio exist
print(f"Video exists: {os.path.exists(video_input)} ({os.path.getsize(video_input)} bytes)")
print(f"Audio exists: {os.path.exists(audio_input)} ({os.path.getsize(audio_input)} bytes)")

# We want YouTube compatibility:
# - Video: H.264 (yuv420p)
# - Audio: AAC (192kbps)
# - Loop the video or stretch video duration to match audio if audio is longer, using stream_loop or tpad or loop
cmd = [
    ffmpeg_exe,
    "-y",
    "-stream_loop", "-1",
    "-i", video_input,
    "-i", audio_input,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    "-movflags", "+faststart",
    output_mp4
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
if res.returncode != 0:
    print("Error output:", res.stderr[-1000:])
else:
    print(f"Success! Output generated: {output_mp4} ({os.path.getsize(output_mp4)} bytes)")
    import shutil
    try:
        shutil.copyfile(output_mp4, output_public)
        print(f"Copied to {output_public}")
    except Exception as e:
        print(f"Copy public error: {e}")
    try:
        shutil.copyfile(output_mp4, desktop_mp4)
        print(f"Copied to Desktop: {desktop_mp4}")
    except Exception as e:
        print(f"Copy desktop error: {e}")

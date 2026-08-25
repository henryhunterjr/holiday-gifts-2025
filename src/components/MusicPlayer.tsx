import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

const VIDEO_ID = "N91_IHbofhs";
const YT_ORIGIN = "https://www.youtube.com";

/**
 * Optional background holiday music. The YouTube iframe stays mounted once the
 * visitor starts it so play/pause, volume, and mute all run through the IFrame
 * API over postMessage instead of remounting (which would restart the track).
 */
export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(35);
  const [muted, setMuted] = useState(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  const send = (func: string, args: unknown[] = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      YT_ORIGIN,
    );
  };

  // Push volume/mute state to the player whenever it changes.
  useEffect(() => {
    if (!started) return;
    send("setVolume", [volume]);
    send(muted || volume === 0 ? "mute" : "unMute");
  }, [volume, muted, started]);

  const togglePlay = () => {
    if (!started) {
      setStarted(true);
      setPlaying(true);
      return;
    }
    if (playing) {
      send("pauseVideo");
      setPlaying(false);
    } else {
      send("playVideo");
      setPlaying(true);
    }
  };

  const effectivelyMuted = muted || volume === 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Background music controls"
        className={`inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
          playing ? "border-honey bg-honey/20 text-honey" : "border-honey/40 hover:bg-flour/10"
        }`}
      >
        <Music className="h-3 w-3" aria-hidden />
        <span>🎄 Music</span>
      </button>

      {open && (
        <div
          role="group"
          aria-label="Music player"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[240px] rounded-xl border border-honey/30 bg-oven p-3 text-flour shadow-xl"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause music" : "Play music"}
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-honey/50 bg-honey/15 text-honey transition-colors hover:bg-honey/30"
            >
              {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-pressed={effectivelyMuted}
              aria-label={effectivelyMuted ? "Unmute music" : "Mute music"}
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-flour/25 text-flour transition-colors hover:bg-flour/10"
            >
              {effectivelyMuted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
            </button>
            <div className="min-w-0 flex-1">
              <label htmlFor="music-volume" className="block text-[.68rem] uppercase tracking-wide text-honey/80">
                Volume
              </label>
              <input
                id="music-volume"
                type="range"
                min={0}
                max={100}
                step={5}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setMuted(false);
                  setVolume(Number(e.target.value));
                }}
                className="mt-1 h-2 w-full cursor-pointer accent-[hsl(var(--honey))]"
              />
            </div>
          </div>
          <p className="mt-2 text-[.72rem] leading-snug text-flour/70">
            Holiday piano, off by default. Shop in silence if you'd rather.
          </p>
        </div>
      )}

      {started && (
        <iframe
          ref={frameRef}
          title="Background holiday music"
          src={`${YT_ORIGIN}/embed/${VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0`}
          allow="autoplay"
          aria-hidden="true"
          tabIndex={-1}
          style={{ position: "fixed", left: -9999, top: -9999, width: 1, height: 1, border: 0, pointerEvents: "none" }}
        />
      )}
    </div>
  );
}

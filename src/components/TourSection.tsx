import React, { useState, useRef, useEffect } from 'react';
import { useCafe } from '../context/CafeContext';
import { TOUR_CHAPTERS } from '../data/initialData';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Waves,
  MapPin,
  Upload,
  Smartphone,
  Monitor,
  Maximize2,
  Minimize2,
  Music,
  VolumeX,
  Sparkles,
  Compass,
} from 'lucide-react';

// Self-contained acoustic beach audio engine (zero external dependencies)
class InbuiltBeachAudio {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private volume = 0.35;

  private chordProgression = [
    { notes: [146.83, 220.0, 277.18, 329.63, 370.0, 440.0] },
    { notes: [196.0, 246.94, 293.66, 370.0, 392.0, 493.88] },
    { notes: [123.47, 185.0, 220.0, 277.18, 370.0, 440.0] },
    { notes: [110.0, 164.81, 220.0, 277.18, 329.63, 440.0] },
  ];
  private melodyNotes = [
    [370.0, 440.0, 329.63, 370.0, 440.0, 554.37],
    [392.0, 370.0, 293.66, 370.0, 493.88, 392.0],
    [370.0, 329.63, 277.18, 370.0, 440.0, 370.0],
    [329.63, 277.18, 329.63, 440.0, 370.0, 329.63],
  ];
  private currentChordIdx = 0;
  private noteStep = 0;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private pluckString(freq: number, time: number, duration: number, velocity = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 3.5, 3200), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.2, 350), time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.25, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(velocity * 0.08, time + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  public play() {
    if (this.isPlaying) return;
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = this.chordProgression[this.currentChordIdx];
      const melody = this.melodyNotes[this.currentChordIdx];

      const noteFreq = chord.notes[this.noteStep % chord.notes.length];
      const melFreq = melody[this.noteStep % melody.length];

      this.pluckString(noteFreq, now, 1.8, 0.4);
      if (this.noteStep % 2 === 0) {
        this.pluckString(melFreq, now + 0.18, 2.0, 0.3);
      }
      this.noteStep++;
      if (this.noteStep >= 6) {
        this.noteStep = 0;
        this.currentChordIdx = (this.currentChordIdx + 1) % this.chordProgression.length;
      }
      this.timerId = window.setTimeout(tick, 480);
    };
    tick();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }
}

const pleasantBeachMusic = new InbuiltBeachAudio();

export const TourSection: React.FC = () => {
  const { setIsTourModalOpen, setActiveTab } = useCafe();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Orientation and screen mode
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('horizontal');
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');

  // Background music
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.35);

  // Custom user video
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeChapter = TOUR_CHAPTERS[activeChapterIndex] || TOUR_CHAPTERS[0];
  const videoSource =
    customVideoUrl ||
    (orientation === 'vertical' && activeChapter.verticalVideoUrl
      ? activeChapter.verticalVideoUrl
      : activeChapter.videoUrl);

  // Video and pleasant music synchronization
  useEffect(() => {
    if (isPlaying) {
      if (isMusicEnabled) {
        pleasantBeachMusic.setVolume(musicVolume);
        pleasantBeachMusic.setMuted(false);
        pleasantBeachMusic.play();
      } else {
        pleasantBeachMusic.setMuted(true);
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      pleasantBeachMusic.pause();
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      pleasantBeachMusic.pause();
    };
  }, [isPlaying, isMusicEnabled, videoSource]);

  // Handle timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => (prev >= 45 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlayPause = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      if (isMusicEnabled) pleasantBeachMusic.play();
      if (videoRef.current) videoRef.current.play().catch(() => {});
    } else {
      pleasantBeachMusic.pause();
      if (videoRef.current) videoRef.current.pause();
    }
  };

  const toggleMusic = () => {
    const next = !isMusicEnabled;
    setIsMusicEnabled(next);
    pleasantBeachMusic.setMuted(!next);
    if (next && isPlaying) {
      pleasantBeachMusic.play();
    }
  };

  const handleRotate = () => {
    setRotationDegrees((prev) => (prev + 90) % 360);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#FCE7F3] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold uppercase tracking-wider">
              <Waves className="w-4 h-4 text-teal-700" />
              <span>Virtual Tour Experience</span>
              <span>·</span>
              <span className="text-amber-700">Anjuna Beach, Goa</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              Swaishma Café Video Tour
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
              Experience our beachfront patio, artisan coffee roastery, and panoramic Arabian Sea views.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen Cinema View</span>
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-slate-800 font-semibold text-xs sm:text-sm shadow-xs hover:bg-stone-50 transition-colors"
            >
              <span>Explore Food Menu</span>
            </button>
          </div>
        </div>

        {/* In-Page High-Definition Video Player Box */}
        <div className="bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
          {/* Top Video Toolbar */}
          <div className="px-4 sm:px-6 py-3 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-serif font-bold">
                {activeChapter.title}
              </span>
              <span className="text-stone-500 text-xs hidden sm:inline">·</span>
              <span className="text-stone-400 text-xs hidden sm:inline">{activeChapter.tagline}</span>
            </div>

            {/* Quick Controls: Orientation + Music + Rotate + Upload */}
            <div className="flex items-center gap-2">
              {/* Orientation Toggle */}
              <div className="flex items-center bg-stone-800 rounded-xl p-0.5 border border-stone-700">
                <button
                  onClick={() => setOrientation('horizontal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    orientation === 'horizontal'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title="Landscape (16:9)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Landscape</span>
                </button>
                <button
                  onClick={() => setOrientation('vertical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    orientation === 'vertical'
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-stone-300 hover:text-white'
                  }`}
                  title="Portrait (9:16)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Portrait</span>
                </button>
              </div>

              {/* Rotate 90° */}
              <button
                onClick={handleRotate}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 border transition-all ${
                  rotationDegrees !== 0
                    ? 'bg-teal-600 text-white border-teal-500'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                }`}
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5 text-teal-300" />
                <span className="text-[11px] font-semibold">
                  {rotationDegrees === 0 ? 'Rotate' : `${rotationDegrees}°`}
                </span>
              </button>

              {/* Background Music Toggle */}
              <div className="flex items-center gap-1.5 bg-stone-800 rounded-xl p-1 border border-stone-700">
                <button
                  onClick={toggleMusic}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                    isMusicEnabled
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Pleasant Background Music"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Music</span>
                  {isMusicEnabled ? (
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-2 bg-stone-950 animate-bounce" />
                      <span className="w-1 h-3 bg-stone-950 animate-bounce [animation-delay:0.15s]" />
                    </span>
                  ) : (
                    <VolumeX className="w-3 h-3 ml-0.5 text-stone-400" />
                  )}
                </button>

                {isMusicEnabled && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-14 accent-amber-400 cursor-pointer h-1 hidden md:inline"
                    title="Music Volume"
                  />
                )}
              </div>

              {/* Upload Video */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoUpload}
                accept="video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1 text-xs border border-stone-700/60"
                title="Upload custom video"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden xl:inline text-[11px]">Upload</span>
              </button>
            </div>
          </div>

          {/* Video Frame */}
          <div
            className={`relative w-full bg-stone-950 overflow-hidden flex items-center justify-center group ${
              orientation === 'vertical'
                ? 'h-[520px] sm:h-[620px]'
                : 'h-[380px] sm:h-[500px] lg:h-[580px]'
            }`}
          >
            {videoSource && (
              <video
                ref={videoRef}
                key={`${videoSource}-${orientation}`}
                src={videoSource}
                poster={activeChapter.thumbnail}
                autoPlay
                loop
                playsInline
                muted
                className={`relative z-10 transition-all duration-300 ${
                  fitMode === 'cover' ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'
                }`}
                style={{
                  transform: `rotate(${rotationDegrees}deg)`,
                }}
              />
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Big Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/30 shadow-2xl"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              )}
            </button>

            {/* Top Badge */}
            <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 border border-stone-700/70 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-stone-200 font-semibold truncate">
                  Anjuna Beach Coastline, Goa
                </span>
              </div>

              <button
                onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-stone-200 text-xs font-medium border border-stone-700 shadow-lg flex items-center gap-1.5 transition-colors"
                title="Toggle Fill vs Fit"
              >
                {fitMode === 'cover' ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Fit Frame</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Fill Screen</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Scrubber */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-2.5 z-30">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(Math.floor(pos * 45));
                  if (videoRef.current) {
                    videoRef.current.currentTime = pos * 45;
                  }
                }}
                className="w-full bg-stone-700/80 h-2 rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
              >
                <div
                  className="bg-gradient-to-r from-teal-400 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / 45) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-300 pt-0.5">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlayPause} className="hover:text-white transition-colors">
                    {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      if (videoRef.current) videoRef.current.currentTime = 0;
                    }}
                    className="hover:text-white transition-colors"
                    title="Replay"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="tabular-nums font-mono text-xs">
                    0:{currentTime < 10 ? `0${currentTime}` : currentTime} / 0:45
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTourModalOpen(true)}
                    className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Open Cinema View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Selector Grid */}
          <div className="p-4 sm:p-6 bg-stone-900 border-t border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Select Chapter:</span>
              <span className="text-teal-400 font-medium">Anjuna Beach, Goa</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TOUR_CHAPTERS.map((ch, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setCurrentTime(0);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? 'bg-teal-950/90 border-teal-500 text-white shadow-lg ring-1 ring-teal-500/50'
                        : 'bg-stone-800/70 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] text-teal-400 font-bold block uppercase tracking-wider">
                      Part 0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold block truncate mt-0.5">
                      {ch.title}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate mt-0.5">
                      {ch.duration} · {ch.highlight}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useCafe } from '../context/CafeContext';
import { TOUR_CHAPTERS } from '../data/initialData';
import {
  X,
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
  Volume2,
  VolumeX,
  Music,
  Expand,
  Shrink,
} from 'lucide-react';

// Self-contained acoustic beach audio engine (zero external dependencies)
class InbuiltBeachAudioModal {
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

const pleasantBeachMusic = new InbuiltBeachAudioModal();

export const CafeTourModal: React.FC = () => {
  const { isTourModalOpen, setIsTourModalOpen, setActiveTab } = useCafe();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Screen size controls: 'standard' | 'large' | 'cinema'
  const [screenSize, setScreenSize] = useState<'standard' | 'large' | 'cinema'>('large');

  // Video orientation & rotation controls
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('horizontal');
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');

  // Pleasant background music controls
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.35);

  // Custom user uploaded video support
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeChapter = TOUR_CHAPTERS[activeChapterIndex] || TOUR_CHAPTERS[0];
  const videoSource =
    customVideoUrl ||
    (orientation === 'vertical' && activeChapter.verticalVideoUrl
      ? activeChapter.verticalVideoUrl
      : activeChapter.videoUrl);

  // Play/pause and pleasant background music synchronization
  useEffect(() => {
    if (!isTourModalOpen) {
      pleasantBeachMusic.pause();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

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
  }, [isTourModalOpen, isPlaying, isMusicEnabled, videoSource]);

  // Handle music volume change
  useEffect(() => {
    pleasantBeachMusic.setVolume(musicVolume);
  }, [musicVolume]);

  // Video progress timer
  useEffect(() => {
    if (!isTourModalOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 45) return 0;
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTourModalOpen, isPlaying]);

  // Handle Video File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

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

  if (!isTourModalOpen) return null;

  // Determine modal width based on screen size setting
  const getModalContainerClasses = () => {
    if (screenSize === 'cinema') {
      return 'w-full h-full max-w-none max-h-none rounded-none border-none';
    }
    if (screenSize === 'large') {
      return 'w-[98vw] max-w-7xl rounded-3xl border border-stone-800 shadow-2xl';
    }
    return 'w-[95vw] max-w-5xl rounded-3xl border border-stone-800 shadow-2xl';
  };

  // Determine video height based on screen size setting and orientation
  const getVideoHeightClasses = () => {
    if (screenSize === 'cinema') {
      return orientation === 'vertical' ? 'h-[78vh]' : 'h-[78vh]';
    }
    if (screenSize === 'large') {
      return orientation === 'vertical'
        ? 'h-[580px] sm:h-[660px] lg:h-[720px] max-h-[72vh]'
        : 'h-[440px] sm:h-[560px] lg:h-[640px] max-h-[72vh]';
    }
    return orientation === 'vertical'
      ? 'h-[480px] sm:h-[540px] max-h-[62vh]'
      : 'h-[360px] sm:h-[460px] max-h-[62vh]';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200 ${
        screenSize === 'cinema' ? 'p-0' : 'p-1 sm:p-3 md:p-5'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-stone-950 overflow-hidden flex flex-col transition-all duration-300 ${getModalContainerClasses()}`}
      >
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-inner">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif flex items-center gap-2">
                <span>Swaishma Café · Goa Beach Tour</span>
                <span className="text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-teal-900/90 text-teal-300 border border-teal-700/60">
                  Anjuna Beach, Goa
                </span>
              </h2>
              <p className="text-[11px] text-stone-400 font-medium flex items-center gap-2">
                <span>{activeChapter.title}</span>
                <span className="text-stone-600">·</span>
                <span className="text-teal-400">{activeChapter.tagline}</span>
              </p>
            </div>
          </div>

          {/* Quick Controls Bar: Screen Size + Orientation + Music + Rotate */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Screen Size Switcher (Mothi Screen / Big Screen) */}
            <div className="flex items-center bg-stone-800/90 rounded-xl p-0.5 border border-stone-700">
              <button
                onClick={() => setScreenSize('standard')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  screenSize === 'standard'
                    ? 'bg-stone-700 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Standard Screen Size"
              >
                Normal
              </button>
              <button
                onClick={() => setScreenSize('large')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  screenSize === 'large'
                    ? 'bg-teal-700 text-white shadow-sm font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Large Expansive Screen (मोठी स्क्रीन)"
              >
                <Expand className="w-3.5 h-3.5 text-teal-300" />
                <span>Large (मोठी)</span>
              </button>
              <button
                onClick={() => setScreenSize(screenSize === 'cinema' ? 'large' : 'cinema')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  screenSize === 'cinema'
                    ? 'bg-amber-600 text-white shadow-sm font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Full Screen Cinema Mode"
              >
                {screenSize === 'cinema' ? <Shrink className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-300" />}
                <span className="hidden sm:inline">{screenSize === 'cinema' ? 'Exit Full' : 'Full Screen'}</span>
              </button>
            </div>

            {/* Toggle Straight (Portrait 9:16) vs Landscape (16:9) */}
            <div className="flex items-center bg-stone-800/90 rounded-xl p-0.5 border border-stone-700">
              <button
                onClick={() => setOrientation('horizontal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  orientation === 'horizontal'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Landscape Wide Screen (16:9)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Landscape</span>
              </button>
              <button
                onClick={() => setOrientation('vertical')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  orientation === 'vertical'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Straight / Vertical Portrait (9:16)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portrait</span>
              </button>
            </div>

            {/* Rotate Button */}
            <button
              onClick={handleRotate}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 border transition-all ${
                rotationDegrees !== 0
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:bg-stone-700'
              }`}
              title="Rotate 90° to straighten video"
            >
              <RotateCw className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-[11px] font-semibold">
                {rotationDegrees === 0 ? 'Rotate' : `${rotationDegrees}°`}
              </span>
            </button>

            {/* Pleasant Background Music Bar */}
            <div className="flex items-center gap-1.5 bg-stone-800/90 rounded-xl p-1 border border-stone-700">
              <button
                onClick={toggleMusic}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  isMusicEnabled
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={isMusicEnabled ? 'Mute Background Music' : 'Play Background Music'}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Music</span>
                {isMusicEnabled ? (
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-2.5 bg-stone-950 animate-bounce" />
                    <span className="w-1 h-3.5 bg-stone-950 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-stone-950 animate-bounce [animation-delay:0.3s]" />
                  </span>
                ) : (
                  <VolumeX className="w-3 h-3 ml-0.5 text-stone-400" />
                )}
              </button>

              {isMusicEnabled && (
                <div className="hidden md:flex items-center gap-1 px-1.5">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-14 accent-amber-400 cursor-pointer h-1"
                    title="Music Volume"
                  />
                </div>
              )}
            </div>

            {/* Upload Video Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs border border-stone-700/60"
              title="Upload your own video file"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden xl:inline text-[11px]">Upload Video</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                pleasantBeachMusic.pause();
                setIsTourModalOpen(false);
              }}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
              aria-label="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Screen Container (Expanded, High-Definition Frame) */}
        <div
          className={`relative w-full bg-stone-950 overflow-hidden flex items-center justify-center group ${getVideoHeightClasses()}`}
        >
          {/* Real Video Element with dynamic orientation, size & rotation */}
          {videoSource && (
            <video
              ref={videoRef}
              key={`${videoSource}-${orientation}-${screenSize}`}
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

          {/* Subdued Gradient Scrim for readable controls */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Center Play/Pause Large Action Button */}
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

          {/* Top Floating Badge: Location, Music Indicator & Fit Toggle */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2 border border-stone-700/70 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-stone-200 font-semibold truncate max-w-[200px] sm:max-w-none">
                  Anjuna Beach Coastline, Goa
                </span>
              </div>

              {isMusicEnabled && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/70 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-600/40 shadow-lg">
                  <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Pleasant Coastal Harmony</span>
                </div>
              )}
            </div>

            {/* Fit mode toggle (Fit/Fill) */}
            <button
              onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
              className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-stone-200 text-xs font-medium border border-stone-700 shadow-lg flex items-center gap-1.5 transition-colors"
              title="Toggle Fill Screen vs Fit Screen"
            >
              {fitMode === 'cover' ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Fit Frame</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Fill Screen (मोठी)</span>
                </>
              )}
            </button>
          </div>

          {/* Video Scrub / Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-2.5 z-30">
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
                <button
                  onClick={togglePlayPause}
                  className="hover:text-white transition-colors"
                >
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
                  onClick={() => setScreenSize(screenSize === 'cinema' ? 'large' : 'cinema')}
                  className="text-xs text-stone-300 hover:text-white flex items-center gap-1 font-medium"
                >
                  {screenSize === 'cinema' ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
                  <span>{screenSize === 'cinema' ? 'Exit Cinema' : 'Cinema View'}</span>
                </button>
                <span className="text-teal-300 font-medium">
                  {orientation === 'vertical' ? 'Portrait Mode (9:16)' : 'Landscape Mode (16:9)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div className="p-3 sm:p-5 bg-stone-900 border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
            <span>Tour Chapters (Click to switch view):</span>
            <span className="text-teal-400 font-medium">Anjuna Beach Coastline, Goa</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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

          {/* Quick Action Footer inside Tour */}
          <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <p className="text-stone-400 text-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Anjuna Beach Shoreline · Swaishma Café, Goa</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  pleasantBeachMusic.pause();
                  setIsTourModalOpen(false);
                  setActiveTab('food');
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-medium transition-colors shadow-sm text-xs sm:text-sm"
              >
                Explore Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

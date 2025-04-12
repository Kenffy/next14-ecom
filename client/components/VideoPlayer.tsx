import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  PlayIcon, 
  PauseIcon, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  SkipForward, 
  Subtitles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  subtitles?: {
    src: string;
    label: string;
    language: string;
  }[];
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoPlayer = ({
  src,
  title = "Titre de la vidéo",
  poster = "/api/placeholder/640/360",
  subtitles = [],
  className
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [quality, setQuality] = useState("auto");
  
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleLoadedData = () => {
      setDuration(video?.duration || 0);
      setIsLoaded(true);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(video?.currentTime || 0);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    
    video?.addEventListener('loadeddata', handleLoadedData);
    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('ended', handleEnded);
    video?.addEventListener('waiting', handleWaiting);
    video?.addEventListener('playing', handlePlaying);
    
    return () => {
      video?.removeEventListener('loadeddata', handleLoadedData);
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('ended', handleEnded);
      video?.removeEventListener('waiting', handleWaiting);
      video?.removeEventListener('playing', handlePlaying);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = isMuted ? 0 : volume;
      video.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
    resetControlsTimer();
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = value[0];
      setCurrentTime(value[0]);
    }
    resetControlsTimer();
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
    resetControlsTimer();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    resetControlsTimer();
  };

  const setSubtitle = (language: string | null) => {
    setActiveSubtitle(language);
    resetControlsTimer();
  };

  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
    }
    resetControlsTimer();
  };

  const setVideoQuality = (q: string) => {
    setQuality(q);
    // Dans un environnement réel, vous utiliseriez HLS ou DASH pour changer la qualité
    resetControlsTimer();
  };

  const forward30s = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.duration, video.currentTime + 30);
    }
    resetControlsTimer();
  };

  const resetControlsTimer = () => {
    setShowControls(true);
    
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseMove = () => {
    resetControlsTimer();
  };

  return (
    <Card 
      className={cn("relative w-full max-w-4xl overflow-hidden bg-black rounded-lg", 
        isFullscreen ? "fixed inset-0 z-50 max-w-none rounded-none" : "", 
        className
      )} 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          onClick={togglePlayPause}
          preload="metadata"
        >
          {subtitles.map((track) => (
            <track
              key={track.language}
              kind="subtitles"
              src={track.src}
              srcLang={track.language}
              label={track.label}
              default={activeSubtitle === track.language}
            />
          ))}
        </video>
        
        {/* Titre vidéo qui s'affiche en haut */}
        {showControls && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>
        )}
        
        {/* Overlay de chargement */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Bouton de lecture/pause central */}
        {(!isPlaying || showControls) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              variant="outline" 
              size="icon"
              className="w-16 h-16 rounded-full bg-black/30 border-2 border-white hover:bg-black/50 transition-all"
              onClick={togglePlayPause}
            >
              {isPlaying ? <PauseIcon size={32} className="text-white" /> : <PlayIcon size={32} className="text-white" />}
            </Button>
          </div>
        )}
        
        {/* Contrôles */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-white/80 w-12 text-center">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="mx-2"
                disabled={!isLoaded}
              />
              <span className="text-xs font-medium text-white/80 w-12 text-center">
                {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                  onClick={forward30s}
                >
                  <SkipForward size={18} />
                </Button>
                
                <div className="flex items-center space-x-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {subtitles.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                      >
                        <Subtitles size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Sous-titres</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSubtitle(null)}>
                        Désactivés
                      </DropdownMenuItem>
                      {subtitles.map((track) => (
                        <DropdownMenuItem 
                          key={track.language}
                          onClick={() => setSubtitle(track.language)}
                        >
                          {track.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                    >
                      <Settings size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Vitesse</DropdownMenuLabel>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                      <DropdownMenuItem 
                        key={speed} 
                        onClick={() => setSpeed(speed)}
                        className={cn(
                          playbackSpeed === speed ? "bg-blue-500 text-white" : ""
                        )}
                      >
                        {speed === 1 ? "Normal" : `${speed}x`}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Qualité</DropdownMenuLabel>
                    {["auto", "1080p", "720p", "480p", "360p"].map((q) => (
                      <DropdownMenuItem 
                        key={q} 
                        onClick={() => setVideoQuality(q)}
                        className={cn(
                          quality === q ? "bg-blue-500 text-white" : ""
                        )}
                      >
                        {q}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white/90 hover:text-white hover:bg-white/10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </Button>
              </div>
            </div>
          </div>  
        )}
      </div>
    </Card>
  );
};

export default VideoPlayer;
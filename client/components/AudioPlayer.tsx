import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlayIcon, PauseIcon, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  coverImage?: string;
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const AudioPlayer = ({
  src,
  title = "Titre du morceau",
  artist = "Artiste",
  coverImage = "/api/placeholder/200/200",
  className
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleLoadedData = () => {
      setDuration(audio?.duration || 0);
      setIsLoaded(true);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio?.currentTime || 0);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audio) audio.currentTime = 0;
    };
    
    audio?.addEventListener('loadeddata', handleLoadedData);
    audio?.addEventListener('timeupdate', handleTimeUpdate);
    audio?.addEventListener('ended', handleEnded);
    
    return () => {
      audio?.removeEventListener('loadeddata', handleLoadedData);
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
      audio?.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const forward10 = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
  };

  return (
    <Card className={cn("w-full max-w-md overflow-hidden", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex-shrink-0">
          <img 
            src={coverImage} 
            alt={`${title} par ${artist}`} 
            className="w-20 h-20 rounded-md shadow-lg object-cover"
          />
        </div>
        <div className="ml-4 text-white">
          <h3 className="font-bold text-lg truncate">{title}</h3>
          <p className="text-sm opacity-80">{artist}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium w-12 text-center">
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
          <span className="text-sm font-medium w-12 text-center">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
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
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={restart}
            >
              <SkipBack size={18} />
            </Button>
            
            <Button 
              variant="default" 
              size="icon"
              className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700"
              onClick={togglePlayPause}
            >
              {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={forward10}
            >
              <SkipForward size={18} />
            </Button>
          </div>
          
          <div className="w-24">
            {/* Espace réservé pour équilibrer la mise en page */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
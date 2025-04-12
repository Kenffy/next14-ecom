import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  ZoomIn, 
  ZoomOut, 
  Rotate3D, 
  Download, 
  Share, 
  Info,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
    metadata?: {
      takenOn?: string;
      location?: string;
      camera?: string;
      [key: string]: string | undefined;
    };
  }[];
  startIndex?: number;
  className?: string;
  thumbnailSize?: 'sm' | 'md' | 'lg';
  showThumbnails?: boolean;
  allowFullscreen?: boolean;
  allowDownload?: boolean;
  allowSharing?: boolean;
  allowZoom?: boolean;
  allowRotate?: boolean;
}

const ImageViewer = ({
  images,
  startIndex = 0,
  className,
  thumbnailSize = 'md',
  showThumbnails = true,
  allowFullscreen = true,
  allowDownload = true,
  allowSharing = true,
  allowZoom = true,
  allowRotate = true,
}: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMetadata, setShowMetadata] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const currentImage = images[currentIndex];
  
  useEffect(() => {
    // Reset zoom, rotation and position when changing images
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  const thumbnailSizeClasses = {
    sm: "h-12",
    md: "h-16",
    lg: "h-20"
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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
  };
  
  const zoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    }
  };
  
  const zoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    }
  };
  
  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentImage.alt || 'Shared Image',
        text: currentImage.caption || 'Check out this image',
        url: currentImage.src,
      });
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStart && zoomLevel > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setDragStart(null);
  };
  
  const handleMouseLeave = () => {
    setDragStart(null);
  };
  
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (allowZoom) {
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  };
  
  return (
    <Card 
      className={cn("relative w-full max-w-4xl overflow-hidden", 
        isFullscreen ? "fixed inset-0 z-50 max-w-none rounded-none" : "",
        className
      )}
      ref={containerRef}
    >
      <div 
        className="relative aspect-video bg-black flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-full max-w-full object-contain transition-transform cursor-move"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: dragStart ? 'none' : 'transform 0.2s'
          }}
        />
        
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={goToPrevious}
        >
          <ChevronLeft size={24} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={goToNext}
        >
          <ChevronRight size={24} />
        </Button>
        
        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
            <p className="text-sm font-medium">{currentImage.caption}</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <CardContent className="p-2 bg-gray-100 dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {allowZoom && (
              <>
                <Button variant="outline" size="icon" onClick={zoomOut} disabled={zoomLevel <= 0.5}>
                  <ZoomOut size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={zoomIn} disabled={zoomLevel >= 3}>
                  <ZoomIn size={16} />
                </Button>
              </>
            )}
            
            {allowRotate && (
              <Button variant="outline" size="icon" onClick={rotate}>
                <Rotate3D size={16} />
              </Button>
            )}
          </div>
          
          <div className="flex gap-1">
            {currentImage.metadata && (
              <Button variant="outline" size="icon" onClick={() => setShowMetadata(true)}>
                <Info size={16} />
              </Button>
            )}
            
            {allowDownload && (
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download size={16} />
              </Button>
            )}
            
            {allowSharing && (
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share size={16} />
              </Button>
            )}
            
            {allowFullscreen && (
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </Button>
            )}
          </div>
        </div>
        
        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-2 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex-shrink-0 cursor-pointer border-2 rounded overflow-hidden transition-all",
                    thumbnailSizeClasses[thumbnailSize],
                    index === currentIndex ? "border-blue-500" : "border-transparent hover:border-gray-400"
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Metadata Dialog */}
      <Dialog open={showMetadata} onOpenChange={setShowMetadata}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informations sur l'image</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {currentImage.metadata && Object.entries(currentImage.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ImageViewer;
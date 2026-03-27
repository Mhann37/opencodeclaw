import React, { useEffect, useRef } from 'react';
import { ConcertDetails, DesignConfig, Song } from '../types';
import { renderSetlistToCanvas } from '../services/layoutEngine';
import { PRINT_DIMENSIONS } from '../constants';

interface Props {
  songs: Song[];
  details: ConcertDetails;
  config: DesignConfig;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const CanvasPreview: React.FC<Props> = ({ songs, details, config, onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Main Render Trigger
      renderSetlistToCanvas(canvasRef.current, songs, details, config);
      onCanvasReady(canvasRef.current);
    }
  }, [songs, details, config, onCanvasReady]);

  // We display the canvas scaled down via CSS to fit the container
  // But the actual width/height attributes are high-res (300DPI)
  const aspectRatio = PRINT_DIMENSIONS[config.size].width / PRINT_DIMENSIONS[config.size].height;

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-200/50 p-4 overflow-hidden rounded-xl border border-slate-200">
      <canvas
        ref={canvasRef}
        style={{
          width: 'auto',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '100%',
          aspectRatio: aspectRatio,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        }}
        className="bg-white shadow-2xl transition-all duration-300 ease-in-out"
      />
    </div>
  );
};
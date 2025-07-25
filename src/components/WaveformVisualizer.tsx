import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ stream, isRecording }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (stream && isRecording) {
      setupAudioContext();
    } else {
      cleanup();
    }

    return cleanup;
  }, [stream, isRecording]);

  const setupAudioContext = () => {
    if (!stream) return;

    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      source.connect(analyserRef.current);
      
      draw();
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawFrame = () => {
      if (!isRecording) return;

      animationRef.current = requestAnimationFrame(drawFrame);
      
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(248, 250, 252)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgb(34, 197, 94)');
        gradient.addColorStop(1, 'rgb(21, 128, 61)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    drawFrame();
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Audio Waveform</div>
      <canvas
        ref={canvasRef}
        width={320}
        height={100}
        className="w-full h-24 bg-gray-100 rounded border"
      />
      {!isRecording && (
        <div className="text-center text-gray-500 text-sm mt-2">
          Start recording to see waveform
        </div>
      )}
    </div>
  );
};

export default WaveformVisualizer;
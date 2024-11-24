import React from 'react';

const SpeechRecognitionEffect = () => {
  return (
    <div className="relative flex items-center justify-center bg-gray-900">
      {/* Glowing Pulses */}
      <div className="absolute w-36 h-36 rounded-full bg-orange-500 opacity-50 animate-pulse-slow"></div>
      <div className="absolute w-48 h-48 rounded-full bg-orange-500 opacity-30 animate-pulse-slow"></div>
      <div className="absolute w-60 h-60 rounded-full bg-orange-500 opacity-20 animate-pulse-slow"></div>

      {/* Microphone Icon */}
      <div className="relative w-16 h-16 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="w-8 h-8"
        >
          <path d="M8 12a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z" />
          <path d="M5 10.5a.5.5 0 0 1 .5.5A2.5 2.5 0 0 0 8 13a2.5 2.5 0 0 0 2.5-2.5.5.5 0 0 1 1 0A3.5 3.5 0 0 1 8 14a3.5 3.5 0 0 1-3.5-3.5.5.5 0 0 1 .5-.5z" />
        </svg>
      </div>
    </div>
  );
};

export default SpeechRecognitionEffect;

import React, { useState, useRef } from "react";

const Audio = ({ setContent, language1code }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecognition = () => {
    if (!window.webkitSpeechRecognition) {
      console.error("Speech recognition API not supported in this browser.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language1code;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0].transcript)
        .join(" ");
      setContent((prevContent) => prevContent + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start(); // Restart if still recording
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecognition();
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => startRecognition())
        .catch((err) => console.error("Microphone access denied:", err));
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <button
      className={`px-4 py-2 rounded shadow text-white ${
        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"
      }`}
      onClick={toggleRecording}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default Audio;

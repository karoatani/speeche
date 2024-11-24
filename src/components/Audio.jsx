import React, { useState, useRef } from "react";

const Audio = ({ setContent, language1code }) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
  
    const startRecognition = () => {
        console.log(language1code);
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true; // Enable continuous listening
      recognition.lang = language1code;
      recognition.maxAlternatives = 1;
  
      recognition.onresult = (event) => {
        
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        // Update content directly via setContent
        setContent((prevContent) => prevContent + transcript);
      };
  
      recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
      };
  
      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart recognition automatically if still recording
        }
      };
  
      recognitionRef.current = recognition;
      recognition.start();
    };
  
    const stopRecognition = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  
    const toggleRecording = () => {
      if (isRecording) {
        stopRecognition();
      } else {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            startRecognition();
          })
          .catch((err) => {
            console.error("Error accessing microphone:", err);
          });
      }
      setIsRecording((prevState) => !prevState);
    };
  
    return (
      <div>
        <button
          className={`${
            isRecording ? "bg-red-500" : "bg-purple-500"
          } hover:${isRecording ? "bg-red-600" : "bg-purple-600"} text-white px-4 py-2 rounded shadow`}
          onClick={toggleRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    );
  };
  
  export default Audio;
  
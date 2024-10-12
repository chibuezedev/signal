import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Translator = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [translatedLetter, setTranslatedLetter] = useState(null);
  const [translatedSentence, setTranslatedSentence] = useState([]);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [isCapturingSentence, setIsCapturingSentence] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      setCameraPermission(result.state);
      result.onchange = () => setCameraPermission(result.state);
    } catch (err) {
      console.error("Error checking camera permission:", err);
    }
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsCameraOn(true);
      setError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        setError(
          "Camera access denied. Please grant camera permissions in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        setError(
          "No camera detected. Please make sure a camera is connected to your device."
        );
      } else if (err.name === "NotReadableError") {
        setError(
          "Camera is in use by another application. Please close other apps using the camera and try again."
        );
      } else {
        setError(`Failed to access camera: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (isCameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOn]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      setTranslatedLetter(null);
    }
  };

  const captureAndTranslate = async () => {
    if (!videoRef.current) {
      setError("Video element is not ready. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "sign.jpg");

      try {
        const response = await fetch("http://localhost:5000/translate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setTranslatedLetter(data.letter);
          if (isCapturingSentence) {
            setTranslatedSentence((prev) => [...prev, data.letter]);
          }
        }
      } catch (error) {
        setError("Translation failed. Please try again.");
      }
    }, "image/jpeg");
  };

  const startSentenceCapture = () => {
    setIsCapturingSentence(true);
    setTranslatedSentence([]);
  };

  const endSentenceCapture = () => {
    setIsCapturingSentence(false);
    processSentence();
  };

  const processSentence = async () => {
    try {
      const response = await fetch("http://localhost:5000/process_sentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ sentence: translatedSentence }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setTranslatedSentence(data.processed_sentence);
      }
    } catch (error) {
      setError("Sentence processing failed. Please try again.");
    }
  };

  const speakSentence = () => {
    const utterance = new SpeechSynthesisUtterance(
      translatedSentence.join(" ")
    );
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 lg:pl-72">
      {" "}
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-700">
          Signa!
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={isCameraOn ? stopCamera : startCamera}
            className={`px-4 py-2 rounded-md ${
              isCameraOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition duration-300 ease-in-out flex items-center`}
          >
            {isCameraOn ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Stop Camera
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Camera
              </>
            )}
          </button>
          {isCameraOn && (
            <button
              onClick={captureAndTranslate}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Translate Sign
            </button>
          )}
        </div>
        {translatedLetter && (
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold">Translated Letter:</h3>
            <p className="text-5xl font-bold">{translatedLetter}</p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={startSentenceCapture}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out"
            disabled={!isCameraOn || isCapturingSentence}
          >
            Start Sentence
          </button>
          <button
            onClick={endSentenceCapture}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out"
            disabled={!isCapturingSentence}
          >
            End Sentence
          </button>
          <button
            onClick={speakSentence}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out"
            disabled={translatedSentence.length === 0}
          >
            Speak Sentence
          </button>
        </div>
        {isCapturingSentence && (
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold">Current Sentence:</h3>
            <p className="text-3xl font-bold">{translatedSentence.join(" ")}</p>
          </div>
        )}
        {translatedSentence.length > 0 && !isCapturingSentence && (
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold">Translated Sentence:</h3>
            <p className="text-3xl font-bold">{translatedSentence.join(" ")}</p>
          </div>
        )}
        {cameraPermission === "denied" && (
          <div
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-6"
            role="alert"
          >
            <span className="block sm:inline">
              Camera Permission Denied! Please enable camera access in your
              browser settings to use this feature.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;

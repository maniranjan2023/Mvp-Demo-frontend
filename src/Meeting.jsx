import React, { useState, useRef } from 'react';

function Meeting() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [response, setResponse] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const res = await fetch('http://localhost:5000/api/audio-insights', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setResponse(data.insights);
      setTranscript(data.transcript);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-center gap-4 mb-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          >
            ⏹️ Stop Recording
          </button>
        )}
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          disabled={!audioBlob || loading}
        >
          ⬆️ Upload & Get Insights
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Processing your audio...</p>}

      {transcript && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📝 Transcript</h2>
          <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded">{transcript}</p>
        </div>
      )}

      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📊 Medical Summary</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded">{response}</pre>
        </div>
      )}
    </div>
  );
}

export default Meeting;

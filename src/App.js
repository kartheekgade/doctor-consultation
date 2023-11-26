import React, { useState } from 'react';
import { ReactMic } from 'react-mic';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData) => {
    // console.log('chunk of real-time data is: ', recordedData);
  };

  const onStop = (recordedBlob) => {
    setAudioBlob(recordedBlob);
  };

  const handleUpload = () => {
    // Handle the audio upload logic here
    if (audioBlob) {
      console.log('Uploading audio blob:', audioBlob);
      // Add your upload logic here, e.g., send the audioBlob to a server
    } else {
      console.log('No audio to upload.');
    }
  };

  return (
    <div className="App">
      <h1>Doctor Consultation</h1>
      <div>
        <h2>Audio Recording</h2>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <ReactMic
          record={isRecording}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#000000"
          backgroundColor="#FF4081"
        />
      </div>
      <div>
        <h2>Audio Upload</h2>
        <input
          type="file"
          accept=".mp3"
          onChange={(e) => setAudioBlob(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload Audio</button>
      </div>
    </div>
  );
}

export default App;

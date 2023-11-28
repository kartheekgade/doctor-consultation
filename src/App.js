import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
  };

  const onData = (recordedData) => {
    // console.log('chunk of real-time data is: ', recordedData);
  };

  // const onStop = (recordedBlob) => {
  //   setAudioBlob(recordedBlob);
  // saveAudioFile(recordedBlob.blob, 'recordedAudio.wav');

  // // Set the recorded audio file URL to update the input value
  // const recordedAudioUrl = URL.createObjectURL(recordedBlob.blob);
  // const input = document.getElementById('audioInput');
  // input.value = recordedAudioUrl;
  // };

  const onStop = (recordedBlob) => {
    setAudioBlob(recordedBlob);
    saveAudioFile(recordedBlob.blob, 'recordedAudio.wav');
  };

  const handleGetVideo = () => {
    fetch('http://localhost:5000/get-video')
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        
        // Set the video URL to trigger a re-render
        setVideoUrl(url);
      })
      .catch(error => console.error('Error fetching video:', error));
  };
  
  const handleGetPDF = () => {
    fetch('http://localhost:5000/get-pdf')
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
  
        // Set the PDF URL to trigger a re-render
        setPdfUrl(url);
      })
      .catch(error => console.error('Error fetching PDF:', error));
  };
  const handleUpload = () => {
    console.log(audioBlob);

    if (audioBlob !== null) {
      const formData = new FormData();
      formData.append('audio', audioBlob, `uploadedAudio.${audioBlob.type.split('/')[1]}`);

      fetch('http://localhost:5000/upload-audio', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          // setVideoUrl(data.videoUrl);
          // setPdfUrl(data.pdfUrl);
        })
        .catch(error => {
          console.error('Upload error:', error);
        })
        .finally(() => {
          const input = document.getElementById('audioInput');
          input.value = '';
          setAudioBlob(null);
        });
      handleGetVideo();
      handleGetPDF();
    } else {
      console.log('No audio to upload.');
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const anchor = document.createElement('a');
      anchor.href = pdfUrl;
      anchor.download = 'generatedPdf.pdf';
      anchor.click();
    }
  };

  const saveAudioFile = (blob, filename) => {
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: blob.type }));
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'audioFile';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="App">
      <h1>Doctor Consultation</h1>
      <div className="audio-recording-container">
        <h2>Audio Recording</h2>
        <button className="record-button" onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button className="record-button" onClick={stopRecording} disabled={!isRecording}>
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
      {/* <div className="recorded-audio-container">
        {recordedAudioUrl && (
          <div>
            <h2>Recorded Audio</h2>
            <audio controls>
              <input src={recordedAudioUrl} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          </div>
          
        )}
      </div> */}
      <div className="audio-upload-container">
        <h2>Audio Upload</h2>
        <input
          id="audioInput"
          type="file"
          accept=".wav, .mp3"
          onChange={(e) => {
            const selectedFile = e.target.files && e.target.files[0];
            if (selectedFile) {
              setAudioBlob(selectedFile);
            } 
            else {
              console.error('No file selected.');
            }
          }}
        />
        <button className="upload-button" onClick={handleUpload}>
          Upload Audio
        </button>
      </div>
      <div className="frames-container">
        <div className="video-frame">
          <h2>Video Preview</h2>
          {videoUrl && (
            <video width="400" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        </div>
        <div className="frames-container">
        <div className="pdf-frame">
          <h2>PDF Preview & Download</h2>
          {pdfUrl && (
            <>
              <embed src={pdfUrl} type="application/pdf" width="100%" height="400" />
              <button onClick={downloadPdf}>Download PDF</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

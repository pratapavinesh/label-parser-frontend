import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [processedInfo, setProcessedInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = async () => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProcessedInfo(response.data);
    } catch (error) {
      setError('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (image) {
      handleImageUpload();
    } else {
      setError('Please upload an image first.');
    }
  };

  return (
    <div className="App">
      <h1>Label Parser App</h1>
      <div className="dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
        {!image && (
          <>
            <p>Drag & Drop image here</p>
            <p>or</p>
            <button onClick={handleButtonClick}>Upload Image</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        )}
        {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
      </div>
      <div className="submit-button">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {processedInfo && (
        <div className="processed-info">
          <h2>Processed Information</h2>
          <ul>
            <li><strong>Medicine Name:</strong> {processedInfo.medicineName}</li>
            <li><strong>Composition:</strong> {processedInfo.composition}</li>
            <li><strong>Expiry Date:</strong> {processedInfo.expiryDate}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

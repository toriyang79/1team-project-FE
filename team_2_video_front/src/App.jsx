import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import VideoGrid from './components/VideoGrid';
import UploadModal from './components/UploadModal';
import VideoDetailModal from './components/VideoDetailModal'; // Import VideoDetailModal
import './styles/App.css';

function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null); // State for the modal

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadSuccess = (uploadedVideo) => {
    console.log('Video uploaded successfully:', uploadedVideo);
    // Trigger video grid refresh
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handler to open the detail modal
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  // Handler to close the detail modal
  const handleCloseDetailModal = () => {
    setSelectedVideo(null);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Navbar onUploadClick={handleUploadClick} onSearch={handleSearch} />
        <main className="main-content">
          <VideoGrid 
            refreshTrigger={refreshTrigger} 
            searchQuery={searchQuery}
            onVideoSelect={handleVideoSelect} // Pass handler to VideoGrid
          />
        </main>
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={handleCloseModal}
          onUploadSuccess={handleUploadSuccess}
        />
        {/* Render the modal conditionally */}
        {selectedVideo && (
          <VideoDetailModal
            video={selectedVideo}
            onClose={handleCloseDetailModal}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

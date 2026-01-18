import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from '../src/components/Navbar';
import VideoGrid from './components/VideoGrid';
import UploadModal from './components/UploadModal';
import VideoDetailModal from './components/VideoDetailModal';


function MainContent() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadSuccess = (uploadedVideo) => {
    console.log('Video uploaded successfully:', uploadedVideo);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseDetailModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen font-display pb-28">
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col flex-1">
          <Navbar
            theme={isDark ? 'dark' : 'light'}
            onToggleTheme={toggleTheme}
            isAuthenticated={false} // TODO: Connect with auth context
            onLogout={() => { }} // TODO: Connect with auth context
            onUploadClick={handleUploadClick}
            onSearch={handleSearch}
          />
          <main className="flex-1 py-10 md:py-16">
            <VideoGrid
              refreshTrigger={refreshTrigger}
              searchQuery={searchQuery}
              onVideoSelect={handleVideoSelect}
            />
          </main>
        </div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModal}
        onUploadSuccess={handleUploadSuccess}
      />
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export default App;

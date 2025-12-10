import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// @ts-ignore
import VideoGrid from '../../video_front/components/VideoGrid';
import { useAuth } from '../contexts/AuthContext';

// @ts-ignore
import { ThemeProvider } from '../../video_front/contexts/ThemeContext';

// @ts-ignore
import UploadModal from '../../video_front/components/UploadModal';
// @ts-ignore
import VideoDetailModal from '../../video_front/components/VideoDetailModal';

const VideoPage: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });
    const { user, isAuthenticated, logout } = useAuth();

    // Video Page State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUploadModalOpen(false);
    };

    const handleUploadSuccess = (uploadedVideo: any) => {
        console.log('Video uploaded successfully:', uploadedVideo);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleVideoSelect = (video: any) => {
        setSelectedVideo(video);
    };

    const handleCloseDetailModal = () => {
        setSelectedVideo(null);
    };

    return (
        <ThemeProvider>
            <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen font-display pb-28">
                <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-0 md:py-5 flex justify-center">
                    <div className="w-full max-w-6xl flex flex-col flex-1">
                        <Navbar
                            theme={theme}
                            onToggleTheme={toggleTheme}
                            isAuthenticated={isAuthenticated}
                            userNickname={user?.nickname}
                            onLogout={logout}
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
                        <Footer />
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
        </ThemeProvider>
    );
};

export default VideoPage;

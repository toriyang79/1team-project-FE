import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageListPage from '../../img_front/pages/ImageListPage';

const ImagePage: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    });
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen font-display">
            <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-0 md:py-5 flex justify-center">
                <div className="w-full max-w-6xl flex flex-col flex-1">
                    <Navbar
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        isAuthenticated={isAuthenticated}
                        userNickname={user?.nickname}
                        onLogout={logout}
                    />

                    <main className="flex-1">
                        <ImageListPage />
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default ImagePage;

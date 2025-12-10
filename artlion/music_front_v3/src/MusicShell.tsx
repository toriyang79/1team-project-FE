import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import PlayerBar from "./components/PlayerBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TrackDetailPage from "./pages/TrackDetailPage";
import UploadPage from "./pages/UploadPage";
import { PlayerProvider } from "./context/PlayerContext";

const MusicShell = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });
  const [isAuthenticated] = useState(false);
  const [userNickname] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const handleLogout = () => { };

  return (
    <div className="bg-background-light dark:bg-black text-text-light dark:text-text-dark min-h-screen font-display pb-28">
      <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-0 md:py-5 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col flex-1">
          <Navbar
            theme={theme}
            onToggleTheme={handleToggleTheme}
            isAuthenticated={isAuthenticated}
            userNickname={userNickname}
            onLogout={handleLogout}
            onSearch={(query) => console.log("Search:", query)}
            onUploadClick={() => window.location.href = '/music/upload'}
          />

          <main className="flex-1 py-10 md:py-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/tracks/:id" element={<TrackDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MusicShell;

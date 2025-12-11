import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import PlayerBar from "./components/PlayerBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TrackDetailPage from "./pages/TrackDetailPage";
import UploadPage from "./pages/UploadPage";
import { PlayerProvider } from "./context/PlayerContext";
import { useAuth } from "../../src/contexts/AuthContext";

const MusicShell = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/music/upload");
  };

  return (
    <div className="bg-background-light dark:bg-black text-text-light dark:text-text-dark min-h-screen font-display pb-28">
      <div className="px-0 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-0 md:py-5 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col flex-1">
          <Navbar
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isAuthenticated={isAuthenticated}
              userNickname={user?.nickname || user?.email}
              onLogout={handleLogout}
              onSearch={(query) => console.log("Search:", query)}
              onUploadClick={handleUploadClick}
            />

          <main className="flex-1 py-10 md:py-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/upload"
                element={isAuthenticated ? <UploadPage /> : <Navigate to="/login" replace state={{ from: location }} />}
              />
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

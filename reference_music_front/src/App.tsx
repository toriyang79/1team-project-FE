import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PlayerBar from "./components/PlayerBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TrackDetailPage from "./pages/TrackDetailPage";
import UploadPage from "./pages/UploadPage";

const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAuthenticated] = useState(false);
  const [userNickname] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const handleLogout = () => {};

  return (
    <BrowserRouter>
      <div className="bg-background-light text-text-light min-h-screen font-display pb-28">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-5 flex justify-center">
          <div className="w-full max-w-6xl flex flex-col flex-1">
            <Navbar
              theme={theme}
              onToggleTheme={handleToggleTheme}
              isAuthenticated={isAuthenticated}
              userNickname={userNickname}
              onLogout={handleLogout}
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
      <PlayerBar />
    </BrowserRouter>
  );
};

export default App;

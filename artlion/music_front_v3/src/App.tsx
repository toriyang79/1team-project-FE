import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "../../src/components/Footer";
import Navbar from "../../src/components/Navbar";
import PlayerBar from "./components/PlayerBar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TrackDetailPage from "./pages/TrackDetailPage";
import UploadPage from "./pages/UploadPage";

const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userNickname, setUserNickname] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 로컬스토리지에 저장된 토큰/유저 정보 기반으로 인증 상태 설정
  useEffect(() => {
    const loadAuth = () => {
      const token = localStorage.getItem("access_token");
      const userRaw = localStorage.getItem("user");
      setIsAuthenticated(!!token);

      let nickname: string | undefined = undefined;
      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw);
          nickname = parsed?.nickname || parsed?.email || undefined;
        } catch (e) {
          nickname = undefined;
        }
      }
      // 사용자 정보가 없더라도 토큰이 있으면 기본 닉네임을 표시
      if (!nickname && token) {
        nickname = "사용자";
      }
      setUserNickname(nickname);
    };

    loadAuth();
    const onStorage = (e: StorageEvent) => {
      if (["access_token", "user", "refresh_token"].includes(e.key || "")) {
        loadAuth();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleToggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserNickname(undefined);
  };

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
      <PlayerBar />
    </BrowserRouter>
  );
};

export default App;

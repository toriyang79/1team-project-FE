import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavbarProps {
    theme: "light" | "dark";
    onToggleTheme: () => void;
    isAuthenticated: boolean;
    userNickname?: string;
    onLogout: () => void;
}

const Navbar = ({ theme, onToggleTheme, isAuthenticated, userNickname, onLogout }: NavbarProps) => {
    return (
        <header className={styles.navbar}>
            <div className={styles.left}>
                <Link to="/" className={styles.brand}>
                    <div className="size-6 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path
                                clipRule="evenodd"
                                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                                fill="currentColor"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <h2>Artlion</h2>
                </Link>
                <nav className={styles.links}>
                    <Link to="/" className={styles.link}>
                        홈
                    </Link>
                    <Link to="/upload" className={styles.link}>
                        업로드
                    </Link>
                    <Link to="/profile" className={styles.link}>
                        프로필
                    </Link>
                </nav>
            </div>
            <div className={styles.right}>
                <button onClick={onToggleTheme} className={styles.themeButton} aria-label="테마 전환">
                    <span className="text-2xl">{theme === "dark" ? "🌙" : "☀️"}</span>
                </button>
                <div className={styles.actions}>
                    {isAuthenticated && userNickname ? (
                        <>
                            <span className={styles.welcome}>어서오세요, {userNickname}</span>
                            <button onClick={onLogout} className={`${styles.pill} ${styles.ghost}`}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className={`${styles.pill} ${styles.primary}`}>
                                회원가입
                            </Link>
                            <Link to="/login" className={`${styles.pill} ${styles.ghost}`}>
                                로그인
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

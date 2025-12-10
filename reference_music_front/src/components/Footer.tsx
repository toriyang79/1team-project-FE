import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
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
              <h3 className={styles.title}>Artlion</h3>
            </div>
            <p className={styles.text}>AI로 만든 놀라운 이미지와 음악을 발견하고 공유하세요.</p>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>바로가기</h4>
            <ul className={styles.links}>
              <li>
                <Link to="/" className={styles.link}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="/upload" className={styles.link}>
                  업로드
                </Link>
              </li>
              <li>
                <Link to="/profile" className={styles.link}>
                  프로필
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>정보</h4>
            <ul className={styles.links}>
              <li>
                <Link to="/" className={styles.link}>
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link to="/" className={styles.link}>
                  공지사항
                </Link>
              </li>
              <li>
                <Link to="/" className={styles.link}>
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/" className={styles.link}>
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>© {new Date().getFullYear()} Artlion. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;

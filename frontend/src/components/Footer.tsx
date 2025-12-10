import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-solid border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark">
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 로고 및 소개 */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
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
                <h3 className="text-xl font-bold">Artlion</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                인공지능과 함께하는 창작의 세계. 이미지, 음악, 비디오를 AI로 만들고 공유하세요.
              </p>
            </div>

            {/* 링크 섹션 1 */}
            <div>
              <h4 className="font-bold mb-4">서비스</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    이미지 생성
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    음악 생성
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    비디오 생성
                  </Link>
                </li>
              </ul>
            </div>

            {/* 링크 섹션 2 */}
            <div>
              <h4 className="font-bold mb-4">정보</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    소개
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    문의하기
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 저작권 */}
          <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Artlion. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

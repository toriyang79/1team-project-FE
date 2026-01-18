// import React, { useState } from 'react';
// import { useTheme } from '../contexts/ThemeContext';
// import '../styles/Navbar.css';

// const Navbar = ({ onUploadClick, onSearch }) => {
//   const { isDark, toggleTheme } = useTheme();
//   const [searchQuery, setSearchQuery] = useState('');

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (onSearch) {
//       onSearch(searchQuery.trim());
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     if (onSearch) {
//       onSearch('');
//     }
//   };

//   return (
//     <header className={`navbar ${isDark ? 'dark' : 'light'}`}>
//       <div className="navbar-container">
//         {/* Left: Logo */}
//         <div className="navbar-left">
//           <div className="logo">
//             <div className="logo-icon">
//               <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
//                 <path
//                   clipRule="evenodd"
//                   d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
//                   fill="currentColor"
//                   fillRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <h2>Artlion</h2>
//           </div>
//         </div>

//         {/* Center: Search */}
//         <div className="navbar-center">
//           <form className="search-box" onSubmit={handleSearch}>
//             <div className="search-icon">
//               <span className="material-symbols-outlined">search</span>
//             </div>
//             <input
//               type="text"
//               placeholder="동영상 검색..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             {searchQuery && (
//               <button
//                 type="button"
//                 className="clear-search-btn"
//                 onClick={handleClearSearch}
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             )}
//           </form>
//         </div>

//         {/* Right: Actions */}
//         <div className="navbar-right">
//           <div className="nav-actions">
//             <button className="theme-toggle" onClick={toggleTheme}>
//               <span className="material-symbols-outlined">
//                 {isDark ? 'light_mode' : 'dark_mode'}
//               </span>
//             </button>
//             <button className="btn-primary" onClick={onUploadClick}>Upload</button>
//             <button className="btn-secondary">Log In</button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

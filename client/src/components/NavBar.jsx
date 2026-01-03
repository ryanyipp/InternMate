import { Link, useLocation } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { getThemeColors } from "../utils/theme";

const Navbar = ({ isDark, toggleDarkMode, handleLogout }) => {
  const location = useLocation();
  const colors = getThemeColors(isDark);

  const isActive = (path) =>
    location.pathname === path
      ? `text-[${colors.brand}] font-semibold`
      : `text-[${colors.mutedForeground}] hover:text-[${colors.primary}]`;

  return (
    <nav
      className="w-full z-50 sticky top-0 border-b py-4 px-8 shadow-sm flex justify-between items-center transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        boxShadow: `0px 4px 10px 0px ${colors.ring}20`
      }}
    >
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center gap-12">
        <h1 
          className="text-3xl font-extrabold transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{ color: colors.brand }}
        >
          HustleHub
        </h1>
        <div className="hidden md:flex gap-8 text-sm sm:text-base">
          <Link 
            to="/dashboard" 
            className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              location.pathname === "/dashboard" ? "font-semibold" : ""
            }`}
            style={{ 
              color: location.pathname === "/dashboard" ? colors.brand : colors.mutedForeground,
              backgroundColor: location.pathname === "/dashboard" ? colors.accent : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.color = <colors className="brand"></colors>;
                e.currentTarget.style.backgroundColor = colors.accent;
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/dashboard") {
                e.currentTarget.style.color = colors.mutedForeground;
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            Internship Tracker
            {location.pathname === "/dashboard" && (
              <div 
                className="absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: colors.brand }}
              />
            )}
          </Link>
          <Link 
            to="/recommended" 
            className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              location.pathname === "/recommended" ? "font-semibold" : ""
            }`}
            style={{ 
              color: location.pathname === "/recommended" ? colors.brand : colors.mutedForeground,
              backgroundColor: location.pathname === "/recommended" ? colors.accent : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/recommended") {
                e.currentTarget.style.color = colors.brand;
                e.currentTarget.style.backgroundColor = colors.accent;
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/recommended") {
                e.currentTarget.style.color = colors.mutedForeground;
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            Recommendations
            {location.pathname === "/recommended" && (
              <div 
                className="absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: colors.brand }}
              />
            )}
          </Link>
        </div>
      </div>

      {/* Right: Dark mode & Logout */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full shadow transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            backgroundColor: colors.secondary,
            color: colors.secondaryForeground,
            boxShadow: `0px 4px 10px 0px ${colors.ring}20`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = `0px 6px 15px 0px ${colors.ring}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0px 4px 10px 0px ${colors.ring}20`;
          }}
        >
          {isDark ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: colors.destructive,
            color: colors.destructiveForeground,
            boxShadow: `0px 4px 10px 0px ${colors.ring}20`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = `0px 6px 15px 0px ${colors.ring}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0px 4px 10px 0px ${colors.ring}20`;
          }}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


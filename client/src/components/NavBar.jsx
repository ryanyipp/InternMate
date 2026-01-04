import { Link, useLocation } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { getThemeColors } from "../utils/theme";
import LogoLight from "../assets/InternMate2.png";
import LogoDark from "../assets/InternMate.png";

const Navbar = ({
  isDark = false,
  toggleDarkMode,
  handleLogout,
  variant = "app", // "app" | "landing"
}) => {
  const location = useLocation();
  const colors = getThemeColors(isDark);

  const onHoverIn = (e) => {
    e.currentTarget.style.color = colors.brand;
    e.currentTarget.style.backgroundColor = colors.accent;
  };

  const onHoverOut = (e) => {
    e.currentTarget.style.color = colors.mutedForeground;
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <nav
      className="w-full z-50 sticky top-0 border-b py-4 px-8 shadow-sm flex justify-between items-center transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
      }}
    >
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center gap-12">
        <Link to={variant === "landing" ? "/" : "/dashboard"} className="flex items-center gap-0.5 cursor-pointer select-none">
          <img
            src={isDark ? LogoDark : LogoLight}
            alt="InternMate logo"
            className="h-9 w-12 sm:h-11 sm:w-12 object-contain"
            draggable={false}
          />
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl transition-all duration-300 hover:scale-105">
            <span style={{ color: isDark ? "#ffffff" : colors.brand }}>
              InternMate
            </span>
          </h2>
        </Link>

        {/* Only show these links inside the app */}
        {variant === "app" && (
          <div className="hidden md:flex gap-8 text-sm sm:text-base">
            <Link
              to="/dashboard"
              className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{
                color:
                  location.pathname === "/dashboard"
                    ? colors.brand
                    : colors.mutedForeground,
                backgroundColor:
                  location.pathname === "/dashboard"
                    ? colors.accent
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== "/dashboard") onHoverIn(e);
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/dashboard") onHoverOut(e);
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
              className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300"
              style={{
                color:
                  location.pathname === "/recommended"
                    ? colors.brand
                    : colors.mutedForeground,
                backgroundColor:
                  location.pathname === "/recommended"
                    ? colors.accent
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== "/recommended") onHoverIn(e);
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/recommended") onHoverOut(e);
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
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Dark mode button (app only) */}
        {variant === "app" && (
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full shadow transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: colors.secondary,
              color: colors.secondaryForeground,
              boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
            }}
          >
            {isDark ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        )}

        {/* Landing buttons vs App logout */}
        {variant === "landing" ? (
          <>
            <Link
              to="/login"
              className="text-md font-semibold transition-all duration-200 hover:opacity-90"
              style={{ color: colors.brand }}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-6 py-3 text-sm font-semibold rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors.brand,
                color: "#ffffff",
                boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
              }}
            >
              Get Started
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colors.destructive,
              color: colors.destructiveForeground,
              boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
            }}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

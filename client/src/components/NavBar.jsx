import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(() => {
    if (variant !== "app") return [];
    return [
      { to: "/dashboard", label: "Internship Tracker" },
      { to: "/recommended", label: "Status Breakdown" },
    ];
  }, [variant]);

  const onHoverIn = (e) => {
    e.currentTarget.style.color = colors.brand;
    e.currentTarget.style.backgroundColor = colors.accent;
  };

  const onHoverOut = (e) => {
    e.currentTarget.style.color = colors.mutedForeground;
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="w-full z-50 sticky top-0 border-b shadow-sm transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
      }}
    >
      {/* Top row */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 sm:gap-12">
          <Link
            to={variant === "landing" ? "/" : "/dashboard"}
            className="flex items-center gap-0.5 cursor-pointer select-none"
          >
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

          {/* Desktop nav links */}
          {variant === "app" && (
            <div className="hidden md:flex gap-3 lg:gap-8 text-sm sm:text-base">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    color: isActive(l.to) ? colors.brand : colors.mutedForeground,
                    backgroundColor: isActive(l.to) ? colors.accent : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(l.to)) onHoverIn(e);
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(l.to)) onHoverOut(e);
                  }}
                >
                  {l.label}
                  {isActive(l.to) && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300"
                      style={{ backgroundColor: colors.brand }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Desktop actions */}
        <div className="hidden md:flex items-center gap-6">
          {variant === "app" && (
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full shadow transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: colors.secondary,
                color: colors.secondaryForeground,
                boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>
          )}

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

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {variant === "app" && (
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full transition-all active:scale-95"
              style={{
                backgroundColor: colors.secondary,
                color: colors.secondaryForeground,
                boxShadow: `0px 4px 10px 0px ${colors.ring}20`,
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2.5 rounded-xl border transition-all active:scale-95"
            style={{
              borderColor: colors.border,
              color: colors.foreground,
              backgroundColor: colors.card,
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4"
          style={{ backgroundColor: colors.background }}
        >
          <div
            className="rounded-2xl border p-3 flex flex-col gap-2"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              boxShadow: `0px 12px 30px 0px ${colors.ring}20`,
            }}
          >
            {/* App links */}
            {variant === "app" &&
              navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-4 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    color: isActive(l.to) ? colors.brand : colors.foreground,
                    backgroundColor: isActive(l.to) ? colors.accent : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}

            {/* Landing links */}
            {variant === "landing" && (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-xl font-semibold"
                  style={{
                    color: colors.brand,
                    backgroundColor: "transparent",
                  }}
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-3 rounded-xl font-semibold text-center"
                  style={{
                    backgroundColor: colors.brand,
                    color: "#ffffff",
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Logout */}
            {variant === "app" && (
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all active:scale-[0.99]"
                style={{
                  backgroundColor: colors.destructive,
                  color: colors.destructiveForeground,
                }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

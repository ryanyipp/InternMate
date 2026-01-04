// LandingPage.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import wallpaperLight from "../assets/wall.jpg";

export default function LandingPage({ isDark, toggleDarkMode }) {
  return (
    <div
        className="min-h-screen text-slate-900 bg-cover bg-center"
        style={{ backgroundImage: `url(${wallpaperLight})` }}
        >
      <Navbar
        variant="landing"
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-6xl px-6">
        <section className="min-h-[calc(100vh-72px)] flex items-center justify-center">
          <div className="w-full flex flex-col items-center text-center gap-7 py-10">

            <div className="space-y-6">
              <h1 className="font-extrabold tracking-tight leading-[0.95]">
                <div className="text-5xl md:text-6xl lg:text-[82px] text-violet-600">
                  STAY
                </div>
                <div className="text-5xl md:text-6xl lg:text-[82px] text-violet-600">
                  ORGANISED
                </div>
              </h1>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-20 bg-blue-200" />
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 shadow grid place-items-center">
                  <span className="text-white font-bold">&amp;</span>
                </div>
                <div className="h-px w-20 bg-blue-200" />
              </div>

              <div className="mx-auto w-full max-w-md rounded-2xl bg-emerald-50 border border-emerald-100 shadow-lg px-7 py-7">
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  MANAGE
                </div>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-700">
                  INTERNSHIPS
                </div>
              </div>
            </div>

            <div className="max-w-76 text-[20px] text-slate-600">
              All your internship applications. In one place
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 text-white font-semibold text-3xl shadow-lg hover:shadow-xl active:scale-[0.99] transition"
              >
                Get Started
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-95"
                >
                  <path
                    d="M5 12h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

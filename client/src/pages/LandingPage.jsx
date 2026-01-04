// LandingPage.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function LandingPage({ isDark, toggleDarkMode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        variant="landing"
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-6xl px-6">
        <section className="min-h-[calc(100vh-72px)] flex items-center justify-center">
          <div className="w-full flex flex-col items-center text-center gap-10 py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 shadow-sm border border-amber-100">
              <span className="text-amber-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l2.7 5.9 6.3.7-4.7 4.1 1.3 6.2L12 17l-5.6 3.9 1.3-6.2L3 9.6l6.3-.7L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold text-amber-800">
                Trusted by 600+ users
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="font-extrabold tracking-tight leading-[0.95]">
                <div className="text-6xl md:text-7xl lg:text-8xl text-violet-600">
                  STAY
                </div>
                <div className="text-6xl md:text-7xl lg:text-8xl text-violet-600">
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

              <div className="mx-auto w-full max-w-md rounded-2xl bg-emerald-50 border border-emerald-100 shadow-lg px-10 py-10">
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                  SECURE
                </div>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-700">
                  INTERNSHIPS
                </div>
              </div>
            </div>

            <div className="max-w-2xl text-slate-600">
              Stop juggling spreadsheets. One place to track every application
              from{" "}
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 border">
                applied
              </span>{" "}
              to{" "}
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 border border-blue-200">
                accepted
              </span>
              .
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[0.99] transition"
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

import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login2 from "./pages/Login2";
import Signup from "./pages/Signup";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgetPassword";
import InternshipTable from "./pages/MainTable";
import PrivateRoute from "./components/PrivateRoute";
import Recommended from "./pages/Recommended";
import LandingPage from "./pages/LandingPage";

function App() {
  const location = useLocation();

  // Auth redirect from landing
  const isAuthed = !!localStorage.getItem("token"); // change key if needed

  // Dark mode state (persisted)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("isDark");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing */}
          <Route
            path="/landing"
            element={
              isAuthed ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage isDark={isDark} toggleDarkMode={toggleDarkMode} />
              )
            }
          />

          {/* Auth */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Login2 />} />
          <Route path="/signup" element={isAuthed ? <Navigate to="/dashboard" replace /> : <Signup />} />
          <Route path="/forgot" element={isAuthed ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={<InternshipTable isDark={isDark} toggleDarkMode={toggleDarkMode} />}
            />
            <Route
              path="/recommended"
              element={<Recommended isDark={isDark} toggleDarkMode={toggleDarkMode} />}
            />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </>
  );
}

export default App;

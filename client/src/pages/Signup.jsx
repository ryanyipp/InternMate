import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import SignupImage from "../assets/Signup.svg";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { register } from "../api/index.js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()

  const validatePassword = (password) => {
    const errors = [];
    if (!/[a-z]/.test(password)) errors.push("lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("uppercase letter");
    if (!/\d/.test(password)) errors.push("digit");
    if (!/[@.#$!%*?&]/.test(password)) errors.push("special character");
    if (password.length < 8 || password.length > 15)
      errors.push("8–15 characters");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      toast.error("Password must contain: " + passwordErrors.join(", "));
      return;
    }

    try {
      const username = email.split("@")[0];
      const { data } = await register({
        username,
        email,
        password,
      });
      sessionStorage.setItem("profile", JSON.stringify(data.user));

      toast.success("Account created successfully");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg?.includes("Username in use") || msg?.includes("already exists")) {
        toast.error("Username or email already registered");
      } else {
        toast.error("Registration failed");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.2 }}
    >
      <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
        {/* Left: Image */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
          <img
            src={SignupImage}
            alt="Signup Illustration"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Right: Signup Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
            <div className="mb-6 text-center">
              <h2 className="font-bold text-3xl">
                HUSTLE{" "}
                <span className="bg-blue-600 text-white px-2 rounded-md">
                  HUB
                </span>
              </h2>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

            <form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PasswordField
                label="Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 rounded-md transition"
              >
                Create Account
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-blue-500">
              Already have an account?{" "}
              <Link to="/" className="hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;


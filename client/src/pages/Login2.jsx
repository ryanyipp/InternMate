import { useState, useEffect } from "react";
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.svg";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { login } from "../api/index.js";

const Login2 = () => {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const rememberedProfile = localStorage.getItem("profile");
    if (rememberedProfile) {
      setIsRedirecting(true);
      setTimeout(()=> {
        navigate("/dashboard");
      }, 1000);
    }
   }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      toast.success("Login successful")      

      // Store user data in localStorage 
      const storage = rememberMe ? localStorage: sessionStorage;
      storage.setItem('profile', JSON.stringify(data?.user));

      setIsRedirecting(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
        console.error("Login error:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Incorrect email or password");
        } else {
          toast.error("User not found or server error");
        }
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (isRedirecting) {
    return (
       <div className="min-h-screen bg-[#f8f4f3] font-sans text-gray-900 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-lg font-medium">Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
      {/* Left: Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-[630px] sm:w-[80%] px-6 py-10 bg-white shadow-lg rounded-2xl space-y-6">
          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl">
              HUSTLE <span className="bg-blue-600 text-white px-2 rounded-md">HUB</span>
            </h2>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center text-gray-700 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Email Field */}
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />

            {/* Password Field */}
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
            />

            {/* Remember Me */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm sm:text-base text-gray-600"
              >
                Remember Me
              </label>
            </div>

            {/* Forgot Password & Button */}
            <div className="flex flex-row items-center justify-between gap-1 mb-6">
              <Link
                to="/forgot"
                className="text-sm sm:text-base text-blue-500 hover:underline whitespace-nowrap"
              >
                Forgot your password?
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold px-6 py-2.5 rounded-md transition shrink-0 whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Sign up */}
          <div className="text-sm sm:text-base text-center text-blue-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login2;


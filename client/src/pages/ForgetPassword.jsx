import { useState } from 'react'
import { Link } from 'react-router-dom'
import InputField from '../components/InputField'
import PasswordField from '../components/PasswordField'
import forgotImage from '../assets/forget.svg'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import { forgotPassword } from '../api/index.js'


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword != confirmPassword) {
            toast.error('Passwords do not match!')
            return;
        }
        try {
            const { data } = await forgotPassword({
                email,
                newPassword,
            });
            toast.success(data.message || "Password reset!");

            setEmail('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("User not found!");
            } else {
                toast.error("Failed to reset password");
            }
            console.error("Forgot password error", error)
        }
    }
   


    return (
        <motion.div
            initial={{ opacity: 0, y: 30}}
            animate={{ opacity: 1, y: 0}}
            exit= {{ opacity: 0, y: -30 }}
            transition = {{ duration: 0.2 }}
        >
            <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
                {/* Left: Image */}
                <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
                    <img
                    src={forgotImage}
                    alt="Forgot Password Illustration"
                    className="w-full h-auto object-contain"
                    />
                </div>

                {/* Right: Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
                    <div className="max-w-[630px] sm:w-[80%] px-6 py-10 bg-white shadow-lg rounded-2x1 space-y-6">
                        <div className="mb-4 text-center">
                            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl">
                                HUSTLE <span className="bg-blue-600 text-white px-2 rounded-md">HUB</span>
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Enter your email and new password below.
                            </p>
                        </div>
                        

                        <form onSubmit={handleSubmit}>
                            <InputField
                            label="Email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            required
                        />

                        <PasswordField 
                            label="New Password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e)=> setNewPassword(e.target.value)}
                        />

                        <PasswordField 
                            label="Confirm Password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                        />
                        {/* Need change this to merge with backend */}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base py-2.5 rounded-md transition">
                            Reset Password
                        </button>
                        </form>
                        
                        <div className="text-center text-sm sm:text-base text-gray-600">
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Back to Login
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </motion.div>
    )
}

export default ForgotPassword
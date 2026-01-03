import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem("profile") || sessionStorage.getItem("profile"); 
    return isAuthenticated ? <Outlet /> : <Navigate to="/login/" replace/>
    }
export default PrivateRoute
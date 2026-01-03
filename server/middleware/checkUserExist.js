import User from "../models/user.js"

export const checkUserExist = async(req, res, next) => {
    try {
        const {email} =  req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
            success: false,
            message: "User already exists"
            });
        }
        next();
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}
import User from "../models/user.js"
import bcrypt from "bcryptjs"

export const create = async(req, res) => {
    try{
        console.log('Request body:', req.body);
        
        const userData = new User(req.body);
        const savedUser = await userData.save();
        res.status(201).json({
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    }catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({success: false, message: "Internal server error" });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }
        
        // Compare passwords
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }
        // User authenticated successfully
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message || "Internal server error" 
        });
    }
}

export const update = async(req, res) => {
    try {
        const { username } = req.params;
        const { newUsername, email, newPassword, oldPassword } = req.body;
        
        if (!username) {
            return res.status(400).json({
                success: false, 
                message: "Username is required"
            });
        }
        
        // Find the user first (include password for verification)
        const user = await User.findOne({ username }).select('+password');
        
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }
        
        // Build the update object dynamically
        const updateFields = {};
        
        // Handle username update
        if (newUsername) {
            // Check if new username already exists
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    success: false, 
                    message: "Username already taken"
                });
            }
            updateFields.username = newUsername;
        }
        
        // Handle email update
        if (email) {
            // Check if email already exists
            const existingEmail = await User.findOne({ email: email });
            if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    success: false, 
                    message: "Email already in use"
                });
            }
            updateFields.email = email;
        }
        
        // Handle password update
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false, 
                    message: "Old password is required to change password"
                });
            }
            
            // Verify old password using the model's comparePassword method
            const isOldPasswordValid = await user.comparePassword(oldPassword);
            if (!isOldPasswordValid) {
                return res.status(400).json({
                    success: false, 
                    message: "Old password is incorrect"
                });
            }
            
            // Hash the new password manually since findOneAndUpdate doesn't trigger pre-save
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            updateFields.password = hashedPassword;
        }
        
        // Check if there are any fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false, 
                message: "No valid fields provided for update"
            });
        }
        
        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });
        
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const remove = async(req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({
                success: false, 
                message: "Username is required"
            });
        }

        const deletedUser = await User.findOneAndDelete({ username });
        if (!deletedUser) {
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true, 
            message: "Account has been deleted"
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false, 
                message: "User ID is required"
            });
        }

        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(400).json({
                success: false, 
                message: "Email is required"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false, 
                message: "Email does not have an account"
            });
        }

        const{newPassword} = req.body;
        if (!newPassword) {
            return res.status(400).json({
                success: false, 
                message: "New password is required"
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
}
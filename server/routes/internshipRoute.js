import express from "express";
import multer from 'multer';
import {getAll, create, updateStatus, updateInternship, deleteInternship, dismissFollowUp, updateFollowUp, getResume} from "../controllers/internshipController.js";


const route = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();

// Configure file filter to accept only PDF files
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf'){
        cb(null, true);
    } else {
        cb(new Error('Only PDF Files are allowed!'), false)
    }
}

// Configure multer with error handling
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5*1024*1024} // 5MB limit
}).single('resume');

// Wrap multer in custom middleware to handle errors
const handleUpload = (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            return res.status(400).json({ 
                message: "Failed to upload file", 
                error: err.message 
            });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(400).json({ 
                message: "Failed to upload file", 
                error: err.message 
            });
        }
        // Everything went fine
        next();
    });
};

//get all internships (home page)
route.get("/", getAll);

//create new internship
route.post("/", handleUpload, create);

// get resume file
route.get("/:internshipId/resume", getResume);

//update status only
route.patch("/:username/internship/:internshipId/status", updateStatus);

//edit internship details
route.patch("/:username/internship/:internshipId", updateInternship)
//delete internship
route.delete("/:username/internship/:internshipId", deleteInternship);

// dismiss follow-up 
route.patch("/:internshipId/dismiss-follow-up", dismissFollowUp);
// update follow-up date/status
route.patch("/:internshipId/follow-up", updateFollowUp);

export default route;
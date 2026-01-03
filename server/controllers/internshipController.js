import User from "../models/user.js";
import Internship from "../models/internship.js";

export const getAll = async (req, res) => {
    try {
        const internships = await Internship.find();
        res.status(200).json(internships);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const create = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const internshipDataPayload = { ...req.body };

    // ✅ Parse followUpDate correctly
    if (internshipDataPayload.followUpDate === "") {
      delete internshipDataPayload.followUpDate;
    } else if (internshipDataPayload.followUpDate) {
      internshipDataPayload.followUpDate = new Date(internshipDataPayload.followUpDate);
    }

    // ✅ Add resume
    if (req.file) {
      console.log("Request file:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      internshipDataPayload.resume = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    // ✅ Restructure link into `links` array
    if (internshipDataPayload.link) {
      internshipDataPayload.links = [
        { label: "Job Link", url: internshipDataPayload.link },
      ];
      delete internshipDataPayload.link;
    }

    // Ensure user ID is properly set
    if (!internshipDataPayload.user) {
      return res.status(400).json({
        message: "Failed to create internship",
        error: "User ID is required",
      });
    }

    const internshipData = new Internship(internshipDataPayload);
    const savedInternship = await internshipData.save();
    const responseInternship = savedInternship.toObject();

    // ✅ Remove binary data from response
    if (responseInternship.resume) {
      delete responseInternship.resume.data;
    }

    res.status(201).json({
      message: "Internship created successfully",
      internship: responseInternship,
    });
  } catch (error) {
    console.error("Error creating internship:", error);

    if (error.message === "Only PDF files are allowed!") {
      return res.status(400).json({
        message: "Failed to create internship",
        error: "Only PDF files are allowed for resumes.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Failed to create internship due to validation errors",
        error: error.message,
        details: error.errors,
      });
    }

    res.status(500).json({
      message: "Failed to create internship",
      error: error.message,
    });
  }
};

export const updateStatus = async (req, res) => {
    try {
        const {username, internshipId} = req.params;
        const {status} = req.body;

        if(!status){
            return res.status(400).json({message: "Status is required"});
        }
        if (internshipDataPayload.followUpDate === "") {
        delete internshipDataPayload.followUpDate;
        } else if (internshipDataPayload.followUpDate) {
        internshipDataPayload.followUpDate = new Date(internshipDataPayload.followUpDate);
        }
        const internship = await Internship.findById(internshipId);

        if(!internship){
            return res.status(404).json({message: "Internship not found"});
        }
        
        internship.status = status;
        const updatedInternship = await internship.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            internship: updatedInternship
        });
    } catch (error) {
        console.error("Error updating status: ", error);
        res.status(500).json({
            message: "Failed to update status",
            error: error.message
        });
    }
}

export const updateInternship = async (req, res) => {
    try {
        const { username, internshipId } = req.params; 
        const updateData = req.body;

        if (!internshipId) {
        console.error('[updateInternship] Internship ID is undefined in params.');
        return res.status(400).json({
            success: false,
            message: "Internship ID is required in URL parameters."
        });
        }

        const updatedInternshipDoc = await Internship.findByIdAndUpdate(
        internshipId,
        updateData,
        { new: true, runValidators: true }
        );

        if (!updatedInternshipDoc) {
        return res.status(404).json({
            success: false,
            message: "Internship not found with the provided ID."
        });
        }

        res.status(200).json({
        success: true,
        message: "Internship updated successfully",
        internship: updatedInternshipDoc
        });

    } catch (error) {
        console.error("[updateInternship] Error during update: ", error);
        res.status(500).json({
        success: false,
        message: "Failed to update internship",
        error: error.message
        });
    }
    };

export const deleteInternship = async (req, res) => {
    try {
        const{username, internshipId} = req.params;
        const deletedIntern = await Internship.findByIdAndDelete(internshipId);

        if(!deletedIntern){
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Internship deleted successfully"
        })
    } catch (error) {
        console.error('Error deleting internship: ', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}
export const dismissFollowUp = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const updated = await Internship.findByIdAndUpdate(
      internshipId,
      { followUpDismissed: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({
      success: true,
      message: "Follow-up dismissed successfully",
      internship: updated,
    });
  } catch (error) {
    console.error("Error dismissing follow-up:", error);
    res.status(500).json({
      success: false,
      message: "Failed to dismiss follow-up",
      error: error.message,
    });
  }
};
export const updateFollowUp = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { followUpDate, status } = req.body;

    const updatePayload = {};
    if (followUpDate) updatePayload.followUpDate = new Date(followUpDate);
    if (status) updatePayload.status = status;

    const updated = await Internship.findByIdAndUpdate(
      internshipId,
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      internship: updated,
    });
  } catch (error) {
    console.error("Error updating follow-up:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update follow-up",
      error: error.message,
    });
  }
};
export const getResume = async (req, res) => {
  try {
    const { internshipId } = req.params;
    
    const internship = await Internship.findById(internshipId);
    
    if (!internship || !internship.resume || !internship.resume.data) {
      return res.status(404).json({ message: "Resume not found" });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Type', internship.resume.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${internship.resume.fileName}"`);
    
    // Send the resume data
    res.send(internship.resume.data);
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ message: "Error retrieving resume", error: error.message });
  }
};
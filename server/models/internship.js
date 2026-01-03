import mongoose, { now } from "mongoose";
const{Schema, model} = mongoose;

const internshipSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    company:{
        type: String,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    applicationDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    status:{
        type: String,
        enum:['Accepted', 'Withdrawn', 'Rejected', 'Pending', 'Follow Up'],
        default: 'Pending',
        required: true
    },

    followUpDate: {
    type: Date,
    required: false,
    },
    
    followUpDismissed: {
    type: Boolean,
    default: false,
    },
    
    resume:{
        data: Buffer,
        contentType: String,
        fileName: String
    },
    comments:{
        type: String
    },
    links: [{
        label: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^(http|https):\/\/[^ "]+$/.test(v);
                },
                message: props => `${props.value} is not a valid URL!`
            }
        }
    }],
    archived: {
        type: Boolean,
        default: false,
        required: true,
    }
});

const Internship = model('Internship', internshipSchema);
export default Internship;
// mongodb model
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "userId is required"]
    },
    title: {
        type: String,
        default: 'untitled'
    },
    content: {
        type: String,
        default: ''
    },
    tags: [
        {type: String}
    ]
}, {timestamps: true});

const Note = mongoose.model('Note', noteSchema);

export default Note;
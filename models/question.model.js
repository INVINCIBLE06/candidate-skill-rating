import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new mongoose.Schema(
    {
        skillId: 
        { 
            type: Number, 
            required: true 
        },
        difficulty_level: 
        { 
            type: String, 
            enum: ['easy', 'medium', 'hard'], 
            required: true 
        },
        question: 
        { 
            type: String, 
            required: true 
        },
        response: 
        { 
            type: String 
        },
        rating: 
        { 
            type: Number,
            default: 0
        },
        candidate: 
        { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        } 
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Question', QuestionSchema);

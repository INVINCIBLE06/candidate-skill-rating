//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
//      This is a user model file. Which consist of the collection schema of the user collection    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////


import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: 
        { 
            type: String, 
            required: true 
        },
        role: 
        { 
            type: String, 
            enum: ['candidate', 'reviewer'], 
            required: true 
        },
        email:
        {
            type: String, 
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Password hashing before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);

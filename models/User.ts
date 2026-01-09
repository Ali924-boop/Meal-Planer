import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password for this user.'],
    },
    name: {
        type: String,
    },
    // We store the IDs of blocked meals. 
    // Since meal IDs will be deterministic based on date+slot, this is sufficient.
    blockedMeals: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

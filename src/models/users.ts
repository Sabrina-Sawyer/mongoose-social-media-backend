import { Schema, Types, model, type Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    thoughts?: Types.ObjectId[];
    friends?: Types.ObjectId[];
    // friendCount?: number;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought',
        },
    ],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
},
{
    toJSON: {
        virtuals: true,
    },
}
);

UserSchema.virtual('friendCount').get(function() {
    return this.friends?.length;
});

const User = model('User', UserSchema);

export default User;


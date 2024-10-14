import { Schema, Types, model, Document } from 'mongoose';

interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    userId: Schema.Types.ObjectId; // Add this line
    reactions?: IReaction[];
}

const ReactionSchema = new Schema<IReaction>({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date) => new Date(timestamp),
    },
}, {
    toJSON: {
        getters: true,
    },
    _id: false,
});

const ThoughtSchema = new Schema<IThought>({
    thoughtText: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp: Date) => new Date(timestamp),
    },
    username: {
        type: String,
        required: true,
    },
    userId: { // Add this field to store the user's ID
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    reactions: [ReactionSchema],
});

// ThoughtSchema.virtual('reactionCount').get(function(this: IThought) {
//     return this.reactions?.length;
// });

const Thought = model<IThought>('Thought', ThoughtSchema);

export default Thought;
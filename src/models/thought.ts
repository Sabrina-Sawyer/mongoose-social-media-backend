import { Schema, Types, model, type Document } from 'mongoose';

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
},
{
    toJSON: {
        getters: true,
    },
    _id: false,
}
);

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
    reactions: [ReactionSchema],
});

// ThoughtSchema('reactionCount').get(function(this: IThought) {
//     return this.reactions?.length;
// });

const Thought = model('Thought', ThoughtSchema);

export default Thought;
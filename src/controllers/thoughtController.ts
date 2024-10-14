import User from "../models/users.js";
import Thought from '../models/thought.js';
import { Request, Response } from 'express';

// GET all thoughts
export const getAllThoughts = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const thoughts = await Thought.find();
        return res.json(thoughts);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// GET a single thought by its _id
export const getThoughtById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

export const createThought = async (req: Request, res: Response): Promise<Response> => {
    console.log('Incoming request body:', req.body); // Log the request body for debugging

    try {
        const { userId, thoughtText, username } = req.body; // Destructure userId and thoughtText

        if (!userId || !thoughtText || !username) {
            return res.status(400).json({ message: 'User ID, thought text, and username are required.' });
        }

        // Step 1: Create the new thought
        const thought = await Thought.create({ userId, thoughtText, username });

        // Step 2: Find the user and push the new thought's ID to the user's 'thoughts' array
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        if (!user) {
            // If the user is not found, delete the thought to prevent orphaned data
            await Thought.findByIdAndDelete(thought._id);
            return res.status(404).json({ message: 'User not found!' });
        }

        // Step 3: Return the created thought
        return res.status(201).json(thought);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// PUT to update a thought by its _id
export const updateThought = async (req: Request, res: Response): Promise<Response> => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// DELETE to remove a thought by its _id
export const deleteThought = async (req: Request, res: Response): Promise<Response> => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json({ message: 'Thought successfully deleted!' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// POST to add a reaction to a thought's reaction array
export const addReaction = async (req: Request, res: Response): Promise<Response> => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $addToSet: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// DELETE to remove a reaction by the reaction's reactionId value
export const removeReaction = async (req: Request, res: Response): Promise<Response> => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: (error as any).message });
    }
};

// export const getAllThoughts = async (_req: Request, res: Response) => {
//     try {
//         const thoughts = await Thought.find();
//         res.json(thoughts);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // GET a single thought by its _id
// export const getThoughtById = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findOne({ _id: req.params.id });
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // Create a new thought
// export const createThought = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.create(req.body);
//         res.json(thought);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // Update a thought by its _id
// export const updateThought = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // DELETE to remove a thought by its _id
// export const deleteThought = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // Add a reaction to a thought reaction array
// export const addReaction = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findById(
//             req.params.thoughtId,
//             { $addToSet: { reactions: req.body } },
//             { new: true }
//         );
//         if (!thought) {
//             res.status(404).json({ message: 'No thought found with this id!' });
//             return;
//         }
//         res.json(thought);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // Remove a reaction by the reaction's reactionId value
// export const removeReaction = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findById(req.params.thoughtId);
//         if (!thought) return res.status(404).json({ message: 'Thought not found' });

//         await Thought.updateOne(
//             { _id: req.params.thoughtId },
//             { $pull: { reactions: { reactionId: req.params.reactionId } } }
//         );
//         return res.json(thought);
//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json(error);
//     }
// };

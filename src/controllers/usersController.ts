import User from '../models/users.js';
import Thought from '../models/thought.js';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

// GET all users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        console.log('Get all users');
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// GET a single user by its _id and populated thought and friend data

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('req.params:', req.params); // Debug log

        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'User ID is missing!' });
            return;
        }

        // Validate if `userId` is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID format!' });
            return;
        }

        const user = await User.findById(userId)
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            console.log('User not found with this ID:', userId);
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


// POST a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
        // res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID format!' });
            return;
        }

        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// DELETE to remove user by ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID format!' });
            return;
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }

        // Delete all thoughts associated with the user
        await Thought.deleteMany({ username: user.username });

        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// POST to add a new friend to a user's friend list
export const addFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, friendId } = req.params;

        // Validate userId and friendId format
        if (
            !mongoose.Types.ObjectId.isValid(userId) || 
            !mongoose.Types.ObjectId.isValid(friendId)
        ) {
            res.status(400).json({ message: 'Invalid user or friend ID format!' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// DELETE to remove a friend from a user's friend list
export const removeFriend = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, friendId } = req.params;

        // Validate userId and friendId format
        if (
            !mongoose.Types.ObjectId.isValid(userId) || 
            !mongoose.Types.ObjectId.isValid(friendId)
        ) {
            res.status(400).json({ message: 'Invalid user or friend ID format!' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'No user found with this ID!' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ error: (error as Error).message });
    }
};

// PUT to update a user by its _id
// export const updateUser = async (req: Request, res: Response) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//         if (!user) {
//             res.status(404).json({ message: 'No user found with this id!' });
//             return;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // DELETE to remove user by its _id
// export const deleteUser = async (req: Request, res: Response) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.userId);
//         if (!user) {
//             res.status(404).json({ message: 'No user found with this id!' });
//             return;
//         }
//         await Thought.deleteMany({ username: user.username });
//         res.json({ message: 'User and associated thoughts deleted!' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// };

// // POST to add a new friend to a user's friend list
// export const addFriend = async (req: Request, res: Response) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             { _id: req.params.userId },
//             { $push: { friends: req.params.friendId } },
//             { new: true }
//         );
//         if (!user) {
//             res.status(404).json({ message: 'No user found with this id!' });
//             return;
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json(error);
//     }
// }

// // DELETE to remove a friend from a user's friend list  
// export const removeFriend = async (req: Request, res: Response) => {
//     try {
//         const user = await User.findByIdAndUpdate(
//             { _id: req.params.userId },
//             { $pull: { friends: req.params.friendId } },
//             { new: true }
//         );
//         if (!user) {
//             res.status(404).json({ message: 'No user found with this id!' });
//             return;
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: (error as any).message });
//     }
// };

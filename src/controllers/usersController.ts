import User from '../models/users.js';
import Thought from '../models/thought.js';
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

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate('thoughts').populate('friends');
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// POST a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// PUT to update a user by its _id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// DELETE to remove user by its _id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        await Thought.deleteMany({ username: user.username });
        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// POST to add a new friend to a user's friend list
export const addFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $push: { friends: req.params.friendId } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
}

// DELETE to remove a friend from a user's friend list  
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: (error as any).message });
    }
};

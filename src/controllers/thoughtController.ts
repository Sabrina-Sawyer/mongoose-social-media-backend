import User from "../models/users";
import Thought from "../models/thought";
import { Request, Response } from 'express';

export const getAllThoughts = async (req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// GET a single thought by its _id
export const getThoughtById = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.id });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// Create a new thought
export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);
        res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// Update a thought by its _id
export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// DELETE to remove a thought by its _id
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// Add a reaction to a thought reaction array
export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findById(
            req.params.thoughtId,
            { $addToSet: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

// Remove a reaction by the reaction's reactionId value
export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });

        await Thought.updateOne(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } }
        );
        res.json(thought);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

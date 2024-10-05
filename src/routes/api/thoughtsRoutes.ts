import { Router } from 'express';
import {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} from '../../controllers/thoughtController';

const router = Router();

router.route('/').get(getAllThoughts).post(createThought);

router
    .route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

    router.route('/:thoughtId/reactions').post(addReaction);

    router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

    export { router as thoughtRouter };
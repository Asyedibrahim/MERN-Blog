import express from 'express';
import { createComment, getComments, likeComment, editComment, deleteComment,getAllComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js'


const router = express.Router();

router.post('/create', verifyToken , createComment);
router.get('/getComments/:postId', getComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getAllComments', verifyToken, getAllComments)

export default router;
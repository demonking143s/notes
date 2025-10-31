import express from 'express';
import producter from '../middleware/producter.js';
import { addNotes, deleteNotes, editNotes, viewNotes, viewNote } from '../controller/notes.controller.js';

const router = express.Router();

router.post('/add', producter, addNotes);
router.get('/view',producter, viewNotes);
router.get('/view/:id',producter, viewNote);
router.put('/edit/:id',editNotes);
router.delete('/delete/:id',deleteNotes);

export default router;
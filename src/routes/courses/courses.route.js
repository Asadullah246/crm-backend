import express from 'express';
import { getCourses } from './course.controler.js';
const router = express.Router();

router.get('/allcourse',getCourses )

export default router;
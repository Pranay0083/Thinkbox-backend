const express = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleBasedMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.post('/', auth, roleBasedMiddleware(['teacher', 'admin']), courseController.createCourse);
router.put('/:id', auth, roleBasedMiddleware(['teacher', 'admin']), courseController.updateCourse);
router.delete('/:id', auth, roleBasedMiddleware(['teacher', 'admin']), courseController.deleteCourse);

module.exports = router;

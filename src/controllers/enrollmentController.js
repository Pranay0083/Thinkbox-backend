const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).populate('course', 'title');
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

exports.createEnrollment = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: course.id });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ user: req.user.id, course: course.id });
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({ user: req.user.id, course: req.params.courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

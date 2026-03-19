const Course = require('../models/Course');
const Payment = require('../models/Payment');

exports.createPaymentSession = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const payment = await Payment.create({
      user: req.user.id,
      course: courseId,
      amount: course.price,
      status: 'pending',
    });

    res.status(201).json({ message: 'Payment session created', paymentId: payment._id });
  } catch (error) {
    next(error);
  }
};

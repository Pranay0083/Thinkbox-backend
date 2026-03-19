const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  image: { type: String, validate: {
    validator: (url) => /^https?:\/\//.test(url),
    message: 'Image URL must be a valid HTTP(S) URL'
  }},
  expertise: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  students: { type: Number, min: 0 },
  courses: { type: Number, min: 0 },
  bio: { type: String },
  about: { type: String },
  achievements: [{ type: String }],
  socialLinks: {
    linkedin: { type: String, validate: {
      validator: (url) => /^https?:\/\//.test(url),
      message: 'LinkedIn URL must be a valid HTTP(S) URL'
    }},
    twitter: { type: String, validate: {
      validator: (url) => /^https?:\/\//.test(url),
      message: 'Twitter URL must be a valid HTTP(S) URL'
    }},
  },
  email: { type: String, required: true, validate: {
    validator: (email) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
    message: 'Invalid email address'
  }}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
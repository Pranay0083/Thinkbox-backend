const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const User = require('../models/User');
const jwt = require('../utils/jwtUtils')

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      expertise,
      rating,
      role,
      students,
      courses,
      bio,
      about,
      achievements,
      socialLinks
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password_hash: hashedPassword,
      image,
      expertise,
      rating,
      role,
      students,
      courses,
      bio,
      about,
      achievements,
      socialLinks
    });
    await user.save().catch((saveError) => {
      console.error('Error saving user:', saveError);
      throw saveError;
    });
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user doesn't Exist with this mail" });
    }
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.generateToken(user)
    res.status(200).json({ message: 'Login successful', userId: user._id, token: token });
  } catch (error) {
    console.log("Failed login", error);
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
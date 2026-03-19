const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const User = require('../models/User');
const jwt = require('../utils/jwtUtils');
const logger = require('../utils/logger');

const ALLOWED_REGISTER_FIELDS = [
  'name', 'email', 'password', 'image', 'expertise',
  'bio', 'about', 'achievements', 'socialLinks',
];

function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (obj[key] !== undefined) result[key] = obj[key];
  }
  return result;
}

exports.register = async (req, res) => {
  try {
    const fields = pick(req.body, ALLOWED_REGISTER_FIELDS);

    if (!fields.name || !fields.email || !fields.password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (fields.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email: fields.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(fields.password);
    const user = new User({
      ...fields,
      password_hash: hashedPassword,
      role: 'student',
    });
    delete user.password;

    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    logger.error({ err: error }, 'Registration failed');
    res.status(400).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.generateToken(user);
    res.status(200).json({ message: 'Login successful', userId: user._id, token });
  } catch (error) {
    logger.error({ err: error }, 'Login failed');
    res.status(500).json({ message: 'Login error' });
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
    logger.error({ err: error }, 'getMe failed');
    res.status(500).json({ message: 'Server error' });
  }
};

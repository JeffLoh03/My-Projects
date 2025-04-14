const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In production, this should be hashed
    isAdmin: true
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123', // In production, this should be hashed
    isAdmin: false
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});

    // Insert new data
    await User.insertMany(users);
    console.log('Sample users added');

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
/**
 * MongoDB Seed Script
 * Run this to populate sample data into MongoDB
 * 
 * Usage: node sql/seedMongoDB.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/TaskManager';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 250 },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      required: true,
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

const sampleTasks = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the API endpoints',
    status: 'in-progress',
    dueDate: new Date('2024-06-15'),
  },
  {
    title: 'Review pull requests',
    description: 'Review pending PRs from team members',
    status: 'pending',
    dueDate: new Date('2024-06-10'),
  },
  {
    title: 'Deploy to production',
    description: 'Deploy the latest release to production environment',
    status: 'pending',
    dueDate: new Date('2024-06-20'),
  },
  {
    title: 'Fix bug in authentication',
    description: 'Fix the token expiration issue in the auth module',
    status: 'in-progress',
    dueDate: new Date('2024-06-05'),
  },
  {
    title: 'Update dependencies',
    description: 'Update npm packages to latest stable versions',
    status: 'pending',
    dueDate: new Date('2024-06-25'),
  },
  {
    title: 'Write unit tests',
    description: 'Increase test coverage for the task service',
    status: 'completed',
    dueDate: new Date('2024-06-01'),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert sample tasks
    const result = await Task.insertMany(sampleTasks);
    console.log(`Successfully inserted ${result.length} sample tasks`);

    // Display inserted tasks
    const tasks = await Task.find();
    console.log('\nInserted tasks:');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (ID: ${task._id})`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

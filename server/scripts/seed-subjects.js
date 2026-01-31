import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';

dotenv.config();

const seedSubjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_performance');
    console.log('MongoDB connected...');

    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Existing subjects cleared...');

    // Create default subjects
    const defaultSubjects = [
      {
        name: 'Mathematics',
        code: 'MATH101',
        teacher: 'Dr. Sarah Johnson',
        credits: 4,
        semester: '1st',
        description: 'Introduction to calculus and algebra'
      },
      {
        name: 'Physics',
        code: 'PHYS101',
        teacher: 'Prof. Michael Chen',
        credits: 4,
        semester: '1st',
        description: 'Fundamentals of mechanics and thermodynamics'
      },
      {
        name: 'Computer Science',
        code: 'CS101',
        teacher: 'Dr. Emily Davis',
        credits: 3,
        semester: '1st',
        description: 'Introduction to programming and algorithms'
      }
    ];

    // Insert subjects
    const createdSubjects = await Subject.insertMany(defaultSubjects);
    console.log(`${createdSubjects.length} subjects created successfully:`, createdSubjects.map(s => s.name));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding subjects:', error);
    process.exit(1);
  }
};

seedSubjects();
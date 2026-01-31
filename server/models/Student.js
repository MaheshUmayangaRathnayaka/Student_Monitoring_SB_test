import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  zScore: {
    type: Number,
    min: [0, 'Z-Score must be at least 0'],
    max: [4, 'Z-Score cannot exceed 4'],
    default: 0
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    trim: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);

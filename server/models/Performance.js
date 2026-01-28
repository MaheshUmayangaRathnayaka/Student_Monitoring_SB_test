import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required']
  },
  marks: {
    internal: {
      type: Number,
      min: [0, 'Internal marks cannot be negative'],
      max: [50, 'Internal marks cannot exceed 50'],
      default: 0
    },
    finals: {
      type: Number,
      min: [0, 'Final marks cannot be negative'],
      max: [100, 'Final marks cannot exceed 100'],
      default: 0
    },
    total: {
      type: Number,
      min: [0, 'Total marks cannot be negative'],
      max: [150, 'Total marks cannot exceed 150'],
      default: 0
    }
  },
  attendance: {
    present: {
      type: Number,
      default: 0,
      min: [0, 'Present days cannot be negative']
    },
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total days cannot be negative']
    },
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Attendance percentage cannot be negative'],
      max: [100, 'Attendance percentage cannot exceed 100']
    }
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'I'],
    default: 'I'
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    trim: true
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Calculate total marks before saving
performanceSchema.pre('save', function(next) {
  this.marks.total = this.marks.internal + this.marks.finals;
  
  // Calculate attendance percentage
  if (this.attendance.total > 0) {
    this.attendance.percentage = Math.round((this.attendance.present / this.attendance.total) * 100);
  }
  
  // Auto-calculate grade based on total marks
  const percentage = (this.marks.total / 150) * 100;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B+';
  else if (percentage >= 60) this.grade = 'B';
  else if (percentage >= 50) this.grade = 'C+';
  else if (percentage >= 40) this.grade = 'C';
  else if (percentage >= 33) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

// Compound index to ensure one performance record per student-subject-semester combination
performanceSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

export default mongoose.model('Performance', performanceSchema);

import sequelize from './config/database.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Admin from './models/Admin.js';
import Notice from './models/Notice.js';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Reset DB
    console.log('✅ Database Synced');

    // 1. Insert Users
    const users = await User.bulkCreate([
      // Students
      { full_name: 'Rahul Patil', username: 'rahul.patil', password: 'rahul123', role: 'student', branch: 'CSE' },
      { full_name: 'Priya Sharma', username: 'priya.sharma', password: 'priya123', role: 'student', branch: 'CSBS' },
      { full_name: 'Amit Kumar', username: 'amit.kumar', password: 'amit123', role: 'student', branch: 'CSE' },
      { full_name: 'Neha Joshi', username: 'neha.joshi', password: 'neha123', role: 'student', branch: 'CSBS' },
      { full_name: 'Rohan Verma', username: 'rohan.verma', password: 'rohan123', role: 'student', branch: 'CSE' },
      
      // Faculty
      { full_name: 'Dr. Mehta', username: 'dr.mehta', password: 'mehta123', role: 'faculty', branch: 'CSE' },
      { full_name: 'Prof. Iyer', username: 'prof.iyer', password: 'iyer123', role: 'faculty', branch: 'CSBS' },
      { full_name: 'Dr. Kulkarni', username: 'dr.kulkarni', password: 'kulk123', role: 'faculty', branch: 'CSE' },

      // Admin
      { full_name: 'HOD Computer Science', username: 'hod.cse', password: 'admin123', role: 'admin', branch: 'CSE' }
    ]);

    // 2. Insert Student Details
    await Student.bulkCreate([
      { user_id: 1, student_code: 'CSE24201010153', year: 3, attendance_percent: 72 },
      { user_id: 2, student_code: 'CSBS24201010154', year: 2, attendance_percent: 80 },
      { user_id: 3, student_code: 'CSE24201010155', year: 4, attendance_percent: 68 },
      { user_id: 4, student_code: 'CSBS24201010156', year: 1, attendance_percent: 85 },
      { user_id: 5, student_code: 'CSE24201010157', year: 3, attendance_percent: 74 }
    ]);

    // 3. Insert Faculty Details
    await Faculty.bulkCreate([
      { user_id: 6, department: 'CSE' },
      { user_id: 7, department: 'CSBS' },
      { user_id: 8, department: 'CSE' }
    ]);

    // 4. Insert Admin Details
    await Admin.bulkCreate([
      { user_id: 9, department: 'CSE' }
    ]);

    // 5. Insert Notices
    await Notice.bulkCreate([
      {
        title: 'Internal Exam Form Deadline',
        description: 'Last date to fill internal exam form.',
        type: 'exam',
        created_by: 6,
        target_branch: 'CSE',
        deadline: '2026-02-10 23:59:00',
        is_emergency: false,
        expires_at: '2026-02-11 00:00:00'
      },
      {
        title: 'Assignment Submission – Data Structures',
        description: 'Submit Assignment 3.',
        type: 'assignment',
        created_by: 6,
        target_branch: 'CSE',
        deadline: '2026-02-06 23:59:00',
        is_emergency: false,
        expires_at: '2026-02-07 00:00:00'
      },
      {
        title: 'Entrepreneurship Club Orientation',
        description: 'Orientation for new members.',
        type: 'event',
        created_by: 7,
        target_branch: 'CSBS',
        deadline: '2026-02-07 18:00:00',
        is_emergency: false,
        expires_at: '2026-02-08 00:00:00'
      },
      {
        title: 'Attendance Warning – Below 75%',
        description: 'Students below 75% attendance.',
        type: 'admin',
        created_by: 9,
        target_branch: 'CSE',
        deadline: null,
        is_emergency: false,
        expires_at: '2026-02-15 00:00:00'
      },
      {
        title: 'College Closed Tomorrow',
        description: 'College will remain closed tomorrow.',
        type: 'admin',
        created_by: 9,
        target_branch: null, // For all
        deadline: null,
        is_emergency: true,
        expires_at: '2026-02-04 23:59:00'
      }
    ]);

    console.log('✅ Sample Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();

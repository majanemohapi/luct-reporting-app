const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mpoetsimohapi',
  database: 'luct_reportings'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const logMonitoring = (userId, action) => {
  db.query(
    'INSERT INTO monitoring (user_id, action, timestamp) VALUES (?, ?, NOW())',
    [userId, action]
  );
};

// --- AUTH ROUTES ---

app.post('/api/register', async (req, res) => {
  const { username, password, role, faculty } = req.body;
  if (!username || !password || !role || !faculty)
    return res.status(400).json({ message: 'All fields required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (username, password, role, faculty) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, role, faculty],
    (err) => {
      if (err) return res.status(400).json({ message: 'Username exists' });
      res.json({ message: 'Registration successful' });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    logMonitoring(user.id, `User ${username} logged in`);
    res.json({ token, role: user.role });
  });
});

// --- USERS ---
app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'pl')
    return res.status(403).json({ message: 'Unauthorized' });

  const role = req.query.role;
  db.query('SELECT id, username FROM users WHERE role = ?', [role], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

// --- REPORTS ---
app.post('/api/reports', authenticateToken, (req, res) => {
  if (req.user.role !== 'lecturer')
    return res.status(403).json({ message: 'Unauthorized' });

  const { faculty_name, class_id, week, date, course_id, actual_students_present, venue, scheduled_time, topic_taught, learning_outcomes, recommendations } = req.body;

  db.query('SELECT total_registered_students FROM courses WHERE id = ?', [course_id], (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: 'Invalid course' });

    const total_registered_students = results[0].total_registered_students;
    db.query(
      'INSERT INTO reports (faculty_name, class_id, week, date, course_id, lecturer_id, actual_students_present, total_registered_students, venue, scheduled_time, topic_taught, learning_outcomes, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [faculty_name, class_id, week, date, course_id, req.user.id, actual_students_present, total_registered_students, venue, scheduled_time, topic_taught, learning_outcomes, recommendations],
      (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        logMonitoring(req.user.id, 'Submitted report');
        res.json({ message: 'Report submitted' });
      }
    );
  });
});

app.get('/api/reports', authenticateToken, (req, res) => {
  let query = 'SELECT r.*, u.username AS lecturer_name, c.name AS course_name, c.code AS course_code FROM reports r JOIN users u ON r.lecturer_id = u.id JOIN courses c ON r.course_id = c.id';
  const params = [];
  if (req.user.role === 'lecturer') {
    query += ' WHERE r.lecturer_id = ?';
    params.push(req.user.id);
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

app.put('/api/reports/:id/feedback', authenticateToken, (req, res) => {
  if (req.user.role !== 'prl')
    return res.status(403).json({ message: 'Unauthorized' });

  const { feedback } = req.body;
  db.query('UPDATE reports SET prl_feedback = ? WHERE id = ?', [feedback, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    logMonitoring(req.user.id, `Added feedback to report ${req.params.id}`);
    res.json({ message: 'Feedback added' });
  });
});




// Fetch users with role 'lecturer' (or 'lecture') for displaying as lectures
app.get('/api/lecturers', authenticateToken, (req, res) => {
  // Optional: restrict access to certain roles
  if (req.user.role !== 'pl' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  db.query('SELECT id, username, faculty FROM users WHERE role = "lecturer"', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});




// --- COURSES ---
app.post('/api/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'pl')
    return res.status(403).json({ message: 'Unauthorized' });

  const { name, code, semester, total_registered_students } = req.body;
  db.query(
    'INSERT INTO courses (name, code, semester, total_registered_students) VALUES (?, ?, ?, ?)',
    [name, code, semester, total_registered_students],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      logMonitoring(req.user.id, `Added course ${name}`);
      res.json({ message: 'Course added' });
    }
  );
});

app.get('/api/courses', authenticateToken, (req, res) => {
  db.query(
    'SELECT c.*, u.username AS lecturer_name FROM courses c LEFT JOIN users u ON c.assigned_lecturer_id = u.id',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

app.put('/api/courses/:id/assign', authenticateToken, (req, res) => {
  if (req.user.role !== 'pl')
    return res.status(403).json({ message: 'Unauthorized' });

  const { lecturer_id } = req.body;
  db.query(
    'UPDATE courses SET assigned_lecturer_id = ? WHERE id = ?',
    [lecturer_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      logMonitoring(req.user.id, `Assigned lecturer to course ${req.params.id}`);
      res.json({ message: 'Lecturer assigned' });
    }
  );
});

// --- CLASSES ---
app.post('/api/classes', authenticateToken, (req, res) => {
  if (!['lecturer', 'pl'].includes(req.user.role))
    return res.status(403).json({ message: 'Unauthorized' });

  const { course_id, class_name, venue, scheduled_time } = req.body;
  db.query(
    'INSERT INTO classes (course_id, class_name, venue, scheduled_time) VALUES (?, ?, ?, ?)',
    [course_id, class_name, venue, scheduled_time],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      logMonitoring(req.user.id, `Added class ${class_name}`);
      res.json({ message: 'Class added' });
    }
  );
});

app.get('/api/classes', authenticateToken, (req, res) => {
  db.query(
    'SELECT c.*, co.name AS course_name FROM classes c JOIN courses co ON c.course_id = co.id',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
});

// --- RATINGS ---
app.post('/api/ratings', authenticateToken, (req, res) => {
  const { report_id, rating, comments } = req.body;
  db.query(
    'INSERT INTO ratings (report_id, rater_id, rating, comments) VALUES (?, ?, ?, ?)',
    [report_id, req.user.id, rating, comments],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      logMonitoring(req.user.id, `Rated report ${report_id}`);
      res.json({ message: 'Rating added' });
    }
  );
});

// --- MONITORING ---
app.get('/api/monitoring', authenticateToken, (req, res) => {
  let query = 'SELECT m.*, u.username FROM monitoring m JOIN users u ON m.user_id = u.id';
  const params = [];
  if (['student', 'lecturer'].includes(req.user.role)) {
    query += ' WHERE m.user_id = ?';
    params.push(req.user.id);
  }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

// --- SEARCH ---
app.get('/api/search/:type', authenticateToken, (req, res) => {
  const { type } = req.params;
  const { query } = req.query;
  let sql, params;

  switch (type) {
    case 'reports':
      sql = 'SELECT r.*, u.username AS lecturer_name, c.name AS course_name, c.code AS course_code FROM reports r JOIN users u ON r.lecturer_id = u.id JOIN courses c ON r.course_id = c.id WHERE r.topic_taught LIKE ? OR r.week LIKE ?';
      params = [`%${query}%`, `%${query}%`];
      if (req.user.role === 'lecturer') {
        sql += ' AND r.lecturer_id = ?';
        params.push(req.user.id);
      }
      break;

    case 'courses':
      sql = 'SELECT c.*, u.username AS lecturer_name FROM courses c LEFT JOIN users u ON c.assigned_lecturer_id = u.id WHERE c.name LIKE ? OR c.code LIKE ?';
      params = [`%${query}%`, `%${query}%`];
      break;

    case 'classes':
      sql = 'SELECT c.*, co.name AS course_name FROM classes c JOIN courses co ON c.course_id = co.id WHERE c.class_name LIKE ? OR co.name LIKE ?';
      params = [`%${query}%`, `%${query}%`];
      break;

    default:
      return res.status(400).json({ message: 'Invalid search type' });
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

// --- EXPORT REPORT TO EXCEL ---
app.get('/api/reports/:id/excel', authenticateToken, async (req, res) => {
  db.query(
    'SELECT r.*, u.username AS lecturer_name, c.name AS course_name, c.code AS course_code, cl.class_name FROM reports r JOIN users u ON r.lecturer_id = u.id JOIN courses c ON r.course_id = c.id JOIN classes cl ON r.class_id = cl.id WHERE r.id = ?',
    [req.params.id],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ message: 'Report not found' });

      const report = results[0];
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      worksheet.columns = [
        { header: 'Faculty Name', key: 'faculty_name' },
        { header: 'Class Name', key: 'class_name' },
        { header: 'Week', key: 'week' },
        { header: 'Date', key: 'date' },
        { header: 'Course Name', key: 'course_name' },
        { header: 'Course Code', key: 'course_code' },
        { header: 'Lecturer', key: 'lecturer_name' },
        { header: 'Actual Students Present', key: 'actual_students_present' },
        { header: 'Total Registered Students', key: 'total_registered_students' },
        { header: 'Venue', key: 'venue' },
        { header: 'Scheduled Time', key: 'scheduled_time' },
        { header: 'Topic Taught', key: 'topic_taught' },
        { header: 'Learning Outcomes', key: 'learning_outcomes' },
        { header: 'Recommendations', key: 'recommendations' },
        { header: 'PRL Feedback', key: 'prl_feedback' }
      ];

      worksheet.addRow(report);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=report_${req.params.id}.xlsx`);
      await workbook.xlsx.write(res);
      res.end();
    }
  );
});

app.listen(5000, () => console.log('Server running on port 5000'));
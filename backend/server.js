const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');

// Debug file paths - ADD THIS AT THE TOP
console.log('Current directory:', __dirname);
console.log('Users file path:', USERS_FILE);
console.log('Submissions file path:', SUBMISSIONS_FILE);
console.log('Questions file path:', QUESTIONS_FILE);

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist, creating empty array`);
      writeJSON(filePath, []);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`Reading ${filePath}:`, data); // Debug log
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    console.log(`Writing to ${filePath}:`, data); // Debug log
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
}

// Ensure files exist on startup - ADD THIS HERE
const users = readJSON(USERS_FILE);
const submissions = readJSON(SUBMISSIONS_FILE);
console.log('Initial users:', users);
console.log('Initial submissions:', submissions);

// 🔐 Middleware: Require login before accessing protected routes
function requireLogin(req, res, next) {
  const email = req.headers['x-user-email'];
  if (!email) {
    return res.status(401).json({ error: 'Email header (x-user-email) required' });
  }

  const users = readJSON(USERS_FILE);
  const isLoggedIn = users.some(user => user.email === email);

  if (!isLoggedIn) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  next();
}

// ✅ Debug users route - ADD THIS BEFORE PROTECTED ROUTES
app.get('/api/debug-users', (req, res) => {
  const users = readJSON(USERS_FILE);
  res.json({
    totalUsers: users.length,
    users: users
  });
});

// ✅ Record user login - REPLACE THE DUPLICATE WITH THIS SINGLE VERSION
app.post('/api/login', (req, res) => {
  const { name, email } = req.body;
  console.log('Login attempt:', { name, email }); // Add this line
  
  if (!email || !name) return res.status(400).json({ error: 'Name and Email required' });

  const users = readJSON(USERS_FILE);
  console.log('Current users before login:', users); // Add this line
  
  const existingUser = users.find(u => u.email === email);
  const now = new Date().toISOString();

  if (existingUser) {
    existingUser.lastLogin = now;
    existingUser.name = name; // update name if changed
    console.log('Updated existing user:', existingUser); // Add this line
  } else {
    const newUser = { name, email, lastLogin: now };
    users.push(newUser);
    console.log('Added new user:', newUser); // Add this line
  }

  writeJSON(USERS_FILE, users);
  console.log('Users after login:', users); // Add this line
  res.json({ message: 'Login recorded' });
});

// ✅ Protected: Serve questions only if logged in
app.get('/api/questions', requireLogin, (req, res) => {
  const questions = readJSON(QUESTIONS_FILE);
  res.json(questions);
});

// ✅ Save test submissions
app.post('/api/submit', (req, res) => {
  const { user, answers } = req.body;
  if (!user || !answers) return res.status(400).json({ error: 'User and answers required' });

  const submissions = readJSON(SUBMISSIONS_FILE);
  submissions.push({
    user,
    answers,
    submittedAt: new Date().toISOString()
  });

  writeJSON(SUBMISSIONS_FILE, submissions);
  res.json({ message: 'Submission saved' });
});

// ✅ List all logged in users (admin)
app.get('/api/users', (req, res) => {
  const users = readJSON(USERS_FILE);
  res.json(users);
});

// ✅ List all submissions (admin)
app.get('/api/submissions', (req, res) => {
  const submissions = readJSON(SUBMISSIONS_FILE);
  res.json(submissions);
});

// ADD THIS HEALTH CHECK ROUTE
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
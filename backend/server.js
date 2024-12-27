import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, always use an environment variable

// In-memory storage (replace with a database in production)
let users = [
  { id: 1, username: 'admin', password: '$2b$10$8OxDEQHXRrX9BvD0uGINGe4UPlOBrW3tANOPxgKPTFl0kkVP7RnvK' } // password: 'adminpassword'
];
let announcement = '';

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ accessToken });
  } else {
    res.status(401).send('Username or password incorrect');
  }
});

// Get announcement
app.get('/api/announcement', (req, res) => {
  res.json({ announcement });
});

// Update announcement (protected route)
app.post('/api/announcement', authenticateToken, (req, res) => {
  const { text } = req.body;
  announcement = text;
  res.json({ message: 'Announcement updated successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to hash a password (use this to generate new admin passwords)
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashedPassword);
}

// Uncomment and run this function to generate a new hashed password
hashPassword('arbeauty2309');
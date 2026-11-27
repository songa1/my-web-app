require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); // Required to parse JSON request bodies

// Replace with a strong secret in your .env file (e.g., JWT_SECRET=supersecretkey)
const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret-change-me";

// Temporary storage (replace with your database model later)
const users = [];

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to my api!" });
});

// 1. Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully" });
});

// 2. Log in and issue a token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  // Verify user exists and password matches
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create a token valid for 1 hour
  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// 3. Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expects "Bearer <TOKEN>"

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 4. Example protected route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome back, ${req.user.username}!` });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

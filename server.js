const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, 'courses.html'));
});

app.get('/course-detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'course-detail.html'));
});

app.get('/commission', (req, res) => {
    res.sendFile(path.join(__dirname, 'commission.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/blog-detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-detail.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/resources', (req, res) => {
    res.sendFile(path.join(__dirname, 'resources.html'));
});

// Proxy PHP API requests
app.use('/php', express.static(path.join(__dirname, 'php')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


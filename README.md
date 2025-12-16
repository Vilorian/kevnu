# Kevin Courses - Course Platform Website

A modern, professional course platform website for web development and UI/UX design courses with commission services. Built with HTML5, modern CSS, JavaScript, and PHP backend.

## Features

- **Course Management**: Browse, view, and enroll in courses
- **Student Dashboard**: Track progress, view enrolled courses
- **Commission System**: Multi-step quote request form for custom projects
- **Blog System**: Read and manage blog posts
- **Authentication**: User registration, login, and session management
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Soft white & green color palette with smooth animations
- **Ornate Typography**: Decorative "Kevin" text using Cinzel Decorative font

## Requirements

- Node.js 14+ and npm
- PHP 7.4 or higher (for backend API)
- MySQL 5.7 or higher / MariaDB 10.3 or higher
- Apache/Nginx web server (for PHP)

## Installation

1. **Clone or download the project**
   ```bash
   cd kevincourses
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database
   - Import the schema: `database/schema.sql`
   - Update database credentials in `php/config/database.php`

4. **Configure the application**
   - Update `php/config/config.php` with your settings
   - Set `APP_URL` to `http://localhost:3000`
   - Configure database connection in `php/config/database.php`

5. **Set permissions**
   ```bash
   chmod -R 755 assets/uploads
   ```

6. **Start the server**
   ```bash
   npm start
   ```

7. **Access the website**
   - Open in your browser: `http://localhost:3000`

## File Structure

```
kevincourses/
├── index.html             # Home page (HTML)
├── courses.html           # Course catalog (HTML)
├── course-detail.html     # Individual course page (HTML)
├── commission.html        # Quote request system (HTML)
├── dashboard.html         # Student dashboard (HTML)
├── login.html             # Login page (HTML)
├── register.html          # Registration page (HTML)
├── blog.html              # Blog listing (HTML)
├── blog-detail.html       # Blog post detail (HTML)
├── about.html             # About page (HTML)
├── contact.html           # Contact page (HTML)
├── resources.html         # Resources page (HTML)
├── server.js              # Node.js Express server
├── package.json           # Node.js dependencies
├── css/                   # Stylesheets
│   ├── main.css          # Main styles
│   ├── components.css    # Component styles
│   ├── animations.css    # Animation styles
│   └── responsive.css    # Responsive styles
├── js/                    # JavaScript files
│   ├── main.js           # Main JavaScript
│   ├── api.js            # API client
│   ├── auth.js           # Authentication management
│   ├── animations.js      # Scroll animations
│   ├── course.js         # Course interactions
│   ├── commission.js     # Commission form
│   └── dashboard.js      # Dashboard functionality
├── php/                   # PHP backend (API only)
│   ├── config/           # Configuration
│   ├── api/              # API endpoints
│   └── classes/          # PHP classes
├── assets/                # Static assets
│   ├── images/           # Images
│   └── uploads/          # User uploads
└── database/              # Database schema
    └── schema.sql        # Database structure
```

## Architecture

- **Frontend**: Pure HTML pages with vanilla JavaScript
- **Backend**: PHP API endpoints for data operations
- **Server**: Node.js Express server on port 3000
- **Communication**: RESTful API using Fetch API

## API Endpoints

- `POST /php/api/auth.php?action=login` - User login
- `POST /php/api/auth.php?action=register` - User registration
- `GET /php/api/auth.php?action=check` - Check auth status
- `GET /php/api/courses.php` - Get courses (with filters)
- `POST /php/api/enroll.php` - Enroll in course
- `POST /php/api/progress.php` - Update course progress
- `POST /php/api/commission.php` - Submit commission request

## Design System

- **Color Palette**: Soft mint (#A8E6CF), sage (#B8D4C8), forest (#4A7C59)
- **Typography**: 
  - Body: Inter
  - Headings: Poppins
  - Ornate: Cinzel Decorative (for "Kevin" text)
- **Animations**: Scroll animations, hover effects, smooth transitions

## Development

### Adding New Pages
1. Create HTML file in root directory
2. Include navigation and footer (or use components.js)
3. Add route in `server.js`

### Styling
- Use CSS variables from `css/main.css`
- Follow BEM naming convention
- Add responsive styles in `css/responsive.css`

### JavaScript
- Use vanilla JavaScript (no frameworks)
- API calls through `js/api.js`
- Authentication through `js/auth.js`

## License

This project is open source and available for use.

## Support

For questions or support, please contact us through the contact form on the website.

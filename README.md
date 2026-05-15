# CUIMS Glass Dashboard

A modern, responsive student dashboard for Chandigarh University Information Management System (CUIMS). Built with a sleek glass-morphism design, this dashboard provides students with quick access to their academic information, course schedules, fee details, job alerts, and campus announcements.

## 🎨 Features

### Academic Management
- **Classes & Lectures**: View current and upcoming classes with instructor details
- **Attendance Tracking**: Real-time attendance percentage by course
- **Course Information**: Track enrolled courses and academic progress

### Student Profile
- **Progress Monitoring**: Visual progress ring showing overall academic progress
- **Fee Status**: Display pending fees with quick payment options
- **Backlog Tracking**: Monitor subjects requiring remedial action
- **ID Card Access**: Quick access to student ID card

### Communication & Notifications
- **Important Messages**: Centralized message hub for official communications
- **Notifications**: Real-time alerts for portal maintenance, assignments, and updates
- **Conversations**: Chat with mentors and peers
- **Job Alerts**: Latest job and internship opportunities

### Planning & Organization
- **Calendar**: Interactive calendar for academic dates and events
- **Quick Actions**: Fast access to important links and notices
- **Announcements**: Latest campus updates and news
- **Query Tracking**: Monitor submitted questions and their status

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side dependencies required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CUIMS-Glass-Dashboard.git
cd CUIMS-Glass-Dashboard
```

2. Open `index.html` in your web browser:
```bash
open index.html
```

Or use a local server:
```bash
python -m http.server 8000
# Then navigate to http://localhost:8000
```

## 📁 Project Structure

```
LMS/
├── index.html           # Main HTML structure
├── index.css            # Global styles and glass-morphism effects
├── sidebar.css          # Sidebar navigation styles
├── dashboard.css        # Dashboard layout and component styles
├── index.js             # Interactive functionality and event handling
├── logo.png             # University logo
└── README.md            # Project documentation
```

## 🎯 Key Components

### Glass-Morphism Design
The dashboard uses a modern glass-morphism aesthetic with:
- Frosted glass effect backgrounds
- Semi-transparent overlays
- Gradient overlays
- Smooth blur effects
- Ambient background animations

### Responsive Layout
- Sidebar navigation for easy access to all features
- Flexible grid system that adapts to different screen sizes
- Mobile-friendly interface

### Interactive Elements
- **Tab System**: Switch between Classes/Attendance views
- **Modal Dialogs**: Pop-up for detailed information
- **Animated Cards**: Smooth transitions and hover effects
- **Dynamic Content**: Real-time updates for messages and alerts

## 🛠️ Customization

### Modifying Colors
Edit the CSS variables in `index.css`:
```css
:root {
  --ink: #2a2e43;
  --blue: #1e62ff;
  --glass: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 100%);
}
```

### Adding New Sections
1. Add HTML structure in `index.html`
2. Style components in appropriate CSS file
3. Add interactivity in `index.js`

### Updating Content
Replace placeholder data in `index.html` with:
- Student information
- Actual course schedules
- Real fee information
- Live announcements

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Features Implemented

- ✅ Responsive glass-morphism design
- ✅ Dynamic greeting based on time of day
- ✅ Tab-based academic information panels
- ✅ Modal system for detailed views
- ✅ Interactive calendar
- ✅ Fee and progress tracking
- ✅ Job alert system
- ✅ Message management
- ✅ Smooth animations and transitions
- ✅ Accessibility features (ARIA labels, semantic HTML)

## 🔧 Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with:
  - Flexbox and Grid layouts
  - CSS animations
  - Backdrop filters
  - Gradient backgrounds
- **JavaScript**: Vanilla JS for interactivity
  - Event handling
  - DOM manipulation
  - Modal management
  - Tab switching

## 📝 Usage Tips

1. **Navigation**: Use the sidebar to access different sections of the dashboard
2. **Quick Actions**: Hero section buttons provide rapid access to important features
3. **Search**: Use the search bar to find courses, documents, or information
4. **Notifications**: Check the bell icon for important announcements
5. **Calendar**: Click dates to see scheduled events or use arrow buttons to navigate months

## 🐛 Troubleshooting

### Calendar Not Displaying Fully
- Ensure `align-items: stretch` is set on `.announcements-layout`
- Check that `.calendar-panel` has `height: 100%`

### Glass Effect Not Visible
- Enable hardware acceleration in your browser
- Use a modern browser with backdrop-filter support
- Check browser compatibility for CSS filters

### Sidebar Not Scrolling
- Verify JavaScript is enabled
- Check that wheel event listener is attached to `.sidebar-menu`

## 📚 Learning Resources

- [CSS Glass-morphism Design](https://css-tricks.com/backdrop-filter/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/ARIA/apg/)
- [Modern CSS Layouts](https://web.dev/learn/css/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Author

Created for Chandigarh University Information Management System

## 🙏 Acknowledgments

- Chandigarh University for the requirements
- Modern CSS design inspiration from glass-morphism trends
- Web design best practices and accessibility guidelines

## 📧 Support

For support, email: support@cuims.edu.in

---

**Last Updated**: May 2026  
**Version**: 1.0.0

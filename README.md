# 🎨 Grid Layout Generator

A beautiful, interactive CSS Grid layout generator built with React, Vite, and GSAP. Create stunning grid layouts with drag-and-drop functionality and export clean HTML/CSS code.

![Grid Layout Generator](https://img.shields.io/badge/React-18+-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite)
![GSAP](https://img.shields.io/badge/GSAP-3+-88CE02?logo=greensock)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-06B6D4?logo=tailwindcss)

## ✨ Features

- **🎯 Interactive Grid Builder** - Click to add items, drag corners to resize
- **📋 Instant Code Export** - Copy generated HTML & CSS with one click
- **🌈 Multiple Themes** - Cyber Grid, Fluid Mesh, and Classic Grid templates
- **💫 Smooth Animations** - GSAP-powered scroll animations and transitions
- **📱 Responsive Design** - Works beautifully on desktop and mobile
- **🌙 Dark Mode** - Modern dark theme with glowing accents

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/GridLayoutGenerator.git

# Navigate to the project
cd GridLayoutGenerator

# Install client dependencies
cd client
npm install

# Start the development server
npm run dev
```

### Server (Optional)

```bash
# In another terminal, navigate to server
cd server
npm install
npm start
```

## 📁 Project Structure

```
GridLayoutGenerator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── grid/       # Grid generators
│   │   │   │   ├── GridGenerator.jsx
│   │   │   │   ├── CyberGridGenerator.jsx
│   │   │   │   ├── FluidMeshGenerator.jsx
│   │   │   │   └── ClassicGridGenerator.jsx
│   │   │   ├── home/       # Home page components
│   │   │   │   └── Hero.jsx
│   │   │   └── layout/     # Layout components
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── MainLayout.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── robots.txt
│   └── package.json
├── server/                 # Express backend
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

## 🎨 Available Templates

### 1. CSS Grid Generator (`/grid`)
The default grid generator with a clean indigo/purple theme. Perfect for standard layouts.

### 2. Cyber Grid (`/cyber-grid`)
A futuristic, neon-styled grid generator with purple/pink accents and glowing effects.

### 3. Fluid Mesh (`/fluid-mesh`)
An organic, fluid-styled grid with blue tones and smooth animations.

### 4. Classic Grid (`/classic-grid`)
A minimalist green-themed grid generator for clean, simple layouts.

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **React 18+** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **GSAP** | Animations & ScrollTrigger |
| **React Router** | Client-side Routing |
| **Tailwind CSS** | Utility Styling |
| **Express** | Backend Server |
| **MongoDB** | Database (optional) |

## 📱 Usage

1. **Create Items** - Click on any empty cell to add a grid item
2. **Resize** - Drag the bottom-right corner handle to resize items
3. **Delete** - Click the × button to remove an item
4. **Configure** - Adjust columns, rows, and gap using the controls
5. **Export** - Copy the generated HTML or CSS code

## 🎯 SEO Features

- Optimized meta tags for search engines
- robots.txt for crawler guidance
- Semantic HTML structure
- Fast loading with Vite optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/gsap/) for amazing animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for blazing fast development

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>

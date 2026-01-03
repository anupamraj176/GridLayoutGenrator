# 🎨 Grid Layout Generator

<div align="center">

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3+-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A beautiful, interactive CSS Grid layout generator with drag-and-drop functionality**

[Live Demo](https://grid-layout-genrator.vercel.app/) · [Report Bug](https://github.com/anupamraj176/GridLayoutGenrator/issues) · [Request Feature](https://github.com/anupamraj176/GridLayoutGenrator/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Interactive Grid Builder** | Click to add items, drag corners to resize instantly |
| 📋 **One-Click Export** | Copy generated HTML & CSS with a single click |
| 🌈 **4 Unique Themes** | Default, Cyber Grid, Fluid Mesh, and Classic Grid |
| 📐 **Grid Presets** | Start with pre-made layouts like Holy Grail, Dashboard, Gallery |
| 💫 **Smooth Animations** | GSAP-powered scroll animations and transitions |
| 📱 **Responsive Design** | Works beautifully on desktop and tablet |
| 🌙 **Dark Mode** | Modern dark theme with glowing accents |
| 📖 **Documentation** | Built-in docs with tips and keyboard shortcuts |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anupamraj176/GridLayoutGenrator.git

# Navigate to the project
cd GridLayoutGenrator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## 📁 Project Structure

```
GridLayoutGenrator/
├── public/
│   ├── robots.txt          # SEO robots file
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── components/
│   │   ├── grid/           # Grid generators
│   │   │   ├── GridGenerator.jsx
│   │   │   ├── CyberGridGenerator.jsx
│   │   │   ├── FluidMeshGenerator.jsx
│   │   │   └── ClassicGridGenerator.jsx
│   │   ├── home/
│   │   │   └── Hero.jsx    # Landing page hero
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── MainLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Presets.jsx     # Grid presets gallery
│   │   └── Docs.jsx        # Documentation page
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vercel.json             # Vercel deployment config
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 Available Themes

### 1. CSS Grid Generator (`/grid`)
The default grid generator with an elegant indigo/purple theme.

### 2. Cyber Grid (`/cyber-grid`)
A futuristic, neon-styled generator with purple/pink accents and glowing effects.

### 3. Fluid Mesh (`/fluid-mesh`)
An organic, fluid-styled grid with calming blue tones.

### 4. Classic Grid (`/classic-grid`)
A minimalist green-themed generator for clean, simple layouts.

---

## 📐 Grid Presets

Pre-made layouts available in the Presets page:

- **Holy Grail** - Classic header, footer, sidebar layout
- **Dashboard** - Admin dashboard with stat cards
- **Magazine** - Editorial style layout
- **Gallery** - Photo gallery masonry style
- **Portfolio** - Creative portfolio showcase
- **Landing Page** - Modern landing page sections

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **GSAP** | Animations & ScrollTrigger |
| **React Router v6** | Client-side Routing |
| **Tailwind CSS** | Utility Styling |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and configure build settings
4. Click Deploy!

**Or use Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📱 Usage

1. **Create Items** - Click on any empty cell to add a grid item
2. **Resize** - Drag the bottom-right corner handle to resize items
3. **Delete** - Click the × button to remove an item
4. **Configure** - Adjust columns, rows, and gap using the controls
5. **Export** - Copy the generated HTML or CSS code
6. **Presets** - Use pre-made layouts from the Presets page

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/gsap/) for amazing animations
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for blazing fast development
- [React Router](https://reactrouter.com/) for seamless navigation

---

<div align="center">

**Made with ❤️ by [anupamraj176](https://github.com/anupamraj176)**

⭐ Star this repo if you found it helpful!

</div>

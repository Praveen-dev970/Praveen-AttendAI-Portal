# 🎨 AttendAI Frontend

The frontend of **AttendAI** is built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** to provide a modern, responsive, and intuitive user experience for monitoring attendance and academic performance.

It communicates with the FastAPI backend through REST APIs and presents live student data in an elegant dashboard.

---

# ✨ Features

- 📊 Interactive Dashboard
- 📚 Subject-wise Attendance
- 🎓 Semester-wise Marks
- 📈 Academic Analytics
- 👤 Student Profile
- 🎯 Attendance Target Calculator
- 🌙 Dark / Light Theme
- 📱 Fully Responsive Design
- ⚡ Fast Performance
- 🎨 Modern Premium UI

---

# 🖥 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | User Interface |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Charts & Analytics |
| Axios | API Communication |
| React Router | Navigation |
| Lucide React | Icons |

---

# 🏗 Frontend Architecture

```
React
 │
 ├── Components
 ├── Views
 ├── Hooks
 ├── Services
 ├── Utils
 ├── Types
 │
 ▼
FastAPI REST APIs
 │
 ▼
AEC Portal + PostgreSQL
```

---

# 📂 Folder Structure

```text
frontend
│
├── public
│
├── src
│   ├── assets
│   ├── components
│   ├── hooks
│   ├── layouts
│   ├── services
│   ├── types
│   ├── utils
│   ├── views
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── README.md
```

---

# ⚙️ Installation

Clone the repository.

```bash
git clone https://github.com/<your-username>/Praveen-AttendAI.git
```

Go to the frontend.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

# 🔑 Environment Variables

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 📦 Build for Production

```bash
npm run build
```

Preview production build.

```bash
npm run preview
```

---

# 🎨 UI Features

## Dashboard

- Live Attendance Overview
- Attendance Target Calculator
- Academic Summary
- SGPA Trend
- Subject Attendance Cards

---

## Attendance

- Subject-wise Attendance
- Attendance Percentage
- Safe Bunk Calculator

---

## Academic Performance

- Semester Cards
- SGPA
- CGPA
- Credits
- Performance Summary

---

## Analytics

- Attendance Charts
- Performance Charts
- Interactive Graphs

---

## Student Profile

- Student Details
- Branch
- Semester
- CGPA

---

## Settings

- Theme Toggle
- User Preferences

---

# 📱 Responsive Design

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

Supports:

- Light Theme
- Dark Theme

---

# 🔗 API Integration

The frontend communicates with the backend using Axios.

Example:

```typescript
const response = await api.getDashboard();
```

Major APIs:

- Login
- Dashboard
- Attendance
- Marks
- Student Profile

---

# 📦 Main Dependencies

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- Recharts
- Lucide React
- Vite

---

# 👨‍💻 Author

**Praveen Yeggada**

B.Tech – Artificial Intelligence & Machine Learning

GitHub:
https://github.com/Praveen-dev970

LinkedIn:
https://www.linkedin.com/in/praveen-yeggada/

---

## ⭐ Part of the AttendAI Project

For complete documentation, installation steps, backend setup, and screenshots, refer to the **Root README.md**.
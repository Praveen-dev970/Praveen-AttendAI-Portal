<div align="center">

# 🎓 AttendAI

### Smart Student Attendance & Academic Analytics Platform

A modern full-stack web application that integrates with the **AEC Student Portal** to provide real-time attendance tracking, semester-wise academic performance, intelligent attendance recommendations, and interactive analytics.

<img src="docs/images/dashboard.png" width="100%"/>

---

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![JWT](https://img.shields.io/badge/Auth-JWT-success)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/version-v1.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.138-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

# 📖 Overview

AttendAI is a modern academic management platform designed for students to monitor attendance and academic performance from a single dashboard.

Instead of manually navigating through multiple pages in the college portal, AttendAI provides an intuitive interface that synchronizes live attendance and semester marks, calculates attendance insights, and presents academic data through interactive visualizations.

The application combines a **React + TypeScript** frontend with a **FastAPI** backend and **PostgreSQL**, while securely integrating with the AEC Student Portal.

---

# ✨ Highlights

- 🔐 Secure JWT Authentication
- 📡 Live Attendance Synchronization
- 📚 Live Semester Marks
- 📊 Interactive Dashboard
- 🎯 Smart Attendance Recommendation
- 📈 Academic Performance Analytics
- 🌙 Dark / Light Theme
- 📱 Fully Responsive Design
- ⚡ FastAPI REST APIs
- 🗄 PostgreSQL Database
---

# 🎯 Problem Statement

Students frequently access the college portal to monitor attendance, semester marks, and academic progress. However, the traditional portal experience has several limitations:

- Navigating through multiple pages to find information.
- No unified dashboard for attendance and academic performance.
- Lack of attendance predictions or safe bunk calculations.
- No visual insights or trend analysis.
- Poor user experience on mobile devices.
- No centralized view of academic statistics.

AttendAI addresses these challenges by providing a modern, responsive platform that consolidates attendance, marks, and academic analytics into a single intuitive dashboard.

---

# 💡 Solution

AttendAI securely connects to the AEC Student Portal, synchronizes student information, and presents it in an interactive dashboard with actionable insights.

The platform enables students to:

- Monitor attendance in real time.
- View semester-wise academic performance.
- Analyze SGPA and CGPA trends.
- Calculate safe bunk limits and required attendance.
- Visualize attendance through charts and analytics.
- Access academic information from any device using a modern responsive interface.

---

# 🚀 Key Features

## 📊 Dashboard

- Live attendance overview
- Overall attendance percentage
- Classes held, attended, and missed
- Smart attendance recommendation
- Attendance target calculator
- Academic summary cards
- SGPA trend visualization
- Subject-wise attendance overview

---

## 📚 Attendance Management

- Live attendance synchronization
- Subject-wise attendance tracking
- Attendance percentage calculation
- Safe bunk prediction
- Required attendance calculation
- Attendance insights

---

## 🎓 Academic Performance

- Semester-wise marks
- SGPA for each semester
- Overall CGPA
- Credits earned
- Academic trend analysis
- Performance summary

---

## 👤 Student Profile

- Student information
- Roll Number
- Student Name
- Branch
- Semester
- CGPA

---

## 📈 Analytics

- Attendance charts
- Subject performance charts
- Semester performance trends
- Interactive data visualization

---

## ⚙️ Additional Features

- Secure JWT Authentication
- Responsive Design
- Dark / Light Mode
- Fast Dashboard Loading
- Modern Premium UI
- PostgreSQL Integration
- FastAPI REST APIs
- Environment Variable Support

---

# 🖼️ Application Screenshots

> **Note:** Replace these images with your own screenshots before publishing to GitHub.

## 🔐 Login

<p align="center">
  <img src="docs/images/login.png" width="90%">
</p>

---

## 📊 Dashboard

<p align="center">
  <img src="docs/images/dashboard.png" width="90%">
</p>

---

## 📚 Attendance

<p align="center">
  <img src="docs/images/attendance.png" width="90%">
</p>

---

## 🎓 Academic Performance

<p align="center">
  <img src="docs/images/marks.png" width="90%">
</p>

---

## 📈 Analytics

<p align="center">
  <img src="docs/images/charts.png" width="90%">
</p>

---

## 👤 Student Profile

<p align="center">
  <img src="docs/images/profile.png" width="90%">
</p>

---
# 🌐 Live Demo: [https://praveen-attendai.vercel.app](https://praveen-attendai.vercel.app)
# 🔗 Backend API: [https://attendai-api-jehv.onrender.com](https://attendai-api-jehv.onrender.com/)
# 📚 API Docs: [https://attendai-api-jehv.onrender.com/](https://attendai-api-jehv.onrender.com/docs)

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | User Interface |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| Axios | API Communication |
| Lucide React | Icons |
| Vite | Build Tool |

---

## Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | REST API |
| Python | Backend Development |
| SQLAlchemy | ORM |
| PostgreSQL | Database |
| BeautifulSoup | HTML Parsing |
| Requests | HTTP Client |
| python-jose | JWT Authentication |
| Passlib | Password Hashing |
| Pydantic | Validation |

---

## Development Tools

- VS Code
- Git
- GitHub
- Postman
- pgAdmin
- Chrome DevTools

---

# 🏗️ System Architecture

```text
                    +----------------------+
                    |      React App       |
                    | (TypeScript + Vite)  |
                    +----------+-----------+
                               |
                               | REST API
                               |
                    +----------v-----------+
                    |      FastAPI         |
                    | Authentication/API   |
                    +----------+-----------+
                               |
                +--------------+--------------+
                |                             |
                |                             |
      +---------v---------+        +----------v----------+
      | PostgreSQL        |        |  AEC Student Portal |
      | Student Database  |        | Live Attendance     |
      |                   |        | Live Marks          |
      +-------------------+        +---------------------+
```

---

# 📂 Project Structure

```text
Praveen-AttendAI
│
├── README.md
├── LICENSE
├── docs
│   └── images
│       ├── dashboard.png
│       ├── attendance.png
│       ├── marks.png
│       ├── charts.png
│       ├── profile.png
│       └── login.png
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── clients
│   │   ├── config
│   │   ├── core
│   │   ├── database
│   │   ├── models
│   │   ├── parser
│   │   ├── repositories
│   │   ├── schemas
│   │   ├── security
│   │   ├── services
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── frontend
    ├── src
    │   ├── components
    │   ├── services
    │   ├── hooks
    │   ├── utils
    │   ├── types
    │   └── App.tsx
    │
    ├── package.json
    ├── .env.example
    └── README.md
```

---

# ⚙️ Installation

## Prerequisites

Before running the project, ensure the following software is installed:

- Python 3.12+
- Node.js 20+
- PostgreSQL 17+
- Git

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/Praveen-AttendAI.git

cd Praveen-AttendAI
```

---

# 🚀 Backend Setup

```bash
cd backend
```

## Create Virtual Environment

```bash
python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a file named:

```text
backend/.env
```

using the following template:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/attendai

JWT_SECRET=your_jwt_secret_key

JWT_ALGORITHM=HS256

AEC_BASE_URL=https://info.aec.edu.in
```

---

## Start Backend

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

---

## Configure Frontend Environment

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## Run Frontend

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT authentication |
| JWT_ALGORITHM | JWT signing algorithm |
| AEC_BASE_URL | AEC Student Portal URL |

---

## Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login using student credentials |

---

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/` | Live dashboard information |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance/` | Live attendance data |

---

## Marks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/marks/` | Semester-wise marks |

---

## Student Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/{roll_number}` | Student information from database |

---

# 🧪 Running the Project

Start Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Start Frontend

```bash
cd frontend

npm run dev
```

Open:

```
http://localhost:5173
```

Login using your college portal credentials.

---

# 🛡️ Security

- JWT-based Authentication
- Passwords are never stored in plain text
- Environment variables for sensitive configuration
- Secure session management
- Backend validation using Pydantic
- Protected API endpoints

---

# ⚠️ Disclaimer

AttendAI is an educational project developed for learning and academic purposes.

The application interacts with the AEC Student Portal using the authenticated student's own credentials to display attendance and academic information.

It is not an official application of Aditya Engineering College.

---

# 🚀 Future Enhancements

Although AttendAI v1.0 is feature-complete, future versions may include:

- 📅 Class Timetable Integration
- 🔔 Attendance Notifications & Reminders
- 📱 Progressive Web App (PWA)
- 📤 Export Attendance & Marks as PDF
- 📊 Advanced Analytics Dashboard
- 🤖 AI-powered Academic Assistant
- ☁️ Cloud Deployment
- 📈 Performance Optimization
- 🔐 Multi-factor Authentication
- 🎓 Multi-College Support

---

# 🤝 Contributing

Contributions, ideas, and suggestions are always welcome.

If you would like to contribute:

1. Fork this repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📝 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project under the terms of the license.

---

# 🙏 Acknowledgements

Special thanks to:

- **Aditya Engineering College** for providing the student portal used for educational integration.
- **FastAPI** for a high-performance backend framework.
- **React** and **TypeScript** for building a modern frontend.
- **Tailwind CSS** for responsive UI development.
- **PostgreSQL** for reliable data storage.
- **BeautifulSoup** for HTML parsing.
- The open-source community for the amazing tools and libraries used in this project.

---

# 👨‍💻 Author

## Praveen Yeggada

**B.Tech – Artificial Intelligence & Machine Learning**

- 🌐 GitHub: https://github.com/Praveen-dev970
- 💼 LinkedIn: https://www.linkedin.com/in/praveen-yeggada/
- 📧 Email: praveenyeggada@gmail.com

---

# ⭐ Support

If you found this project useful or interesting,

please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

<div align="center">

## 🎓 AttendAI v1.0

**Smart Student Attendance & Academic Analytics Platform**

Built with ❤️ using React, TypeScript, FastAPI, PostgreSQL & Python

© 2026 Praveen Yeggada. All Rights Reserved.

</div>

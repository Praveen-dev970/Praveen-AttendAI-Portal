# 🚀 AttendAI Backend

The backend of **AttendAI** is built with **FastAPI** and provides secure REST APIs for authentication, attendance synchronization, marks retrieval, and dashboard analytics.

It integrates with the **AEC Student Portal**, parses live academic data, and stores relevant information in **PostgreSQL**.

---

# ✨ Features

- 🔐 JWT Authentication
- 📡 Live Attendance Synchronization
- 📚 Live Semester Marks
- 👤 Student Profile Synchronization
- 📊 Dashboard APIs
- 🗄 PostgreSQL Integration
- ⚡ FastAPI REST APIs
- 🌐 Environment Variable Configuration
- 🧹 Clean Service-Oriented Architecture

---

# 🏗 Backend Architecture

```
Client
   │
   ▼
FastAPI
   │
   ├── Authentication
   ├── Attendance APIs
   ├── Marks APIs
   ├── Dashboard APIs
   │
   ▼
Services
   │
   ├── Live Portal Service
   ├── Attendance Parser
   ├── Marks Parser
   ├── Profile Parser
   │
   ▼
AEC Student Portal

             │

             ▼

      PostgreSQL Database
```

---

# 📂 Folder Structure

```text
backend
│
├── app
│   ├── api
│   ├── clients
│   ├── config
│   ├── core
│   ├── database
│   ├── models
│   ├── parser
│   ├── repositories
│   ├── schemas
│   ├── security
│   ├── services
│   └── main.py
│
├── requirements.txt
├── .env.example
└── README.md
```

---

# ⚙️ Installation

## Create Virtual Environment

```bash
python -m venv .venv
```

Activate:

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

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/attendai

JWT_SECRET=your_secret_key

JWT_ALGORITHM=HS256

AEC_BASE_URL=https://info.aec.edu.in
```

---

# ▶️ Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/v1/auth/login` |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | `/dashboard/` |

---

## Attendance

| Method | Endpoint |
|---------|----------|
| GET | `/attendance/` |

---

## Marks

| Method | Endpoint |
|---------|----------|
| GET | `/marks/` |

---

## Student

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/dashboard/{roll_number}` |

---

# 🗄 Database

Database:

- PostgreSQL

ORM:

- SQLAlchemy

Main Tables:

- students
- attendance
- marks

---

# 🔒 Security

- JWT Authentication
- Protected APIs
- Environment Variables
- Secure Session Management
- Password Hashing
- Pydantic Validation

---

# 📦 Major Dependencies

- FastAPI
- SQLAlchemy
- PostgreSQL
- BeautifulSoup4
- Requests
- python-jose
- Passlib
- Pydantic
- Uvicorn

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

For complete documentation, screenshots, and installation instructions, refer to the root **README.md**.
# RailX - Indian Railways AI Block Planning Backend

A Node.js and Express backend API for the Indian Railways AI Block Planning & Maintenance Scheduling System.

## 🚀 Features

- **Express.js API Server** with modular architecture
- **MySQL Integration** for train schedules and maintenance block planning data
- **CORS Enabled** for seamless integration with frontend dashboards
- **Environment Configuration** (`dotenv`) for secure secrets management

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MySQL (`mysql2`)
- **Utilities:** `dotenv`, `cors`

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (or XAMPP / WAMP)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RailXpro/RailX----ai----Traintech.git
   cd hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=Railx_railways
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:5000`.

---

## 📡 API Endpoints

| Method | Endpoint    | Description                              |
| ------ | ----------- | ---------------------------------------- |
| `GET`  | `/`         | Health check & server status             |
| `GET`  | `/db-test`  | Tests MySQL database connectivity        |
| `GET`  | `/trains`   | Retrieves list of all trains from the DB |

---

## 🔒 Security

- Sensitive credentials and database configurations are kept in `.env` (ignored by Git).
- Never commit `.env` or `node_modules` to source control.

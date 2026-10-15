# TaskFlow - Project Management System

**TaskFlow** is a modern project and task management application designed to help individuals and teams organize work, track progress, and collaborate efficiently.

---

## 🛠️ Built With

* **Frontend:** React
* **State Management:** Zustand
* **Backend:** Node.js
* **Database:** PostgreSQL
* **ORM:** Prisma

---

## 🚀 Key Features

### 1. User Authentication
Secure onboarding experience with seamless account creation and login dashboards.
* **Sign Up:** User-friendly registration form with real-time input placeholders.
* **Sign In:** Secure login screen featuring credential validation and password visibility toggles.

| Account Creation | Secure Login |
| :---: | :---: |
| ![Create Account](saas2.jpg) | ![Sign In](saas1.jpg) |

### 2. Centralized Dashboard
A comprehensive workspace overview that aggregates real-time performance and workload data.
* **Metric Cards:** At-a-glance counters for total projects, total tasks, completed milestones, and pending items.
* **Progress Analytics:** Visual progress bars displaying overall milestone completion percentages.
* **Activity Tracking:** Quick-view sections highlighting recent projects and upcoming items.

![Dashboard Overview](saas3.jpg)

### 3. Task Tracking & Workspace Activity
Granular management hubs to monitor everyday development cycles and operations.
* **Project Directories:** Clean lists displaying active projects alongside dedicated descriptions.
* **Status Flags:** Color-coded task status elements indicating if an item is *In Progress* or *Completed*.

![Workspace Activity](saas4.jpg)

### 4. Profile & Account Settings
Self-service user management panels to keep account details accurate and secure.
* **Identity Management:** Easy updates for full names and primary email addresses.
* **Security Controls:** Dedicated inputs to safely change or update account passwords.

![Profile Settings](saas5.jpg)

- For features visit the site...

---

## ⚙️ Installation & Local Setup

Follow these steps to get your development environment running locally.

### 1. Clone the Repository & Install Dependencies
Navigate into your project root directory and install the required packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in your root server directory and configure your PostgreSQL database connection string along with your secrets:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

### 3. Database Migration & Prisma Client
Initialize your database schemas and generate the Prisma client:
```bash
# Run migrations to update your PostgreSQL database schema
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 4. Run the Application
Start your development environment:
```bash
npm run dev
```

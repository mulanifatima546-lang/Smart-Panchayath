# 🏛️ Smart Panchayat

### Digital Governance for Smarter Panchayats

**Smart Panchayat** is a digital governance platform designed to improve communication between citizens and Panchayat authorities, simplify access to public services, and digitize administrative workflows.

The platform brings together a backend API, a citizen-facing web application, and an administrative dashboard to provide a centralized system for Panchayat services, citizen applications, and public notices.

## 📌 Project Overview

The project consists of three main modules:

| Module              | Description                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Backend API**     | Handles business logic, database operations, authentication, authorization, and API endpoints.                              |
| **Citizen Web App** | Enables citizens to access services, submit and track applications, view Panchayat notices, and access profile information. |
| **Admin Dashboard** | Provides authorized administrators and Panchayat operators with tools to manage notices and administrative workflows.       |

## ✨ Key Features

### 👨‍👩‍👧 Citizen Portal

- Citizen dashboard with application summaries.
- Browse available Panchayat services.
- Submit applications for public services.
- Track application status and view application details.
- View published Panchayat notices and announcements.
- Search and filter notices by category.
- Access citizen profile and Panchayat information.

### 🛡️ Administration

- Role-based access for administrators and Panchayat operators.
- Create and manage public notices.
- Save notices as drafts and publish them.
- Withdraw published notices.
- Target notices to all Panchayat citizens or selected recipients.
- Configure notice expiry dates.
- Manage Panchayat-specific data access.

### ⚙️ Backend Services

- RESTful API architecture.
- MongoDB database integration.
- Data modeling and validation with Mongoose.
- TypeScript-based backend development.
- Role-based authorization.
- Notice search, filtering, and pagination.
- Citizen-specific notice visibility and read status.

## 🛠️ Technology Stack

The technologies below reflect the code shared for this project. Update the list if any module uses additional or different technologies.

### Frontend

- **Next.js** — React framework
- **React** — Component-based UI development
- **TypeScript** — Type safety
- **Tailwind CSS** — Responsive styling
- **Material UI (MUI)** — UI components and icons
- **Axios** — API communication
- **React Hot Toast** — User feedback notifications

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Backend API framework
- **TypeScript** — Backend development
- **MongoDB** — NoSQL database
- **Mongoose** — Database modeling and validation

### Development Tools

- Git and GitHub for version control
- npm for package management
- Environment variables for application configuration

## 📁 Repository Structure

```text
smart-panchayat/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── package.json
│   └── README.md
│
├── citizen-web/
│   ├── app/
│   ├── components/
│   ├── constant/
│   ├── package.json
│   └── README.md
│
├── admin-dashboard/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── README.md
│
└── README.md
```

_This is an illustrative structure. Adjust folder names and internal files to match your actual repository._

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) or a MongoDB connection string
- Git

### 1. Clone the Repository

```bash
git clone <YOUR-ROOT-REPOSITORY-URL>
cd smart-panchayat
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file using the variables required by the backend configuration. For example:

```env
PORT=5000
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
```

Configure any additional authentication, session, or cookie-related variables required by your application.

Start the backend using the scripts defined in its `package.json`. For example:

```bash
npm run dev
```

### 3. Configure and Run the Citizen Web App

Open a new terminal:

```bash
cd citizen-web
npm install
```

Configure the backend API URL in `.env.local` if your application supports it:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the development server:

```bash
npm run dev
```

### 4. Configure and Run the Admin Dashboard

Open another terminal:

```bash
cd admin-dashboard
npm install
```

Set the required backend API URL and other environment variables for the admin application.

If the admin frontend uses Next.js, start it with:

```bash
npm run dev
```

Check each application's terminal output for the actual local URL and port. If both frontend applications use the default Next.js port, run them on different ports.

## 🔗 Application Architecture

```text
                 ┌─────────────────────────┐
                 │       Citizens          │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    Citizen Web App      │
                 │     Next.js / React     │
                 └────────────┬────────────┘
                              │
                              │ REST API
                              ▼
                 ┌─────────────────────────┐
                 │      Backend API        │
                 │   Node.js / Express     │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        MongoDB          │
                 │   Persistent Data       │
                 └─────────────────────────┘

                 ┌─────────────────────────┐
                 │   Admin / Operators     │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    Admin Dashboard      │
                 │    REST API Client      │
                 └────────────┬────────────┘
                              │
                              └──────► Backend API
```

## 🔐 Security

- Authenticate users before accessing protected resources.
- Enforce authorization rules on the backend.
- Restrict operator access to their assigned Panchayat.
- Limit citizen notice access according to publication status, audience, Panchayat assignment, and expiry.
- Store credentials and secrets in environment variables.
- Configure CORS and cookies appropriately for the deployment environment.
- Never commit `.env` files, API secrets, or database credentials to GitHub.

## 🌱 Future Scope

Potential future enhancements include:

- Online payments for eligible services.
- Digital certificates and downloadable documents.
- SMS, email, or push notifications.
- Advanced analytics and reporting.
- Improved accessibility and multilingual support.
- Audit logs for administrative activities.
- Expanded application tracking and workflow automation.

These are potential enhancements, not claims that the features are already implemented.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Submit a pull request.

## 📄 License

Specify the license under which this project is distributed. If no license has been added, all rights remain with the copyright holder by default.

## 👨‍💻 Project

**Smart Panchayat — Digital Governance Platform**

A centralized platform aimed at improving access to Panchayat services, strengthening citizen communication, and supporting more efficient local administration.

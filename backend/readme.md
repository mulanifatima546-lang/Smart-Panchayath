# Smart Panchayat — Backend API

A backend API for the Smart Panchayat platform, designed to support digital Panchayat services, citizen applications, notice management, and role-based access for citizens and Panchayat staff.

## 🚀 Features

- **REST API** for citizen-facing and administrative operations.
- **Authentication and authorization** using authenticated user roles.
- **Citizen management** and Panchayat-specific data access.
- **Notice Management**
  - Create, update, publish, and withdraw notices.
  - Support draft and published notices.
  - Target notices to an entire Panchayat or selected citizens.
  - Search and filter notices by category.
  - Notice expiry management.
  - Mark notices as read.
- **Application Management** for citizen service requests.
- **Pagination** for notice listings.
- **Data validation** and structured error responses.
- **Database integration** using MongoDB and Mongoose.

## 🛠️ Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **TypeScript** — Type-safe backend development
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling
- **Axios-compatible REST endpoints** — Client-server communication
- **Authentication middleware** — User and role-based access control

## 📁 Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── notice.controller.ts
│   ├── models/
│   │   └── notice.model.ts
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.ts
├── package.json
├── tsconfig.json
└── .env.example
```

_The structure above is illustrative; adapt it to match your actual repository._

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB instance
- Git

### Installation

```bash
git clone <YOUR-BACKEND-REPOSITORY-URL>
cd <YOUR-BACKEND-FOLDER>
npm install
```

### Environment Variables

Create a `.env` file in the backend root directory and configure the variables required by your application.

```env
PORT=5000
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>
```

Add your actual authentication, session, cookie, and other environment variables if required by your implementation. Ensure the names match those read by your backend configuration.

### Run the Server

Use the scripts defined in your `package.json`. For example, if your project defines these scripts:

```bash
npm run dev
npm run build
npm start
```

### API Endpoints

| Method | Endpoint                          | Purpose                     |
| ------ | --------------------------------- | --------------------------- |
| POST   | `/api/notices`                    | Create a notice             |
| GET    | `/api/notices`                    | Retrieve notices            |
| GET    | `/api/notices/:noticeId`          | Retrieve a notice           |
| PATCH  | `/api/notices/:noticeId`          | Update a draft notice       |
| PATCH  | `/api/notices/:noticeId/publish`  | Publish a notice            |
| PATCH  | `/api/notices/:noticeId/withdraw` | Withdraw a published notice |
| PATCH  | `/api/notices/:noticeId/read`     | Mark a notice as read       |

The notice endpoints require appropriate authentication and authorization.

## 🔐 Access Control

- Administrators can manage notices across Panchayats.
- Operators are restricted to their assigned Panchayat.
- Citizens can view eligible published notices associated with their Panchayat or specifically addressed to them.
- Expired notices are excluded from citizen notice listings.

## 🌱 Future Improvements

- Automated API testing.
- API documentation with Swagger/OpenAPI.
- Logging and monitoring.
- Rate limiting and additional security hardening.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## 📄 License

Add your preferred open-source license or specify the project's license.

---

Developed as part of the **Smart Panchayat digital governance platform**.

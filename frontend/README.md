# Smart Panchayat — Citizen Web App

A citizen-facing web application for the Smart Panchayat platform. It provides a digital interface for citizens to access Panchayat services, submit applications, track application progress, view notices, and access relevant Panchayat information.

## ✨ Features

- **Citizen Dashboard**
  - Personalized welcome section.
  - Summary cards for application statistics.
  - Recent application overview.
- **Digital Panchayat Services**
  - Browse available services.
  - Start new service applications.
- **Application Tracking**
  - View submitted applications.
  - Access individual application details.
  - Review application status and updates.
- **Panchayat Notices**
  - View published public notices.
  - Search notices by title or description.
  - Filter notices by category.
  - View publication dates and attachments.
  - Mark notices as read.
- **Citizen Profile** and Panchayat information.
- **Responsive UI** for desktop and mobile devices.
- **API integration** using a centralized Axios instance.
- **Loading, error, and refresh states** for a smoother user experience.

## 🛠️ Tech Stack

- **Next.js** — React framework and routing
- **React** — Component-based UI
- **TypeScript** — Type-safe frontend development
- **Tailwind CSS** — Utility-first styling
- **Material UI (MUI)** — UI components and icons
- **Axios** — HTTP requests to the backend API
- **React Hot Toast** — User notifications

## 📁 Project Structure

```text
citizen-web/
├── app/
│   └── citizen/
│       ├── page.tsx
│       ├── notices/
│       │   └── page.tsx
│       └── applications/
├── components/
│   └── citizen/
│       ├── DashboardLoading.tsx
│       ├── DashboardError.tsx
│       ├── WelcomeBanner.tsx
│       ├── SummaryCards.tsx
│       ├── ServiceGrid.tsx
│       ├── RecentApplications.tsx
│       ├── ProfileCard.tsx
│       ├── PanchayatCard.tsx
│       └── AssistanceCard.tsx
├── constant/
│   └── api.ts
├── package.json
└── .env.example
```

_Update this tree to reflect your actual folders and filenames._

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- A running Smart Panchayat backend API

### Installation

```bash
git clone <YOUR-CITIZEN-WEB-REPOSITORY-URL>
cd <YOUR-CITIZEN-WEB-FOLDER>
npm install
```

### Configure the API

The application uses a centralized Axios instance to communicate with the backend.

Example configuration:

```ts
import axios from "axios";

export const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
```

If your current configuration uses a hardcoded URL, update it to an environment variable if you want easier deployment configuration.

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Configure the backend CORS settings and authentication cookies appropriately when running the frontend and backend on different origins.

### Run the Application

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🔗 Backend Integration

The citizen web app communicates with the backend for:

- Citizen dashboard data.
- Panchayat service information.
- Application creation and tracking.
- Published notices and notice read status.
- Citizen profile and Panchayat details.

Example notice API request:

```ts
const response = await api.get("/notices", {
  params: {
    page: 1,
    limit: 50,
  },
});

const notices = response.data.data;
```

## 🎯 Project Goal

To make Panchayat services and public information more accessible by providing citizens with a centralized digital platform.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Submit a pull request.

## 📄 License

Add your project's license information here.

---

Part of the **Smart Panchayat digital governance platform**.

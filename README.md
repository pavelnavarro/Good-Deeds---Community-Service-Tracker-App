# Good Deeds — Community Service Tracker

A web application for organizing community-service activity and tracking volunteer hours. Built with React and Firebase.

## Overview

Good Deeds explores a simple way to make volunteer participation easier to manage. The application is organized around a React frontend, with dedicated authentication, page, and volunteer-hours components.

## Tech stack

- **Frontend:** React 18, JavaScript, React Router
- **Styling:** Tailwind CSS
- **Backend services:** Firebase
- **Build tooling:** Vite
- **Developer tooling:** ESLint

## Repository structure

```text
src/
├── Authentication/       # Authentication-related UI
├── Pages/                # Application views
├── components/
│   └── HoursWorked.jsx   # Volunteer-hours component
├── header/               # Header/navigation UI
├── firebase.js           # Firebase configuration and integration
├── App.jsx               # Top-level application
└── main.jsx              # React entry point
```

## Running locally

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/pavelnavarro/Good-Deeds---Community-Service-Tracker-App.git
cd Good-Deeds---Community-Service-Tracker-App
npm install
npm run dev
```

Vite will print the local development URL.

### Other commands

```bash
npm run build    # Production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

### Firebase setup

The application uses Firebase. Review `src/firebase.js` and configure the Firebase project required by your local environment before testing authenticated or data-dependent flows. Avoid committing private credentials.

## Project notes

This repository contains the frontend implementation. Features and integrations should be evaluated against the source code; a hosted production deployment and automated test coverage are not documented here.

## Author

[Pavel Navarro](https://github.com/pavelnavarro)

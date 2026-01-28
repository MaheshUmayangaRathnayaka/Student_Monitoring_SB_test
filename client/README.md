# Student Performance System - Frontend

A modern, responsive React application built with Vite for managing student performance.

## Features

- ✅ User Authentication (Login/Signup)
- ✅ Protected Routes
- ✅ Dashboard with Analytics
- ✅ Student List with CRUD Operations
- ✅ Performance Charts (Recharts)
- ✅ Context API for State Management
- ✅ Responsive Design

## Technologies

- React 19.2.0
- Vite 7.2.4
- React Router DOM
- Axios
- Recharts
- Context API

## Getting Started

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/      # Reusable components
├── context/        # Context providers
├── pages/          # Page components
├── services/       # API services
└── utils/          # Utility functions
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

# Expense Tracker

A colorful and mobile-first expense tracker built with React, Vite, and modern UI animations.

## Overview

This project allows users to:
- add expenses with description, amount, category, and date
- view a list of recorded expenses
- delete individual expenses
- clear all expenses with a single button
- persist data in browser local storage
- review total spending and top expense categories on a tracker page

## Project Structure

- `src/App.jsx` — main router and application shell
- `src/Expenses.jsx` — expense entry form, list display, delete, and clear functionality
- `src/Tracker.jsx` — total expense summary and category breakdown
- `src/Home.jsx` — landing page with navigation links
- `src/App.css` — custom UI styling, gradients, responsive layout, and animations
- `src/main.jsx` — application entry point, Bootstrap and animation styles imported

## Libraries and Tools Used

- `react` — UI components and state management
- `react-dom` — React DOM rendering
- `react-router-dom` — page routing between Home, Expenses, and Tracker
- `vite` — fast development server and build tool
- `bootstrap` — responsive mobile-first layout foundations
- `aos` — scroll and element animations for smooth UI transitions
- `animate.css` — prebuilt CSS animation utilities
- `eslint` — linting and code quality enforcement

## Key Features

### Local Storage Persistence
Data is saved to `localStorage` so expenses remain after page refresh or browser restart. Deleting expenses updates storage immediately.

### Multi-Page Navigation
The app uses React Router to support separate pages for:
- Home
- Expenses
- Tracker

### Animated UI
The interface includes:
- gradient background panels
- animated buttons and cards
- hover transitions and responsive design

### Clear All Button
When the expense list is not empty, a clear button appears and allows users to remove all stored expenses instantly.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at the printed local URL.

## How to Deploy

This Vite app can be deployed to any static hosting provider that supports built JavaScript apps.

1. Create a production build:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with your hosting platform.

## Notes

- This project runs entirely in the browser and does not require a backend.
- Expense data is stored locally on the user device and is not shared externally.
- The tracker updates automatically after clearing or modifying expenses.

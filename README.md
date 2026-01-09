# Pakistani Meal Planner

A dynamic Next.js 13 application for planning meals across 365 days, featuring seasonal Pakistani dishes and user customization.

## Features

- **Dynamic Meal Generation**: 365-day schedule rotating based on seasons (Winter, Spring, Summer, Autumn).
- **Pakistani Cuisine**: Curated lists of Veg and Non-Veg dishes.
- **Rules Engine**:
  - Breakfast: 2 options.
  - Lunch/Dinner: 1 Veg + 1 Non-Veg (no repeats within 7 days).
- **User Dashboard**:
  - Uniquely generated per day.
  - Block/Unblock dishes (persisted).
  - Date navigation.
- **Authentication**: Secure Signup/Login with NextAuth.js and MongoDB.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the root directory with the following credentials:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mealplanner
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ```
   *Note: You need a MongoDB Atlas account.*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js
- **Icons**: Lucide React

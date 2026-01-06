# InternMate (Internship Tracker)

A full-stack internship application tracker that helps students manage their applications, track statuses, and gain insights into their job search through real-time analytics and visual dashboards.

This project is my own iteration and extension of **HustleHub**, an internship tracker originally built locally with my team during **NTU SummerBuild 2025**, redesigned and deployed as a polished web application.

**Link to project:** (https://internmate-app.vercel.app/)

---

## How It's Made

**Tech used:**  
HTML, CSS, JavaScript, React, Tailwind CSS, Node.js, Express, MongoDB, Recharts, Framer Motion
This project started as a locally run tracker built during NTU SummerBuild 2025 (HustleHub) and was later re-engineered into a full web application.
I deployed the frontend using **Vercel** and the backend using **Render**, configuring environment variables, API endpoints, and production builds to work reliably across environments.

On the backend, I used **Node.js and Express** with **MongoDB** to store internship applications and user data. Authentication and user-based filtering ensure that each user only sees their own applications. All dashboard metrics (status counts, averages, streaks, trends) are computed from real application data rather than placeholder values.

On the frontend, I used **React** and **Tailwind CSS** to redesign the UI with a strong focus on clarity, spacing, and consistency. I implemented light and dark themes, reusable stat components, and data visualisations using **Recharts** to show application breakdowns, trends, and streaks. 

The application includes:

A searchable and filterable internship table
Status-based tracking (Accepted, Rejected, Pending, Follow-up, Withdrawn)
A follow-up notification system with overdue and upcoming reminders
A dashboard with insights such as application trends and streaks

To support **mobile users**, the interface dynamically adapts:
Mobile switches to a card-based vertical layout optimised for touch interaction
Filters, actions, and follow-up controls are rearranged for smaller screens without losing functionality

---

## Optimizations

- Refactored frontend components to be reusable and consistent across pages
- Normalized application statuses to ensure consistent colors in tables and charts
- Used memoization to avoid unnecessary recalculations for analytics-heavy components
- A fully functioning and polished darkmode view
- Improved layout density so more information is visible without clutter

These changes improved performance, maintainability, and overall user experience.

---

## Lessons Learned

This project started as a local build and my main takeaway was learning how to **move a project from local development to a fully deployed web application**. Deploying with **Vercel** and **Render** exposed real-world challenges such as environment configuration, API connectivity issues, and debugging problems that only appear in production.

I also spent significant time **redoing and polishing the frontend**, refining the layout, theming, and data presentation to make the dashboard clearer and more intuitive. This reinforced the importance of not just making features work, but making them reliable, scalable, and pleasant to use. Overall, the project helped me better understand full-stack workflows and the level of polish expected in production-ready applications.

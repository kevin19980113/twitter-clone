# Twitter Clone - Full Stack Application

## Project Overview

This project is a full-stack application that replicates core functionalities of Twitter. It's built using modern web technologies and demonstrates core concepts in both frontend and backend development.

## Features

- User authentication utilizing JWT ( access token / refresh token )
- User profile management
- Post creation, deletion, and interaction (comments, likes)
- Follow/unfollow functionality
- Feed generation (all posts, liked posts, following posts)
- Suggested users
- Real-time notifications
- Responsive design

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- jwt for authentication
- Cloudinary for image upload and management

### Frontend

- React with TypeScript
- Vite as build tool
- React Router for navigation
- React Query for data fetching and managing cache
- Zustand for global state management
- React-hook-form for form handling
- Zod for schema validation
- Sonner for toast
- Tailwind CSS for styling

## Project Structure

The project is divided into two main parts:

1. Backend (/backend)

   - Controllers: Handle the business logic
   - Models: Define data structures
   - Routes: Define API endpoints
   - Middleware: Handle authentication, request processing, protect route.

2. Frontend (/frontend)

   - Components: Reusable UI components
   - Pages: Main views of the application
   - Hooks: Custom React hooks
   - Utils: Utility functions
   - Types: TypeScript type definitions

## Link

- https://twitter-clone-vje9.onrender.com

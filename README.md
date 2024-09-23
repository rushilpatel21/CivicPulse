# CivicPulse Web App

CivicPulse is a web application designed to allow users to report and track community issues such as road damage, drainage problems, and more. The application includes a public-facing frontend for reporting and viewing issues and an admin panel for managing reports and users.

### Youtube Video

You can view the video of the application [here](https://www.youtube.com/watch?v=qlDzaNWU6mc).

### Live Demo

You can view the live demo of the application [here](https://civicpulse.vercel.app).

> **Note:** I have disabled my GCP account to avoid getting charged, so heatmap and places api would not be working.

> **Note:** In some cases, clicking on the heatmap may cause the whole window to go blank. If this happens, simply reload the page. This issue typically occurs the first time you click on the heatmap.


## Table of Contents

- [Libraries Used](#libraries-used)
- [Setup](#setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
  - [Frontend Environment Variables](#frontend-environment-variables)
  - [Backend Environment Variables](#backend-environment-variables)
- [Code Explanation](#code-explanation)
- [Admin Features](#admin-features)

## Libraries Used

### Frontend

- **ReactJS**: A JavaScript library for building user interfaces.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects.
- **MUI**: A React component library that implements Google's Material Design.
- **Firebase**: For authentication and Firestore database.
- **Axios**: For making HTTP requests.
- **@react-google-maps/api**: For integrating Google Maps and Heatmap functionality.
- **Chart.js**: A JavaScript library for creating charts.
- **react-chartjs-2**: React wrapper for Chart.js.
- **react-toastify**: For creating toast notifications.
- **react-router-dom**: For handling routing in React applications.
- **sweetalert2**: A library for creating beautiful, responsive, customizable popup boxes.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **Firebase Admin SDK**: For server-side Firebase operations.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **@google/generative-ai**: Google's library for generative AI.
- **Axios**: For making HTTP requests.

## Setup

### Frontend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/rushilpatel21/CivicPulse.git
   cd client
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the `frontend` directory and add the following environment variables:

   ```env
   VITE_GOOGLE_API_KEY=
   VITE_GOOGLE_AUTH_DOMAIN=
   VITE_GOOGLE_PROJECT_ID=
   VITE_GOOGLE_STORAGE_BUCKET=
   VITE_GOOGLE_MESSAGING_SENDER_ID=
   VITE_GOOGLE_APP_ID=
   VITE_GOOGLE_MEASUREMENT_ID=
   VITE_GOOGLE_DATABASE_URL=
   VITE_GOOGLE_PAID_API=
   VITE_BACKEND_SERVER_PORT=
   VITE_BACKEND_SERVER_PORT_DEV=
   VITE_GOOGLE_RUSHIL_ID=
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

### Backend Setup

1. Navigate to the `backend` directory:
   ```sh
   cd server
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```env
   PORT=8000
   GEMINI_API_KEY=""
   GOOGLE_API_KEY=""
   GOOGLE_AUTH_DOMAIN=""
   GOOGLE_PROJECT_ID=""
   GOOGLE_STORAGE_BUCKET=""
   GOOGLE_MESSAGING_SENDER_ID=""
   GOOGLE_APP_ID=""
   GOOGLE_MEASUREMENT_ID=""
   GOOGLE_DATABASE_URL=""
   FIREBASE_TYPE=""
   FIREBASE_PROJECT_ID=""
   FIREBASE_PRIVATE_KEY_ID=""
   FIREBASE_PRIVATE_KEY="
   FIREBASE_CLIENT_EMAIL=""
   FIREBASE_CLIENT_ID=""
   FIREBASE_AUTH_URI=""
   FIREBASE_TOKEN_URI=""
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=""
   FIREBASE_CLIENT_X509_CERT_URL=""
   FIREBASE_UNIVERSE_DOMAIN=""
   ```

4. Start the backend server:
   ```sh
   npm start
   ```

## API Endpoints

The CivicPulse web application interacts with a variety of backend endpoints to manage issues, user roles, and reports. Below is a detailed description of the API endpoints used in the application, along with the corresponding functions in the frontend code.

### Gemini

- **Endpoint**: `/gemini`
- **Method**: `POST`
- **Description**: Sends form data to the Gemini API.
- **Function**: `Gemini`
- **Usage**:
  ```js
  const formData = new FormData();
  // Append form data here
  const response = await Gemini(formData);
  ```

### Issues

#### Get All Issues

- **Endpoint**: `/issues`
- **Method**: `GET`
- **Description**: Retrieves a list of all issues.
- **Function**: `getIssues`
- **Usage**:
  ```js
  const issues = await getIssues();
  ```

#### Get Issue by ID

- **Endpoint**: `/issues/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific issue by its ID.
- **Function**: `getIssuesById`
- **Usage**:
  ```js
  const issue = await getIssuesById(issueId);
  ```

#### Delete Issue by ID

- **Endpoint**: `/issues/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific issue by its ID.
- **Function**: `deleteIssueById`
- **Usage**:
  ```js
  const response = await deleteIssueById(issueId);
  ```

#### Delete Issue by Issue ID

- **Endpoint**: `/issues/issues/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific issue by its issue ID.
- **Function**: `deleteIssueByIssueId`
- **Usage**:
  ```js
  const response = await deleteIssueByIssueId(issueId);
  ```

#### Update Issue Progress

- **Endpoint**: `/issues/:id`
- **Method**: `PUT`
- **Description**: Updates the progress of a specific issue.
- **Function**: `updateIssueProgress`
- **Usage**:
  ```js
  const response = await updateIssueProgress(issueId, progress);
  ```

#### Get Issues by Department

- **Endpoint**: `/issues/department/:department`
- **Method**: `GET`
- **Description**: Retrieves issues filtered by department.
- **Function**: `getIssuesByDepartment`
- **Usage**:
  ```js
  const issues = await getIssuesByDepartment(department);
  ```

#### Get Issues by Clearance

- **Endpoint**: `/issues/clearance`
- **Method**: `GET`
- **Description**: Retrieves issues filtered by clearance (progress) status.
- **Function**: `getIssuesByClearance`
- **Usage**:
  ```js
  const issues = await getIssuesByClearance();
  ```

#### Get Issues by Month

- **Endpoint**: `/issues/month`
- **Method**: `GET`
- **Description**: Retrieves issues filtered by month (Last 6 months data).
- **Function**: `getIssuesByMonth`
- **Usage**:
  ```js
  const issues = await getIssuesByMonth();
  ```

#### Get Issues by Department Type

- **Endpoint**: `/issues/departmentType`
- **Method**: `GET`
- **Description**: Retrieves issues filtered by department type.
- **Function**: `getIssuesByDepartmentType`
- **Usage**:
  ```js
  const issues = await getIssuesByDepartmentType();
  ```

#### Get Heatmap Data

- **Endpoint**: `/issues/heatmap/getData`
- **Method**: `GET`
- **Description**: Retrieves data for the heatmap visualization.
- **Function**: `getHeatmapData`
- **Usage**:
  ```js
  const heatmapData = await getHeatmapData();
  ```

### User Management

#### Get All Users

- **Endpoint**: `/admin/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all users.
- **Function**: `getAllUsers`
- **Usage**:
  ```js
  const users = await getAllUsers();
  ```

#### Delete User Info

- **Endpoint**: `/admin/user/:id`
- **Method**: `DELETE`
- **Description**: Deletes a user's information.
- **Function**: `deleteUserInfo`
- **Usage**:
  ```js
  const response = await deleteUserInfo(userId);
  ```

#### Disable User Account

- **Endpoint**: `/admin/disable/:id`
- **Method**: `POST`
- **Description**: Disables a user's account.
- **Function**: `disableUserInfo`
- **Usage**:
  ```js
  const response = await disableUserInfo(userId);
  ```

#### Enable User Account

- **Endpoint**: `/admin/enable/:id`
- **Method**: `POST`
- **Description**: Enables a user's account.
- **Function**: `enableUserInfo`
- **Usage**:
  ```js
  const response = await enableUserInfo(userId);
  ```

#### Check if User is Admin

- **Endpoint**: `/admin/role/:id`
- **Method**: `GET`
- **Description**: Checks if a user has an admin role.
- **Function**: `isAdmin`
- **Usage**:
  ```js
  const isAdminUser = await isAdmin(userId);
  ```

#### Change User Role

- **Endpoint**: `/admin/role/:id`
- **Method**: `PUT`
- **Description**: Changes a user's role.
- **Function**: `changeRoleById`
- **Usage**:
  ```js
  const response = await changeRoleById(userId, role);
  ```

### Bug Reports

- **Endpoint**: `/bugs`
- **Method**: `POST`
- **Description**: Submits a bug report.
- **Function**: `bugReportApi`
- **Usage**:
  ```js
  const bugReport = {
    description: "Bug description",
    stepsToReproduce: "Steps to reproduce",
    expectedOutcome: "Expected outcome",
    actualOutcome: "Actual outcome"
  };
  const response = await bugReportApi(bugReport);
  ```

## Environment Variables

#### NOTE: There are 2 services that require you to have a billing account in Google Cloud Platform, which are Heatmap visualization layer and the Place Autocomplete Map API. It is named VITE_GOOGLE_PAID_API in Frontend .env file.

### Frontend Environment Variables

- `VITE_GOOGLE_API_KEY`: Your Google API key.
- `VITE_GOOGLE_AUTH_DOMAIN`: Your Firebase Auth domain.
- `VITE_GOOGLE_PROJECT_ID`: Your Firebase project ID.
- `VITE_GOOGLE_STORAGE_BUCKET`: Your Firebase storage bucket.
- `VITE_GOOGLE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
- `VITE_GOOGLE_APP_ID`: Your Firebase app ID.
- `VITE_GOOGLE_MEASUREMENT_ID`: Your Firebase measurement ID.
- `VITE_GOOGLE_DATABASE_URL`: Your Firebase database URL.
- `VITE_GOOGLE_PAID_API`: Your Google Paid API key.
- `VITE_BACKEND_SERVER_PORT`: Port for the backend server in production.
- `VITE_BACKEND_SERVER_PORT_DEV`: Port for the backend server in development.
- `VITE_GOOGLE_RUSHIL_ID`: Your Google ID.

### Backend Environment Variables

- `PORT`: Port for the backend server (default: 8000).
- `GEMINI_API_KEY`: Your Gemini API key.
- `GOOGLE_API_KEY`: Your Firebase API key.
- `GOOGLE_AUTH_DOMAIN`: Your Firebase Auth domain.
- `GOOGLE_PROJECT_ID`: Your Firebase project ID.
- `GOOGLE_STORAGE_BUCKET`: Your Firebase storage bucket.
- `GOOGLE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
- `GOOGLE_APP_ID`: Your Firebase app ID.
- `GOOGLE_MEASUREMENT_ID`: Your Firebase measurement ID.
- `GOOGLE_DATABASE_URL`: Your Firebase database URL.
- `FIREBASE_TYPE`: Your Firebase type.
- `FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `FIREBASE_PRIVATE_KEY_ID`: Your Firebase private key ID.
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key.
- `FIREBASE_CLIENT_EMAIL`: Your Firebase client email.
- `FIREBASE_CLIENT_ID`: Your Firebase client ID.
- `FIREBASE_AUTH_URI`: Your Firebase Auth URI.
- `FIREBASE_TOKEN_URI`: Your Firebase token URI.
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`: Your Firebase Auth provider x509 cert URL.
- `FIREBASE_CLIENT_X509_CERT_URL`: Your Firebase client x509 cert URL.
- `FIREBASE_UNIVERSE_DOMAIN`: Your Firebase universe domain.

## Code Explanation

### Frontend

- **Home Page**: Displays a welcome message along with About Us and FAQs.
- **User Profile Page**: Allows users to view and update their personal information.
- **Issue Details Page**: Shows detailed information about a selected issue, including images, description, status, and comments.
- **Issue Form Page**: Displays a form where user can report new issues.
- **Heat Map Page**: Shows a map with data points of the places where issues are reported.
- **Dashboard Page**: Displays Bar graph on number of reports per month (last 6 months), shows status on Number of resolved issues, in progress and unresolved issues. Also shows a doughnut graph regarding the type of department per issue.
- **Admin User Management Page**: Provides administrative features such as managing user accounts (delete or disable) and changing their roles.
- **Admin Issue Management Page**: Provides administrative features such as monitoring the Issues, deleting it or changing the progress status of the Issues.
- **Report Bug Page**: Available to Users to report any unusual behaviour in the website, so we can improve the website by fixing the said bug.

### Backend

- **API Endpoints**:
  - `/api/issues`: Handles creating, retrieving, updating, and deleting issues.
  - `/api/users`: Manages user accounts and authentication.
  - `/api/admin`: Provides admin-specific operations such as retrieving all issues and managing user roles.

## Admin Features

### User Management

- **User List**: Displays a table with columns for Name, Email, Sign-Up Date, Last Logged-In Date, Role, and Number of Issues Reported.
- **Actions**: Each row has buttons for deleting and disabling user accounts.

### Issue Management

- **Issue List**: Displays a list of all reported issues with filters for category, status, and date.
- **Update Status**: Allows admins to change the status of an issue (e.g., pending, in-progress, resolved).
- **Detailed View**: Provides a detailed view of each issue, including images and tags.

### Dashboard

- **Reports per Month**: A bar graph displaying the number of reports per month for the past 6 months.
- **Reports by Type**: A doughnut graph displaying the distribution of report types (Road, Electricity, etc.).
- **Case Status**: Three small sections (green, yellow, red) displaying the number of unresolved cases (red), cases under progress (yellow), and resolved cases (green).

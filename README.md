#  Gemini Toolkit

This project allows users to create various tools using the Gemini API without writing code, leveraging a node-based editor. The project is built with Next.js and Firebase.

## Table of Contents

- [Gemini Toolkit](#gemini-toolkit)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Firebase Configuration](#firebase-configuration)
    - [Running the Application](#running-the-application)
    - [Contributing](#contributing)
    - [License](#license)

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing dependencies)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Saigenix/gemini-toolkit.git
   cd gemini-toolkit
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   Or if you're using yarn:

   ```bash
   yarn install
   ```

### Environment Variables

To run the application, you'll need to add a `GEMINI_API_KEY` to your environment variables.

1. **Create an `.env.local` file in the root directory:**

   ```bash
   touch .env.local
   ```

2. **Add your `GEMINI_API_KEY` to the `.env.local` file:**

   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

### Firebase Configuration

To set up Firebase, you'll need to configure it with your own Firebase project details.

1. **Navigate to the `firebase.js` file located in the `lib` or `config` directory (adjust the path if necessary):**

   ```bash
   utils/firebase.js
   ```

2. **Replace the Firebase config object with your own Firebase project configuration:**

   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   };
   ```

   You can find this configuration in your Firebase Console under Project Settings.

### Running the Application

To start the development server:

```bash
npm run dev
```

Or if you're using yarn:

```bash
yarn dev
```

The application should now be running on `http://localhost:3000`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.

---

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this application on your local machine for development and testing, please follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) (which comes with Node.js)

### 1. Set Up Environment Variables

You need to create an environment file to store your API keys.

1.  Create a new file named `.env` in the root directory of the project.
2.  Add your Google AI (Gemini) API key to the `.env` file. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 2. Install Dependencies

Open your terminal, navigate to the project's root directory, and run the following command to install all the required packages:

```bash
npm install
```

### 3. Run the Development Servers

This application has two separate development servers that need to run at the same time in two separate terminal windows:

-   **Terminal 1: Next.js Frontend**
    This server runs the main web application.

    ```bash
    npm run dev
    ```

    Once it starts, you can access the application by opening **http://localhost:9002** in your web browser.

-   **Terminal 2: Genkit AI Backend**
    This server runs the AI flows (like the skill suggester).

    ```bash
    npm run genkit:watch
    ```

    This command watches for changes in your AI flows and automatically restarts the server, which is very helpful during development.

With both servers running, your local development environment is fully set up, and all features of the application should work as expected.

# 🧠 WooPlugin LLM Agent

A powerful tool that leverages AI to automatically generate custom WooCommerce plugins based on natural language prompts.

## Overview

WooPlugin LLM Agent is a web application that allows WordPress/WooCommerce developers to quickly generate custom plugins by simply describing what they need in plain English. The application uses Google's Gemini AI to transform text prompts into functional WooCommerce plugin code.

## Features Status

| Feature                                  | Status    |
| ---------------------------------------- | --------- |
| 🧠 LLM (Gemini) plugin generation        | ✅ Working |
| 💻 React-based frontend with Code Editor | ✅ Working |
| 📦 Backend API integration               | ✅ Working |
| 📥 Plugin save to MongoDB                | ✅ Working |
| 🔍 AI-powered code analysis              | ✅ Working |
| 📋 Plugin history viewing                | ✅ Working |
| 🔄 Real-time code editing                | ✅ Working |
| 🔒 Secure API integration                | ✅ Working |

## Technology Stack

### Frontend
- **React.js**: Core UI framework
- **Axios**: HTTP client for API requests
- **CodeEditor**: Custom component for code editing and syntax highlighting

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **MongoDB/Mongoose**: Database and ODM for plugin storage
- **Google Generative AI**: Gemini 2.0 Flash model for AI generation
- **Nodemon**: Development tool for auto-restarting server
- **Cors**: Cross-origin resource sharing middleware
- **Dotenv**: Environment variable management

## Project Structure

```
wooplugin-llm-agent/
├── Frontend/                      # React frontend application
│   ├── public/                    # Public assets
│   ├── src/                       # Source files
│   │   ├── components/            # React components
│   │   │   ├── CodeEditor.js      # Monaco code editor component
│   │   │   └── Loading.js         # Loading indicator component
│   │   ├── App.js                 # Main application component
│   │   ├── index.js               # Application entry point
│   │   └── styles.css             # Application styles
│   ├── package.json               # Frontend dependencies
│   └── README.md                  # Frontend documentation
│
├── backend/                       # Node.js backend application
│   ├── models/                    # Mongoose data models
│   │   └── plugin.js              # Plugin schema and model
│   ├── index.js                   # Main server file and API endpoints
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables (not in repo)
│
└── README.md                      # Project documentation
```

## API Endpoints

| Endpoint             | Method | Description                                      |
| -------------------- | ------ | ------------------------------------------------ |
| `/generate`          | POST   | Generates plugin code from text prompt           |
| `/save`              | POST   | Saves plugin code to MongoDB                     |
| `/analyze`           | POST   | Analyzes plugin code for security and quality    |
| `/plugin-history`    | GET    | Retrieves saved plugin history                   |

## Key Functions

### Backend
- `model.generateContent()`: Interfaces with Gemini AI to generate plugin code
- `Plugin.create()`: Saves plugin data to MongoDB
- `Plugin.find()`: Retrieves plugin history from database
- Express middleware for request handling and routing

### Frontend
- `handleGenerate()`: Sends prompt to backend and processes response
- `handleSaveAndDownload()`: Saves edited plugin to database
- `CodeEditor`: Component for displaying and editing code
- State management for application flow

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wooplugin-llm-agent.git
   cd wooplugin-llm-agent
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../Frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend directory with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npx nodemon index.js
   ```

2. Start the frontend development server:
   ```
   cd Frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Development Features

- **Hot Reloading**: Nodemon automatically restarts the server when files change
- **MongoDB Integration**: Mongoose ODM for easy database operations
- **Environment Variables**: Secure configuration using dotenv
- **CORS Support**: Cross-origin resource sharing enabled

## Usage

1. Enter a description of the WooCommerce plugin you want to create
2. Click "Generate Plugin" and wait for the AI to create your code
3. Review and modify the generated code in the editor if needed
4. Click "Save Plugin" to store it in your history
5. Access your plugin history to view, analyze, or modify previously created plugins

## Example Prompts

- "Create a plugin that adds a custom field to the checkout page for delivery instructions"
- "Generate a WooCommerce plugin that offers a buy-one-get-one-free discount"
- "Make a plugin that sends email notifications when products are back in stock"

## Future Enhancements

- User authentication system
- Plugin versioning
- Direct WordPress installation option
- Support for additional AI models

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

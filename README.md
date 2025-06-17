# 🧠 WooPlugin LLM Agent

A powerful tool that leverages AI to automatically generate custom WooCommerce plugins based on natural language prompts.

## Overview

WooPlugin LLM Agent is a web application that allows WordPress/WooCommerce developers to quickly generate custom plugins by simply describing what they need in plain English. The application uses Google's Gemini AI to transform text prompts into functional WooCommerce plugin code.

## Live Demo

- **Frontend**: [https://llmagent.vercel.app/](https://llmagent.vercel.app/)
- **Backend API**: [https://internship-task-3ccn.onrender.com](https://internship-task-3ccn.onrender.com)

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
| 📤 Plugin download as PHP file           | ✅ Working |
| ✏️ Plugin renaming                       | ✅ Working |
| 🗑️ Plugin deletion                       | ✅ Working |
| 🔄 Edit existing plugins                 | ✅ Working |

## Technology Stack

### Frontend
- **React.js**: Core UI framework
- **Axios**: HTTP client for API requests
- **Monaco Editor**: Code editor for syntax highlighting and editing
- **React Router**: For application routing
- **React Markdown**: For rendering markdown content

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
│   │   ├── index.html             # Main HTML file
│   │   ├── manifest.json          # Web app manifest
│   │   └── robots.txt             # Robots configuration
│   ├── src/                       # Source files
│   │   ├── components/            # React components
│   │   │   ├── Editor.js          # Monaco code editor component
│   │   │   ├── Loading.js         # Loading indicator component
│   │   │   └── Navbar/            # Navigation components
│   │   ├── Pages/                 # Page components
│   │   │   ├── Home.js            # Main plugin generation page
│   │   │   ├── About.js           # About page with markdown content
│   │   │   └── about.css          # Styling for about page
│   │   ├── App.js                 # Main application component
│   │   └── index.js               # Application entry point
│   ├── package.json               # Frontend dependencies
│   └── README.md                  # Frontend documentation
│
├── backend/                       # Node.js backend application
│   ├── controllers/               # API controllers
│   │   └── pluginController.js    # Plugin generation and management
│   ├── models/                    # Mongoose data models
│   │   └── plugin.js              # Plugin schema and model
│   ├── routes/                    # API routes
│   │   └── pluginRoutes.js        # Plugin-related endpoints
│   ├── utils/                     # Utility functions
│   ├── index.js                   # Main server file
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables (not in repo)
│
└── README.md                      # Project documentation
```

## API Endpoints

| Endpoint             | Method | Description                                      |
| -------------------- | ------ | ------------------------------------------------ |
| `/plugins/generate`  | POST   | Generates plugin code from text prompt           |
| `/plugins/save`      | POST   | Saves plugin code to MongoDB                     |
| `/plugins/analyze`   | POST   | Analyzes plugin code for security and quality    |
| `/plugins/plugin-history` | GET | Retrieves saved plugin history                 |
| `/plugins/:id`       | DELETE | Deletes a specific plugin                        |
| `/plugins/:id/rename`| PUT    | Renames a specific plugin                        |
| `/plugins/:id`       | PUT    | Updates an existing plugin's code and prompt     |

## Key Functions

### Backend
- `model.generateContent()`: Interfaces with Gemini AI to generate plugin code
- `Plugin.create()`: Saves plugin data to MongoDB
- `Plugin.find()`: Retrieves plugin history from database
- `analyzePlugin()`: Sends plugin code to Gemini for security and quality analysis
- `deletePlugin()`: Removes plugins from the database
- `renamePlugin()`: Updates plugin prompt/name
- `updatePlugin()`: Updates an existing plugin's code and prompt
- `generateEditPlugin()`: Regenerates plugin code based on existing code and new requirements

### Frontend
- `handleGenerate()`: Sends prompt to backend and processes response
- `handleSaveAndDownload()`: Saves edited plugin to database
- `handleAnalyze()`: Requests AI analysis of plugin code
- `handleDownload()`: Creates downloadable PHP file from plugin code
- `handleDelete()`: Removes plugins from history
- `handleRename()`: Updates plugin names
- `handleLoadPlugin()`: Loads an existing plugin into the editor for editing
- `handleEdit()`: Updates an existing plugin with edited code
- `handleEditGenerate()`: Sends existing code with new prompt to regenerate plugin code

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

## Deployment

The application is currently deployed with:
- Frontend hosted on [Vercel](https://vercel.com)
- Backend hosted on [Render](https://render.com)
- Database hosted on [MongoDB Atlas](https://www.mongodb.com/atlas/database)

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
6. Click "Load in Editor" to edit an existing plugin
7. Make changes to the code or update the prompt and regenerate
8. Click "Update Plugin" to save changes to the existing plugin

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

# Notes Frontend (React)

A lightweight React app that provides a clean UI for creating, editing, listing, and deleting notes. It talks to the FastAPI backend running at http://localhost:3001.

## Features

- Full CRUD via backend:
  - List notes (GET /notes)
  - Create note (POST /notes)
  - Get note (GET /notes/{id})
  - Update note (PUT /notes/{id})
  - Delete note (DELETE /notes/{id})
- Clean, responsive UI with accessible components
- Minimal dependencies for fast local development

## Prerequisites

- Backend running on http://localhost:3001
  - See ../notes_backend/README.md for setup
  - Ensure CORS allows http://localhost:3000 (already configured by default)

## Getting Started

1) Install dependencies:
- npm install

2) Start the frontend:
- npm start

Then open http://localhost:3000 in your browser.

## Configuration

- The API base URL is set in `src/config.js`:
  - export const BASE_URL = "http://localhost:3001";
- You may override via environment variables as needed (for future extension):
  - REACT_APP_API_BASE
  - REACT_APP_BACKEND_URL
  - REACT_APP_FRONTEND_URL
  - REACT_APP_PORT (defaults to 3000 when using CRA)
  - Other REACT_APP_* flags listed in container environment are currently not required for basic CRUD.

Note: When changing env vars, restart the dev server to apply changes.

## End-to-End Verification (Manual)

- Create:
  - Click "+ New" or "+ New Note" and enter a title and optional content
  - Click "Create" → note should appear in the list
- Read/List:
  - The list at the left should show all notes; selecting a note loads it
- Update:
  - Change title/content and click "Save" → list reflects updated title
- Delete:
  - Click "Delete" in the editor and confirm → note disappears from list
- Error handling:
  - Network/validation errors appear as a dismissible banner in the editor
- CORS:
  - Ensure no CORS errors in browser devtools; requests go to http://localhost:3001

## Scripts

- npm start → Dev server on http://localhost:3000
- npm test → Test runner
- npm run build → Production build to `build` folder

## Customization

Colors and component styles live in `src/App.css`. Components are in `src/components`, hooks in `src/hooks`.

For more on React, see https://reactjs.org/.

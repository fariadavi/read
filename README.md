# READ Frontend Application

## Description

This application is the user interface for READ (Repositório Eletrônico de Arquivos e Documentos), an Electronic Document Management System (EDMS) developed for the Department of Applied Informatics (DIA) at the Federal University of the State of Rio de Janeiro (UNIRIO).\
The system allows users to store, search and retrieve documents with permission management and separation of department files.

## Context

This project was developed as part of a capstone project to address the document management needs identified within the DIA at UNIRIO. The goal was to create a tailored solution to improve document handling processes within the department. Details of the project's conception and development can be found in the [associated paper](https://bsi.uniriotec.br/wp-content/uploads/sites/31/2024/04/202401DaviAnjosdeFaria.pdf).

## Code

### Folder Structure

- `public/`: Static assets.
- `src/`: Source code of the application.
  - `components/`: Reusable UI components.
  - `pages/`: Page components representing different views.
  - `services/`: Modules for API calls and business logic.
  - `App.js`: Main application component.
  - `index.js`: Entry point of the application.

## Setup 🛠️

### Environment Variables

A `.env` file with the following environment variables is required:
- `REACT_APP_SERVER_URL`: URL of the backend API (e.g., `http://localhost:8080`)
- `REACT_APP_GOOGLE_DEVELOPER_KEY`: Google Cloud API Key (e.g, `ABcdEfG0hIJ12Kl3_MNOP-qR-4StuV5wXyZaB6CD`)
- `REACT_APP_GOOGLE_OAUTH_CLIENT_ID`: Client ID for Google OAuth 2.0 (e.g., `123456789012-a12bcde3fg4h56jk7lmn8o9pqrs01tuv.apps.googleusercontent.com`)

### Other Services

- **Backend API:** This application requires the [READ API](https://github.com/fariadavi/read-api) to be running and accessible at the URL specified in `REACT_APP_SERVER_URL`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

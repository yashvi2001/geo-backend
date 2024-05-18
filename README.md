# Geospatial Data Management and Visualization Backend

This is the backend server for a geospatial data management and visualization web application. It is built using Node.js with Express.

## Features

1. **User Registration and Login:**
   - Users can register accounts and login with their credentials.

2. **File Upload:**
   - Supports uploading GeoJSON, KML, and TIFF files.
   - Converts files to GeoJSON format and saves them to the database.

3. **Data Retrieval:**
   - Provides endpoints to retrieve uploaded geospatial data.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yashvi2001/geo-backend.git
cd backend
```
## Installation

1. Install dependencies:

```bash
npm install

```
Start the server:

```bash
npm start
```
API Endpoints

- POST /register: Register a new user.
- POST /login: Login an existing user.
- POST /upload: Upload a GeoJSON, KML, or TIFF file.
- GET /data: Retrieve uploaded geospatial data.
### Dependencies
- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Multer: Middleware for handling multipart/form-data, used for file uploads.
- Cors: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- Sequelize: Promise-based Node.js ORM for SQL databases, used for database operations.


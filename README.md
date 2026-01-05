# Gravity Application

A robust full-stack web application designed for documenting job and life learnings, now featuring a secure authentication system and advanced data management.

## Core Stack
- **Frontend**: React 19.2 (Vite, HMR)
- **Backend**: Spring Boot 3.5.0
- **Language**: Java 25 (with Java 21 LTS features)
- **Database**: PostgreSQL (Production) / H2 (Test/Dev)
- **Security**: Spring Security + JWT (JSON Web Token)
- **Proxy**: Nginx (configured with 10MB upload limits)

## Key Features

### 1. Authentication & Security
- **JWT-Based Authentication**: Secure login and registration with token-based session management.
- **Role-Based Access Control**: Sensitive operations (like deletions) are restricted to users with `ADMIN` privileges.
- **Protected API**: All learning endpoints require a valid JWT, while storage is handled securely.
- **CSRF Protection**: Enabled for security, with specific bypasses for tested non-browser interactions.

### 2. Learning Management
- **Tile & List Views**: Toggle between a visual tile layout and a detailed list view for better organization.
- **Advanced Sorting**: Sort learnings dynamically by category, title, or date.
- **Dynamic Categories**: Add and manage custom categories for your learnings.
- **Attachments**: Support for multiple file uploads per learning (Images, PDFs, etc.) up to 10MB.
- **Custom Properties**: Add arbitrary key-value pairs (e.g., "Source", "Author") to enrich your data.

### 3. Verification & Stability
- **Full Test Suite**: 30/30 backend unit tests passing, covering controllers, security filters, and entities.
- **Infrastructure**: Nginx configuration optimized for file uploads and correct header forwarding.
- **Environment Parity**: Dev/Prod profile configurations for seamless deployment.

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Recommended)
- [Java 25](https://jdk.java.net/25/) & [Maven](https://maven.apache.org/) (For local backend dev)
- [Node.js 20+](https://nodejs.org/) & [npm](https://www.npmjs.com/) (For local frontend dev)

### Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update `.env` with your desired database credentials and `JWT_SECRET`.

### Option 1: Start with Docker (Recommended)
The easiest way to start the entire stack (PostgreSQL, Backend, and Frontend) is using the provided helper script:
```bash
# To start the application
./run.sh start

# To stop the application
./run.sh stop
```
The application will be accessible at [http://localhost](http://localhost).

### Option 2: Local Development

#### 1. Database
Ensure a PostgreSQL instance is running and create a database named `learningdb`.

#### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The API will be available at `http://localhost:8080/api`.

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Environment Variables
- `PORT`: Application port (default: 8080)
- `DB_HOST`: Database hostname
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for token signing
- `SPRING_PROFILES_ACTIVE`: Spring profile (`dev` or `prod`)



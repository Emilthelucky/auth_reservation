# Auth Reservation System 🛂📅

This project is an authentication-based reservation system built using Node.js, MongoDB, and Redis. The application is containerized using Docker for easy setup and deployment.

## Features ✨
- **User Authentication**: Secure login and signup.
- **Reservation Management**: Create and manage reservations.
- **MongoDB Integration**: Stores reservation data.
- **Redis Integration**: Caching layer for performance optimization.

## Prerequisites 🛠
- Docker
- Docker Compose

## Installation 🚀

1. Clone the repository:
    ```bash
    git clone https://github.com/Emilthelucky/auth_reservation.git
    cd auth_reservation
    ```

2. Create an `.env` file and add your variables:
    ```bash
    NODE_ENV=
    PORT=
    MONGO_URL=
    JWT_SECRET_KEY=
    REDIS_USERNAME=
    REDIS_PASSWORD=
    EMAIL_USER=
    EMAIL_PASS
    ```

3. Build and start the application using Docker Compose:
    ```bash
    docker-compose up --build
    ```

4. Access the application at `http://localhost:5000`.
5. Docker compose will test the project itself, but you can test the entire project yourself with the comand below:
    ```bash
    npm run test
    ```

## Docker Setup 🐳

This project includes the following services:
- **App**: Node.js server running the main application.
- **MongoDB**: NoSQL database for storing reservation data.
- **Redis**: Caching server to speed up response times.

### `docker-compose.yml`
- The app runs on port `5000`.
- MongoDB runs on port `27017`.
- Redis runs on port `6379`.

### Volumes:
- MongoDB data is persisted using Docker volumes to `mongo-data`.

## Usage 📖

- Run `docker-compose up` to start the application.
- Access the API and make reservations or manage users through the authentication system.

## Environment Variables 🌍
Make sure to set the following environment variables in your `.env` file:
- `NODE_ENV`: Set this to `production` for the live environment.
- `MONGO_URI`: MongoDB connection string.

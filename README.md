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
    git clone https://github.com/Emilthelucky/auth_reservation.git cd server
    ```

2. Create an `.env` file and add your variables:
    ```bash
    PORT=
    MONGO_URL=
    JWT_SECRET_KEY=
    REDIS_USER=
    REDIS_PASSWORD=
    REDIS_HOST=
    REDIS_PORT=
    EMAIL_USER=
    EMAIL_PASS=
    ```

3. Build and start the application using Docker Compose:
    ```bash
    docker-compose up --build
    ```
    or in detached mode
    ```bash
    docker-compose up --build -d
    ```

4. Access the application at `http://localhost:8080`.
5. You can test the entire project yourself with the comand below:
    ```bash
    npm run test
    ```
6. After that you can also run the project with:
    ```bash
    npm run dev
    ```
    or
    ```bash
    npm run start
    ```

## `Docker Setup 🐳`

This project includes the following services:
- **App**: Node.js server running the main application.
- **MongoDB**: NoSQL database for storing reservation data.
- **Redis**: Caching server to speed up response times.

### `docker-compose.yml`
- The app runs on port `8080`.

## Usage 📖

- Run `docker-compose up` to start the application.
- Access the API and make reservations or manage users through the authentication system.

## Environment Variables 🌍
Make sure to set the following environment variables in your `.env` file  you can see example env file in .env.example:

## Postman URL
https://documenter.getpostman.com/view/31067502/2sAXjRUp3m

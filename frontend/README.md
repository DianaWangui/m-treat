# M-TREAT Full-Stack Developer MVP

This project, **M-TREAT**, is a patient registration and authentication system built with **React**, **Redux**, **Django**, and **PostgreSQL**. The goal is to demonstrate a full-stack solution where data flows seamlessly between the frontend and backend. This README will guide you through the setup process, dependencies, and how to get the project up and running.

---

## Features

- **Patient Registration:** A user-friendly form where patients can register with their personal details (userame, email, phone, password). Input data is validated on both frontend and backend, and then saved into the PostgreSQL database.
- **User Authentication:** Implements token-based authentication using Django’s authentication system. Users can log in, and their session is securely managed.
- **Patient Data Retrieval & Update:** After logging in, users can access their dashboard and update their information (excluding email). The data is fetched securely from the backend API.

---

## Technologies Used

- **Frontend:**
  - React
  - Redux (State management)
  - Axios (API requests)
  - React Router (Navigation)
  
- **Backend:**
  - Django
  - Django REST Framework (API)
  - PostgreSQL (Database)
  - JWT (Authentication tokens)
  
- **Other Tools:**
  - Git (Version Control)
  - Node.js (Development Environment)

---

# Setup Instructions

# 1. Clone the Repository

## Clone the repository to your local machine
git clone https://github.com/yourusername/your-repository-name.git
cd your-repository-name

## Navigate to the backend directory
cd backend

## Create and activate a virtual environment
## For Windows: venv\Scripts\activate
python3 -m venv venv
source venv/bin/activate  

## Install dependencies
pip install -r requirements.txt

## Apply database migrations
python manage.py migrate

## Create a superuser account
python manage.py createsuperuser

## Collect static files
python manage.py collectstatic

## Start the Django development server
python manage.py runserver

## Navigate to the frontend directory
cd ../frontend

## Install dependencies
npm install

## Start the React development server
npm start

## Install CORS headers for Django
pip install django-cors-headers

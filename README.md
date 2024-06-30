# Project Name

## Table of Contents
- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)

## Introduction

This project, developed for HEINEKEN Vietnam, aims to automate the analysis of promotional materials in images. The tool can detect brand logos (Heineken, Tiger, Bia Viet, Larue, Bivina, Edelweiss, Strongbow), beer products, consumers, and various promotional items (posters, banners, LED signs). By doing so, it helps reduce time and costs for HEINEKEN Vietnam while ensuring effective brand presence in locations like restaurants, bars, and stores.

## Technologies Used

- **Backend:** Node.js, Express
- **Frontend:** Next.js, React
- **AI Service:** Python, PyTorch

## Project Structure
```
root/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── app.js
│ ├── uploads/
│ ├── package.json
│ ├── .gitignore
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ ├── components/
│ │ ├── libs/
│ │ └── utils/
│ ├── public/
│ ├── package.json
│ ├── .gitignore
│ └── .env
│
├── main.py
├── run.py
├── requirements.txt
└── README.md
```


## Installation

### Prerequisites

- Node.js and npm (yarn)
- Python 3 and pip

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/LacTQuan/hackhcm-Rambutan.git
    cd hackhcm-Rambutan
    ```

2. Set up the backend:
    ```bash
    cd backend
    yarn
    cp .env.example .env
    # Fill in your environment variables in the .env file
    ```

3. Set up the frontend:
    ```bash
    cd ../frontend
    yarn
    cp .env.example .env
    ```

4. Set up the AI service:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Project

### Backend

To start the backend server:

```bash
cd backend
yarn start
```

### Frontend

To start the frontend server:

```bash
cd frontend
yarn start
```

### AI Service

To start the Python service:

```bash
python main.py
```


# Ethereum Balance Checker
A full-stack web application to check Ethereum (ETH, USDC, LINK) balances for any Ethereum address. The app features a React + Vite frontend and an Express + TypeScript backend, using the Viem library for blockchain interactions.


Video Preview

https://github.com/user-attachments/assets/6b1d2321-8115-4707-ae39-6f422e507b71

## Features
- Check balances for ETH, USDC, and LINK on Ethereum mainnet
- Fast responses with in-memory caching
- User-friendly React interface
- Input validation and helpful error messages

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd EthereumBalanceChecker
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
npm install
```

### 3. Setup Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
```

## Usage

### 1. Start the Backend
```bash
cd backend
npm start
```
The backend will start on the port specified in `.env` (default: 4000).

### 2. Start the Frontend
```bash
cd ../frontend
npm run dev
```
The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

### 3. Open the App
Visit [http://localhost:5173](http://localhost:5173) in your browser. Enter any Ethereum address to view balances for ETH, USDC, and LINK.

## Configuration

### Backend (`backend/.env`)
```
PORT=4000
```

### Frontend (`frontend/.env`)
```
VITE_BACKEND_API_URL=http://localhost:4000
```
Set this to your backend URL if running on a different host/port.

## Example Output
- Enter a valid Ethereum address (e.g., `0x...`).
- The app will display balances for ETH, USDC, and LINK, with formatted values.
- If the data is cached (less than 60 seconds old), a notification will appear.

## Troubleshooting
- Ensure both backend and frontend are running.
- Check that the backend port matches `VITE_BACKEND_API_URL` in the frontend `.env`.
- For CORS issues, verify that both servers are on the same host or configure appropriately.
- For blockchain errors, ensure you have internet access and the backend can reach the Ethereum mainnet.

## Contact & Contributing
Created by Karandeep Singh.

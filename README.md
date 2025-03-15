# Online Auction System

A real-time online auction system where users can place bids on an item, and the highest bid updates dynamically across all connected users.

This project demonstrates real-time bid updates using **WebSockets**, showcasing network programming by enabling **multiple** users to interact **dynamically** over a shared auction platform.

## Features

- **Real-time Bidding**: Users can place bids, and the highest bid updates instantly.
- **Live Auction Timer**: The auction has a countdown timer that ends the bidding session.
- **Auction Restart**: After the auction ends, a button allows restarting the auction.
- **Multi-Device Support**: Users can join from different devices and see live updates.

## Technologies Used

### Frontend

- Vite + React
- Socket.io-client
- CSS for styling

### Backend

- Node.js + Express
- Socket.io for real-time communication

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/online-auction-system.git
cd online-auction-system
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
npm install
```

### 3. Run the Project

#### Start Backend Server

```bash
npm run dev
```

By default, the backend runs on `http://0.0.0.0:5000`.

#### Start Frontend (Vite)

```bash
npm run dev
```

By default, the frontend runs on `http://YOUR_PC_IP:5173`.
Replace `YOUR_PC_IP` with your actual IP from `ipconfig` (Windows) or `ifconfig` (Linux/Mac).

#### Note

`server.host` under vite.config.js has to be set to `true` for enabling other devices on the same network to connect.

## Usage

1. Open the frontend URL in multiple browser tabs or devices.
2. Enter a bid amount higher than the current price and place a bid.
3. The highest bid updates in real time across all connected users.
4. When the timer runs out, the auction ends.
5. Click "Restart Auction" to reset the timer and restart bidding.

## License

This project is open-source. Feel free to modify and expand it.

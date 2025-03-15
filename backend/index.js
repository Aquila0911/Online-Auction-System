const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow all origins (for testing)
  },
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

let currentPrice = 100;
const auctionDuration = 60 * 1000; // 5 minutes in milliseconds
let auctionEndTime = Date.now() + auctionDuration;
let auctionEnded = false;

const startAuctionTimer = () => {
  auctionEndTime = Date.now() + auctionDuration;
  auctionEnded = false;

  const checkAuctionEnd = setInterval(() => {
    if (Date.now() >= auctionEndTime) {
      if (!auctionEnded) {
        auctionEnded = true;
        io.emit("auctionEnded");
      }
      clearInterval(checkAuctionEnd);
    }
  }, 1000);
};

startAuctionTimer(); // Start auction when server runs

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current auction data when a user connects
  socket.emit("auctionUpdate", {
    currentPrice,
    endTime: auctionEndTime,
  });

  // Handle bidding
  socket.on("placeBid", (bid) => {
    if (Date.now() < auctionEndTime && bid > currentPrice) {
      currentPrice = bid;
      io.emit("auctionUpdate", { currentPrice, endTime: auctionEndTime });
    }
  });

  // Restart Auction
  socket.on("restartAuction", () => {
    currentPrice = 100;
    startAuctionTimer();
    io.emit("auctionRestarted", { currentPrice, endTime: auctionEndTime });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

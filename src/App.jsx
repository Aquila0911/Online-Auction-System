import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

// const socket = io("http://localhost:5000");
const socket = io("http://192.168.202.41:5000/");

function Auction() {
  const [currentPrice, setCurrentPrice] = useState(100);
  const [bidAmount, setBidAmount] = useState("");
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default

  useEffect(() => {
    socket.on("auctionUpdate", (auction) => {
      setCurrentPrice(auction.currentPrice);
      setTimeLeft(
        Math.max(0, Math.floor((auction.endTime - Date.now()) / 1000))
      );
    });

    socket.on("auctionEnded", () => {
      setEnded(true);
      setTimeLeft(0);
    });

    socket.on("auctionRestarted", (auction) => {
      setCurrentPrice(auction.currentPrice);
      setTimeLeft(
        Math.max(0, Math.floor((auction.endTime - Date.now()) / 1000))
      );
      setEnded(false);
    });

    return () => {
      socket.off("auctionUpdate");
      socket.off("auctionEnded");
      socket.off("auctionRestarted");
    };
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft > 0 && !ended) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, ended]);

  const placeBid = () => {
    const bidValue = parseFloat(bidAmount);
    if (!ended && bidValue > currentPrice) {
      socket.emit("placeBid", bidValue);
      setBidAmount("");
    }
  };

  const restartAuction = () => {
    socket.emit("restartAuction");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="auction-container">
      <h1 className="auction-title">Auction: Laptop</h1>
      <p className="auction-price">Current Price: ${currentPrice}</p>
      {ended ? (
        <div>
          <p className="auction-ended">Auction Ended</p>
          <button className="restart-button" onClick={restartAuction}>
            Restart Auction
          </button>
        </div>
      ) : (
        <div className="bid-section">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid"
            className="bid-input"
          />
          <button className="bid-button" onClick={placeBid}>
            Place Bid
          </button>
          <p className="auction-timer">Time Left: {formatTime(timeLeft)}</p>
        </div>
      )}
    </div>
  );
}

export default Auction;

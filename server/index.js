const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.js");
const usersRoute = require("./routes/users.js");
const hotelsRoute = require("./routes/hotels.js");
const roomsRoute = require("./routes/rooms.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const reservationRoutes = require("./routes/reservation.js");


const app = express();
dotenv.config();

const connect = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO URL:", process.env.MONGO ? "Set" : "Not set");
    console.log("Full MONGO URL:", process.env.MONGO ? process.env.MONGO + 'test?retryWrites=true&w=majority' : "Not set");
    
    if (!process.env.MONGO) {
      console.error("MONGO environment variable is not set");
      throw new Error("MONGO environment variable is required");
    }
    
    await mongoose.connect(process.env.MONGO + 'test?retryWrites=true&w=majority');
    console.log("✅ Connected to MongoDB successfully!");
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // Don't throw error, let the server start without DB for now
    console.log("Server will start without database connection");
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors({
  origin: ["https://bookingsy-a0ecb.web.app", "http://localhost:3000"],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Syria Booking API is running!", status: "success" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/reservations", reservationRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
}); 
const PORT = process.env.PORT || 8800;

// Start the server
app.listen(PORT, () => {
  console.log(`Connected to backend on port ${PORT}.`);
});

// Connect to MongoDB after server starts
connect().catch(err => {
  console.error("Failed to connect to MongoDB:", err);
  // Don't exit the process, let the server run without DB
});

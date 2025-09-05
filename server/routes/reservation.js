const express = require("express");
const Reservation = require("../models/Reservation.js");
const { verifyToken, verifyUser } = require("../utils/verifyToken.js");
const User = require("../models/User.js");
// Initialize the router
const router = express.Router();

// CREATE RESERVATION
router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reservationData = {
      ...req.body,
      user: req.user.id, // Ensure this matches your schema
      userName: user.username,
      userEmail: user.email
    };

    const newReservation = new Reservation(reservationData);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    console.error("Reservation error:", err);
    res.status(500).json({ message: "Reservation failed", error: err.message });
  }
});
// GET USER RESERVATIONS
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Check if user is requesting their own reservations or is admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not authorized to view these reservations" });
    }
    
    const reservations = await Reservation.find({ user: req.params.userId })
      .populate("hotel")
      .populate("room");
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE RESERVATION
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    // Check if user owns the reservation or is admin
    if (reservation.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not authorized to update this reservation" });
    }
    
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedReservation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE RESERVATION
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    // Check if user owns the reservation or is admin
    if (reservation.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this reservation" });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
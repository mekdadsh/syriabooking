import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";
import "./UserReservations.css";

const ReservationPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: reservations,
    loading,
    error,
    reFetch,
  } = useFetch(user ? `/reservations/${user._id}` : null);
  
 const handleCancel = async (reservationId) => {
  try {
    await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`, {
      withCredentials: true
    });
    reFetch();
  } catch (err) {
    console.error("Cancel failed:", err);
    alert("Failed to cancel reservation. Try again.");
  }
};

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="reservations-container">
          <h1 className="reservations-title">My Reservations</h1>
          <div className="no-reservations">Please log in to view your reservations.</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="reservations-container">
          <h1 className="reservations-title">My Reservations</h1>
          <div className="loading">Loading your reservations...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="reservations-container">
          <h1 className="reservations-title">My Reservations</h1>
          <div className="error-message">
            Failed to load reservations. Please try again later.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="reservations-container">
        <h1 className="reservations-title">My Reservations</h1>
{reservations.map((reservation) => {
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const days =
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

  const basePrice = days * reservation.price;
  const extrasPrice = reservation.extraTotalPrice || 0;
  const totalPrice = basePrice + extrasPrice;

  return (
    <div className="reservation-card" key={reservation._id}>
      <h2 className="hotel-name">
        {reservation.hotel?.name || "Hotel not available"}
      </h2>
      <p className="room-info">
        {reservation.room?.title || "Room not available"} -{" "}
        {reservation.room?.desc || ""}
      </p>
      <p className="dates">
        {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
      </p>
      <p className="room-info">Name: {reservation.userName}</p>
      <p className="room-info">Email: {reservation.userEmail}</p>
      <p className="room-info">Guests: {reservation.guests || "N/A"}</p>

      {reservation.extras && reservation.extras.length > 0 && (
        <div className="extras-info">
          <p className="room-info">Extras:</p>
          <ul>
            {reservation.extras.map((extra) => (
              <li key={extra.name}>
                {extra.name} (${extra.price})
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="price">Price per night: ${reservation.price}</p>
      <p className="days">Number of nights: {days}</p>
      <p className="extra-price">Extras total: ${extrasPrice}</p>
      <p className="total-price">Total: ${totalPrice}</p>
      <p className={`status ${reservation.status || "confirmed"}`}>
        {reservation.status || "confirmed"}
      </p>

      <button
        className="cancel-button"
        onClick={() => handleCancel(reservation._id)}
      >
        Cancel Reservation
      </button>
    </div>
  );
})}

      </div>
      <Footer />
    </div>
  );
};

export default ReservationPage;

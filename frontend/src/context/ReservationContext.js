import { createContext, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async (reservationData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE_URL}/reservations`, reservationData, {
        withCredentials: true
      });
      setReservations([...reservations, data]);
      return data;
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const getUserReservations = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/reservations/${userId}`, {
        withCredentials: true
      });
      setReservations(data);
      return data;
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        error,
        createReservation,
        getUserReservations,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
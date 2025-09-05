// Reserve.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  
  const extraServices = [
  { name: "Breakfast", price: 15 },
  { name: "Parking", price: 10 },
  { name: "Airport Shuttle", price: 25 },
  { name: "Spa Access", price: 30 },
];
const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext); // ✅ TOP LEVEL only
  const totalGuests = options.adults || 0 + options.children || 0;

  const navigate = useNavigate();
   const handleExtraChange = (e) => {
  const { checked, value } = e.target;
  const service = extraServices.find((s) => s.name === value);
  
  if (!service) return;

  setSelectedExtras((prev) =>
    checked
      ? [...prev, service]
      : prev.filter((item) => item.name !== value)
  );
};

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };  const handleClick = async () => {
    // Check if user is authenticated
    if (!user) {
      alert("Please login to make a reservation");
      navigate("/login");
      return;
    }

    try {
    // First mark rooms as unavailable
    await Promise.all(
      selectedRooms.map((roomId) => {
        return axiosInstance.put(`/rooms/availability/${roomId}`, {
          dates: alldates,
        });
      })
    );

    // Then create reservations
    const responses = await Promise.all(
      selectedRooms.map(async (roomId) => {
        const room = data.find((item) => 
          item.roomNumbers.some((number) => number._id === roomId)
        );
        
        if (!room) {
          throw new Error(`Room with ID ${roomId} not found`);
        }
        
        const extraTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);

        const reservationData = {
          user: user._id,
          userName: user.username,
          userEmail: user.email,
          hotel: hotelId,
          room: room._id,
          checkIn: dates[0].startDate,
          checkOut: dates[0].endDate,
          price: room.price,
          status: "confirmed",
          paymentStatus: "pending",
          extras: selectedExtras,
          extraTotalPrice: extraTotal,
          guests: options.adult + options.children
        };

        return await axiosInstance.post('/reservations', reservationData);
      })
    );

    setOpen(false);
    navigate("/myreservation");
  } catch (err) {
    console.error("Reservation failed:", err.response?.data || err.message);
    alert(`Reservation failed: ${err.response?.data?.message || err.message}`);
  }
};

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rExtras">
  <h4>Additional Services:</h4>
  {extraServices.map((service) => (
    <div className="extra-option" key={service.name}>
      <label>
        <input
          type="checkbox"
          value={service.name}
          onChange={handleExtraChange}
        />
        {service.name} (+${service.price})
      </label>
    </div>
  ))}
</div>

        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
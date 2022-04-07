import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import randomColor from "randomcolor";
import Calendar from "../components/Calendar";
import OverlaySpinner from "../components/OverlaySpinner";

const { REACT_APP_URL } = process.env;

export default function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    const error = auth.signout();
    if (!error) navigate("/", { replace: true });
    else console.log(error, "error from signin");
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const response = await fetch(`${REACT_APP_URL}/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });

    if (!response.ok) {
      setErrorMessage(response.message);
      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    } else {
      const data = await response.json();
      console.log(data, "data123");
      let bookedTime = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === "Booked") {
          bookedTime.push({
            id: data[i].id,
            color: randomColor(),
            from: data[i].startTime,
            to: data[i].endTime,
            title: data[i].room?.name,
          });
        }
      }

      setBookings(bookedTime);
    }

    setLoading(false);
  };

  const cancelBooking = async (id) => {
    setLoading(true);
    const response = await fetch(`${REACT_APP_URL}/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        status: "Cancelled",
      }),
    });

    if (!response.ok) {
      setErrorMessage(response.message);
      setLoading(false);

      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    } else {
      setLoading(false);
      fetchBookings();
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
          My Bookings
        </h2>
        <h2>Profile</h2>
        <OverlaySpinner isLoading={loading}></OverlaySpinner>
        <Calendar handleClickEvent={cancelBooking} events={bookings} />
        <button onClick={handleLogout}> logout</button>
        {errorMessage}
      </div>
    </div>
  );
}

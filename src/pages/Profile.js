import { useEffect, useState } from "react";
import randomColor from "randomcolor";
import { Modal } from "antd";
import Calendar from "../components/Calendar";
import OverlaySpinner from "../components/OverlaySpinner";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { REACT_APP_URL } = process.env;

export default function Profile() {
  const { confirm } = Modal;
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const showPromiseConfirm = (id) => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        return new Promise((resolve) => {
          cancelBooking(id).then(() => {
            resolve();
          });
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
          My Bookings
        </h2>
        <OverlaySpinner isLoading={loading}></OverlaySpinner>
        <Calendar handleClickEvent={showPromiseConfirm} events={bookings} />
        {errorMessage}
      </div>
    </div>
  );
}

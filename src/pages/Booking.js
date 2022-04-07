import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import randomColor from "randomcolor";
import Calendar from "../components/Calendar";
import TimeRange from "../components/TimeRange";
import OverlaySpinner from "../components/OverlaySpinner";

const Div = styled.div`
  color: red;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
  width: 100%;
  padding: 5px;
  margin-top: 5px;
`;

const { REACT_APP_URL } = process.env;
const Booking = () => {
  const params = useParams();
  const { state } = useLocation();
  const [roomData, setRoomData] = useState({});
  const [roomBookingData, setRoomBookingData] = useState([]);
  const [timeRange, setTimeRange] = useState(["10:00", "11:00"]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showModalData, setShowModalData] = useState(null);
  // const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchRoomById = async () => {
      const response = await fetch(`${REACT_APP_URL}/rooms/${params.id}`, {
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
      }

      const data = await response.json();
      console.log(data, "data");

      setRoomData(customDataFormat(data));
    };

    if (!state?.data) fetchRoomById();
    else setRoomData(customDataFormat(state.data));

    fetchBookingByRoom();
  }, []);

  const fetchBookingByRoom = async () => {
    const response = await fetch(
      `${REACT_APP_URL}/bookings/room?id=${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );

    if (!response.ok) {
      setLoading(false);
      setErrorMessage(response.message);
      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    } else {
      const data = await response.json();

      let bookedTime = [];
      for (let i = 0; i < data.length; i++) {
        bookedTime.push({
          id: data[i].id,
          color: randomColor(),
          from: data[i].startTime,
          to: data[i].endTime,
          title: data[i].room?.name,
        });
      }

      setRoomBookingData(bookedTime);
      setLoading(false);
      console.log(bookedTime);
    }
  };

  const customDataFormat = (data) => {
    let result = {
      name: data.name,
      href: "#",
      breadcrumbs: [{ id: 1, name: "Rooms", href: "/room" }],
      image: data.image,
      description: data.description,
      occupancy: [
        `${data.minCapacity} pax minimum`,
        `${data.maxCapacity} pax maximum`,
      ],
    };
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const time = convertTimeFormat(timeRange);
    const response = await fetch(`${REACT_APP_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        startTime: time.startTime,
        endTime: time.endTime,
        duration: time.duration,
        notes: "default",
        room: params.id,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setLoading(false);
      setErrorMessage(data.message);
      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    } else {
      await fetchBookingByRoom();
      setLoading(false);
    }
  };

  const convertTimeFormat = (range) => {
    const time = new Date().toISOString();
    const startTime = `${time.substr(0, 10)}T${range[0]}:00+00:00`;
    const endTime = `${time.substr(0, 10)}T${range[1]}:00+00:00`;
    const duration = parseInt(range[1]) - parseInt(range[0]);
    return { startTime, endTime, duration };
  };

  const onTimeChange = (value) => {
    const start = value[0] && parseInt(value[0].substr(0, 1));
    const end = value[1] && parseInt(value[1].substr(0, 1));
    if (start >= end) {
      setErrorMessage("Start time cannot be later than end time");
      console.log("Start time cannot be later than end time");
    }
    setErrorMessage("");
    setTimeRange(value);
  };

  // const handleCloseModal = () => {
  //   console.log("closed");
  //   setShowModalData(null);
  //   setIsVisible(false);
  // };

  return (
    <div className="bg-white">
      {/* <Modal visible={isVisible} handleClose={handleCloseModal}></Modal> */}
      <OverlaySpinner isLoading={loading}></OverlaySpinner>
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol role="list" className="max-w-2xl mx-auto px-4 flex items-center ">
            {roomData.breadcrumbs &&
              roomData.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center">
                    <Link to="/room">
                      <a className="mr-2 text-sm font-medium text-gray-900">
                        {breadcrumb.name}
                      </a>
                    </Link>

                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-4 h-5 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>
              ))}
            <li className="text-sm">
              <a
                href={roomData.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {roomData.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-3xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {roomData.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
              <img
                src={roomData.image}
                className="w-full h-full object-center object-cover"
              />
            </div>

            <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
              <TimeRange onChange={(val) => onTimeChange(val)} />
              <button
                type="submit"
                className="mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Book
              </button>
            </form>
            <div>
              <Div>{errorMessage && "Error: " + errorMessage}</Div>
              <Div>
                <h2>Time Slot Booked</h2>
              </Div>
              {/* <Container>
                <Calendar handleClickEvent={null} events={roomBookingData} />
              </Container> */}
            </div>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {roomData.description}
                </p>
              </div>
            </div>
            <Calendar handleClickEvent={null} events={roomBookingData} />
            {/* <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">
                Room Capacity
              </h3>

              <div className="mt-4">
                <ul role="list" className="pl-4 list-disc text-sm space-y-2">
                  {roomData.occupancy &&
                    roomData.occupancy.map((occupancy) => (
                      <li key={occupancy} className="text-gray-400">
                        <span className="text-gray-600">{occupancy}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

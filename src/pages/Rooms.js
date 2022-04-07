import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomGallery from "../components/RoomGallery";
import OverlaySpinner from "../components/OverlaySpinner";

const { REACT_APP_URL } = process.env;

const Home = () => {
  const navigate = useNavigate();
  const [roomsData, setRoomsData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchRooms = async () => {
      const response = await fetch(`${REACT_APP_URL}/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      if (!response.ok) {
        // setErrorMessage(response.message);
        console.log(response.status);
        if (response.status == 401) {
          localStorage.removeItem("access_token");
        }
      } else {
        const data = await response.json();
        console.log(data, "data");

        setRoomsData(data);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const setRoom = (data) => {
    navigate(`${data.id}`, { state: data });
  };

  return (
    <>
      <OverlaySpinner isLoading={loading}></OverlaySpinner>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
            Rooms Available
          </h2>
          {/* <div class="flex flex-row">
          <div class="basis-1/4">01</div>
          <div class="basis-1/4">02</div>
          <div class="basis-1/4">03</div>
          <div class="basis-1/4">
            <Dropdown data={roomsData} setValue={setRoomData}></Dropdown>
          </div>
        </div> */}
          {roomsData && (
            <RoomGallery
              products={roomsData}
              onSelectProduct={setRoom}
            ></RoomGallery>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

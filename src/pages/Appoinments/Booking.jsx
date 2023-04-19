import React, { useState, useEffect } from "react";
import BookingForm from "./BookingForm";

const Booking = ({ setSelectedArtist, setCustomerInfo, customerInfo, fetchedLocations}) => {

  const [selectArtist, setSelectArtist] = useState([]);
  const [selectLocation, setSelectLocation] = useState("");

  useEffect(() => {
    if (selectLocation) {
      const token = localStorage.getItem("token");
  
      fetch(`/api/calender/${selectLocation}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setSelectArtist(data))
        .catch((error) =>
          console.error("Error fetching makeup artists:", error)
        );
    }
  }, [selectLocation]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((customerInfo) => ({
      ...customerInfo,
      [name]: value,
    }));
    if (name === "location") {
      setSelectLocation(value);
    }
    if (name === "artist") {
      const selectedArtist = selectArtist.find(
        (artist) => artist.name === e.target.value
      );

      setSelectedArtist(selectedArtist);
      console.log(`selectedArtist in Booking: ${JSON.stringify(selectedArtist)}`);
      // console.log(`selectedArtist in Booking: ${(selectedArtist)}`);
    }
  };

  return (
    <div>
      <BookingForm
        selectArtist={selectArtist}
        selectLocation={selectLocation}
        handleChange={handleChange}
        customerInfo={customerInfo}
        fetchedLocations={fetchedLocations}
      />
    </div>
  );
};

export default Booking;
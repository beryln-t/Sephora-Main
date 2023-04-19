import React, { useState, useEffect } from "react";
import { time } from "../../../time";
import moment from "moment";

const now = new Date();
const currentTime = now.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function timeToMins(time) {
  // console.log(`time: ${time}`);
  const [hours, minutes] = time.split(":");
  const calculateInMins = parseInt(hours) * 60 + parseInt(minutes);
  return calculateInMins;
}

const checkTimeSlot = (startTime) => {
  const startTimeInMins = timeToMins(startTime);
  const currTimeInMins = timeToMins(currentTime);

  return currTimeInMins > startTimeInMins;
};

function Times({ date, selectArtist, customerInfo }) {
  const [event, setEvent] = useState(null);
  const [info, setInfo] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);
  const [apptTiming, setApptTiming] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const makeAppt = async (apptTiming) => {
    try {
      const token = localStorage.getItem("token");
      const formattedDate = moment(date).format("YYYY-MM-DD");
      console.log(`formattedDate: ${formattedDate}`);
  
      const response = await fetch(`/api/booking/${customerInfo.name}/${formattedDate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(apptTiming),
      });

      const data = await response.json();
      return { status: response.status, message: data.message };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { status: 400, message: error.message };
    }
  };
  console.log("selectArtist:", JSON.stringify(selectArtist));

  const clearErrorMessage = () => {
    setErrorMessage(null);
  }

  const displayInfo = async (e) => {
    const clickedTimeslot = e.target.innerText;
    setInfo(true);
    setEvent(clickedTimeslot);
    setDateChanged(false);
    setErrorMessage(null);

    const newAppointment = await makeAppt({
      date: date.toLocaleDateString("en-UK"),
      timeslot: e.target.innerText,
      makeupArtist: {
        id: selectArtist._id,
      },
      location: {
        id: selectArtist.location.id,
      },
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
      },
    });

    if (newAppointment.status === 200) {
      setApptTiming((apptTiming) => [...apptTiming, { timeslot: clickedTimeslot }]);
    } else {
      setErrorMessage(newAppointment.message); // Display the error message
    }
  };

  const todayDate = new Date();

  const futureDate = date > todayDate;
  console.log(`date in Times: ${date}`);

  useEffect(() => {
    setDateChanged(true);
    setInfo(false);
    clearErrorMessage();
  }, [date]);

  useEffect(() => {
    if (selectArtist && date) {
      const token = localStorage.getItem("token");
  
      fetch(`/api/booking/${selectArtist._id}/${moment(date).format("YYYY-MM-DD")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setApptTiming(data))
        .then((data) => {
          console.log("Fetched data: ", data);
        })
        .catch((error) =>
          console.error("Error fetching booked appointments:", error)
        );
    } else {
      setApptTiming([]);
    }
  }, [selectArtist, date]);

  const isTimeSlotWithinWorkingHours = (startTime, endTime, selectArtist) => {
    const artist = selectArtist?.workingHours;
    console.log(`artist: ${JSON.stringify(artist)}`);
    // console.log("selectArtist in Times:", JSON.stringify(selectArtist));

    const workingHourStartInMins = timeToMins(
      selectArtist.workingHours.startTime
    );
    const workingHourEndInMins = timeToMins(selectArtist.workingHours.endTime);
    const timeSlotStartInMins = timeToMins(startTime);
    const timeSlotEndInMins = timeToMins(endTime);

    return (
      timeSlotStartInMins >= workingHourStartInMins &&
      timeSlotEndInMins <= workingHourEndInMins
    );
  };

  const isTimeSlotWithinBreakTime = (startTime, endTime, selectArtist) => {
    const artist = selectArtist?.breakTime;
    // console.log(`artist: ${artist}`);
    const breakStartTimeInMins = timeToMins(selectArtist.breakTime.startTime);
    const breakEndTimeInMins = timeToMins(selectArtist.breakTime.endTime);
    const breakTimeSlotStartTimeInMins = timeToMins(startTime);
    const breakTimeSlotEndTimeInMins = timeToMins(endTime);
    return (
      (breakTimeSlotStartTimeInMins >= breakStartTimeInMins &&
        breakTimeSlotStartTimeInMins < breakEndTimeInMins) ||
      (breakTimeSlotEndTimeInMins > breakStartTimeInMins &&
        breakTimeSlotEndTimeInMins <= breakEndTimeInMins) ||
      (breakTimeSlotStartTimeInMins <= breakStartTimeInMins &&
        breakTimeSlotEndTimeInMins >= breakEndTimeInMins)
    );
  };

  const timeSlotDisabled = (startTime, futureDate, endTime, selectArtist) => {
    console.log(`apptTiming in Times: ${JSON.stringify(apptTiming)}`);
    const isPastTimeSlot = checkTimeSlot(startTime) && !futureDate;
    const isMakeUpArtistWithinWorkingHours = isTimeSlotWithinWorkingHours(
      startTime,
      endTime,
      selectArtist
    );
    const isMakeUpArtistWithinBreakHours = isTimeSlotWithinBreakTime(
      startTime,
      endTime,
      selectArtist
    );
    const isTimeSlotBooked = apptTiming.some(
      (appt) => appt.timeslot === `${startTime} - ${endTime}`
    );
    
    return (
      isPastTimeSlot ||
      !isMakeUpArtistWithinWorkingHours ||
      isMakeUpArtistWithinBreakHours ||
      isTimeSlotBooked 
     
    );
  };

  const isAllTimeSlotRemoved = () => {
    return time.every((times) => {
      const startTime = times.split(" - ")[0];
      const endTime = times.split(" - ")[1];
      return timeSlotDisabled(startTime, futureDate, endTime, selectArtist);
    });
  };

  const renderBookingMessage = () => {
    if (errorMessage) {
      return errorMessage
    } else if(!dateChanged && info && !errorMessage){
      return `Makeup session booked on ${date.toLocaleDateString(
        "en-UK"
      )} for timeslot ${event}.`;
    }
  };

  return (
    <div className="times">
      {time.map((times, index) => {
        const startTime = times.split(" - ")[0];
        const endTime = times.split(" - ")[1];
        //console.log(startTime)
        const disabledTime = timeSlotDisabled(
          startTime,
          futureDate,
          endTime,
          selectArtist
        );
        return !disabledTime ? (
          <div key={index}>
            <button onClick={(e) => displayInfo(e)}>{times}</button>
          </div>
        ) : null;
      })}
      {isAllTimeSlotRemoved() && <div>No timeslot available for today</div>}
      <div>
        {renderBookingMessage()}
      </div>
    </div>
  );
}

export default Times;
import { useEffect } from "react";

const CurrentLocation = ({ setUserLatitude, setUserLongitude }) => {

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords.latitude, position.coords.longitude)
        setUserLatitude(position.coords.latitude);
        setUserLongitude(position.coords.longitude);
      });
    }
  }, [setUserLatitude, setUserLongitude]);

  return null;
};

export default CurrentLocation;
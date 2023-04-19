import { useState, useEffect } from 'react';
import axios from "axios";
import L from "leaflet";
import { Button } from 'react-bootstrap';

export default function Distance({latitude,longitude, mapRef, handleResetMap}) {

    const [data, setData] = useState([]);
    const [error, setError] = useState(false);

    
    useEffect(() => {
        axios.get('/api/maps').then(response => {
          setData(response.data);
        }).catch(error => {
          console.error(error);
          setError(true);
        });
    }, []);

    /*  calculateDistance from
    https://www.movable-type.co.uk/scripts/latlong.html
    */

    function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInM = R * c; // in metres
    const distanceInKm = distanceInM / 1000; 
    const roundedDistance = distanceInKm.toFixed(2);
    return roundedDistance
    }

    if (!latitude || !longitude) {
        return <div>Calculating distance!</div>;
    }

    const sortedData = [...data].sort((a, b) => {
        const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
    });

    function handleZoom(location){
      // handleResetMap()
      mapRef.current.flyTo([location.latitude, location.longitude], 15)
    }

  return (
   <div>
        {error && <div>Error fetching data</div>}
        {sortedData.map(location => (
            <button onClick={()=>handleZoom(location)} key={location._id} className="reset-map">
                Distance to {location.name}: {calculateDistance(latitude, longitude, location.latitude, location.longitude)} km
            </button>
         ))}
    </div>
  )
}

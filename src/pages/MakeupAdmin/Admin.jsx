import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import MakeupArtist from "./MakeupArtist";
import NewArtist from "./NewArtist";
import "./Admin.css";

export default function Admin() {
  const [makeupArtists, setMakeupArtists] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedMakeUpLocation, setSelectedMakeUpLocation] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    console.log(JSON.stringify(adminToken))
    console.log(adminToken)

    if (adminToken) {
      // const isAdmin = JSON.parse(window.atob(adminToken.split(".")[1])).role === "HRADMIN";
      JSON.parse(window.atob(adminToken.split(".")[1])).customer.role === "HRADMIN" ? setIsAuth(adminToken) : false
    } 
    axios.get("/api/maps").then((response) => {
      setLocations(response.data);
    });
  }, []);

  useEffect(() => {
    async function fetchMakeupArtists() {
      try {
        if (isAuth && selectedMakeUpLocation !== "") {
          const response = await axios.get(
            `/api/makeupartist/${selectedMakeUpLocation}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMakeupArtists(response.data);
        }
      } catch (error) {
        console.error("Error fetching makeup artists:", error);
      }
    }
    fetchMakeupArtists();
  }, [selectedMakeUpLocation, isAuth]);

  const handleLocationChange = (event) => {
    setSelectedMakeUpLocation(event.target.value);
  };

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem("token");
    
    try {
      const response = await axios.delete(`/api/makeupartist/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (response.status === 200) {
        const updatedMakeupArtists = makeupArtists.filter(
          (makeupArtist) => makeupArtist._id !== id
        );
        setMakeupArtists(updatedMakeupArtists);
      }
    } catch (error) {
      console.error("Error deleting makeup artist:", error);
    }
  };

  function handleClick() {
    console.log("hi1");
    navigate("/newmakeupartist");
    console.log("hi2");
  }

  return (
    <>
      {!isAuth ? (
        <div className="centered-message">Access denied</div>
      ) : (
        <div className="container">
          <div className="row mt-4">
            <div className="col">
              <button className="btn btn-primary" onClick={handleClick}>
                Create New Make Up Artist
              </button>
            </div>
            <div className="col">
              <h2>Select a location:</h2>
              <select
                className="form-select"
                value={selectedMakeUpLocation}
                onChange={handleLocationChange}
              >
                <option value="">--Select a location--</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {makeupArtists && makeupArtists.length > 0 ? (
            <div className="row mt-4">
              <div className="col">
                <h2>Makeup Artists</h2>
                <ul className="list-group">
                  {makeupArtists.map((makeupArtist) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center Link"
                      key={makeupArtist._id}
                    >
                      <Link to={`/makeupartist/${makeupArtist._id}`}>
                        {makeupArtist.name}
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(makeupArtist._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="row mt-4">
              <div className="col">
                <p>No makeup artists found.</p>
              </div>
            </div>
          )}
        </div>
      )}
      <Routes>
        <Route path="/makeupartist/:id" element={<MakeupArtist />} />
        <Route path="/newmakeupartist" element={<NewArtist />} />
      </Routes>
    </>
  );
}
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";

const token = localStorage.getItem("token");

export default function Edit() {
  const { id } = useParams();
  const [makeupArtists, setMakeupArtists] = useState();
  const [minDate, setMinDate] = useState("");
  const [locations, setLocations] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  console.log(id);

  useEffect(() => {
    console.log(makeupArtists);
  }, [makeupArtists]);

  useEffect(() => {
    async function fetchMakeupArtists() {
      try {
        const response = await fetch(`/api/makeupartist/edit/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setMakeupArtists(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }
    fetchMakeupArtists();
  }, [id]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch(`/api/maps`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }
    fetchLocations();
  }, [id]);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    setMinDate(today);
  }, []);

  const handleInputChange = (event) => {
    if (event && event.target) {
      const { name, value } = event.target;

      if (name === "location") {
        setMakeupArtists((prevState) => ({
          ...prevState,
          location: { id: value },
        }));
      } else {
        setMakeupArtists((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/makeupartist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(makeupArtists),
      });
      if (!response.ok) {
        throw new Error("Failed to update makeup artist");
      }
      setSuccessMessage("Makeup artist updated successfully!");
      console.log("Makeup artist updated successfully!");
    } catch (error) {
      console.error("Error updating makeup artist:", error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          {makeupArtists && (
            <form onSubmit={handleSubmit}>
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  onChange={handleInputChange}
                  defaultValue={makeupArtists[0].name}
                  required
                  />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <select
                  name="location"
                  className="form-control"
                  defaultValue={makeupArtists[0].location._id}
                  onChange={handleInputChange} required>
                    <option value="">--Select Location--</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

        <div className="form-group">
        <label htmlFor="workingSchedule.startDate">Start Date: </label>
          <input
            type="date"
            name="workingSchedule.startDate"
            placeholder="YYYY-MM-DD"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            className="form-control"
            onChange={handleInputChange}
            defaultValue={moment(makeupArtists[0].workingSchedule.startDate).format("YYYY-MM-DD")}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
        <label htmlFor="workingSchedule.endDate">End Date: </label>
          <input
            type="date"
            name="workingSchedule.endDate"
            placeholder="YYYY-MM-DD"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            className="form-control"
            onChange={handleInputChange}
            defaultValue={moment(makeupArtists[0].workingSchedule.endDate).format("YYYY-MM-DD")}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="workingHours.startTime">Start Time:</label>
          <input
            type="time"
            name="workingHours.startTime"
            className="form-control"
            placeholder="HH:MM"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            onChange={handleInputChange}
            defaultValue={makeupArtists[0].workingHours.startTime}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="workingHours.endTime">End Time:</label>
          <input
            type="time"
            name="workingHours.endTime"
            className="form-control"
            placeholder="HH:MM"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            onChange={handleInputChange}
            defaultValue={makeupArtists[0].workingHours.endTime}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="breakTime.startTime">Break Start Time:</label>
          <input
            type="time"
            name="breakTime.startTime"
            className="form-control"
            placeholder="HH:MM"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            onChange={handleInputChange}
            defaultValue={makeupArtists[0].breakTime.startTime}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="breakTime.endTime">Break End Time:</label>
          <input
            type="time"
            name="breakTime.endTime"
            className="form-control"
            placeholder="HH:MM"
            pattern="^([01]\d|2[0-3]):([0-5]\d)$"
            onChange={handleInputChange}
            defaultValue={makeupArtists[0].breakTime.endTime}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    )}
  </div>
</div>
  </div>
  );
}

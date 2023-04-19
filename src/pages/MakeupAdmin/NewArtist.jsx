import { useEffect, useState } from "react";
import moment from 'moment'

export default function NewArtist() {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [breakStartTime, setBreakStartTime] = useState('');
    const [breakEndTime, setBreakEndTime] = useState('');
    const [locations, setLocations] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minDate, setMinDate] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch(`/api/maps`);
                if (!response.ok) {
                    throw new Error("Failed to fetch locations");
                }
                const data = await response.json();
                setLocations(data)
            } catch (error) {
                console.error("Error fetching location:", error)
            }
        }
        fetchLocations()
    }, [])

    useEffect(() => {
        const today = moment().format("YYYY-MM-DD");
        setMinDate(today);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name,
            workingSchedule: { startDate, endDate },
            workingHours: { startTime, endTime },
            breakTime: { startTime: breakStartTime, endTime: breakEndTime },
            location: { id: selectedLocation },
        };
        try {
            const response = await fetch('/api/makeupartist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create makeup artist');
            }
            const newMakeupArtist = await response.json();
            console.log('New makeup artist created:', newMakeupArtist);
            setSuccessMessage("Makeup artist successfully created!");
        } catch (error) {
            console.error('Error creating makeup artist:', error);
        }
    };

    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        switch (name) {
            case 'workingHours.startTime':
                setStartTime(value);
                break;
            case 'workingHours.endTime':
                setEndTime(value);
                break;
            case 'breakTime.startTime':
                setBreakStartTime(value);
                break;
            case 'breakTime.endTime':
                setBreakEndTime(value);
                break;
            default:
                break;
        }
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    return (
        <div className="container">
            <h1>Create a new makeup artist!</h1>
            <form onSubmit={handleSubmit}>

                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="workingSchedule.startDate">Start Date:</label>
                    <input type="date" id="startDate" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} min={minDate} />
                </div>
            <div className="form-group">
                <label htmlFor="workingSchedule.endDate">End Date:</label>
                <input type="date" id="endDate" className="form-control" value={endDate} onChange={(event) => setEndDate(event.target.value)} min={startDate} />
            </div>

            <div className="form-group">
                <label htmlFor="workingHours.startTime">Start Time:</label>
                <input type="time" id="startTime" name="workingHours.startTime" className="form-control" value={startTime} onChange={handleInputChange} />
            </div>

            <div className="form-group">
                <label htmlFor="workingHours.endTime">End Time:</label>
                <input type="time" id="endTime" name="workingHours.endTime" className="form-control" value={endTime} onChange={handleInputChange} />
            </div>

            <div className="form-group">
                <label htmlFor="breakTime.startTime">Break Start Time:</label>
                <input type="time" id="breakStartTime" name="breakTime.startTime" className="form-control" value={breakStartTime} onChange={handleInputChange} />
            </div>

            <div className="form-group">
                <label htmlFor="breakTime.endTime">Break End Time:</label>
                <input type="time" id="breakEndTime" name="breakTime.endTime"className="form-control" value={breakEndTime} onChange={handleInputChange} />
            </div>

            <div className="form-group">
                <label htmlFor="location">Location:</label>
                <select id="location" className="form-control" value={selectedLocation} onChange={handleLocationChange}>
                    <option value="">Choose a location</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location._id}>{location.name}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    </div>
);}
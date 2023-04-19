import { useState, useEffect } from "react";
import DeleteAppointment from "./DeleteAppointments";


const UpcomingAppointment = () => {
  const [appt, setAppt] = useState([]);
  const token = localStorage.getItem("token")
  const Name =  JSON.parse(window.atob(token.split(".")[1]))
  const customerName = Name.customer.name
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`/api/booking/${encodeURIComponent(customerName)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAppt(data));
  }, [customerName]);

  const delAppt = (id) => setAppt(appt.filter(({ _id }) => _id !== id));

  return (
    <div>
      <h1>Today & Upcoming Appointments</h1>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Makeup Artist</th>
            <th>Appointment Date</th>
            <th>Time Slot</th>
          </tr>
        </thead>
        <tbody>
          {appt.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.location.id.name}</td>
              <td>{appointment.makeupArtist.id.name}</td>
              <td>{appointment.date}</td>
              <td>{appointment.timeslot}</td>
              <td>
                <DeleteAppointment id={appointment._id} delAppt={delAppt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingAppointment;
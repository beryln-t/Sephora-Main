import { useParams, Link, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Edit from './Edit';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const token = localStorage.getItem('token');

export default function MakeupArtist() {
  const [appointments, setAppointments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(`/api/makeupartist/admin/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
        if (data.length > 0) {
          setMakeupArtistName(data[0].makeupArtist.id.name);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, [id]);

  return (
    <div className="container">
        <Link to={`/makeupartist/edit/${id}`}>
            <Button variant="primary">Edit</Button>
        </Link>
        <hr/>
      {appointments.length > 0 && (
        <>
          <h3>Makeup Artist: {appointments[0].makeupArtist.id.name}</h3>
          <hr />
        </>
      )}
      <h4>Appointments</h4>
      <ul className="list-group">
        {appointments.map((appointment) => (
          <li key={appointment._id} className="list-group-item">
            <div className="row">
              <div className="col-3">
                <strong>Date:</strong> {appointment.date}
              </div>
              <div className="col-3">
                <strong>Time:</strong> {appointment.timeslot}
              </div>
              <div className="col-6">
                <strong>Customer's Information:</strong>{' '}
                {appointment.customerInfo.name}, {appointment.customerInfo.email}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Routes>
        <Route path={`/makeupartist/edit/${id}`} element={<Edit />} />
      </Routes>
    </div>
  );
}

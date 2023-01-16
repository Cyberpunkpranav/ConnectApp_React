import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'

const Doctors_Dsr = () => {
  let arr = [
    {
      Appointment_ID: '350',
      Doctorname: 'Arushi Dudeja',
      Mobile: '9977665544',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    },
    {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    },
    {
      Appointment_ID: '350',

      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    },
    {
      Appointment_ID: '350',

      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, 
    {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    },
    {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }, {
      Appointment_ID: '350',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Roomnumber: '01',
      starttime: '09:00 AM',
      endtime: '10:00 AM',
      Total_hours: '1 hours 0 mins'
    }
  ]
  const [Appointments, setAppointments] = useState(arr)
  return (
    <div className="container-fluid Doctors_Dsrsection">
      <div className='py-2'>
        <div className="container-fluid ms-0">
          <h6 className='text-burntumber fw-bolder'>Exports</h6>
          <div className="row">
            <div className="col-3 col-lg-3 col-md-5 py-2 border border-1 rounded-2 shadow-sm">
              <h6 className='text-charcoa50 fw-bold'>Total Report</h6>
              <div className="row gx-1">
                <div className="col-5 col-lg-6 col-md-6 p-0 m-0">
                <button className='button button-brandy'>Export CSV </button>
                </div>
                <div className="col-5 col-lg-6 col-md-6 p-0 m-0">
                <button className='button button-lightgreen'>Export Excel </button>
                </div>
              </div>
            </div>
            <div className="col-3 col-lg-3 col-md-5 ms-lg-3 ms-md-2 ms-1 py-2 border border-1 rounded-2 shadow-sm">
              <h6 className='text-charcoa50 fw-bold'>Summary Report</h6>
              <div className="row gx-1">
                <div className="col-5 col-lg-6 p-0 m-0">
                <button className='button button-brandy'>Export CSV </button>
                </div>
                <div className="col-5 col-lg-6 p-0 m-0">
                <button className='button button-lightgreen'>Export Excel </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Appointments</h5>
      <div className='container-fluid scroll scroll-y doctordsrtable'>
        <table className='table text-center'>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Doctors Name</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Roomnumber</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>

            {
              Appointments.map((data, i) => (
                <tr key={i}>
                  <td>{data.Appointment_ID}</td>
                  <td>{data.Doctorname}</td>
                  <td>{data.Mobile}</td>
                  <td>{data.Date}</td>
                  <td>{data.Roomnumber}</td>
                  <td>{data.starttime}</td>
                  <td>{data.endtime}</td>
                  <td>{data.Total_hours}</td>
                </tr>
              ))
            }

          </tbody>
        </table>
      </div>
    </div>
  )
}

export { Doctors_Dsr }
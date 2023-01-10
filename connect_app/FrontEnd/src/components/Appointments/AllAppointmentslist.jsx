import React from 'react'
import { useState, useContext } from "react"
import axios from "axios"
import AmountPaid from '../Today/AmountPaid'
import '../../../node_modules/bootstrap/js/dist/dropdown'
import { UpdateAppointment } from './UpdateAppointment'
import '../../css/appointment.css'
import '../../css/bootstrap.css'
import Notiflix from 'notiflix';
//COntext APIs
import { URL } from '../../index'

const AllAppointmentslist = (props) => {
    const url = useContext(URL);
    const [appointmentform, setappointmentform] = useState("none");
    const [d_form, setd_form] = useState()

    const closeappointmentform = () => {

        if (appointmentform === "block") {
            setappointmentform("none");
            setd_form()
        }
    };
    const openapppointmentform = () => {
        if (appointmentform === "none") {
            setappointmentform("block");
            setd_form(true)
        }
    }


    const [tableindex, settableindex] = useState()

    const reversefunction = (date) => {
        date = date.split("-").reverse().join("-")
        return date
    }

    let adminid = localStorage.getItem('id')

    async function UpadteStatus(e) {
        if (e.target.value && adminid && e.target.name) {
            try {
                Notiflix.Loading.circle('Updating Appointment Status', {
                    backgroundColor: 'rgb(242, 242, 242,0.5)',
                    svgColor: '#96351E'
                }
                )
                await axios.post(`${url}/appointment/change/status`, {
                    appointment_id: e.target.name,
                    status: e.target.value,
                    admin_id: adminid
                }).then((response) => {
                    props.fetchallAppointmentslist()
                    Notiflix.Loading.remove()
                    Notiflix.Notify.success(response.data.message)
                })
            } catch (e) {
                alert(e)
                Notiflix.Loading.remove()
            }
        } else {
            Notiflix.Notify.alert('Please try Again')
        }
    }

    function tConvert(time) {

        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    
        if (time.length > 1) {
          time = time.slice(1);
          time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
          time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
      }
    
    return (
        <>
            {
                props.isLoading == true ? (

                    <div className='container position-absolute start-0 end-0' >
                        <h4>Hold on its Loading</h4>
                        <div className="spinner-grow bg-secondary col-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (props.getAppointments.length == 0 ? (

                    <div className="container text-charcoal fs-4 position-absolute start-0 end-0">
                        <p className="p-0 m-0 text-charcoal75 fw-bolder mt-3">No Appointments found for the selected Date & Doctor</p>
                    </div>

                ) : (

                    props.getAppointments.map((data, key) => (
                        <tr id={key} key={key}>
                            <th scope="row">
                                <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} onClick={(e) => { openapppointmentform(); settableindex(key) }} className="btn p-0 m-0" />
                            </th>
                            <td>
                                <select className={`p-2 fw-bolder rounded-5 text-center button-${props.status_color(data.appointment_status)}`} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
                                    <option className="button" selected disabled>{props.status(data.appointment_status)}</option>
                                    <option className="button-lightred" value='1'>Pending</option>
                                    <option className="button-lightblue" value='2'>Booked</option>
                                    <option className="button-lightred" value='3'>Cancelled</option>
                                    <option className="button-pearl" value='4'>QR Generated</option>
                                    <option className="button-brandy" value='5'>Checked_in</option>
                                    <option className="button-lightred" value='6'>Vitals Done</option>
                                    <option className="button-lightyellow" value='7'>In_apppointment</option>
                                    <option className="button-lightgreen" value='8'>Payment done</option>
                                    <option className="button-lightyellow" value='9'>Unattained</option>
                                    <option className="button-lightgreen" value='10'>Completed</option>
                                </select>
                            </td>
                            <td>{data.patient != null && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                            <td>{data.doctor != null && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                            <td>{data.patient != null && data.patient.phone_number != null ? data.patient.phone_number : "N/A"}</td>
                            <td>{reversefunction(data.timeslot.date)}</td>
                            <td>{props.tConvert(data.timeslot.time_from)}</td>
                            <td>{data.total_amount}</td>
                            <td><AmountPaid appointmentData={data} /></td>
                            <td><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ width: "1.5rem" }} className='m-0 p-0' /> </td>
                            <td>{reversefunction(data.follow_up_date ? data.follow_up_date : '')}</td>
                            <td> <img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1 m-0 p-0" /> </td>
                            <td>
                                <button className="btn position-relative cursor-pointer more p-0 m-0">
                                    <img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} />
                                </button>
                                <table className="table p-2 moreoptions text-start rounded position-absolute" style={{ width: "min-content" }} >
                                    <tbody>
                                        <tr className="bg-transparent"> <td>Action 1</td> </tr>
                                        <tr className="bg-transparent"> <td>Action 2</td> </tr>
                                        <tr className="bg-transparent"> <td>Action 3</td> </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td className={`UpdateAppointment d-${tableindex == key ? appointmentform : 'none'} border-0 position-absolute`} style={{ zIndex: '3005' }}><UpdateAppointment fetchallAppointmentslist={props.fetchallAppointmentslist} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} appointmentid={data.id} closeappointmentform={closeappointmentform} doctorid={props.doctorid} fetchapi={props.fetchapi} appointmentdoctorid={data.doctor.id} appointmentdate={data.appointment_date} appointmenttime={tConvert(data.timeslot.time_from)} /></td>
                        </tr>
                    ))
                )
                )
            }
        </>
    )
}

export { AllAppointmentslist }
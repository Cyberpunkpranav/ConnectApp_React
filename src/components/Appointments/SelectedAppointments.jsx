import React from 'react'
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { UpdateAppointment } from './UpdateAppointment'
import { Payments } from './Payments.jsx'
import AmountPaid from '../Today/AmountPaid'
import Notiflix from 'notiflix';
import { URL } from '../../index'
import '../../css/bootstrap.css'
import '../../css/appointment.css'
import { Bill } from './Bill'
import { customconfirm } from '../features/notiflix/customconfirm'
const SelectedAppointments = (props) => {
  const url = useContext(URL);
  let adminid = localStorage.getItem('id')
  const [appointmentform, setappointmentform] = useState("none");
  const [d_form, setd_form] = useState()
  const [paymentsform, setpaymentsform] = useState('none')
  const [paymentindex, setpaymentindex] = useState()
  const [billindex, setbillindex] = useState()
  const [billform, setbillform] = useState('none')

  const openapppointmentform = () => {
    if (appointmentform === "none") {
      setappointmentform("block");
      setd_form(true)
    }
  }
  const closeappointmentform = () => {

    if (appointmentform === "block") {
      setappointmentform("none");
      setd_form()
    }
  }
  const toggle_payments = () => {
    if (paymentsform === 'none') {
      setpaymentsform('block')
    }
    if (paymentsform === 'block') {
      setpaymentsform('none')
      setpaymentindex()
    }
  }
  const toggle_bill = () => {
    if (billform === 'none') {
      setbillform('block')
    }
    if (billform === 'block') {
      setbillform('none')
      setbillindex()
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
  const [tableindex, settableindex] = useState()
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
  const Generate_Bill = async (id) => {
    Notiflix.Loading.circle('Generating Bill', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.5rem'
    })
    try {
      axios.post(`${url}/appointment/bill`, {
        appointment_id: id,
        admin_id: adminid
      }).then((response) => {
        console.log(response)
        Notiflix.Notify.success(response.data.message)
        window.open(response.data.data.bill_url, '_blank', 'noreferrer');
        Notiflix.Loading.remove()
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      Notiflix.Loading.remove()
    }
  }
  const Generate_Prescription = async (id) => {
    Notiflix.Loading.circle('Generating Prescription', {
        backgroundColor: 'rgb(242, 242, 242,0.5)',
        svgColor: '#96351E',
        messageColor: '#96351E',
        messageFontSize: '1.5rem'
    })
    try {
        axios.post(`${url}/swift/pdf`, {
            appointment_id: id,
        }).then((response) => {
            console.log(response)
            Notiflix.Notify.success(response.data.message)
            Notiflix.Loading.remove()
            window.open(response.data.data.prescription_pdf, '_blank', 'noreferrer');
        })
    } catch (e) {
        Notiflix.Notify.failure(e.message)
        Notiflix.Loading.remove()
    }
}
const Send_On_WhatsApp = async (id, phone, check) => {
    let checkpres = check
    if (phone == undefined || phone == null) {
        Notiflix.Notify.failure('Please Add a Phone Number to send the message on WhatsApp')
    } else {
        Notiflix.Loading.circle('Sending Bill on Whats App', {
            backgroundColor: 'rgb(242, 242, 242,0.5)',
            svgColor: '#96351E',
            messageColor: '#96351E',
            messageFontSize: '1.5rem'
        })
        try {
            axios.post(`${url}/send/bill/whatsapp`, {
                appointment_id: id,
                check_pres: checkpres,
                admin_id: adminid
            }).then((response) => {
                console.log(response)
                Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
                Notiflix.Loading.remove()
            })
        } catch (e) {
            Notiflix.Notify.failure(e.message)
            Notiflix.Loading.remove()
        }
    }

}
const Confirm_For_Prescription = (id, phone) => {

    customconfirm()
    Notiflix.Confirm.show(
        `Choose Option to Send `,
        `Do you want to send the Bill`,
        'With the Prescription ?',
        'Without the Prescription ?',
        () => {
            Send_On_WhatsApp(id, phone, 1)
        },
        () => {
            Send_On_WhatsApp(id, phone, 0)
        },
        {
        },
    );
}
const Send_On_SMS = async (id, phone, check) => {
    let checkpres = check
    if (phone == undefined || phone == null) {
        Notiflix.Notify.failure('Please Add a Phone Number to send the message on SMS')
    } else {
        Notiflix.Loading.circle('Sending Bill on SMS', {
            backgroundColor: 'rgb(242, 242, 242,0.5)',
            svgColor: '#96351E',
            messageColor: '#96351E',
            messageFontSize: '1.5rem'
        })
        try {
            axios.post(`${url}/send/bill/sms`, {
                appointment_id: id,
                check_bill: 1,
                check_pre: checkpres,
            }).then((response) => {
                console.log(response)
                Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
                Notiflix.Loading.remove()
            })
        } catch (e) {
            Notiflix.Notify.failure(e.message)
            Notiflix.Loading.remove()
        }
    }

}
const Confirm_For_Prescription2 = (id, phone) => {

    customconfirm()
    Notiflix.Confirm.show(
        `Choose Option to Send `,
        `Do you want to send the Bill`,
        'With the Prescription ?',
        'Without the Prescription ?',
        () => {
            Send_On_SMS(id, phone, 1)
        },
        () => {
            Send_On_SMS(id, phone, 0)
        },
        {
        },
    );
}
  console.log(paymentindex, props.getAppointments)
  return (
    <>
      {
        props.isselectedLoading == true ? (
          <div className='container position-absolute start-0 end-0'>
            <h4>Hold on its loading</h4>
            <div class="spinner-grow bg-danger col-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

        ) : (

          props.appointmentdata.length == 0 ? (
            <div className="container text-charcoal fs-4 position-absolute start-0 end-0">
              <p className="p-0 m-0 text-charcoal75 fw-bolder mt-3">No Appointments found for the selected Date & Doctor</p>
            </div>
          ) : (

            props.appointmentdata.map((data, key) => (
              <tr id={key}>
                <td>
                  <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} onClick={(e) => { settableindex(key); openapppointmentform(); }} className="btn p-0 m-0" />
                </td>
                <td>
                  <select className={`py-1 fw-bold rounded-pill text-center button-${props.status_color(data.appointment_status)}`} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
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
                {/* <td><button className={`btn button-${props.status_color(data.appointment_status)} text-charcoal fw-bold rounded-5`}>{props.status(data.appointment_status)}</button></td> */}
                <td>{data.patient != null && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                <td>{data.doctor != null && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                <td>{data.patient != null && data.patient.phone_number != null ? data.patient.phone_number : "N/A"}</td>
                <td>{data.timeslot.date && data.timeslot.date !== null ? data.timeslot.date : ''}</td>
                <td>{props.tConvert(data.timeslot.time_from)}</td>
                <td>{data.total_amount}</td>
                <td><AmountPaid appointmentData={data} /></td>
                <td className='p-0 m-0 text-charcoal fw-bold align-items-center '>
                  <div className='vr rounded-2 align-self-center' style={{ padding: '0.8px' }}></div>
                </td>
                <td><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ width: "1.5rem" }} className='m-0 p-0' /> </td>
                <td>{data.follow_up_date ? data.follow_up_date : ''}</td>
                {/* <td> <img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1 m-0 p-0" /> </td> */}
                <td><div className="dropdown text-decoration-none bg-transparent">
                  <button className="btn btn-white dropdown-toggle text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} />
                  </button>
                  <ul className="dropdown-menu text-decoration-none bg-white p-2" style={{ '-webkit-appearance': 'none', 'appearance': 'none' ,width:'max-content' }}>
                  <li className='dropdown-item d-flex border-bottom p-0 m-0 align-items-center' onClick={() => { setbillindex(key); toggle_bill() }}><img className='m-2 img-fluid' style={{ 'width': '1.8rem' }} src={process.env.PUBLIC_URL + 'images/bill.png'} />Bill</li>
                                    <li className='dropdown-item d-flex border-bottom p-0 m-0 align-items-center' onClick={() => { setpaymentindex(key); toggle_payments(); }}><img className='m-2 img-fluid' style={{ 'width': '1.6rem' }} src={process.env.PUBLIC_URL + 'images/rupee.png'} />Payments</li>
                                    <li className='dropdown-item d-flex border-bottom p-0 m-0 align-items-center' onClick={() => { Generate_Bill(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} />Generate Bill</li>
                                    <li className="dropdown-item d-flex border-bottom p-0 m-0 align-items-center" onClick={() => { Generate_Prescription(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /> Generate Prescription </li>
                                    <li className="dropdown-item d-flex border-bottom p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/whatsapp.png"} alt="displaying_image" style={{ width: "2rem" }} /> Send on Whats App </li>
                                    <li className="dropdown-item d-flex p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription2(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/message.png"} alt="displaying_image" style={{ width: "1.5rem" }} />{' '}Send on SMS</li>
                  </ul>
                </div></td>
                {
                  tableindex == key ? (
                    <td className={`UpdateAppointment d-${tableindex == key ? appointmentform : 'none'} position-absolute`} style={{ top: '-10rem' }}>
                      <UpdateAppointment fetchallAppointmentslist={props.fetchallAppointmentslist}
                        patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : 'N/A'}
                        patientid={data.patient && data.patient.id !== null ? data.patient.id : 'N/A'} appointmentid={data.id && data.id !== null ? data.id : 'N/A'}
                        closeappointmentform={closeappointmentform} doctorid={props.doctorid ? props.doctorid : 'N/A'}
                        fetchapi={props.fetchapi}
                        appointmentdoctorid={data.doctor.id}
                        appointmentdate={data.appointment_date}
                        appointmenttime={tConvert(data.timeslot.time_from)} /></td>
                  ) : (<></>)
                }
                {
                  billindex == key ? (
                    <td className={`bill d-${billindex == key ? billform : 'none'} bg-seashell col-lg-8 col-md-10 start-0 mx-auto end-0 top-0 col-sm-12 col-12 col-xl-6 border border-2 rounded-2 shadow position-absolute`} style={{ zIndex: '3020', marginTop: '6rem' }}>
                      <Bill fetchallAppointmentslist={props.fetchallAppointmentslist}
                        toggle_bill={toggle_bill}
                        patientid={data.patient && data.patient.id != null ? data.patient.id : ""}
                        patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""}
                        appointmentdata={props.appointmentdata[key]}
                        appointmentid={data.id}
                        doctorfee={data.doctor.consulationFee} /></td>
                  ) : (<></>)
                }
                {
                  paymentindex == key ? (
                    <td className={`top-0 start-0 end-0 mx-auto bg-seashell col-lg-6 col-md-8 col-sm-10 col-10 col-xl-6 rounded-2 border border-1 position-absolute shadow  d-${paymentindex == key ? paymentsform : 'none'}`} style={{ marginTop: '10rem' }}>
                      <Payments
                        toggle_payments={toggle_payments}
                        appointmentdata={props.appointmentdata[key]}
                        fetchallAppointmentslist={props.fetchallAppointmentslist}
                        patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""}
                        patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} />
                    </td>
                  ) : (<></>)
                }

              </tr>
            ))
          )
        )
      }

    </>
  )
}

export { SelectedAppointments }
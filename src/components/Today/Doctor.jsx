import React, { createContext } from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AmountPaid from './AmountPaid';
import { URL, TodayDate, Clinic, Permissions } from '../../index'
import Notiflix from 'notiflix';
import { customconfirm } from "../features/notiflix/customconfirm";
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { UpdateAppointment } from './UpdateAppointment'
import '../../css/dashboard.css'
import { SelectedTimeAppointment } from '../Appointments/SelectedTimeAppointment'
import { AddSelectedDoctorSlot } from './SelectedDoctorSlot'
import { Vitalsoperation } from "./Vitals";
import { Payments } from "./Payments";
import { Bill } from "./Bill";
import { AddConsumables } from "./AddConsumables";
import { SaleEntryForm } from '../pharmacy/pharmacy';


function DoctorSchedule(props) {
  //Global Variables
  const url = useContext(URL)
  const Date = useContext(TodayDate)
  const permission = useContext(Permissions)
  const adminid = localStorage.getItem('id')
  //Use States
  const [appointmentdata, setappointmentdata] = useState([]);
  const [singleload, setsingleload] = useState(0)
  const [isLoading, setisLoading] = useState(false);
  const [tableindex, settableindex] = useState()
  const [appointmentform, setappointmentform] = useState("none");
  const [addappointmentform, setaddappointmentform] = useState('none')
  const [appointmentid, setappointmentid] = useState()
  const [timeindex, settimeindex] = useState()
  const [saleindex, setsaleindex] = useState()
  const [consumablesindex, setconsumablesindex] = useState()
  const [addquickslots, setaddquickslots] = useState('none')
  const [vitalsform, setvitalsform] = useState('none')
  const [consumables, setconsumables] = useState('none')
  const [vitalindex, setvitalindex] = useState()
  const [appointmentvitalslist, setappointmentvitalslist] = useState([])
  const [loadvitals, setloadvitals] = useState()
  const [billindex, setbillindex] = useState()
  const [billform, setbillform] = useState('none')
  const [paymentsindex, setpaymentsindex] = useState()
  const [paymentsi, setpaymentsi] = useState()
  const [paymentsform, setpaymentsform] = useState('none')
  const [d_form, setd_form] = useState()
  const [nsef, setnsef] = useState("none");
  // for UpdateAppointment
  const closeappointmentform = () => {
    if (appointmentform === "block") {
      setappointmentform("none");
      settableindex()
    }
  };
  const openapppointmentform = () => {
    if (appointmentform === "none") {
      setappointmentform("block");
      setd_form(true)
    }
  }

  function ArraySum(arr) {
    if (arr.length > 0) {
      let sum = arr.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      return sum;
    } else {
      return 0;
    }

  }
  async function Appointmentlist() {
    setisLoading(true);
    Loading.dots('Getting Details', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.5rem'
    })
    await axios.get(`${url}/appointment/list?doctor_id=${props.todayDoc[props._selected][0]}&from_date=${Date}&to_date=${Date}`).then((response) => {
      setappointmentdata(response.data.data);
    })
    setisLoading(false);
    Loading.remove()
    setsingleload(1)
  }
  useEffect(() => {
    Appointmentlist();
  }, [props._selected]);

  function tConvert(time) {

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }
  let array = [[1, 'Pending', 'lightred'], [2, 'Booked', 'lightblue'], [3, 'Cancelled', 'lightred'], [4, 'QR Generated', 'light'], [5, 'Checked_in', 'brandy'], [6, 'Vitals Done', 'lightred'], [7, 'In_apppointment', 'lightyellow'], [8, 'Payment done', 'lightgreen'], [9, 'Unattained', 'lightyellow'], [10, 'Completed', 'lightgreen']]
  function status(number) {
    let status
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1]
        break;
      }
    }
    return status
  }
  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2]
        break;
      }
    }
    return status_color
  }
  async function UpadteStatus(e) {
    if (e.target.value && adminid && e.target.name) {
      try {
        Loading.circle('Upadating Appointment Status', {
          backgroundColor: 'rgb(242, 242, 242,0.5)',
          svgColor: '#96351E',
          messageColor: '#96351E',
          messageFontSize: '1.5rem'
        })
        await axios.post(`${url}/appointment/change/status`, {
          appointment_id: e.target.name,
          status: e.target.value,
          admin_id: adminid
        }).then((response) => {
          Appointmentlist()
          Loading.remove()
          props.fetchapi()
          Notiflix.Notify.success(response.data.message)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
      }
    } else {
      Notiflix.Notify.alert('Please try Again')
    }
  }
  const openAddApppointmentform = () => {
    setaddappointmentform('block')
  }
  const closeAddAppointmentform = () => {
    setaddappointmentform('none')
    settimeindex()
  }
  function OpenAddQuickSlots() {
    if (addquickslots === 'none') {
      setaddquickslots('block')
    }
  }
  function CloseAddQuickSlots() {
    if (addquickslots === 'block') {
      setaddquickslots('none')
    }
  }

  //Vitals Section
  function OpenVitals() {
    if (vitalsform === 'none') {
      setvitalsform('block')
    }
  }
  function CloseVitals() {
    if (vitalsform === 'block') {
      setvitalsform('none')
      setvitalindex()
    }
  }

  async function GetAppointmentVitals(id) {
    setloadvitals(true)
    await axios.get(`${url}/appointment/vitals/list?appointment_id=${id}`).then((response) => {
      setappointmentvitalslist(response.data.data.vitals)
      setloadvitals(false)
    })
  }
  //Vitals Section 

  //Send Notification
  async function SendNotifcation(name, id) {
    Notiflix.Loading.dots('Sending', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.3rem'
    })
    try {
      await axios.post(`${url}/appointment/call/in`, {
        appointment_id: id,
        admin_id: adminid
      }).then((response) => {
        Notiflix.Notify.success(response.data.message.slice(0, -1) + ' to ' + name)
        Notiflix.Loading.remove()
      })
    } catch (e) {
      Notiflix.Loading.remove()
      Notiflix.Notify.warning(e.message)
    }

  }
  const confirmmessage = (name, id) => {
    customconfirm()
    Notiflix.Confirm.show(
      `Call Patient `,
      `Do you surely want to call ${name}`,
      'Yes',
      'No',
      () => {
        SendNotifcation(name, id)
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  //Send Notification

  //Bill
  function OpenBillForm() {
    if (billform === 'none') {
      setbillform('block')
    }
  }
  function CloseBillForm() {
    if (billform == 'block') {
      setbillform('none')
      setbillindex()
    }
  }
  function OpenPaymentsForm() {
    if (paymentsform === 'none') {
      setpaymentsform('block')
    }
  }
  function ClosePaymentsForm() {
    if (paymentsform === 'block') {
      setpaymentsform('none')
      setpaymentsindex()
    }
  }

  function ClosePaymentsForm2() {
    if (paymentsform === 'block') {
      setpaymentsform('none')
      setpaymentsi()
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
        Notiflix.Loading.remove()
        window.open(response.data.data.bill_url, '_blank', 'noreferrer');
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
      // 'Cancel',
      () => {
        Send_On_WhatsApp(id, phone, 1)
      },
      () => {
        Send_On_WhatsApp(id, phone, 0)
      },
      // () => {
      //   return 0
      // },
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
  const toggleConsumables = () => {
    if (consumables === 'none') {
      setconsumables('block')
    }
    if (consumables === 'block') {
      setconsumables('none')
      setconsumablesindex()
    }

  }
  const toggle_nsef = () => {
    if (nsef === 'none') {
      setnsef('block')
    }
    if (nsef === 'block') {
      setnsef('none')
      setsaleindex()
    }
  }
  // const Modal = () => {
  //   modalindex
  // }
  https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/swift/pdf
  console.log(appointmentdata)
  return (
    <>
      <section id="doctorscheduledata">
        <section className="timeslotsection">
          <div className="container-fluid p-0 m-0 ps-1 ">
            <div className="row p-0 m-0">
              <div className=" col-12 p-0 m-0 align-items-center">
                <div className="row align-items-center p-0 m-0 mt-3 mb-2 ms-0">
                  <div className="col-auto p-0 m-0">
                    <h6 className="p-0 m-0 text-charcoal fw-bolder text-start">Time Slots Avaliable</h6>
                  </div>
                  <div className="col-2 ps-1">
                    <button className="btn m-0 p-0">
                      <img src={process.env.PUBLIC_URL + "/images/addicon.png"} style={{ width: "1.5rem" }} alt="displaying_image" onClick={OpenAddQuickSlots} />
                    </button>
                    <div className={`d-${addquickslots} rounded-1 quickdocslots bg-seashell shadow col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 position-absolute end-0 start-0 top-0 m-auto mt-3`} style={{ zIndex: '3010', minWidth: '10rem', maxWidth: '30rem' }}>
                      <AddSelectedDoctorSlot CloseAddQuickSlots={CloseAddQuickSlots} fetchapi={props.fetchapi} DocClinic={props.DocClinic} DoctorID={props.DoctorID} DoctorName={props.DoctorName} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="scroll timeslots col-12 justify-content-around">
              {
                props.todayDoc[props._selected][3].map((data, i) => (
                  data[1] == 0 ? (
                    <>
                      <button className={`button-sm button-${timeindex == i ? 'charcoal' : 'charcoal-outline'} m-1 px-3 py-2 fw-bold rounded-1`} style={{ letterSpacing: '1px' }} onClick={(e) => { openAddApppointmentform(); settimeindex(i) }} key={i}>{tConvert(data[0])}</button>
                      {
                        timeindex == i ? (
                          <div className={`d-${timeindex == i ? addappointmentform : 'none'} col-lg-8 col-md-10 col-sm-12 col-12 col-xl-6 shadow quickappointment position-absolute m-auto start-0 end-0 bg-seashell rounded-4 border border-1`} style={{ zIndex: 4, top: '-3rem' }}>
                            <SelectedTimeAppointment fetchapi={props.fetchapi} closeAddAppointmentform={closeAddAppointmentform} DocClinic={props.DocClinic} timeindex={timeindex} selectedtime={data[0]} selectedtimeID={data[2]} />
                          </div>
                        ) : (
                          <></>
                        )
                      }

                    </>
                  ) : (

                    <button disabled className=" button-sm button-charcoal50-outline m-1 px-3 py-2 rounded-1 fw-bold" key={i} style={{ letterSpacing: '1px' }}>{tConvert(data[0])}</button>
                  )

                ))

              }
            </div>
          </div>
        </section>

        <section className="allappointmentsection p-0 m-0 ms-1">
          <div className="col-auto m-0 p-0 align-items-center">
            <h6 className="p-0 ms-1 text-charcoal fw-bolder mt-3 mb-2">Appointments</h6>
          </div>
          <div className=" scroll scroll-y align-content-center align-items-center" style={{ minHeight: '50vh', maxHeight: '50vh', Height: '50h' }}>
            <table className="table text-start">
              <thead className="p-0 m-0 px-2 bg-pearl" style={{ 'zIndex': '4' }}>
                <tr className="p-0 m-0 position-sticky text-charcoal75 top-0" style={{ fontSize: '0.75rem' }}>
                  <th className="border-0 bg-pearl text-center" key={0}>Update</th>
                  <th className="border-0 bg-pearl text-start" key={3}>Time</th>
                  <th className="border-0 bg-pearl" key={2}>Patient</th>
                  <th className="border-0 bg-pearl text-start" key={1}>Status</th>
                  <th className="border-0 bg-pearl" key={4}> Amount</th>
                  {/* <th className="border-0 bg-pearl" key={5}>Amount Status</th> */}
                  <th className="text-center border-0 bg-pearl" key={6}>Vitals</th>
                  <th className={`text-center border-0 bg-pearl d-${permission.appointment_charges_edit ? '' : 'none'}`} key={7}>Bill</th>
                  <th className="border-0 bg-pearl text-center" key={9}>Consumables</th>
                  <th className="border-0 bg-pearl text-center" key={9}>more</th>
                </tr>
              </thead>
              {
                singleload == 0 ? (
                  <tbody className="scroll scroll-y"  >
                    <tr className=' position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                      <td className=' position-absolute start-0 end-0 text-burntumber fs-3 mt-1 text-center'>

                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {
                      appointmentdata.length == 0 ? (
                        <tr><button className="text-center position-absolute border-0 text-charcoal fw-bold px-5 start-0 end-0 mx-auto">No Appointments Found</button></tr>
                      ) : (
                        appointmentdata.map((data, i) => (
                          <tr className='align-middle'>
                            <td className={`py-0 bg-${tableindex === i ? 'lightyellow' : ''}  text-center`}>
                              <button className="btn m-0 p-0" key={i} onClick={(e) => { openapppointmentform(); settableindex(i); setappointmentid(data.id) }}>
                                <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" style={{ width: "1rem" }} key={i} />
                              </button>
                            </td>
                            <td className="py-0 text-start fw-bold" style={{ letterSpacing: '1px' }}>{tConvert(data.timeslot.time_from)}</td>
                            <td className="py-0 ">
                              <div className="row p-0 m-0" style={{ width: 'fit-content' }}>
                                <div className="col-12 p-0 m-0 fw-bold">
                                  {data.patient ? data.patient.full_name !== null ? data.patient.full_name : 'N/A' : 'N/A'}
                                </div>
                                <small className="col-auto p-0 m-0 text-burntumber fw-bold" style={{ letterSpacing: '1px' }}>
                                  {data.patient ? data.patient.phone_number != null ? data.patient.phone_number : 'N/A' : 'N/A'}
                                </small>
                              </div>
                            </td>

                            <td className=" text-start">
                              <div className="row p-0 m-0 align-items-center">
                                <div className="col-1 p-0 m-0 me-2">
                                  <div className={`rounded-circle border-1 button-${status_color(data.appointment_status)} fontmain`} style={{ height: '12px', width: '12px' }}></div>
                                </div>
                                <div className="col-5 p-0 m-0">
                                  <select disabled={permission.appointment_edit == 1 ? false : true} className={`bg-transparent border-0 text-start fw-bold `} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
                                    <option className="fw-bold" selected disabled>{status(data.appointment_status)}</option>
                                    <option key={0} className="button-lightred" value='1'>Pending</option>
                                    <option key={1} className="button-lightblue" value='2'>Booked</option>
                                    <option key={2} className="button-lightred" value='3'>Cancelled</option>
                                    <option key={3} className="button-pearl" value='4'>QR Generated</option>
                                    <option key={4} className="button-brandy" value='5'>Checked_in</option>
                                    <option key={5} className="button-lightred" value='6'>Vitals Done</option>
                                    <option key={6} className="button-lightyellow" value='7'>In_apppointment</option>
                                    <option key={7} className="button-lightgreen" value='8'>Payment done</option>
                                    <option key={8} className="button-lightyellow" value='9'>Unattained</option>
                                    <option key={9} className="button-lightgreen" value='10'>Completed</option>
                                  </select>
                                </div>
                              </div>
                            </td>

                            {/* <td className="py-0" style={{ fontSize: '0.75rem' }}>{data.total_amount}</td> */}
                            <td className="py-0 text-start">
                              <div className="col p-0 m-0 fw-bold fontmain" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                                ₹{data.total_amount}
                              </div>
                              <div className="col p-0 m-0 text-start">
                                <button className="button-sm p-0 m-0 bg-transparent border-0" onClick={() => { setpaymentsi(i); OpenPaymentsForm(); }}>
                                  <AmountPaid appointmentData={data} index={i} Appointmentlist={Appointmentlist} />
                                </button>
                                {
                                  paymentsi == i ? (
                                    <td className={`payments start-0 bg-seashell end-0 shadow-sm top-0 border border-1 rounded-1 col-lg-6 col-md-8 col-sm-12 col-12 mt-2 col-xl-8 position-absolute px-5 py-2 d-${paymentsi == i ? paymentsform : 'none'}`} >
                                      <Payments ClosePaymentsForm={ClosePaymentsForm2} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} paymentsi={paymentsi} /></td>
                                  ) : (<></>)
                                }
                              </div>
                            </td>
                            <td className={` text-center py-0 bg-${vitalindex === i ? 'lightyellow' : ''}`}><button className="btn p-0 m-0" onClick={() => { setvitalindex(i); OpenVitals(); GetAppointmentVitals(data.id) }}><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ height: "1.5rem" }} /></button></td>
                            <td className={` text-center py-0 d-${permission.appointment_charges_edit ? '' : 'none'} bg-${billindex === i ? 'lightyellow' : ''}`}> <img src={process.env.PUBLIC_URL + "/images/bill.png"} onClick={() => { setbillindex(i); OpenBillForm(); }} alt="displaying_image" className="me-1" />  </td>
                            <td className={` text-center py-0  bg-${consumablesindex === i ? 'lightyellow' : ''}`}>
                              <button className={`button-sm border-0 p-0 m-0 position-relative bg-${consumablesindex === i ? 'lightyellow' : 'transparent'}`}>
                                <img src={process.env.PUBLIC_URL + "/images/bill.png"} onClick={() => { setconsumablesindex(i); toggleConsumables(); }} alt="displaying_image" className="me-1" />
                                <span class={` position-absolute start-75 translate-middle badge p-0 m-0 text-burntumber fw-bold rounded-2 `} style={{ zIndex: '2', top: "10%" }}>
                                  {appointmentdata[i].medicine_used.length}
                                </span>
                              </button>
                            </td>
                            <td className="text-center">
                              <div className="dropdown d-inline-block ">
                                <button className="button p-0 m-0 bg-transparent border-0 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  <img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1rem" }} />
                                </button>
                                <ul className="dropdown-menu shadow-sm p-2 scroll" style={{ '-webkit-appearance': 'none', 'appearance': 'none', width: 'max-content', height: '40vh' }}>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => confirmmessage(data.patient.full_name, data.id)}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/speaker.png"} alt="displaying_image" style={{ width: "1.8rem" }} /> Call Patient</li>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { Generate_Bill(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /> Generate Bill</li>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { Generate_Prescription(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /> Generate Prescription</li>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/whatsapp.png"} alt="displaying_image" style={{ width: "2rem" }} /> Send on Whats App</li>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription2(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid ms-2' src={process.env.PUBLIC_URL + "/images/message.png"} alt="displaying_image" style={{ width: "1.8rem" }} />Send on SMS</li>
                                  <li className="dropdown-item d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { toggle_nsef(); setsaleindex(i) }}><img className='m-2 img-fluid ms-2' src={process.env.PUBLIC_URL + "/images/medicine.png"} alt="displaying_image" style={{ width: "1.8rem" }} />Buy Medicines</li>
                                  <li className={`dropdown-item p-0 m-0 align-items-center p-2  d-${permission.appointment_charges_edit ? 'flex' : 'none'}`} onClick={() => { setpaymentsindex(i); OpenPaymentsForm(); }}><img src={process.env.PUBLIC_URL + "/images/rupee.png"} alt="displaying_image" style={{ width: "0.8rem" }} />Payments</li>
                                </ul>
                              </div></td>
                            {
                              tableindex === i ? (
                                <td className={`updateappointment shadow-sm border border-1 rounded-1 bg-seashell mt-2 start-0 end-0 top-0 col-lg-8 col-md-8 col-sm-11 col-11 col-xl-5 d-${tableindex == i ? appointmentform : 'none'} position-absolute`}>
                                  <UpdateAppointment fetchapi={props.fetchapi} fetchallAppointmentslist={props.fetchallAppointmentslist} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} appointmentid={data.id} addappointmentform={addappointmentform} closeappointmentform={closeappointmentform} doctorid={props.doctorid} appointmentdoctorid={data.doctor.id} appointmentdate={data.appointment_date} appointmenttime={tConvert(data.timeslot.time_from)} /></td>
                              ) : (<></>)
                            }
                            {
                              vitalindex === i ? (
                                <td className={`vitals bg-${vitalindex === i ? 'lightred' : ''} col-lg-7 col-md-8 col-sm-12 col-12 col-xl-5 position-absolute border border-1 shadow-sm rounded-1 d-${vitalindex == i ? vitalsform : 'none'}`} style={{ zIndex: '3' }}>
                                  <Vitalsoperation GetAppointmentVitals={GetAppointmentVitals} CloseVitals={CloseVitals} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} appointmentvitalslist={appointmentvitalslist} loadvitals={loadvitals} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} /></td>
                              ) : (<></>)
                            }
                            {
                              billindex == i ? (
                                <td className={`bill d-${billindex == i ? billform : 'none'} col-lg-8 p-0 m-0 col-md-10 start-0 mx-auto mt-2 end-0 top-0 col-sm-12 col-12 col-xl-6 border border-1 rounded-1 shadow-sm position-absolute`}>
                                  <Bill fetchapi={props.fetchapi} CloseBillForm={CloseBillForm} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} appointmentid={data.id} doctorfee={data.doctor.consulationFee} billform={billform} /></td>
                              ) : (<></>)
                            }
                            {
                              paymentsindex === i ? (
                                <td className={`payments start-0 bg-seashell end-0 shadow-sm top-0 border border-1 rounded-1 col-lg-6 col-md-8 col-sm-12 col-12 mt-2 col-xl-8 ps-3 px-5 py-2 position-absolute d-${paymentsindex == i ? paymentsform : 'none'}`}>
                                  <Payments ClosePaymentsForm={ClosePaymentsForm} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} /></td>
                              ) : (<></>)
                            }
                            {
                              consumablesindex == i ? (
                                <td className={`consumables mx-auto position-absolute bg-seashell shadow-sm top-0 border border-1 rounded-1 start-0 end-0 col-lg-8 col-md-11 col-sm-12 col-12 mt-2 col-xl-6  d-${consumablesindex == i ? consumables : 'none'}`} style={{ zIndex: '4' }} >
                                  <AddConsumables appointmentdata={appointmentdata[i]} Appointmentlist={Appointmentlist} existedconsumables={appointmentdata[i].medicine_used.reverse()} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} toggleConsumables={toggleConsumables} />
                                </td>
                              ) : (<></>)
                            }
                            {
                              saleindex == i ? (
                                <td className={`saleentryform mx-auto position-absolute bg-seashell shadow-sm top-0 border border-1 rounded-1 start-0 end-0 col-lg-10 col-md-11 col-sm-12 col-12 mt-2 col-xl-8  d-${saleindex == i ? saleindex : 'none'}`} style={{ zIndex: '4' }} >
                                  <SaleEntryForm DoctorID={props.DoctorID} DoctorName={props.DoctorName} saleindex={saleindex} toggle_nsef={toggle_nsef} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} />
                                </td>
                              ) : (<></>)

                            }
                          </tr>

                        )))}
                  </tbody>
                )
              }
            </table>
          </div>
        </section>
      </section>

    </>
  );
}
export { DoctorSchedule };

function Timecard(props) {
  const url = useContext(URL);
  const clinics = useContext(Clinic)
  const [cardindex, setcardindex] = useState()
  const [rooms, setrooms] = useState([])
  function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0)
      hours = hours + 24;

    return (hours != 0 ? ((hours <= 9 ? "0" : "") + hours + "hrs ") : "") + (minutes <= 9 ? "0" : "") + minutes + 'mins'
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
  let [doctime, setdoctime] = useState([]);
  let [isLoading, setisLoading] = useState();
  let [startload, setstartload] = useState(false)

  let clinicid = localStorage.getItem('ClinicId');

  async function fetchapi() {
    setisLoading(true);
    await axios.get(`${url}/todays/doctor/time/list?doctor_id=${props.docid}&clinic_id=${clinicid}`).then((response) => {
      console.log(response)
      console.log(response.data.data)
      if (response.data.data.length == 0) {
        setisLoading(false);
      }
      else {
        setdoctime(response.data.data.reverse());
        setisLoading(false);
      }
    })
  }
  const [refreshtimeslots, setrefreshtimeslot] = useState(false);
  const [roomnumber, setroomnumber] = useState('1');

  async function starttimeslot() {
    setstartload(true)
    let adminid = localStorage.getItem('id');
    if (clinicid && roomnumber && props.docid && adminid) {
      try {
        await axios.post(`${url}/doctor/start/time`, {
          clinic_id: clinicid,
          room_id: roomnumber,
          doctor_id: props.docid,
          admin_id: adminid,
        }).then((response) => {
          setstartload(false)
          Notiflix.Notify.success(response.data.message)
        })
        await fetchapi();

      } catch (e) {
        Notiflix.Notify.failure(e.message)

        setstartload(false)

      }
    } else {
      Notiflix.Notify.alert('Please fill all details')
      setstartload(false)
    }
  }

  async function endtimeslot(data) {
    let adminid = localStorage.getItem('id');
    setrefreshtimeslot(true);
    let log_id = data.id;
    try {
      await axios.post(`${url}/doctor/end/time`, {
        admin_id: adminid,
        log_id: log_id
      }).then((response) => {
        Notiflix.Notify.success(response.data.message)
      })
      await fetchapi();
      setrefreshtimeslot(false)
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      setrefreshtimeslot(false);
    }

  }
  useEffect(() => {
    fetchapi();
  }, [props._selected]);

  useEffect(() => {
    for (let i = 0; i < clinics.length; i++) {
      if (clinics[i].id == Number(clinicid)) {
        setrooms(clinics[i].rooms)
      }
    }

  }, [clinicid])
  // console.log(doctime, clinics, rooms, clinicid)
  return (
    <div className="scroll room_timecards align-items-center align-content-center my-auto mb-2 ms-2">
      <div id="cardslot" className={`d-${isLoading ? 'none' : 'inline-flex'}`}>
        <div className="card card1 p-0 m-0 text-start border-0" id="card1" >
          <div className="card-body p-0 m-0">
            <div className="d-flex align-items-center ms-3">
              <p className=" m-0 p-0 text-charcoal fw-bold me-2">Room</p>
              <select onChange={(e) => { setroomnumber(e.target.value) }} className="form-control bg-charcoal25 text-charcoal my-1 mx-2 p-0 py-2 px-3 w-auto text-center border-0" id="clinicroom1">
                {

                  rooms.map((data) => (
                    <option value={data.id}>{data.room_number}</option>
                  ))


                }
              </select>
              {
                startload ? (
                  <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                ) : (
                  <button className="btn playbutton p-0 m-0 mx-2" onClick={starttimeslot}><img src={process.env.PUBLIC_URL + 'images/play.png'} style={{ width: '1.8rem' }} /></button>
                )
              }

            </div>
          </div>
        </div>
      </div>
      {
        isLoading ? (

          <div className="card bg-pearl text-center ms-3 bg-seashell" aria-hidden="true" style={{ width: '18rem', paddingTop: '0.76rem', paddingBottom: '0.76rem' }}>
            <div className=" text-start placeholder-glow gx-2">
              <span className="placeholder col-4 ms-2 text-start"></span>
              <span className="placeholder col-4 ms-2 text-start"></span>
              <span className="placeholder col-2 ms-2 text-start"></span>
            </div>
          </div>
        ) : (
          doctime.map((data, i) => (
            <div id="cardslot text-start" key={i} className="d-inline-flex m-1">
              <div className="card p-0 m-0 py-1 text-start border-0" id="card1">
                <div className="card-body p-0 m-0">
                  <div className="d-flex text-start align-items-center p-0 m-0 ">
                    <p className=" p-0 m-0  ms-2 text-charcoal75 fw-bold me-1 ps-2 " style={{ fontSize: '0.75rem' }}>Room</p>
                    <h5 className="text-burntumber fw-semibold my-1 me-2 border-0" id="clinicroom">
                      {data.room_id}
                    </h5>
                    {
                      refreshtimeslots && i === cardindex ? (
                        <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                      ) : (
                        <>
                          <div className="d-flex p-0 m-0 justify-content-center">

                            <button type="text" className="btn fromtime p-0 m-0 float-end text-charcoal text-center" style={{ fontSize: '0.75rem' }}>{(data.login_time) ? tConvert(data.login_time) : ''}</button>
                            <div className='mx-1 align-self-center' style={{ padding: '0.9px' }}>-</div>
                            <button type="text" className="btn totime p-0 m-0 text-charcoal float-end text-center" style={{ fontSize: '0.75rem' }}>{(data.logout_time) ? tConvert(data.logout_time) : '__'}</button>

                          </div>

                          <div className="d-flex mx-2 ">
                            {
                              data.logout_time ? (
                                <div id="totalhrs" className=" p-0 m-0 timediff text-burntumber fw-bold text-center pe-2" defaultValue="" style={{ fontSize: '0.75rem' }}>{data.logout_time ? diff(data.login_time, data.logout_time) : ''}</div>
                              ) : (
                                <button className="btn p-0 m-0 pausebutton" value={data.id} onClick={(e) => { endtimeslot(data); setcardindex(i) }}><img className="" src={process.env.PUBLIC_URL + 'images/pause.png'} onClick={(e) => { endtimeslot(e); setcardindex(i) }} style={{ width: '1.8rem' }} /></button>

                              )
                            }


                          </div>

                        </>
                      )
                    }
                  </div>
                </div>

              </div>


            </div>
          )

          ))

      }
    </div>

  )
}
export { Timecard }




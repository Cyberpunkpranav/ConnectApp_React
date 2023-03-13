import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AmountPaid from './AmountPaid';
import { URL, TodayDate } from '../../index'
import Notiflix from 'notiflix';
import { customconfirm } from "../features/notiflix/customconfirm";
import { customloading } from "../features/notiflix/customloading"
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { UpdateAppointment } from './UpdateAppointment'
import '../../css/bootstrap.css'
import '../../css/dashboard.css'
import { SelectedTimeAppointment } from '../Appointments/SelectedTimeAppointment'
import { AddSelectedDoctorSlot } from './SelectedDoctorSlot'
import { Vitalsoperation } from "./Vitals";
import { Payments } from "./Payments";
import { Bill } from "./Bill";

function DoctorSchedule(props) {
  //Global Variables
  const url = useContext(URL)
  const Date = useContext(TodayDate)
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
  const [addquickslots, setaddquickslots] = useState('none')
  const [vitalsform, setvitalsform] = useState('none')
  const [vitalindex, setvitalindex] = useState()
  const [appointmentvitalslist, setappointmentvitalslist] = useState([])
  const [loadvitals, setloadvitals] = useState()
  const [billindex, setbillindex] = useState()
  const [billform, setbillform] = useState('none')
  const [paymentsindex, setpaymentsindex] = useState()
  const [paymentsform, setpaymentsform] = useState('none')
  const [d_form, setd_form] = useState()

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
          messageColor: '#96351E'
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
    try {
      await axios.post(`${url}/appointment/call/in`, {
        appointment_id: id,
        admin_id: adminid
      }).then((response) => {
        Notiflix.Notify.success(response.data.message.slice(0, -1) + ' to ' + name)
      })
    } catch (e) {
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

  return (
    <>
      <section id="doctorscheduledata">
        <section className="timeslotsection">
          <div className="container-fluid p-0 m-0 ">
            <div className="row p-0 m-0">
              <div className=" col-12 p-0 m-0 align-items-center">
                <div className="d-flex align-items-center p-0 m-0">
                  <div className="col-auto">
                    <h5 className="p-0 m-0 ms-1 text-charcoal75 my-2 fw-bolder">Time Slots Avaliable</h5>
                  </div>
                  <div className="col-2 ms-2">
                    <button className="btn m-0 p-0">
                      <img src={process.env.PUBLIC_URL + "/images/addicon.png"} style={{ width: "1.5rem" }} alt="displaying_image" onClick={OpenAddQuickSlots} />
                    </button>
                    <div className={`d-${addquickslots} rounded-2 bg-seashell shadow col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 position-absolute end-0 start-0 top-0 m-auto mt-3`} style={{ zIndex: '3010', minWidth: '10rem', maxWidth: '30rem' }}>
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
                      <button className={`button-sm button-${timeindex == i ? 'charcoal' : 'charcoal-outline'} m-1`} onClick={(e) => { openAddApppointmentform(); settimeindex(i) }} key={i}>{tConvert(data[0])}</button>
                      {
                        timeindex == i ? (
                          <section className={`d-${timeindex == i ? addappointmentform : 'none'} col-lg-8 col-md-10 col-sm-10 col-11 col-xl-8 appointmentinfosection position-absolute m-auto start-0 end-0 bg-seashell rounded-4 col-6 shadow-none border border-1 overflow-auto`} style={{ zIndex: 4, top: '-1rem' }}>
                            <SelectedTimeAppointment fetchapi={props.fetchapi} closeAddAppointmentform={closeAddAppointmentform} DocClinic={props.DocClinic} DoctorID={props.DoctorID} DoctorName={props.DoctorName} timeindex={timeindex} selectedtime={data[0]} selectedtimeID={data[2]} />
                          </section>
                        ) : (
                          <></>
                        )
                      }

                    </>
                  ) : (
                    <button disabled className="button button-sm button-charcoal50-outline m-1" key={i}>{tConvert(data[0])}</button>
                  )

                ))

              }
            </div>
          </div>
        </section>

        <section className="allappointmentsection p-0 m-0">
          <div className="col-auto m-0 p-0 align-items-center">
            <h5 className="p-0  ms-1 text-charcoal75 fw-bold my-2">Appointments</h5>
          </div>
          <div className=" scroll scroll-y align-content-center align-items-center" style={{ maxHeight: '42vh', Height: '42vh' }}>
            <table className="table datatable text-center">
              <thead className="p-0 m-0 px-2 bg-pearl" style={{ 'zIndex': '4' }}>
                <tr className="p-0 m-0 position-sticky top-0">
                  <th className="border-0 bg-pearl" key={0}>Update</th>
                  <th className="border-0 bg-pearl" key={1}>Status</th>
                  <th className="border-0 bg-pearl" key={2}>Patient Name</th>
                  <th className="border-0 bg-pearl" key={3}>Phone Number</th>
                  <th className="border-0 bg-pearl" key={4}>Time</th>
                  <th className="border-0 bg-pearl" key={5}>Total Amount</th>
                  <th className="border-0 bg-pearl" key={6}>Amount Status</th>
                  <th className="border-0 bg-pearl" key={7}>Vitals</th>
                  <th className="border-0 bg-pearl" key={8}>Bill</th>
                  <th className="border-0 bg-pearl" key={9}>Payments</th>
                  <th className="border-0 bg-pearl" key={10}>Call Patient</th>
                  <th className="border-0 bg-pearl" key={11} >Bill</th>
                  <th className="border-0 bg-pearl" key={12}>Prescription</th>
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
                            <td className={`py-0 bg-${tableindex === i ? 'lightyellow' : ''}`}>
                              <button className="btn m-0 p-0" key={i} onClick={(e) => { openapppointmentform(); settableindex(i); setappointmentid(data.id) }}>
                                <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" style={{ width: "1.5rem" }} key={i} />
                              </button>
                            </td>
                            <td className="">
                              <select className={` fw-bolder rounded-5 p-1 text-center button-${status_color(data.appointment_status)}`} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
                                <option className="button" selected disabled>{status(data.appointment_status)}</option>
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
                            </td>
                            <td className="py-0">{data.patient ? data.patient.full_name !== null ? data.patient.full_name : 'N/A' : 'N/A'}</td>
                            <td className="py-0">{data.patient ? data.patient.phone_number != null ? data.patient.phone_number : 'N/A' : 'N/A'}</td>
                            <td className="py-0">{tConvert(data.timeslot.time_from)}</td>
                            <td className="py-0">{data.total_amount}</td>
                            <td className="py-0"><AmountPaid appointmentData={data} Appointmentlist={Appointmentlist} /> </td>
                            <td className={`py-0 bg-${vitalindex === i ? 'lightyellow' : ''}`}><button className="btn p-0 m-0" onClick={() => { setvitalindex(i); OpenVitals(); GetAppointmentVitals(data.id) }}><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                            <td className={`py-0 bg-${billindex === i ? 'lightyellow' : ''}`}> <button className="btn p-0 m-0" onClick={() => { setbillindex(i); OpenBillForm(); }}><img src={process.env.PUBLIC_URL + "/images/bill.png"} alt="displaying_image" style={{ width: "1.8rem" }} className="me-1" /></button>  </td>
                            <td className={`py-0 bg-${paymentsindex === i ? 'lightyellow' : ''}`}><button className="btn p-0 m-0" onClick={() => { setpaymentsindex(i); OpenPaymentsForm(); }}><img src={process.env.PUBLIC_URL + "/images/rupee.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                            <td className={`py-0`}><button className="btn p-0 m-0" onClick={() => confirmmessage(data.patient.full_name, data.id)}><img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt="displaying_image" className="ms-1" style={{ width: "1.8rem" }} /></button></td>
                            <td className={`py-0`}><a target='_blank' className='p-0 m-0 text-decoration-none text-burntumber fw-bold' href={`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/admin/appointment/generate/bill/${data.id}`}><img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /></a></td>
                            <td className={`py-0`}><a target='_blank' className='p-0 m-0 text-decoration-none text-charcoal fw-bold' href={`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/swift_pdf/prescription_pdf_${data.id}.pdf`}><img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /></a></td>
                            {
                              tableindex === i ? (
                                <td className={`updateappointment border border-1 rounded-3 bg-seashell mt-2 start-0 end-0 top-0 col-lg-8 col-md-10 col-sm-10 col-10 col-xl-5 d-${tableindex == i ? appointmentform : 'none'} position-absolute`}>
                                  <UpdateAppointment fetchapi={props.fetchapi} fetchallAppointmentslist={props.fetchallAppointmentslist} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} appointmentid={data.id} addappointmentform={addappointmentform} closeappointmentform={closeappointmentform} doctorid={props.doctorid} appointmentdoctorid={data.doctor.id} appointmentdate={data.appointment_date} appointmenttime={tConvert(data.timeslot.time_from)} /></td>
                              ) : (<></>)
                            }
                            {
                              vitalindex === i ? (
                                <td className={`vitals bg-${vitalindex === i ? 'lightred' : ''} col-lg-7 col-md-8 col-sm-12 col-12 col-xl-5 position-absolute border border-1 shadow rounded-2 d-${vitalindex == i ? vitalsform : 'none'}`} style={{ zIndex: '3010' }}>
                                  <Vitalsoperation GetAppointmentVitals={GetAppointmentVitals} CloseVitals={CloseVitals} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} appointmentvitalslist={appointmentvitalslist} loadvitals={loadvitals} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} /></td>
                              ) : (<></>)
                            }
                            {
                              billindex == i ? (
                                <td className={`bill d-${billindex == i ? billform : 'none'} col-lg-8 p-0 m-0 col-md-10 start-0 mx-auto mt-2 end-0 top-0 col-sm-12 col-12 col-xl-6 border border-1 rounded-3 shadow position-absolute`}>
                                  <Bill fetchapi={props.fetchapi} CloseBillForm={CloseBillForm} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} appointmentid={data.id} doctorfee={data.doctor.consulationFee} /></td>
                              ) : (<></>)
                            }
                            {
                              paymentsindex === i ? (
                                <td className={`payments start-0 bg-seashell end-0 top-0 border border-1 rounded-3 col-lg-6 col-md-8 col-sm-10 col-10 mt-2 col-xl-8 position-absolute d-${paymentsindex == i ? paymentsform : 'none'}`}>
                                  <Payments ClosePaymentsForm={ClosePaymentsForm} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} /></td>
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
  const [cardindex, setcardindex] = useState()
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

    return (hours <= 9 ? "0" : "") + hours + "hrs" + (minutes <= 9 ? "0" : "") + minutes + 'mins';
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
  let doctimes = [];

  let clinicid = localStorage.getItem('ClinicId');

  function fetchapi() {
    setisLoading(true);
    axios.get(`${url}/todays/doctor/time/list?doctor_id=${props.docid}&clinic_id=${clinicid}`).then((response) => {
      if (response.data.data.length == 0) {
        setisLoading(false);
      }
      else {
        response.data.data.map((data) => {
          doctimes.push(data);

        })
        setdoctime(doctimes.reverse());
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
        fetchapi();

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
      fetchapi();
      setrefreshtimeslot(false)
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      setrefreshtimeslot(false);
    }

  }
  useEffect(() => {
    fetchapi();
  }, [props._selected]);


  return (
    <div className="scroll align-items-center align-content-center my-auto mb-2">
      <div id="cardslot" className={`d-${isLoading ? 'none' : 'inline-flex'} m-1`}>
        <div className="card card1 p-0 m-0 text-start" id="card1" >
          <div className="card-body p-0 m-0">
            <div className="d-flex align-items-center ms-3">
              <p className=" m-0 p-0 text-charcoal fw-bold me-2">Room</p>
              <select onChange={(e) => { setroomnumber(e.target.value) }} className="form-control bg-pearl my-1  mx-2 p-0 py-1 px-3 w-auto text-center border-0" id="clinicroom1">
                <option defaultValue="1">1</option>
                <option defaultValue="2">2</option>
                <option defaultValue="3">3</option>
                <option defaultValue="4">4</option>
                <option defaultValue="5">5</option>
                <option defaultValue="6">6</option>
                <option defaultValue="7">7</option>
                <option defaultValue="8">8</option>
                <option defaultValue="9">9</option>
                <option defaultValue="10">10</option>
                <option defaultValue="11">11</option>
                <option defaultValue="12">12</option>
                <option defaultValue="13">13</option>
              </select>
              {
                startload ? (
                  <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                ) : (
                  <button className="btn p-0 m-0 mx-2" onClick={starttimeslot}><img src={process.env.PUBLIC_URL + 'images/play.png'} style={{ width: '1.8rem' }} /></button>
                )
              }

            </div>
          </div>
        </div>
      </div>
      {
        isLoading ? (

          <div className="card bg-pearl text-center ms-3 bg-seashell" aria-hidden="true" style={{ width: '18rem', paddingTop: '0.76rem', paddingBottom: '0.76rem' }}>
            <div className=" text-start   placeholder-glow gx-2">
              <span className="placeholder col-4 ms-2 text-start"></span>
              <span className="placeholder col-4 ms-2 text-start"></span>
              <span className="placeholder col-2 ms-2 text-start"></span>
            </div>
          </div>
        ) : (
          doctime.map((data, i) => (
            <div id="cardslot text-start" key={i} className="d-inline-flex m-1">
              <div className="card p-0 m-0 text-start" id="card1">
                <div className="card-body p-0 m-0">
                  <div className="d-flex text-start align-items-center p-0 m-0 ">
                    <p className=" p-0 m-0  ms-2 text-charcoal fw-bold">Room</p>
                    <select className="form-control rounded-2 bg-pearl my-1 mx-2 p-0 py-1 px-3 border-0 w-auto" id="clinicroom">
                      <option defaultValue="01">{data.room_id}</option>
                    </select>
                    {
                      refreshtimeslots && i === cardindex ? (
                        <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                      ) : (
                        <>
                          <div className="d-flex p-0 m-0 justify-content-center">

                            <button type="text" className="btn p-0 m-0 float-end text-charcoal text-center">{(data.login_time) ? tConvert(data.login_time) : ''}</button>
                            <div className='vr h-50 mx-2 align-self-center' style={{ padding: '0.9px' }}></div>
                            <button type="text" className="btn p-0 m-0 text-charcoal float-end text-center">{(data.logout_time) ? tConvert(data.logout_time) : '__'}</button>

                          </div>

                          <div className="d-flex mx-2 ">
                            {
                              data.logout_time ? (
                                <div id="totalhrs" className="btn p-0 m-0 text-charcoal fw-bold text-center me-3" defaultValue="00">{data.logout_time ? diff(data.login_time, data.logout_time) : ''}</div>
                              ) : (
                                <button className="btn p-0 m-0" value={data.id} onClick={(e) => { endtimeslot(data); setcardindex(i) }}><img src={process.env.PUBLIC_URL + 'images/pause.png'} onClick={(e) => { endtimeslot(e); setcardindex(i) }} style={{ width: '1.8rem' }} /></button>

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
          )
        )
      }
    </div>

  )
}
export { Timecard }




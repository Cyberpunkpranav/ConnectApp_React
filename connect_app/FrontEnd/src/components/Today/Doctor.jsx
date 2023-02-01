import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AmountPaid from './AmountPaid';
import { URL, TodayDate } from '../../index'
import Notiflix from 'notiflix';
import { customconfirm } from "../features/notiflix/customconfirm";
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
  const [singleload,setsingleload]=useState(0)
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
  const [billindex,setbillindex]= useState()
  const [billform,setbillform]=useState('none')
  const [paymentsindex,setpaymentsindex]=useState()
  const [paymentsform,setpaymentsform]= useState('none')

  const [d_form, setd_form] = useState()

  // for UpdateAppointment
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
    await axios.get(`${url}/appointment/list?doctor_id=${props.todayDoc[props._selected][0]}&from_date=${Date}&to_date=${Date}`).then((response) => {
      setappointmentdata(response.data.data);
    })
    setisLoading(false);
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
        alert(e)
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
  async function SendNotifcation(name,id) {
    try{
      await axios.post(`${url}/appointment/call/in`, {
        appointment_id:id,
        admin_id: adminid
      }).then((response)=>{
        Notiflix.Notify.success(response.data.message.slice(0,-1) +' to ' + name)
      })
    }catch(e){
      Notiflix.Notify.warning(e.message)
    }

  }
  const confirmmessage = (name,id) => {
    customconfirm()
    Notiflix.Confirm.show(
      `Call Patient `,
      `Do you surely want to call ${name}`,
      'Yes',
      'No',
      () => {
        SendNotifcation(name,id)
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
  function OpenBillForm(){
    if(billform === 'none'){
      setbillform('block')
    }
  }
  function CloseBillForm(){
    if(billform=='block'){
      setbillform('none')
    }
  }
  function OpenPaymentsForm(){
    if(paymentsform==='none'){
      setpaymentsform('block')
    }
  } 
  function ClosePaymentsForm(){
    if(paymentsform==='block'){
      setpaymentsform('none')
    }
  }

  return (
    <>
      <section id="doctorscheduledata">
        <section className="timeslotsection">
          <div className="container-fluid p-0 m-0 ">
            <div className="row ps-md-3 p-0 m-0">
              <div className=" col-12 p-0 m-0 align-items-center">
                <div className="d-flex p-2">
                  <div className="col-auto">
                    <h4 className="p-0 m-0 text-charcoal75 fw-bolder">Time Slots</h4>
                  </div>
                  <div className="col-2 ms-2">
                    <button className="btn m-0 p-0">
                      <img src={process.env.PUBLIC_URL + "/images/addicon.png"} style={{ width: "2rem" }} alt="displaying_image" onClick={OpenAddQuickSlots} />
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
                      <button className={`button button-${timeindex == i ? 'pearl' : 'lightgreen'} m-1`} onClick={(e) => { openAddApppointmentform(); settimeindex(i) }} key={i}>{tConvert(data[0])}</button>
                      {
                        timeindex == i ? (
                          <section className={`d-${timeindex == i ? addappointmentform : 'none'} col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 appointmentinfosection position-absolute m-auto start-0 end-0 bg-seashell rounded-4 col-6 shadow overflow-auto`} style={{ zIndex: 4000, top: '-2rem' }}>
                            <SelectedTimeAppointment fetchapi={props.fetchapi} closeAddAppointmentform={closeAddAppointmentform} DocClinic={props.DocClinic} DoctorID={props.DoctorID} DoctorName={props.DoctorName} timeindex={timeindex} selectedtime={data[0]} selectedtimeID={data[2]} />
                          </section>
                        ) : (
                          <></>
                        )
                      }

                    </>
                  ) : (
                    <button disabled className="btn button-burntumber m-1" key={i}>{tConvert(data[0])}</button>
                  )

                ))

              }
            </div>
          </div>
        </section>

        <section className="allappointmentsection p-0 m-0">
          <div className="col-auto m-0 p-0 my-1 align-items-center">
            <h4 className="p-0 my-auto ps-3 text-charcoal75 fw-bold">Appointments</h4>
          </div>
          <div className="tablesection scroll scroll-y align-content-center align-items-center">
            <table className="table datatable text-center">
              <thead className="p-0 m-0 px-2">
                <tr className="p-0 m-0">
                  <th className="p-0 m-0 border border-1" key={0} rowspan='2'>Update</th>
                  <th className="p-0 m-0 border border-1" key={1} rowspan='2'>Status</th>
                  <th className="p-0 m-0 border border-1" key={2} rowspan='2'>Patient Name</th>
                  <th className="p-0 m-0 border border-1" key={3} rowspan='2'>Phone Number</th>
                  <th className="p-0 m-0 border border-1" key={4} rowspan='2'>Time</th>
                  <th className="p-0 m-0 border border-1" key={5} rowspan='2'>Total Amount</th>
                  <th className="p-0 m-0 border border-1" key={6} rowspan='2'>Amount Status</th>
                  <th className="p-0 m-0 border border-1" key={7} rowspan='2'>Vitals</th>
                  <th className="p-0 m-0 border border-1" key={7} rowspan='2'>Bill</th>
                  <th className="p-0 m-0 border border-1" key={8} rowspan='2'>Payments</th>
                  <th className="p-0 m-0 border border-1" key={8} rowspan='2'>Call Patient</th>
                  <th className="p-0 m-0 border border-1" key={9} colspan='2' scope='colgroup'>Pdfs</th>
                </tr>
                <tr>
                  <th className="bg-white border p-0 m-0 border-1" scope='col' >Bill</th>
                  <th className="bg-white border p-0 m-0 border-1"scope='col'>Prescription</th>
                </tr>
              </thead>
              {
                singleload == 0 ? (
                  <tbody >
                    <tr className=' position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                      <td className=' position-absolute start-0 end-0 text-burntumber fs-3 mt-1 text-center'>Loading Appointments</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {
                      appointmentdata.length == 0 ? (
                        <tr><button className="text-center fs-4 position-absolute text-burntumber button-burntumber border-start-0 border-end-0 px-5 start-0 end-0">No Appointments Found</button></tr>
                      ) : (
                        appointmentdata.map((data, i) => (
                          <tr className='appointmentsrow align-content-center align-items-center align-self-center'>
                            <th scope="row align-items-center">
                              <button className="btn btn-lg px-1 action position-relative bg-transparent confirmed position-relative m-0 p-0" key={i} onClick={(e) => { openapppointmentform(); settableindex(i); setappointmentid(data.id) }}>
                                <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" style={{ width: "1.5rem" }} key={i} />
                              </button>
                            </th>
                            <td  className="align-items-center align-self-center border border-1">
                              <select className={`p-2 fw-bolder rounded-5 text-center align-self-center align-items-center button-${status_color(data.appointment_status)}`} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
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
                            <td className="border border-1">{data.patient ? data.patient.full_name !== null ? data.patient.full_name : 'N/A' : 'N/A'}</td>
                            <td className="border border-1">{data.patient ? data.patient.phone_number != null ? data.patient.phone_number : 'N/A' : 'N/A'}</td>
                            <td className="border border-1">{tConvert(data.timeslot.time_from)}</td>
                            <td className="border border-1">{data.total_amount}</td>
                            <td className="border border-1"><AmountPaid appointmentData={data} Appointmentlist={Appointmentlist} /> </td>
                            <td className="border border-1"><button className="btn p-0 m-0" onClick={() => {setvitalindex(i); OpenVitals(); GetAppointmentVitals(data.id) }}><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                            <td className="border border-1"> <button className="btn p-0 m-0" onClick={()=>{setbillindex(i); OpenBillForm();}}><img src={process.env.PUBLIC_URL + "/images/bill.png"} alt="displaying_image" style={{ width: "1.8rem" }} className="me-1" /></button>  </td>
                            <td className="border border-1"><button className="btn p-0 m-0" onClick={()=>{setpaymentsindex(i); OpenPaymentsForm();}}><img src={process.env.PUBLIC_URL + "/images/rupee.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                            <td className="border border-1"><button className="btn p-0 m-0" onClick={()=>confirmmessage(data.patient.full_name,data.id)}><img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt="displaying_image" className="ms-1" style={{ width: "1.8rem" }} /></button></td>
                            <td className="border border-1"><a target='_blank' className='p-0 m-0 text-decoration-none text-burntumber fw-bold' href={`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/admin/appointment/generate/bill/${data.id}`}><img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /></a></td>
                            <td className="border border-1"><a target='_blank' className='p-0 m-0 text-decoration-none text-charcoal fw-bold' href={`Billhttps://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/swift_pdf/prescription_pdf_${data.id}.pdf`}><img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /></a></td>
                            {
                              appointmentid === data.id ? (
                                <td className={`updateappointment border-0  d-${tableindex == i ? appointmentform : 'none'} p-0 start-0 bottom-0 end-0 position-absolute`} style={{ zIndex: '3005' }}><UpdateAppointment fetchapi={props.fetchapi} fetchallAppointmentslist={props.fetchallAppointmentslist} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} appointmentid={data.id} addappointmentform={addappointmentform} closeappointmentform={closeappointmentform} doctorid={props.doctorid} appointmentdoctorid={data.doctor.id} appointmentdate={data.appointment_date} appointmenttime={tConvert(data.timeslot.time_from)} /></td>
                              ) : (<></>)
                            }
                            {
                              vitalindex === i ? (
                                <td className={`vitals col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 position-absolute border border-1 shadow rounded-2 d-${vitalindex == i ? vitalsform : 'none'}`} style={{ zIndex: '3010' }}><Vitalsoperation GetAppointmentVitals={GetAppointmentVitals} CloseVitals={CloseVitals} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} appointmentvitalslist={appointmentvitalslist} loadvitals={loadvitals} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} /></td>
                              ) : (<></>)
                            }
                            {
                            billindex == i ?(
                              <td className={`bill border-0 d-${billindex == i ? billform:'none'} rounded-4 col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 position-absolute border border-1 shadow `} style={{ zIndex: '3020' }}><Bill fetchapi={props.fetchapi} CloseBillForm={CloseBillForm} patientid={data.patient && data.patient.id != null ? data.patient.id : ""}  patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} appointmentid={data.id} doctorfee = {data.doctor.consulationFee}/></td>
                              ):(<></>)
                            }
                               {
                              paymentsindex === i ? (
                                <td className={`payments col-lg-6 col-md-8 col-sm-12 col-12 col-xl-4 position-absolute shadow border border-1 rounded-2 d-${paymentsindex == i ? paymentsform : 'none'}`} style={{ width:'40rem', zIndex: '3010' }}><Payments ClosePaymentsForm={ClosePaymentsForm} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} appointmentid={data.id} patientid={data.patient && data.patient.id != null ? data.patient.id : ""} Appointmentlist={Appointmentlist} setsingleload={setsingleload} isLoading={isLoading} appointmentdata={appointmentdata} /></td>
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
  let [doctorid, setdoctorid] = useState();
  let doctimes = [];
  let clinicid = 1;

  function fetchapi() {
    setisLoading(true);
    axios.get(`${url}/todays/doctor/time/list?doctor_id=${props.docid}&clinic_id=${clinicid}`).then((response) => {
      if (response.data.data.length == 0) {
        setisLoading(false);
      }
      else {
        response.data.data.map((data) => {
          doctimes.push(data);
          setdoctorid(props.docid);
        })
        setdoctime(doctimes);
        setisLoading(false);
      }
    })
  }
  const [refreshtimeslots, setrefreshtimeslot] = useState();
  const [roomnumber, setroomnumber] = useState('1');

  async function starttimeslot() {
    let adminid = localStorage.getItem('id');
    if (clinicid && roomnumber && props.docid && adminid) {
      try {
        await axios.post(`${url}/doctor/start/time`, {
          clinic_id: clinicid,
          room_id: roomnumber,
          doctor_id: props.docid,
          admin_id: adminid,
        }).then((response) => {
          return response;
        })
        fetchapi();
        setrefreshtimeslot(false);
      } catch (e) {
        if (e.response.status != 200) {
          alert("please Check your internet Connection")
          window.location.reload()
        }
        alert(e)
      }

    } else {
      Notiflix.Notify.alert('Please fill all details')
    }
  }

  async function endtimeslot(e) {
    let adminid = localStorage.getItem('id');
    setrefreshtimeslot(true);
    let log_id = e.target.value;
    if (adminid && log_id) {
      try {
        await axios.post(`${url}/doctor/end/time`, {
          admin_id: adminid,
          log_id: log_id
        }).then((response) => {
          return response;
        })
        fetchapi();
        setrefreshtimeslot(false);
      } catch (e) {
        alert(e)
      }
    } else {
      Notiflix.Notify.alert('Please fill all details and try Again')
    }
  }
  useEffect(() => {
    fetchapi();
  }, [props._selected]);

  const [displaytimecard, setdisplaytimecard] = useState('none');
  const [displaytimecardbtn, setdisplaytimecardbtn] = useState('inline-flex');
  const addnewtimecard = () => {
    if (displaytimecard === 'none') {
      setdisplaytimecard('inline-flex');
      setdisplaytimecardbtn('none');
    }
    if (displaytimecard === 'inline-flex') {
      setdisplaytimecard('none');
      setdisplaytimecardbtn('inline-flex');
    }
  }
  const [cardindex, setcardindex] = useState()
  return (
    <div className="scroll align-items-center align-content-center my-auto mb-2">
      {
        isLoading ? (
          <div className="container-fliud pt-3 start-0 end-0 position-absolute">
            <div className="d-flex fs-2 align-items-center">
              <div className="text-burntumber m-auto">Loading Timeslots</div>
            </div>
          </div>
        ) : (

          doctime.map((data, i) => (
            <div id="cardslot" key={i} className="d-inline-flex m-1">
              <div className="card p-0 m-0 text-center" id="card1">
                <div className="card-body p-0 m-0">
                  <div className="d-flex p-0 m-0">
                    <div className="col-8 p-0 m-0">
                      <p className=" p-0 m-0 text-end mt-1">Room No.</p>
                    </div>
                    <div className="col-auto p-0 m-0">
                      <select className="form-control mb-0 pb-0 bg-transparent text-center border-0" id="clinicroom">
                        <option defaultValue="01">{data.room_id}</option>
                      </select>
                    </div>
                  </div>
                  <div className="row justify-content-center m-0 p-0">
                    {
                      refreshtimeslots && i === cardindex ? (
                        <div className="container-fliud pt-2">
                          <div className="d-flex fs-6 align-items-center justify-content-around">
                            <h6 className="text-burntumber">Updating...</h6>
                            <div className="text-burntumber spinner-border ml-auto" role="status" aria-hidden="true" ></div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex p-0 m-0 justify-content-center">
                            <div className="col-auto p-0 m-0">
                              <button type="text" className="btn p-0 m-0 float-end text-charcoal text-center">{(data.login_time) ? tConvert(data.login_time) : ''}</button>
                            </div>
                            <div className='col-auto'>-</div>
                            <div className="col-auto p-0 m-0">
                              <button type="text" className="btn p-0 m-0 text-charcoal float-end text-center">{(data.logout_time) ? tConvert(data.logout_time) : ''}</button>
                            </div>
                          </div>
                          <div className="col-12 p-0 m-0 text-center">
                            <button id="totalhrs" className="btn p-0 m-0 text-charcoal text-center" defaultValue="00">{data.logout_time ? diff(data.login_time, data.logout_time) + ' Used' : 'Click to get Details'}</button>

                          </div>

                          <div className="d-flex justify-content-around">
                            {
                              data.logout_time ? (
                                <button disabled className="btn m-0 mb-1 p-1 btn-danger" id="endbtn">Time Ended</button>
                              ) : (
                                <button className="btn btn-danger m-0 mb-1 p-1" id={i} value={data.id} onClick={(e) => { endtimeslot(e); setcardindex(i) }}>End Time</button>
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

      <div id="cardslot" className={`d-${displaytimecard} m-1`}>
        <div className="card  card1 p-0 m-0 text-center" id="card1" >
          <div className="card-body p-0 m-0">
            <button type="button" className="btn-close closebtn float-end" aria-label="Close" onClick={addnewtimecard}></button>
            <div className="d-flex">
              <div className="col-8 p-0 m-0">
                <p className=" m-0 p-0 text-end mt-1">Room No.</p>
              </div>
              <div className="col-auto p-0 m-0">
                <select onChange={(e) => { setroomnumber(e.target.value) }} className="form-control mb-0 pb-0 bg-transparent text-center border-0" id="clinicroom1">
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
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-auto p-0 m-0"> <button type="text" className="btn m-0 p-0 float-end text-charcoal text-center">00:00</button> </div>
              <div className="col-auto">-</div>
              <div className="col-auto p-0 m-0"> <button type="text" className="btn m-0 p-0 float-end text-charcoal text-center">00:00</button> </div>
            </div>
            <div className="d-flex justify-content-center">
              <button id="totalhrs" className="btn m-0 p-0 text-charcoal text-center" defaultValue="00">Click to book the Room</button>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-around">
                <button className="btn m-0 mb-1 p-1 btn-success startbtn" onClick={starttimeslot}>Start Time</button>
              </div>
            </div>

          </div>

        </div>
      </div>
      <div className={`d-${displaytimecardbtn}`} id="addslotbutton">
        <button className='btn button-seashell ms-3' onClick={addnewtimecard}>
          <p className="text-burntumber">Click the button below to <br />add TimeCard</p>
          <img src={process.env.PUBLIC_URL + "/images/addicon.png"} alt="displaying_image" style={{ width: "3rem" }} />
        </button>
      </div>
    </div>

  )
}
export { Timecard }




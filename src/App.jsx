import { Link } from "react-router-dom"
import { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import { encrypt, decrypt } from 'n-krypta'
import ReactPaginate from 'react-paginate';
// import { w3cwebsocket as websocket } from 'websocket'
//Context APIs
import { URL, TodayDate, DoctorsList, Doctorapi, Permissions, Secretkey } from '../src/index'
//Components
import { DoctorSchedule, Timecard } from "./components/Today/Doctor"
import { Salesection, Purchasesection, Stocksection, Listsection } from "./components/pharmacy/pharmacy"
import { Livetime } from "./components/features/livetime"
import { Newpurchaseentryarray } from "./components/pharmacy/apiarrays"
import { AddAppointment } from './components/Today/AddAppointment'
import { AddPatient } from './components/Today/AddPatient'
import { AddDoctorSlot } from './components/Today/AddDoctorSlot'
import { AllAppointmentslist } from './components/Appointments/AllAppointmentslist'
import { SelectedAppointments } from './components/Appointments/SelectedAppointments'
import { Timer } from './components/features/Timer'
import { UpdatePatient } from './components/Patients/UpdatePatient'
import { UpdateDoctor } from "./components/Doctors/UpdateDoctor"
import { Appointments_Dsr } from './components/Dsr/Appointments_Dsr'
import { Doctors_Dsr } from './components/Dsr/Doctors_Dsr'
import { Pharmacy_Dsr } from './components/Dsr/Pharmacy_Dsr'
import { SearchField } from "./components/features/SearchField"
//CSS
import './css/dashboard.css';
import './css/appointment.css';
import "./css/pharmacy.css";
import "./css/bootstrap.css";
import './css/patient.css';
import './css/Doctors.css';
import './css/livetime.css';
import '../node_modules/bootstrap/js/dist/dropdown';
import Notiflix from 'notiflix';
import { customconfirm } from "./components/features/notiflix/customconfirm"


function Navbar(props) {
  // console.log(props.permissions)
  // console.log(JSON.parse(props.permissions))
  // console.log(props.permissions.dashboard_all)
  // const chatinputref = useRef()
  // const [chat, setchat] = useState('')
  // const [chatarr, setchatarr] = useState([])
  // const [openchat, setopenchat] = useState('none')
  // var client = new websocket('ws://localhost:3500/chat')
  // let chatarray = []


  // function sendmessage() {
  //   chatinputref.current.value = ''
  //   client.onopen = function Chatopened() {
  //     console.log("connection established")
  //     client.send(chat)
  //   }

  //   client.onmessage = function message(e) {
  //     console.log("message sent")
  //     chatarray.push(e.data)
  //     setchatarr(prevState => [...prevState, chatarray])
  //   }
  //   client.close = function clientclosed() {
  //     console.log('client closed')
  //   }
  // }
  const secretkey = useContext(Secretkey)
  const permission = useContext(Permissions)
  console.log(permission)
  const [addoption, setaddoption] = useState("none");
  const toggleaddoption = () => {
    if (addoption === "none") {
      setaddoption("block");
    } else if (addoption === "block") {
      setaddoption("none");
    }
  };
  const [patientform, setpatientform] = useState("none");
  const togglepatientform = () => {
    if (patientform === "none") {
      setpatientform("block");
    } else if (patientform === "block") {
      setpatientform("none");
    }
  };
  const [appointmentform, setappointmentform] = useState("none");
  const toggleappointmentform = () => {
    if (appointmentform === "none") {
      setappointmentform("block");
    } else if (appointmentform === "block") {
      setappointmentform("none");
    }
  };
  const [doctorform, setdoctorform] = useState("none");
  const toggledoctorform = () => {
    if (doctorform === "none") {
      setDocval(1)
      setdoctorform("block");

    } else if (doctorform === "block") {
      setDocval(0)
      setdoctorform("none");
    }
  };

  function formshift() {
    setappointmentform("none");
    setpatientform("block");
  }

  function logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('designation');
    localStorage.removeItem('ClinicId');
    localStorage.removeItem('roleId');
    window.location.reload(true);
  }


  // function inactivelogout() {
  //   window.addEventListener('touchmove', function (e) {
  //     let screenx = 0;
  //     let screeny = 0;
  //     if (e.changedTouches.clientX && e.changedTouches.clientY) {
  //       screenx = e.changedTouches.clientX;
  //       screeny = e.changedTouches.clientY;
  //       console.log(screenx, screeny, true)
  //     } else {
  //       console.log('false')
  //     }
  //   })
  // }


  const [logoutbtn, setlogoutbtn] = useState('none');
  const togglelogoutbtn = () => {
    if (logoutbtn === 'none') {
      setlogoutbtn('block');
    }
    if (logoutbtn === 'block') {
      setlogoutbtn('none');
    }
  }

  const [Docval, setDocval] = useState()
  const [highlighticon, sethighlighticon] = useState()

  const path = localStorage.getItem('path')
  useEffect(() => {
    localStorage.setItem('path', highlighticon)
  }, [highlighticon])
  const NavbarIcons = [
    {
      title: 'Today',
      path: '/',
      image: '/images/today.png',
      display: props.permissions.dashboard_view !== undefined ? props.permissions.dashboard_view : 0

    },
    {
      title: 'Appointments',
      path: '/Appointments',
      image: '/images/appointment.png',
      display: props.permissions.appointment_view !== undefined ? props.permissions.appointment_view : 0

    },
    {
      title: 'Patients',
      path: '/Patients',
      image: '/images/patient.png',
      display: props.permissions.patient_view !== undefined ? props.permissions.patient_view : 0

    },
    {
      title: 'Doctors',
      path: '/Doctors',
      image: '/images/doctor.png',
      display: props.permissions.doctor_view !== undefined ? props.permissions.doctor_view : 0
    },
    {
      title: 'DSR',
      path: '/DailySaleReport',
      image: '/images/dsr.png',
      display: props.permissions.dsr_pharmacy == undefined && props.permissions.dsr_appointment == undefined && props.permissions.dsr_doctor_timings == undefined ? 0 : 1
    },
    {
      title: 'Pharmacy',
      path: '/pharmacy',
      image: '/images/Pharmacy.png',
      display: props.permissions.purchase_entry_view == undefined && props.permissions.purchase_orders_view == undefined && props.permissions.purchase_return_view == undefined && props.permissions.sale_entry_view == undefined && props.permissions.sale_return_view == undefined ? 0 : 1
    },
    // {
    //   title: 'Files',
    //   path: '/Files',
    //   image: '/images/folder.png'
    // }

  ]

  //Searchfield input
  const [searchtext, setsearchtext] = useState()

  return (
    <>
      <button className='parentclose d-none position-absolute'></button>
      <div className="navsection p-0 m-0 py-2">
        <div className="container-fluid p-0 m-0 ">
          <div className="row m-0 p-0 justify-content-evenly">
            <div className="col-lg-auto col-xl-auto col-md-auto col-sm-auto col-3 p-0 m-0 text-start">
              <button className="button button-seashell shadow-none col-md-auto col-auto user position-relative p-0 m-0 ms-2" onClick={togglelogoutbtn}>
                <p className="m-0 username text-decoration-none text-lg-start text-md-start text-center"> {props.username} </p>
                <p className="m-0 userstatus text-decoration-none text-lg-start text-md-start text-center"><small className="text-muted">{props.designation}</small> </p>
                <button className={`d-${logoutbtn} button button-lightred start-0 end-0 position-absolute text-burntumber w-100 fw-bolder`} style={{ zIndex: '1000' }} onClick={logout}>Logout</button>
              </button>
            </div>
            <div className="col-lg-auto col-xl-7 align-self-center col-sm-auto col-md-auto col-12 p-0 m-0 menu order-1 order-xl-0 order-sm-0 order-md-0 order-sm-0 mt-lg-0 mt-md-0 md-sm-0 mt-2">
              <div className="row p-0 m-0 gx-auto justify-content-lg-center justify-content-md-center justify-content-center">
                {
                  NavbarIcons.map((data, i) => (
                    <div className={` ms-lg-2 col-auto align-self-end d-${data.display == 1 ? '' : 'none'} `} onClick={() => sethighlighticon(data.path)}>
                      <Link to={data.path} className="text-decoration-none"> <div className="text-center"> <img src={process.env.PUBLIC_URL + data.image} alt="displaying_image" className={`img-fluid rounded-2 p-2 bg-${highlighticon ? highlighticon === data.path ? 'burntumber25' : 'seashell' : path === data.path ? 'burntumber50' : 'seashell'}`} style={{ width: `1.5rem`, boxSizing: 'content-box' }} /></div><p className="col-12 m-0 text-center">{data.title}</p>  </Link>
                    </div>
                  ))
                }
              </div>

            </div>
            <div className="col-lg-auto col-xl-auto col-md-auto col-2 col-sm-2 text-center align-self-center position-relative p-0 m-0 ">
              <div className={`dropdown d-${props.permissions.patient_add == undefined && props.permissions.doctor_add == undefined && props.permissions.appointment_add == undefined ? 'none' : ''}`}>
                <button className="button button p-0 m-0 px-1 py-1 button-burntumber dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  +Add
                </button>
                <ul className="dropdown-menu">
                  <li><button className={`dropdown-item border-bottom d-${props.permissions.patient_add == 1 ? '' : 'none'}`} onClick={() => { togglepatientform() }}>+ Patient</button></li>
                  <li className={`d-${props.permissions.appointment_add == 1 ? '' : 'none'}`}><button className="dropdown-item border-bottom" onClick={() => { toggleappointmentform() }}>+ Appointment</button></li>
                  <li><button className={`dropdown-item  `} onClick={() => { toggledoctorform() }}>+ Doctor</button></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-xl-2 col-md-2 col-sm-6 col-6 mt-sm-2 ms-md-2 align-self-center order-sm-2 order-0 search text-center position-relative p-0 m-0" style={{ zIndex: '3' }} >
              <input type="text" className="bg-pearl border border-1 text-center position-relative w-100 " placeholder="search" onChange={(e) => setsearchtext(e.target.value)} />
              <div className="position-absolute bg-pearl end-0 shadow rounded-2 mt-2 border border-1">
                <SearchField searchtext={searchtext} fetchapi={props.fetchapi} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`col-lg-5 col-md-6 col-sm-12 col-12 rounded-4 p-2 me-lg-2 me-md-2 mt-2 scroll patientinfosection d-${patientform} border position-absolute`} >
        <AddPatient togglepatientform={togglepatientform} />
      </div>
      <div className={`col-lg-5 col-md-6 col-sm-12 rounded-4 p-2 me-lg-2 me-md-2 mt-2 col-12 bg-seashell appointmentinfosection d-${appointmentform} border-start border-top border-2 position-absolute`} style={{ zIndex: '4', right: '0' }} >
        <AddAppointment toggleappointmentform={toggleappointmentform} formshift={formshift} fetchapi={props.fetchapi} />
      </div>
      {
        Docval == 1 ? (
          <div className={`col-lg-5 col-md-6 col-sm-12 col-12 px-2 me-lg-2 me-md-2 mt-lg-2 mt-md-2 mt-1 bg-seashell  rounded-4 doctorinfosection d-${doctorform} shadow-sm border position-absolute`} >
            <AddDoctorSlot toggledoctorform={toggledoctorform} staticBackdrop4={'staticBackdrop3'} fetchapi={props.fetchapi} />
          </div>
        ) : (
          <div></div>
        )
      }

      {/* <div className="position-absolute bottom-0 end-0 me-5 mb-3 d-block" style={{ zIndex: 1000 }}>
        <button className={`btn p-0 m-0 d-${openchat == 'block' ? 'none' : 'block'}`} onClick={() => { openchat == 'none' ? setopenchat('block') : setopenchat('none') }}><img src={process.env.PUBLIC_URL + 'images/chat.png'} style={{ width: '2.5rem' }} /></button>
        <div className={`container d-${openchat == 'none' ? 'none' : 'block'}`}>
          <div className="bg-lightgreen border border-1 rounded-2 overflow-scroll" style={{ maxHeight: '15rem' }}>
            {
              chatarr.flat().map((data) => (
                <div className="text-end me-2">{data}</div>
              ))}</div>
          <button className="btn btn-close" onClick={() => { openchat == 'none' ? setopenchat('block') : setopenchat('none') }}></button>
          <input className="bg-seashell rounded-2 border border-1" ref={chatinputref} onBlur={(e) => { setchat(e.target.value) }} />
          <button className="btn p-0 m-0" onClick={sendmessage}><img src={process.env.PUBLIC_URL + 'images/completed.png'} style={{ width: '1.8rem' }} /></button>
        </div>

      </div> */}
    </>
  );
}

function Doctorsection(props) {
  const secretkey = useContext(Secretkey)
  const permission = useContext(Permissions)
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
  const d = new Date();
  let monthname = month[d.getMonth()];
  var fullDate = new Date();
  var currentDate = monthname + " " + fullDate.getDate() + "," + fullDate.getFullYear() + " ";

  const [Doctor, setDoctor] = useState(0)
  const [DoctorID, setDoctorID] = useState()
  const [DoctorName, setDoctorName] = useState()
  const [DocClinic, setDocClinic] = useState()
  const [doctorindex, setdoctorindex] = useState([0])

  const [doctorform, setdoctorform] = useState("none");
  const toggledoctorform = () => {
    if (doctorform === "none") {
      setDocval(1)
      setdoctorform("block");
    }
    if (doctorform === "block") {
      setDocval(0)
      setdoctorform("none");
    }
  };

  function getindexes() {
    for (let j = 0; j < doctorindex.length; j++) {
      if (doctorindex.includes(Doctor)) {
        break;
      } else {
        doctorindex.push(Doctor)
      }
    }
  }
  getindexes()
  const [Docval, setDocval] = useState(0)
  return (
    <>
      <div className="container-fluid doctorsection bg-seashell p-0 m-0 mt-1 scroll">
        <div className=" hstack gap-3 d-flex p-0 m-0 ms-1 p-1 align-items-center">
          {
            props.isLoading ? (
              <div className='col-3'>
                <div className="spinner-border my-auto" style={{ width: "2rem", height: "2rem" }} role="status" >
                  <span className="sr-only"></span> </div>
                <div className="spinner-grow my-auto" style={{ width: "1.5rem", height: "1.5rem" }} role="status" >
                  <span className="sr-only"></span> </div> </div>
            ) : (
              props.todayDoc.map((data, i) => (
                <>
                  <div className='col-auto doctors p-0 m-0'>
                    <button key={i} className={`button rounded-3 p-0 m-0 py-1 px-2 btn-sm col-auto shadow-none text-${i === Doctor ? 'light' : 'charcoal75 fw-bolder'} button-${i === Doctor ? "charcoal" : "seashell"} border-${i === Doctor ? 'secondary' : 'none'}`}
                      autoFocus={i === Doctor ? true : false}
                      onFocus={() => { setDoctorID(data[0]); setDoctorName(data[1]); setDocClinic(data[2]) }}
                      value={`${data[0]}.${data[1]}`} onClick={(a) => { setDoctor(i); }}>{`Dr.${data[1]}`} </button>
                  </div>
                  <div className='vr rounded-2 h-75 align-self-center' style={{ padding: '0.8px' }}></div>
                </>
              ))
            )}
          <div className='col-auto'>
            <button className={`btn bg-transparent border-0 `} id="adddoctorbtn" onClick={toggledoctorform} >
              <img src={process.env.PUBLIC_URL + "/images/addicon.png"} alt="displaying_image" style={{ width: "1.5rem" }} />
            </button>
          </div>
        </div>

      </div>
      <section className="patientsection border-start p-0 m-0 border-5 border-dark border-opacity-50 position-relative">
        <div className="container-fluid p-0 m-0 my-2">
          <div className="row m-0 p-0 align-items-center">
            <span className='col-auto livetime text-charcoal fw-bold' style={{ fontSize: '1.5rem' }}>{currentDate}</span>
            <div className=' col-auto vr align-self-center h-75' style={{ padding: '0.8px' }}></div>
            <span className='col-auto livetime2' style={{ fontSize: '1.5rem' }}><Timer /></span>
          </div>
        </div>
        {
          props.Loading ? (
            <div className=" position-absolute start-0 end-0 m-auto loader ">
              <button class="button button-pearl shadow-none fs-3 fw-bolder text-charcoal75" type="button" disabled>
                Please Be Patient While We are Fetching Data
                <span class="spinner-grow spinner-grow ms-1 bg-brandy " role="status" aria-hidden="true"></span>
              </button>
              <button class="button button-pearl shadow-none m-0 p-0 " type="button" disabled>
                <span class="spinner-grow spinner-grow bg-raffia" role="status" aria-hidden="true"></span>
                <span class="spinner-grow spinner-grow-md ms-1 bg-burntumber" role="status" aria-hidden="true"></span>
                <span class="spinner-grow spinner-grow-lg ms-1 bg-charcoal75" role="status" aria-hidden="true"></span>
                <span class="visually-hidden">Loading...</span>
              </button>
            </div>

          ) : (
            props.todayDoc && props.todayDoc.length != 0 ? (
              doctorindex.map((data, i) => (
                data == Doctor ? (
                  <div key={i}>
                    <div className={`p-0 m-0 my-2 d-${permission.dashboard_all == 1 ? '' : 'none'}`}>
                      <Timecard docid={props.todayDoc[Doctor][0]} _selected={Doctor} />
                    </div>
                    <div className="p-0 m-0 my-2">
                      <DoctorSchedule todayDoc={props.todayDoc} _selected={Doctor} fetchapi={props.fetchapi} DocClinic={DocClinic} DoctorID={DoctorID} DoctorName={DoctorName} />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )
              ))
            ) : (
              <div className="container-fliud pt-3">
                <div className="d-flex fs-2 align-items-center justify-content-around">
                  <strong className="text-burntumber">Please Wait...</strong>
                  <div className="text-burntumber spinner-border ml-auto" role="status" aria-hidden="true" ></div>
                </div>
              </div>
            ))}
      </section>
      {
        Docval == 1 ? (
          <div className={`col-lg-5 col-md-6 col-sm-12 col-12 doctorinfosection d-${doctorform} me-lg-2 top-0  me-md-2 rounded-4 border bg-seashell shadow-sm position-absolute`} style={{ zIndex: '2', marginTop: '5.1rem' }} >
            <AddDoctorSlot toggledoctorform={toggledoctorform} staticBackdrop4={'staticBackdrop4'} fetchapi={props.fetchapi} />
          </div>
        ) : (
          <></>
        )
      }

    </>
  );

}

function Appointments(props) {
  const secretkey = useContext(Secretkey)
  //Global Variables
  const APIDate = useContext(TodayDate)
  const permission = useContext(Permissions)
  const url = useContext(URL)
  let clinicID = localStorage.getItem('ClinicId')
  const docnames = useContext(DoctorsList)
  //Appointments use state
  const [doctorid, setdoctorid] = useState()
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  //Selected Appointments use state
  const [isselectedLoading, setisselectedLoading] = useState()
  const [appointmentdata, setappointmentdata] = useState([])
  const [type, settype] = useState()
  //All Appointments use state
  const [getAppointments, setgetAppointments] = useState([])
  const [isLoading, setisLoading] = useState()
  const [visibles, setvisibles] = useState([])

  async function fetchallAppointmentslist() {
    if (doctorid) {
      setgetAppointments([])
      try {
        setisselectedLoading(true);
        await axios.get(`${url}/appointment/list?clinic_id=${clinicID}&doctor_id=${doctorid}&from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
          setappointmentdata(response.data.data)
        })
        setisselectedLoading(false);
      } catch (e) {
        alert(e)
      }
    } else {
      setappointmentdata([])
      let listdata = []
      try {
        setvisibles()
        setisLoading(true)
        await axios.get(`${url}/appointment/list?clinic_id=${clinicID}&from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
          setgetAppointments(response.data.data)
          response.data.data.map((data) => {
            listdata.push(data.doctor.id)
          })
          setvisibles(listdata, [])
        })
        setisLoading(false)
      } catch (e) {
        alert(e)
      }
    }

  }

  useEffect(() => {
    fetchallAppointmentslist()
  }, [])

  useEffect(() => {
    fetchallAppointmentslist()
  }, [doctorid, fromdate, todate, type])


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

  const options = [['All', ''], ['Cancelled', 3], ['Completed', 10], ['Unattended', 9]]
  const [optionsindex, setoptionsindex] = useState(0)

  const clearfields = () => {
    setdoctorid()
    setfromdate()
    settodate()
  }

  function CountAppointments(response) {
    let arr = []
    for (let i = 0; i < visibles.length; i++) {
      if (response === visibles[i]) {
        arr.push(response)
      }
    }
    if (arr.length != 0) {
      return ' | ' + '(' + arr.length + ' Appointments)'
    }
  }
  // useEffect(() => {
  // }, [fromdate, todate])
  // console.log(docnames, visibles, getAppointments.length, appointmentdata.length)
  return (
    <>
      <section className="page2appointment ">
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-12 col-sm-12 col-md-8 col-lg-6 col-xl-4">
              <div className="col-12 mt-3">
                <h4 className="p-lg-2 p-md-2 p-sm-2">All Appointments</h4>
              </div>
              <div className="col-12 mt-2">
                <div className="row p-0 m-0 g-lg-2 g-md-2 g-sm-2 g-2">
                  {
                    options.map((data, index) => (
                      <div className="col-auto">
                        <button className={`button-sm px-4 rounded-5 border-charcoal position-relative button-${optionsindex == index ? 'charcoal' : 'pearl'}`} key={index} onClick={(e) => { setoptionsindex(index); settype(data[1]) }}>
                          {data[0]}
                          <span class={` d-${optionsindex == index ? '' : 'none'} position-absolute top-0 text-pearl start-100 translate-middle badge rounded-pill bg-burntumber border-burntumber`} style={{ zIndex: '2' }}>
                            {doctorid ? appointmentdata.length : getAppointments.length}
                            <span class="visually-hidden">unread messages</span>
                          </span>
                        </button>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-4 daterange">
              <div className="col-12 mt-3 mb-2">
                <img src={process.env.PUBLIC_URL + "/images/today.png"} alt="displaying_image" />
                <span className="daterangetitle">Select Date Range</span>
                <button className="float-end button-sm button-burntumber" onClick={clearfields}>Clear</button>
              </div>
              <div className="d-flex g-md-3">
                <input placeholder="Start Date" className="form-control" value={fromdate ? fromdate : APIDate ? APIDate : ''} onFocus={() => { settodate(); setdoctorid() }} type="date" onChange={(e) => { setfromdate(e.target.value) }} />
                <div className="text-center">_</div>
                <input disabled={fromdate == null} value={todate ? todate : fromdate ? fromdate : APIDate ? APIDate : ''} placeholder="End Date" className="form-control" type="date" onChange={(e) => { settodate(e.target.value) }} />
              </div>
              <div className="col-12 mt-2">
                <h6 className="text-burntumber bold fw-bolder">Select Doctor to see their appointments</h6>
                <select className="form-control" value={doctorid ? doctorid : ''} onChange={(e) => { setdoctorid(e.target.value) }}>
                  <option selected value="Select Doctor">Select Doctor</option>
                  {
                    visibles ? (
                      docnames.map((response, i) => (
                        <option className={`form-control text-charcoal`} key={i} value={response[0]} >Dr. {response[1]}{' '}{' '}{CountAppointments(response[0])}</option>
                      ))

                    ) : (<option>Loading..</option>)
                  }

                </select>
              </div>
            </div>
          </div>
        </div>
        <section className="container-fluid scroll scroll-y mt-2 " >
          <table className="table text-start">
            <thead className="text-charcoal75 fw-bold">
              <tr className=" bg-pearl position-sticky top-0">
                <th className={`d-${permission.appointment_edit == 1 ? '' : 'none'}`}>Update</th>
                <th className="text-center">Status</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Phone Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total Amount</th>
                <th className="text-center">Amount Status</th>
                {/* <th>Rx</th> */}
                <th>F/U Date</th>
                {/* <th>Actions</th> */}
                <th className=" text-center bg-pearl">More</th>
              </tr>
            </thead>
            <tbody className="text-charcoal ">
              {
                doctorid ? (
                  <SelectedAppointments appointmentdata={appointmentdata} isselectedLoading={isselectedLoading} type={type} doctorid={doctorid} fromdate={fromdate} todate={todate} fetchallAppointmentslist={fetchallAppointmentslist} status={status} status_color={status_color} tConvert={tConvert} fetchapi={props.fetchapi} />
                ) : (

                  <AllAppointmentslist isLoading={isLoading} getAppointments={getAppointments} type={type} fromdate={fromdate} todate={todate} doctorid={doctorid} fetchallAppointmentslist={fetchallAppointmentslist} status={status} status_color={status_color} tConvert={tConvert} fetchapi={props.fetchapi} />
                )
              }
            </tbody>
          </table>
        </section>

      </section>


    </>
  );
}

function Patients() {
  const url = useContext(URL)
  const permission = useContext(Permissions)
  const adminid = localStorage.getItem('id')
  const [PatientsList, setPatientsList] = useState([])
  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()
  const [tabindex, settabindex] = useState(0)
  const [Loading, setLoading] = useState(false)
  const [patientsearch, setpatientsearch] = useState()

  function GetPages() {
    try {
      axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 10) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }
  async function getAllPatients(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true)
      setPatientsList()
      await axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=0`).then((response) => {
        setPatientsList(response.data.data.patients_list)
      })
      setLoading(false)
    } else {
      setLoading(true)
      setPatientsList()
      await axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=${Data.selected * 10}`).then((response) => {
        setPatientsList(response.data.data.patients_list)
      })
      setLoading(false)
    }


  }
  useEffect(() => {
    GetPages()
    getAllPatients()
  }, [pagecount, patientsearch])


  async function DeletePatient(patientid) {
    if (adminid && patientid) {
      try {
        console.log('hit')
        await axios.post(`${url}/delete/patient`, {
          id: patientid,
          admin_id: adminid

        }).then((response) => {
          Notiflix.Notify.success(response.data.message)
          getAllPatients()
        })
      } catch (e) {
        alert(e)
      }
    }
  }
  function confirmmessage(name, patientid) {
    customconfirm()
    Notiflix.Confirm.show(
      `Delete Patient`,
      `Do you surely want to Delete Patient ${name} `,
      'Yes',
      'No',
      () => {
        DeletePatient(patientid)
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  const [updatepatient, setupdatepatient] = useState('none')
  const [form, setform] = useState();

  const OpenUpdatePatient = (i) => {
    if (updatepatient === 'none') {
      setupdatepatient('block')
      setform(i)
    }
  }

  const CloseUpdatePatient = () => {
    if (updatepatient === 'block') {
      setupdatepatient('none')
    }
  }
  return (
    <section className="patientsection text-center position-relative">
      <div className="conatainer searchbar">
        <input className=" form-control m-auto mt-2" placeholder="Search Patient By Name or Number" onChange={(e) => { setpatientsearch(e.target.value); getAllPatients(); }} onBlur={getAllPatients} />
      </div>
      <div className="container-fluid p-0 m-0 scroll scroll-y " style={{ minHeight: '30rem' }}>
        <table className="table text-start" >
          <thead>
            <tr>
              <th className={`d-${permission.patient_edit == 1 ? '' : 'none'}`}>Update</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Email</th>
              {/* <th>Address</th>
              <th>Location</th> */}
              <th>Pincode</th>
              <th>Phone Number</th>
              <th>Is Main Account</th>
              <th className={`d-${permission.patient_delete == 1 ? '' : 'none'}`}>Delete</th>
              {/* <th>More</th> */}
            </tr>
          </thead>

          {
            Loading ? (
              <tbody className=' text-center' style={{ minHeight: '30vh' }}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center spinner">
                    <strong className=''>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>

              </tbody>
            ) : (
              PatientsList && PatientsList.length == 0 ? (
                <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '30vh' }}>
                  <tr className=''>
                    <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Patients found</td>
                  </tr>
                </tbody>

              ) : (
                <tbody>
                  {
                    PatientsList && PatientsList.map((data, i) => (
                      <tr className="align-middle">
                        <td className={`d-${permission.patient_edit == 1 ? '' : 'none'}`}>
                          <button className="btn p-0 m-0" onClick={(e) => { settabindex(i); OpenUpdatePatient(i) }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} /></button>
                          {form == i ? (
                            <section id={i} className={`updatepatientform text-start position-absolute d-${tabindex == i ? updatepatient : 'none'} bg-seashell rounded-2 shadow-sm border`}>
                              <UpdatePatient index={i} getAllPatients={getAllPatients} CloseUpdatePatient={CloseUpdatePatient} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : 'N/A'} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                            </section>
                          ) : (<></>)
                          }

                        </td>
                        <td>{data.full_name ? data.full_name : 'N/A'}</td>
                        <td>{data.gender ? data.gender : 'N/A'}</td>
                        <td>{data.dob ? reversefunction(data.dob) : 'N/A'}</td>
                        <td>{data.email ? data.email : 'N/A'}</td>
                        <td>{data.pin_code ? data.pin_code : 'N/A'}</td>
                        <td>{data.phone_number ? data.phone_number : 'N/A'}</td>
                        <td>{data.parent ? ' No' : 'Yes'}</td>
                        <td className={`d-${permission.patient_delete == 1 ? '' : 'none'}`}>
                          <button className="btn p-0 m-0" onClick={(e) => { confirmmessage(data.full_name, data.id); }}><img src={process.env.PUBLIC_URL + "/images/delete.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                      </tr>

                    ))
                  }
                </tbody>
              ))
          }

        </table>
      </div>

      <div className="container-fluid mt-2 d-flex justify-content-center">

        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'.'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={getAllPatients}
          containerClassName={'pagination scroll align-self-center align-items-center'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active'}
        />
      </div>

    </section>
  )



}

function Doctors() {
  const url = useContext(URL)
  const clinicID = localStorage.getItem('ClinicId')
  const imagepath = 'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/doctor/'
  const [Doctorssearch, setDoctorssearch] = useState()
  const [Doctorslist, setDoctorslist] = useState([])
  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()
  const [tabindex, settabindex] = useState()
  const [form, setform] = useState()
  const [pageloading, setpageloading] = useState(false)
  const [updatedoctor, setupdatedoctor] = useState('none')
  function GetPages() {
    try {
      axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 10) + 1)
        setpageloading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setpageloading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setpageloading(false)
    }
  }
  async function getAllDoctors(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setpageloading(true)
      setDoctorslist()
      await axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=0`).then((response) => {
        setDoctorslist(response.data.data.doctor_list)
        console.log(response)
      })
      setpageloading(false)
    } else {
      setpageloading(true)
      setDoctorslist()
      await axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=${Data.selected * 10}`).then((response) => {
        setDoctorslist(response.data.data.doctor_list)
      })
      setpageloading(false)
    }

  }

  useEffect(() => {
    GetPages()
    getAllDoctors()
  }, [pagecount, Doctorssearch])

  function OpenUpdateDoctor(i) {
    if (updatedoctor === 'none') {
      setupdatedoctor('block')
      setform(i)
    }
  }
  function CloseUpdateDoctor() {
    if (updatedoctor === 'block') {
      setupdatedoctor('none')
    }
  }

  return (
    <section className="Doctorspage text-center position-relative">
      <div className="conatainer searchbar">
        <input className="form-control m-auto mt-2" placeholder="Search Doctor" onChange={(e) => { setDoctorssearch(e.target.value) }} />
      </div>
      <div className="container-fluid p-0 m-0 scroll scroll-y" style={{ minHeight: '30rem' }}>
        <table className="table text-start" >
          <thead>
            <tr>
              <th>Update</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Degree</th>
              <th>Mobile No.</th>
              <th>Email Id</th>
              <th>Procedures</th>
              {/* <th>More</th> */}
            </tr>
          </thead>

          {
            pageloading ? (
              <tbody className=' text-center' style={{ minHeight: '30vh' }}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center">
                    <strong className=''>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>

              </tbody>
            ) : (
              Doctorslist && Doctorslist.length == 0 ? (
                <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '30vh' }}>
                  <tr className=''>
                    <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Doctors found</td>
                  </tr>
                </tbody>

              ) : (
                <tbody style={{ minHeight: '32vh' }}>
                  {
                    Doctorslist && Doctorslist.map((data, i) => (
                      <tr className="align-middle">
                        <td><button className="btn p-0 m-0" onClick={(e) => { settabindex(i); OpenUpdateDoctor(i) }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} /></button>
                          {form == i ? (
                            <section id={i} className={`scroll scroll-y position-absolute d-${tabindex == i ? updatedoctor : 'none'} bg-seashell rounded shadow top-0 bottom-2 `} style={{ marginLeft: '22.5rem', width: '40rem', height: '35rem' }}>
                              <UpdateDoctor index={i} CloseUpdateDoctor={CloseUpdateDoctor} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : ''} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                            </section>
                          ) : (<></>)
                          }

                        </td>
                        <td className="pe-5">{data.image ? <img className="img-fluid rounded-5" style={{ width: '2rem' }} src={imagepath + data.image} /> : 'Image not found'}{' '}{data.doctor_name ? data.doctor_name : ''}</td>
                        <td>{data.speciality.name}</td>
                        <td>{data.degree_suffix ? data.degree_suffix : ''}</td>
                        <td>{data.phone_number ? data.phone_number : ''}</td>
                        <td>{data.email}</td>
                        <td className="text-center"><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/info.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        {/* <td><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td> */}
                      </tr>
                    ))
                  }
                </tbody>
              )
            )
          }

        </table>
      </div>

      <div className="d-flex text-center justify-content-center mt-3">

        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'. . .'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={getAllDoctors}
          containerClassName={'pagination'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active'}
        />
      </div>

    </section>
  )
}

function DailySaleReport(props) {
  const permission = useContext(Permissions)
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
  const d = new Date();
  let monthname = month[d.getMonth()];
  var fullDate = new Date();
  var currentDate = monthname + " " + fullDate.getDate() + "," + fullDate.getFullYear() + " ";
  const Doctors = useContext(DoctorsList)
  const CurrentDate = useContext(TodayDate)
  const clinicid = localStorage.getItem('ClinicId')
  const options = [
    {
      option: 'Appointments',
      display: permission.dsr_appointments ? 1 : 0,
    },
    {
      option: 'Doctors',
      display: permission.dsr_doctor_timings ? 1 : 0,
    },
    {
      option: 'Pharmacy',
      display: permission.dsr_pharmacy ? 1 : 0
    }

  ]
  // permission.dsr_appointments ? 0 :  permission.dsr_doctor_timings ? 1 : permission.dsr_pharmacy ? 2:''
  const [menu, setmenu] = useState(permission.dsr_appointments ? 0 : permission.dsr_doctor_timings ? 1 : permission.dsr_pharmacy ? 2 : '')
  const [type, settype] = useState('text')
  const [doctorid, setdoctorid] = useState()
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [clinic, setclinic] = useState(clinicid)


  function ToggleOptions(_menu) {
    if (permission.dsr_appointments == 1 && _menu == 0) {
      return <Appointments_Dsr clinic={clinic} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    if (permission.dsr_doctor_timings == 1 && _menu == 1) {
      return <Doctors_Dsr clinicid={clinicid} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    if (permission.dsr_pharmacy == 1 && menu == 2) {
      return <Pharmacy_Dsr clinicid={clinicid} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    return <div>Please Select an Option from above</div>
  }

  return (

    <div className="DSRsection mt-1">
      <div className="p-0 m-0 mb-2">
        <div className="row p-0 m-0 options align-items-center bg-seashell ">
          <div className=" hstack gap-3 d-flex p-0 m-0 p-1 align-items-center">
            {
              options.map((data, i) => (
                <>
                  <div className={`col-auto p-0 m-0 d-${data.display == 1 ? '' : 'none'}`}>
                    <button className={`button m-0 p-0 px-2 py-1 ms-1 border-0 button-${i == menu ? 'charcoal' : ''} `} id={i} key={i} onClick={() => { setmenu(i) }}>{data.option}</button>
                  </div>
                  <div className={`vr rounded-2 h-50 align-self-center d-${data.display == 1 ? '' : 'none'}`} style={{ padding: '0.8px' }}></div>
                </>
              ))
            }
          </div>

        </div>
        <div className="row p-0 m-0 align-items-center gx-2 ">
          <div className="col-auto">
            <div className="container-fluid p-0 m-0 my-2 ">
              <div className="row m-0 p-0 align-items-center">
                <span className='col-auto fs-4 text-charcoal fw-bold p-0 m-0'>{<Livetime />}</span>


              </div>
            </div>
          </div>
          <div className="col">
            <div className="dropdown">
              <button className="button button p-0 m-0 px-1 py-1 button-pearl text-burntumber  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Filter Options
              </button>
              <ul className="dropdown-menu">
                <li className="text-center"><button className="dropdown-item border-bottom" >
                  <div className="col-auto p-0 m-0">
                    <select className="px-1 bg-transparent border-0 text-charcoal py-2  py-md-1 text-center " value={clinic ? clinic : ''} onChange={(e) => { setclinic(e.target.value) }}>
                      <option value="Select Clinic">Clinic</option>
                      {
                        props.cliniclist ? (
                          props.cliniclist.map((data) => (
                            <option className="text-start" value={data.id}>{data.id}.{' '}{data.title}</option>
                          ))
                        ) : (
                          <option>Loading</option>
                        )
                      }
                    </select>
                  </div></button></li>
                <li className="text-center"><button className="dropdown-item border-bottom " >
                  <div className="col-auto p-0 m-0 ">
                    <select className="bg-pearl text-center bg-transparent border-0  px-2 text-charcoal px-1 py-2 py-md-1" value={doctorid ? doctorid : ''} onChange={(e) => setdoctorid(e.target.value)}>
                      <option value='Doctors'>Doctor</option>
                      {
                        Doctors.map((data) => (
                          <>
                            <option className="text-start" value={data[0]}>{data[0]}. Dr.{data[1]} </option>

                          </>
                        ))
                      }
                    </select>
                  </div></button></li>
                <li className="text-center"><button className="dropdown-item ">
                  <div className="col-auto p-0 m-0">
                    <div className="row p-0 m-0 text-center">
                      <input type='date' placeholder="from Date" value={fromdate ? fromdate : ''} className=' bg-pearl col-auto px-2 border-0 outline-none ' onChange={(e) => setfromdate(e.target.value)} />
                      <div className="bg-pearl fw-bolder col-auto">-</div>
                      <input type='date' placeholder="to Date" disabled={fromdate ? false : true} value={todate ? todate : ''} className='bg-pearl px-2 border-0 col-auto outline-none' onChange={(e) => settodate(e.target.value)} />
                    </div>
                  </div></button></li>
              </ul>
            </div>
          </div>

        </div>

      </div>
      <div className="container-fluid  m-0 p-0 ">
        <div className="p-0 m-0">{ToggleOptions(menu)}</div>
      </div>
    </div>
  )
}

function Pharmacy() {
  const permission = useContext(Permissions)
  let menu = [
    {
      option: "Sale",
      display: permission.sale_entry_view == undefined && permission.ale_return_view == undefined ? 0 : 1,
    },
    {
      option: "Stock Info",
      display: permission.purchase_entry_view == undefined && permission.purchase_orders_view == undefined && permission.purchase_return_view == undefined ? 0 : 1,
    },
    {
      option: "Purchase",
      display: permission.purchase_entry_view == undefined && permission.purchase_orders_view == undefined && permission.purchase_return_view == undefined ? 0 : 1,
    },
    {
      option: "Lists",
      display: permission.vaccine_view == undefined && permission.medicine_view == undefined ? 0 : 1,
    }

  ];
  const [menuindex, setmenuindex] = useState(0);
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <div className="">
        <Salesection />
      </div>;
    }
    if (_menu === 1) {
      return (
        <div className="">
          <Stocksection />
        </div>
      );
    }
    if (_menu === 2) {
      return <Purchasesection />;
    }
    if (_menu === 3) {
      return <Listsection />;
    }
    return <div className="">Nothing Selected</div>;
  };
  return (
    <>
      <section className={`pharmacy position-relative`}>
        <div className="pharmacysection">
          <div className="container-fluid pharmacytabsection">
            <div className="  gap-3 d-flex p-0 m-0 ms-1 p-1 align-items-center">
              {
                menu.map((e, i) => {
                  return (
                    <>
                      <div className={`col-auto p-0 m-0 d-${e.display == 1 ? '' : 'none'}`}>
                        <button className={`button rounded-2 p-0 m-0 py-1 px-4 btn-sm col-auto shadow-none text-${i === menuindex ? 'light' : 'charcoal75 fw-bolder'} button-${i === menuindex ? "charcoal" : "seashell"} border-${i === menuindex ? 'secondary' : 'none'}`} onClick={(a) => setmenuindex(i)} > {e.option} </button>
                      </div>
                      <div className={`vr rounded-2 h-75 align-self-center d-${e.display == 1 ? '' : 'none'}`} style={{ padding: '0.8px' }}></div>
                    </>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="p-0 m-0 ms-1 text-charcoal fw-bold">
          {<Livetime />}
        </div>
        <div className="p-0 m-0">{_selectedmenu(menuindex)}</div>
      </section>

    </>
  );
}
function Exports() {
  return (
    <div>Exports</div>
  )
}


export { Navbar };
export { Doctorsection };
export { Appointments };
export { Pharmacy };
export { Patients };
export { Doctors };
export { DailySaleReport };
export { Exports }
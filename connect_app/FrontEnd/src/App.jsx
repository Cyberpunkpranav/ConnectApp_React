import { Link } from "react-router-dom"
import { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import { atom, useAtom } from 'jotai'
import { atomWithStorage,createJSONStorage } from 'jotai/utils'
//Context APIs
import { URL, TodayDate, DoctorsList, Doctorapi } from '../src/index'
//Components
import { DoctorSchedule, Timecard } from "./components/Today/Doctor"
import { Purchasesection, Stocksection, PEitemdetailssection, } from "./components/pharmacy/pharmacy"
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
//CSS
import './css/appointment.css';
import "./css/pharmacy.css";
import "./css/bootstrap.css";
import './css/patient.css';
import './css/Doctors.css';
import '../node_modules/bootstrap/js/dist/dropdown';
//Notiflix
import Notiflix from 'notiflix';
import { customconfirm } from "./components/features/notiflix/customconfirm"
//CSV
// import {CSVLink} from 'react-csv'

function Navbar(props) {
 
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
    window.location.reload(true);
  }


  function inactivelogout() {
    window.addEventListener('touchmove', function (e) {
      let screenx = 0;
      let screeny = 0;
      if (e.changedTouches.clientX && e.changedTouches.clientY) {
        screenx = e.changedTouches.clientX;
        screeny = e.changedTouches.clientY;
        console.log(screenx, screeny, true)
      } else {
        console.log('false')
      }
    })
  }


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

 const path =localStorage.getItem('path')
useEffect(()=>{
  localStorage.setItem('path',highlighticon)
},[highlighticon])
  console.log(highlighticon)
  const NavbarIcons = [
    {
      title: 'Today',
      path: '/',
      image: '/images/today.png'

    },
    {
      title: 'Appointments',
      path: '/Appointments',
      image: '/images/appointment.png'

    },
    {
      title: 'Patients',
      path: '/Patients',
      image: '/images/patient.png'

    },
    {
      title: 'Doctors',
      path: '/Doctors',
      image: '/images/doctor.png'
    },
    {
      title: 'DSR',
      path: '/DailySaleReport',
      image: '/images/dsr.png'
    },
    {
      title: 'Pharmacy',
      path: '/pharmacy',
      image: '/images/Pharmacy.png'
    },

  ]

  return (
    <>
      <button className={`parentclose d-none position-absolute`}></button>
      <div className="navsection p-2">
        <div className="container-fluid ">
          <div className="row align-items-center justify-content-evenly">
            <div className="col-lg-2 col-xl-2 col-md-2 col-sm-2 col-6">
              <div className="row">
                <div className="col-md-auto col-auto user">
                  <p className="m-0 username text-decoration-none text-lg-start text-md-start text-center"> {props.username} </p>
                  <p className="m-0 userstatus text-decoration-none text-lg-start text-md-start text-center"><small className="text-muted">{props.designation}</small> </p>
                </div>
                <div className="col-1 p-0 m-0 position-relative">
                  <button className='btn  p-0 m-0' onClick={togglelogoutbtn}><img src={process.env.PUBLIC_URL + "/images/more.png"} style={{ width: '1rem' }} /></button>
                  <button className={`logout d-${logoutbtn} btn button-brandy end-0 position-absolute`} onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-5 col-sm-auto col-md-auto col-10 p-2 m-0 menu order-1 order-xl-0 order-sm-0 order-md-0 order-sm-0">
              <div className="row align-items-center justify-content-around">
                {NavbarIcons.map((data, i) => (
                  <div className={`col-auto bg-${highlighticon ? highlighticon === data.path ? 'pearl' : 'seashell':path === data.path ? 'pearl' : 'seashell'} rounded-top border-bottom-${highlighticon? highlighticon === data.path ? 'burntumber' : 'seashell': path === data.path ? 'burntumber' : 'seashell'}`} onClick={() => sethighlighticon(data.path)}>
                    <Link to={data.path} className="text-decoration-none"> <div className="text-center"> <img src={process.env.PUBLIC_URL + data.image} alt="displaying_image" className="img-fluid" style={{ width: `1.5rem` }} /><p className="col-12 m-0">{data.title}</p> </div> </Link>
                  </div>
                ))
                }
              </div>
            </div>
            <div className="col-lg-2 col-xl-1 col-md-1 col-6 col-sm-2 text-center position-relative">
              <button className="btn col-12 addbtn" onClick={toggleaddoption}> {" "} +Add{" "} </button>
              <div className={`text-center addoptions d-${addoption} position-absolute`} >
                <input className="col-12 p-lg-2 border-1 border-bottom text-start patient" type="button" defaultValue="Patient" onClick={togglepatientform} />
                <input className="col-12 p-lg-2 text-start border-1 border-bottom appointment" type="button" defaultValue="Appointment" onClick={toggleappointmentform} />
                <input className="col-12 p-lg-2 doctorslot shadow-sm text-start" type="button" defaultValue="Doctor Slot" onClick={toggledoctorform} />
              </div>
            </div>
            <div className="col-10 col-lg-2 col-xl-2 col-md-3 col-sm-2 py-3  order-sm-2 order-2 Search position-relative">
              <article className="Search-box">
                <input type="text" className="Search-Text" placeholder="search" />
                <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="p-0 m-0 rounded-5" style={{ width: "2rem" }} />
              </article>
            </div>
          </div>
        </div>
      </div>

      <div className={`col-lg-5 col-md-6 col-sm-12 col-12 rounded-4 p-2 me-2 mt-2 patientinfosection d-${patientform} border-start border-top border-2 position-absolute`} >
        <AddPatient togglepatientform={togglepatientform} />
      </div>
      <div className={`col-lg-5 col-md-6 col-sm-12 rounded-4 p-2 me-2 mt-2 col-12 appointmentinfosection d-${appointmentform} border-start border-top border-2 position-absolute`} >
        <AddAppointment toggleappointmentform={toggleappointmentform} formshift={formshift} fetchapi={props.fetchapi} />
      </div>
      {
        Docval == 1 ? (
          <div className={`col-lg-5 col-md-6 col-sm-12 col-12 px-2 me-2 mt-2  rounded-4 doctorinfosection d-${doctorform}  border-start border-top border-2 position-absolute`} >
            <AddDoctorSlot toggledoctorform={toggledoctorform} staticBackdrop4={'staticBackdrop3'} fetchapi={props.fetchapi} />

          </div>
        ) : (
          <div></div>
        )
      }

    </>
  );
}


function Doctorsection(props) {
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
      <div className="container-fluid doctorcontainer">
        <section className="doctorsection ">
          <div className="row shadow rounded-bottom-4">
            <div className="d-flex pb-2 scroll doctortab">
              {props.isLoading ? (
                <> <div className="spinner-border my-auto" style={{ width: "2rem", height: "2rem" }} role="status" >
                  <span className="sr-only"></span> </div>
                  <div className="spinner-grow my-auto" style={{ width: "1.5rem", height: "1.5rem" }} role="status" >
                    <span className="sr-only"></span> </div> </>
              ) : (
                props.todayDoc.map((data, i) => (
                  <>
                    <button key={i} className={`button m-1 text-${i === Doctor ? 'light' : 'dark'} button-${i === Doctor ? "charcoal" : "seashell"} shadow-${i === Doctor ? 'lg' : 'sm'} border border-1 border-${i === Doctor ? 'secondary' : 'dark'}`} autoFocus={i === Doctor ? true : false} onFocus={() => { setDoctorID(data[0]); setDoctorName(data[1]); setDocClinic(data[2]) }} value={`${data[0]}.${data[1]}`} onClick={(a) => { setDoctor(i); }}>{`${data[0]}.${data[1]}`} </button>
                  </>
                ))
              )}
              <button className="btn bg-transparent border-0 d-inline-flex" id="adddoctorbtn" onClick={toggledoctorform} >
                <img src={process.env.PUBLIC_URL + "/images/addicon.png"} alt="displaying_image" style={{ width: "2.5rem" }} />
              </button>
            </div>
          </div>
        </section>
      </div>
      <section className="patientsection border-start border-5 border-dark border-opacity-50 position-relative">
        <div className="container-fluid p-0 m-0">
          <div className="row m-0 p-0 ms-auto">
            <div className="text-charcoal75" id="calender">
              <span className='fs-3'>{currentDate}</span>
              <span><Timer /></span>
            </div>
          </div>
        </div>
        {
          props.Loading ? (
            <div className=" position-absolute start-0 end-0 m-auto ">
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
                    <div className="p-0 m-0">
                      <Timecard docid={props.todayDoc[Doctor][0]} _selected={Doctor} />
                    </div>
                    <div className="p-0 m-0">
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
          <div className={`col-lg-5 col-md-6 col-sm-12 col-12 doctorinfosection d-${doctorform} me-2 mt-2 rounded-4  border-start border-top border-2 position-absolute`} >
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
  //Global Variables
  const APIDate = useContext(TodayDate)
  const url = useContext(URL)
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
      try {
        setisselectedLoading(true);
        await axios.get(`${url}/appointment/list?doctor_id=${doctorid}&from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
          setappointmentdata(response.data.data)
        })
        setisselectedLoading(false);
      } catch (e) {
        alert(e)
      }
    } else {
      let listdata = []
      try {
        setvisibles()
        setisLoading(true)
        await axios.get(`${url}/appointment/list?from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
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

  return (
    <>
      <section className="page2appointment ">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="col-12 mt-3">
                <h3 className="p-2">All Appointments</h3>
              </div>
              <div className="col-12 mt-4">
                <div className="row g-3">
                  {
                    options.map((data, index) => (
                      <div className="col-auto"><button className={`button px-4 rounded-5 button-${optionsindex == index ? 'seashell' : 'charcoal'} shadow-${optionsindex == index ? 'lg' : ''} border border-dark border-1`} key={index} onClick={(e) => { setoptionsindex(index); settype(data[1]) }}>{data[0]}</button></div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="col-md-4 daterange">
              <div className="col-12 mt-3 mb-2">
                <img src={process.env.PUBLIC_URL + "/images/today.png"} alt="displaying_image" style={{ width: "2rem" }} />
                <span className="daterangetitle">Select Date Range</span>
                <button className="float-end button-sm button-burntumber" onClick={clearfields}>Clear</button>
              </div>
              <div className="d-flex g-md-3">
                <input placeholder="Start Date" className="form-control" value={fromdate ? fromdate : ''} type="date" onChange={(e) => { setfromdate(e.target.value) }} />
                <div className="text-center">_</div>
                <input disabled={fromdate == null} value={todate ? todate : ''} placeholder="End Date" className="form-control" type="date" onChange={(e) => { settodate(e.target.value) }} />
              </div>
              <div className="col-12 mt-2">
                <h6 className="text-burntumber bold fw-bolder">Select Doctor to see their appointments</h6>
                <select className="form-control" value={doctorid ? doctorid : ''} onChange={(e) => { setdoctorid(e.target.value) }}>
                  <option selected value="Select Doctor">Select Doctor</option>
                  {
                    visibles != null ? (
                      docnames.map((response, i) => (
                        <option className={`form-control text-charcoal`} key={i} value={response[0]} >{response[0]}. Dr. {response[1]}{' '}{' '}{CountAppointments(response[0])}</option>
                      ))

                    ) : (<option>Loading..</option>)
                  }

                </select>
              </div>
            </div>
          </div>
        </div>
        <section className="container-fluid scroll scroll-y page2allappointment shadow mt-2 " style={{ minHeight: '10rem' }}>
          <table className="table text-center ">
            <thead>
              <tr>
                <th>Update</th>
                <th>Status</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Phone Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total Amount</th>
                <th>Amount Status</th>
                <th>Rx</th>
                <th>F/U Date</th>
                <th>Actions</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
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

function Pharmacy() {
  let menu = ["Sale Orders", "Stock Info", "Purchase"];
  const [menuindex, setmenuindex] = useState(1);
  const [npef, setnpef] = useState("none");
  const [peidw, setpeidw] = useState("none");
  const [pharmacy, setpharmacy] = useState("block");

  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");
      setpharmacy("none");
    }
    if (npef === "block") {
      setnpef("none");
      setpharmacy("block");
    }
  };
  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
      setpharmacy("none");
    }
    if (peidw === "block") {
      setpeidw("none");
      setpharmacy("block");
    }
  };
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <div className="">{_menu}</div>;
    }
    if (_menu === 1) {
      return (
        <div className="">
          <Stocksection />
        </div>
      );
    }
    if (_menu === 2) {
      return <Purchasesection func={toggle_npef} function={toggle_peidw} />;
    }
    return <div className="fs-2">Nothing Selected</div>;
  };
  return (
    <>
      <section className={`PEdetailssection position-absolute mt-1 d-${peidw} bg-seashell`} >
        {<PEitemdetailssection func={toggle_peidw} />}
      </section>

      <section className={`pharmacy position-relative d-${pharmacy}`}>
        <div className="pharmacysection">
          <div className="container-fluid pharmacytabsection">
            <div className="row py-2">
              {menu.map((e, i) => {
                return (
                  <div className="col-auto">
                    <button
                      className={`btn text-${i === menuindex ? "light" : "dark"
                        } bg-${i === menuindex ? "charcoal" : "seashell"}`}
                      onClick={(a) => setmenuindex(i)}
                    >
                      {e}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="ps-md-3 pt-4 " id="calender">
          {<Livetime />}
        </div>
        <div className="p-0 m-0">{_selectedmenu(menuindex)}</div>
      </section>
      <section
        className={`newpurchaseentrysection position-absolute d-${npef}`}
      >
        {<Newpurchaseentryform func={toggle_npef} />}
      </section>
    </>
  );
}

function Newpurchaseentryform(props) {
  return (
    <section className="newpurchaseentryform mt-1">
      <div className="container-fluid p-0 m-0">
        <div className="container-fluid bg-seashell border border-2 border-top-0 border-start-0 border-end-0 ">
          <div className="row p-2">
            <div className="col-1">
              <button
                type="button"
                className="btn-close closebtn m-auto"
                onClick={props.func}
                aria-label="Close"
              ></button>
            </div>
            <div className="col-9">
              <h6
                className="text-center"
                style={{ color: "var(--charcoal)", fontWeight: "600" }}
              >
                New Purchase Entry
              </h6>
            </div>
            <div className="col-auto">
              <button className="button button-charcoal py-1 px-4">
                <img />
                Invoice
              </button>
            </div>
          </div>
        </div>
        <div className="container-fluid entrydetails bg-pearl">
          <div className="row">
            <div className="col-8">
              <div className="container m-2">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className="row">
                      <div className="col-auto">
                        <input type="checkbox" className="" />
                      </div>
                      <div className="col-auto">
                        <span className="ms-0">Pharmacy</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="row">
                      <div className="col-auto">
                        <input type="checkbox" className="" />
                      </div>
                      <div className="col-auto">
                        <span className="ms-0">Clinic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="row g-4">
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Select PO</h6>
                    <select
                      className="form-control ms-2 rounded-1"
                      style={{ color: "gray" }}
                    >
                      <option defaultValue="Enter PO">Enter PO</option>
                    </select>
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Select Vendor</h6>
                    <select
                      className="form-control ms-2 rounded-1"
                      style={{ color: "gray" }}
                    >
                      <option defaultValue="Enter PO">Enter Name</option>
                    </select>
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Number</h6>
                    <input
                      type="number"
                      placeholder="Enter No."
                      className="form-control ms-2 rounded-1"
                      style={{ color: "gray" }}
                    />
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Date</h6>
                    <input
                      type="date"
                      className="form-control ms-2 rounded-1"
                      style={{ color: "gray" }}
                    />
                  </div>
                </div>
                <div className="col-3 mt-3 ms-3">
                  <button className="button button-charcoal py-1 px-4">
                    <img
                      src={process.env.PUBLIC_URL + "/images/addiconwhite.png"}
                      alt="displaying_image"
                      style={{ width: "1.5rem" }}
                    />
                    Medicine
                  </button>
                </div>
              </div>
              <div className="container newpurchaseentrytable mt-4">
                {<Newpurchaseentryarray />}
              </div>
            </div>
            <div className="col-4 medicineinfosection bg-seashell ps-2">
              <h5 className="mt-2">Medicine</h5>
              <form className="col-12">
                <div className="form-group col-10 py-3">
                  <label className="mb-2">Batch Number</label>
                  <input
                    type="number"
                    max="10"
                    className="form-control bg-seashell batchnumber rounded-1"
                    id="inputEmail4"
                    placeholder="Batch Number"
                    required
                  />
                  <label className="pt-3 mb-2">Expiry Date</label>
                  <input
                    type="Date"
                    className="form-control bg-seashell reounded-1 expirydate"
                    required
                  />
                  <label className="pt-3 mb-2">Manufacturing Date</label>
                  <input
                    type="Date"
                    className="form-control bg-seashell reounded-1 manufacturingdate"
                    required
                  />
                </div>
                <div className="col-12 form-group">
                  <div className="row">
                    <div className="col-5">
                      <label className="mb-2">MRP</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell mrp rounded-1  m-auto"
                        placeholder="00"
                        required
                      />
                    </div>
                    <div className="col-5">
                      <label className="mb-2"> Rate</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell rate rounded-1  m-auto"
                        placeholder="00"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-5">
                      <label className="mb-2">Discount &#40;%&#41;</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell mrp rounded-1  m-auto"
                        placeholder="00"
                        required
                      />
                    </div>
                    <div className="col-5 pb-3">
                      <label className="mb-2">Trade Discount &#40;%&#41;</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell rate rounded-1  m-auto"
                        placeholder="00"
                        required
                      />
                    </div>
                    <hr />
                    <div className="col-12 ps-2 py-2">
                      <div className="row align-items-center">
                        <div className="col-2 ">
                          <h6>SGST</h6>
                        </div>
                        <div className="col-5">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="00"
                            required
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="Rate"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 ps-2 py-2">
                      <div className="row align-items-center">
                        <div className="col-2">
                          <h6>CGST</h6>
                        </div>
                        <div className="col-5">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="00"
                            required
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="Rate"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 ps-2 py-2">
                      <div className="row align-items-center">
                        <div className="col-2 ">
                          <h6>IGST</h6>
                        </div>
                        <div className="col-5">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="00"
                            required
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            max="10"
                            className="form-control bg-seashell mrp rounded-1  m-auto"
                            placeholder="Rate"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="col-12 form-group">
                  <div className="row g-3">
                    <div className="col-5">
                      <label className="mb-2">Cost/Unit</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell costunit rounded-1"
                        placeholder="00"
                        required
                      />
                    </div>
                    <div className="col-5">
                      <label className="mb-2">Total Amount</label>
                      <input
                        type="number"
                        max="10"
                        className="form-control bg-seashell totalamount rounded-1"
                        placeholder="00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-6 py-3 m-auto text-center">
                  <button
                    type="submit"
                    className="btn  button-charcoal done px-5"
                  >
                    Done
                  </button>
                </div>
                <div className="col-6 pb-2 m-auto text-center">
                  <button className="btn btn-light px-5">Reset</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Patients() {
  const url = useContext(URL)
  const adminid = localStorage.getItem('id')
  const nextref = useRef()
  const previousref = useRef()
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [PatientsList, setPatientsList] = useState([])
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [tabindex, settabindex] = useState(0)
  const [Loading, setLoading] = useState(false)
  const [patientsearch, setpatientsearch] = useState()

  async function getAllPatients(i) {
    if (i == undefined) {
      i = 0
    }
    setLoading(true)
    setPatientsList()
    if (i == 0 || i == undefined || nxtoffset == 0) {
      previousref.current.disabled = true
    } else {
      previousref.current.disabled = false
    }
    await axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=${i * 10}`).then((response) => {
      setPatientsList(response.data.data)
    })
    let nxt = Number(i) + 1

    setnxtoffset(nxt)
    if (i != 0) {
      let prev = i--
      setprevoffset(prev)
    }
    setLoading(false)
  }
  useEffect(() => {
    getAllPatients()
  }, [])
  useEffect(() => {
    getAllPatients()
  }, [patientsearch])

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
      }catch(e) {
        alert(e)
      }
    }
  }

  function confirmmessage(name,patientid) {
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
    date = date.split("-").reverse().join("-")
    return date
  }

  async function getnextpages(e) {
    getAllPatients(e.target.value)
  }
  async function getpreviouspages(e) {

    getAllPatients(e.target.value - 1)
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
      <div className="conatainer">
        <input className="form-control m-auto mt-2" placeholder="Search Patient By Name or Number" style={{ width: '30rem' }} onChange={(e) => { setpatientsearch(e.target.value); getAllPatients(); }} onBlur={getAllPatients} />
      </div>
      <div className="container-fluid p-0 m-0 scroll scroll-y " style={{ minHeight: '30rem' }}>
        <table className="table text-center p-0 m-0" >
          <thead>
            <tr>
              <th>Update</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Email</th>
              {/* <th>Address</th>
              <th>Location</th> */}
              <th>Pincode</th>
              <th>Phone Number</th>
              <th>Is Main Account</th>
              <th>Delete</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {
              Loading ? (
                <div className='text-burntumber fs-4 position-absolute start-0 end-0 top-5'>Loading Patient Info</div>
              ) : (
                PatientsList && PatientsList.length != 0 ? (
                  PatientsList.map((data, i) => (
                    <tr>
                      <td><button className="btn p-0 m-0" onClick={(e) => { settabindex(i); OpenUpdatePatient(i) }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} /></button>
                        {form == i ? (


                          <section id={i} className={`updatepatientform text-start position-absolute d-${tabindex == i ? updatepatient : 'none'} bg-seashell rounded-2 shadow`}>
                            <UpdatePatient index={i} getAllPatients={getAllPatients} CloseUpdatePatient={CloseUpdatePatient} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : 'N/A'} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                          </section>
                        ) : (<></>)
                        }

                      </td>
                      <td>{data.full_name ? data.full_name : 'N/A'}</td>
                      <td>{data.gender ? data.gender : 'N/A'}</td>
                      <td>{data.dob ? reversefunction(data.dob) : 'N/A'}</td>
                      <td>{data.email ? data.email : 'N/A'}</td>
                      {/* <td>{data.address.length != 0 ? data.address[0].address_line1 ? data.address[0].address_line1 : 'N/A' : ''}{data.address.length != 0 ? data.address[0].address_line2 ? ' | ' + data.address[0].address_line2 : '' : 'N/A'} </td>
                      <td>{data.location ? data.location : 'N/A'}</td> */}
                      <td>{data.pin_code ? data.pin_code : 'N/A'}</td>
                      <td>{data.phone_number ? data.phone_number : 'N/A'}</td>
                      <td>{data.parent ? ' No' : 'Yes'}</td>
                      <td><button className="btn p-0 m-0" onClick={(e) => { confirmmessage(data.full_name,data.id); }}><img src={process.env.PUBLIC_URL + "/images/delete.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                      <td><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                    </tr>
                  ))
                ) : (
                  <div className='text-burntumber fs-4 position-absolute start-0 end-0 top-5'>No patients found</div>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="container-fluid mb-1">
        <div className="d-flex text-center">
          <div className="col-4">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e) }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-4">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); getAllPatients(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-4">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
    </section>
  )



}

function Doctors() {
  const url = useContext(URL)
  const imagepath = 'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/doctor/'
  const nextref = useRef()
  const previousref = useRef()
  const [Doctorssearch, setDoctorssearch] = useState()
  const [Doctorslist,setDoctorslist] = useState([])
  const [nxtoffset,setnxtoffset] = useState(0)
  const [prevoffset,setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [tabindex, settabindex] = useState()
  const [form, setform] = useState()
  const [pageloading,setpageloading]=useState(false)
  const [updatedoctor, setupdatedoctor] = useState('none')

  async function getAllDoctors(i) {
    if (i == undefined) {
      i = 0
    }
    setpageloading(true)
    setDoctorslist()
    
    if (i == 0 || i == undefined || nxtoffset == 0) {
      previousref.current.disabled = true
    } else {
      previousref.current.disabled = false
    }
    await axios.get(`${url}/doctor/list?search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=${i * 10}`).then((response) => {
      setDoctorslist(response.data.data)
    })
    let nxt = Number(i) + 1

    setnxtoffset(nxt)
    if (i != 0) {
      let prev = i--
      setprevoffset(prev)
    }
    setpageloading(false)
  }
  useEffect(() => {
    getAllDoctors()
  }, [])
  useEffect(() => {
    getAllDoctors()
  }, [Doctorssearch])
console.log(Doctorslist)
async function getnextpages(e) {
  getAllDoctors(e.target.value)
}
async function getpreviouspages(e) {
  getAllDoctors(e.target.value - 1)
}
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
      <div className="conatainer">
        <input className="form-control m-auto mt-2" placeholder="Search Doctor" style={{ width: '30rem' }} onChange={(e) => { setDoctorssearch(e.target.value) }} />
      </div>
      <div className="container-fluid p-0 m-0 scroll scroll-y" style={{ height: '30rem' }}>
        <table className="table text-center p-0 m-0" >
          <thead>
            <tr>
              <th>Update</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Degree</th>
              <th>Mobile No.</th>
              <th>Email Id</th>
              <th>Procedures</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {
              pageloading ? (
                <div className='text-burntumber fs-4 position-absolute start-0 end-0 top-5'>Loading Doctors Info</div>
              ) : (
                Doctorslist && Doctorslist.length != 0 ? (
                  Doctorslist.map((data, i) => (
                    <tr onClick={() => console.log('clicked')}>
                      <td><button className="btn p-0 m-0" onClick={(e) => { settabindex(i); OpenUpdateDoctor(i) }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} /></button>
                        {form == i ? (
                          <section id={i} className={`scroll scroll-y position-absolute d-${tabindex == i ? updatedoctor : 'none'} bg-seashell rounded shadow top-0 bottom-2 `} style={{ marginLeft: '22.5rem', width: '40rem', height: '35rem' }}>
                            <UpdateDoctor index={i} CloseUpdateDoctor={CloseUpdateDoctor} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : 'N/A'} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                          </section>
                        ) : (<></>)
                        }

                      </td>
                      <td className="text-start">{data.image ? <img className="img-fluid rounded-5" style={{ width: '2rem' }} src={imagepath + data.image} /> : 'Image not found'}{' '}{data.doctor_name ? data.doctor_name : 'N/A'}</td>
                      <td>{data.speciality.name}</td>
                      <td>{data.degree_suffix ? data.degree_suffix : 'N/A'}</td>
                      <td>{data.phone_number ? data.phone_number : 'N/A'}</td>
                      <td>{data.email}</td>
                      <td><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/info.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                      <td><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                    </tr>
                  ))
                ) : (
                  <div className='text-burntumber fs-4 position-absolute start-0 end-0 top-5'>No Doctors found</div>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className="container-fluid mb-1">
          <div className="d-flex text-center">
            <div className="col-4">
              <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Previous</button>
            </div>
            <div className="col-4">
  
              {
                pages ? (
                  pages.map((page, i) => (
                    <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); getAllDoctors(i) }} key={i}>{page}</button>
                  ))
                ) : (
                  <div>Loading...</div>
                )
  
              }
            </div>
            <div className="col-4">
              <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Next</button>
            </div>
          </div>
        </div>
    </section>
  )
}


function DailySaleReport(props) {
  const Doctors = useContext(DoctorsList)
  const CurrentDate = useContext(TodayDate)
  const options = ['Appointments', 'Doctors', 'Pharmacy']
  const [menu, setmenu] = useState(0)
  const [type, settype] = useState('text')
  const [doctorid, setdoctorid] = useState()
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [clinic, setclinic] = useState()


  function ToggleOptions(_menu) {
    if (_menu == 0) {
      return <Appointments_Dsr doctorid={doctorid} fromdate={fromdate?fromdate:CurrentDate} todate={todate?todate:fromdate} clinic={clinic} />
    }
    if (_menu == 1) {
      return <Doctors_Dsr doctorid={doctorid} fromdate={fromdate?fromdate:CurrentDate} todate={todate?todate:fromdate} />
    }
    if (menu == 2) {
      return <Pharmacy_Dsr />
    }
    return <div>Nothing Selected</div>
  }


  return (

    <div className="DSRsection mt-3">
      <div className="p-0 m-0 mb-2">
        <div className="row p-0 m-0 options align-items-center">
          <div className="col-auto col-lg-auto me-lg-2 col-xl-4 col-md-12 col-md-4 p-0 m-0">
            {
              options.map((data, i) => (
                <button className={`button ms-1 button-${i == menu ? 'pearl' : 'charcoal'} shadow-${i == menu ? 'lg' : 'none'} border border-dark`} id={i} key={i} onClick={() => { setmenu(i) }}>{data}</button>
              ))
            }
          </div>
          <div className="col-5 col-lg-8 col-xl-7 col-md-12 p-0 m-0 mt-lg-0 mt-2 align-items-center  text-end">
            <div className="row p-0 m-0">
              <div className="col-auto col-xl-auto col-lg-4 col-md-4 p-0 m-0 text-end">
                <select className="px-1 bg-pearl text-burntumber py-2  py-md-1 text-center clinic ">
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
              </div>
              <div className="col-2 col-lg-auto col-xl-auto col-md-auto p-0 m-0 text-xl-start">
                <select className="bg-pearl text-center border-md-start-0 text-burntumber px-1 py-2 py-md-1 doctor" value={doctorid ? doctorid : ''} onChange={(e) => setdoctorid(e.target.value)}>
                  <option value='Doctors'>Doctor</option>
                  {
                    Doctors.map((data) => (
                      <option className="text-start" value={data[0]}>{data[0]}. Dr.{data[1]} </option>
                    ))
                  }
                </select>
              </div>
              <div className="col-auto col-xl-auto col-lg-4 col-4 col-md-3 Date p-0 m-0">
                <div className="d-flex p-0 m-0 text-center">
                  <input type='date' placeholder="from Date" value={fromdate?fromdate:''} className='bg-pearl px-1 fromdate' onChange={(e)=>setfromdate(e.target.value)} />
                  <div className="bg-pearl fromdate fw-bolder">-</div>
                  <input type='date' placeholder="to Date" disabled={fromdate?false:true} value={todate?todate:''} className='bg-pearl px-1 todate'onChange={(e)=>settodate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid page m-0 p-0 ">
        <div className="p-0 m-0">{ToggleOptions(menu)}</div>
      </div>
    </div>
  )
}


export { Navbar };
export { Doctorsection };
export { Appointments };
export { Pharmacy };
export { Patients };
export { Doctors };
export { DailySaleReport };
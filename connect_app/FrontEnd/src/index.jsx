//React 
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from "react";
import { createContext } from 'react'
import axios from "axios";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//Css
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './css/dashboard.css';
import './css/appointment.css';
import './css/pharmacy.css';
import './css/login.css';
import { Navbar, Doctorsection, Appointments, Patients, Doctors, Pharmacy, DailySaleReport } from './App'
import { WelcomeLoader } from './components/features/WelcomeLoader'
//Notiflix
import Notiflix from 'notiflix';
//Context Apis
const TodayDate = createContext();
const URL = createContext();
const DoctorsList = createContext();
const Doctorapi = createContext();
const TodayDocs = createContext();
const Vitals = createContext();
const Clinic = createContext();
function Connectapp(props) {
  const d = new Date();
  const date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  const monthcount = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const yearcount = d.getFullYear();
  var APIDate = `${yearcount}-${monthcount}-${date}`;
  const url = 'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect';
  const [isWelcomeLoading, setisWelcomeLoading] = useState(0)
  const [ConnectDoctorapi, setConnectDoctorapi] = useState([]);
  let Doctorarray = [];
  let TodayDoctors = [];
  const [Loading, setLoading] = useState(false);
  const [docapi, setdocapi] = useState([]);
  const [todayDoc, settodaydoc] = useState([]);
  let ClinicId = localStorage.getItem('ClinicId')
  const [clinicid, setclinicid] = useState();
  const [ischecked, setischecked] = useState()
  const [cliniclist, setcliniclist] = useState([])
  const [vitalslist, setvitalslist] = useState()

  async function Clinics() {
    await axios.get(`${url}/clinic/list`).then((response) => {
      setcliniclist(response.data.data)
    })
  }
  useEffect(() => {
    Clinics()
  }, [])

  async function VitalsList() {
    await axios.get(`${url}/vitals/list`).then((response) => {
      setvitalslist(response.data.data.vitals)
    })
  }
  useEffect(() => {
    VitalsList()
  }, [])


  async function fetchapi() {
    try {
      setLoading(true);
      await axios.get(`${url}/doctor/list?clinic_id=${ClinicId}&limit=30&offset=0`).then(function (response) {
        let tempArray = response.data.data;
        setConnectDoctorapi(tempArray)
        for (let i = 0; i < tempArray.length; i++) {
          Doctorarray.push([tempArray[i].id, tempArray[i].doctor_name, tempArray[i].clinic_id, []]);
          for (var j = 0; j < tempArray[i].month_timeslots.length; j++) {
            if (tempArray[i].month_timeslots[j].date === APIDate) {
              Doctorarray[i][3].push([[tempArray[i].month_timeslots[j].time_from], [tempArray[i].month_timeslots[j].booking_status], [tempArray[i].month_timeslots[j].id]])
            }
          }
        }
        for (var q = 0; q < Doctorarray.length; q++) {
          if (Doctorarray[q][3].length !== 0) {
            TodayDoctors.push(Doctorarray[q])
            settodaydoc(TodayDoctors)
          }
        }
        if (TodayDoctors.length === 0) {
          TodayDoctors.push(['0', 'No Doctors Found', ['No Time Slots Found'], ['null']]);
          settodaydoc(TodayDoctors);
        }
        setdocapi(Doctorarray);
      });
      setLoading(false);
      setisWelcomeLoading(1)
    } catch (e) {
      setisWelcomeLoading(1)
      Notiflix.Report.failure(
        `${e.message}`,
        'Please Check your Internet Connection and retry',
        'Retry', (() => {
          window.location.reload()
        })
      )
    }
  }

  useEffect(() => {
    fetchapi();
  }, [ClinicId])

  async function Gomain() {
    localStorage.setItem('ClinicId', clinicid)
    setisWelcomeLoading(0)
  }

  return (
    <>
      {
        isWelcomeLoading == 0 ? (
          <>
            <WelcomeLoader />
          </>
        ) : (
          ClinicId == 'null' ? (
            <div className='container w-50 text-center rounded shadow bg-seashell' style={{ marginTop: '10%' }}>
              <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt='image' className='img-fluid p-0 m-0' style={{ width: '10rem' }} />
              <h4>Select Clinic</h4>
              {
                cliniclist.map((data, i) => (
                  <>
                    <label><input type="checkbox" className="radio form me-1" checked={ischecked === i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
                    <br /></>
                ))
              }
              <button className='button button-burntumber pt-2' onClick={Gomain}>Submit</button>
            </div>
          ) : (
            <>

              <Doctorapi.Provider value={ConnectDoctorapi}>
                <DoctorsList.Provider value={docapi}>
                  <URL.Provider value={url}>
                    <Clinic.Provider value={cliniclist}>
                      <TodayDate.Provider value={APIDate}>
                        <TodayDocs.Provider value={todayDoc}>
                          <Vitals.Provider value={vitalslist}>
                            <Router>
                              <Navbar username={props.username} designation={props.designation} id={props.id} fetchapi={fetchapi} />
                              <Routes>
                                <Route path='/' element={<Doctorsection id={props.id} fetchapi={fetchapi} todayDoc={todayDoc} Loading={Loading} docapi={docapi} />} />
                                <Route path='/Appointments' element={<Appointments id={props.id} fetchapi={fetchapi} />} />
                                <Route path='/Patients' element={<Patients id={props.id} />} />
                                <Route path='/Doctors' element={<Doctors id={props.id} docapi={docapi} />} />
                                <Route path='/DailySaleReport' element={<DailySaleReport id={props.id} cliniclist={cliniclist} docapi={docapi} />} />
                                <Route path='/Pharmacy' element={<Pharmacy id={props.id} />} />
                              </Routes>
                            </Router>
                          </Vitals.Provider>
                        </TodayDocs.Provider>
                      </TodayDate.Provider>
                    </Clinic.Provider>
                  </URL.Provider>
                </DoctorsList.Provider>
              </Doctorapi.Provider>

            </>
          ))
      }
    </>
  );
}
export { TodayDate, URL, DoctorsList, Doctorapi, TodayDocs, Vitals, Clinic };


function Switchpage() {
  // const [auth, setauth] = useState(true);
  const [email, setemail] = useState('flex');
  const [next, setnext] = useState('none');
  const [password, setpassword] = useState('none');
  const [passvisibility, setpassvisibility] = useState('password');
  const [load, setload] = useState()
  const topassword = () => {
    setpassword('flex');
    setemail('none');
  }
  const toemail = () => {
    setpassword('none');
    setemail('flex');
  }
  const passwordvisibility = () => {
    if (passvisibility === 'password') {
      setpassvisibility('text');
    }
    if (passvisibility === 'text') {
      setpassvisibility('password');
    }
  }

  const [logininput, setlogininput] = useState({
    email: '',
    password: ''
  })
  function handleinput(e) {
    const logindata = { ...logininput };
    logindata[e.target.id] = e.target.value;
    setlogininput(logindata);
  }
  const localemail = localStorage.getItem("email");
  async function Submit() {
    setload(true)
    await axios.post('https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/login', {
      email: localemail || logininput.email,
      password: logininput.password
    }).then((response) => {
      setload(false)
      if (response.data.status === true) {
        localStorage.setItem('email', logininput.email);
        localStorage.setItem('name', response.data.data.name);
        localStorage.setItem('designation', response.data.data.roles.title);
        localStorage.setItem('id', response.data.data.id);
        localStorage.setItem('ClinicId', response.data.data.clinic_id)
        window.location.reload(true);
      } else {
        Notiflix.Report.failure(
          'Invalid Credentials',
          'Check your username password and try again',
          'Retry',
        )
        setload(false)
      }

    })
  }
  if (localemail !== null && localemail !== '') {
    return <Connectapp username={localStorage.getItem('name')} designation={localStorage.getItem('designation')} id={localStorage.getItem('id')} />
  } else {
    <>
      <div className='container-fluid loginform'>
        <div className="navbar mb-5 justify-content-end">
          <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt='' className="float-end img-fluid col-lg-1 col-3 me-lg-5 me-2" />
        </div>


        <section className="signinsection mb-5">
          <div className="container rounded py-5 bg-light bg-opacity-75">
            <div className="col-5 m-auto position-relative pb-2">
              <p className="text-center mt-2 m-auto col-6" id="text1"><img src={process.env.PUBLIC_URL + "/images/slogan1.png"} alt='' className="img-fluid" /></p>
              <p className="text-center mt-2 position-absolute col-6" id="text2"><img src={process.env.PUBLIC_URL + "/images/slogan2.png"} alt='' className="img-fluid" /></p>
            </div>

            <form autoComplete="off" onSubmit={(e) => Submit(e)}>
              <div className="mt-4">
                <div className={`row d-${email} justify-content-center mb-4`} id="userinput">
                  <div className="col-1"></div>
                  <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                    <p className="m-0 ms-1" id="inputheading">Enter your Aartas Email ID</p>
                    <input type="email" className="form-control" id="email" placeholder="example@aartas.com" value={logininput.email} autoComplete="false" onChange={(e) => { handleinput(e); if (e.target.value !== '') { setnext('block'); } if (e.target.value === '') { setnext('none'); } }} />
                  </div>
                  <div className={`col-lg-1 d-flex  col-2 align-items-center`}>
                    <a href='/#' className={`next d-${next} text-decoration-none text-center p-2 rounded`} id="next" onClick={topassword}>Next</a>
                  </div>

                </div>
                <div className={`row d-${password} justify-content-center`} id="passinput">
                  <div className="col-lg-1 col-2 col-md-1 align-items-center d-flex">
                    <a href='/#' className="back text-decoration-none text-center p-2 rounded" onClick={toemail}>Back</a>
                  </div>
                  <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                    <p className="m-0" id="inputheading">Enter your Password</p>
                    <input type={passvisibility} className="form-control" id="password" placeholder="examplepassword123" autoComplete="new-password" onChange={(e) => handleinput(e)} value={logininput.password} />
                  </div>
                  <div className="col-1 align-items-center justify-content-center d-flex">
                    <button type="button" className=" p-2 rounded submit text-center" onClick={Submit}>Submit</button>
                  </div>


                  <div className="col-12">
                    <div className="col text-center">
                      <input className="form-check-input" onClick={passwordvisibility} type="checkbox" value="" id="flexCheckDefault" />
                      <label className="form-check-label" htmlFor="flexCheckDefault">Check Password</label>
                    </div>
                  </div>
                  <div className="col-5 text-center"><a href="/#" className="text-decoration-none">forgot password</a></div>

                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  }
  return (
    <>
      <div className='container-fluid loginform'>
        <div className="navbar mb-5 justify-content-end">
          <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt='image' className="float-end img-fluid col-lg-1 col-3 me-lg-5 me-2" />
        </div>


        <section className="signinsection mb-5">
          <div className="container rounded py-5 bg-light bg-opacity-75">
            <div className="col-5 m-auto position-relative pb-2">
              <p className="text-center mt-2 m-auto col-6" id="text1"><img src={process.env.PUBLIC_URL + "/images/slogan1.png"} alt='image' className="img-fluid" /></p>
              <p className="text-center mt-2 position-absolute col-6" id="text2"><img src={process.env.PUBLIC_URL + "/images/slogan2.png"} className="img-fluid" /></p>
            </div>

            <form autoComplete="off" onSubmit={(e) => Submit(e)}>
              <div className="mt-4">
                <div className={`row d-${email} justify-content-center mb-4`} id="userinput">
                  <div className="col-1"></div>
                  <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                    <p className="m-0 ms-1" id="inputheading">Enter your Aartas Email ID</p>
                    <input type="email" className="form-control" id="email" placeholder="example@aartas.com" value={logininput.email} autoComplete="false" onChange={(e) => { handleinput(e); if (e.target.value != '') { setnext('block'); } if (e.target.value == '') { setnext('none'); } }} />
                  </div>
                  <div className={`col-lg-1 d-flex  col-2 align-items-center`}>
                    <a className={`next d-${next} text-decoration-none text-center p-2 rounded`} id="next" onClick={topassword}>Next</a>
                  </div>

                </div>
                <div className={`row d-${password} justify-content-center`} id="passinput">
                  <div className="col-lg-1 col-2 col-md-1 align-items-center d-flex">
                    <a className="back text-decoration-none text-center p-2 rounded" onClick={toemail}>Back</a>
                  </div>
                  {
                    load ? (
                      <div className="col-lg-6 col-md-8 col-sm-10 col-10 py-1 pb-1 userinput text-center">
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>) : (
                      <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                        <p className="m-0" id="inputheading">Enter your Password</p>
                        <input type={passvisibility} className="form-control" id="password" placeholder="examplepassword123" autoComplete="new-password" onChange={(e) => handleinput(e)} value={logininput.password} />
                      </div>
                    )
                  }
                  <div className="col-1 align-items-center justify-content-center d-flex">
                    <button type="button" className=" p-2 rounded submit text-center" disabled={load == true ? true : false} onClick={Submit}>Submit</button>
                  </div>


                  <div className="col-12">
                    <div className="col text-center">
                      <input className="form-check-input" onClick={passwordvisibility} type="checkbox" value="" id="flexCheckDefault" />
                      <label className="form-check-label" htmlFor="flexCheckDefault">Check Password</label>
                    </div>
                  </div>
                  <div className="col-5 text-center"><a href="#" className="text-decoration-none">forgot password</a></div>

                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  )
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Switchpage />
);
// ReactDOM.render(<Switchpage />, document.getElementById("root"));


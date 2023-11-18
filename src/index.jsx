//React
import React, { Suspense, useContext } from "react";
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { lazy } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { timer_notify } from "./components/features/timer_notify";
import { timeout_notification } from "./components/features/timeout_notifications";
import { QueryClientProvider,QueryClient, useQuery } from "react-query";
//css
import "./css/dashboard.css";
import "./css/appointment.css";
import "./css/pharmacy.css";
import "./css/login.css";
import { WelcomeLoader } from "./components/features/WelcomeLoader";
//Notiflix
import Notiflix from "notiflix";
import IdleTimer from "./components/features/InactiveLogout";
const OpeningStock= lazy(()=> import('./components/Reports/pharmacy/openingstock'));
const StockReport = lazy(()=> import('./components/Reports/pharmacy/stockreport'));
const StockReport_By_Name = lazy(()=> import('./components/Reports/pharmacy/stockreport_by_name'))
const StockValuation = lazy(()=> import('./components/Reports/pharmacy/stockvaluation'))
// import Navbar from './components/App/Navbar'
const Doctorsection = lazy(() => import("./components/App/Clinic"));
const Navbar = lazy(() => import("./components/App/Navbar"));
const Appointments = lazy(() => import("./components/App/Appointments"));
const Patients = lazy(() => import("./components/App/Patients"));
const Doctors = lazy(() => import("./components/App/Doctors"));
const DailySaleReport = lazy(() => import("./components/App/DSR"));
const Pharmacy = lazy(() => import("./components/App/Pharmacy"));
const Reports = lazy(() => import("./components/App/Report"));
const Camera = lazy(()=>import("./components/features/camera"))
// import Appointments from './components/App/Clinic'
setInterval(timeout_notification,60000)

//Context Apis
const TodayDate = createContext();
const URL = createContext();
const DoctorsList = createContext();
const Doctorapi = createContext();
const TodayDocs = createContext();
const Vitals = createContext();
const Clinic = createContext();
const Permissions = createContext();
const Fetch_function = createContext()


const queryClient = new QueryClient()

function Connectapp(props) {

  const d = new Date();
  const date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  const monthcount = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const yearcount = d.getFullYear();
  var APIDate = `${yearcount}-${monthcount}-${date}`;
  const url = "https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect";
  const [isWelcomeLoading, setisWelcomeLoading] = useState(0);
  const [ConnectDoctorapi, setConnectDoctorapi] = useState([]);
  let Doctorarray = [];
  let TodayDoctors = [];
  const [Loading, setLoading] = useState(false);
  const [docapi, setdocapi] = useState([]);
  const [todayDoc, settodaydoc] = useState([]);
  let ClinicId = localStorage.getItem("ClinicId");
  const [clinicid, setclinicid] = useState();
  const [ischecked, setischecked] = useState();
  const [cliniclist, setcliniclist] = useState([]);
  const [vitalslist, setvitalslist] = useState();
  const [path, setpath] = useState();

  async function Clinics() {
    await axios.get(`${url}/clinic/list`).then((response) => {
      setcliniclist(response.data.data);  
    });
  }
  useEffect(() => {
    Clinics();
  }, []);

  async function VitalsList() {
    await axios.get(`${url}/vitals/list`).then((response) => {
      setvitalslist(response.data.data.vitals);
    });
  }
  useEffect(() => {
    VitalsList();
  }, [])

  async function fetchapi() {
    try {
      setLoading(true);
      await axios.get(`${url}/doctor/list?clinic_id=${ClinicId}&limit=100&offset=0`).then(function (response) {
        let tempArray = response.data.data.doctor_list;
        setConnectDoctorapi(tempArray);
        for (let i = 0; i < tempArray.length; i++) {
          Doctorarray.push([
            tempArray[i].id,
            tempArray[i].doctor_name,
            tempArray[i].clinic_id,
            [],
          ]);
          for (var j = 0; j < tempArray[i].month_timeslots.length; j++) {
            if (tempArray[i].month_timeslots[j].date === APIDate && tempArray[i].month_timeslots[j].clinic_id==ClinicId) {
              Doctorarray[i][3].push([
                [tempArray[i].month_timeslots[j].time_from],
                [tempArray[i].month_timeslots[j].booking_status],
                [tempArray[i].month_timeslots[j].id],
              ])
            }
          }
        }
        for (var q = 0; q < Doctorarray.length; q++) {
          if (Doctorarray[q][3].length !== 0) {
            TodayDoctors.push(Doctorarray[q]);
            settodaydoc(TodayDoctors);
          }
        }
        if (TodayDoctors.length === 0) {
          TodayDoctors.push([
            "0",
            "No Doctors Found",
            ["No Time Slots Found"],
            ["null"],
          ]);
          settodaydoc(TodayDoctors);
        }
        setdocapi(Doctorarray);
      });
      setLoading(false);
      setisWelcomeLoading(1);
    } catch (e) {
      setisWelcomeLoading(1);
      Notiflix.Report.failure(
        `${e.message}`,
        "Please Check your Internet Connection and retry",
        "Retry",
        () => {
          window.location.reload();
        }
      );
    }
    return Doctorarray
  }
  async function fetch_Doc_data() {
    try {
      await axios.get(`${url}/doctor/list?clinic_id=${ClinicId}&limit=100&offset=0`).then(function (response) {
        let tempArray = response.data.data.doctor_list;
        setConnectDoctorapi(tempArray);
      });
    } catch (e) {
      Notiflix.Report.failure(
        `${e.message}`, 
        "Please Check your Internet Connection and retry",
        "Retry",
        () => {
          window.location.reload();
        }
      );
    }
  }
  useEffect(() => {
      fetchapi();
  }, [])

  async function Gomain() {
    localStorage.setItem("ClinicId", clinicid);
    setisWelcomeLoading(0);
  }
  const [appointment_data,setappointment_data] = useState([])

  const get_appointment_data  = (data)=>{
    setappointment_data(data)
  }
  useEffect(()=>{
    get_appointment_data()
  },[])
// const isProduction = process.env.NODE_ENV === 'production';
  // const basename = isProduction ? 'https://aartas-connect.azurewebsites.net/' : '';
  
  return isWelcomeLoading == 0 ? (
    <>
      <WelcomeLoader />
    </>
  ) : ClinicId == "null" ? (
    <div className="position-relative">
      <div className="bg_a">
        <img src={process.env.PUBLIC_URL + "/images/a.png"} alt="image" className="img-fluid bg_a" />
      </div>
      <div className=" Clinicslist position-absolute top-0 start-0 end-0 text-charcoal">
        {/* <img src={process.env.PUBLIC_URL + "/images/logo.png"} alt='image' className='img-fluid logo p-0 m-0 start-0 top-0' /> */}
        <h1 className="fs-2 ms-3 p-2">aartas | Connect App</h1>
        <h4 className="">Select Clinic</h4>
        <div className="container-fluid clinics">
          <div className="row p-0 m-0 ">
            <div className="col-lg-10 col-12">
              {
                cliniclist.map((data, i) => (
                  <div div className="text-start mx-auto">
                    <label className="">
                      <input type="checkbox" className="radio form-check-input me-1" checked={ischecked === i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} />{" "} {data.title} {data.address} </label>
                    <br/>
                  </div>
                ))
                }
            </div>
            <div className="col-lg-2 col-12 mt-lg-0 mt-md-3 mt-sm-0 mt-2 ">
              <button className="btn button-seashell" disabled={clinicid == undefined ? true : false} onClick={Gomain} >
                <img className="img-fluid" style={{ width: "1.5rem" }} src={process.env.PUBLIC_URL + "/images/right-arrow.png"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>

    <Fetch_function.Provider value={fetch_Doc_data}>
      <Permissions.Provider value={props.permissions}>
        <Doctorapi.Provider value={ConnectDoctorapi}>
          <DoctorsList.Provider value={docapi}>
            <URL.Provider value={url}>
              <Clinic.Provider value={cliniclist}>
                <TodayDate.Provider value={APIDate}>
                  <TodayDocs.Provider value={todayDoc}>
                    <Vitals.Provider value={vitalslist}>  
                      <Router basename={process.env.PUBLIC_URL}>
                        <Navbar path={path} logout={props.logout} permissions={props.permissions} username={props.username} designation={props.designation} id={props.id} fetchapi={fetchapi} />
                        <Suspense fallback={<div className="text-charcoal75 fs-6 fw-bold text-center"> {" "} loading..{" "} </div>} >
                          <Routes>
                            <Route path="/" onChange={() => setpath("/")} element={<Doctorsection id={props.id} fetchapi={fetchapi} todayDoc={todayDoc} get_appointment_data={get_appointment_data} appointment_data={appointment_data} Loading={Loading} docapi={docapi} />} />
                            <Route path="/Appointments" onChange={() => setpath("Appointments")} element={<Appointments id={props.id} fetchapi={fetchapi} />} />
                            <Route path="/Patients" onChange={() => setpath("/Patients")} element={<Patients id={props.id} />} />
                            <Route path="/Doctors" onChange={() => setpath("/Doctors")} element={<Doctors id={props.id} docapi={docapi} />} />
                            <Route path="/DailySaleReport" onChange={() => setpath("/DailySaleReport")} element={<DailySaleReport id={props.id} cliniclist={cliniclist} docapi={docapi} />} />
                            <Route path="/Pharmacy" onChange={() => setpath("/Pharmacy")} element={<Pharmacy id={props.id} />} />
                            <Route path="/Reports" onChange={() => setpath("/Reports")} element={<Reports id={props.id} />} />
                            <Route path ="/Reports/stock_report" element={<StockReport id={props.id}/>}/>
                            <Route path="/Reports/stock_report_by_name" element={<StockReport_By_Name id={props.id}/>}/>
                            <Route path="/Reports/stock_valuation" element={<StockValuation id={props.id}/>}/>
                            <Route path ="/Reports/opening_stock" element={<OpeningStock id={props.id}/>}/>
                            <Route path ='/scan/prescription' element = {<Camera/>}/>
                            {/* <Route path='/Files' element={<Exports id={props.id} />} /> */}
                          </Routes>
                        </Suspense>
                      </Router>
                    </Vitals.Provider>
                  </TodayDocs.Provider>
                </TodayDate.Provider>
              </Clinic.Provider>
            </URL.Provider>
          </DoctorsList.Provider>
        </Doctorapi.Provider>
      </Permissions.Provider>
      </Fetch_function.Provider>
    </>
  );
}

function Switchpage() {
  const [email, setemail] = useState("flex");
  const [next, setnext] = useState("none");
  const [password, setpassword] = useState("none");
  const [passvisibility, setpassvisibility] = useState("password");
  const [load, setload] = useState();
  const [permissions, setpermissions] = useState([]);
  const [roleId, setroleId] = useState();

  const topassword = () => {
    setpassword("flex");
    setemail("none");
  };
  const toemail = () => {
    setpassword("none");
    setemail("flex");
  };
  const passwordvisibility = () => {
    if (passvisibility === "password") {
      setpassvisibility("text");
    }
    if (passvisibility === "text") {
      setpassvisibility("password");
    }
  };
  const [logininput, setlogininput] = useState({
    email: "",
    password: "",
  });
  function handleinput(e) {
    const logindata = { ...logininput };
    logindata[e.target.id] = e.target.value;
    setlogininput(logindata);
  }
  const localemail = localStorage.getItem("email");

  async function Submit() {
    try{
      setroleId();
      setload(true);
      await axios.post(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/login`, { email: localemail || logininput.email, password: logininput.password, } )
        .then((response) => {
          setload(false);
          if (response.data.status === true) {
            localStorage.setItem("email", logininput.email);
            localStorage.setItem("name", response.data.data.name);
            localStorage.setItem("designation", response.data.data.roles.title);
            localStorage.setItem("id", response.data.data.id);
            localStorage.setItem("ClinicId", response.data.data.clinic_id);
            localStorage.setItem("roleId", response.data.data.roles.id);
            setroleId();
            Changepage();
          } else {
            Notiflix.Report.failure(
              "Invalid Credentials",
              "Check your username password and try again",
              "Retry"
            );
            setload(false);
          }
        })
    }catch(e){
      setload(false)
      Notiflix.Report.failure(
       `${e.message}`,
        "Check Internet Connection and try again",
        "Retry"
      );
    }

  }
  let role = localStorage.getItem("roleId");
  async function Permissions() {
    await axios.post(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/role/permissions/list`, { role_id: role ? role : 1, }).then((response) => {
        if (response.data.status === true) {
          setpermissions(response.data.data.permissions);
          Changepage();
          // window.location.reload(true);
        } else {
          Notiflix.Report.failure(
            "Invalid Credentials",
            "Check your username password and try again",
            "Retry"
          );
        }
      });
  }
  useEffect(() => {
    Permissions();
  }, [role]);
  function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("designation");
    localStorage.removeItem("ClinicId");
    localStorage.removeItem("roleId");
    window.location.reload()
  }

  const [isTimeout, setIsTimeout] = useState(false);
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 1800, //expire after 30 mins
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        logout();
        setIsTimeout(true);
      },
    });

    return () => {
      timer.cleanUp();
    };
  }, [isTimeout]);

  let expired = localStorage.getItem("_expiredTime");
  useEffect(() => {
    Changepage();
  }, [expired == undefined]);

  function Changepage() {
    if (localemail !== null && localemail !== "") {
      const Username = localStorage.getItem("name");
      const Designation = localStorage.getItem("designation");
      const Id = localStorage.getItem("id");
      return (
        <QueryClientProvider client={queryClient}>
        <Connectapp logout={logout} username={Username} designation={Designation} id={Id} permissions={permissions} />
        </QueryClientProvider>
      );
    } else {
      return (
        <div className="loginform p-0 m-0">
          <section className="signinsection">
            <div className=" p-0 m-0 formsection ">
              <h4 className="text-center text-charcoal fw-semibold mb-4"> Login to Aartas </h4>
              <form autoComplete="off" onSubmit={(e) => Submit(e)}>
                <div className="">
                  <div className={`row d-${email} justify-content-center p-0 m-0`} id="userinput" >
                    <div className="col-1"></div>
                    <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                      <p className="m-0 ms-1" id="inputheading"> Enter your Aartas Email ID </p>
                      <input type="email" className="form-control bg-seashell" id="email" placeholder="example@aartas.com" value={logininput.email} autoComplete="false" onChange={(e) => { handleinput(e); if (e.target.value != "") { setnext("block"); } if (e.target.value == "") { setnext("none"); } }} />
                    </div>
                    <div className={`col-lg-1 d-flex  col-2 align-items-center`} >
                      <a className={`next d-${next} text-decoration-none text-center text-charcoal p-2 rounded`} id="next" onClick={topassword} > Next </a>
                    </div>
                  </div>
                  <div className={`row d-${password} justify-content-center`} id="passinput" >
                    <div className="col-lg-1 col-2 col-md-1 align-items-center d-flex">
                      <a className="back text-decoration-none text-center p-lg-2 p-md-2 p-1 rounded" onClick={toemail} > Back </a>
                    </div>
                    {
                      load ? (
                        <div className="col-lg-6 col-md-8 col-sm-10 col-10 py-1 pb-1 userinput text-center">
                          <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="col-lg-6 col-md-8 col-sm-10 col-10 align-items-center d-flex userinput">
                          <p className="m-0" id="inputheading"> Enter your Password </p>
                          <input type={passvisibility} className="form-control bg-seashell" id="password" placeholder="examplepassword123" autoComplete="new-password" onChange={(e) => handleinput(e)} value={logininput.password} />
                        </div>
                      )}
                    <div className="col-1 align-items-center justify-content-center d-flex">
                      <button type="button" className=" p-lg-2 p-md-2 p-1 rounded submit text-center" disabled={load == true ? true : false} onClick={Submit} > Submit </button>
                    </div>
                    <div className="col-12 p-0 m-0">
                      <div className="col text-center">
                        <input className="form-check-input" onClick={passwordvisibility} type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label ms-2 text-charcoal" htmlFor="flexCheckDefault" > Check Password </label>
                      </div>
                    </div>
                    <div className="col-5 text-center d-none">
                      <a href="#" className="text-decoration-none"> forgot password </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      );
    }
  }

  return Changepage();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Switchpage />);
// ReactDOM.render(<Switchpage />, document.getElementById("root"));

export { TodayDate, URL, DoctorsList, Doctorapi, TodayDocs, Vitals, Clinic, Permissions,Fetch_function };

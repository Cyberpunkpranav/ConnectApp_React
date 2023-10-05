import React from 'react'
import { Link } from "react-router-dom"
import { useState, useEffect, useContext, createContext } from "react";
// import { w3cwebsocket as websocket } from 'websocket'
import { Timecard, DoctorSchedule } from '../Today/Doctor'
//Context APIs
import { Permissions } from '../../index'
//Components
import { AddDoctorSlot } from '../Today/AddDoctorSlot'
//css
import '../../css/dashboard.css'

const DOCTORNAME = createContext()
const DOCTORID = createContext()
function Doctorsection(props) {
  const permission = useContext(Permissions)
  const [Docval, setDocval] = useState(0)
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
  const doctor_wise_appointment_count= (doc_id)=>{
    let appointments = []
    if(props.appointment_data !=undefined){
      for(let j=0;j<props.appointment_data.length;j++){
        if(doc_id== props.appointment_data[j].doctor_id){
          appointments.push( props.appointment_data[j])
        }
  }
}
  return appointments.length
}
  return (
    <>
      <div className="container-fluid doctorsection p-0 m-0 mt-1 ps-1 scroll">
        <div className=" hstack gap-3 d-flex p-0 m-0 py-1 ps-1 align-items-center">
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
                    <button key={i} className={` button rounded-1 p-0 m-0 py-1 px-3 btn-sm col-auto shadow-none text-${i === Doctor ? 'light' : 'charcoal75 fw-bolder'} button-${i === Doctor ? "charcoal" : "pearl"} border-${i === Doctor ? 'secondary' : 'none'}`}
                      style={{ fontSize: '0.9rem' }}
                      autoFocus={i === Doctor ? true : false}
                      onFocus={() => { setDoctorID(data[0]); setDoctorName(data[1]); setDocClinic(data[2]) }}
                      value={`${data[0]}.${data[1]}`} onClick={(a) => { setDoctor(i); setDoctorID(data[0]); setDoctorName(data[1]); }}>{`Dr. ${data[1]}`}<span className='ms-2 px-1 text-lightyellow '>{doctor_wise_appointment_count(data[0])}</span> </button>
                  </div>
                  <div className='vr rounded-1 h-75 align-self-center' style={{ padding: '0.8px' }}></div>
                </>
              ))
            )}
          <div className='col-auto'>
            <button className={`btn bg-transparent border-0 `} id="adddoctorbtn" onClick={toggledoctorform} >
              <img src={process.env.PUBLIC_URL + "/images/addicon.png"} alt="displaying_image" />
            </button>
          </div>
        </div>

      </div>
      <section className="patientsection p-0 m-0 ps-1 position-relative">
        {
          props.Loading ? (
            <div className="container-fliud pt-3">
                <div className="d-flex fs-2 align-items-center justify-content-around">
                  <strong className="text-charcoal">Please Wait...</strong>
                  <div className="text-burntumber spinner-border ml-auto" role="status" aria-hidden="true" ></div>
                </div>
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
{/* 
                    DoctorID={DoctorID} DoctorName={DoctorName} */}

                      <DOCTORNAME.Provider value={DoctorName}>
                        <DOCTORID.Provider value={DoctorID}>
                      <DoctorSchedule todayDoc={props.todayDoc} DoctorID={DoctorID} DoctorName={DoctorName}  _selected={Doctor} fetchapi={props.fetchapi} DocClinic={DocClinic} get_appointment_data={props.get_appointment_data}   />
                        </DOCTORID.Provider>    
                      </DOCTORNAME.Provider>
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
                    <DOCTORNAME.Provider value={DoctorName}>
                        <DOCTORID.Provider value={DoctorID}>
            <AddDoctorSlot toggledoctorform={toggledoctorform} staticBackdrop4={'staticBackdrop4'} fetchapi={props.fetchapi} />
            </DOCTORID.Provider>    
            </DOCTORNAME.Provider>
          </div>
        ) : (
          <></>
        )
      }

    </>
  );

}
export default Doctorsection
export { DOCTORNAME, DOCTORID }
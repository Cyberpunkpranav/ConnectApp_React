import React from 'react'
import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
// import { w3cwebsocket as websocket } from 'websocket'
import {Timecard,DoctorSchedule} from '../Today/Doctor'
//Context APIs
import { Permissions } from '../../index'
//Components
import { AddDoctorSlot } from '../Today/AddDoctorSlot'




function Doctorsection(props) {
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
    console.log(  props.todayDoc)
    return (
      <>
        <div className="container-fluid doctorsection p-0 m-0 mt-1 ps-1 scroll">
          {/* <div className="container-fluid p-0 m-0 my-2">
            <div className="row m-0 p-0 align-items-center">
              <span className='col-auto livetime text-charcoal fw-bold' style={{ fontSize: '1rem' }}>{currentDate}</span>
              <div className=' col-auto vr align-self-center h-75' style={{ padding: '0.8px' }}></div>
              <span className='col-auto livetime2' style={{ fontSize: '1rem' }}><Timer /></span>
            </div>
          </div> */}
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
                        value={`${data[0]}.${data[1]}`} onClick={(a) => { setDoctor(i); }}>{`Dr. ${data[1]}`} </button>
                    </div>
                    <div className='vr rounded-1 h-75 align-self-center' style={{ padding: '0.8px' }}></div>
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
        <section className="patientsection p-0 m-0 ps-1 position-relative">
          {
            props.Loading ? (
              <div className=" position-absolute start-0 ms-2 end-0 m-auto loader ">
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
  export default Doctorsection
import React from 'react'
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
// import { w3cwebsocket as websocket } from 'websocket'

//Context APIs
import { Permissions } from '../../index'
//Components
import { SearchField } from '../features/SearchField'
import { AddPatient } from '../Today/AddPatient'
import { AddDoctorSlot } from '../Today/AddDoctorSlot'
import { AddAppointment } from '../Today/AddAppointment'



function Navbar(props) {
    //Use States
    const [patientform, setpatientform] = useState("none");
    const [appointmentform, setappointmentform] = useState("none");
    const [doctorform, setdoctorform] = useState("none");
    const [Docval, setDocval] = useState()
    const [highlighticon, sethighlighticon] = useState()

    const location = useLocation()
    const togglepatientform = () => {
        if (patientform === "none") {
            setpatientform("block");
        } else if (patientform === "block") {
            setpatientform("none");
        }
    };


    const toggleappointmentform = () => {
        if (appointmentform === "none") {
            setappointmentform("block");
        } else if (appointmentform === "block") {
            setappointmentform("none");
        }
    };

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


    ]

    //Searchfield input
    const [searchtext, setsearchtext] = useState()
    // onClick={togglelogoutbtn}
    // d-${props.logoutbtn} 
    return (
        <>
            <div className="navsection p-0 m-0 py-1">
                <div className="container-fluid p-0 m-0 ">
                    <div className="row m-0 p-0 justify-content-lg-between justify-content-md-between justify-content-sm-between justify-content-between align-items-center">
                        <div className="col-lg-auto col-xl-auto col-md-auto col-sm-auto col-auto p-0 m-0 ms-2 text-start dropdown">
                            <button className="button dropdown-toggle button-seashell shadow-none d-inline-block col-md-auto col-auto user position-relative p-0 m-0 ms-2" data-bs-toggle="dropdown" aria-expanded="false">
                                <h1 className="m-0 username text-decoration-none  text-start fw-bold"> {props.username} </h1>
                                <div className="m-0 userstatus text-decoration-none text-start text-burntumber fw-bold" >{props.designation} </div>
                                <ul class="dropdown-menu p-0 m-0">
                                    <li class="dropdown-item p-0 m-0 bg-lightred50 text-center " onClick={props.logout}><button className='btn p-0 m-0 text-burntumber fw-bold py-1'>Logout</button></li>
                                </ul>
                            </button>
                        </div>
                        <div className="col-lg-auto col-xl-7 align-self-center col-sm-auto col-md-auto col-12 p-0 m-0 menu order-2 order-xl-0 order-sm-0 order-md-0 mt-lg-0 mt-md-0 md-sm-0">
                            <div className="row p-0 m-0 justify-content-sm-center justify-content-evenly">
                                {
                                    NavbarIcons.map((data, i) => (
                                        <div className={`col-auto p-0 m-0 align-self-end d-${data.display == 1 ? '' : 'none'} `} onClick={() => sethighlighticon(data.path)}>
                                            <Link to={data.path} className="text-decoration-none"> <div className="text-center"> <img src={process.env.PUBLIC_URL + data.image} alt="displaying_image" className={`img-fluid rounded-1 p-2 bg-${location.pathname === data.path ? 'burntumber25' : 'seashell'}`}
                                                style={{ width: `1.2rem`, boxSizing: 'content-box' }} /></div>
                                                <p className="col-12 m-0 p-0 px-2 text-center fw-bold text-charcoal">{data.title}</p></Link>
                                        </div>

                                    ))
                                }

                            </div>
                        </div>
                        {/* className="col-lg-2 col-xl-2 col-md-2 col-sm-6 col-6 mt-sm-2  search text-center position-relative" */}
                        <div className="col-lg-auto col-xl-2 col-md-auto col-8 col-sm-auto text-center align-self-center position-relative p-0 m-0 order-sm-2 order-md-1 order-1 ">
                            <div className="row p-0 m-0 align-items-center justify-content-md-start justify-content-center">
                                <div className="col-sm-auto col-xl-8 col-lg-8 col-md-8 me-1 col-7 p-0 m-0 position-relative " style={{ zIndex: '3' }} >

                                    <input type="text" className=" rounded-1 text-charcoal w-100 bg-charcoal25 positon-relative border border-1 text-start py-sm-1 ps-2 py-1 fw-bold" onBlur={() => { setsearchtext('') }} placeholder="search" onChange={(e) => setsearchtext(e.target.value)} />
                                    <div className="position-absolute bg-pearl start-0 shadow mt-1 rounded-1 border border-1">
                                        <SearchField searchtext={searchtext} fetchapi={props.fetchapi} />
                                    </div>
                                </div>
                                {/* col-xl-2 col-md-auto col-sm-auto col-6  */}
                                <div className={`col-auto p-0 m-0 dropdown text-decoration-none me-sm-1 d-${props.permissions.patient_add == undefined && props.permissions.doctor_add == undefined && props.permissions.appointment_add == undefined ? 'none' : ''}`}>
                                    <button className="button p-0 m-0 px-2 pe-2 py-1 button-burntumber dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {/* <span className="mx-1 pe-1 ">+</span> */}
                                        + Add
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button className={`dropdown-item border-bottom d-${props.permissions.patient_add == 1 ? '' : 'none'}`} onClick={() => { togglepatientform() }}>+ Patient</button></li>
                                        <li className={`d-${props.permissions.appointment_add == 1 ? '' : 'none'}`}><button className="dropdown-item border-bottom" onClick={() => { toggleappointmentform() }}>+ Appointment</button></li>
                                        <li><button className={`dropdown-item  `} onClick={() => { toggledoctorform() }}>+ Doctor</button></li>
                                    </ul>
                                </div>

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
            <div className="bg-lightgreen border border-1 rounded-1 overflow-scroll" style={{ maxHeight: '15rem' }}>
              {
                chatarr.flat().map((data) => (
                  <div className="text-end me-2">{data}</div>
                ))}</div>
            <button className="btn btn-close" onClick={() => { openchat == 'none' ? setopenchat('block') : setopenchat('none') }}></button>
            <input className="bg-seashell rounded-1 border border-1" ref={chatinputref} onBlur={(e) => { setchat(e.target.value) }} />
            <button className="btn p-0 m-0" onClick={sendmessage}><img src={process.env.PUBLIC_URL + 'images/completed.png'} style={{ width: '1.8rem' }} /></button>
          </div>
  
        </div> */}
        </>
    );
}

export default Navbar
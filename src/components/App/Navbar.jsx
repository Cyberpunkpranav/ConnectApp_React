import React, { useMemo, useRef } from 'react'
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useContext } from "react";

//Context APIs
import { Permissions } from '../../index'
//Components
import { SearchField } from '../features/SearchField'
import { AddPatient } from '../Today/AddPatient'
import { AddDoctorSlot } from '../Today/AddDoctorSlot'
import { AddAppointment } from '../Today/AddAppointment'


function Navbar(props) {
    const message_Box = useRef()
    const adminid = localStorage.getItem("id");
    //Use States
    const [searchtext, setsearchtext] = useState()
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
        {
            title: 'Reports',
            path: '/Reports',
            image: '/images/report.png',
            display: props.permissions.purchase_entry_view == undefined && props.permissions.purchase_orders_view == undefined && props.permissions.purchase_return_view == undefined && props.permissions.sale_entry_view == undefined && props.permissions.sale_return_view == undefined ? 0 : 1
        },

    ]
    //websocket
    const [Users, setUsers] = useState([])
    const [messages, setmessages] = useState([])
    const [openchat, setopenchat] = useState('none')
    const [sendmessage, setsendmessage] = useState()
    const [user, setuser] = useState()
    const [online, setonline] = useState(0)

    let JsonData = {
        action: 'username',
        username: '',
        message: sendmessage,
        id: adminid
    }


    let socket = new WebSocket('ws://localhost:8080/Chat')

    useEffect(() => {
        socket.onopen = () => {
            setonline(1)
        }
        socket.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            switch (data.action) {
                case "UserLists":
                    if (data.connected_users.length > 0) {
                        setUsers(data.connected_users)
                    }
                    break;
                case "Broadcast":
                    if (data.message) {
                        console.log(data)
                        if (data.message.length > 0) {
                            setmessages(data.message)
                            setuser(data.user)
                        }
                    }
                    break;
            }

        }
    }, [socket.data])
    socket.onclose = (event) => {
        if (event.code === 1001) {
            socket.close()
            setonline(0)
        }
    }
    let JsonDataOut = {
        action: 'left',
        username: props.username,
        message: '',
        id: adminid
    }
    window.addEventListener('beforeunload', function () {
        JsonDataOut = {
            action: 'left',
            username: props.username,
            message: '',
            id: adminid
        }
    })
    window.addEventListener('unload', function () {
        if (JsonDataOut) {
            // socket.onopen = () => {
            socket.send(JSON.stringify(JsonData))
            // }
        }

    })
    useEffect(() => {
        JsonData = {
            action: 'username',
            username: props.username,
            message: sendmessage,
            id: adminid
        }

        socket.onopen = () => {
            socket.send(JSON.stringify(JsonData))
        }

    }, [props.username])


    // function LeftChat() {
    //     JsonData = {
    //         action: 'left',
    //         username: props.username,
    //         message: '',
    //         id: adminid
    //     }
    //     socket.onopen = () => {
    //         socket.send(JSON.stringify(JsonData))
    //     }
    // }
    function Braodcast() {
        JsonData = {
            action: 'broadcast',
            username: props.username,
            message: sendmessage,
            Id: adminid
        }
        socket.send(JSON.stringify(JsonData))
    }
    function Toggle_Chat() {
        if (openchat == 'none') {
            setopenchat('block')
        }
        if (openchat == 'block') {
            setopenchat('none')
        }

    }
    return (
        <>
            <div className="navsection p-0 m-0 py-1">
                <div className="container-fluid p-0 m-0 ">
                    <div className="row m-0 p-0 justify-content-lg-between justify-content-md-between justify-content-sm-between justify-content-between align-items-center">
                        <div className="col-lg-auto col-xl-auto col-md-2 col-sm-auto col-auto p-0 m-0 ms-2 text-start dropdown">
                            <button className="button dropdown-toggle button-seashell shadow-none d-inline-block col-md-auto col-auto user position-relative p-0 m-0 ms-2" data-bs-toggle="dropdown" aria-expanded="false">
                                <h1 className="m-0 username text-decoration-none  text-start fw-bold"> {props.username} </h1>
                                <div className="m-0 userstatus text-decoration-none text-start text-burntumber fw-bold" >{props.designation} </div>
                                <ul class="dropdown-menu p-0 m-0 border-0" onClick={props.logout}>
                                    <li class="dropdown-item p-0 m-0 bg-lightred50 text-center rounded-2 p-1 fw-bold border-0 text-burntumber">Logout</li>
                                </ul>
                            </button>
                        </div>
                        <div className="col-lg-auto col-xl-7 align-self-center col-sm-auto col-md-auto col-12 p-0 m-0 menu order-2 order-xl-0 order-sm-0 order-md-0 mt-lg-0 mt-md-0 md-sm-0">
                            <div className="row p-0 m-0 justify-content-sm-center justify-content-evenly">
                                {
                                    NavbarIcons.map((data, i) => (
                                        <div className={`col-auto p-0 m-0 align-self-end d-${data.display == 1 ? '' : 'none'} `} onClick={() => sethighlighticon(data.path)}>
                                            <Link to={data.path} className="text-decoration-none">
                                                <div className="text-center">
                                                    <img src={process.env.PUBLIC_URL + data.image} alt="displaying_image" className={`img-fluid rounded-1 p-2 bg-${location.pathname === data.path ? 'burntumber25' : 'seashell'}`} style={{ width: `1.2rem`, boxSizing: 'content-box' }} />
                                                </div>
                                                <small className="col-12 m-0 p-0 px-2 text-center fw-bold text-charcoal">{data.title}</small>
                                            </Link>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                        {/* className="col-lg-2 col-xl-2 col-md-2 col-sm-6 col-6 mt-sm-2 search text-center position-relative" */}
                        <div className="col-lg-auto col-xl-2 col-md-2 col-8 col-sm-auto text-center align-self-center position-relative p-0 m-0 order-sm-2 order-md-1 order-1 ">
                            <div className="row p-0 m-0 align-items-center justify-content-md-start justify-content-center">
                                <div className="col-sm-auto col-xl-8 col-lg-8 col-md-8 me-1 col-7 p-0 m-0 position-relative " style={{ zIndex: '3' }} >
                                    <input type="text" className="rounded-1 text-charcoal search bg-charcoal25 positon-relative border border-0 text-start py-sm-1 ps-2 py-1 fw-bold" placeholder="search" onChange={(e) => setsearchtext(e.target.value)} />
                                    <div className="position-absolute bg-pearl rounded-2 end-0 shadow mt-1 " style={{ width: '60vh' }}>
                                        <SearchField searchtext={searchtext} fetchapi={props.fetchapi} />
                                    </div>
                                </div>
                                {/* col-xl-2 col-md-auto col-sm-auto col-6  */}
                                <div className={`col-auto p-0 m-0 dropdown text-decoration-none me-sm-1 d-${props.permissions.patient_add == undefined && props.permissions.doctor_add == undefined && props.permissions.appointment_add == undefined ? 'none' : ''}`}>
                                    <button className="button p-0 m-0 px-2 pe-2 py-1 mt-md-1 mt-lg-0 button-burntumber dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        + Add
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button className={`dropdown-item border-bottom d-${props.permissions.patient_add == 1 ? '' : 'none'} fs-6`} onClick={() => { togglepatientform() }}>+ Patient</button></li>
                                        <li className={`d-${props.permissions.appointment_add == 1 ? '' : 'none'}`}><button className="dropdown-item border-bottom fs-6" onClick={() => { toggleappointmentform() }}>+ Appointment</button></li>
                                        <li><button className={`dropdown-item fs-6`} onClick={() => { toggledoctorform() }}>+ Doctor</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`col-lg-5 col-md-6 col-sm-12 col-12 rounded-4 p-2 me-lg-2 me-md-2 mt-2 bg-seashell scroll patientinfosection d-${patientform} border position-absolute`} >
                <AddPatient togglepatientform={togglepatientform} patientform={patientform} />
            </div>
            <div className={`col-lg-5 col-md-6 col-sm-12 rounded-4 p-2 me-lg-2 me-md-2 mt-2 col-12 bg-seashell appointmentinfosection d-${appointmentform} border-start border-top border-2 position-absolute`} style={{ zIndex: '4', right: '0' }} >
                <AddAppointment toggleappointmentform={toggleappointmentform} fetchapi={props.fetchapi} />
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

            <div className="position-absolute bottom-0 end-0 me-5 mb-3 d-block" style={{zIndex:'10  '}}>
                <button className={`btn p-0 m-0 text-pearl fw-bold bg-charcoal p-2`} onClick={() => Toggle_Chat()}>Chat</button>
            </div>
            <div className={`d-${openchat}`} ref={message_Box} style={{ zIndex: '4' }}>
                <div className={`message_box`}  >
                    <div div className='message_box bg-seashell border border-1 shadow-sm position-absolute end-0 top-0' style={{ height: '100vh', width: '50vh' }}>
                        <div className="chatbox position-relative" style={{ height: '100vh', width: '50vh' }}>
                            <button className="btn-close position-absolute end-0 me-3 mt-2" onClick={() => { Toggle_Chat(); }} ></button>
                            <div className="messagebox bg-seashell pt-5 border border-1" style={{ height: '90vh', width: '50vh' }}>
                                <ul className='p-2 bg-seashell scroll'>
                                    {
                                        Users.map((data) => (
                                            <button className=' button bg-pearl border-0 mx-2'>{data}</button>
                                        ))
                                    }
                                </ul>
                                <div className="messages d-block ms-3">

                                    {
                                        messages.length > 0 ? (
                                            <button className='button my-2 button-lightgreen py-2 shadow-sm rounded-4 ps-2 text-lightyellow fw-bold'>{user}:<span className='text-white'>{messages}</span></button>
                                        ) : (
                                            <></>
                                        )
                                    }

                                </div>
                            </div>
                            <div className="row position-absolute bottom-0 mb-4 end-0 me-5">
                                <div className="col-8">
                                    <input type='text' className='form-control ms-2 p-0 py-1 ps-1 w-100' onBlur={(e) => setsendmessage(e.target.value)} />
                                </div>
                                <div className="col-4">
                                    <button className='button-sm button-burntumber' onClick={() => Braodcast()} >Send</button>
                                </div>
                            </div>

                        </div>

                    </div>


                </div >
            </div >


        </>
    );
}

export default Navbar
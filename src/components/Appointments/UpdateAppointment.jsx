import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { DoctorsList, URL, Doctorapi, TodayDocs } from '../../index'
import Notiflix from 'notiflix';

import '../../css/appointment.css';
import { customconfirm } from '../features/notiflix/customconfirm'

const UpdateAppointment = (props) => {
    const colorref = useRef(null)
    const clinicID = localStorage.getItem('ClinicId')
    let adminid = localStorage.getItem('id')
    const url = useContext(URL);
    const DocApi = useContext(Doctorapi)
    const Doclist = useContext(DoctorsList)
    const TodayDoctors = useContext(TodayDocs)
    const [cliniclist, setcliniclist] = useState([])
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [doctorid, setdoctorid] = useState()
    const [clinicid, setclinicid] = useState(clinicID)
    const [time, settime] = useState()
    const [timeindex, settimeindex] = useState()
    const [load, setload] = useState()

    const [ApikeyDocTimeslots, setApikeyDocTimeslots] = useState()
    const [ApiDocTimefrom, setApiDocTimefrom] = useState();
    function ClinicList() {
        axios.get(`${url}/clinic/list`).then((response) => {
            setcliniclist(response.data.data)
        })
    }
    useEffect(() => {
        ClinicList()
    }, [])

    function tConvert(time) {

        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }

    const dateref = useRef()
    const docref = useRef()
    const [trigger, settrigger] = useState(false)
    async function getCurrentTimeslots() {
        setdoctorid(props.appointmentdoctorid)
        dateref.current.value = ''
        docref.current.value = props.appointmentdoctorid
        let Timeslots = [];
        setApikeyDocTimeslots([])
        for (let i = 0; i < DocApi.length; i++) {
            if (DocApi[i].id === Number(props.appointmentdoctorid)) {
                Timeslots.push(DocApi[i].month_timeslots)
            }
        }
        setApikeyDocTimeslots(Timeslots)
        settrigger(true)
    }
    async function getCurrentTimefrom() {
        setApiDocTimefrom()
        let timefrom = []
        if (ApikeyDocTimeslots) {
            for (let j = 0; j < ApikeyDocTimeslots[0].length; j++) {
                if (ApikeyDocTimeslots[0][j].date === props.appointmentdate) {
                    timefrom.push([ApikeyDocTimeslots[0][j].id, ApikeyDocTimeslots[0][j].time_from, ApikeyDocTimeslots[0][j].booking_status])
                }
            }
            setApiDocTimefrom(timefrom)
            settrigger(false)
        }

    }


    useEffect(() => {
        getCurrentTimeslots()
        dateref.current.value = props.appointmentdate;
    }, [1])

    useEffect(() => {
        getCurrentTimefrom()
    }, [trigger])

    const gettime_value = (e) => {
        e.preventDefault()
        settime(e.target.value)
    }
    async function getTimeslots(e) {
        setdoctorid(e.target.value)
        dateref.current.value = '';
        let Timeslots = [];
        setApikeyDocTimeslots([])
        for (let i = 0; i < DocApi.length; i++) {
            if (DocApi[i].id === Number(e.target.value)) {
                Timeslots.push(DocApi[i].month_timeslots)
            }
        }
        setApikeyDocTimeslots(Timeslots)
    }
    async function getTimefrom(e) {
        setApiDocTimefrom([])
        let timefrom = []
        for (let j = 0; j < ApikeyDocTimeslots[0].length; j++) {
            if (ApikeyDocTimeslots[0][j].date === e.target.value) {
                timefrom.push([ApikeyDocTimeslots[0][j].id, ApikeyDocTimeslots[0][j].time_from, ApikeyDocTimeslots[0][j].booking_status])
            }
        }
        setApiDocTimefrom(timefrom)

    }

    function UpdateAppointment(e) {
        if (props.appointmentid && doctorid && clinicid && time && adminid && props.patientid != null && props.patientid != 0) {
            try {
                // console.log(props.appointmentid, Number(doctorid), Number(clinicid), Number(time), Number(adminid), Number(props.patientid))
                setload(true)
                axios.post(`${url}/update/appointment`, {
                    appointment_id: props.appointmentid,
                    doctor_id: doctorid,
                    clinic_id: clinicid,
                    timeslot_id: time,
                    patient_id: props.patientid,
                    admin_id: adminid

                }).then((response) => {
                    if (response) {
                        props.fetchallAppointmentslist()
                        props.closeappointmentform()
                        setload(false)
                        props.fetchapi()
                        Notiflix.Notify.success(response.data.message);

                    } else {
                        setload(false)
                        Notiflix.Notify.alert('Failed to Update')
                    }

                })
            } catch (e) {
                alert(e)
                setload(false)
            }
        } else {
            Notiflix.Notify.warning('Please Fill all Detais');
            setload(false)
        }
    }

    const confirmmessage = (e) => {
        e.preventDefault()
        customconfirm()
        Notiflix.Confirm.show(
            `Update Appointment Details`,
            `Do you surely want to update ${props.patientname} Appointment Details`,
            'Yes',
            'No',
            () => {
                UpdateAppointment()

            },
            () => {
                return 0
            },
            {
            },
        );
    }
    const HighlightOptions = (response) => {
        for (let k = 0; k < TodayDoctors.length; k++) {
            if (TodayDoctors[k][0] !== undefined) {
                if (TodayDoctors[k][0] == response) {
                    return 'charcoal'
                }
            }

        }

    }
    const Avaliablemessage = (response) => {
        for (let k = 0; k < TodayDoctors.length; k++) {
            if (TodayDoctors[k][0] !== undefined) {
                if (TodayDoctors[k][0] == response) {
                    return '(Aval today) '
                }
            }
        }

    }
    return (
        <div className='fw-light text-start position-relative p-0 m-0'>
            <h5 className="text-center pt-2">Update {props.patientname} Appointment Details</h5>
            <button type="button" className="btn-close closebtn position-absolute top-0 mb-3" aria-label="Close" disabled={load == true ? true : false} onClick={props.closeappointmentform} ></button>
            <hr className='p-0 m-0' />
            <div className="col-12 ps-1">
                <div className="col-12 clinics bg-seashell align-self-center border-0 ps-2" >
                    {
                        cliniclist.map((data, i) => (
                            <div key={i} className={`d-${clinicID == data.id ? 'block' : 'none'} `}>
                                <div className="row p-0 m-0 align-items-center">
                                    <div className="col-auto p-0 m-0 me-1">
                                        <img src={process.env.PUBLIC_URL + '/images/location.png'}  />
                                    </div>
                                    <div className="col-auto p-0 m-0 fw-bold mt-1" style={{ letterSpacing: '1px' }}>
                                        {data.title} {data.address}
                                    </div>
                                </div></div>
                        ))
                    }
                </div>
                <div className="row p-0 m-0 mt-2 pe-2">
                    <div className="col-md-4 col-4 ">
                        <label className="fw-bold" style={{ letterSpacing: '1px' }}>Selected Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control button-charcoal-outline rounded-1" ref={docref} onChange={getTimeslots}>
                                <option defaultValue="Select Doctor" >Select Doctor</option>
                                {
                                    TodayDoctors ? (
                                        Doclist.map((data, i) => (
                                            <option className={` text-${HighlightOptions(data[0]) ? 'pearl' : HighlightOptions(data[0])} bg-${HighlightOptions(data[0]) ? HighlightOptions(data[0]) : 'seashell'}`} name={HighlightOptions(data[0]) ? 'Currently Avaliable' : ''} selected={data[0] === props.appointmentdoctorid ? true : false} value={data[0]}>{data[0]}.{data[1]} {Avaliablemessage(data[0])}</option>
                                        ))
                                    ) : (
                                        <div>Loading...</div>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-auto col-4 m-0 p-0">
                        <label className="fw-bold" style={{ letterSpacing: '1px' }}>Selected Date</label>
                        <div className="col-12">
                            <input type="date" ref={dateref} className="form-control border-charcoal bg-seashell  rounded-1" onChange={getTimefrom} />
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-3 col-4">
                        <label className="fw-bold text-charcoal50" style={{ letterSpacing: '1px' }}>Selected Time</label>
                        <div className="col-12">
                            <button className='button button-charcoal50 shadow-none' disabled >{props.appointmenttime}</button>
                        </div>

                    </div>
                </div>

                <p className="m-0 p-0 mb-md-2 mt-2 ps-2 fw-bold" style={{ letterSpacing: '1px' }}>Select new Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12 ms-2">
                    {ApiDocTimefrom && ApiDocTimefrom.length !== 0 ? (
                        <>
                            {
                                ApiDocTimefrom.map((data, key) => (
                                    data[2] == 0 ? (
                                        <button style={{ letterSpacing: '1px' }} className={`button-sm button-${timeindex == key ? 'charcoal' : 'charcoal-outline'} rounded-1 px-3 py-2 fw-bold  m-1`} id={key} value={data[0]} onClick={(e) => { gettime_value(e); settimeindex(key) }}>{tConvert(data[1])}</button>
                                    ) : (
                                        <button style={{ letterSpacing: '1px' }} disabled className="button-sm button-charcoa50 px-3 py-2 fw-bold m-1 rounded-1" id={key} value={data[0]}>{tConvert(data[1])}</button>
                                    )
                                ))
                            }
                            <button className="btn btn-sm done m-1 d-none">
                                <img src="/images/addicon.png" alt="displaying_image" className="mb-1 me-1" style={{ width: "1.2rem" }} /> Time Slot
                            </button>
                        </>
                    ) : (
                        <div className='p-2 rounded fw-bold text-burntumber bg-lightred'>No timeslots Avaliable</div>
                    )
                    }
                </div>
                <hr />
                <div className="row m-0 p-0">
                    {load ? (
                        <div className="col-6 py-2 pb-2 m-auto text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="col-auto py-2 pb-2 m-auto text-center">
                                <button className='btn button-charcoal' onClick={confirmmessage}>Done</button>
                            </div>
                            <div className="col-auto py-2 pb-2 m-auto text-center">
                                <button className="btn button-pearl" onClick={getCurrentTimeslots}>Set Previous</button>
                            </div>
                        </>
                    )

                    }

                </div>

            </div>
        </div>

    )
}
export { UpdateAppointment }
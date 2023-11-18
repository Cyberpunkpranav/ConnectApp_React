import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'

import { DoctorsList, URL, Doctorapi, TodayDocs,Clinic } from '../../index'
import Notiflix from 'notiflix';
import '../../css/appointment.css';
import { customconfirm } from '../features/notiflix/customconfirm'

const UpdateAppointment = (props) => {
    const colorref = useRef(null)
    const cliniclist  = useContext(Clinic)
    const clinicID = localStorage.getItem('ClinicId')
    let adminid = localStorage.getItem('id')
    const url = useContext(URL);
    const DocApi = useContext(Doctorapi)
    const Doclist = useContext(DoctorsList)
    const TodayDoctors = useContext(TodayDocs)
    const [doctorid, setdoctorid] = useState()
    const [clinicid, setclinicid] = useState(clinicID)
    const [time, settime] = useState()
    const [timeindex, settimeindex] = useState()
    const [ischecked, setischecked] = useState()
    const [load, setload] = useState()


    const [ApikeyDocTimeslots, setApikeyDocTimeslots] = useState()
    const [ApiDocTimefrom, setApiDocTimefrom] = useState();

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
        setApikeyDocTimeslots(Timeslots.flat())
        settrigger(true)
    }
    async function getCurrentTimefrom() {
        setApiDocTimefrom()
      
        let timefrom = []
        for (let j = 0; j < ApikeyDocTimeslots.length; j++) {
            if (ApikeyDocTimeslots[j].date === props.appointmentdate && ApikeyDocTimeslots[j].clinic_id ==clinicID ) {
                let obj = {
                    timeslot_id :ApikeyDocTimeslots[j].id,
                    time_from:ApikeyDocTimeslots[j].time_from,
                    booking_status:ApikeyDocTimeslots[j].booking_status
                }
                timefrom.push(obj)
            }
        }
        setApiDocTimefrom(timefrom)
        settrigger(false)
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
        for (let j = 0; j < ApikeyDocTimeslots.length; j++) {
            if (ApikeyDocTimeslots[j].date === e.target.value && ApikeyDocTimeslots[j].clinic_id==clinicID) {
                timefrom.push([ApikeyDocTimeslots[j].id, ApikeyDocTimeslots[j].time_from, ApikeyDocTimeslots[j].booking_status])
            }
        }
        setApiDocTimefrom(timefrom)

    }

    function UpdateAppointment(e) {
        if (props.appointmentid && doctorid && clinicid && time && adminid && props.patientid != null && props.patientid != 0) {
            try {
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
                        if (props.appointmentdoctorid) {
                            props.fetchapi()
                        } else {
                            props.fetchallAppointmentslist()
                            props.fetchapi()
                        }
                        Notiflix.Notify.success(response.data.message);
                        setload(false)
                    } else {
                        Notiflix.Notify.alert('Failed to Update')
                        setload(false)
                    }

                })
            } catch (e) {
                Notiflix.Notify.alert(e.message)
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

    const confirmmessageforCancel = () => {
        customconfirm()
        Notiflix.Confirm.show(
            `Cancel Appointment`,
            `Do you surely want to Cancel ${props.patientname}'s Appointment`,
            'Yes',
            'No',
            () => {
                CancelAppointment()

            },
            () => {
                return 0
            },
            {
            },
        );
    }
    const CancelAppointment = async () => {
        try {
            await axios.post('http://aartas-qaapp-as.azurewebsites.net/aartas_redev/public/api/cancel/appointment', {
                appointment_id: props.appointmentid
            }).then((response) => {
                
                if (response.status == true) {
                    props.fetchallAppointmentslist()
                    props.fetchapi()
                } else {
                    Notiflix.Notify.failure("Cannot Cancel Appointment.Please try again.")
                }

            })
        } catch (e) {
            Notiflix.Notify.failure(e.message)
        }

    }

    return (
        <div className='p-0 m-0 text-start'>
            <h5 className="text-center p-2">Update {props.patientname} Appointment Details</h5>
            <button type="button" className="btn-close closebtn position-absolute" disabled={load == true ? true : false} aria-label="Close" onClick={props.closeappointmentform} ></button>
            <hr className='p-0 m-0' />
            <div className="col-12 ps-1">
                <div className="col-12 clinics bg-seashell border-0 p-2" >
                    {
                        cliniclist.map((data, i) => (
                            <div key={i} className={`d-${clinicID == data.id ? 'block' : 'none'} align-items-end text-charcoal `}>
                                <div className="row p-0 m-0 align-items-end">
                                    <div className="col-auto p-0 m-0 me-1">
                                        <img className='img-fluid' src={process.env.PUBLIC_URL + '/images/location.png'} style={{ width: '1.3rem' }} />
                                    </div>
                                    <div className="col-auto p-0 m-0 fw-bold text-wrap mb-2" style={{ letterSpacing: '1px' }}>
                                        {data.title} {data.address}
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className="row p-0 m-0 mt-2 pe-2">
                    <div className="col-md-4 col-sm-4 col-4">
                        <label className="fw-bold" style={{ letterSpacing: '1px' }}>Selected Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control selectdoctor border-charcoal rounded-1 bg-seashell" ref={docref} onChange={getTimeslots}>
                                <option defaultValue="Select Doctor bg-seashell" >Select Doctor</option>
                                {
                                    TodayDoctors ? (
                                        Doclist.map((data, i) => (
                                            <option className={` text-${HighlightOptions(data[0]) ? 'pearl' : HighlightOptions(data[0])} bg-${HighlightOptions(data[0]) ? HighlightOptions(data[0]) : 'seashell'}`} name={HighlightOptions(data[0]) ? 'Currently Avaliable' : ''} selected={data[0] === props.appointmentdoctorid ? true : false} value={data[0]}>Dr. {data[1]} {Avaliablemessage(data[0])}</option>
                                        ))
                                    ) : (
                                        <div>Loading</div>
                                    )



                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-auto col-auto m-0 p-0">
                        <label className="fw-bold" style={{ letterSpacing: '1px' }}>Selected Date</label>
                        <div className=" border-0 col-12 bg-seashell "><input type="date" ref={dateref} className="form-control bg-seashell rounded-1 border-charcoal" onChange={getTimefrom} />
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-lg-3 col-3">
                        <label className='text-charcoal50 fw-bold'>Selected Time</label>
                        <div className="col-12 p-0 m-0 selectedtime">
                            <button className='button button-charcoal50-outline rounded-1 fw-bold shadow-none' style={{ letterSpacing: '1px' }} >{props.appointmenttime}</button>
                        </div>

                    </div>
                </div>
                <p className="m-0 mt-2 fw-bold ps-2 pt-2" style={{ letterSpacing: '1px' }}>Select another Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12 ps-2">
                    {ApiDocTimefrom && ApiDocTimefrom.length !== 0 ? (
                        <>
                            {
                                ApiDocTimefrom.map((data, key) => (
                                    data.booking_status == 0 ? (
                                        <button className={`button-sm button-${timeindex == key ? 'charcoal' : 'charcoal-outline'} px-3 py-2 rounded-1 fw-bold m-1`} style={{ letterSpacing: '1px' }} id={key} value={data.timeslot_id} onClick={(e) => { gettime_value(e); settimeindex(key) }}>{tConvert(data.time_from)}</button>
                                    ) : (
                                        <button disabled className="button-sm button-charcoal50-outline rounded-1 px-3 py-2 m-1 fw-bold" style={{ letterSpacing: '1px' }} id={key} value={data.timeslot_id}>{tConvert(data.time_from)}</button>
                                    )
                                ))
                            }
                            <button className="btn btn-sm done m-1 d-none">
                                <img src="/images/addicon.png" alt="displaying_image" className="mb-1 me-1" style={{ width: "1.2rem" }} /> Time Slot
                            </button>
                        </>
                    ) : (
                        <div className='p-2 rounded fw-bold text-burntumber bg-lightred'>No Time Slots Available</div>
                    )
                    }
                </div>
                <hr />
                <div className="row m-0 p-0">
                    {
                        load ? (
                            <div className="col-6 py-2 pb-2 m-auto text-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="col-6 m-auto text-center">
                                    <button className='btn button-charcoal' onClick={confirmmessage}>Update</button>
                                </div>

                                <div className="col-6 m-auto text-center">
                                    <button type="button" className="button button-pearl" disabled={load == true ? true : false} aria-label="Close" onClick={props.closeappointmentform} >Cancel</button>
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
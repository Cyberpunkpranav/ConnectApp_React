import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { DoctorsList, URL, Doctorapi, TodayDocs } from '../../index'
import Notiflix from 'notiflix';
import '../../css/bootstrap.css';
import '../../css/appointment.css';
import { customconfirm } from '../features/notiflix/customconfirm'

const UpdateAppointment = (props) => {
    const colorref = useRef(null)
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
    const [clinicid, setclinicid] = useState()
    const [time, settime] = useState()
    const [timeindex, settimeindex] = useState()
    const [ischecked, setischecked] = useState()


    const [ApikeyDocTimeslots, setApikeyDocTimeslots] = useState()
    const [ApiDocTimefrom, setApiDocTimefrom] = useState();
    let adminid = localStorage.getItem('id')

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
        for (let j = 0; j < ApikeyDocTimeslots[0].length; j++) {
            if (ApikeyDocTimeslots[0][j].date === props.appointmentdate) {
                timefrom.push([ApikeyDocTimeslots[0][j].id, ApikeyDocTimeslots[0][j].time_from, ApikeyDocTimeslots[0][j].booking_status])
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
                console.log(props.appointmentid, Number(doctorid), Number(clinicid), Number(time), Number(adminid), Number(props.patientid))
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
                            props.fetchapi()
                        Notiflix.Notify.success(response.data.message);

                    } else {
                        Notiflix.Notify.alert('Failed to Update')
                    }

                })
            } catch (e) {
                alert(e)
            }
        } else {
            Notiflix.Notify.warning('Please Fill all Detais');
        }
    }

    const confirmmessage = (e) => {
        e.preventDefault()
        customconfirm()
        Notiflix.Confirm.show(
            `Update Appointment Details`,
            `Do you surely want yo update ${props.patientname} Appointment Details`,
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
                if(TodayDoctors[k][0]!==undefined){
                    if (TodayDoctors[k][0] == response) {
                        return 'charcoal'
                    }
                }
           
        }

    }
    const Avaliablemessage = (response) => {
        for (let k = 0; k < TodayDoctors.length; k++) {
                if(TodayDoctors[k][0]!==undefined){
                    if (TodayDoctors[k][0] == response) {
                        return '(Aval today) '
                    }
                }
        }

    }
    return (
        <section className='bg-seashell text-start rounded-2 shadow position-relative p-2'>
            <h5 className="text-center">Update {props.patientname} Appointment Details</h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={props.closeappointmentform} ></button>
            <hr />
            <div className="col-12">
                <label>Select Location</label>
                <div className="col-12 form-control location bg-seashell  border-0" >
                    {
                        cliniclist.map((data, i) => (
                            <>
                                <label><input type="checkbox" className="radio form me-1" checked={ischecked == i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
                                <br /></>
                        ))
                    }
                </div>
                <div className="row p-0 m-0 text-center ms-5">
                    <div className="col-md-4">
                        <label>Selected Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control selectdoctor bg-seashell" ref={docref} onChange={getTimeslots}>
                                <option defaultValue="Select Doctor bg-seashell" >Select Doctor</option>
                                {
                                    TodayDoctors ? (
                                        Doclist.map((data, i) => (
                                            <option className={` text-${HighlightOptions(data[0])?'pearl':HighlightOptions(data[0])} bg-${HighlightOptions(data[0]) ? HighlightOptions(data[0]) : 'seashell'}`} name={HighlightOptions(data[0])?'Currently Avaliable':''} selected={data[0] === props.appointmentdoctorid ? true : false} value={data[0]}>{data[0]}.{data[1]} {Avaliablemessage(data[0])}</option>
                                        ))
                                    ) : (
                                        <div>Loading</div>
                                    )



                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-auto m-0 p-0">
                        <label className="">Selected Date</label>
                        <div className="col-12"><input type="date" ref={dateref} className="form-control selectdate" onChange={getTimefrom} />
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-3 col-3">
                        <label>Selected Time</label>
                        <div className="col-12">
                            <button className='button button-burntumber' disabled >{props.appointmenttime}</button>
                        </div>

                    </div>
                </div>

                <hr />

                <p className="m-0 mb-2">Select another Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12">
                    {ApiDocTimefrom ? (
                        <>
                            {
                                ApiDocTimefrom.map((data, key) => (
                                    data[2] == 0 ? (
                                        <button className={`button-sm button-${timeindex == key ? 'pearl' : 'lightgreen'}  m-1`} id={key} value={data[0]} onClick={(e) => { gettime_value(e); settimeindex(key) }}>{tConvert(data[1])}</button>
                                    ) : (
                                        <button disabled className="button-sm button-burntumber m-1" id={key} value={data[0]}>{tConvert(data[1])}</button>
                                    )
                                ))
                            }
                            <button className="btn btn-sm done m-1">
                                <img src="/images/addicon.png" alt="displaying_image" className="mb-1 me-1" style={{ width: "1.2rem" }} /> Time Slot
                            </button>
                        </>
                    ) : (
                        <div className='p-2 rounded'>Choose Doctor and Date to get Time Slots</div>
                    )
                    }
                </div>
                <hr />
                <div className="row m-0 p-0">
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                        <button className='btn px-5 button-burntumber' onClick={confirmmessage}>Done</button>
                    </div>
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                        <button className="btn btn-light px-5 border border-2" onClick={getCurrentTimeslots}>Set Previous</button>
                    </div>
                </div>

            </div>
        </section>

    )
}
export { UpdateAppointment }
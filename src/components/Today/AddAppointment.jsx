import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorsList, URL, Doctorapi, TodayDocs, TodayDate } from '../../index'
import Notiflix from 'notiflix';

import { customconfirm } from '../features/notiflix/customconfirm'

const AddAppointment = (props) => {
    const url = useContext(URL);
    const DocApi = useContext(Doctorapi)
    const Doclist = useContext(DoctorsList)
    const TodayDoctors = useContext(TodayDocs)
    const clinicID = localStorage.getItem('ClinicId')
    const [cliniclist, setcliniclist] = useState([])
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [doctorid, setdoctorid] = useState()
    const [clinicid, setclinicid] = useState(clinicID)
    const [time, settime] = useState()
    const [date, setdate] = useState()
    const [ischecked, setischecked] = useState()
    const [load, setload] = useState()
    const [searchload, setsearchload] = useState(false)
    const [timeindex, settimeindex] = useState()
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

    function setfromsearch() {
        setpatientid(props.patientidfromsearch)
        setsearchinput(props.patientnamefromsearch)
    }
    useEffect(() => {
        setfromsearch()
    }, [props.patientidfromsearch])

    function tConvert(time) {

        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }

    const searchpatient = (e) => {
        setsearchload(true)
        setsearchinput(e.target.value)
        axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data.patients_list)
            setsearchload(false)
        })
        if (searchinput && searchinput.length > 0) {
            setdisplaysearchlist('block');
        } else {
            setdisplaysearchlist('none');
        }
    }
    const get_value = async (value, name) => {
        console.log(value, name)
        setsearchinput(value)
        setpatientid(name)
        setdisplaysearchlist('none');
    }
    const gettime_value = (e) => {
        settime(e.target.value)
    }

    function GetTimeslotsBypropId() {
        if (props.doctorid) {
            setdoctorid(props.doctorid)
            setdate()
            let Timeslots = [];
            setApikeyDocTimeslots([])
            for (let i = 0; i < DocApi.length; i++) {
                if (DocApi[i].id === Number(doctorid)) {
                    Timeslots.push(DocApi[i].month_timeslots)
                }
            }
            setApikeyDocTimeslots(Timeslots)
            return Timeslots

        }
    }
    function getTimefromByPropId(data) {
        let timefrom = []
        if (data && data.length != 0) {
            setdate(props.todaydate)
            console.log(data)
            for (let j = 0; j < data[0].length; j++) {
                if (data[0][j].date === props.todaydate) {
                    timefrom.push([data[0][j].id, data[0][j].time_from, data[0][j].booking_status])
                }
            }
            setApiDocTimefrom(timefrom)
        }
    }


    useEffect(() => {
        GetTimeslotsBypropId()
        getTimefromByPropId(GetTimeslotsBypropId())
    }, [props.doctorid, doctorid, date])



    function getTimeslots(e) {
        setdoctorid(e.target.value)
        setdate()
        let Timeslots = [];
        setApikeyDocTimeslots([])
        for (let i = 0; i < DocApi.length; i++) {
            if (DocApi[i].id === Number(e.target.value)) {
                Timeslots.push(DocApi[i].month_timeslots)
            }
        }
        setApikeyDocTimeslots(Timeslots)
    }
    function getTimefrom(e) {
        setdate(e.target.value)
        let timefrom = []
        if (ApikeyDocTimeslots && ApikeyDocTimeslots.length != 0) {
            for (let j = 0; j < ApikeyDocTimeslots[0].length; j++) {
                if (ApikeyDocTimeslots[0][j].date === e.target.value) {
                    timefrom.push([ApikeyDocTimeslots[0][j].id, ApikeyDocTimeslots[0][j].time_from, ApikeyDocTimeslots[0][j].booking_status])
                }
            }
            setApiDocTimefrom(timefrom)
        } else {
            Notiflix.Notify.info('Choose Doctor First')
        }
    }

    function resetform(e) {
        setsearchinput()
        setpatientid()
        setdoctorid()
        setclinicid()
        setischecked()
        setdate()
    }

    function BookAppointment(e) {
        if (patientid && doctorid && clinicid && time && adminid) {
            setload(true)
            axios.post(`${url}/add/appointment`, {
                patient_id: patientid,
                doctor_id: doctorid,
                clinic_id: clinicid,
                timeslot_id: time,
                admin_id: adminid
            }).then((response) => {
                setload(false)
                Notiflix.Notify.success(response.data.message);
                resetform()
                props.toggleappointmentform()
                props.fetchapi()
                getTimeslots()
                getTimefrom()
                setdate()

            })
        } else {
            setload(false)
            Notiflix.Notify.warning('Please Fill all Detais');
        }

    }


    const confirmmessage = (e) => {
        customconfirm()
        Notiflix.Confirm.show(
            `Add Appointment`,
            `Do you surely want to Add Appointment for ${searchinput}`,
            'Yes',
            'No',
            () => {
                BookAppointment()
            },
            () => {
                return 0
            },
            {
            },
        );
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
    // console.log(searchinput, patientid, displaysearchlist);
    console.log(props.doctorid, doctorid, date)
    return (
        <div className='fw-bold text-start'>
            <h5 className="text-center fw-bold mt-2">New Appointment</h5>
            {
                props.closeAddAppointmentform ? (
                    <button type="button" disabled={load == true ? true : false} className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.closeAddAppointmentform() }} ></button>
                ) : (
                    <button type="button" disabled={load == true ? true : false} className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.toggleappointmentform(); }} ></button>
                )
            }
            <hr />
            <div className="col-12">
                <label className="m-0 mb-2">Search Using Phone or Name</label>
                <input type="text" className="form-control selectpatient col-10 position-relative" value={searchinput ? searchinput : ''} onChange={searchpatient} />
                <div className={`col-8 d-${displaysearchlist} searchinput`}>
                    {
                        searchload ? (
                            <p className="btn text-charcoal75 fw-bold bg-pearl rounded-2  p-0 m-0 ps-1">Loading... </p>
                        ) : (
                            searchinput && searchlist.length == 0 ? (
                                <p className="text-danger btn bg-lightred p-0 m-0">Patient not found add as new user to book appointements</p>
                            ) : (
                                <div className="p-2 bg-pearl">
                                    {
                                        searchlist.map((data) => (
                                            <div style={{ cursor: 'pointer' }} className='col-12 d-block p-0 m-0 ms-1 border-0 bg-pearl py-1 border-bottom text-charcoal text-start border border-1' onClick={(e) => get_value(data.full_name, data.id)}>{data.full_name}  {data.phone_number}</div>
                                        ))
                                    }
                                </div>

                            )
                        )

                    }
                </div>
                <hr />
                <label>Select Location</label>
                <div className="col-12 bg-seashell  border-0" >
                    {
                        cliniclist.map((data, i) => (
                            <label className={`d-${clinicID == data.id ? 'block' : 'none'} text-burntumber`}><input type="checkbox" className={`radio me-1 form-check-input `} key={i} checked={clinicID == data.id ? true : false} name={data.id} /> {data.title} {data.address}</label>

                        ))
                    }
                </div>
                <hr />
                <div className="row p-0 m-0">
                    <div className="col-md-6">
                        <label>Select Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control selectdoctor" value={doctorid ? doctorid : ''} onChange={getTimeslots}>
                                <option value="Select Doctor" >Select Doctor</option>
                                {
                                    Doclist.map((data, i) => (
                                        <option className={`text-charcoal`} key={i} value={data[0]}>{data[0]}.{data[1]}{' '}{Avaliablemessage(data[0])}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="">Select Date</label>
                        <div className="col-12">
                            <input type="date" value={date ? date : ''} className="form-control selectdate" onChange={getTimefrom} />
                        </div>
                    </div>
                </div>

                <hr />

                <p className="m-0 mb-2">Select Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12">
                    {ApiDocTimefrom && doctorid && date ? (
                        <>
                            {
                                ApiDocTimefrom.map((data, i) => (
                                    data[2] == 0 ? (
                                        <button className={`button button-${props.timeindex == i ? 'pearl' : timeindex == i ? 'charcoal' : 'charcoal-outline'} m-1`} value={data[0]} key={i} onClick={(e) => { gettime_value(e); settimeindex(i); }}>{tConvert(data[1])}</button>
                                    ) : (
                                        <button disabled className='btn button-charcoal75 m-1' key={i} value={data[0]}>{tConvert(data[1])}</button>
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
                {
                    load ? (
                        <div className="col-6 py-2 pb-2 m-auto text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                    ) : (
                        <>
                            <div className="col-6 py-2 pb-2 m-auto text-center">
                                <button className="btn button button-charcoal px-5" onClick={confirmmessage}> Done </button>
                            </div>
                            <div className="col-6 pb-2 m-auto text-center">
                                <button className="btn btn-light px-5" onClick={resetform}>Reset</button>
                            </div>
                        </>
                    )
                }
            </div>
        </div>

    )
}
export { AddAppointment }
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorsList, URL, Doctorapi, TodayDate, Clinic } from '../../index'
import Notiflix from 'notiflix'

import '../../css/dashboard.css'
const SelectedTimeAppointment = (props) => {
    //Global Variable
    const url = useContext(URL)
    const cliniclist = useContext(Clinic)
    const APIDate = useContext(TodayDate)
    const adminid = localStorage.getItem('id')
    const clinicID = localStorage.getItem('ClinicId')
    //Local UseStates
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [clinicid, setclinicid] = useState(clinicID)
    const [time, settime] = useState()
    const [searchload, setsearchload] = useState(false)
    const [load, setload] = useState()


    // Functions
    function tConvert(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
        if (time.length > 1) {
            time = time.slice(1)
            time[3] = +time[0] < 12 ? ' AM ' : ' PM '
            time[0] = +time[0] % 12 || 12
        }
        return time.join('')
    }
    async function searchpatient(e) {
        setsearchload(true)
        setsearchinput(e.target.value)
        await axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data.patients_list)
            setsearchload(false)
        })

        if (searchinput && searchinput.length > 1) {
            setdisplaysearchlist('block')
        } else {
            setdisplaysearchlist('none')
        }
    }
    const get_value = (data) => {
        setsearchinput(data.full_name)
        setpatientid(data.id)
        setdisplaysearchlist('none')
    }
    const gettime_value = (e) => {
        settime(APIDate)
    }
    function BookAppointment() {
        setload(true)
        if (patientid && props.DoctorID && clinicid && props.selectedtimeID[0] && adminid) {
            axios.post(`${url}/add/appointment`, {
                patient_id: patientid,
                doctor_id: props.DoctorID,
                clinic_id: clinicid,
                timeslot_id: props.selectedtimeID[0],
                admin_id: adminid
            }).then((response) => {
                Notiflix.Notify.success(response.data.message)
                setload(false)
                props.closeAddAppointmentform()
                props.fetchapi()
            })
        } else {
            Notiflix.Notify.warning('Please Fill all Detais')
            setload(false)
        }
    }
    console.log(displaysearchlist)
    // Functions
    return (
        <>
            <h5 className="text-center m-0 p-0 mt-2">Quick Appointment  at <span className=' text-charcoal fw-bold border-0 fs-6'>{tConvert(props.selectedtime)}</span></h5>
            <button type="button" className="btn-close closebtn position-absolute" disabled={load == true ? true : false} aria-label="Close" onClick={(e) => { props.closeAddAppointmentform() }} ></button>
            <hr className='p-0 m-0 mb-1' />
            <div className=" text-start ms-3 clinics align-self-center mb-2 ">
                {
                    cliniclist.map((data, i) => (
                        <label className={`d-${clinicID == data.id ? 'block' : 'none'}`}>
                            <img src={process.env.PUBLIC_URL + '/images/location.png'} className=' align-self-center ' style={{ width: '1.3rem' }} /> {data.title} {data.address}</label>
                    ))
                }
            </div>
            <div className="row p-0 m-0">
                <div className="col-5">
                    <input type="text" placeholder='Search Patient using Number or Name' className="form-control bg-pearl border-0" value={searchinput ? searchinput : ''} onChange={(e) => { searchpatient(e) }} />
                    <div className={`col-6 position-absolute d-${displaysearchlist} rounded-1 `} style={{ zIndex: 3 }}>
                        {
                            searchload ? (
                                <option className="btn col-12 text-charcoal75 bg-pearl p-0 m-0 ps-1 mt-1">Loading... </option>
                            ) : (
                                searchlist !== undefined && searchlist.length == 0 ? (
                                    <option className="text-burntumber col-12 p-0 m-0 bg-pearl shadow rounded mt-1 p-2">Patient not found</option>
                                ) : (
                                    <div className='mt-1 searchresult bg-seashell shadow rounded-1 p-1 bg-pearl border border-1 col-12  ' >
                                        {
                                            searchlist.map((data, i) => (
                                                <button style={{ cursor: 'pointer' }} className={`col-12 bg-${i % 2 == 0 ? 'seashell' : 'pearl'} btn d-block p-1 text-charcoal text-start border-bottom align-self-center`} name={data.id} value={data.full_name} onClick={() => { get_value(data) }}>{data.full_name} {data.phone_number}</button>
                                            ))
                                        }
                                    </div>
                                )

                            )

                        }
                    </div>
                </div>
                <div className="col-auto selecteds">
                    <div className="d-flex p-0 m-0 text-start justify-content-around">
                        <div className='button button-charcoal50-outline'>{props.DoctorID}. Dr.{props.DoctorName}</div>
                        <div className="button button-charcoal50-outline ms-3" >{APIDate}</div>

                    </div>
                </div>
            </div>

            {
                load ? (
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="col-6 donebutton py-2 pb-2 m-auto text-center">
                        <button className="button button-charcoal" onClick={BookAppointment}> Done </button>
                    </div>

                )
            }


        </>

    )
}
export { SelectedTimeAppointment }
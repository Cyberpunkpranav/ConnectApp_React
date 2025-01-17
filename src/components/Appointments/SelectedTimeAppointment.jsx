import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DOCTORNAME, DOCTORID } from '../../components/App/Clinic'
import { DoctorsList, URL, Doctorapi, TodayDate, Clinic, TodayDocs } from '../../index'
import Notiflix from 'notiflix'

import '../../css/dashboard.css'
const SelectedTimeAppointment = (props) => {
    //Global Variable
    const url = useContext(URL)
    const doctorname = useContext(DOCTORNAME)
    const doctorid = useContext(DOCTORID)
    const TodayDoctors = useContext(TodayDocs)
    const Doclist = useContext(DoctorsList)
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
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    }
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
        if (patientid && doctorid && clinicid && props.selectedtimeID[0] && adminid) {
            axios.post(`${url}/add/appointment`, {
                patient_id: patientid,
                doctor_id: doctorid,
                clinic_id: clinicid,
                timeslot_id: props.selectedtimeID[0],
                admin_id: adminid
            }).then((response) => {
                Notiflix.Notify.success(response.data.message)
          
                props.closeAddAppointmentform()
                props.fetchapi()
            }).catch((e)=>{
                setload(false)
            })
        } else {
            Notiflix.Notify.warning('Please Fill all Detais')
            setload(false)
        }
    }
    return (
        <>
            <h5 className="text-center m-0 p-0 mt-2">Quick Appointment  at <span className=' text-charcoal fw-bold border-0 fs-6'>{tConvert(props.selectedtime)}</span></h5>
            <button type="button" className="btn-close closebtn position-absolute top-0 mt-2" disabled={load == true ? true : false} aria-label="Close" onClick={(e) => { props.closeAddAppointmentform() }} ></button>
            <hr className='p-0 m-0 mb-1' />
            <div className=" text-start p-0 m-0 ms-3 clinics align-items-end mb-2 fw-bold text-burntumber ">
                {
                    cliniclist.map((data, i) => (
                        <label className={`d-${clinicID == data.id ? 'block' : 'none'}`}>
                            <img src={process.env.PUBLIC_URL + '/images/location.png'} className=' align-self-center '/> {data.title} {data.address}</label>
                    ))
                }
            </div>
            <div className="row p-0 m-0">
                <div className="col-5">
                    <input type="text" placeholder='Search Patient using Number or Name' className="form-control bg-pearl border-0" value={searchinput ? searchinput : ''} onChange={(e) => { searchpatient(e) }} />
                    <div className={`col-6 position-absolute d-${displaysearchlist} bg-pearl rounded-2 shadow mt-1 pb-2 `} style={{ zIndex: 3 }}>
                        {
                            searchload ? (
                                <div className=" col-12 text-charcoal75 p-0 m-0 py-2 fw-bold text-start ps-2 mt-1">Loading... </div>
                            ) : (
                                searchlist !== undefined && searchlist.length == 0 ? (
                                    <div className="text-burntumber col-12 p-0 m-0 fw-bold mt-1 ps-2 pt-1">Patient not found</div>
                                ) : (
                                    <div className='mt-1 searchresult bg-pearl  col-12  ' >
                                        {
                                            searchlist.map((data, i) => (
                                                <div style={{ cursor: 'pointer' }} className={`col-12 d-block p-2 fw-bold text-charcoal text-start border-bottom align-self-center`} name={data.id} value={data.full_name} onClick={() => { get_value(data) }}>{data.full_name} <span className='fw-bold text-burntumber'>{data.phone_number}</span></div>
                                            ))
                                        }
                                    </div>
                                )

                            )

                        }
                    </div>
                </div>
                <div className="col-auto">
                    <div className="d-flex p-0 m-0 text-start justify-content-around">
                        <div className='button button-charcoal50-outline align-self-center '> Dr.{doctorname}</div>
                        <div className="button button-charcoal50-outline ms-3" >{reversefunction(APIDate)}</div>

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
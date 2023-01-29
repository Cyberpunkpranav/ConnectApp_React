import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorsList, URL, Doctorapi, TodayDate,Clinic } from '../../index'
import Notiflix from 'notiflix';
import '../../css/bootstrap.css'

const SelectedTimeAppointment = (props) => {
    //Global Variable
    const url = useContext(URL);
    const cliniclist=useContext(Clinic)
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
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
            time = time.slice(1);
            time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }
    async function searchpatient(e) {
        setsearchload(true)
        setsearchinput(e.target.value)
        await axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data)
            setsearchload(false)
        })
    
        if (searchinput && searchinput.length > 1) {
            setdisplaysearchlist('block');
        } else {
            setdisplaysearchlist('none');
        }
    }
    const get_value = (e) => {
        setsearchinput(e.target.value)
        setpatientid(e.target.name)
        setdisplaysearchlist('none');
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
                Notiflix.Notify.success(response.data.message);
                setload(false)
                props.closeAddAppointmentform()
                props.fetchapi()
            })
        } else {
            Notiflix.Notify.warning('Please Fill all Detais');
            setload(false)
        }
    }
// Functions
    return (
        <>
            <h5 className="text-center m-0 p-0 mt-2">Quick Appointment</h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.closeAddAppointmentform() }} ></button>
            <div className="col-12 p-0 mt-2">
    
                <input type="text" placeholder='Search Patient using Number or Name' className="form-control selectpatient col-10 position-relative" value={searchinput ? searchinput : ''}  onChange={(e) => { searchpatient(e); }}  />
                <div className={`col-8  d-${displaysearchlist} `} style={{ minHeight: '4rem' }}>
                    {
                        searchload ? (
                            <p className="btn text-charcoal75 fs-6 p-0 m-0 ps-1">Loading... </p>
                        ) : (
                            searchlist.length == 0 ? (
                                <p className="text-danger btn fs-6 p-0 m-0">Patient not found add as new to book appointments</p>
                            ) : (
                                searchlist.map((data) => (
                                    <button className='col-12 d-block p-0 m-0 ms-1 border-0 bg-pearl text-charcoal text-start border border-1' name={data.id} value={data.full_name} onClick={get_value}>{data.full_name}  {data.phone_number}</button>
                                )))

                        )

                    }
                </div>
                <hr className='p-0 m-0 mt-1' />
                <div className="col-12 text-center py-1">
                {
                        cliniclist.map((data, i) => (
                        <label className={`d-${clinicID == data.id ? 'block' : 'none'}`}><input type="checkbox" className="radio form me-1" checked={clinicID == data.id ? true : false} /> {data.title} {data.address}</label>

                        ))
                 }
                </div>
                <div className="row p-0 m-0 text-center">
                    <div className="col-5 p-0 m-0">
                        <button className='button button-charcoal shadow'>{props.DoctorID}.{props.DoctorName}</button>
                    </div>
                    <div className="col-4 p-0 m-0">
                        <input type="date" disabled value={APIDate} className="form-control selectdate" />
                    </div>
                    <div className="col-3 p-0 m-0">
                        <button className='button-sm button-lightgreen'>{tConvert(props.selectedtime)}</button>
                    </div>

                </div>
                <hr className='p-0 m-0 mt-2' />{
                    load ? (
                        <div className="col-6 py-2 pb-2 m-auto text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="col-6 py-2 pb-2 m-auto text-center">
                            <button className="button button-burntumber" onClick={BookAppointment}> Done </button>
                        </div>

                    )
                }

            </div>
        </>

    )
}
export { SelectedTimeAppointment }
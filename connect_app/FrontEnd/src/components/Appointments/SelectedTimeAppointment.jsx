import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorsList, URL, Doctorapi, TodayDate } from '../../index'
import Notiflix from 'notiflix';
import '../../css/bootstrap.css'

const SelectedTimeAppointment = (props) => {
    const url = useContext(URL);
    // const DocApi = useContext(Doctorapi)
    // const Doclist = useContext(DoctorsList)
    const APIDate = useContext(TodayDate)
    const [cliniclist, setcliniclist] = useState([])
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [doctorid, setdoctorid] = useState()
    const [clinicid, setclinicid] = useState(props.DocClinic)
    const [time, settime] = useState()
    const [ischecked, setischecked] = useState()

    const [load, setload] = useState()
    let adminid = localStorage.getItem('id')

    // function ClinicList() {
    //     axios.get(`${url}/clinic/list`).then((response) => {
    //         setcliniclist(response.data.data)
    //     })
    // }
    // useEffect(() => {
    //     ClinicList()
    // }, [])

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
        setsearchinput(e.target.value)
        axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data)
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

    return (
        <>
            <h5 className="text-center m-0 p-0 mt-2">Quick Appointment</h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.closeAddAppointmentform() }} ></button>
            <div className="col-12 p-0 mt-2">
                <input type="text" placeholder='Search Patient using Number or Name' className="form-control selectpatient col-10 position-relative" value={searchinput ? searchinput : ''} onChange={searchpatient} onBlur={searchpatient} />
                <div className={`col-8  d-${displaysearchlist} `} style={{ minHeight: '4rem' }}>
                    {
                        searchlist.map((data) => (
                            <button className='col-12 d-block p-0 m-0 border-0 bg-pearl text-charcoal text-start border border-1 shadow' name={data.id} value={data.full_name} onClick={get_value}>{data.full_name}  {data.phone_number}</button>
                        ))
                    }
                </div>
                {
                    searchlist == undefined ? (
                        <p className="text-danger btn fs-6 p-0 m-0">Type to Search</p>) : (
                        searchlist.length == 0 ? (
                            <p className="text-danger btn fs-6 p-0 m-0">Patient not found. Add as new User to book an Appointment</p>
                        ) : (<p className="text-danger btn fs-6 p-0 m-0"></p>)
                    )

                }
                <hr className='p-0 m-0 mt-1' />
                <div className="col-12 text-center py-1">
                    <input type='checkbox' checked value={1} /><label className='p-0 m-0 text-burntumber'>Aartas Clinishare Ring Road,Delhi </label>
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
            {/* <div className="col-12 form-control location  border-0" >
                    {
                        cliniclist.map((data, i) => (
                            <>
                                <label><input type="checkbox" className="radio form me-1" checked={ischecked == i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
                                <br /></>
                        ))
                    }
                </div> */}
            {/* <div className="row p-0 m-0">
                    <div className="col-md-6">
                        <label>Selected Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control selectdoctor" value={props.DoctorID} >
                                {
                                    Doclist.map((data) => (
                                        <option className='text-charcoal' value={data[0]}>{data[0]}.{data[1]} </option>
                                    ))
                                }
                            </select>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="">Selected Date</label>
                        <div className="col-12"><input type="date"  value={time ? time : APIDate}  className="form-control selectdate" />
                        </div>
                    </div>
                </div> */}

            {/* <p className="m-0 mb-2">Select Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12">
                    {props.timeslots ? (
                        <>
                            {
                                props.timeslots.map((data, i) => (
                                    data[1] == 0 ? (
                                        <button className={`button button-${timeindex ? timeindex == i ? 'pearl' : 'lightgreen' : props.timeindex == i ? 'pearl':'lightgreen'} m-1`} value={data[2]} key={i}>{tConvert(data[0])}</button>
                                    ) : (
                                        <button disabled className='btn button-burntumber m-1' key={i} value={data[2]}>{tConvert(data[1])}</button>
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
                </div> */}

        </>

    )
}
export { SelectedTimeAppointment }
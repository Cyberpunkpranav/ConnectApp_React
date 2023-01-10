import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { DoctorsList, URL, Doctorapi,TodayDate} from '../../index'
import Notiflix from 'notiflix';
import '../../css/bootstrap.css'
import { customconfirm } from '../features/notiflix/customconfirm'

const AddAppointment = (props) => {
    const url = useContext(URL);
    const DocApi = useContext(Doctorapi)
    const Doclist = useContext(DoctorsList)
    const CurrentDate = useContext(TodayDate)
    const [cliniclist, setcliniclist] = useState([])
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [doctorid, setdoctorid] = useState()
    const [clinicid, setclinicid] = useState()
    const [time, settime] = useState()
    const [ischecked, setischecked] = useState()
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
        settime(e.target.value)
    }

    const [ApikeyDocTimeslots, setApikeyDocTimeslots] = useState()
    const [ApiDocTimefrom, setApiDocTimefrom] = useState();

    function getTimeslots(e) {
        setdoctorid(e.target.value)
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
    }

    function BookAppointment(e) {
            if (patientid && doctorid && clinicid && time && adminid) {
                Notiflix.Loading.circle('Adding Appointment',{
                    backgroundColor:'transparent',
                    svgColor:'#96351E'
                })
                axios.post(`${url}/add/appointment`, {
                    patient_id: patientid,
                    doctor_id: doctorid,
                    clinic_id: clinicid,
                    timeslot_id: time,
                    admin_id: adminid
                }).then((response) => {
                    Notiflix.Loading.remove()
                    Notiflix.Notify.success(response.data.message);
                    resetform()
                    props.toggleappointmentform()
                    props.fetchapi()
                    getTimeslots()
                    getTimefrom()

                })
            } else {
                e.preventDefault()
                Notiflix.Notify.warning('Please Fill all Detais');
            }
        
    }
    const [timeindex, settimeindex] = useState()

    const confirmmessage=(e)=>{
        e.preventDefault()
        customconfirm()
        Notiflix.Confirm.show(
            `Update Appointment Details`,
            `Do you surely want yo update ${props.patientname} Appointment Details`,
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
    return (
        <>
            <h5 className="text-center mt-2">New Appointment</h5>
            {
                props.closeAddAppointmentform ?(
                    <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.closeAddAppointmentform()}} ></button>
                ):(
                    <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={(e) => { props.toggleappointmentform(); }} ></button>
                )
            }   
            <hr />
            <div className="col-12">
                <label className="m-0 mb-2">Search Using Phone or Name</label>
                <input type="text" className="form-control selectpatient col-10 position-relative" value={searchinput ? searchinput : ''} onChange={searchpatient} onBlur={searchpatient} />
                <div className={`col-8 d-${displaysearchlist} searchinput`}>
                    {
                        searchlist.map((data ,i) => (
                            <button className='col-12 p-0 m-0 border-0 bg-pearl text-charcoal text-start border border-1 shadow'key={i} name={data.id} value={data.full_name} onClick={get_value}>{data.full_name}  {data.phone_number}</button>
                        ))
                    }
                </div>
                {
                    searchlist && searchlist.length < 1 ? (
                        <p className="text-danger btn fs-6 p-0 m-0">Patient not found. Add as new User to book an Appointment</p>
                    ) : (<p className="text-danger btn fs-6 p-0 m-0"></p>)
                }

                <div className="col-12 p-0">
                    <a href="/#" className="btn text-decoration-none btn-sm done" onClick={props.formshift}> Add User </a>
                </div>
                <hr />
                <label>Select Location</label>
                <div className="col-12 form-control location  border-0" >
                    {
                        cliniclist.map((data,i) => (
                            <>
                                <label><input type="checkbox" className="radio form me-1" key={i} checked={ischecked == i ? true:false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
                                <br /></>
                        ))
                    }
                </div>
                <hr />
                <div className="row p-0 m-0">
                    <div className="col-md-6">
                        <label>Select Doctor</label>
                        <div className="col-12">
                            <select className="col-10 form-control selectdoctor" value={doctorid?doctorid:''} onChange={getTimeslots}>
                                <option value="Select Doctor" >Select Doctor</option>
                                {
                                    Doclist.map((data,i) => (
                                        <option className={`text-charcoal`} key={i} value={data[0]}>{data[0]}.{data[1]}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="">Select Date</label>
                        <div className="col-12"><input type="date" className="form-control selectdate" onChange={getTimefrom} />
                        </div>
                    </div>
                </div>

                <hr />

                <p className="m-0 mb-2">Select Time Slot</p>
                <div className="scroll align-items-center justify-content-around col-12">
                    {ApiDocTimefrom && doctorid ? (
                        <>
                            {
                                ApiDocTimefrom.map((data, i) => (
                                    data[2] == 0 ? (
                                        <button className={`button button-${props.timeindex == i ? 'pearl' : timeindex == i ? 'pearl' : 'lightgreen'} m-1`} value={data[0]} key={i} onClick={(e) => { gettime_value(e); settimeindex(i); }}>{tConvert(data[1])}</button>
                                    ) : (
                                        <button disabled className='btn button-burntumber m-1' key={i} value={data[0]}>{tConvert(data[1])}</button>
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
                <div className="col-6 py-2 pb-2 m-auto text-center">
                    <button  className="btn button button-burntumber px-5" onClick={confirmmessage}> Done </button>
                </div>
                <div className="col-6 pb-2 m-auto text-center">
                    <button className="btn btn-light px-5" onClick={resetform}>Reset</button>
                </div>
            </div>
        </>

    )
}
export { AddAppointment }
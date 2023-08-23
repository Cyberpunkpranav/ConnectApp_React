import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import '../../css/dashboard.css'
import { AddAppointment } from '../Today/AddAppointment'
import { URL, TodayDate } from '../../index'
import { Permissions } from '../../index'
import Notiflix from 'notiflix'

const SearchField = (props) => {
    const permission = useContext(Permissions)
    const todaydate = useContext(TodayDate)
    const url = useContext(URL)
    const [searchload, setsearchload] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [patientname, setpatientname] = useState()
    const [appointmentform, setappointmentform] = useState("none")
    const [doctorid, setdoctorid] = useState([])
    // async function searchpatient() {
    //     setsearchload(true)
    //     setpatientid()
    //     setpatientname()
    //     await axios.get(`${url}/patient/list?search=${props.searchtext}&limit=5&offset=0`).then((response) => {
    //         setsearchlist(response.data.data.patients_list)
    //         setsearchload(false)
    //     })

    //     if (props.searchtext && props.searchtext.length > 1) {
    //         setdisplaysearchlist('block')
    //     } else {
    //         setdisplaysearchlist('none')
    //     }
    // }

    async function searchpatient() {
        try {
            setsearchload(true)
            setpatientid()
            setpatientname()

            await axios.get(`http://192.168.3.87:8080/Patient/Doctors/Appointments?search=${props.searchtext}`).then((response) => {
                
                setsearchlist(response.data.data.patient)
                setsearchload(false)
            })
            if (props.searchtext && props.searchtext.length > 1) {
                setdisplaysearchlist('block')
            } else {
                setdisplaysearchlist('none')
            }
        } catch (e) {
            //    Notiflix.Notify.failure(e.message)
            alert(e)
        }

    }
    useEffect(() => {
        searchpatient()
    }, [props.searchtext])
    const get_value = (e) => {
        setpatientid(e.target.name)
        setpatientname(e.target.value)
        toggleappointmentform()
    }
    const toggleappointmentform = () => {
        if (appointmentform === "none") {
            setappointmentform("block")
        } else if (appointmentform === "block") {
            setappointmentform("none")
        }
    }
    const Mostly_treated_By = (data) => {
        let count = []
        let max = 0
        let doc = ''
        let obj = {
            appointments: '',
            doctor: '',
        }
        if (data != null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].Appointments != null) {
                    obj[i] = {
                        appointments: data[i].Appointments.length,
                        doctor: data[i].doctor_name
                    }
                    count.push(obj[i])
                }

            }
          
            let arr = []
            for (let k = 0; k < count.length; k++) {
                arr.push(count[k].appointments)
            }
            if (arr.length != 0) {
                max = Math.max(...arr)
            }
            count.map((data) => {
                if (data.appointments == max) {
                  
                    doc = "Dr." + data.doctor
                }
            })
        
        }

        return doc
    }


    return (
        <>
            <div className={`col-12 d-${displaysearchlist} searchlist bg-pearl rounded-2 p-0 m-0`} style={{ minHeight: 'fit-content' }}>
                {
                    searchload ? (
                        <h6 className="row p-0 m-0 mainsearch text-charcoal75 rounded-1 p-2" >Loading... </h6>
                    ) : (
                        searchlist && searchlist.length == 0 ? (
                            <h6 className="text-danger fw-bold mainsearch bg-lightred50 p-0 m-0 p-2" >Patient not found. Add as new to book appointments</h6>
                        ) : (
                            <div className='rounded-2 mainsearch'>
                                {/* <p className='text-secondary p-0 m-0 text-start fw-bold ps-2' style={{ fontSize: '0.8rem' }}>{searchlist.length} searches found</p> */}
                                {
                                    searchlist && searchlist.map((data) => (
                                        <div className='row p-0 m-0 bg-pearl p-2 border-top rounded-bottom align-items-center justify-content-between px-lg-3'>
                                            <small className='text-start p-0 m-0'>Mostly treated by<span className='text-burntumber p-0 m-0 mx-1 fw-bold'> {Mostly_treated_By(data.doctor)}</span></small>
                                            <div className="col-8 col-xl-6 col-lg-9 col-md-8 p-0 m-0 text-start ps-lg-2">
                                                <h6 className=' p-0 m-0 border-0 text-charcoal bg-pearl text-start text-wrap fw-bold ' >{data.patient_name}</h6>
                                                <small className='p-0 m-0 border-0 text-charcoal75 bg-pearl text-start text-wrap fw-bold ' > {data.phone_number}</small>
                                            </div>
                                            <div className="col-4 p-0 m-0 align-self-center justify-content-center">
                                                <button className={`button-sm button-pearl text-burntumber border fw-bold border-0 p-0 m-0 d-${permission.appointment_add == 1 ? '' : 'none'}`} name={data.patient_id} value={data.patient_name} onClick={(e) => get_value(e)} style={{ fontSize: '0.8rem' }}>+Appointment</button>
                                            </div>
                                            <div className="d-flex scroll p-0 m-0">
                                                {
                                                    data.doctor.map((Data) => (
                                                        Data.Appointments != null ? (
                                                            <button className={`button-charcoal-outline button-sm me-2 rounded-1 d-${permission.appointment_add == 1 ? '' : 'none'}`} name={data.patient_id} value={data.patient_name} onClick={(e) => { get_value(e); setdoctorid(Data.doctor_id) }}>{Data.doctor_name}<span className='p-0 m-0 ms-2 text-burntumber fw-bold'>{Data.Appointments.length}</span> </button>
                                                        ) : (<></>)
                                                    ))
                                                }
                                            </div>

                                        </div>

                                    ))
                                }
                            </div>
                        )


                    )

                }
            </div>
            <div className={`rounded-4 bg-seashell mt-4 appointmentinfosection d-${appointmentform} border p-2 border-1 position-absolute`} style={{ maxWidth: '25rem', right: '-3vh', top: '0' }}>
                <AddAppointment fetchapi={props.fetchapi} doctorid={doctorid} todaydate={todaydate} toggleappointmentform={toggleappointmentform} patientidfromsearch={patientid} patientnamefromsearch={patientname} />
            </div>
        </>
    )
}

export { SearchField }
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import '../../css/dashboard.css'
import { AddAppointment } from '../Today/AddAppointment'
import { URL } from '../../index'
import { Permissions } from '../../index'

const SearchField = (props) => {
    const permission = useContext(Permissions)
    const url = useContext(URL)
    const [searchload, setsearchload] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [patientname, setpatientname] = useState()
    const [appointmentform, setappointmentform] = useState("none")
    async function searchpatient() {
        setsearchload(true)
        setpatientid()
        setpatientname()
        await axios.get(`${url}/patient/list?search=${props.searchtext}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data.patients_list)
            setsearchload(false)
        })

        if (props.searchtext && props.searchtext.length > 1) {
            setdisplaysearchlist('block')
        } else {
            setdisplaysearchlist('none')
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
    console.log(searchlist)
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
                                        <div className='row p-0 m-0 bg-pearl p-1 border-top rounded-bottom align-items-center justify-content-between px-lg-3'>

                                            <div className="col-9 col-xl-6 col-lg-9 col-md-12 p-0 m-0 text-start ps-lg-2">
                                                <p className=' p-0 m-0 border-0 text-charcoal bg-pearl text-start text-wrap fw-bold ' >{data.full_name}</p>
                                                <small className='p-0 m-0 border-0 text-charcoal75 bg-pearl text-start text-wrap fw-bold ' > {data.phone_number}</small>
                                            </div>
                                            <div className="col-auto p-0 m-0 align-self-center justify-content-center">
                                                <button className={`button-sm button-pearl text-burntumber border fw-bold border-0 p-0 m-0 d-${permission.appointment_add == 1 ? '' : 'none'}`} name={data.id} value={data.full_name} onClick={(e) => get_value(e)} style={{ fontSize: '0.8rem' }}>+Appointment</button>
                                            </div>
                                        </div>

                                    ))
                                }
                            </div>
                        )


                    )

                }
            </div>
            <div className={`rounded-4 bg-seashell end-0 appointmentinfosection d-${appointmentform} border-start border-top border-2 position-absolute`} style={{ width: '30rem', top: '-2rem' }} >
                <AddAppointment fetchapi={props.fetchapi} toggleappointmentform={toggleappointmentform} patientidfromsearch={patientid} patientnamefromsearch={patientname} />
            </div>
        </>
    )
}

export { SearchField }
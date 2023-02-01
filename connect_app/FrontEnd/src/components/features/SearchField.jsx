import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import '../../css/dashboard.css'
import { AddAppointment } from '../Today/AddAppointment'
import { URL } from '../../index'

const SearchField = (props) => {
    const url = useContext(URL)
    const [searchload, setsearchload] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid, setpatientid] = useState()
    const [patientname, setpatientname] = useState()
    
    const [appointmentform, setappointmentform] = useState("none");
    async function searchpatient() {
        setsearchload(true)
        setpatientid();
        setpatientname();
        await axios.get(`${url}/patient/list?search=${props.searchtext}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data)
            setsearchload(false)
        })

        if (props.searchtext.length > 1) {
            setdisplaysearchlist('block');
        } else {
            setdisplaysearchlist('none');
        }
    }
    useEffect(() => {
        searchpatient()
    }, [props.searchtext])

    const get_value = (e) => {
        setpatientid(e.target.name);
        setpatientname(e.target.value);
        toggleappointmentform()
    }


    const toggleappointmentform = () => {
      if (appointmentform === "none") {
        setappointmentform("block");
      } else if (appointmentform === "block") {
        setappointmentform("none");
      }
    };
    return (
        <>
        <div className={`col-12 d-${displaysearchlist} searchlist `} style={{ minHeight: '4rem' }}>
            {
                searchload ? (
                    <div className="row p-0 m-0 text-charcoal75 fs-6 " style={{width:'50vh'}}>Loading... </div>
                ) : (
                    searchlist.length == 0 ? (
                        <div className="text-danger btn fs-6 p-0 m-0">Patient not found add as new to book appointments</div>
                    ) : (
                        searchlist.map((data) => (
                            <div className='row p-0 m-0 bg-seashell py-1 border'>
                                <div className="col-8 col-xl-8 col-lg-8 p-0 m-0">
                                    <button className=' p-0 m-0 border-0 text-charcoal text-start' >{data.full_name} {data.phone_number}</button>
                                </div>
                                <div className="col-4 col-xl-4 col-lg-4 p-0 m-0 align-self-center justify-content-center">
                                    <button className="button button-burntumber border-0 p-0 m-0 px-1" name={data.id} value={data.full_name} onClick={(e) => get_value(e)} style={{fontSize:'0.8rem' }}>+Appointment</button>
                                </div>
                            </div>

                        )))

                )

            }
        </div>
        <div className={`rounded-4 bg-seashell end-0 appointmentinfosection d-${appointmentform} border-start border-top border-2 position-absolute`} style={{width:'30rem',top:'-2rem'}} >
        <AddAppointment fetchapi={props.fetchapi} toggleappointmentform={toggleappointmentform} patientidfromsearch={patientid} patientnamefromsearch={patientname}/>
       </div>
        </>
    )
}

export { SearchField }
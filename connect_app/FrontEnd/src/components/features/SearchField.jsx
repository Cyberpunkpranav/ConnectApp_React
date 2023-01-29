import React, { useState,useEffect,useContext } from 'react'
import axios from 'axios'
import { URL } from '../../index'

const SearchField = (props) => {
    const url =useContext(URL)
    const [searchload,setsearchload] = useState()
    const [searchlist,setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [patientid,setpatientid]=useState()
    async function searchpatient() {
        setsearchload(true)
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
    }
  return (
                <div className={`col-12 d-${displaysearchlist} `} style={{ minHeight: '4rem' }}>
                    {
                        searchload ? (
                            <p className="btn text-charcoal75 fs-6 p-0 m-0 ps-1">Loading... </p>
                        ) : (
                            searchlist.length == 0 ? (
                                <p className="text-danger btn fs-6 p-0 m-0">Patient not found add as new to book appointments</p>
                            ) : (
                                searchlist.map((data) => (
                                    <div className='row p-0 m-0 bg-seashell py-1 border scroll scroll-y'>
                                        <div className="col-auto p-0 m-0">
                                        <button className=' p-0 m-0 border-0 text-charcoal text-start' name={data.id} value={data.full_name} onClick={get_value}>{data.full_name} {data.phone_number}</button>
                                        </div>
                                    <div className="col-4 p-0 m-0">
                                    <button className="button button-sm button-burntumber" onClick={props.toggleappointmentform} style={{fontSize:'0.8rem'}}>+ Appointment</button>
                                    </div>
                                    </div>
                                    
                                )))

                        )

                    }
                </div>
  )
}

export {SearchField}
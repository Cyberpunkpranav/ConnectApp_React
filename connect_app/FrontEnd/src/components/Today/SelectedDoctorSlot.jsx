import React from 'react'
import { useState, useEffect, useContext } from "react"
import axios from "axios"
//Notiflix
import Notiflix from 'notiflix'
import { customconfirm } from '../features/notiflix/customconfirm'
//Context APIs
import { URL, TodayDate, DoctorsList } from '../../index'

const AddSelectedDoctorSlot = (props) => {
    const url = useContext(URL)
    const APIDate = useContext(TodayDate)
    const Doctors = useContext(DoctorsList)

    const [adddoctorfortoday, setadddoctorfortoday] = useState();
    const [docdate, setdocdate] = useState();
    const [fromtime, setfromtime] = useState();
    const [totime, settotime] = useState();
    const [clinicid, setclinicid] = useState();

    let admin_id = localStorage.getItem('id');

    async function AddSelectedDoctorSlot() {

            if (props.DoctorID && APIDate && fromtime && totime && clinicid && admin_id) {
                Notiflix.Loading.pulse({
                    backgroundColor: 'rgb(242, 242, 242,0.5)',
                    svgColor: '#96351E'
                })
                await axios.post(`${url}/doctor/add/timeslots`, {
                    doctor_id: props.DoctorID,
                    date: APIDate,
                    time_from: fromtime,
                    time_to: totime,
                    clinic_id: clinicid,
                    admin_id: admin_id
                }).then((response) => {
                    Notiflix.Loading.remove();
                    props.CloseAddQuickSlots()
                    props.fetchapi()
                    Notiflix.Notify.success(response.data.message)
                })
            } else {
                Notiflix.Notify.warning('Please Fill all Detais')
            }
        
    }

    const [ischecked, setischecked] = useState()
    const [cliniclist, setcliniclist] = useState([])
    function ClinicList() {
        axios.get(`${url}/clinic/list`).then((response) => {
            setcliniclist(response.data.data)
        })
    }
    useEffect(() => {
        ClinicList()
    }, [])

    const confirmmessage = () => {

        customconfirm()
        Notiflix.Confirm.show(
            `Update Appointment Details`,
            `Do you surely want to add the selected Doctor Time Slots`,
            'Yes',
            'No',
            () => {
                AddSelectedDoctorSlot()
            },
            () => {
                return 0
            },
            {
            },
        );
    }


    return (

        <div className='container position-relative'>
            <h5 className="text-center">Quick Add TimeSlots</h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={props.CloseAddQuickSlots} ></button>
            <hr />
            <div className="col-12">
                {
                    cliniclist.map((data, i) => (
                        <>
                            <label><input type="checkbox" className="radio form me-1" checked={ischecked == i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
                            <br /></>
                    ))
                }
            </div>
            <div className="row">
            <div className="col-6">
                <button className='button button-charcoal shadow'>{props.DoctorName}</button>
            </div>
              <div className="col-6">
        <input type="date" disabled className="form-control col-10" value={APIDate}/>
        </div>
            </div>
            <hr />
            <div className="d-flex">
                <input type="time" className="form-control" value={fromtime ? fromtime : ''} onChange={(e) => { setfromtime(e.target.value) }} />
                <div>_</div>
                <input type="time" className="form-control" value={totime ? totime : ''} onChange={(e) => { settotime(e.target.value) }} />
            </div>


            <hr />
            <div className="col-6 py-2 pb-2 m-auto text-center">
                <button className="button button-burntumber px-5" onClick={confirmmessage} > Done </button>
            </div>
        </div>
    )
}

export { AddSelectedDoctorSlot }
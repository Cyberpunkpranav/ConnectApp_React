import React from 'react'
import { useState, useEffect, useContext } from "react"
import axios from "axios"
//Notiflix
import Notiflix from 'notiflix'
import { customconfirm } from '../features/notiflix/customconfirm'
//Context APIs
import { URL, TodayDate, DoctorsList, Clinic } from '../../index'
import { DOCTORNAME, DOCTORID } from '../../components/App/Clinic'

const AddSelectedDoctorSlot = (props) => {
    const url = useContext(URL)
    const APIDate = useContext(TodayDate)
    const doctorname = useContext(DOCTORNAME)
    const doctorid = useContext(DOCTORID)
    const Doctors = useContext(DoctorsList)
    const cliniclist = useContext(Clinic)
    const admin_id = localStorage.getItem('id')
    const clinicID = localStorage.getItem('ClinicId')
    const [adddoctorfortoday, setadddoctorfortoday] = useState()
    const [docdate, setdocdate] = useState()
    const [fromtime, setfromtime] = useState()
    const [totime, settotime] = useState()
    const [clinicid, setclinicid] = useState(clinicID)

    async function AddSelectedDoctorSlot() {

        if (doctorid && APIDate && fromtime && totime && clinicid && admin_id) {
            Notiflix.Loading.pulse({
                backgroundColor: 'rgb(242, 242, 242,0.5)',
                svgColor: '#96351E'
            })
            await axios.post(`${url}/doctor/add/timeslots`, {
                doctor_id: doctorid,
                date: APIDate,
                time_from: fromtime,
                time_to: totime,
                clinic_id: clinicid,
                admin_id: admin_id
            }).then((response) => {
                Notiflix.Loading.remove()
                props.CloseAddQuickSlots()
                props.fetchapi()
                Notiflix.Notify.success(response.data.message)
            })
        } else {
            Notiflix.Notify.warning('Please Fill all Detais')
        }

    }
    const confirmmessage = () => {
        customconfirm()
        Notiflix.Confirm.show(
            `Update Doctor Slot`,
            `Do you surely want to add more Time Slots of Dr. ${doctorname}`,
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
        )
    }
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }
    }

    return (

        <div className='container position-relative'>
            <h5 className="text-center pt-1">Quick Add TimeSlots</h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={props.CloseAddQuickSlots} ></button>
            <hr className='p-0 m-0' />
            <div className="col-12 text-center clinics">
                {
                    cliniclist.map((data, i) => (
                        <label className={`d-${clinicID == data.id ? 'block' : 'none'}`}><img src={process.env.PUBLIC_URL + '/images/location.png'} style={{ width: '1.5rem' }} />{data.title} {data.address}</label>

                    ))
                }
            </div>
            <div className="row mt-2 justify-content-center gx-2">
                <div className="col-auto">
                    <button className='button button-charcoal50-outline'>{doctorname}</button>
                </div>
                <div className="col-auto">
                    <div type="date" disabled className="form-control col-10 button button-charcoal50-outline" >{reversefunction(APIDate)}</div>
                </div>
            </div>
            <div className="row p-0 m-0 mt-2 justify-content-center">
                <div className="col-5">
                    <input type="time" className="form-control bg-seashell border-charcoal" value={fromtime ? fromtime : ''} onChange={(e) => { setfromtime(e.target.value) }} />
                </div>
                <div className='col-auto'>-</div>
                <div className="col-5">
                    <input type="time" className="form-control bg-seashell border-charcoal" value={totime ? totime : ''} onChange={(e) => { settotime(e.target.value) }} />
                </div>

            </div>
            <div className="col-6 py-2 pb-2 m-auto text-center">
                <button className="button button-charcoal px-5" onClick={confirmmessage} > Done </button>
            </div>
        </div>
    )
}

export { AddSelectedDoctorSlot }
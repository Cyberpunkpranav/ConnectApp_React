import React from 'react'
import { useState, useEffect, useContext } from "react"
import axios from "axios"
//Notiflix
import Notiflix from 'notiflix'
import { customconfirm } from '../features/notiflix/customconfirm'
//Context APIs
import { URL, TodayDate, DoctorsList, TodayDocs,Clinic } from '../../index'

const AddDoctorSlot = (props) => {
  const url = useContext(URL)
  const APIDate = useContext(TodayDate)
  const Doctors = useContext(DoctorsList)
  const TodayDoctors = useContext(TodayDocs)
  const cliniclist = useContext(Clinic)
  const clinicID = localStorage.getItem('ClinicId')
  const [adddoctorfortoday, setadddoctorfortoday] = useState();
  const [docdate, setdocdate] = useState();
  const [fromtime, setfromtime] = useState();
  const [totime, settotime] = useState();
  const [load, setload] = useState();

  let admin_id = localStorage.getItem('id');
  async function AddDoctorForToday(e) {

    if (adddoctorfortoday && docdate && fromtime && totime && clinicID && admin_id) {
      setload(true)
      await axios.post(`${url}/doctor/add/timeslots`, {
        doctor_id: adddoctorfortoday,
        date: docdate,
        time_from: fromtime,
        time_to: totime,
        clinic_id: clinicID,
        admin_id: admin_id
      }).then((response) => {
        props.toggledoctorform();
        resetform()
        setload(false)
        props.fetchapi()
        Notiflix.Notify.success(response.data.message)
      })
    } else {
      Notiflix.Notify.warning('Please Fill all Detais')
      setload(false)
    }
  }


  const [doctorform, setdoctorform] = useState("none")

  const toggledoctorform = () => {
    if (doctorform === "none") {
      setdoctorform("block");
    }
    if (doctorform === "block") {
      setdoctorform("none");
    }
  }

  const resetform = () => {
    setadddoctorfortoday()
    setdocdate()
    setfromtime()
    settotime()
  }
  const confirmmessage = (e) => {
    e.preventDefault()
    customconfirm()
    Notiflix.Confirm.show(
      `Add Doctor Time Slots`,
      `Do you surely want to add the following Doctor`,
      'Yes',
      'No',
      () => {
        AddDoctorForToday()
      },
      () => {
        return 0
      },
      {
      },
    );
  }

  const Avaliablemessage = (response) => {
    for (let k = 0; k < TodayDoctors.length; k++) {
      if (TodayDoctors[k][0] !== undefined) {
        if (TodayDoctors[k][0] == response) {
          return '(Already added)'
        }
      }
    }

  }
  return (

    <div className='container px-2'>
      <h5 className="text-center mt-2">Slot Details</h5>
      <button type="button" className="btn-close closebtn position-absolute" disabled={load == true ? true : false} aria-label="Close" onClick={props.toggledoctorform} ></button>
      <hr />
      <div className="col-12">
        <select className="col-10 form-control selectdoctor" value={adddoctorfortoday ? adddoctorfortoday : ''} onChange={(e) => { setadddoctorfortoday(e.target.value) }}>
          <option defaultValue="Select Doctor">Select Doctor</option>
          {
            Doctors.map((data) => (
              <option value={data[0]}>{data[0]}.{data[1]}{' '}{Avaliablemessage(data[0])}</option>
            ))
          }
        </select>
      </div>
      <hr />
      <label>Clinic</label>

      <div className="col-12">
        {
          cliniclist.map((data, i) => (
            <label className={`d-${clinicID == data.id ? 'block' : 'none'}`}><input type="checkbox" className="radio form me-1" checked={clinicID == data.id ? true : false} /> {data.title} {data.address}</label>

          ))
        }
      </div>
      <hr />
      <label>Date</label>
      <div className="col-12"><input type="date" className="form-control col-10" value={docdate ? docdate : ''} onChange={(e) => { setdocdate(e.target.value) }} /></div>
      <hr />
      <label>Time From</label>
      <div className="col-12"><input type="time" className="form-control col-10" value={fromtime ? fromtime : ''} onChange={(e) => { setfromtime(e.target.value) }} /></div>
      <hr />
      <label>Time To</label>
      <div className="col-12"><input type="time" className="form-control col-10" value={totime ? totime : ''} onChange={(e) => { settotime(e.target.value) }} /></div>
      <hr />
      {
        load ? (
          <div className="col-6 py-2 pb-2 m-auto text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="col-6 py-2 pb-2 m-auto text-center">
              <button type="button" className="btn done px-5" onClick={confirmmessage} > Done </button>
            </div>
            <div className="col-6 pb-2 m-auto text-center">
              <button className="btn btn-light px-5" onClick={resetform}>Reset</button>
            </div>
          </>
        )
      }
    </div>
  )
}

export { AddDoctorSlot }
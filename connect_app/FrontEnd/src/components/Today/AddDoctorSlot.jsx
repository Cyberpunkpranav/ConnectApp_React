import React from 'react'
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import Notiflix from 'notiflix'
//Context APIs
import {URL,TodayDate,DoctorsList} from '../../index'

const AddDoctorSlot = (props) => {
    const url = useContext(URL)
    const APIDate = useContext(TodayDate)
    const Doctors = useContext(DoctorsList)

    const [adddoctorfortoday, setadddoctorfortoday] = useState();
    const [docdate, setdocdate] = useState();
    const [fromtime, setfromtime] = useState();
    const [totime, settotime] = useState();
    const [clinicid, setclinicid] = useState();

    let admin_id = localStorage.getItem('id');
    async function AddDoctorForToday(e) {
        if(e.target.value == 'true'){
      if(adddoctorfortoday&&docdate&&fromtime&&totime&&clinicid&&admin_id){
        Notiflix.Loading.pulse({
          backgroundColor:'rgb(242, 242, 242,0.5)',
          svgColor:'#96351E'
        })
      await axios.post(`${url}/doctor/add/timeslots`, {
        doctor_id: adddoctorfortoday,
        date: docdate,
        time_from: fromtime,
        time_to: totime,
        clinic_id: clinicid,
        admin_id: admin_id
      }).then((response) => {
        props.toggledoctorform();
        resetform()
        Notiflix.Loading.remove();
        props.fetchapi() 
        Notiflix.Notify.success(response.data.message)
      })
    }else{
      Notiflix.Notify.warning('Please Fill all Detais')
    }
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



  const [doctorform, setdoctorform] = useState("none")
  
  const toggledoctorform = () => {
    if (doctorform === "none") {
      setdoctorform("block");
    } 
     if (doctorform === "block") {
      setdoctorform("none");
    }
  }

  const resetform=()=>{
    setadddoctorfortoday()
    setclinicid()
    setdocdate()
    setfromtime()
    settotime()
  }

  return (

    <div className='container px-2'>
    <h5 className="text-center mt-2">Slot Details</h5>
    <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={props.toggledoctorform} ></button>
    <hr />
    <div className="col-12">
      <select className="col-10 form-control selectdoctor"  value={adddoctorfortoday ? adddoctorfortoday: ''}  onChange={(e) => {setadddoctorfortoday(e.target.value) }}>
        <option defaultValue="Select Doctor">Select Doctor</option>
        {
          Doctors.map((data) => (
            <option value={data[0]}>{data[0]}.{data[1]}</option>
          ))
        }
      </select>
    </div>
    <hr />
    <label>Clinic</label>
    
    <div className="col-12">
        {
          cliniclist.map((data, i) => (
            <>
              <label><input type="checkbox" className="radio form me-1" checked={ischecked == i ? true : false} name={data.id} onClick={(e) => { setclinicid(e.target.name); setischecked(i); }} /> {data.title} {data.address}</label>
              <br /></>
          ))
        }

      {/* <select className="col-10 form-control selectdoctor" value={clinicid ? clinicid :''}  onChange={(e) => { setclinicid(e.target.value) }}>
        <option defaultValue="Select Doctor">Select Clinic</option>
        <option value='1'>1.Aartas Delhi</option>
      </select> */}
    </div>
    <hr />
    <label>Date</label>
    <div className="col-12"><input type="date" className="form-control col-10" value={docdate ? docdate :''} onChange={(e) => {setdocdate(e.target.value)}} /></div>
    <hr />
    <label>Time From</label>
    <div className="col-12"><input type="time" className="form-control col-10" value={fromtime ? fromtime :''} onChange={(e) => { setfromtime(e.target.value)}} /></div>
    <hr />
    <label>Time To</label>
    <div className="col-12"><input type="time" className="form-control col-10" value={totime ? totime :''} onChange={(e) => {settotime(e.target.value)}} /></div>
    <hr />
    <div className="col-6 py-2 pb-2 m-auto text-center">
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#${props.staticBackdrop}`} class="btn done px-5" onClick={AddDoctorForToday} > Done </button>
            </div>
            <div className="col-6 pb-2 m-auto text-center">
                <button className="btn btn-light px-5" onClick={resetform}>Reset</button>
            </div>
            <div className="modal fade position-absolute" id={`${props.staticBackdrop}`} data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Doctor</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body"> Do you Want to Add the following Doctor</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" value='false' data-bs-dismiss="modal" onClick={AddDoctorForToday} >Close</button>
                            <button type="button" className="btn btn-primary" value='true' data-bs-dismiss="modal" onClick={AddDoctorForToday}>Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
  )
}

export  {AddDoctorSlot}
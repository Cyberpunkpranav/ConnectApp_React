import axios from "axios"
import { useState, useEffect, useContext, useRef } from "react"
import { Appointments_Dsr } from '../Dsr/Appointments_Dsr'
import { Doctors_Dsr } from '../Dsr/Doctors_Dsr'
import { Pharmacy_Dsr } from '../Dsr/Pharmacy_Dsr'
import { URL, TodayDate, DoctorsList, Permissions } from '../../index'
import { Livetime } from "../features/livetime"

function DailySaleReport(props) {
  const permission = useContext(Permissions)
  const Doctors = useContext(DoctorsList)
  const CurrentDate = useContext(TodayDate)
  const clinicid = localStorage.getItem('ClinicId')
  const options = [
    {
      option: 'Appointments',
      display: permission.dsr_appointments ? 1 : 0,
    },
    {
      option: 'Doctors',
      display: permission.dsr_doctor_timings ? 1 : 0,
    },
    {
      option: 'Pharmacy',
      display: permission.dsr_pharmacy ? 1 : 0
    }

  ]
  // permission.dsr_appointments ? 0 :  permission.dsr_doctor_timings ? 1 : permission.dsr_pharmacy ? 2:''
  const [menu, setmenu] = useState(permission.dsr_appointments ? 0 : permission.dsr_doctor_timings ? 1 : permission.dsr_pharmacy ? 2 : '')
  const [type, settype] = useState('text')
  const [doctorid, setdoctorid] = useState()
  const [doctorname, setdoctorname] = useState()
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [clinic, setclinic] = useState(clinicid)
  const [clinicname, setclinicname] = useState("Aartas CliniShare Delhi")


  function ToggleOptions(_menu) {
    if (permission.dsr_appointments == 1 && _menu == 0) {
      return <Appointments_Dsr clinic={clinic} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    if (permission.dsr_doctor_timings == 1 && _menu == 1) {
      return <Doctors_Dsr clinicid={clinicid} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    if (permission.dsr_pharmacy == 1 && menu == 2) {
      return <Pharmacy_Dsr clinicid={clinicid} doctorid={doctorid} fromdate={fromdate ? fromdate : CurrentDate} todate={todate ? todate : fromdate} />
    }
    return <div>Please Select an Option from above</div>
  }

  return (

    <div className="DSRsection mt-1">
      <div className="p-0 m-0 mb-2">
        <div className="row p-0 m-0 options align-items-center bg-seashell ">
          <div className=" hstack gap-3 d-flex p-0 m-0 p-1 align-items-center">
            {
              options.map((data, i) => (
                <>
                  <div className={`col-auto p-0 m-0 d-${data.display == 1 ? '' : 'none'}`}>
                    <button className={`button m-0 p-0 px-2 py-1 ms-1 border-0 button-${i == menu ? 'charcoal' : 'seashell text-charcoal75 fw-bold'} `} id={i} key={i} onClick={() => { setmenu(i) }}>{data.option}</button>
                  </div>
                  <div className={`vr rounded-1 h-50 align-self-center d-${data.display == 1 ? '' : 'none'}`} style={{ padding: '0.8px' }}></div>
                </>
              ))
            }
          </div>

        </div>

          <div className="row p-0 m-0 align-items-center align-self-center mt-2 ms-2 ">
          <div className="col-auto p-0 m-0 bg-seashell rounded-2">
          <div className="dropdown ">
            <button className=" button button-seashell text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {clinicname?clinicname:"Select Clnic"} </button>
            <ul className="dropdown-menu bg-seashell border-0 shadow-sm" >
            {
                        props.cliniclist ? (
                          props.cliniclist.map((data) => (
                            <li className={`text-start p-2 text-charcoal fw-bolder border-bottom py-2 text-${clinic==data.id ? 'white':'charcoal'} bg-${clinic==data.id?'charcoal':''}`} onClick={() => { setclinic(data.id);setclinicname(data.title) }}>{data.title} </li>
                          ))
                        ) : (
                          <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" >Loading...</li>
                          )
            }
            </ul>
          </div>
                    {/* <select className="button button-seashell fw-bolder border-0 w-100 custom_select" value={clinic ? clinic : ''} onChange={(e) => { setclinic(e.target.value) }}>
                      <option value="Select Clinic">Clinic</option>
              
                    </select> */}
                    </div>
                    <div className="col-auto p-0 m-0 ms-1 bg-seashell rounded-2">
                    <div className="dropdown ">
            <button className=" button button-seashell text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {doctorname?doctorname:"Select Doctor"} </button>
            <ul className="dropdown-menu bg-seashell border-0 scroll-y scroll" style={{maxHeight:'50vh'}} >
            <li className={`text-start p-2 text-charcoal fw-bolder border-bottom py-2 text-${doctorid=='' ? 'white':'charcoal'} bg-${doctorid==''?'charcoal':''}`} onClick={() => { setdoctorid('');setdoctorname(`` ) }}>All Doctors </li>
            {
                        Doctors ? (
                          Doctors.map((data) => (
                            <li className={`text-start p-2 text-charcoal fw-bolder border-bottom py-2 text-${doctorid==data[0] ? 'white':'charcoal'} bg-${doctorid==data[0]?'charcoal':''}`} onClick={() => { setdoctorid(data[0]);setdoctorname(`Dr.${data[1]}` ) }}>Dr.{data[1]}  </li>
                          ))
                        ) : (
                          <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" >Loading...</li>
                          )
            }
            </ul>
          </div>
                    {/* <select className="button button-seashell fw-bolder border-0 w-100" value={doctorid ? doctorid : ''} onChange={(e) => setdoctorid(e.target.value)}>
                      <option value='Doctors'>Select Doctor</option>
                      {
                        Doctors.map((data) => (
                          <>
                            <option className="text-start" value={data[0]}> Dr.{data[1]} </option>

                          </>
                        ))
                      } 
                    </select> */}
                    </div>
                    <div className="col-5 bg-seashell rounded-2 ms-1 ">
                    <div className="row p-0 m-0 text-center justify-content-between bg-seashell align-items-center align-self-center">
                      <div className="col-5 p-0 m-0">
                      <input type='date' placeholder="from Date" value={fromdate ? fromdate : CurrentDate ? CurrentDate : ''} className='button button-seashell w-100 border-0 rounded-0 fw-bolder text-charcoal ' onChange={(e) => setfromdate(e.target.value)} />

                      </div>
                      <div className="col-auto p-0 m-0"> - </div>
                      <div className="col-5 p-0 m-0">
                      <input type='date' placeholder="to Date" value={todate ? todate :fromdate?fromdate: CurrentDate ? CurrentDate : ''} className='button button-seashell border-0 fw-bolder text-charcoal ' onChange={(e) => settodate(e.target.value)} />
                      </div>
                    </div>
                    </div>
          </div>
       
      </div>
      <div className="container-fluid m-0 p-0  ">
        <div className="p-0 m-0">{ToggleOptions(menu)}</div>
      </div>
    </div>
  )
}

export default DailySaleReport
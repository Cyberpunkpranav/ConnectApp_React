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
    const [fromdate, setfromdate] = useState()
    const [todate, settodate] = useState()
    const [clinic, setclinic] = useState(clinicid)
  
  
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
                      <button className={`button m-0 p-0 px-2 py-1 ms-1 border-0 button-${i == menu ? 'charcoal' : ''} `} id={i} key={i} onClick={() => { setmenu(i) }}>{data.option}</button>
                    </div>
                    <div className={`vr rounded-1 h-50 align-self-center d-${data.display == 1 ? '' : 'none'}`} style={{ padding: '0.8px' }}></div>
                  </>
                ))
              }
            </div>
  
          </div>
          <div className="row p-0 m-0 align-items-center gx-2 ">
            <div className="col-auto">
              <div className="container-fluid p-0 m-0 my-2 ">
                <div className="row m-0 p-0 align-items-center">
                  <span className='col-auto fs-4 text-charcoal fw-bold p-0 m-0'>{<Livetime />}</span>
  
  
                </div>
              </div>
            </div>
            <div className="col">
              <div className="dropdown">
                <button className="button button p-0 m-0 px-1 py-1 button-pearl text-burntumber  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Filter Options
                </button>
                <ul className="dropdown-menu">
                  <li className="text-center"><button className="dropdown-item border-bottom" >
                    <div className="col-auto p-0 m-0">
                      <select className="px-1 bg-transparent border-0 text-charcoal py-2  py-md-1 text-center " value={clinic ? clinic : ''} onChange={(e) => { setclinic(e.target.value) }}>
                        <option value="Select Clinic">Clinic</option>
                        {
                          props.cliniclist ? (
                            props.cliniclist.map((data) => (
                              <option className="text-start" value={data.id}>{data.id}.{' '}{data.title}</option>
                            ))
                          ) : (
                            <option>Loading</option>
                          )
                        }
                      </select>
                    </div></button></li>
                  <li className="text-center"><button className="dropdown-item border-bottom " >
                    <div className="col-auto p-0 m-0 ">
                      <select className="bg-pearl text-center bg-transparent border-0 text-charcoal px-1 py-2 py-md-1" value={doctorid ? doctorid : ''} onChange={(e) => setdoctorid(e.target.value)}>
                        <option value='Doctors'>Doctor</option>
                        {
                          Doctors.map((data) => (
                            <>
                              <option className="text-start" value={data[0]}>{data[0]}. Dr.{data[1]} </option>
  
                            </>
                          ))
                        }
                      </select>
                    </div></button></li>
                  <li className="text-center"><button className="dropdown-item ">
                    <div className="col-auto p-0 m-0">
                      <div className="row p-0 m-0 text-center">
                        <input type='date' placeholder="from Date" value={fromdate ? fromdate : ''} className=' bg-pearl col-auto px-2 border-0 outline-none ' onChange={(e) => setfromdate(e.target.value)} />
                        <div className="bg-pearl fw-bolder col-auto">-</div>
                        <input type='date' placeholder="to Date" disabled={fromdate ? false : true} value={todate ? todate : ''} className='bg-pearl px-2 border-0 col-auto outline-none' onChange={(e) => settodate(e.target.value)} />
                      </div>
                    </div></button></li>
                </ul>
              </div>
            </div>
  
          </div>
  
        </div>
        <div className="container-fluid  m-0 p-0 ">
          <div className="p-0 m-0">{ToggleOptions(menu)}</div>
        </div>
      </div>
    )
  }

  export default DailySaleReport
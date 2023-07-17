import React, { useState, useEffect, useContext } from 'react'
import { URL, Vitals } from '../../index'

import '../../css/dashboard.css'
import axios from 'axios'
import Notiflix from 'notiflix'


const Vitalsoperation = (props) => {
  const url = useContext(URL)
  const vitals = useContext(Vitals)
  const [vitalid, setvitalid] = useState()
  const [vitalvalue, setvitalvalue] = useState()
  const [loadvitals, setloadvitals] = useState()
  const [vitalupdatevalue, setvitalupdatevalue] = useState()
  const [vitalindex, setvitalindex] = useState(0)
  const [savevital, setsavevital] = useState('none')
  const [updatevital, setupdatevital] = useState('block')
  function resetfields() {
    setvitalvalue()
    setvitalid()
    OpenUpdateVital()
  }

  function Vitalunit(vitalid) {
    let v;
    for (let x in vitals) {
      if (vitals[x].id == vitalid) {
        v = vitals[x].unit
      }
    }
    return v
  }
  async function AddVitals() {
    setloadvitals(true)
    try {
      if (vitalid && vitalvalue && props.appointmentid && props.patientid) {
        await axios.post(`${url}/save/vitals`, {
          vitals_id: vitalid,
          value: vitalvalue,
          appointment_id: props.appointmentid,
          patient_id: props.patientid,
        }).then((response) => {
          props.GetAppointmentVitals(props.appointmentid)
          Notiflix.Notify.success(response.data.message)
          resetfields()
          setloadvitals(false)
        })
      } else {
        Notiflix.Notify.warning('Please Fill all Details')
        setloadvitals(false)
      }
    } catch (e) {
      Notiflix.Notify.alert(e.message)
      setloadvitals(false)
    }
  }

  async function UpdateVital(vitalid, appointmentvitalid) {
    // console.log(vitalid, vitalupdatevalue, appointmentvitalid, props.appointmentid, props.patientid)
    try {
      if (vitalid && vitalupdatevalue && appointmentvitalid && props.appointmentid && props.patientid) {
        await axios.post(`${url}/save/vitals`, {
          vitals_id: vitalid,
          value: vitalupdatevalue,
          appointment_id: props.appointmentid,
          patient_id: props.patientid,
          old_id: appointmentvitalid
        }).then((response) => {
          props.GetAppointmentVitals(props.appointmentid)
          OpenUpdateVital();
          Notiflix.Notify.success(response.data.message)
        })
      } else {
        Notiflix.Notify.warning('Please Fill all Details')
      }
    } catch (e) {
      Notiflix.Notify.alert(e.message)
    }
  }
  async function DeleteVital(vitalid) {
    if (vitalid) {
      await axios.post(`${url}/remove/vitals`, {
        id: vitalid
      }).then((response) => {
        if (response.status == 200) {
          Notiflix.Notify.success(response.data.message)
        } else {
          Notiflix.Notify.alert('Something Went Wrong')
        }
        props.GetAppointmentVitals(props.appointmentid)
      })
    } else {
      Notiflix.Notify.alert('Delete Failed Please Try again')
    }

  }
  function refresh() {
    props.GetAppointmentVitals(props.appointmentid)
    OpenUpdateVital()
  }

  function OpenSaveVital() {
    if (savevital == 'none') {
      setsavevital('block')
      setupdatevital('none')
      setvitalupdatevalue()
    }
  }
  function OpenUpdateVital() {
    if (updatevital == 'none') {
      setupdatevital('block')
      setsavevital('none')
      setvitalindex()
    }
  }
  // console.log(props.appointmentvitalslist)
  return (
    <div className='container-fluid col-lg-10 col-md-11 col-sm-12 col-12 col-xl-10 bg-seashell rounded-2 position-relative pb-4 pt-2'>
      <h5 className='p-1 text-center'>{props.patientname} Vitals</h5>
      <button className=' btn-close position-absolute top-0 end-0 m-1 me-2 pt-3' disabled={props.loadvitals ? true : false} onClick={props.CloseVitals}></button>
      <button className='btn p-0 m-0 position-absolute top-0 start-0 ms-2 m-1' onClick={refresh}><img src={process.env.PUBLIC_URL + '/images/refresh.png'} style={{ width: '1.5rem' }} /></button>
      {
        props.loadvitals ? (
          <div className="col-6 py-2 pb-2 m-auto text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          props.appointmentvitalslist.length == 0 ? (
            <>
              <div className='bg-lightred p-2 mb-2 text-center align-items-center '>
                <h6 className='text-center text-charcoal-75 fw-bold mb-0'>No Vitals Added</h6>
              </div>
            </>
          ) : (
            props.appointmentvitalslist.map((data, i) => (
              <div className='container-fluid'>
                <div className={`row justify-content-end align-items-center`}>
                  <div className="col-3">
                    <select className='form-control text-center border border-1 p-0 border-0 bg-seashell' value={data.id ? data.id : ''}>
                      <option value={data.id}>{data.vital.title}</option>
                    </select>
                  </div>
                  <div className={`col-2 text-center d-${i == vitalindex ? updatevital : 'block'}`}>
                    <input className='form-control bg-seashell text-center py-0 ' disabled value={data.value} />
                  </div>
                  {
                    i == vitalindex ? (
                      <div className={`col-2 text-center d-${i == vitalindex ? savevital : 'none'}`}>
                        <input className='form-control bg-seashell text-center py-0 ' onChange={(e) => setvitalupdatevalue(e.target.value)} />
                      </div>
                    ) : (<></>)
                  }

                  <div className="col-1 p-0 m-0 align-self-end">
                    {
                      data.vital.id ? (
                        <p className='p-0 m-0  text-charcoal text-center align-self-center'>{Vitalunit(data.vital.id)}</p>
                      ) : (
                        <p className='text-charcoal text-center align-self-center'>Unit</p>
                      )
                    }

                  </div>
                  <div className={`col-2 d-${i == vitalindex ? updatevital : 'block'}`}>
                    <button className='button py-0 button-lightbrown' value={data.id} onClick={() => { OpenSaveVital(); setvitalindex(i) }}>Edit</button>
                  </div>
                  {
                    i == vitalindex ? (
                      <div className={`col-2 d-${i == vitalindex ? savevital : 'none'}`}>
                        <button className='button py-0 button-lightgreen' onClick={() => { UpdateVital(data.vital.id, data.id) }}>Save</button>
                      </div>
                    ) : (<></>)
                  }
                  <div className="col-auto me-5">
                    <button className='btn p-0 m-0'><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.3rem' }} onClick={() => DeleteVital(data.id)} /></button>
                  </div>
                </div>
              </div>

            ))
          )

        )
      }
      <div className="container-fluid mt-2">
        {
          loadvitals ? (
            <div className="col-6 py-2 pb-2 m-auto text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row justify-content-end align-items-center">
              <div className="col-3">
                <select className='form-control p-0 text-center border-0 text-end bg-seashell' value={vitalid ? vitalid : ''} onChange={(e) => { setvitalid(e.target.value) }}>
                  <option>Select Vitals</option>
                  {
                    vitals.map((data) => (
                      <option value={data.id}>{data.title}</option>
                    ))
                  }
                </select>
              </div>
              <div className="col-2">
                <input className='form-control bg-seashell text-center p-0 border-start-0 border-end-0 border-top-0 border-bottom-burntumber' value={vitalvalue ? vitalvalue : ''} onChange={(e) => { setvitalvalue(e.target.value) }} />
              </div>
              <div className="col-2">
                {
                  vitalid ? (
                    <p className='text-charcoal text-center p-0 m-0'>{Vitalunit(vitalid)}</p>
                  ) : (
                    <p className='text-charcoal text-center p-0 m-0'>Unit</p>
                  )
                }
              </div>
              <div className="col-2 px-1">
                {
                  loadvitals ? (
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <button className='btn py-0 button-burntumber' onClick={AddVitals}>Add</button>
                  )
                }

              </div>
              <div className="col-2"></div>
            </div>
          )
        }


      </div>
      <div className="container text-center mt-3">
        <button className='button button-charcoal mx-auto' onClick={props.CloseVitals}>Done</button>
      </div>

    </div>
  )
}

export { Vitalsoperation }
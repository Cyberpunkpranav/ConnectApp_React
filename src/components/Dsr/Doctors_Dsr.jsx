import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useContext, useRef } from 'react'
import { URL, DoctorsList } from '../../index'
import axios from 'axios'

const Doctors_Dsr = (props) => {
  const url = useContext(URL)
  const AllDoctors = useContext(DoctorsList)
  const [load, setload] = useState(false)
  const [Appointments, setAppointments] = useState([])
  const [DocTimetyp1, setDocTimetyp1] = useState()
  const [pageindex, setpageindex] = useState()
  const tableref = useRef()
  const Doctorwisetable = useRef()

  async function GetDoctors() {
    setload(true)
    await axios.get(`${url}/DSR/doctors?from_date=${props.fromdate}&to_date=${props.todate}`).then((response) => {
      // console.log(response)
      setAppointments(response.data.data.doctor_login_list)
      setload(false)
    })
  }
  useEffect(() => {
    GetDoctors()
  }, [props.fromdate, props.todate])

  let DoctorWisetotalarr = []

  async function DoctorwiseTable() {
    let total, hr, min
    let doctorstime = {
      id: '',
      roomtype: '',
      totaltime: '',
      totalhours: '',
      totalminutes: ''
    }
    for (let k = 0; k < AllDoctors.length; k++) {
      DoctorWisetotalarr.push([AllDoctors[k][0], AllDoctors[k][1], [], []])
      for (let i = 0; i < Appointments.length; i++) {
        if (Appointments[i].doctor && Appointments[i].doctor.id == DoctorWisetotalarr[k][0]) {
          if (Appointments[i].room && Appointments[i].room.room_type == 1) {
            total = diff(Appointments[i].login_time, Appointments[i].logout_time)
            hr = total.toString().substring(0, 2)
            min = total.toString().substring(5, 7)
            DoctorWisetotalarr[k][2].push(doctorstime = {
              id: Appointments[i].id,
              roomtype: Appointments[i].room.room_type,
              totaltime: total,
              totalhours: Number(hr),
              totalminutes: Number(min)
            })
          }
          if (Appointments[i].room && Appointments[i].room_type == 2) {
            let total = diff(Appointments[i].login_time, Appointments[i].logout_time)
            let hr = total.toString().substring(0, 2)
            let min = total.toString().substring(5, 7)
            DoctorWisetotalarr[k][3].push(doctorstime = {
              id: Appointments[i].id,
              roomtype: Appointments[i].room.room_type,
              totaltime: total,
              totalhours: hr,
              totalminutes: min
            })
          }

        }
      }
    }
    let Doctorwisetotalhrarr = []
    let Doctorwisetotalminarr = []
    if (DoctorWisetotalarr && DoctorWisetotalarr.length != 0) {
      for (let i = 0; i < DoctorWisetotalarr.length; i++) {
        if (DoctorWisetotalarr[i][0] == AllDoctors[i][0]) {
          Doctorwisetotalhrarr.push([DoctorWisetotalarr[i][0], []])
          Doctorwisetotalminarr.push([DoctorWisetotalarr[i][0], []])
          if (DoctorWisetotalarr[i][2].length != 0) {
            for (let g = 0; g < DoctorWisetotalarr[i][2].length; g++) {
              if (DoctorWisetotalarr[i][2][g].length != 0 && DoctorWisetotalarr[i][2][g].totalhours && DoctorWisetotalarr[i][2][g].totalhours != null && DoctorWisetotalarr[i][2][g].totalhours != undefined) {
                Doctorwisetotalhrarr[i][1].push(Number(DoctorWisetotalarr[i][2][g].totalhours))
              } else {
                Doctorwisetotalhrarr[i][1].push(0)
              }
              if (DoctorWisetotalarr[i][2][g].length != 0 && DoctorWisetotalarr[i][2][g].totalminutes && DoctorWisetotalarr[i][2][g].totalminutes != null && DoctorWisetotalarr[i][2][g].totalminutes != undefined) {
                Doctorwisetotalminarr[i][1].push(Number(DoctorWisetotalarr[i][2][g].totalminutes))
              } else {
                Doctorwisetotalminarr[i][1].push(0)
              }
            }
          }
        }
      }

      for (let k = 0; k < Doctorwisetotalhrarr.length; k++) {
        if (Doctorwisetotalhrarr[k][1].length == 0) {
          Doctorwisetotalhrarr[k].push(0)
        } else {
          let Doctorwisehrtotal = 0
          let Doctorwisemintotal = 0
          for (let h = 0; h < Doctorwisetotalhrarr[k][1].length; h++) {
            Doctorwisehrtotal += Number(Doctorwisetotalhrarr[k][1][h])
          }
          for (let a = 0; a < Doctorwisetotalminarr[k][1].length; a++) {
            Doctorwisemintotal += Number(Doctorwisetotalminarr[k][1][a])

          }
          DoctorWisetotalarr[k].push(Doctorwisehrtotal)
          DoctorWisetotalarr[k].push(Doctorwisemintotal)
        }
        if (DoctorWisetotalarr[k][5] >= 60) {
          let remainsmin = DoctorWisetotalarr[k][5] % 60
          let minhours = Math.floor(DoctorWisetotalarr[k][5] / 60)
          DoctorWisetotalarr[k][5] = remainsmin
          DoctorWisetotalarr[k][4] += minhours

        }

      }
    }
    console.log(DoctorWisetotalarr)
    setDocTimetyp1(DoctorWisetotalarr)
  }
  useEffect(() => {
    async function load() {
      DoctorwiseTable()
    }
    load()
  }, [props.fromdate, props.todate, load])

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    } else {
      return 0
    }
  }
  function tConvert(time) {

    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }
  function diff(start, end) {
    if (start != null && end != null) {
      start = start.split(":");
      end = end.split(":");
      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
      var hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      var minutes = Math.floor(diff / 1000 / 60);
      if (hours < 0)
        hours = hours + 24;

      return (hours <= 9 ? "0" : "") + hours + "hrs" + (minutes <= 9 ? "0" : "") + minutes + 'mins';
    } else {
      return 0
    }

  }

  function TotalTime() {
    let hrarr = []
    let minsarr = []
    let totalhours, totalmins
    let GetTotalHours = 0
    let GetTotalMins = 0
    let start, end;
    for (let i = 0; i < Appointments.length; i++) {
      start = Appointments[i].login_time
      end = Appointments[i].logout_time
      if (start !== null && end !== null) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        if (hours < 0)
          hours = hours + 24;
        totalhours = (hours <= 9 ? "0" : "") + hours
        totalmins = (minutes <= 9 ? "0" : "") + minutes;
        hrarr.push(totalhours)
        minsarr.push(totalmins)
      } else {
        hrarr.push(0)
        minsarr.push(0)
      }
    }
    // console.log(hrarr)
    // console.log(minsarr)
    hrarr.forEach(item => {
      GetTotalHours += Number(item)
    })
    minsarr.forEach(item => {
      GetTotalMins += Number(item)
    })

    let a = Math.floor(GetTotalMins / 60)
    let b = GetTotalMins % 60
    // console.log(GetTotalHours,GetTotalMins,a,b)
    return GetTotalHours + a + " Hours " + " and " + b + " Minutes "
  }
  return (
    <div className="container-fluid Doctors_Dsrsection">
      <div className='position-relative'>
        <div className="col export_dropdown position-absolute top-0 ">
          <div className="dropdown">
            <button className="button button p-0 m-0 px-1 py-1 button-pearl text-burntumber  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Exports
            </button>
            <ul className="dropdown-menu" >
              <li className="text-center border-bottom">
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} All Doctors Login/Logout Details`}
                  sheet="Login/Logout Details"
                  currentTableRef={tableref.current}
                >
                  <button className='button-sm button-pearl'>All Doctors Login/Logout Details Export </button>

                </DownloadTableExcel></li>
              <li className="text-center  border-bottom">
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Doctors Summary`}
                  sheet="Summary Report"
                  currentTableRef={Doctorwisetable.current}
                >
                  <button className='button-sm button-pearl'>Doctors Summary Export</button>

                </DownloadTableExcel></li>

            </ul>
          </div>
        </div>
      </div>
      {/* <div className='py-2'>
        <div className="container-fluid m-0 p-0">
          <div className="row p-0 m-0 justify-content-around">
            <div className="col-4 col-lg-3 col-md-4 col-sm-4 py-2 border border-1 rounded-2 shadow-sm">
              <h6 className='text-charcoa50 fw-bold'>Total Report</h6>
              <div className="row gx-1">
                <div className="col-6 col-lg-6 col-md-6 p-0 m-0">
                  <button className='button-sm button-brandy'>Export CSV </button>
                </div>
                <div className="col-6 col-lg-6 col-md-6  p-0 m-0">
                  <DownloadTableExcel
                    filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} All Doctors Login/Logout Details`}
                    sheet="Login/Logout Details"
                    currentTableRef={tableref.current}
                  >
                    <button className='button-sm button-lightgreen'>Export Excel </button>

                  </DownloadTableExcel>

                </div>
              </div>
            </div>
            <div className="col-4 col-lg-3 col-md-4 col-sm-4 py-2 border border-1 rounded-2 shadow-sm">
              <h6 className='text-charcoa50 fw-bold'>Doctor Wise Report</h6>
              <div className="row gx-1">
                <div className="col-6 col-lg-6 col-md-6 p-0 m-0">
                  <button className='button-sm button-brandy'>Export CSV </button>
                </div>
                <div className="col-6 col-lg-6 col-md-6 col-sm-4  p-0 m-0">
                  <DownloadTableExcel
                    filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Doctors Summary`}
                    sheet="Summary Report"
                    currentTableRef={Doctorwisetable.current}
                  >
                    <button className='button-sm button-lightgreen'>Export Excel </button>

                  </DownloadTableExcel>

                </div>
              </div>
            </div>
            <div className="col-4 col-lg-3 col-md-4 col-sm-4 border border-1 rounded-2 shadow-sm text-center align-items-center">
              <h6 className='text-charcoa50 fw-bold'>Summary</h6>
              <div className="col-12 col-lg-12 p-0 m-0 bg-lightyellow rounded-2 align-self-center mt-2 fw-bold">Total Time :- {TotalTime()}</div>
            </div>
          </div>
        </div>
      </div> */}
      <ul className="nav nav-pills mb-3 ms-2 ms-lg-2 ms-md-2 ms-sm-2" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button onClick={() => { setpageindex(0) }} className="nav-link active p-0 m-0 py-1 px-3 rounded-pill" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" >Doctor's Login</button>
        </li>
        <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
          <button onClick={() => { setpageindex(1) }} className="nav-link p-0 m-0 py-1 px-3 rounded-pill" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Login's Summary</button>
        </li>
        <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
          <button className="button button-pearl text-burntumber fw-bold p-0 m-0 py-1 px-3 "  type="button" role="tab" aria-controls="pills-profile" aria-selected="false"> {TotalTime()}</button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent ">
        <div className="tab-pane fade show active text-start" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
          <div className='container-fluid scroll scroll-y doctordsrtable' ref={tableref}>
            <span className='d-none'>Total Time:{TotalTime()}</span>
            <table className='table text-start' >
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Doctors Name</th>
                  <th>Mobile</th>
                  <th>Date</th>
                  <th>Roomnumber</th>
                  <th>RoomType</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              {
                load ? (
                  <tbody className='position-relative'>
                    <tr className='position-absolute start-0 end-0 fw-bolder text-charcoal'>Loading Doctors Login History </tr>
                  </tbody>
                ) : (
                  Appointments.length == 0 || Appointments == undefined ? (
                    <tbody className='position-relative'>
                      <tr className='position-absolute start-0 end-0 fw-bolder text-charcoal'>No Doctors Login History Found </tr>
                    </tbody>
                  ) : (
                    <tbody className='border'>
                      {
                        Appointments.map((data, i) => (
                          <tr key={i}>
                            <td>{data.id ? data.id : 'N/A'}</td>
                            <td>{data.doctor ? data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A' : 'N/A'}</td>
                            <td>{data.doctor ? data.doctor.phone_number ? data.doctor.phone_number : 'N/A' : "DoctorNotFound"}</td>
                            <td>{data.date && data.date != null ? reversefunction(data.date) : 'N/A'}</td>
                            <td>{data.room ? data.room.room_number && data.room.room_number != null ? data.room.room_number : 'N/A' : "RoomNotFound"}</td>
                            <td>{data.room ? data.room.room_type == 1 ? 'Consultation' : 'Procedure' : 'N/A'}</td>
                            <td>{data.login_time ? tConvert(data.login_time) : 'N/A'}</td>
                            <td>{data.logout_time ? tConvert(data.logout_time) : 'N/A'}</td>
                            <td>{data.login_time && data.login_time != null && data.logout_time && data.logout_time != null ? diff(data.login_time, data.logout_time) : 'N/A'}</td>
                          </tr>

                        ))
                      }
                    </tbody>
                  )
                )

              }
            </table>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          <div className='container-fluid scroll scroll-y doctordsrtable' ref={Doctorwisetable}>
            <table className='table text-start'>
              <thead className='position-sticky top-0 bg-pearl'>
                <tr>
                  <th className='my-0 py-0' rowspan='2'>Doctor Id</th>
                  <th className='my-0 py-0' rowspan='2'>Doctor Name</th>
                  <th className='my-0 py-0' colspan='2' scope='colgroup'>Consultation</th>
                  <th className='my-0 py-0' colspan='2' scope='colgroup'>Procedure</th>
                </tr>
                <tr>
                  <th className='py-0 my-0 bg-pearl' scope='col'>Total Hours</th>
                  <th className='py-0 my-0 bg-pearl' scope='col'>Total Minutes</th>
                  <th className='py-0 my-0 bg-pearl' scope='col'>Total Hours</th>
                  <th className='py-0 my-0 bg-pearl' scope='col'>Total Minutes</th>
                </tr>
              </thead>

              {
                DocTimetyp1 == undefined || DocTimetyp1.length == 0 ? (
                  <tbody>
                    <tr>Loading...</tr>
                  </tbody>
                ) : (
                  <tbody>{
                    DocTimetyp1.map((data) => (
                      <tr className='border'>
                        <td className='border'>{data[0]}</td>
                        <td className='border'>{data[1]}</td>
                        <td className='border'>{data[4]}</td>
                        <td className='border'>{data[5]}</td>
                        <td className='border'>0</td>
                        <td className='border'>0</td>
                      </tr>
                    ))
                  }
                  </tbody>
                )
              }
            </table>
          </div>
        </div>

      </div>


    </div>
  )
}

export { Doctors_Dsr }
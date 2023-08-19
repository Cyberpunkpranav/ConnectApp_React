
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AllAppointmentslist } from '../../components/Appointments/AllAppointmentslist'
import { SelectedAppointments } from '../../components/Appointments/SelectedAppointments'
import { URL, TodayDate, DoctorsList, Permissions } from '../../index'
//css
import '../../css/appointment.css'
function Appointments(props) {
    //Global Variables
    const APIDate = useContext(TodayDate)
    const permission = useContext(Permissions)
    const url = useContext(URL)
    let clinicID = localStorage.getItem('ClinicId')
    const docnames = useContext(DoctorsList)
    //Appointments use state
    const [doctorid, setdoctorid] = useState()
    const [fromdate, setfromdate] = useState()
    const [todate, settodate] = useState()
    //Selected Appointments use state
    const [isselectedLoading, setisselectedLoading] = useState()
    const [appointmentdata, setappointmentdata] = useState([])
    const [type, settype] = useState()
    //All Appointments use state
    const [getAppointments, setgetAppointments] = useState([])
    const [isLoading, setisLoading] = useState()
    const [visibles, setvisibles] = useState([])

    const [pageindex,setpageindex] = useState("All")
    const[doctorname,setdoctorname]=useState('')
    async function fetchallAppointmentslist() {
        if (doctorid) {
            setgetAppointments([])
            try {
                setisselectedLoading(true);
                await axios.get(`${url}/appointment/list?clinic_id=${clinicID}&doctor_id=${doctorid}&from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
                    setappointmentdata(response.data.data)
                })
                setisselectedLoading(false);
            } catch (e) {
                alert(e)
            }
        } else {
            setappointmentdata([])
            let listdata = []
            try {
                setvisibles()
                setisLoading(true)
                await axios.get(`${url}/appointment/list?clinic_id=${clinicID}&from_date=${fromdate ? fromdate : APIDate}&to_date=${todate ? todate : fromdate ? fromdate : APIDate}&status=${type ? type : ''}`).then((response) => {
                    setgetAppointments(response.data.data)
                    response.data.data.map((data) => {
                        listdata.push(data.doctor.id)
                    })
                    setvisibles(listdata, [])
                })
                setisLoading(false)
            } catch (e) {
                alert(e)
            }
        }

    }

    useEffect(() => {
        fetchallAppointmentslist()
    }, [])

    useEffect(() => {
        fetchallAppointmentslist()
    }, [doctorid, fromdate, todate, type])


    function tConvert(time) {

        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            time = time.slice(1);
            time[3] = +time[0] < 12 ? ' AM ' : ' PM ';
            time[0] = +time[0] % 12 || 12;
        }
        return time.join('');
    }


    let array = [[1, 'Pending', 'lightred'], [2, 'Booked', 'lightblue'], [3, 'Cancelled', 'lightred'], [4, 'QR Generated', 'light'], [5, 'Checked_in', 'brandy'], [6, 'Vitals Done', 'lightred'], [7, 'In_apppointment', 'lightyellow'], [8, 'Payment done', 'lightgreen'], [9, 'Unattained', 'lightyellow'], [10, 'Completed', 'lightgreen']]

    function status(number) {
        let status
        for (let i = 0; i < array.length; i++) {
            if (number == array[i][0]) {
                status = array[i][1]
                break;
            }
        }
        return status
    }

    function status_color(number) {
        let status_color;
        for (let j = 0; j < array.length; j++) {
            if (number == array[j][0]) {
                status_color = array[j][2]
                break;
            }
        }
        return status_color
    }

    const options = [['All', ''], ['Cancelled', 3], ['Completed', 10], ['Unattended', 9]]
    const [optionsindex, setoptionsindex] = useState(0)

    const clearfields = () => {
        setdoctorid()
        setfromdate()
        setdoctorname()
        settodate()
    }

    function CountAppointments(response) {
        let arr = []
        for (let i = 0; i < visibles.length; i++) {
            if (response === visibles[i]) {
                arr.push(response)
            }
        }
        if (arr.length != 0) {
            return '(' + arr.length + ' Appointments)'
        }
    }

    return (
        <>
            <section className="page2appointment ">
                <div className="container-fluid">
                    <div className="row justify-content-between">
                        <div className="col-auto">
                            <div className="col-12 mt-2">
                                <h4 className="p-lg-2 p-md-2 p-sm-2">All Appointments</h4>
                            </div>
                            <div className="col-auto mt-2">
                                <div className="row p-0 m-0 g-lg-2 g-md-2 g-sm-2 g-2">
                                    <div className="col-auto">
                                        <div className="dropdown">
                                        <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                           {pageindex?pageindex :"Status"}    <span class={` p-0 m-0 ms-2 badge text-burntumber fw-bolder`} style={{ zIndex: '2' }}> {doctorid ? appointmentdata.length : getAppointments.length} </span>
                                         </button>
                                        <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                                              <li className={`dropdown-item fw-bolder text-${pageindex == "All"?"white":'charcoal'} bg-${pageindex == "All"?"charcoal":'seashell'}`} onClick={()=>{setpageindex("All");settype('') }} >All  </li>
                                              <li className={`dropdown-item fw-bolder text-${pageindex == "Cancelled"?"white":'charcoal'} bg-${pageindex == "Cancelled"?"charcoal":'seashell'}`} onClick={()=>{setpageindex("Cancelled");settype(3) }} >Cancelled </li>
                                              <li className={`dropdown-item fw-bolder text-${pageindex == "Completed"?"white":'charcoal'} bg-${pageindex == "Completed"?"charcoal":'seashell'}`} onClick={()=>{setpageindex("Completed");settype(10) }} >Completed </li>
                                              <li className={`dropdown-item fw-bolder text-${pageindex == "Unattended"?"white":'charcoal'} bg-${pageindex == "Unattended"?"charcoal":'seashell'}`} onClick={()=>{setpageindex("Unattended");settype(9) }} >Unattended </li>
                                        </ul>
                                        </div>

                                    </div>
                                    <div className="col-auto">
                                        <div className="dropdown">
                                        <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                           {doctorname?doctorname :"Select Doctor"} 
                                         </button>
                                        <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                                            {
                                               visibles ? (
                                                docnames.map((response,i)=>(
                                                    <li className={`dropdown-item fw-bolder text-${doctorid == response[0]?"white":'charcoal'} bg-${doctorid == response[0]?"charcoal":'seashell'}`} onClick={()=>{setdoctorid(response[0]);setdoctorname("Dr." +response[1]+" "+CountAppointments(response[0])) }} >Dr. {response[1]}{' '}{' '}{CountAppointments(response[0])}  </li>

                                                ))
                                               ):(
                                                <li></li>
                                               ) 
                                            }
                                        </ul>
                                        </div>

                                    </div>
                                    <div className="col-auto bg-seashell rounded-2">
                                        <div className="row p-0 m-0 align-items-center align-self-center">
                                            <div className="col-auto p-0 m-0 bg-seashell">
                                            <input placeholder="Start Date" className="button button-seashell bg-seashell fw-bolder" value={fromdate ? fromdate : APIDate ? APIDate : ''} onFocus={() => { settodate(); setdoctorid();setdoctorname(""); }} type="date" onChange={(e) => { setfromdate(e.target.value) }} />
                                            </div>
                                            <div className="col-auto p-0 m-0">-</div>
                                            <div className="col-auto p-0 m-0">
                                            <input disabled={fromdate == null} value={todate ? todate : fromdate ? fromdate : APIDate ? APIDate : ''} placeholder="End Date" className="button button-seashell border-0 fw-bolder" type="date" onChange={(e) => { settodate(e.target.value) }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                    <button className=" button fw-bolder text-burntumber button-pearl" onClick={clearfields}>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-12 col-sm-12 col-md-5 col-lg-6 col-xl-6 daterange">
                            <div className="col-12 mt-3 mb-2">
                                <img src={process.env.PUBLIC_URL + "/images/today.png"} className="img-fluid" alt="displaying_image" />
                                <span className="text-burntumber fw-bold">Select Date Range</span>
                                <button className="float-end button-sm button-burntumber mt-2" onClick={clearfields}>Clear</button>
                            </div>
                            <div className="d-flex g-md-3">
                                <input placeholder="Start Date" className="form-control" value={fromdate ? fromdate : APIDate ? APIDate : ''} onFocus={() => { settodate(); setdoctorid();setdoctorname(); }} type="date" onChange={(e) => { setfromdate(e.target.value) }} />
                                <div className="text-center">_</div>
                                <input disabled={fromdate == null} value={todate ? todate : fromdate ? fromdate : APIDate ? APIDate : ''} placeholder="End Date" className="form-control" type="date" onChange={(e) => { settodate(e.target.value) }} />
                            </div>
                            <div className="col-12 mt-2">
                                <h6 className="text-burntumber fw-bold">Select Doctor to see their appointments</h6>
                                <select className="form-control" value={doctorid ? doctorid : ''} onChange={(e) => { setdoctorid(e.target.value) }}>
                                    <option selected value="Select Doctor">Select Doctor</option>
                                    {
                                        visibles ? (
                                            docnames.map((response, i) => (
                                                <option className={`form-control text-charcoal`} key={i} value={response[0]} >Dr. {response[1]}{' '}{' '}{CountAppointments(response[0])}</option>
                                            ))

                                        ) : (<option>Loading..</option>)
                                    }

                                </select>
                            </div>
                        </div> */}  
                    </div>
                </div>
                <section className="container-fluid scroll scroll-y mt-2 " >
                    <table className="table text-start">
                        <thead className="text-charcoal75 fw-bold">
                            <tr className=" bg-pearl position-sticky top-0">
                                <th className={`text-center d-${permission.appointment_edit == 1 ? '' : 'none'}`}>Update</th>
                                <th className="">Status</th>
                                <th>Patient</th>
                                <th>Doctor Name</th>
                                <th>Date & F/U Date</th>
                                <th>Time</th>
                                <th>Amount</th>
                                <th className=" text-center bg-pearl">More</th>
                            </tr>
                        </thead>
                        <tbody className="text-charcoal appointments ">
                            {
                                doctorid ? (
                                    <SelectedAppointments appointmentdata={appointmentdata} isselectedLoading={isselectedLoading} type={type} doctorid={doctorid} fromdate={fromdate} todate={todate} fetchallAppointmentslist={fetchallAppointmentslist} status={status} status_color={status_color} tConvert={tConvert} fetchapi={props.fetchapi} />
                                ) : (

                                    <AllAppointmentslist isLoading={isLoading} getAppointments={getAppointments} type={type} fromdate={fromdate} todate={todate} doctorid={doctorid} fetchallAppointmentslist={fetchallAppointmentslist} status={status} status_color={status_color} tConvert={tConvert} fetchapi={props.fetchapi} />
                                )
                            }
                        </tbody>
                    </table>
                </section>

            </section>


        </>
    );
}
export default Appointments
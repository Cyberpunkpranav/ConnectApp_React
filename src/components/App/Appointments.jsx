
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AllAppointmentslist } from '../../components/Appointments/AllAppointmentslist'
import { SelectedAppointments } from '../../components/Appointments/SelectedAppointments'
import { URL, TodayDate, DoctorsList, Permissions } from '../../index'

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
            return ' | ' + '(' + arr.length + ' Appointments)'
        }
    }
    // useEffect(() => {
    // }, [fromdate, todate])
    // console.log(docnames, visibles, getAppointments.length, appointmentdata.length)
    return (
        <>
            <section className="page2appointment ">
                <div className="container-fluid">
                    <div className="row justify-content-between">
                        <div className="col-12 col-sm-12 col-md-7 col-lg-6 col-xl-6">
                            <div className="col-12 mt-3">
                                <h4 className="p-lg-2 p-md-2 p-sm-2">All Appointments</h4>
                            </div>
                            <div className="col-12 mt-2">
                                <div className="row p-0 m-0 g-lg-2 g-md-2 g-sm-2 g-2">
                                    {
                                        options.map((data, index) => (
                                            <div className="col-auto">
                                                <button className={`button-sm px-4 rounded-5 border-charcoal mx-1 position-relative button-${optionsindex == index ? 'charcoal' : 'pearl'}`} key={index} onClick={(e) => { setoptionsindex(index); settype(data[1]) }}>
                                                    {data[0]}
                                                    <span class={` d-${optionsindex == index ? '' : 'none'} position-absolute top-0 text-pearl start-100 translate-middle badge fw-normal px-2 rounded-pill bg-burntumber border-burntumber`} style={{ zIndex: '2' }}>
                                                        {doctorid ? appointmentdata.length : getAppointments.length}

                                                    </span>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-5 col-lg-6 col-xl-6 daterange">
                            <div className="col-12 mt-3 mb-2">
                                <img src={process.env.PUBLIC_URL + "/images/today.png"} alt="displaying_image" />
                                <span className="text-burntumber fw-bold">Select Date Range</span>
                                <button className="float-end button-sm button-burntumber" onClick={clearfields}>Clear</button>
                            </div>
                            <div className="d-flex g-md-3">
                                <input placeholder="Start Date" className="form-control" value={fromdate ? fromdate : APIDate ? APIDate : ''} onFocus={() => { settodate(); setdoctorid() }} type="date" onChange={(e) => { setfromdate(e.target.value) }} />
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
                        </div>
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
                                {/* <th>Phone Number</th> */}
                                <th>Date & F/U Date</th>
                                <th>Time</th>
                                <th>Amount</th>
                                {/* <th>Rx</th> */}
                                {/* <th>F/U Date</th> */}
                                {/* <th>Actions</th> */}
                                <th className=" text-center bg-pearl">More</th>
                            </tr>
                        </thead>
                        <tbody className="text-charcoal ">
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
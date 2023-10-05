import React from 'react'
import { useState, useContext,useEffect } from "react"
import axios from "axios"
import AmountPaid from '../Today/AmountPaid'
import { UpdateAppointment } from './UpdateAppointment'
import { Prescription } from '../Today/prescription'
import { Bill } from './Bill'
import '../../css/appointment.css'
import { Payments } from './Payments.jsx'
import Notiflix from 'notiflix';
import { customconfirm } from '../features/notiflix/customconfirm'
import { Generated_bill } from '../Today/generated_bill'
//COntext APIs
import { URL, Permissions } from '../../index'

const AllAppointmentslist = (props) => {
    const url = useContext(URL);
    const permission = useContext(Permissions);
    let adminid = localStorage.getItem('id')
    const [appointmentform, setappointmentform] = useState("none");
    const [paymentsform, setpaymentsform] = useState('none')
    const [paymentindex, setpaymentindex] = useState()
    const [tableindex, settableindex] = useState()
    const [billindex, setbillindex] = useState()
    const [billform, setbillform] = useState('none')
    const[bindex,setbindex]=useState()
    const closeappointmentform = () => {
        if (appointmentform === "block") {
            setappointmentform("none");
            settableindex()
        }
    };
    const openapppointmentform = () => {
        if (appointmentform === "none") {
            setappointmentform("block");
        }
    }
    const toggle_payments = () => {
        if (paymentsform === 'none') {
            setpaymentsform('block')
        }
        if (paymentsform === 'block') {
            setpaymentsform('none')
            setpaymentindex()
        }
    }
    const toggle_bill = () => {
        if (billform === 'none') {
            setbillform('block')
        }
        if (billform === 'block') {
            setbillform('none')
            setbillindex()
        }
    }
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }

    }
    async function UpadteStatus(e) {
        if (e.target.value && adminid && e.target.name) {
            try {
                Notiflix.Loading.circle('Updating Appointment Status', {
                    backgroundColor: 'rgb(242, 242, 242,0.5)',
                    svgColor: '#96351E',
                    messageColor: '#96351E',
                    messageFontSize: '1.5rem'
                }
                )
                await axios.post(`${url}/appointment/change/status`, {
                    appointment_id: e.target.name,
                    status: e.target.value,
                    admin_id: adminid
                }).then((response) => {
                    props.fetchallAppointmentslist()
                    Notiflix.Loading.remove()
                    Notiflix.Notify.success(response.data.message)
                })
            } catch (e) {
                alert(e)
                Notiflix.Loading.remove()
            }
        } else {
            Notiflix.Notify.alert('Please try Again')
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
    const Generate_Bill = async (id) => {
        Notiflix.Loading.circle('Generating Bill', {
            backgroundColor: 'rgb(242, 242, 242,0.5)',
            svgColor: '#96351E',
            messageColor: '#96351E',
            messageFontSize: '1.5rem'
        })
        try {
            axios.post(`${url}/appointment/bill`, {
                appointment_id: id,
                admin_id: adminid
            }).then((response) => {
                Notiflix.Loading.remove()
                Notiflix.Notify.success(response.data.message)
                window.open(response.data.data.bill_url, '_blank', 'noreferrer');
  
            })
        } catch (e) {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure(e.message)
     
        }
    }
    const Generate_Prescription = async (id) => {
        Notiflix.Loading.circle('Generating Prescription', {
            backgroundColor: 'rgb(242, 242, 242,0.5)',
            svgColor: '#96351E',
            messageColor: '#96351E',
            messageFontSize: '1.5rem'
        })
        try {
            axios.post(`${url}/swift/pdf`, {
                appointment_id: id,
            }).then((response) => {
                Notiflix.Loading.remove()
                Notiflix.Notify.success(response.data.message)
                window.open(response.data.data.prescription_pdf, '_blank', 'noreferrer');
            })
        } catch (e) {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure(e.message)
          
        }
    }
    const Send_On_WhatsApp = async (id, phone, check) => {
        let checkpres = check
        if (phone == undefined || phone == null) {
            Notiflix.Notify.failure('Please Add a Phone Number to send the message on WhatsApp')
        } else {
            Notiflix.Loading.circle('Sending Bill on Whats App', {
                backgroundColor: 'rgb(242, 242, 242,0.5)',
                svgColor: '#96351E',
                messageColor: '#96351E',
                messageFontSize: '1.5rem'
            })
            try {
                axios.post(`${url}/send/bill/whatsapp`, {
                    appointment_id: id,
                    check_pres: checkpres,
                    admin_id: adminid
                }).then((response) => {
                    
                    Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
                    Notiflix.Loading.remove()
                })
            } catch (e) {
                Notiflix.Notify.failure(e.message)
                Notiflix.Loading.remove()
            }
        }

    }
    const Confirm_For_Prescription = (id, phone) => {

        customconfirm()
        Notiflix.Confirm.show(
            `Choose Option to Send `,
            `Do you want to send the Bill`,
            'With the Prescription ?',
            'Without the Prescription ?',
            () => {
                Send_On_WhatsApp(id, phone, 1)
            },
            () => {
                Send_On_WhatsApp(id, phone, 0)
            },
            {
            },
        );
    }
    const Send_On_SMS = async (id, phone, check) => {
        let checkpres = check
        if (phone == undefined || phone == null) {
            Notiflix.Notify.failure('Please Add a Phone Number to send the message on SMS')
        } else {
            Notiflix.Loading.circle('Sending Bill on SMS', {
                backgroundColor: 'rgb(242, 242, 242,0.5)',
                svgColor: '#96351E',
                messageColor: '#96351E',
                messageFontSize: '1.5rem'
            })
            try {
                axios.post(`${url}/send/bill/sms`, {
                    appointment_id: id,
                    check_bill: 1,
                    check_pre: checkpres,
                }).then((response) => {
                    
                    Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
                    Notiflix.Loading.remove()
                })
            } catch (e) {
                Notiflix.Notify.failure(e.message)
                Notiflix.Loading.remove()
            }
        }

    }
    const Confirm_For_Prescription2 = (id, phone) => {

        customconfirm()
        Notiflix.Confirm.show(
            `Choose Option to Send `,
            `Do you want to send the Bill`,
            'With the Prescription ?',
            'Without the Prescription ?',
            () => {
                Send_On_SMS(id, phone, 1)
            },
            () => {
                Send_On_SMS(id, phone, 0)
            },
            {
            },
        );
    }
    const[pindex,setpindex]=useState()
    const [prescriptions,setprescriptions] =useState([])
    const[pload,setpload]=useState('none')
    const Get_Document=(id,i)=>{
      setpindex(i)
      try{
        setpload(true)
        axios.get(`${url}/all/document?appointment_id=${id}`).then((response)=>{
          setprescriptions(response.data.data)
          setpload(false)
        })
      }catch(e){
        setpload(false)
        Notiflix.Notify.failure(e.message)
      }
    }
    const toggle_ScannedPres = ()=>{
        setpindex()
        }
    useEffect(()=>{
      Get_Document()
    },[])
    const toggle_Scannedbill = ()=>{
        setbindex()
        }
    return (
        <>
            {
                props.isLoading == true ? (

                    <div className='container text-center position-absolute start-0 end-0' >
                        <h4>Hold on its Loading</h4>
                        <div className="spinner-grow bg-secondary col-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (props.getAppointments.length == 0 ? (

                    <div className="container text-center text-charcoal position-absolute start-0 end-0">
                        <p className="p-0 m-0 text-charcoal75 fw-bolder mt-3">No Appointments found for the selected Date & Doctor</p>
                    </div>

                ) : (

                    props.getAppointments.map((data, key) => (
                        <tr id={key} key={key} className='align-middle text-start'>
                            <td className={`d-${permission.appointment_edit == 1 ? '' : 'none'} bg-${tableindex == key ? 'lightyellow' : ''} text-center ps-3`}>
                                <img src={process.env.PUBLIC_URL + "/images/confirmed.png"}  onClick={(e) => { openapppointmentform(); settableindex(key) }} className="btn img-fluid p-0 m-0" />
                            </td>
                            <td className='text-start pe-5 pe-lg-0 '>
                                <div className="row p-0 m-0 align-items-center text-wrap">
                                    <div className="col-1 p-0 m-0 me-2">
                                        <div className={`rounded-circle border-1 button-${props.status_color(data.appointment_status)}`} style={{ height: '12px', width: '12px' }}></div>
                                    </div>
                                    <div className="col-5 p-0 m-0 text-wrap ">
                                        <select disabled={permission.appointment_edit == 1 ? false : true} className={`bg-transparent fw-bold border-0 text-wrap `} name={data.id} onChange={(e) => { UpadteStatus(e) }}>
                                            <option className="button text-start" selected disabled>{props.status(data.appointment_status)}</option>
                                            <option className="button-lightred" value='1'>Pending</option>
                                            <option className="button-lightblue" value='2'>Booked</option>
                                            <option className="button-lightred" value='3'>Cancelled</option>
                                            <option className="button-pearl" value='4'>QR Generated</option>
                                            <option className="button-brandy" value='5'>Checked_in</option>
                                            <option className="button-lightred" value='6'>Vitals Done</option>
                                            <option className="button-lightyellow" value='7'>In_apppointment</option>
                                            <option className="button-lightgreen" value='8'>Payment done</option>
                                            <option className="button-lightyellow" value='9'>Unattained</option>
                                            <option className="button-lightgreen" value='10'>Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                            <td className='text-charcoal fw-bold'>
                                <div className="col-auto">
                                    {data.patient != null && data.patient.full_name != null ? data.patient.full_name : ''}{data.patient != null && data.patient.is_profile_verified ==1 ? <img src={process.env.PUBLIC_URL + 'images/verified.png'} style={{scale:'0.8'}}/>:'' }
                                </div>
                                <div className="col-auto text-burntumber">
                                    {data.patient != null && data.patient.phone_number != null ? data.patient.phone_number : ""}
                                </div>
                            </td>
                            <td className='text-charcoal fw-bold'>{data.doctor != null && data.doctor.doctor_name != null ? data.doctor.doctor_name : ''}</td>
                            {/* <td className='text-charcoal fw-bold'></td> */}
                            <td className='text-charcoal fw-bold'>
                                <div className="col-auto">
                                    {data.timeslot && data.timeslot.date !== null ? reversefunction(data.timeslot.date) : ''}
                                </div>
                                <div className="col-auto text-burntumber">
                                    {data.follow_up_date ? 'F/U- ' + reversefunction(data.follow_up_date ? data.follow_up_date : '') : ''}
                                </div>

                            </td>
                            <td className='text-charcoal fw-bold'>{data.timeslot && data.timeslot.time_from !== null ? props.tConvert(data.timeslot.time_from) : ''}</td>
                            <td className='text-charcoal fw-bold text-start' style={{ width: 'min-content' }}>
                                <div className="col-auto">
                                    ₹{data.total_amount && data.total_amount !== null ? data.total_amount : data.total_amount}
                                </div>
                                <div className="col-auto">
                                    <AmountPaid appointmentData={data} />
                                </div>
                            </td>

                            {/* <td><img src={process.env.PUBLIC_URL + "/images/vitals.png"} alt="displaying_image" style={{ width: "1.5rem" }} className='m-0 p-0' /> </td> */}
                            {/* <td>
                              
                             </td> */}
                            {/* <td> <img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1 m-0 p-0" /> </td> */}
                            <td className='text-center  align-self-center p-0 m-0 '>
                                <div className="dropdown text-decoration-none d-inline-block">
                                    <button className="button p-0 m-0 bg-transparent border-0 p-0  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" />
                                    </button>
                                    <ul className="dropdown-menu shadow-sm text-decoration-none p-0 m-0 p-2" style={{ '-webkit-appearance': 'none', width: 'max-content' }}>
                                        <li className='dropdown-item fw-bold border-bottom p-0 m-0 align-items-center' onClick={() => { setbillindex(key); toggle_bill() }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + 'images/bill.png'} />Bill</li>
                                        <li className={`dropdown-item fw-bold border-bottom p-0 m-0 align-items-center d-${permission.appointment_charges_edit == 1 ? '' : 'none'}`} onClick={() => { setpaymentindex(key); toggle_payments(); }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + 'images/rupee.png'} />Payments</li>
                                        <li className={`d-${data.prescription_file==null?'none':''} dropdown-item fw-bold d-flex border-1 border-bottom p-0 m-0 align-items-center`} onClick={() =>Get_Document(data.id,key)}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/new_tab.png"} alt="displaying_image"/>View Prescription</li>
                                        <li className={`d-${data.bill_file==null?'none':''} dropdown-item fw-bold d-flex border-1 border-bottom p-0 m-0 align-items-center`} onClick={() => { setbindex(key) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" /> View Bill</li>
                                        {/* <li className='dropdown-item fw-bold border-bottom p-0 m-0 align-items-center' onClick={() => { Generate_Bill(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" />Generate Bill</li>
                                        <li className="dropdown-item fw-bold border-bottom p-0 m-0 align-items-center" onClick={() => { Generate_Prescription(data.id) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" /> Generate Prescription </li> */}
                                        <li className="dropdown-item fw-bold border-bottom p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/whatsapp.png"} alt="displaying_image" /> Send on Whats App </li>
                                        <li className="dropdown-item fw-bold p-0 m-0 align-items-center" onClick={() => { Confirm_For_Prescription2(data.id, data.patient.phone_number) }}><img className='m-2 img-fluid ms-2' src={process.env.PUBLIC_URL + "/images/message.png"} alt="displaying_image"/>{' '}Send on SMS</li>
                                    </ul>
                                </div></td>
                            {
                                tableindex == key ? (
                                    <>
                                             <div className="backdrop"></div>
                                             <td className={` d-${tableindex == key ? appointmentform : 'none'} updateappointment bg-seashell p-0 col-lg-8 col-xl-5 col-md-10 col-sm-10 col-12 start-0 end-0 fw-none  mx-auto top-0 border border-1 rounded-2 shadow-sm position-absolute`} style={{ zIndex: '3', marginTop: '10rem' }}>
                                        <UpdateAppointment fetchallAppointmentslist={props.fetchallAppointmentslist} patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""} patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} appointmentid={data.id} closeappointmentform={closeappointmentform} doctorid={props.doctorid} fetchapi={props.fetchapi} appointmentdoctorid={data.doctor.id} appointmentdate={data.appointment_date} appointmenttime={tConvert(data.timeslot.time_from)} />
                                    </td>
                                    </>
                          
                                ) : (<></>)
                            }
                            {
                                billindex == key ? (
                                    <>
                                              <div className="backdrop"></div>
                                   
                                    <td className={`bill d-${billindex == key ? billform : 'none'} bg-seashell col-lg-8 col-md-10 start-0 mx-auto end-0 top-0 col-sm-12 col-12 col-xl-6 border border-2 rounded-1 shadow-sm position-absolute`} style={{ zIndex: '3', marginTop: '6rem' }}>
                                        <Bill fetchallAppointmentslist={props.fetchallAppointmentslist}
                                            toggle_bill={toggle_bill}
                                            patientid={data.patient && data.patient.id != null ? data.patient.id : ""}
                                            patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""}
                                            appointmentdata={props.getAppointments[key]}
                                            appointmentid={data.id}
                                            doctorfee={data.doctor.consulationFee}
                                            /></td>
                                             </>
                                ) : (<></>)
                            }
                            {
                                paymentindex == key ? (
                                    <>
                                    <div className="backdrop"></div>
                                    <td className={`payments top-0 start-0 end-0 mx-auto bg-seashell col-lg-6 col-md-8 col-sm-12 col-12 col-xl-6 rounded-1 border border-1 position-absolute shadow  d-${paymentindex == key ? paymentsform : 'none'}`} style={{ zIndex: '3', marginTop: '10rem' }}>
                                        <Payments
                                            toggle_payments={toggle_payments}
                                            appointmentdata={props.getAppointments[key]}
                                            fetchallAppointmentslist={props.fetchallAppointmentslist}
                                            patientname={data.patient != null && data.patient.full_name != null ? data.patient.full_name : ""}
                                            patientid={data.patient != null && data.patient.id != null ? data.patient.id : ""} />
                                    </td>
                                    </>
                                ) : (<></>)
                            }
                            {
                              pindex == key ? (
                                <>
                                <div className="backdrop"></div>
                                <td className={`saleentryform mx-auto col-xl-6 col-lg-8 col-md-10 p-0 m-0 position-absolute bg-seashell shadow-sm top-0 border border-1 rounded-1 start-0 end-0  d-${pindex == key ? pindex : 'none'}`} style={{ zIndex: '4', height: "70vh" }}  >
                                <Prescription prescriptions={data.prescription_file} toggle_ScannedPres={toggle_ScannedPres} load={pload}/>
                                </td>
                                </>
                              ):(<></>)
                            }
                            {
                              bindex == key ? (
                                <>
                                <div className="backdrop"></div>
                                <td className={`saleentryform mx-auto col-xl-6 col-lg-8 col-md-10 p-0 m-0 position-absolute bg-seashell shadow-sm top-0 border border-1 rounded-1 start-0 end-0  d-${bindex == key ? bindex : 'none'}`} style={{ zIndex: '4', height: "70vh" }}  >
                                <Generated_bill bill={data.bill_file} toggle_Scannedbill={toggle_Scannedbill}/>
                                </td>
                                </>
                              ):(<></>) 
                            }
                        </tr>
                    ))
                )
                )
            }
        </>
    )
}
export { AllAppointmentslist }
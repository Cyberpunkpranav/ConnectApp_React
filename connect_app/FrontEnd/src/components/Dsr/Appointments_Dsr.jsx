import React from 'react'
import { useState, useEffect, useContext } from 'react'
import axios from "axios"
import { TodayDate, URL } from '../../index'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import Notiflix from 'notiflix'

const Appointments_Dsr = (props) => {
  const url = useContext(URL)
  const clinicid = localStorage.getItem('ClinicId')
  const adminid = localStorage.getItem('id')
  // let arr = [
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   }, {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },
  //   {
  //     id: 'c-102',
  //     name: 'kabir',
  //     Mobile: '9977665544',
  //     Doctorname: 'Arushi Dudeja',
  //     Date: '12-01-2023',
  //     Time: '07:00 AM',
  //     Payment: 'Cash-2000 Card-2000',
  //     Amount: '1500',
  //     Discount: '0',
  //     Pending: '0',
  //     Grand_total: '1500'
  //   },

  // ]
  //Use States
  const [Appointments, setAppointments] = useState([])
  const [visibles, setvisibles] = useState([])
  const[loading,setloading]=useState()

  const reversefunction = (date) => {
    date = date.split("-").reverse().join("-")
    return date
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
  function payment_method_details(args) {
    Object.values(JSON.parse(args))
    console.log(args.id)
    return args
  }



  console.log(Appointments, props.doctorid, props.fromdate, props.todate)
let listdata = []
  async function DSR_All_Appointments() {
    setloading(true)
    if (props.doctorid || props.fromdate || props.todate) {
      try {
        await axios.get(`${url}/DSR/appointemtnts?from_date=${props.fromdate}&to_date=${props.todate}&admin_id=${adminid}&clinic_id=${clinicid}`).then((response) => {
          // console.log(response.data.data.appointments)
          response.data.data.appointments.map((data) => {
            listdata.push(data.doctor.id)
          })
          setvisibles(listdata, [])
          setAppointments(response.data.data.appointments)
          setloading(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setloading(false)
      }
    } else {
      Notiflix.Notify.warning("please select any one field to search")
      setloading(false)
    }

  }
  useEffect(()=>{
    DSR_All_Appointments()

  },[])
  useEffect(() => {
    DSR_All_Appointments()
  }, [props.doctorid, props.fromdate, props.todate])
  console.log(visibles)
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

  return (
    <div className='Appointments_Dsrsection'>
      <div>
        <div className="row p-0 m-0 justify-content-between m-auto px-2 ">
          <div className='col-lg-5 col-md-5 col-sm-5 col-5 CARD1 shadow-sm rounded-2' style={{ maxWidth: '25rem' }}>
            <h6 className="text-burntumber ms-3 mt-2">Payment Methods</h6>
            <div className='row p-0 m-0'>
              <div className='col-lg-4 mb-lg-2 col-md-4 text-start '>Cash:{' '}0</div>
              <div className='col-lg-4 mb-lg-2 col-md-auto text-center'>Card:{' '}0</div>
              <div className='col-lg-4 mb-lg-2 col-md-5 text-end'>WireTransfer:0</div>
              <div className='col-lg-4 mb-lg-2 col-md-4 text-start'>PhonePay:{' '}0</div>
              <div className='col-lg-4 mb-lg-2 col-md-auto text-center'>RazorPay:{' '}0</div>
              <div className='col-lg-4 mb-lg-2 col-md-4 text-end'>Paytm{' '}0</div>
            </div>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 col-5 CARD2 shadow-sm rounded-2" style={{ maxWidth: '25rem' }}>
            <h6 className='text-brandy ms-3 mt-2'>Amounts</h6>
            <div className='bg-lightyellow rounded-2'>
              <p className='text-charcoal m-0 ps-3 fw-semibold border-bottom-burntumber p-0'>Recieved</p>
              <div className="row p-0 m-0">
                <div className="col-5 col-md-6 text-lg-start">Advance Amount: {' '}0</div>
                <div className="col-5 col-md-6 text-lg-end">Pending Amount: {' '}0</div>
              </div>
            </div>

            <div className="row m-0 p-0">
              <div className="col-6 col-md-7 text-lg-start">Total Pending Amount: {' '}0</div>
              <div className="col-4 col-md-4 text-lg-end ">Total:{' '}0</div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-2 CARD3 rounded-2">
            <h6 className='text-lightgreen mt-2'>Exports</h6>
            <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>CSV</button>
            <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>Excel</button>
          </div>
        </div>
      </div>
      <div className="container-fluid maintable scroll scroll-y">
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Appointments{CountAppointments(27)}</h5>
        <div className='container-fluid scroll scroll-y appointments'>
          <table className='table text-center'>
            <thead>
              <tr>
                <th>Bill no.</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Pending Amt.</th>
                <th> Grand Total</th>
              </tr>
            </thead>
            <tbody>

              {
                loading  ? (
                  <tbody >
                  <tr className='position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                    <td className=' position-absolute start-0 end-0 text-burntumber fs-3 mt-1 text-center'>Loading Appointments</td></tr>
                </tbody>
                ):(
                  Appointments.length == 0 ? (
                    <tbody >
                    <tr className=' position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                      <td className=' position-absolute start-0 end-0 text-burntumber fs-3 mt-1 text-center'>No Appointments</td></tr>
                  </tbody>
                  ):(
                    Appointments.map((data, i) => (
                      <tr>
                        <td key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : 'N/A'}</td>
                        <td>{data.patient && data.patient.full_name && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                        <td>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : 'N/A'}</td>
                        <td>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                        <td>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : 'N/A'}</td>
                        <td>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : 'N/A'}</td>
                        <td>{data.payment_method_details && data.payment_method_details != null ? payment_method_details(data.payment_method_details) : 'N/A'}</td>
                        <td>{data.total_amount}</td>
                        <td>{data.discount && data.discount != null ? data.discount : 'N/A'}</td>
                        <td>{data.Pending}</td>
                        <td>{data.Grand_total}</td>
                      </tr>
                    ))
                  )
         
                )
              }
            </tbody>
          </table>
        </div>
        {/* <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Pending Payments Recieved</h5>
        <div className='container-fluid scroll scroll-y pendingpayrecieve'>
          <table className='table'>
            <thead>
              <tr>
                <th>Bill no.</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Pending Amt.</th>
                <th> Grand Total</th>
              </tr>
            </thead>
            <tbody>

              {
                Appointments.map((data, i) => (
                  <tr>
                    <td key={i}>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.Mobile}</td>
                    <td>{data.Doctorname}</td>
                    <td>{data.Date}</td>
                    <td>{data.Time}</td>
                    <td>{data.Payment}</td>
                    <td>{data.Amount}</td>
                    <td>{data.Discount}</td>
                    <td>{data.Pending}</td>
                    <td>{data.Grand_total}</td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Advanced Payments Recieved</h5>
        <div className='container-fluid scroll scroll-y advancepayrecieve'>
          <table className='table'>
            <thead>
              <tr>
                <th>Bill no.</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Doctor Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Pending Amt.</th>
                <th> Grand Total</th>
              </tr>
            </thead>
            <tbody>

              {
                Appointments.map((data, i) => (
                  <tr>
                    <td key={i}>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.Mobile}</td>
                    <td>{data.Doctorname}</td>
                    <td>{data.Date}</td>
                    <td>{data.Time}</td>
                    <td>{data.Payment}</td>
                    <td>{data.Amount}</td>
                    <td>{data.Discount}</td>
                    <td>{data.Pending}</td>
                    <td>{data.Grand_total}</td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div> */}
      </div>
    </div>



  )
}

export { Appointments_Dsr }
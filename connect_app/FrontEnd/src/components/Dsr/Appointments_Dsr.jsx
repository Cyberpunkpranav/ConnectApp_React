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

  //Use States
  const [Appointments, setAppointments] = useState([])
  const [visibles, setvisibles] = useState([])
  const [loading, setloading] = useState()


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

  const [payments, setpayments] = useState([['Cash', '0'], ['Card', '0']])

  function payment_method_detailsForCash() {
    let casharr = []
    let cash = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Cash != null) {
        casharr.push(Number(JSON.parse(Appointments[i].payment_method_details).Cash))
      }
    }
    if (casharr.length != 0) {
      casharr.forEach(item => {
        cash += item
      })
      return cash
    }

  }
  function payment_method_detailsForCard() {
    let cardarr = []
    let card = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Card != null) {
        cardarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Card))
      }
    }
    if (cardarr.length != 0) {
      cardarr.forEach(item => {
        card += item
      })
      return card
    }
  }
  function payment_method_detailsForPaytm() {
    let paytmarr = []
    let paytm = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Paytm != null) {
        paytmarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Paytm))
      }
    }
    if (paytmarr.length != 0) {
      paytmarr.forEach(item => {
        paytm += item
      })
      return paytm
    }
  }
  function payment_method_detailsForRazorPay() {
    let razorpayarr = []
    let razorpay = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Razorpay != null) {
        razorpayarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Razorpay))
      }
    }
    if (razorpayarr.length != 0) {
      razorpayarr.forEach(item => {
        razorpay += item
      })
      return razorpay
    }
  }
  function payment_method_detailsForPoints() {
    let pointsarr = []
    let points = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Points != null) {
        pointsarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Points))
      }
    }
    if (pointsarr.length != 0) {
      pointsarr.forEach(item => {
        points += item
      })
      return points
    }
  }
  function payment_method_detailsForPhonepe() {
    let phonepearr = []
    let phonepe = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Phonepe != null) {
        phonepearr.push(Number(JSON.parse(Appointments[i].payment_method_details).Phonepe))
      }
    }
    if (phonepearr.length != 0) {
      phonepearr.forEach(item => {
        phonepe += item
      })
      return phonepe
    }
  }
  // function payment_method_detailsForWireTransfer() {
  //   let wiretransferarr = []
  //   let wiretransfer = 0
  //   for (let i = 0; i < Appointments.length; i++) {
  //     console.log(JSON.parse(Appointments[i].payment_method_details))
  //     // if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).WireTransfer != null) {

  //     //   wiretransfer.push(Number(JSON.parse(Appointments[i].payment_method_details).Wire+'-'+Transfer))
  //     // }
  //   }
  //   if (wiretransferarr.length != 0) {
  //     wiretransferarr.forEach(item => {
  //       wiretransfer += item
  //     })
  //     return wiretransfer
  //   }
  // }
  function TotalPendingPayment() {
    let totalpendingarr = []
    let totalpending = 0;
    for (let i = 0; i < Appointments.length; i++) {
      for (let j = 0; j < Appointments[i].pending_payments.length; j++) {
        totalpendingarr.push(JSON.parse(Appointments[i].pending_payments[j].pending_amount))
      }
    }
    if (totalpendingarr.length != 0) {
      totalpendingarr.forEach(item => {
        totalpending += item
      })
      console.log(totalpendingarr)
    }
    return totalpending
  }
  function GrandTotal() {
    let grandtotalarr = []
    let grandtotal = 0;
    for (let i = 0; i < Appointments.length; i++) {

      grandtotalarr.push(JSON.parse(Appointments[i].total_amount))

    }
    if (grandtotalarr.length != 0) {
      grandtotalarr.forEach(item => {
        grandtotal += item
      })
      console.log(grandtotalarr)
    }
    return grandtotal
  }
  console.log(Appointments, props.doctorid, props.fromdate, props.todate)
  let listdata = []
  async function DSR_All_Appointments() {
    setloading(true)
    if (props.doctorid || props.fromdate || props.todate) {
      try {
        await axios.get(`${url}/DSR/appointments?from_date=${props.fromdate}&to_date=${props.todate}&admin_id=${adminid}&clinic_id=${clinicid}`).then((response) => {
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
  useEffect(() => {
    DSR_All_Appointments()
  }, [])
  useEffect(() => {
    DSR_All_Appointments()
  }, [props.doctorid, props.fromdate, props.todate])
  // console.log(visibles)
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
  function TotalAppointments() {
    return Appointments.length
  }
  let sum = 0
  return (
    <div className='Appointments_Dsrsection'>
      <div>
        <div className="row p-0 m-0 justify-content-between m-auto px-2 ">
          <div className='col-lg-5 col-md-5 col-sm-5 col-5 CARD1 shadow-sm rounded-2' style={{ maxWidth: '25rem' }}>
            <h6 className="text-burntumber ms-3 mt-2">Payment Methods</h6>
            <div className='row p-0 m-0'>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>Cash:{payment_method_detailsForCash()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-auto text-center'>Card:{payment_method_detailsForCard()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-5 text-end'>WireTransfer:</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>PhonePay:{payment_method_detailsForPhonepe()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>Points:{payment_method_detailsForPoints()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-auto text-center'>RazorPay:{payment_method_detailsForRazorPay()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-end'>Paytm{' '}{payment_method_detailsForPaytm()}</div>
            </div>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 col-5 CARD2 shadow-sm rounded-2" style={{ maxWidth: '25rem' }}>
            <h6 className='text-brandy p-0 ms-3 mt-2'>Amounts</h6>
            <div className='bg-lightyellow rounded-2'>
              <p className='text-charcoal m-0 ps-3 fw-semibold border-bottom-burntumber p-0'>Recieved</p>
              <div className="row p-0 m-0">
                <div className="col-5 col-md-6 text-lg-start">Advance Amount: {' '}0</div>
                <div className="col-5 col-md-6 text-lg-end">Pending Amount: {' '}0</div>
              </div>
            </div>

            <div className='bg-raffia rounded-2'>
              <div className="row m-0 p-0 my-1">

                <p className='text-charcoal m-0 ps-3 fw-semibold border-bottom-burntumber p-0'>Total</p>
                <div className="col-6 col-md-6 text-lg-start">Pending:{TotalPendingPayment()}</div>
                <div className="col-4 col-md-6 text-lg-end ">Grand:<span className='text-success fw-bold'>{GrandTotal()}</span></div>
              </div>
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
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '> Total Appointments :{TotalAppointments()}</h5>
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
                <th>Consultation Amount</th>
                <th>Procedure Amount</th>
                <th>Extra Charges</th>
                <th>Discount</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Pending Amt.</th>
                <th> Grand Total</th>
              </tr>
            </thead>
            <tbody className=''>

              {
                loading ? (
                  <tbody>
                    <tr className='position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                      <td className=' position-absolute start-0 end-0 text-charcoal75 fs-4 mt-1 text-center fw-bolder  '>Please be Patient while we are fetching Appointments</td></tr>
                  </tbody>
                ) : (
                  Appointments.length == 0 ? (
                    <tbody >
                      <tr className='position-relative text-burntumber fs-3 mt-1 text-center m-auto'>
                        <td className=' position-absolute start-0 end-0 text-burntumber fs-3 mt-1 text-center'>No Appointments</td></tr>
                    </tbody>
                  ) : (
                    Appointments.map((data, i) => (
                      <tr onClick={() => setpayments(Object.entries(JSON.parse(data.payment_method_details)))}>
                        <td key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : 'N/A'}</td>
                        <td>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                        <td>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : 'N/A'}</td>
                        <td>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                        <td>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : 'N/A'}</td>
                        <td>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : 'N/A'}</td>
                        <td className='justify-content-center text-center align-items-cetner'>{data.payment_method_details && data.payment_method_details != null ?
                          Object.entries(JSON.parse(data.payment_method_details)).map((data) => (
                            <>
                              <td className='text-center'>{data[0]}-</td>
                              <td className=' text-center fw-bolder'>{data[1]}<span className='text-charcoal fw-bolder'> | </span></td>
                            </>
                          ))
                          : 'N/A'}</td>
                        <td>{data.doctor && data.doctor.consulationFee !== null ? data.doctor.consulationFee : 'N/A'}</td>
                        <td>{data.procedure_cost && data.procedure_cost != null ? data.procedure_cost : 'N/A'}</td>
                        <td>{data.other_charges.map((data) => (`${data.amount} `))}</td>
                        <td>{data.discount && data.discount != null ? data.discount : 'N/A'}</td>
                        <td>{data.CGST}</td>
                        <td>{data.SGST}</td>
                        <td>{data.pending_payments.map((data) => (
                          data.pending_amount
                        ))}</td>
                        <td>{data.total_amount}</td>
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
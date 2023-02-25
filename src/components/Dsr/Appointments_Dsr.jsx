import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import axios from "axios"
import { TodayDate, URL } from '../../index'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import Notiflix from 'notiflix'

const Appointments_Dsr = (props) => {
  const url = useContext(URL)

  const adminid = localStorage.getItem('id')
  const tableref = useRef()
  //Use States
  const [Appointments, setAppointments] = useState([])
  const [pendingpaid, setpendingpaid] = useState([])
  const [advancepaid, setadvancepaid] = useState([])
  const [visibles, setvisibles] = useState([])
  const [loading, setloading] = useState()

  // props.doctorid, props.fromdate, props.todate
  let listdata = []
  async function DSR_All_Appointments() {
    setloading(true)
    if (props.doctorid || props.fromdate || props.todate) {
      try {
        await axios.get(`${url}/DSR/appointments?from_date=${props.fromdate}&to_date=${props.todate}&admin_id=${adminid}&clinic_id=${props.clinicid}&doctor_id=${props.doctorid?props.doctorid:''}`).then((response) => {
          response.data.data.appointments.map((data) => {
            listdata.push(data.doctor.id)
          })
          setvisibles(listdata, [])
          setAppointments(response.data.data.appointments)
          setpendingpaid(response.data.data.pending_paid)
          setadvancepaid(response.data.data.advance_payments)
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
  // console.log(Appointments)

  const reversefunction = (date) => {
    if (date !== undefined) {
      date = date.split("-").reverse().join("-")
    }
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

  const [payments, setpayments] = useState([])
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
  function payment_method_detailsForWireTransfer() {
    let wiretransferarr = []
    let wiretransfer = 0
    for (let i = 0; i < Appointments.length; i++) {
      if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details)['Wire-Transfer'] != null) {
        wiretransferarr.push(Number(JSON.parse(Appointments[i].payment_method_details)['Wire-Transfer']))
      }
    }
    if (wiretransferarr.length != 0) {
      wiretransferarr.forEach(item => {
        wiretransfer += item
      })
      return wiretransfer
    }
  }
  function AdvancedAmountRecieved() {
    let advancepayarr = []
    let advancepay = 0
    for (let i = 0; i < advancepaid.length; i++) {
      advancepayarr.push(Number(advancepaid[i].credit_amount))
    }
    if (advancepayarr.length != 0) {
      advancepayarr.forEach(item => {
        advancepay += item
      })
      return advancepay
    }
  }
  function PendingAmountRecieved() {
    let pendingpayarr = []
    let pendingpay = 0
    for (let i = 0; i < pendingpaid.length; i++) {
      pendingpayarr.push(Number(pendingpaid[i].paid_amount))
    }
    if (pendingpayarr.length != 0) {
      pendingpayarr.forEach(item => {
        pendingpay += item
      })
      return pendingpay
    }
  }
  function TotalPendingPayment() {
    let totalpendingarr = []
    let totalpending = 0;
    for (let i = 0; i < Appointments.length; i++) {
      for (let j = 0; j < Appointments[i].pending_payments.length; j++) {
        if (Appointments[i].pending_payments[j].is_paid == 0) {
          totalpendingarr.push(JSON.parse(Appointments[i].pending_payments[j].pending_amount))
        }
      }
    }
    if (totalpendingarr.length != 0) {
      totalpendingarr.forEach(item => {
        totalpending += item
      })
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
    }
    return grandtotal
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

 function SumExtraCharges(i){
  let ExtraChargeSumarr=[]
  let sum=0
  Appointments[i].other_charges.map((data)=>(
    ExtraChargeSumarr.push(data.amount)
  ))

ExtraChargeSumarr.forEach(item=>{
  sum+=Number(item)
})
return sum
  }
  function SumPendingpayments(i){
    let PendingPaymentsSumarr=[]
    let sum=0

      Appointments[i].pending_payments.map((data)=>{
        if(data.is_paid==0){
          PendingPaymentsSumarr.push(data.pending_amount)
        }
  })
  PendingPaymentsSumarr.forEach(item=>{
    sum+=Number(item)
  })
  return sum
    }

  return (
    <div className='Appointments_Dsrsection'>
      <div>
        <div className="row p-0 m-0 justify-content-between m-auto px-2 ">
          <div className='col-lg-5 col-md-5 col-sm-5 col-5 CARD1 shadow-sm rounded-2' style={{ maxWidth: '25rem' }}>
            <h6 className="text-burntumber ms-3 mt-2">Payment Methods</h6>
            <div className='row p-0 m-0'>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>Cash:{payment_method_detailsForCash()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-auto text-center'>Card:{payment_method_detailsForCard()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-5 text-end'>WireTransfer:{payment_method_detailsForWireTransfer()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>PhonePay:{payment_method_detailsForPhonepe()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>Points:{payment_method_detailsForPoints()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-auto text-center'>RazorPay:{payment_method_detailsForRazorPay()}</div>
              <div className='col-lg-auto mb-lg-2 col-md-4 text-start'>Paytm{' '}{payment_method_detailsForPaytm()}</div>
            </div>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 col-5 CARD2 shadow-sm rounded-2" style={{ maxWidth: '25rem' }}>
            <h6 className='text-brandy p-0 ms-3 mt-2'>Amounts</h6>
            <div className='bg-lightyellow rounded-2'>
              <p className='text-charcoal m-0 ps-3 fw-semibold border-bottom-burntumber p-0'>Recieved</p>
              <div className="row p-0 m-0">
                <div className="col-5 col-md-6 text-lg-start">Advance Amount:{AdvancedAmountRecieved()}</div>
                <div className="col-5 col-md-6 text-lg-end">Pending Amount:{PendingAmountRecieved()}</div>
              </div>
            </div>

            <div className='bg-raffia rounded-2'>
              <div className="row m-0 p-0 my-1">
                <p className='text-charcoal m-0 ps-3 fw-semibold border-bottom-burntumber p-0'>Total</p>
                <div className="col-6 col-md-6 text-lg-start">Pending:<span className='text-danger fw-bold'>{TotalPendingPayment()}</span></div>
                <div className="col-4 col-md-6 text-lg-end ">Grand:<span className='text-success fw-bold'>{GrandTotal()}</span></div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-2 CARD3 rounded-2">
            <h6 className='text-lightgreen mt-2'>Exports</h6>
            <DownloadTableExcel
              filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
              sheet="Appointments"
              currentTableRef={tableref.current}
            >
              <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>Excel</button>

            </DownloadTableExcel>
            <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>CSV</button>
            {/* <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>Excel</button> */}
          </div>
        </div>
      </div>
      <div className="container-fluid " ref={tableref}>
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '> Total Appointments :{Appointments.length}</h5>
        <div className='container-fluid maintable scroll scroll-y appointments'>
          <table className='table  text-center' ref={tableref}>
            <thead className='border table-bordered'>
              <tr>
                <th className='border' rowspan='2'>Appointment Id</th>
                <th className='border' rowspan='2'>Bill no.</th>
                <th className='border' rowspan='2'>Name</th>
                <th className='border' rowspan='2'>Mobile</th>
                <th className='border' rowspan='2'>Doctor Name</th>
                <th className='border' rowspan='2'>Date</th>
                <th className='border' rowspan='2'>Time</th>
                <th className='border' colspan='7' scope='colgroup'>Payment Method</th>
                <th className='border' rowspan='2'>Consultation Amount</th>
                <th className='border' rowspan='2'>Procedure Amount</th>
                <th className='border' rowspan='2'>Extra Charges</th>
                <th className='border' rowspan='2'>Discount</th>
                <th className='border' rowspan='2'>CGST</th>
                <th className='border' rowspan='2'>SGST</th>
                <th className='border' rowspan='2'>Pending Amt.</th>
                <th className='border' rowspan='2'> Grand Total</th>
              </tr>
              <tr>
                <th className='bg-white border' scope='col'>Cash</th>
                <th className='bg-white border' scope='col'>Card</th>
                <th className='bg-white border' scope='col'>Paytm</th>
                <th className='bg-white border' scope='col'>Phonepe</th>
                <th className='bg-white border' scope='col'>Razorpay</th>
                <th className='bg-white border' scope='col'>Wire-Transfer</th>
                <th className='bg-white border' scope='col'>Points</th>
              </tr>
            </thead>


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
                    <tbody className='align-items-center'>
                      {
                    Appointments.map((data, i) => (
                      <tr className='border'>
                        <td className='border'>{data.id ? data.id : 'N/A'}</td>
                        <td className='border' key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : 'N/A'}</td>
                        <td className='border'>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                        <td className='border'>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : 'N/A'}</td>
                        <td className='border'>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                        <td className='border'>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : 'N/A'}</td>
                        <td className='border'>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                        <td className='border'>{data.doctor && data.doctor.consulationFee !== null ? data.doctor.consulationFee : 'N/A'}</td>
                        <td className='border'>{data.procedure_cost && data.procedure_cost != null ? data.procedure_cost : 'N/A'}</td>
                        <td className='border'>{SumExtraCharges(i)}</td>
                        <td className='border'>{data.discount && data.discount != null ? data.discount : 'N/A'}</td>
                        <td className='border'>{data.CGST}</td>
                        <td className='border'>{data.SGST}</td>
                        <td className='border'>{SumPendingpayments(i)}</td>
                        <td className='border'>{data.total_amount}</td>
                      </tr>
                    ))
                      }
                    </tbody>
                  )

                )
              }
       
          </table>
        </div>
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Pending Payments Recieved: {pendingpaid.length}</h5>
        <div className='container-fluid scroll scroll-y pendingpayrecieve'>
          <table className='table text-center'>
            <thead>
              <tr>
                <th className='border' rowspan='2'>Appointment Id</th>
                <th className='border' rowspan='2'>Bill no.</th>
                <th className='border' rowspan='2'>Name</th>
                <th className='border' rowspan='2'>Mobile</th>
                <th className='border' rowspan='2'>Doctor Name</th>
                <th className='border' rowspan='2'>Appointment Date</th>
                <th className='border' rowspan='2'>Payment Recieved Date</th>
                <th className='border' colspan='7' scope='colgroup'>Payment Method</th>
                <th className='border' rowspan='2'>Amount Received</th>
              </tr>
              <tr>
                <th className='bg-white border' scope='col'>Cash</th>
                <th className='bg-white border' scope='col'>Card</th>
                <th className='bg-white border' scope='col'>Paytm</th>
                <th className='bg-white border' scope='col'>Phonepe</th>
                <th className='bg-white border' scope='col'>Razorpay</th>
                <th className='bg-white border' scope='col'>Wire-Transfer</th>
                <th className='bg-white border' scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>

              {
                pendingpaid.map((data, i) => (
                  <tr key={i} className='table-bordered'>
                    <td className='border'>{data.appointment && data.appointment.id != null ? data.appointment.id : 'N/A'}</td>
                    <td className='border'>{data.id && data.id != null ? data.id : 'N/A'}</td>
                    <td className='border'>{data.appointment && data.appointment != null && data.appointment.patient && data.appointment.patient.full_name != null ? data.appointment.patient.full_name : 'N/A'}</td>
                    <td className='border'>{data.appointment && data.appointment != null && data.appointment.patient.phone_number && data.appointment.patient.phone_number != null ? data.appointment.patient.phone_number : 'N/A'}</td>
                    <td className='border'>{data.appointment && data.appointment != null && data.appointment.doctor && data.appointment.doctor.doctor_name != null ? data.appointment.doctor.doctor_name : 'N/A'}</td>
                    <td className='border'>{data.appointment && data.appointment != null && data.appointment.appointment_date != null ? reversefunction(data.appointment.appointment_date) : 'N/A'}</td>
                    <td className='border'>{data.paid_date && data.paid_date != null ? reversefunction(data.paid_date) : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                    <td className='border'>{data.paid_amount}</td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Advanced Payments Recieved:{advancepaid.length}</h5>
        <div className='container-fluid maintable scroll scroll-y advancepayrecieve'>
          <table className='table text-center'>
            <thead>
              <tr>
                <th className='border' rowspan='2'>Credit ID</th>
                <th className='border' rowspan='2'>Patient Name</th>
                <th className='border' rowspan='2'>Doctor Name</th>
                <th className='border' rowspan='2'>Mobile No.</th>
                <th className='border' rowspan='2'>Description</th>
                <th className='border' rowspan='2'>Date Recieved</th>
                <th className='border' colspan='7' scope='colgroup'>Payment Method</th>
                <th className='border' rowspan='2'>Amount Recieved</th>
              </tr>
              <tr>
                <th className='bg-white border' scope='col'>Cash</th>
                <th className='bg-white border' scope='col'>Card</th>
                <th className='bg-white border' scope='col'>Paytm</th>
                <th className='bg-white border' scope='col'>Phonepe</th>
                <th className='bg-white border' scope='col'>Razorpay</th>
                <th className='bg-white border' scope='col'>Wire-Transfer</th>
                <th className='bg-white border' scope='col'>Points</th>
              </tr>
            </thead>
            <tbody>

              {
                advancepaid.map((data, i) => (
                  <tr key={i} className='bordered table-bordered'>
                    <td className='border'>{data.id ? data.id : 'N/A'}</td>
                    <td className='border'>{data.patient &&data.patient.full_name!=null ? data.patient.full_name:'N/A'}</td>
                    <td className='border'>{data.doctor && data.doctor.full_name!=null ?data.doctor.full_name :'N/A'}</td>
                    <td className='border'>{data.patient&& data.patient.phone_number!==null?data.patient.phone_number:'N/A'}</td>
                    <td className='border'>{data.description&&data.description!=null ?data.description:'N/A'}</td>
                    <td className='border'>{reversefunction(data.date)}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                    <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                    <td className='border'>{data.credit_amount}</td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>



  )
}

export { Appointments_Dsr }
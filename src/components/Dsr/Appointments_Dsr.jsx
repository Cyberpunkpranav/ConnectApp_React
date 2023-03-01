import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import axios from "axios"
import { TodayDate, URL } from '../../index'
import '../../css/bootstrap.css';
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import Notiflix from 'notiflix'

const Appointments_Dsr = (props) => {
  const url = useContext(URL)
  const adminid = localStorage.getItem('id')
  const Appointmentref = useRef()
  const Pendingref = useRef()
  const Advancedref = useRef()
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
        await axios.get(`${url}/DSR/appointments?from_date=${props.fromdate}&to_date=${props.todate}&admin_id=${adminid}&clinic_id=${props.clinicid}&doctor_id=${props.doctorid ? props.doctorid : ''}`).then((response) => {
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
    } else {
      return 0
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
        pendingpay += Number(item)
      })
      return pendingpay
    } else {
      return 0
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
      return totalpending
    } else {
      return 0
    }

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
  function SumExtraCharges(i) {
    let ExtraChargeSumarr = []
    let sum = 0
    Appointments[i].other_charges.map((data) => (
      ExtraChargeSumarr.push(data.amount)
    ))

    ExtraChargeSumarr.forEach(item => {
      sum += Number(item)
    })
    return sum
  }
  function SumPendingpayments(i) {
    let PendingPaymentsSumarr = []
    let sum = 0

    Appointments[i].pending_payments.map((data) => {
      if (data.is_paid == 0) {
        PendingPaymentsSumarr.push(data.pending_amount)
      }
    })
    PendingPaymentsSumarr.forEach(item => {
      sum += Number(item)
    })
    return sum
  }

  return (
    <div className='Appointments_Dsrsection'>
      <div>
        <div className="row p-0 m-0 justify-content-around ">
          <div className=' col-5 col-lg-5 col-md-4 col-sm-5 CARD1 scroll shadow-sm rounded-2'>
            <h6 className="text-burntumber ms-3 mt-2">Payment Methods</h6>
            <table className='w-100'>
              <thead>
                <th></th>
                <th></th>
                <th></th>
              </thead>
              <tbody>
                <tr className='border-bottom'>
                  <td className='px-2'>Cash:{payment_method_detailsForCash()}</td>
                  <td className='px-2'>Card:{payment_method_detailsForCard()}</td>
                  <td className='px-2'>WireTransfer:{payment_method_detailsForWireTransfer()}</td>
                </tr>
                <tr className='border-bottom'>
                  <td className='px-2'>PhonePay:{payment_method_detailsForPhonepe()}</td>
                  <td className='px-2'>Points:{payment_method_detailsForPoints()}</td>
                  <td className='px-2'> RazorPay:{payment_method_detailsForRazorPay()}</td>
                </tr>
                <tr className='border-bottom'>
                  <td className='px-2'>Paytm{' '}{payment_method_detailsForPaytm()} </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-lg-5 col-md-4 col-sm-5 col-5 CARD2 shadow-sm rounded-2" style={{ maxWidth: '60vh' }}>
            <h6 className='text-brandy p-0 ms-3 mt-2'>Amounts</h6>
            <div className='bg-lightyellow scroll ps-2 border-bottom py-2'>
              <table className='w-100'>
                <thead>
                  <th></th>
                  <th></th>
                </thead>
                <tbody>
                  <tr >
                    <td className=' border-end border-2 border-dark pe-2 fw-bold '>
                      Recieved
                    </td>
                    <td className='px-1'>
                      Advance Amount:{AdvancedAmountRecieved()}
                    </td>
                    <td className='px-1'>
                      Pending Amount:{PendingAmountRecieved()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className='bg-raffia border-bottom py-1 scroll'>
              <table className='w-100'>
                <thead>
                  <th></th>
                  <th></th>
                </thead>
                <tbody>
                  <tr >
                    <td className=' border-end border-2 border-dark pe-2 fw-bold '>
                      Total Amt.
                    </td>
                    <td className='px-1 '>
                      Pending:<span className='fw-bold text-danger'>{TotalPendingPayment()}</span>
                    </td>
                    <td className='px-1'>
                      Grand:<span className='fw-bold text-success'>{GrandTotal()}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <div className="accordion mt-4" id="accordionExample">
        <div className="accordion-item" ref={Appointmentref}>
          <h5 className="accordion-header" id="headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <h6 className='p-0 m-0 text-burntumber text-center fw-semibold '> Total Appointments :{Appointments.length}</h6>
              <DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
                sheet="Appointments"
                currentTableRef={Appointmentref.current}
              >
              <button className='btn p-0 m-0 ms-5 text-charcoal fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} /> Export</button>

              </DownloadTableExcel>
            </button>
          </h5>
          <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div className='container-fluid accordion-body scroll scroll-y bg-pearl p-0 m-0' style={{ maxHeight: '45vh', height: '45vh' }}>
              <table className='table text-center bg-pearl'>
                <thead className='position-sticky top-0 bg-pearl'>
                  <tr className='bg-pearl'>
                    <th className='py-0' rowspan='2'>Appointment Id</th>
                    <th className='py-0' rowspan='2'>Bill no.</th>
                    <th className='py-0' rowspan='2'>Name</th>
                    <th className='py-0' rowspan='2'>Mobile</th>
                    <th className='py-0' rowspan='2'>Doctor Name</th>
                    <th className='py-0' rowspan='2'>Date</th>
                    <th className='py-0' rowspan='2'>Time</th>
                    <th className='py-0' colspan='7' scope='colgroup'>Payment Method</th>
                    <th className='py-0' rowspan='2'>Consultation Amount</th>
                    <th className='py-0' rowspan='2'>Procedure Amount</th>
                    <th className='py-0' rowspan='2'>Extra Charges</th>
                    <th className='py-0' rowspan='2'>Discount</th>
                    <th className='py-0' rowspan='2'>CGST</th>
                    <th className='py-0' rowspan='2'>SGST</th>
                    <th className='py-0' rowspan='2'>Pending Amt.</th>
                    <th className='py-0' rowspan='2'> Grand Total</th>
                  </tr>
                  <tr>
                    <th className='bg-pearl py-0' scope='col'>Cash</th>
                    <th className='bg-pearl py-0' scope='col'>Card</th>
                    <th className='bg-pearl py-0' scope='col'>Paytm</th>
                    <th className='bg-pearl py-0' scope='col'>Phonepe</th>
                    <th className='bg-pearl py-0' scope='col'>Razorpay</th>
                    <th className='bg-pearl py-0' scope='col'>Wire-Transfer</th>
                    <th className='bg-pearl py-0' scope='col'>Points</th>
                  </tr>
                </thead>


                {
                  loading ? (
                    <tbody>
                      <tr className='position-relative text-burntumber mt-1 m-auto'>
                        <td className=' position-absolute start-0 end-0 text-charcoal75 mt-1  '>Please be Patient while we are fetching Appointments</td></tr>
                    </tbody>
                  ) : (
                    Appointments.length == 0 ? (
                      <tbody >
                        <tr className='position-relative text-burntumber mt-1 m-auto'>
                          <td className=' position-absolute start-0 end-0 text-charcoal fw-bold mt-1'>No Appointments</td></tr>
                      </tbody>
                    ) : (
                      <tbody className='align-items-center Appointment'>
                        {
                          Appointments.map((data, i) => (
                            <tr className={`bg-${SumPendingpayments(i) > 0 ? 'lightred50' : ''}`}>
                              <td className='py-0 m-0 py-1'>{data.id ? data.id : 'N/A'}</td>
                              <td className='py-0 m-0 py-1' key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.doctor && data.doctor.consulationFee !== null ? data.doctor.consulationFee : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.procedure_cost && data.procedure_cost != null ? data.procedure_cost : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{SumExtraCharges(i)}</td>
                              <td className='py-0 m-0 py-1'>{data.discount && data.discount != null ? data.discount : 'N/A'}</td>
                              <td className='py-0 m-0 py-1'>{data.CGST}</td>
                              <td className='py-0 m-0 py-1'>{data.SGST}</td>
                              <td className='py-0 m-0 py-1'>{SumPendingpayments(i)}</td>
                              <td className='py-0 m-0 py-1'>{data.total_amount}</td>
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
        </div>
        <div className="accordion-item" ref={Pendingref}>
          <h2 className="accordion-header" id="headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <h6 className='p-0 m-0 text-burntumber text-center fw-semibold '>Pending Payments Recieved: {pendingpaid.length}</h6>

  
              <DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
                sheet="Appointments"
                currentTableRef={Pendingref.current}
              >
              <button className='btn p-0 m-0 ms-5 text-charcoal fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} /> Export</button>

              </DownloadTableExcel>
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div className='container-fluid accordion-body scroll scroll-y p-0 m-0' style={{ maxHeight: '45vh', height: '45vh' }}>
              <table className='table text-center'>
                <thead className='bg-pearl position-sticky top-0'>
                  <tr>
                    <th className='py-0 my-0' rowspan='2'>Appointment Id</th>
                    <th className='py-0 my-0' rowspan='2'>Bill no.</th>
                    <th className='py-0 my-0' rowspan='2'>Name</th>
                    <th className='py-0 my-0' rowspan='2'>Mobile</th>
                    <th className='py-0 my-0' rowspan='2'>Doctor Name</th>
                    <th className='py-0 my-0' rowspan='2'>Appointment Date</th>
                    <th className='py-0 my-0' rowspan='2'>Payment Recieved Date</th>
                    <th className='py-0 my-0' colspan='7' scope='colgroup'>Payment Method</th>
                    <th className='py-0 my-0' rowspan='2'>Amount Received</th>
                  </tr>
                  <tr>
                    <th className='py-0 my-0' scope='col'>Cash</th>
                    <th className='py-0 my-0' scope='col'>Card</th>
                    <th className='py-0 my-0' scope='col'>Paytm</th>
                    <th className='py-0 my-0' scope='col'>Phonepe</th>
                    <th className='py-0 my-0' scope='col'>Razorpay</th>
                    <th className='py-0 my-0' scope='col'>Wire-Transfer</th>
                    <th className='py-0 my-0' scope='col'>Points</th>
                  </tr>
                </thead>
                <tbody className='Pendingpay'>

                  {
                    pendingpaid.map((data, i) => (
                      <tr key={i}>
                        <td className='py-0 m-0 py-1'>{data.appointment && data.appointment.id != null ? data.appointment.id : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.id && data.id != null ? data.id : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.appointment && data.appointment != null && data.appointment.patient && data.appointment.patient.full_name != null ? data.appointment.patient.full_name : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.appointment && data.appointment != null && data.appointment.patient.phone_number && data.appointment.patient.phone_number != null ? data.appointment.patient.phone_number : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.appointment && data.appointment != null && data.appointment.doctor && data.appointment.doctor.doctor_name != null ? data.appointment.doctor.doctor_name : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.appointment && data.appointment != null && data.appointment.appointment_date != null ? reversefunction(data.appointment.appointment_date) : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.paid_date && data.paid_date != null ? reversefunction(data.paid_date) : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                        <td className='py-0 m-0 py-1'>{data.paid_amount}</td>
                      </tr>
                    ))
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="accordion-item" ref={Advancedref}>
          <h2 className="accordion-header" id="headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <h6 className='p-0 m-0 text-burntumber fw-semibold text-center '>Advanced Payments Recieved:{advancepaid.length}</h6>
              <DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
                sheet="Appointments"
                currentTableRef={Advancedref.current}
              >
                <button className=' btn p-0 m-0 ms-5 text-charcoal fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} /> Export</button>

              </DownloadTableExcel>
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
            <div className='container-fluid accordion-body scroll scroll-y p-0 m-0' style={{ maxHeight: '45vh', height: '45vh' }}>
              <table className='table text-center'>
                <thead className='bg-pearl position-sticky top-0'>
                  <tr>
                    <th className='py-0 my-0' rowspan='2'>Credit ID</th>
                    <th className='py-0 my-0' rowspan='2'>Patient Name</th>
                    <th className='py-0 my-0' rowspan='2'>Doctor Name</th>
                    <th className='py-0 my-0' rowspan='2'>Mobile No.</th>
                    <th className='py-0 my-0' rowspan='2'>Description</th>
                    <th className='py-0 my-0' rowspan='2'>Date Recieved</th>
                    <th className='py-0 my-0' colspan='7' scope='colgroup'>Payment Method</th>
                    <th className='py-0 my-0' rowspan='2'>Amount Recieved</th>
                  </tr>
                  <tr>
                    <th className='bg-white py-0 my-0' scope='col'>Cash</th>
                    <th className='bg-white py-0 my-0' scope='col'>Card</th>
                    <th className='bg-white py-0 my-0' scope='col'>Paytm</th>
                    <th className='bg-white py-0 my-0' scope='col'>Phonepe</th>
                    <th className='bg-white py-0 my-0' scope='col'>Razorpay</th>
                    <th className='bg-white py-0 my-0' scope='col'>Wire-Transfer</th>
                    <th className='bg-white py-0 my-0' scope='col'>Points</th>
                  </tr>
                </thead>
                <tbody className='Advancepay'>

                  {
                    advancepaid.map((data, i) => (
                      <tr key={i} className=''>
                        <td className='py-0 py-1'>{data.id ? data.id : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.doctor && data.doctor.full_name != null ? data.doctor.full_name : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.patient && data.patient.phone_number !== null ? data.patient.phone_number : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.description && data.description != null ? data.description : 'N/A'}</td>
                        <td className='py-0 py-1'>{reversefunction(data.date)}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                        <td className='py-0 py-1'>{data.credit_amount}</td>
                      </tr>
                    ))
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>



  )
}

export { Appointments_Dsr }
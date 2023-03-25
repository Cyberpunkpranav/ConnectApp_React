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
  const [pageindex, setpageindex] = useState()
  const [loading, setloading] = useState()
  const [appxl, setappxl] = useState('none')
  const [pprxl, setpprxl] = useState('none')
  const [advxl, setadvxl] = useState('none')
  // props.doctorid, props.fromdate, props.todate
  let listdata = []
  async function DSR_All_Appointments() {
    setloading(true)
    if (props.doctorid || props.fromdate || props.todate) {
      try {
        await axios.get(`${url}/DSR/appointments?from_date=${props.fromdate}&to_date=${props.todate}&admin_id=${adminid}&clinic_id=${props.clinic}&doctor_id=${props.doctorid ? props.doctorid : ''}`).then((response) => {
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
  }, [props.doctorid, props.fromdate, props.todate, props.clinic])
  // console.log(visibles)
  // console.log(Appointments,props.clinic)

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
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(Appointments[i].payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })
      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })
      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })
      }
    }


    return cash
  }
  function payment_method_detailsForCard() {
    let cardarr = []
    let card = 0

    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
    }

    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
    }

    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
    }
    return card
  }
  function payment_method_detailsForPaytm() {
    let paytmarr = []
    let paytm = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })

      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })

      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })

      }
    }


    return paytm
  }
  function payment_method_detailsForRazorPay() {
    let razorpayarr = []
    let razorpay = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
    }
    return razorpay
  }
  function payment_method_detailsForPoints() {
    let pointsarr = []
    let points = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(Appointments[i].payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })
      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })
      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })
      }
    }


    return points
  }
  function payment_method_detailsForPhonepe() {
    let phonepearr = []
    let phonepe = 0

    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(Appointments[i].payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(pendingpaid[i].payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(advancepaid[i].payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
    }
    return phonepe
  }
  function payment_method_detailsForWireTransfer() {
    let wiretransferarr = []
    let wiretransfer = 0

    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < Appointments.length; i++) {
        if (JSON.parse(Appointments[i].payment_method_details) != null && JSON.parse(Appointments[i].payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(Appointments[i].payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
    }
    if (pageindex == 1) {
      for (let i = 0; i < pendingpaid.length; i++) {
        if (JSON.parse(pendingpaid[i].payment_method_details) != null && JSON.parse(pendingpaid[i].payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(pendingpaid[i].payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
    }
    if (pageindex == 2) {
      for (let i = 0; i < advancepaid.length; i++) {
        if (JSON.parse(advancepaid[i].payment_method_details) != null && JSON.parse(advancepaid[i].payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(advancepaid[i].payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
    }


    return wiretransfer
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
  console.log(Appointments)
  return (
    <div className='Appointments_Dsrsection'>
      <div className='position-relative'>

        <div className="col position-absolute top-0 " style={{ marginTop: '-3.1rem', marginLeft: '26rem' }}>
          <div className="dropdown">
            <button className="button button p-0 m-0 px-1 py-1 button-pearl text-burntumber  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Exports
            </button>
            <ul className="dropdown-menu" >
              <li className="text-center border-bottom" onClick={() => { setappxl('block') }}><DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
                sheet="Appointments"
                currentTableRef={Appointmentref.current}
              >
                <button className='btn p-0 m-0'>Appointments Export</button>

              </DownloadTableExcel></li>
              <li className="text-center  border-bottom" onClick={() => { setpprxl('block') }}><DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Pending Payments Reciecved`}
                sheet=" Pending Payments Reciecved"
                currentTableRef={Pendingref.current}
              >
                <button className='btn p-0 m-0 '>Pending Payments Reciecved Export</button>

              </DownloadTableExcel></li>
              <li className="text-center" onClick={() => { setadvxl('block') }}>
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Advance payment Recieved`}
                  sheet=" Advance payment Recieved"
                  currentTableRef={Advancedref.current}
                >
                  <button className=' btn p-0 m-0'>Advance payment Recieved Export</button>

                </DownloadTableExcel>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <ul className="nav nav-pills mb-3 ms-2 ms-lg-2 ms-md-2 ms-sm-2" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button onClick={() => { setpageindex(0) }} className="nav-link active p-0 m-0 py-1 px-3 rounded-pill" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" >Appointments<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{Appointments.length}</span></button>
        </li>
        <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
          <button onClick={() => { setpageindex(1) }} className="nav-link p-0 m-0 py-1 px-3 rounded-pill" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Pendings Paid<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{pendingpaid.length}</span></button>
        </li>
        <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
          <button onClick={() => { setpageindex(2) }} className="nav-link p-0 m-0 py-1 px-3 rounded-pill" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Advance Payments<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{advancepaid.length}</span></button>
        </li>
      </ul>


      <div className="tab-content" id="pills-tabContent ">
        <div className="tab-pane fade show active text-start" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
          <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
          <div className="row m-0 g-2 mt-md-2 p-0 text-start justify-content-start">
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCash()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCard()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPaytm()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPhonepe()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForWireTransfer()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForRazorPay()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPoints()}</h6>
            </div>
          </div>
          <div className=' scroll scroll-y pb-5' style={{ maxHeight: '58vh' }}>
            <table className='table text-start bg-pearl '>
              <thead className='position-sticky top-0 bg-pearl'>
                <tr className='bg-pearl'>
                  <th className=' text-charcoal75 fw-bold'>Appoint. Id</th>
                  <th className=' text-charcoal75 fw-bold'>Bill no.</th>
                  <th className=' text-charcoal75 fw-bold'>Name</th>
                  <th className=' text-charcoal75 fw-bold'>Mobile</th>
                  <th className=' text-charcoal75 fw-bold'>Doctor</th>
                  <th className=' text-charcoal75 fw-bold'>Date</th>
                  <th className=' text-charcoal75 fw-bold'>Time</th>
                  <th className=' text-charcoal75 fw-bold'>Payment Mode</th>
                  <th className=' text-charcoal75 fw-bold'>Amt. Recieved</th>
                  <th className=' text-charcoal75 fw-bold'>Consult Amt.</th>
                  <th className=' text-charcoal75 fw-bold'>Procedure Amt.</th>
                  <th className=' text-charcoal75 fw-bold'>Extra Charges</th>
                  <th className=' text-charcoal75 fw-bold'>Disc.</th>
                  <th className=' text-charcoal75 fw-bold'>CGST</th>
                  <th className=' text-charcoal75 fw-bold'>SGST</th>
                  <th className=' text-charcoal75 fw-bold'>Pending Amt.</th>
                  <th className=' text-charcoal75 fw-bold'> Grand Total</th>
                </tr>
              </thead>


              {
                loading ? (
                  <body className=' text-start' style={{ minHeight: '55vh' }}>
                    <tr className='position-absolute border-0 start-0 end-0 px-5 '>
                      <div class="d-flex align-items-center">
                        <strong className='fs-5'>Getting Details please be Patient ...</strong>
                        <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                      </div>
                    </tr>

                  </body>
                ) : (
                  Appointments.length == 0 ? (
                    <tbody >
                      <tr className='position-relative text-burntumber mt-1 m-auto'>
                        <td className=' position-absolute start-0 end-0 text-charcoal fw-bold mt-1'>No Appointments</td></tr>
                    </tbody>
                  ) : (
                    <tbody className='align-items-center Appointment '>
                      {
                        Appointments.map((data, i) => (
                          <tr className={`align-middle bg-${SumPendingpayments(i) > 0 ? 'lightred50' : ''}`}>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.id ? data.id : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2' key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.patient && data.patient.full_name != null ? data.patient.full_name : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.doctor && data.doctor.consulationFee !== null ? data.doctor.consulationFee : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.procedure_cost && data.procedure_cost != null ? data.procedure_cost : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{SumExtraCharges(i)}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.discount && data.discount != null ? data.discount : ''}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.CGST}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.SGST}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{SumPendingpayments(i)}</td>
                            <td className='fw-bold text-charcoal px-0 px-2'>{data.total_amount}</td>
                          </tr>

                        ))
                      }
                      {/* <tr>--</tr>
                     <tr>--</tr>
                     <tr>--</tr>
                     <tr>--</tr>
                     <tr>--</tr> */}
                    </tbody>
                  )

                )
              }

            </table>
            <table className={`table text-center bg-pearl d-none d-${appxl} `} ref={Appointmentref}>
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
                      <td className=' position-absolute start-0 end-0 text-charcoal75 mt-1'>Please be Patient while we are fetching Appointments</td></tr>
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
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.id ? data.id : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2' key={i}>{data.bill_id && data.bill_id != null ? data.bill_id : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.patient && data.patient.phone_number != null ? data.patient.phone_number : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.doctor && data.doctor.doctor_name && data.doctor.doctor_name != null ? data.doctor.doctor_name : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.timeslot && data.timeslot.date && data.timeslot.date != null ? reversefunction(data.timeslot.date) : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.timeslot && data.timeslot.time_from && data.timeslot.time_from != null ? tConvert(data.timeslot.time_from) : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.doctor && data.doctor.consulationFee !== null ? data.doctor.consulationFee : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.procedure_cost && data.procedure_cost != null ? data.procedure_cost : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{SumExtraCharges(i)}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.discount && data.discount != null ? data.discount : 'N/A'}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.CGST}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.SGST}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{SumPendingpayments(i)}</td>
                            <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.total_amount}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  )

                )
              }

            </table>
          </div>
          <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0 scroll'>
            <div className="d-flex p-0 m-0 ">
              <div className="col-auto">
                <div className="row p-0 m-0 justify-content-end">
                  <div className="col-auto">
                    <h6 className='fw-bold text-charcoal75 '>Grand Total</h6>
                    <h5 className='fw-bold'>Rs. {GrandTotal()}</h5>
                  </div>
                  <div className="col-auto">
                    <h6 className='fw-bold text-charcoal75 '>Total Pending Amounts</h6>
                    <h5 className='fw-bold text-burntumber'>Rs. {TotalPendingPayment()}</h5>
                  </div>

                </div>
              </div>

            </div>


          </div>

        </div>
        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
          <div className="row m-0 g-2 mt-md-2 p-0 text-start justify-content-start">
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1  bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCash()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCard()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPaytm()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPhonepe()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForWireTransfer()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForRazorPay()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPoints()}</h6>
            </div>
          </div>
          <div className=' scroll scroll-y pb-5' style={{ maxHeight: '58vh' }}>
            <table className={`table text-start`}>
              <thead className='bg-pearl position-sticky top-0'>
                <tr>
                  <th className='text-charcoal75 fw-bold'>Appoint. Id</th>
                  <th className='text-charcoal75 fw-bold'>Bill no.</th>
                  <th className='text-charcoal75 fw-bold'>Name</th>
                  <th className='text-charcoal75 fw-bold'>Mobile</th>
                  <th className='text-charcoal75 fw-bold'>Doctor</th>
                  <th className='text-charcoal75 fw-bold'>Appoint. Date</th>
                  <th className='text-charcoal75 fw-bold'>Payment Recieved Date</th>
                  <th className='text-charcoal75 fw-bold'>Payment Mode</th>
                  <th className='text-charcoal75 fw-bold'>Amt. Received</th>
                  <th className='text-charcoal75 fw-bold'>Paid Amt.</th>
                </tr>

              </thead>
              <tbody className='Pendingpay'>

                {
                  pendingpaid.map((data, i) => (
                    <tr key={i}>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment.id != null ? data.appointment.id : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.id && data.id != null ? data.id : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.patient && data.appointment.patient.full_name != null ? data.appointment.patient.full_name : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.patient.phone_number && data.appointment.patient.phone_number != null ? data.appointment.patient.phone_number : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.doctor && data.appointment.doctor.doctor_name != null ? data.appointment.doctor.doctor_name : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.appointment_date != null ? reversefunction(data.appointment.appointment_date) : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.paid_date && data.paid_date != null ? reversefunction(data.paid_date) : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.paid_amount}</td>
                    </tr>
                  ))
                }

              </tbody>
            </table>

            <table className={`table text-center d-none  d-${pprxl}`} ref={Pendingref}>
              <thead className='bg-pearl position-sticky top-0'>
                <tr>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Appoint. Id</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Bill no.</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Name</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Mobile</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Doctor</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Appoint. Date</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Payment Recieved Date</th>
                  <th className='py-0 text-charcoal75 fw-bold' colspan='7' scope='colgroup'>Payment Method</th>
                  <th className='py-0 text-charcoal75 fw-bold' rowspan='2'>Amount Received</th>
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
              <tbody className='Pendingpay'>

                {
                  pendingpaid.map((data, i) => (
                    <tr key={i}>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment.id != null ? data.appointment.id : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.id && data.id != null ? data.id : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.patient && data.appointment.patient.full_name != null ? data.appointment.patient.full_name : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.patient.phone_number && data.appointment.patient.phone_number != null ? data.appointment.patient.phone_number : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.doctor && data.appointment.doctor.doctor_name != null ? data.appointment.doctor.doctor_name : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.appointment && data.appointment != null && data.appointment.appointment_date != null ? reversefunction(data.appointment.appointment_date) : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.paid_date && data.paid_date != null ? reversefunction(data.paid_date) : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.paid_amount}</td>
                    </tr>
                  ))
                }

              </tbody>
            </table>
          </div>
          <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0 scroll'>
            <div className="d-flex p-0 m-0 ">
              <div className="col-auto">
                <div className="row p-0 m-0 justify-content-start">
                  <div className="col-auto">
                    <h6 className='fw-bold text-charcoal75 '>Recieved Pending Amount</h6>
                    <h5 className='fw-bold'>Rs. {PendingAmountRecieved()}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
          <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
          <div className="row m-0 g-2 mt-md-2 p-0 text-start justify-content-start">
            <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCash()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForCard()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPaytm()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPhonepe()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForWireTransfer()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForRazorPay()}</h6>
            </div>
            <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
              <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
              <h6 className='fw-bold p-0 m-0 text-start'>Rs. {payment_method_detailsForPoints()}</h6>
            </div>
          </div>
          <div className=' scroll scroll-y pb-5' style={{ maxHeight: '58vh' }}>
            <table className={`table text-start`}>
              <thead className='bg-pearl position-sticky top-0'>
                <tr>
                  <th className='text-charcoal75 fw-bold'>Credit ID</th>
                  <th className='text-charcoal75 fw-bold'>Patient Name</th>
                  <th className='text-charcoal75 fw-bold'>Doctor Name</th>
                  <th className='text-charcoal75 fw-bold'>Mobile No.</th>
                  <th className='text-charcoal75 fw-bold'>Description</th>
                  <th className='text-charcoal75 fw-bold'>Date Recieved</th>
                  <th className='text-charcoal75 fw-bold'>Payment Mode </th>
                  <th className='text-charcoal75 fw-bold'>Amt.</th>
                  <th className='text-charcoal75 fw-bold'>Total Amount</th>
                </tr>

              </thead>
              <tbody className='Advancepay'>

                {
                  advancepaid.map((data, i) => (
                    <tr key={i} className=''>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.id ? data.id : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.patient && data.patient.full_name != null ? data.patient.full_name : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.doctor && data.doctor.full_name != null ? data.doctor.full_name : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.patient && data.patient.phone_number !== null ? data.patient.phone_number : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.description && data.description != null ? data.description : 'N/A'}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{reversefunction(data.date)}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                      <td className='fw-bold text-charcoal px-0 px-2'>{data.credit_amount}</td>
                    </tr>
                  ))
                }

              </tbody>
            </table>
            <table className={`table text-start d-none d-${advxl}`} ref={Advancedref}>
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

          <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0 scroll'>
            <div className="d-flex p-0 m-0 ">
              <div className="col-auto">
                <div className="row p-0 m-0 justify-content-start">
                  <div className="col-auto">
                    <h6 className='fw-bold text-charcoal75 '>Recieved Advance Amount</h6>
                    <h5 className='fw-bold'>Rs. {AdvancedAmountRecieved()}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>


  )
}

export { Appointments_Dsr }
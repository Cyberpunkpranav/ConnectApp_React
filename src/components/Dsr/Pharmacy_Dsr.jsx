import React, { useContext, useRef } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Notiflix from 'notiflix'
import { URL } from '../../index'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'

const Pharmacy_Dsr = (props) => {
  const Pendingsonly = useRef()
  const saleentry = useRef()
  const salereturn = useRef()
  const pendingsrecieved = useRef()
  const url = useContext(URL)
  const [pendingpaid, setpendingpaid] = useState([])
  const [advancepaid, setadvancepaid] = useState([])
  const [SaleEntryList, setSaleEntryList] = useState([])
  const [SalePendings, setSalePendings] = useState([])
  const [SaleReturnList, setSaleReturnList] = useState([])
  const [PendingPaid, setPendingPaid] = useState([])
  const [load, setload] = useState()
  const [pd, setpd] = useState('none')
  const [se, setse] = useState('block')
  const [pr, setpr] = useState('block')
  const [prxl, setprxl] = useState('none')
  const [pageindex, setpageindex] = useState()

  const PharmacyList = async () => {
    setload(true)
    try {
      await axios.get(`${url}/DSR/pharmacy?from=${props.fromdate}&to=${props.todate}`).then((response) => {
        setSaleReturnList(response.data.data.pharmacy_sale_return)
        setSaleEntryList(response.data.data.pharmacy)
        setPendingPaid(response.data.data.pending_paid)
        console.log(response)
        setload(false)
      })
    } catch (e) {
      setload(false)
      Notiflix.Notify.failure(e.message)
    }
  }
  useEffect(() => {
    PharmacyList()
  }, [props.fromdate, props.todate, props.clinic])




  //  useEffect((>{

  //  })

  function payment_method_detailsForCash() {
    let casharr = []
    let cash = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })

      }
      return cash
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })

      }
      return cash
    }

    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Cash != null) {
          casharr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Cash))
        }
      }
      if (casharr.length != 0) {
        casharr.forEach(item => {
          cash += item
        })

      }
      return cash
    }

  }
  function payment_method_detailsForCard() {
    let cardarr = []
    let card = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
      return card
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
      return card
    }

    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Card != null) {
          cardarr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Card))
        }
      }
      if (cardarr.length != 0) {
        cardarr.forEach(item => {
          card += item
        })

      }
      return card
    }

  }
  function payment_method_detailsForPaytm() {
    let paytmarr = []
    let paytm = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })
      }
      return paytm
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })
      }
      return paytm
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Paytm != null) {
          paytmarr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Paytm))
        }
      }
      if (paytmarr.length != 0) {
        paytmarr.forEach(item => {
          paytm += item
        })
      }
      return paytm
    }
  }
  function payment_method_detailsForRazorPay() {
    let razorpayarr = []
    let razorpay = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
      return razorpay
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
      return razorpay
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Razorpay != null) {
          razorpayarr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Razorpay))
        }
      }
      if (razorpayarr.length != 0) {
        razorpayarr.forEach(item => {
          razorpay += item
        })
      }
      return razorpay
    }

  }
  function payment_method_detailsForPoints() {
    let pointsarr = []
    let points = 0
    if (pageindex == undefined || pageindex == 1) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })

      }
      return points
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })

      }
      return points
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Points != null) {
          pointsarr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Points))
        }
      }
      if (pointsarr.length != 0) {
        pointsarr.forEach(item => {
          points += item
        })

      }
      return points
    }
  }
  function payment_method_detailsForPhonepe() {
    let phonepearr = []
    let phonepe = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
      return phonepe
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
      return phonepe
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details).Phonepe != null) {
          phonepearr.push(Number(JSON.parse(PendingPaid[i].payment_method_details).Phonepe))
        }
      }
      if (phonepearr.length != 0) {
        phonepearr.forEach(item => {
          phonepe += item
        })

      }
      return phonepe
    }
  }
  function payment_method_detailsForWireTransfer() {
    let wiretransferarr = []
    let wiretransfer = 0
    if (pageindex == undefined || pageindex == 0) {
      for (let i = 0; i < SaleEntryList.length; i++) {
        if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
      return wiretransfer
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {
        if (JSON.parse(SaleReturnList[i].sale_entry.payment_method_details) != null && JSON.parse(SaleReturnList[i].sale_entry.payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(SaleReturnList[i].sale_entry.payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
      return wiretransfer
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {
        if (JSON.parse(PendingPaid[i].payment_method_details) != null && JSON.parse(PendingPaid[i].payment_method_details)['Wire-Transfer'] != null) {
          wiretransferarr.push(Number(JSON.parse(PendingPaid[i].payment_method_details)['Wire-Transfer']))
        }
      }
      if (wiretransferarr.length != 0) {
        wiretransferarr.forEach(item => {
          wiretransfer += item
        })

      }
      return wiretransfer
    }
  }
  function TotalPendingPayment() {
    let totalpendingarr = []
    let totalpending = 0;
    for (let i = 0; i < SaleEntryList.length; i++) {
      for (let j = 0; j < SaleEntryList[i].pending_payments.length; j++) {
        if (SaleEntryList[i].pending_payments[j].is_paid == 0) {
          totalpendingarr.push(JSON.parse(SaleEntryList[i].pending_payments[j].pending_amount))
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
    if (pageindex == 0 || pageindex == undefined) {
      for (let i = 0; i < SaleEntryList.length; i++) {

        grandtotalarr.push(JSON.parse(SaleEntryList[i].grand_total))

      }
      if (grandtotalarr.length != 0) {
        grandtotalarr.forEach(item => {
          grandtotal += item
        })
      }
      return grandtotal
    }
    if (pageindex == 1) {
      for (let i = 0; i < SaleReturnList.length; i++) {

        grandtotalarr.push(JSON.parse(SaleReturnList[i].grand_total))

      }
      if (grandtotalarr.length != 0) {
        grandtotalarr.forEach(item => {
          grandtotal += item
        })
      }
      return grandtotal
    }
    if (pageindex == 2) {
      for (let i = 0; i < PendingPaid.length; i++) {

        grandtotalarr.push(JSON.parse(PendingPaid[i].paid_amount))

      }
      if (grandtotalarr.length != 0) {
        grandtotalarr.forEach(item => {
          grandtotal += item
        })
      }
      return grandtotal
    }


  }
  function SumExtraCharges(i) {
    let ExtraChargeSumarr = []
    let sum = 0
    SaleEntryList[i].other_charges.map((data) => (
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

    SaleEntryList[i].pending_payments.map((data) => {
      if (data.is_paid == 0) {
        PendingPaymentsSumarr.push(data.pending_amount)
      }
    })
    PendingPaymentsSumarr.forEach(item => {
      sum += Number(item)
    })
    return sum
  }
  const reversefunction = (date) => {
    if (date && date != null) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }
  function Conditionaldisplay(i) {
    if (se == 'block') {
      setse('none')
      setpd('block')
    }
    if (pd == 'block') {
      setse('block')
      setpd('none')
    }
  }
  // d-${Pendingsonly.current.checked = true ? Conditionaldisplay(i) : ''}
  return (
    <div className='Pharmacy_Dsrsection p-0 m-0'>
      <div className='position-relative'>
        <div className="col export_dropdown position-absolute top-0 ">
          <div className="dropdown">
            <button className="button button p-0 m-0 px-1 py-1 button-pearl text-burntumber  fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Exports </button>
            <ul className="dropdown-menu" >
              <li className="text-justify border-bottom">
                <span className={`d-${se}`}>
                  <DownloadTableExcel
                    filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Sale Entries`}
                    sheet="Sale Entries"
                    currentTableRef={saleentry.current}
                  >
                    <button className='btn p-0 m-0 bg-pearl px-2'>All Export</button>

                  </DownloadTableExcel>
                </span>
                <span className={`d-${pd}`}>
                  <DownloadTableExcel
                    filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Pending Sale Entries`}
                    sheet="Pendings"
                    currentTableRef={Pendingsonly.current}
                  >
                    <button className='btn p-0 m-0 bg-pearl px-2  '>Pending Export</button>

                  </DownloadTableExcel>
                </span></li>
              <li className="text-justify  border-bottom">
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Sale Returns`}
                  sheet="Sale Returns"
                  currentTableRef={salereturn.current}
                >
                  <button className='btn p-0 m-0 bg-pearl p-2'>Sale Returns Export</button>
                </DownloadTableExcel></li>
              <li className="text-justify">
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Pendings Recieved`}
                  sheet="Pendings Recieved"
                  currentTableRef={pendingsrecieved.current}
                >
                  <button className='btn p-0 m-0 bg-pearl px-2 text-start ' onClick={() => { prxl('block') }} >Pendings Recieved Export</button>
                </DownloadTableExcel>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className=''>
        <ul className="nav nav-pills mb-3 ms-2 ms-lg-3 ms-md-1 ms-sm-1" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active p-0 m-0 py-1 px-3 rounded-pill" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={() => { setpageindex(0) }}>Sale Entries<span class=" p-0 m-0 ms-2 badge text-lightyellow  fw-normal">{SaleEntryList.length}</span></button>
          </li>
          <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
            <button className="nav-link p-0 m-0 py-1 px-3 rounded-pill" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" onClick={() => { setpageindex(1) }}>Sale Returns<span class=" p-0 m-0 ms-2 badge text-lightyellow  fw-normal">{SaleReturnList.length}</span></button>
          </li>
          <li className="nav-item ms-lg-3 ms-md-2 ms-sm-1 ms-1" role="presentation">
            <button className="nav-link p-0 m-0 py-1 px-3 rounded-pill" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false" onClick={() => { setpageindex(2) }}>Pendings Recieved<span class=" p-0 m-0 ms-2 badge text-lightyellow  fw-normal">{PendingPaid.length}</span></button>
          </li>
        </ul>

        <div className="tab-content" id="pills-tabContent">

          <div className="tab-pane fade show active text-start" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
            <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
            <div className="row m-0 g-2 mt-md-2 p-0 text-start justify-content-start">
              <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCash()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCard()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPaytm()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPhonepe()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForWireTransfer()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForRazorPay()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPoints()}</h6>
              </div>
            </div>

            {/* onClick={()=>{setse('block')}} */}
            <div className=' saleoptions mt-2 position-absolute end-0 me-md-2 me-5 text-end'>
              {/* <span className={`d-${se}`}>
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Sale Entries`}
                  sheet="Sale Entries"
                  currentTableRef={saleentry.current}
                >
                  <button className='btn p-0 m-0 ms-lg-5 ms-md-5 ms-sm-3 ms-1 bg-pearl border-charcoal px-2 py-1 fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} />All Export</button>

                </DownloadTableExcel>
              </span>
              <span className={`d-${pd}`}>
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Pending Sale Entries`}
                  sheet="Pendings"
                  currentTableRef={Pendingsonly.current}
                >
                  <button className='btn p-0 m-0 ms-5 fw-bold bg-pearl border-charcoal px-2 py-1 '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} />Pending Export</button>

                </DownloadTableExcel>
              </span> */}
              <div className='selector '>
                <input ref={Pendingsonly} type="checkbox" className='form-check-input ms-2 me-1' onChange={() => { Conditionaldisplay() }} /><label className='text-burntumber fw-bold'>Show Pendings Only</label>
              </div>
            </div>

            <div className={`container-fluid p-0 m-0 scroll scroll-y mt-2 saleentries d-${se}`} ref={saleentry} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill no.</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill Date</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Name</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Doctor</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill Total</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Amt. Recieved</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Amt. Pending</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Payment Mode</th>
                    <th className='py-0 text-charcoal75 fw-bold text-center'>Payment Status</th>
                  </tr>
                </thead>
                {
                  load ? (
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5 '>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>
                  ) : (
                    SaleEntryList && SaleEntryList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center align-middle'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Sale Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-start' style={{ paddingBottom: '30px' }}>
                        {
                          SaleEntryList.map((data, i) => (
                            <tr className={`align-middle`}>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2' key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.bill_date !== null ? reversefunction(data.bill_date) : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.doctor_name !== null ? 'Dr. ' + data.doctor_name : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{SumPendingpayments(i)}</td>
                              <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                              <td className='fw-bold text-charcoal text-center'>{SumPendingpayments(i) !== 0 ?
                                <button className='button p-0 m-0 px-4 fw-bold text-charcoal rounded-pill button-lightred'>Pending</button>
                                :
                                <button className='button p-0 m-0 px-3 fw-bold rounded-pill text-cahrcoal button-lightgreen'>Completed</button>}</td>
                            </tr>
                          ))
                        }
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                      </tbody>

                    )
                  )
                }
              </table>

            </div>
            <div className={`container-fluid p-0 m-0 scroll scroll-y mt-2 saleentries d-${pd}`} ref={Pendingsonly} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill no.</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill Date</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Name</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Doctor</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Bill Total</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Amt. Recieved</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Amt. Pending</th>
                    <th className='py-0 text-charcoal75 fw-bold'>Payment Mode</th>
                    <th className='py-0 text-charcoal75 fw-bold text-center'>Payment Status</th>
                  </tr>
                </thead>
                {
                  load ? (
                    <body className=' text-center' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>
                  ) : (
                    SaleEntryList && SaleEntryList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Sale Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      // d-${SumPendingpayments(i) > 0 ? '':'none'}
                      <tbody className='text-start align-middle'>
                        {
                          SaleEntryList.map((data, i) => (

                            SumPendingpayments(i) > 0 ? (

                              <tr className={``}>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2' key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.bill_date !== null ? reversefunction(data.bill_date) : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data && data.doctor_name !== null ? 'Dr. ' + data.doctor_name : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>₹{SumPendingpayments(i)}</td>
                                <td className='fw-bold text-charcoal py-0 px-0 px-2'>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                                <td className='fw-bold text-charcoal text-center'><button className='button p-0 m-0 px-4 fw-bold text-charcoal rounded-pill button-lightred'>Pending</button></td>
                              </tr>
                            ) : (<></>)


                          ))
                        }
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                      </tbody>

                    )
                  )
                }
              </table>
            </div>
            <div className={`container-fluid p-0 m-0 scroll d-none scroll-y mt-2 saleentries d-${se}`} ref={saleentry} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th rowspan='2' className='py-0' >Bill no.</th>
                    <th rowspan='2' className='py-0' >Name</th>
                    {/* <th rowspan='2' className='py-0' >Mobile</th> */}
                    <th rowspan='2' className='py-0' >Doctor Name</th>
                    <th rowspan='2' className='py-0' >Bill Date</th>
                    <th colspan='7' scope='colgroup' className='border-0 p-0 m-0'>Payment Method</th>
                    <th rowspan='2' className='py-0' >Pending Amt.</th>
                    <th rowspan='2' className='py-0' > Grand Total</th>
                  </tr>
                  <tr>
                    <th className='bg-white py-0' scope='col'>Cash</th>
                    <th className='bg-white py-0' scope='col'>Card</th>
                    <th className='bg-white py-0' scope='col'>Paytm</th>
                    <th className='bg-white py-0' scope='col'>Phonepe</th>
                    <th className='bg-white py-0' scope='col'>Razorpay</th>
                    <th className='bg-white py-0' scope='col'>Wire-Transfer</th>
                    <th className='bg-white py-0' scope='col'>Points</th>
                  </tr>
                </thead>
                {
                  load ? (
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>
                  ) : (
                    SaleEntryList && SaleEntryList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Sale Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-start' style={{ paddingBottom: '30px' }}>
                        {
                          SaleEntryList.map((data, i) => (
                            <tr className={``}>
                              <td key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                              <td>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                              {/* <td>{data && data.patient && data.patient.phone_number !== null ? data.patient.phone_number : ''}</td> */}
                              <td>{data && data.doctor_name !== null ? 'Dr. ' + data.doctor_name : ''}</td>
                              <td>{data && data.bill_date !== null ? reversefunction(data.bill_date) : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : ''}</td>
                              <td>{SumPendingpayments(i)}</td>
                              <td>{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>

                            </tr>
                          ))
                        }
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                      </tbody>

                    )
                  )
                }
              </table>

            </div>
            <div className={`container-fluid p-0 m-0 scroll scroll-y d-none saleentries d-${pd}`} ref={Pendingsonly} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    {/* <th rowspan='2' >Mobile</th> */}
                    <th rowspan='2' >Doctor Name</th>
                    <th rowspan='2' >Bill Date</th>
                    <th colspan='7' scope='colgroup' className='border-0'>Payment Method</th>
                    <th rowspan='2' >Pending Amt.</th>
                    <th rowspan='2' > Grand Total</th>
                  </tr>
                  <tr>
                    <th className='bg-white' scope='col'>Cash</th>
                    <th className='bg-white' scope='col'>Card</th>
                    <th className='bg-white' scope='col'>Paytm</th>
                    <th className='bg-white' scope='col'>Phonepe</th>
                    <th className='bg-white' scope='col'>Razorpay</th>
                    <th className='bg-white' scope='col'>Wire-Transfer</th>
                    <th className='bg-white' scope='col'>Points</th>
                  </tr>
                </thead>
                {
                  load ? (
                    <body className=' text-center' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>
                  ) : (
                    SaleEntryList && SaleEntryList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Sale Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      // d-${SumPendingpayments(i) > 0 ? '':'none'}
                      <tbody className='text-start'>
                        {
                          SaleEntryList.map((data, i) => (

                            SumPendingpayments(i) > 0 ? (
                              <tr className={` bg-lightred50`}>
                                <td key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                                <td>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                                {/* <td>{data && data.patient && data.patient.phone_number !== null ? data.patient.phone_number : ''}</td> */}
                                <td>{data && data.doctor_name !== null ? 'Dr. ' + data.doctor_name : ''}</td>
                                <td>{data && data.bill_date !== null ? reversefunction(data.bill_date) : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : ''}</td>
                                <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : ''}</td>
                                <td>{SumPendingpayments(i)}</td>
                                <td>{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>

                              </tr>
                            ) : (<></>)


                          ))
                        }
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                      </tbody>

                    )
                  )
                }
              </table>
            </div>
            <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0'>
              <div className="row p-0 m-0">
                <div className="col-auto">
                  <h6 className='fw-bold text-charcoal75 '>Total Pending Payments</h6>
                  <h5 className='fw-bold'>₹ {TotalPendingPayment()}</h5>
                </div>
                <div className="col-auto">
                  <h6 className='fw-bold text-charcoal75 '>Grand Total</h6>
                  <h5 className='fw-bold'>₹ {GrandTotal()}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
            <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
            <div className="row m-0 g-2 p-0 text-start">
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCash()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCard()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPaytm()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPhonepe()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForWireTransfer()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForRazorPay()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPoints()}</h6>
              </div>
            </div>
            <div className=' saleoptions mt-lg-2 mt-md-2 position-absolute end-0 me-md-2 me-lg-5 me-1 text-end'>
              <span>
                {/* <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Sale Returns`}
                  sheet="Sale Returns"
                  currentTableRef={salereturn.current}
                >
                  <button className='btn p-0 m-0 ms-lg-5 ms-md-5 ms-sm-3 ms-1 bg-pearl border-charcoal fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} /> Export</button>
                </DownloadTableExcel> */}
              </span>
            </div>
            <div className='container-fluid p-0 m-0 scroll scroll-y salereturns mt-2' ref={salereturn} style={{ minHeight: '60vh', maxHeight: '60vh' }}>

              <table className='table fw-bold'>
                <thead className='text-start position-sticky top-0 bg-pearl '>
                  <tr className='text-charcoal75'>
                    {/* <th rowspan='2' className='py-0' >SE ID</th> */}
                    <th rowspan='2' className='py-0' >SR ID</th>
                    <th rowspan='2' className='py-0' >Bill no.</th>
                    <th rowspan='2' className='py-0' >Name</th>
                    {/* <th rowspan='2' className='py-0' >Mobile</th> */}
                    <th rowspan='2' className='py-0' >Doctor Name</th>
                    <th rowspan='2' className='py-0' >Bill Date</th>
                    {/* <th colspan='7' scope='colgroup' className='border-0 py-0'>Payment Method</th> */}
                    {/* <th rowspan='2' className='py-0' >Amount</th> */}
                    <th rowspan='2' className='py-0' >Return Date</th>
                    <th rowspan='2' className='py-0' >Returned Amount</th>
                  </tr>
                  {/* <tr>
                    <th className='bg-white py-0' scope='col'>Cash</th>
                    <th className='bg-white py-0' scope='col'>Card</th>
                    <th className='bg-white py-0' scope='col'>Paytm</th>
                    <th className='bg-white py-0' scope='col'>Phonepe</th>
                    <th className='bg-white py-0' scope='col'>Razorpay</th>
                    <th className='bg-white py-0' scope='col'>Wire-Transfer</th>
                    <th className='bg-white py-0' scope='col'>Points</th>
                  </tr> */}
                </thead>
                {
                  load ? (
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>
                  ) : (
                    SaleReturnList && SaleReturnList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute   text-charcoal fw-bold start-0 end-0' >No Sale Returns</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-start'>
                        {
                          SaleReturnList.map((data, i) => (
                            <tr>
                              {/* <td key={i}>{data.sale_entry_id && data.sale_entry_id !== null ? "SE-" + data.sale_entry_id : ''}</td> */}
                              <td key={i}>{data.return_no && data.return_no !== null ? "SR-" + data.return_no : ''}</td>
                              <td key={i}>{data.sale_entry && data.bill_id !== null ? "P-" + data.sale_entry.bill_id : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.full_name !== null ? data.sale_entry.patient.full_name : ''}</td>
                              {/* <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.phone_number !== null ? data.sale_entry.patient.phone_number : ''}</td> */}
                              <td>{data.sale_entry && data.sale_entry.doctor_name !== null ? 'Dr. ' + data.sale_entry.doctor_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.bill_date !== null ? reversefunction(data.sale_entry.bill_date) : ''}</td>
                              {/* <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Cash : data.sale_entry.pending_payments[0].payment_method_details && data.sale_entry.pending_payments[0].payment_method_details != null ? JSON.parse(data.sale_entry.pending_payments[0].payment_method_details).Cash:''}</td>
                              <td>{data.sale_entry.pending_payments[0] !==undefined && data.sale_entry.pending_payments[0].payment_method_details !==undefined && data.sale_entry.pending_payments[0].payment_method_details != null ? JSON.parse(data.sale_entry.pending_payments[0].payment_method_details).Card :''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Paytm : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Phonepe : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Razorpay : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details)['Wire-Transfer'] : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Points : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.grand_total !== null ? data.sale_entry.grand_total : ''}</td> */}
                              <td>{data.return_date && data.return_date !== null ? reversefunction(data.return_date) : ''}</td>
                              <td>₹{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>
                              {/* : data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Card */}
                            </tr>
                          ))
                        }
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                        <tr className='bg-pearl text-light'>__</tr>
                      </tbody>

                    )
                  )
                }
              </table>
            </div>
            <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0'>
              <div className="row p-0 m-0">
                <div className="col-auto">
                  <h6 className='fw-bold text-charcoal75 '>Grand Total</h6>
                  <h5 className='fw-bold'>₹ {GrandTotal()}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
            <h6 className="text-charcoal fw-bold p-0 m-0 ms-2 ms-lg-3 ms-md-1 ms-sm-1">Payments</h6>
            <div className="row m-0 g-2 mt-md-2 p-0 text-start justify-content-start">
              <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 justify-content-start'>CASH</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCash()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start  py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>CARD</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForCard()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PAYTM</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPaytm()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>PHONEPE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPhonepe()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>WIRE</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForWireTransfer()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>RAZORPAY</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForRazorPay()}</h6>
              </div>
              <div className="col-auto col-md-auto col-lg-auto text-start py-lg-1 py-md-1 px-lg-3 px-md-3 px-2 ms-lg-2 ms-md-2 ms-lg-3 ms-1 bg-seashell" style={{ borderLeft: '3.5px solid var(--burntumber)' }}>
                <p className='fw-bold text-charcoal75 text-start p-0 m-0 '>POINTS</p>
                <h6 className='fw-bold p-0 m-0 text-start'>₹ {payment_method_detailsForPoints()}</h6>
              </div>
            </div>
            {/* <div className=' saleoptions mt-2 position-absolute end-0 me-md-2 me-5 text-end'>
              <span>
                <DownloadTableExcel
                  filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Pendings Recieved`}
                  sheet="Pendings Recieved"
                  currentTableRef={pendingsrecieved.current}
                >
                  <button className='btn p-0 m-0 ms-5 bg-pearl border-charcoal px-2 py-1 fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} onClick={() => { prxl('block') }} /> Export</button>
                </DownloadTableExcel>
              </span>
            </div> */}
            <div className={`container-fluid p-0 m-0 scroll scroll-y pendingpayrecieve mt-2`} ref={pendingsrecieved} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl '>
                  <tr className='text-charcoal75 fw-bold'>
                    <th className='py-0' >Bill no.</th>
                    <th className='py-0' >Name</th>
                    <th className='py-0' >Doctor Name</th>
                    <th className='py-0' >Bill Date</th>
                    <th className='py-0' >Pending Date</th>
                    <th className='py-0' >Paid Date</th>
                    <th className='py-0'>payment Mode</th>
                    <th className='py-0'>Amt Recieved</th>
                    <th className='py-0' >Total Received</th>
                  </tr>

                </thead>

                {
                  load ? (
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>

                  ) : (
                    PendingPaid && PendingPaid.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Pending Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-start'>
                        {
                          PendingPaid.map((data, i) => (
                            <tr className='text-charcoal fw-bold'>
                              <td>{data.sale_entry && data.sale_entry.bill_id !== null ? "P-" + data.sale_entry.bill_id : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.full_name !== null ? data.sale_entry.patient.full_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.doctor_name !== null ? 'Dr. ' + data.sale_entry.doctor_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.bill_date !== null ? reversefunction(data.sale_entry.bill_date) : ''}</td>
                              <td>{data.pending_date && data.pending_date !== null ? reversefunction(data.pending_date) : ''}</td>
                              <td>{data.paid_date && data.paid_date !== null ? reversefunction(data.paid_date) : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? Object.keys(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                              <td>₹{data.payment_method_details && data.payment_method_details != null ? Object.values(JSON.parse(data.payment_method_details)) + '' : ''}</td>
                              <td>₹{data.paid_amount && data.paid_amount !== null ? data.paid_amount : ''}</td>
                            </tr>
                          ))
                        }
                      </tbody>

                    )
                  )
                }


              </table>
            </div>
            <div className={`container-fluid p-0 m-0 scroll scroll-y d-none pendingpayrecieve d-${prxl}`} ref={pendingsrecieved} style={{ minHeight: '60vh', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl '>
                  <tr>
                    <th rowspan='2' className='py-0' >Bill no.</th>
                    <th rowspan='2' className='py-0' >Name</th>
                    <th rowspan='2' className='py-0' >Doctor Name</th>
                    <th rowspan='2' className='py-0' >Bill Date</th>
                    <th rowspan='2' className='py-0' >Pending Date</th>
                    <th rowspan='2' className='py-0' >Paid Date</th>
                    <th colspan='7' scope='colgroup' className='border-0 py-0'>Payment Method</th>
                    <th rowspan='2' className='py-0' >Amount Received</th>
                  </tr>
                  <tr>
                    <th className='bg-white py-0' scope='col'>Cash</th>
                    <th className='bg-white py-0' scope='col'>Card</th>
                    <th className='bg-white py-0' scope='col'>Paytm</th>
                    <th className='bg-white py-0' scope='col'>Phonepe</th>
                    <th className='bg-white py-0' scope='col'>Razorpay</th>
                    <th className='bg-white py-0' scope='col'>Wire-Transfer</th>
                    <th className='bg-white py-0' scope='col'>Points</th>
                  </tr>
                </thead>

                {
                  load ? (
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className=''>Getting Details please be Patient ...</strong>
                          <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                        </div>
                      </tr>

                    </body>

                  ) : (
                    PendingPaid && PendingPaid.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Pending Entries</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-start'>
                        {
                          PendingPaid.map((data, i) => (
                            <tr>
                              <td>{data.sale_entry && data.sale_entry.bill_id !== null ? "P-" + data.sale_entry.bill_id : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.full_name !== null ? data.sale_entry.patient.full_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.doctor_name !== null ? 'Dr. ' + data.sale_entry.doctor_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.bill_date !== null ? reversefunction(data.sale_entry.bill_date) : ''}</td>
                              <td>{data.pending_date && data.pending_date !== null ? reversefunction(data.pending_date) : ''}</td>
                              <td>{data.paid_date && data.paid_date !== null ? reversefunction(data.paid_date) : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : ''}</td>
                              <td>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : ''}</td>
                              <td>{data.paid_amount && data.paid_amount !== null ? data.paid_amount : ''}</td>
                            </tr>
                          ))
                        }
                      </tbody>

                    )
                  )
                }


              </table>
            </div>
            <div className='p-0 m-0 py-1 ps-2 bg-seashell border position-absolute w-100 bottom-0'>
              <div className="row p-0 m-0">
                <div className="col-auto">
                  <h6 className='fw-bold text-charcoal75 '>Total Amount Recieved</h6>
                  <h5 className='fw-bold'>₹ {GrandTotal()}</h5>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>



  )
}

export { Pharmacy_Dsr }
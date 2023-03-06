import React, { useContext, useRef } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import Notiflix from 'notiflix'
import { URL } from '../../index'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import '../../css/bootstrap.css'
const Pharmacy_Dsr = (props) => {
  const Pendingsonly = useRef()
  const saleentry = useRef()
  const url = useContext(URL)
  const [pendingpaid, setpendingpaid] = useState([])
  const [advancepaid, setadvancepaid] = useState([])
  const [SaleEntryList, setSaleEntryList] = useState([])
  const [SaleReturnList, setSaleReturnList] = useState([])
  const [PendingPaid, setPendingPaid] = useState([])
  const [load, setload] = useState()
  const [pd, setpd] = useState('none')
  const [se, setse] = useState('block')
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
  }, [props.fromdate, props.todate])

  function payment_method_detailsForCash() {
    let casharr = []
    let cash = 0
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
  function payment_method_detailsForCard() {
    let cardarr = []
    let card = 0
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Card != null) {
        cardarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Card))
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
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Paytm != null) {
        paytmarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Paytm))
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
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Razorpay != null) {
        razorpayarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Razorpay))
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
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Points != null) {
        pointsarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Points))
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
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details).Phonepe != null) {
        phonepearr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details).Phonepe))
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
    for (let i = 0; i < SaleEntryList.length; i++) {
      if (JSON.parse(SaleEntryList[i].payment_method_details) != null && JSON.parse(SaleEntryList[i].payment_method_details)['Wire-Transfer'] != null) {
        wiretransferarr.push(Number(JSON.parse(SaleEntryList[i].payment_method_details)['Wire-Transfer']))
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
    <div className='Pharmacy_Dsrsection'>
      <div>

        {/* <div className="col-lg-2 col-md-2 col-sm-2 col-2 CARD3 rounded-2">
            <h6 className='text-lightgreen mt-2'>Exports</h6>
            <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>CSV</button>
            <button className='button button-pearl border-bottom-lightgreen ms-lg-2'>Excel</button>
          </div> */}

      </div>
      <div className='ms-2 mt-4'>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active p-0 m-0 py-1 px-3" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Sale Entries<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{SaleEntryList.length}</span></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link p-0 m-0 py-1 px-3" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Sale Returns<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{SaleReturnList.length}</span></button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link p-0 m-0 py-1 px-3" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Pendings Paid<span class=" p-0 m-0 ms-2 badge text-lightyellow fs-6 fw-normal">{PendingPaid.length}</span></button>
          </li>
        </ul>

        <div className="tab-content" id="pills-tabContent">

          <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0" ref={saleentry}>
            <div className="row p-0 m-0 g-2 justify-content-around ">
              <div className='= CARD1 p-2  shadow-sm rounded-2' style={{ width: 'fit-content', maxwidth: '24rem' }}>
                <h6 className="text-burntumber mt-1">Payment Methods</h6>
                <table className='w-100 bg-lightred50 rounded-2 p-2'>
                  <thead>
                    <th></th>
                    <th></th>
                    <th></th>
                  </thead>
                  <tbody>
                    <tr className=''>
                      <td className='px-2'>Cash:{payment_method_detailsForCash()}</td>
                      <td className='px-2'>Card:{payment_method_detailsForCard()}</td>
                      <td className='px-2'>WireTransfer:{payment_method_detailsForWireTransfer()}</td>
                    </tr>
                    <tr className=''>
                      <td className='px-2'>PhonePay:{payment_method_detailsForPhonepe()}</td>
                      <td className='px-2'>Points:{payment_method_detailsForPoints()}</td>
                      <td className='px-2'> RazorPay:{payment_method_detailsForRazorPay()}</td>
                    </tr>
                    <tr className=''>
                      <td className='px-2'>Paytm{' '}{payment_method_detailsForPaytm()} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className=" CARD2 p-2 shadow-sm rounded-2" style={{ width: 'fit-content', maxwidth: '24rem' }}>
                <h6 className='text-brandy'>Amounts</h6>
                {/* <div className='bg-lightyellow scroll ps-2 border-bottom py-2'>
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
                </div> */}
                <div className='bg-lightyellow rounded-2 p-1 border-bottom'>
                  <div className="row p-0 m-0">
                    <div className="col-auto">
                      <div className='text-charcoal text-wrap align-self-end fw-bold'> Total Pending Amount</div>
                      <div className='fw-bold fs-5 text-burntumber'>{TotalPendingPayment()}</div>
                    </div>
                    <div className="col-auto">
                      <div className='text-cahrcoal  text-wrap align-self-end fw-bold'>Grand Total Amount</div>
                      <div className='fw-bold fs-5 text-lightgreen'>{GrandTotal()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=' border text-center ps-2 mt-2'>
              <label className='text-burntumber fw-bold'>Show Pendings Only</label><input type="checkbox" className='form-check-input ms-2' ref={Pendingsonly} onChange={() => { Conditionaldisplay() }} />
              <DownloadTableExcel
                filename={`${reversefunction(props.fromdate) + ' to ' + reversefunction(props.todate)} Appointments`}
                sheet="Appointments"
                currentTableRef={saleentry.current}
              >
                <button className='btn p-0 m-0 ms-5 text-charcoal fw-bold '> <img src={process.env.PUBLIC_URL + '/images/download.png'} style={{ 'width': '1.5rem' }} /> Export</button>

              </DownloadTableExcel>
            </div>
            <div className={`container-fluid p-0 m-0 scroll scroll-y saleentries d-${se}`} style={{ minHeight: '10rem', maxHeight: '58vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    <th rowspan='2' >Mobile</th>
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
                    <body className=' text-start' style={{ minHeight: '55vh' }}>
                      <tr className='position-absolute border-0 start-0 end-0 px-5'>
                        <div class="d-flex align-items-center">
                          <strong className='fs-5'>Getting Details please be Patient ...</strong>
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
                      <tbody className='text-start'>
                        {
                          SaleEntryList.map((data, i) => (
                            <tr className={`bg-${SumPendingpayments(i) > 0 ? 'lightred50' : ''}`}>
                              <td key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                              <td>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                              <td>{data && data.patient && data.patient.phone_number !== null ? data.patient.phone_number : ''}</td>
                              <td>{data && data.doctor_name !== null ? data.doctor_name : ''}</td>
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
                      </tbody>

                    )
                  )
                }
              </table>

            </div>
            <div className={`container-fluid p-0 m-0 scroll scroll-y saleentries d-${pd}`} style={{ minHeight: '10rem', maxHeight: '58vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    <th rowspan='2' >Mobile</th>
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
                          <strong className='fs-5'>Getting Details please be Patient ...</strong>
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
                      <tbody className='text-start'>
                        {
                          SaleEntryList.map((data, i) => (
                            <tr className={`d-${SumPendingpayments(i) > 0 ? '' : 'none'} bg-lightred50`}>
                              <td key={i}>{data && data.bill_id !== null ? "P-" + data.bill_id : ''}</td>
                              <td>{data && data.patient && data.patient.full_name !== null ? data.patient.full_name : ''}</td>
                              <td>{data && data.patient && data.patient.phone_number !== null ? data.patient.phone_number : ''}</td>
                              <td>{data && data.doctor_name !== null ? 'Dr' + data.doctor_name : ''}</td>
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
                      </tbody>

                    )
                  )
                }
              </table>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
            <div className='container-fluid p-0 m-0 scroll scroll-y salereturns' style={{ minHeight: '10rem' }}>
              <table className='table'>
                <thead className='text-center position-sticky top-0 '>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    <th rowspan='2' >Mobile</th>
                    <th rowspan='2' >Doctor Name</th>
                    <th rowspan='2' >Bill Date</th>
                    <th colspan='7' scope='colgroup' className='border-0'>Payment Method</th>
                    <th rowspan='2' >Amount</th>
                    <th rowspan='2' >Return Date</th>
                    <th rowspan='2' >Returned Amount</th>
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
                    <tbody>
                      <tr>
                        <td>Loading.. Please Be Patient</td>
                      </tr>
                    </tbody>
                  ) : (
                    SaleReturnList && SaleReturnList.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center  m-auto'  >
                          <td className='position-absolute  text-charcoal fw-bold start-0 end-0' >No Sale Returns</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-center'>
                        {
                          SaleReturnList.map((data, i) => (
                            <tr>
                              <td key={i}>{data.sale_entry && data.bill_id !== null ? "P-" + data.sale_entry.bill_id : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.full_name !== null ? data.sale_entry.patient.full_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.phone_number !== null ? data.sale_entry.patient.phone_number : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.doctor_name !== null ? data.sale_entry.doctor_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.bill_date !== null ? reversefunction(data.sale_entry.bill_date) : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Cash : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Card : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Paytm : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Phonepe : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Razorpay : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details)['Wire-Transfer'] : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Points : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.grand_total !== null ? data.sale_entry.grand_total : ''}</td>


                              <td>{data.return_date && data.return_date !== null ? reversefunction(data.return_date) : ''}</td>
                              <td>{data.grand_total && data.grand_total !== null ? data.grand_total : ''}</td>

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
          <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
            <div className='container-fluid p-0 m-0 scroll scroll-y pendingpayrecieve'>
              <table className='table'>
                <thead className='text-center position-sticky top-0 '>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    <th rowspan='2' >Mobile</th>
                    <th rowspan='2' >Doctor Name</th>
                    <th rowspan='2' >Bill Date</th>
                    <th rowspan='2' >Pending Date</th>
                    <th rowspan='2' >Paid Date</th>
                    <th colspan='7' scope='colgroup' className='border-0'>Payment Method</th>
                    <th rowspan='2' >Amount Received</th>
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
                    <tbody>
                      <tr>
                        <td>Loading.. Please Be Patient</td>
                      </tr>
                    </tbody>
                  ) : (
                    PendingPaid && PendingPaid.length == 0 ? (
                      <tbody>
                        <tr className='position-relative text-center m-auto'>
                          <td className='position-absolute text-charcoal fw-bold start-0 end-0' >No Pending Paids</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className='text-center'>
                        {
                          PendingPaid.map((data, i) => (
                            <tr>
                              <td>{data.sale_entry && data.sale_entry.bill_id !== null ? "P-" + data.sale_entry.bill_id : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.full_name !== null ? data.sale_entry.patient.full_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.patient && data.sale_entry.patient.phone_number !== null ? data.sale_entry.patient.phone_number : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.doctor_name !== null ? 'Dr. ' + data.sale_entry.doctor_name : ''}</td>
                              <td>{data.sale_entry && data.sale_entry.bill_date !== null ? reversefunction(data.sale_entry.bill_date) : ''}</td>
                              <td>{data.pending_date && data.pending_date !== null ? reversefunction(data.pending_date) : ''}</td>
                              <td>{data.paid_date && data.paid_date !== null ? reversefunction(data.paid_date) : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Cash : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Card : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Paytm : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Phonepe : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Razorpay : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details)['Wire-Transfer'] : ''}</td>
                              <td>{data.sale_entry.payment_method_details && data.sale_entry.payment_method_details != null ? JSON.parse(data.sale_entry.payment_method_details).Points : ''}</td>
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
          </div>
        </div>
      </div>
    </div>



  )
}

export { Pharmacy_Dsr }
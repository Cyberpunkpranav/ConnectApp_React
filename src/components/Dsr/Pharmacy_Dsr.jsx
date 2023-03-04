import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Notiflix from 'notiflix'
import { URL } from '../../index'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'
import '../../css/bootstrap.css'
const Pharmacy_Dsr = (props) => {
  const url = useContext(URL)
  const [SaleEntryList, setSaleEntryList] = useState([])
  const [SaleReturnList, setSaleReturnList] = useState([])
  const [PendingPaid, setPendingPaid] = useState([])
  const [load, setload] = useState()

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
  console.log(SaleReturnList)
  let arr = [
    {
      id: 'c-102',
      name: 'kabir',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Time: '07:00 AM',
      Payment: 'Cash-2000 Card-2000',
      Amount: '1500',
      Discount: '0',
      Pending: '0',
      Grand_total: '1500'
    },
    {
      id: 'c-102',
      name: 'kabir',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Time: '07:00 AM',
      Payment: 'Cash-2000 Card-2000',
      Amount: '1500',
      Discount: '0',
      Pending: '0',
      Grand_total: '1500'
    },
    {
      id: 'c-102',
      name: 'kabir',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Time: '07:00 AM',
      Payment: 'Cash-2000 Card-2000',
      Amount: '1500',
      Discount: '0',
      Pending: '0',
      Grand_total: '1500'
    },
    {
      id: 'c-102',
      name: 'kabir',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Time: '07:00 AM',
      Payment: 'Cash-2000 Card-2000',
      Amount: '1500',
      Discount: '0',
      Pending: '0',
      Grand_total: '1500'
    }, {
      id: 'c-102',
      name: 'kabir',
      Mobile: '9977665544',
      Doctorname: 'Arushi Dudeja',
      Date: '12-01-2023',
      Time: '07:00 AM',
      Payment: 'Cash-2000 Card-2000',
      Amount: '1500',
      Discount: '0',
      Pending: '0',
      Grand_total: '1500'
    }
  ]
  const [Appointments, setAppointments] = useState(arr)
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
  return (
    <div className='Pharmacy_Dsrsection'>
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
      <div className='ms-2 mt-2'>
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
          <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
            <div className='container-fluid p-0 m-0 scroll scroll-y saleentries' style={{ minHeight: '10rem', maxHeight: '60vh' }}>
              <table className='table'>
                <thead className='text-start position-sticky top-0 bg-pearl'>
                  <tr>
                    <th rowspan='2' >Bill no.</th>
                    <th rowspan='2' >Name</th>
                    <th rowspan='2' >Mobile</th>
                    <th rowspan='2' >Doctor Name</th>
                    <th rowspan='2' >Bill Date</th>
                    <th colspan='7' scope='colgroup' className='border-0'>Payment Method</th>
                    <th rowspan='2' >Discount</th>
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
                    <tbody>
                      <tr>
                        <td>Loading.. Please Be Patient</td>
                      </tr>
                    </tbody>
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
                            <tr className={`bg-${SumPendingpayments(i)>0?'lightred50':''}`}>
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
       
                              <td>{data.Discount}</td>
                              <td>{  SumPendingpayments(i)}</td>
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
                    <th rowspan='2' >Discount</th>
                    <th rowspan='2' >Pending Amt.</th>
                    <th rowspan='2' >Return Date</th>
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
                              <td key={i}>{data.sale_entry && data.bill_id !== null ? "SR-" + data.sale_entry.bill_id : ''}</td>
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
                              <td>{data.Discount}</td>
                              <td>{data.Pending}</td>
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
          </div>
        </div>
      </div>
    </div>



  )
}

export { Pharmacy_Dsr }
import React from 'react'
import { useState } from 'react'
import '../../css/dashboard.css'
import '../../css/appointment.css'
import '../../css/dsr.css'

const Appointments_Dsr = () => {
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
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Appointments</h5>
        <div className='container-fluid scroll scroll-y appointments'>
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
        <h5 className='my-2 text-charcoal75 fw-semibold ms-2 '>Pending Payments Recieved</h5>
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
        </div>
      </div>
    </div>



  )
}

export { Appointments_Dsr }
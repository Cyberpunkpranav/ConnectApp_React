import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
import '../../css/bootstrap.css'
import { Payments } from './Payments'
const AmountPaid = (props) => {
  const [openpayments, setopenpayments] = useState('none')
  const [totalAmount, setTotalAmount] = useState(0)
  const [paidpendingtotal, setpaidpending] = useState(0)
  const calculate = () => {
    var data = props.appointmentData;
    if (data.payment_method != null) {
      var payment = Object.values(JSON.parse(data.payment_method_details))
      var val = 0;
      for (let i = 0; i < payment.length; i++) {
        var element = parseFloat(payment[i]);
        val += element
        setTotalAmount(val)
      }
    }
  }
  const CalculatePaidPendings = () => {
    let totalpaidpendings = []
    let pendingtotal = 0
    if (props.appointmentData.pending_payments && props.appointmentData.pending_payments != null) {
      for (let i = 0; i < props.appointmentData.pending_payments.length; i++) {
        if (props.appointmentData.pending_payments[i].is_paid == 1) {
          totalpaidpendings.push(props.appointmentData.pending_payments[i].paid_amount !== null ? props.appointmentData.pending_payments[i].paid_amount : 0)
        }
      }
    }

    totalpaidpendings.forEach(item => {
      pendingtotal += Number(item)
    })
    setpaidpending(pendingtotal)
  }
  useEffect(() => {
    calculate()
    CalculatePaidPendings()
  }, [])

  return (
    totalAmount != null ? (
      totalAmount + paidpendingtotal == props.appointmentData.total_amount ? (


        <div className='text-white bg-lightgreen d-inline-block px-2 fw-normal rounded-2' style={{ letterSpacing: '1px' }}>Paid ₹{Number(totalAmount) + Number(paidpendingtotal)}</div>
        // <div className="ms-1 btn button-sm rounded-1 button-lightgreen fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '0.12rem' }}>{Number(totalAmount) + Number(paidpendingtotal)} Done</div>
      ) : (
        <div className="text-burntumber bg-seashell fw-bold d-inline-block px-2 fw-normal rounded-2" style={{ letterSpacing: '1px' }}>Pending ₹{(Number(props.appointmentData.total_amount) - (Number(totalAmount) + Number(paidpendingtotal))).toFixed(1)} </div>

      )

    ) : (
      <button className="btn button-seashell p-0 m-0" type="button" disabled>
        <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      </button>
    )

  )
}

export default AmountPaid
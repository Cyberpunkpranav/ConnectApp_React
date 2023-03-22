import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
const AmountPaid = (props) => {

    const [totalAmount, setTotalAmount] = useState(0)
    const [paidpendingtotal,setpaidpending] =useState(0)
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
    const CalculatePaidPendings=()=>{
      let totalpaidpendings = []
      let pendingtotal = 0
      if(props.appointmentData.pending_payments && props.appointmentData.pending_payments!=null){
        for(let i = 0;i<props.appointmentData.pending_payments.length;i++){
            if(props.appointmentData.pending_payments[i].is_paid == 1){
              totalpaidpendings.push(props.appointmentData.pending_payments[i].paid_amount!==null?props.appointmentData.pending_payments[i].paid_amount:0)
            }
        }
      }

   totalpaidpendings.forEach(item=>{
    pendingtotal +=Number(item)
   })
   setpaidpending(pendingtotal)
    }
    useEffect(() => {
      calculate()
      CalculatePaidPendings()
  }, [])

    return (
        totalAmount !=null ? (
            totalAmount+paidpendingtotal == props.appointmentData.total_amount ? (<>
            <button className="ms-1 btn btn-sm button-lightgreen fw-bold">{Number(totalAmount)+Number(paidpendingtotal)} Done</button>
                                    </>) : (<>
                                      <button className="ms-1 btn btn-sm button-lightred fw-bold">{Number(props.appointmentData.total_amount)-(Number(totalAmount)+Number(paidpendingtotal))} Pending</button>
                                    </>)

                                  ) : (
                                    <button className="btn button-seashell p-0 m-0" type="button" disabled>
                                      <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    </button>
                                  )
    
    )
}

export default AmountPaid
import React, { useState, useEffect } from 'react'

const AmountPaid = (props) => {

    const [totalAmount, setTotalAmount] = useState(0)
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

    useEffect(() => {
        calculate()
    }, [])


    return (
        totalAmount !=null ? (
            totalAmount == props.appointmentData.total_amount ? (<>
            <button className="ms-1 btn btn-sm status_completed">{totalAmount}|Done</button>
                                    </>) : (<>
                                      <button className="ms-1 btn btn-sm status_pending">{totalAmount}| Pending</button>
                                    </>)

                                  ) : (
                                    <button className="btn button-seashell p-0 m-0" type="button" disabled>
                                      <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    </button>
                                  )
    
    )
}

export default AmountPaid
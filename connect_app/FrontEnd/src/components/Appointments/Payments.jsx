import axios from 'axios'
import React from 'react'
import { URL } from '../../index'
import { useContext } from 'react'
import { useState, useEffect } from 'react'
import Notiflix from 'notiflix'
import '../../css/dashboard.css'

const Payments = (props) => {
    const url = useContext(URL)
    const adminid = localStorage.getItem('id')
    const [blocksindex, setblocksindex] = useState(0)
    const blocks = ['Advance payments', 'Pending Payments']
    //Pending Payments
    const [pendingpayments, setpendingpayments] = useState([])
    const [pendingpaymentmethods, setpendingpaymentmethods] = useState([])
    //Advance Payments
    const [advancepaymentmethods, setadvancepaymentmethods] = useState([])
    const [loadadvancepayments, setloadadvancepayments] = useState(false)
    const [Description, setDescription] = useState('')
    const [advancepaid, setadvancepaid] = useState()
    const [loadappoint, setloadappoint] = useState(false)
    const advancepaymentmethoddetails = {
        paymentmethod: '',
        amount: 0
    }
    const pendingpaymentmethoddetails = {
        paymentmethod: '',
        amount: 0
    }
    async function AdvancePayments() {
        setloadadvancepayments(true)
        axios.post(`${url}/advance/balance`, {
            patient_id: props.patientid
        }).then((response) => {
            console.log(response.data)
            setadvancepaid(response.data.data)
            setloadadvancepayments(false)
        })
    }
    useEffect(() => {
        AdvancePayments()
    }, [])

    async function AddadvancePaymentMethods() {
        let amount = []
        let paymentmethod = []
        for (let j = 0; j < advancepaymentmethods.length; j++) {
            paymentmethod.push(advancepaymentmethods[j].paymentmethod)
            amount.push(advancepaymentmethods[j].amount)

        }
        let Data = {
            patient_id: props.patientid,
            admin_id: Number(adminid),
            description: Description,
            payment_method: paymentmethod,
            payment_method_main: paymentmethod,
            payment_method_details: amount
        }
        async function Payment() {
            setloadadvancepayments(true)
            await axios.post(`${url}/save/advance`, Data).then((response) => {
                console.log(response)
                props.fetchallAppointmentslist()
                setadvancepaymentmethods([])
                setDescription('')
                AdvancePayments()
                Notiflix.Notify.success(response.data.message)
                setloadadvancepayments(false)
            })
        }
        Payment()
    }

    function DeleteadvancePaymentMethods(i) {
        advancepaymentmethods.splice(i, i)
    }
    function DeletependingPaymentMethods(i) {
        pendingpaymentmethods.splice(i, i)
    }
    async function ExistedPendingPayments() {
        let pendings = []
        for (let j = 0; j < props.appointmentdata.pending_payments.length; j++) {
            pendings.push(props.appointmentdata.pending_payments[j])
        }
        setpendingpayments(pendings)
    }
    useEffect(() => {
        ExistedPendingPayments()
    }, [])

    async function UpdatePendingPayments() {
        let Paymentmethod = [];
        let Paymentmethodsvalue = []
        let pendingid = '';

        for (let j = 0; j < props.appointmentdata.pending_payments.length; j++) {
            if (props.appointmentdata.pending_payments[j].is_paid == 0) {
                pendingid = props.appointmentdata.pending_payments[j].id
            }

        }

        for (let j = 0; j < pendingpaymentmethods.length; j++) {
            console.log(pendingpaymentmethods[j])
            Paymentmethod.push(pendingpaymentmethods[j].paymentmethod)
            Paymentmethodsvalue.push(Number(pendingpaymentmethods[j].amount))
        }
        let Data = {
            payment_method: Paymentmethod,
            payment_method_main: Paymentmethod,
            payment_method_details: Paymentmethodsvalue,
            admin_id: Number(adminid),
            pending_id: pendingid
        }
        async function Payment() {
            setloadappoint(true)
            await axios.post(`${url}/appointment/save/pending/charges`, Data).then((response) => {
                props.fetchallAppointmentslist()
                Notiflix.Notify.success(response.data.message)
                props.setsingleload(0)
                setblocksindex(1)
                setloadappoint(false)
            })
        }
        Payment()
    }
    const reversefunction = (date) => {
        if (date && date != null) {
            date = date.split("-").reverse().join("-")
            return date
        }
    }
    // console.log(advancepaymentmethods)
    console.log(props.appointmentdata)
    return (
        <div className='bg-seashell rounded-2'>
            <h5 className='fs-4'>{props.patientname} Payments Section</h5>
            <button className='btn-close position-absolute end-0 p-2 top-0' onClick={props.toggle_payments}></button>
            <hr />
            <div className="row p-0 m-0 gx-2 justify-content-center">
                {
                    blocks.map((Data, i) => (
                        <div className="col-6 col-lg-4 col-md-6 col-xl-4 col-sm-6">
                            <button className={`button button-${i === blocksindex ? 'charcoal' : 'seashell'} border border-dark`} onClick={() => { setblocksindex(i) }}>{Data}</button>
                        </div>
                    ))
                }

            </div>
            <hr />
            <div className={`container-fluid p-0 m-0 text-center d-${blocksindex === 0 ? 'block' : 'none'}`}>
                <h5 className='text-burntumber fw-bolder mb-3 mt-2'>Advance Payment from {props.patientname}</h5>
                {
                    loadadvancepayments || props.isLoading ? (
                        <div className="col-6 py-2 pb-2 m-auto text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        advancepaid && advancepaid.advnace_total !== 0 ? (
                            <div className='row align-items-center p-0 m-0'>
                                <h6 className='text-charcoal col-6 fw-bold mt-2'>Advance Amount Balance</h6>
                                <input className=' col-6 p-0 m-0 form-control w-50 text-center bg-seashell ' value={advancepaid.advnace_total} />
                                <hr />
                            </div>

                        ) : (
                            <div className='bg-lightyellow text-center fw-bolder rounded-2 p-2'>No Advance Payments Found</div>
                        )

                    )
                }
                <h5 className='text-burntumber fw-bolder mb-3 mt-2'>Add Advance Payment</h5>
                <label className='text-charcoal fw-bold'>Description</label>
                <input type='text' className='form-control p-0 m-0 p-1 bg-seashell mb-3' value={Description ? Description : ''} onChange={(e) => setDescription(e.target.value)} />
                <label className='text-charcoal fw-bold'>Select Payment Method</label>
                {
                    advancepaymentmethods.map((data, i) => (
                        <div className="row p-0 m-0 mt-2  justify-content-center">
                            <div className="col-5 col-lg-5 col-md-5 col-sm-5 p-0 m-0 ">
                                <select className='form-control bg-seashell py-1' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setadvancepaymentmethods(prevState => [...prevState]) }}>
                                    <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                                    <option value='Cash'>Cash</option>
                                    <option value='Card'>Card</option>
                                    <option value='Paytm'>Paytm</option>
                                    <option value='Phonepe'>Phone Pe</option>
                                    <option value='Wire-Transfer'>Wire Transfer</option>
                                    <option value='Razorpay'>Razorpay</option>
                                    <option value='Points'>Points</option>
                                    <option value='Adjust-Advance'>Adjust-Advance Cash</option>
                                </select>
                            </div>
                            <div className="col-5 col-lg-5 col-md-5 col-sm-5 p-0 m-0 ms-1">
                                <input className='form-control bg-seashell py-1' value={data.amount} onChange={(e) => { data.amount = e.target.value; setadvancepaymentmethods(prevState => [...prevState]) }} />
                            </div>
                            <div className="col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 text-center">
                                <button className='btn btn-sm p-0 m-0' onClick={() => { DeleteadvancePaymentMethods(i); setadvancepaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                            </div>
                        </div>
                    ))
                }
                <div className="container-fluid text-center mt-2">
                    <button className='btn py-0' onClick={() => setadvancepaymentmethods(prevState => [...prevState, advancepaymentmethoddetails])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} /></button>
                </div>
                <button className='button button-burntumber mt-4' onClick={AddadvancePaymentMethods}>Save</button>
            </div>

            <div className={`container-fluid p-0 m-0 d-${blocksindex === 1 ? 'block' : 'none'} text-center`}>
                {
                    pendingpayments && pendingpayments != null && pendingpayments.length != 0 ? (
                        loadappoint ? (
                            <div className="col-6 py-2 pb-2 m-auto text-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h5 className='fw-bolder text-burntumber'>Previous Paid Pending Payments</h5>
                                <div className='p-0 m-0 scroll scroll-y'>
                                    <table className=' p-0 m-0 table text-center'>
                                        <thead className='p-0 m-0'>
                                            <tr>
                                                <th className='border p-0 m-0 px-1' rowspan='2'>Amount Paid</th>
                                                <th className='border p-0 m-0 px-1' rowspan='2'>Pending Date</th>
                                                <th className='border p-0 m-0 px-1' rowspan='2'>Paid Date</th>
                                                <th className='border p-0 m-0 px-1' colspan='7' scope='colgroup'>Payment Method</th>
                                            </tr>
                                            <tr>
                                                <th className='border p-0 m-0 px-1' scope='col'>Cash</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Card</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Paytm</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Phonepe</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Razorpay</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Wire-Transfer</th>
                                                <th className='border p-0 m-0 px-1' scope='col'>Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pendingpayments.map((data) => (
                                                    <tr className={` text-center d-${data.is_paid == 1 ? '' : 'none'}`}>
                                                        <td className='border'>{data.paid_amount}</td>
                                                        <td className='border'>{reversefunction(data.pending_date)}</td>
                                                        <td className='border'>{reversefunction(data.paid_date)}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                                                        <td className='border'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    pendingpayments.map((Data) => (
                                        <div className={`d-${Data.is_paid == 0 ? 'block' : 'none'} text-center`}>
                                            <h5 className='text-burntumber fw-bolder mt-2'>Pending Remains</h5>
                                            <div className=' bg-danger text-light fw-bolder fs-5 text-center' >{Data.pending_amount}</div>
                                            {
                                                pendingpaymentmethods.map((data, i) => (
                                                    <div className={`text-center`}>
                                                        <label className='text-charcoal fw-bold mt-3'>Select Payment Method to Pay Remaining pendings</label>
                                                        <div className="row p-0 m-0 justify-content-center">
                                                            <div className="col-5 col-lg-5 col-md-5 col-sm-5 p-0 m-0 ">
                                                                <select className='form-control bg-seashell py-1' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpendingpaymentmethods(prevState => [...prevState]) }}>
                                                                    <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                                                                    <option value='Cash'>Cash</option>
                                                                    <option value='Card'>Card</option>
                                                                    <option value='Paytm'>Paytm</option>
                                                                    <option value='Phonepe'>Phone Pe</option>
                                                                    <option value='Wire-Transfer'>Wire Transfer</option>
                                                                    <option value='Razorpay'>Razorpay</option>
                                                                    <option value='Points'>Points</option>
                                                                    <option value='Adjust-Advance'>Adjust-Advance Cash</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-5 col-lg-5 col-md-5 col-sm-1 p-0 m-0 ms-1">
                                                                <input className='form-control bg-seashell py-1' value={data.amount} onChange={(e) => { data.amount = e.target.value; setpendingpaymentmethods(prevState => [...prevState]) }} />
                                                            </div>
                                                            <div className="col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 text-center">
                                                                <button className='btn btn-sm p-0 m-0' onClick={() => { DeletependingPaymentMethods(i); setpendingpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))

                                }
                                <div className="container-fluid text-center mt-2">
                                    <button className='btn py-0' onClick={() => setpendingpaymentmethods(prevState => [...prevState, pendingpaymentmethoddetails])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} /></button>
                                </div>
                                <button className='button button-burntumber mt-4' onClick={UpdatePendingPayments}>Save</button>
                            </>
                        )
                    ) : (
                        <div className='rounded-2 bg-lightgreen fw-bolder p-2'>No Pending Payments Found</div>
                    )
                }
            </div>
        </div>
    )

}

export { Payments }
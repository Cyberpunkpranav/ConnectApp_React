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
    const [blocksindex, setblocksindex] = useState(props.paymentsi == undefined ? 0 : 1)
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
        axios.get(`${url}/get/balance/list?patient_id=${props.patientid?props.patientid:""}`).then((response) => {
            setadvancepaid([response.data.data])
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
                
                props.Appointmentlist()
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
        for (let i = 0; i < props.appointmentdata.length; i++) {
            if (props.appointmentid == props.appointmentdata[i].id) {
                for (let j = 0; j < props.appointmentdata[i].pending_payments.length; j++) {
                    pendings.push(props.appointmentdata[i].pending_payments[j])
                }
            }

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
        for (let i = 0; i < props.appointmentdata.length; i++) {
            for (let j = 0; j < props.appointmentdata[i].pending_payments.length; j++) {
                if (props.appointmentid == props.appointmentdata[i].id) {
                    if (props.appointmentdata[i].pending_payments[j].is_paid == 0) {
                        pendingid = props.appointmentdata[i].pending_payments[j].id
                    }
                }
            }
        }
        for (let j = 0; j < pendingpaymentmethods.length; j++) {
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
                props.Appointmentlist()
                Notiflix.Notify.success(response.data.message)
                props.setsingleload(0)
                setblocksindex(1)
                setloadappoint(false)
                props.ClosePaymentsForm()
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
    console.log(advancepaid)
    return (

        <div className='container-fluid p-0 m-0'>
            <div className="shadow-sm pt-2 pb-1">
            <h5 className='text-center fw-bold'>{props.patientname} Payments Section</h5>
            <button className='btn-close position-absolute end-0 p-2 top-0' onClick={props.ClosePaymentsForm}></button>
            </div>
            <div className="d-flex justify-content-start p-0 m-0 gx-2 mt-3 ms-3">
                {
                    blocks.map((Data, i) => (

                        <button className={`button button-${i === blocksindex ? 'charcoal' : 'seashell'} rounded-1 me-1 border-charcoal rounded-0`} onClick={() => { setblocksindex(i) }}>{Data}</button>

                    ))
                }

            </div>
            <div className={`container-fluid p-0 m-0 ps-3 mt-4  d-${blocksindex === 0 ? 'block' : 'none'}`}>
                <h6 className='text-charcoal75 fw-bolder mt-2 mb-2'>Advance Payments from {props.patientname}</h6>
                {
                    loadadvancepayments || props.isLoading ? (
                        <div className="col-6 py-2 pb-2 m-auto ">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        advancepaid ? (

                            <table className='border table rounded-1'>
                                <thead className=''>
                                    <th className='ps-2 text-charcoal75'>Description</th>
                                    <th className='ps-2 text-charcoal75'>Amount</th>
                                </thead>
                                <tbody className='align-middle'>
                                    {
                                       advancepaid&& advancepaid.map((data)=>(
                                            <tr>
                                            <td className='text-charcoal fw-bold'>{data.description}</td>
                                            <td className='text-charcoal fw-bold'>{data.credit_amount}</td>
                                        </tr>
                                        ))
                                    }
                    
                                </tbody>

                            </table>

                            // <div className='row align-items-center p-0 m-0'>
                            //     <h6 className='text-charcoal col-6 fw-bold mt-2'>Advance Amount Balance</h6>
                            //     <input className=' col-6 p-0 m-0 form-control w-50  bg-seashell ' value={advancepaid.advnace_total} />
                            //     <hr />
                            // </div>

                        ) : (
                            <div className='bg-lightyellow fw-bolder rounded-1 p-2 m-1 mt-2 text-center'>No Advance Payments Found</div>
                        )

                    )
                }
                <h6 className='text-charcoal75 fw-bolder mb-2 mt-3'>Add Advance Payment</h6>
                <div className="row p-0 m-0 align-items-center">
                    <div className="col-3 ps-0">
                        <p className='text-charcoal p-0 m-0 fw-bold'>Description</p>
                    </div>
                    <div className="col-9">
                        <input type='text' className='form-control p-0 m-0 p-1 bg-seashell mx-auto' value={Description ? Description : ''} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <div className="row p-0 m-0 align-items-center">
                    <div className="col-auto p-0 m-0">
                        <p className='text-charcoal fw-bold mt-3'>Add Payment Method</p>
                    </div>
                    <div className="col-auto p-0 m-0">
                        <button className='btn py-0' onClick={() => setadvancepaymentmethods(prevState => [...prevState, advancepaymentmethoddetails])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' /></button>
                    </div>
                </div>

                {
                    advancepaymentmethods.map((data, i) => (
                        <div className="row p-0 m-0 mt-2 justify-content-around">
                            <div className="col-5 p-0 m-0 ">
                                <select className='form-control bg-seashell py-1' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setadvancepaymentmethods(prevState => [...prevState]) }}>
                                    <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                                    <option value='Cash'>Cash</option>
                                    <option value='Card'>Card</option>
                                    <option value='Paytm'>Paytm</option>
                                    <option value='Phonepe'>Phone Pe</option>
                                    <option value='Wire-Transfer'>Wire-Transfer</option>
                                    <option value='Razorpay'>Razorpay</option>
                                    <option value='Points'>Points</option>
                                    <option value='Adjust-Advance'>Adjust-Advance Cash</option>
                                </select>
                            </div>
                            <div className="col-4 p-0 m-0 ms-1">
                                <input className='form-control bg-seashell py-1' value={data.amount} onChange={(e) => { data.amount = e.target.value; setadvancepaymentmethods(prevState => [...prevState]) }} />
                            </div>
                            <div className="col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 ">
                                <button className='btn p-0 m-0' onClick={() => { DeleteadvancePaymentMethods(i); setadvancepaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                            </div>
                        </div>
                    ))
                }
                <div className="container text-center">
                    <button className='button  button-charcoal rounded-1 mt-3 mb-2' disabled={Description ? false : true} onClick={AddadvancePaymentMethods}>Save</button>

                </div>
            </div>

            <div className={`container-fluid p-0 m-0 ps-3 d-${blocksindex === 1 ? 'block' : 'none'} `}>
                {
                    pendingpayments && pendingpayments != null && pendingpayments.length != 0 ? (
                        loadappoint ? (
                            <div className="col-6 py-2 pb-2 m-auto ">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h6 className='fw-bolder text-charcoal75 mt-2'>Previous paid payments</h6>
                                <div className='container-fluid overflow-scroll p-0 m-0 rounded-1'>
                                    <table className='table p-0 m-0 border-0 bg-pearl p-2'>
                                        <thead className='p-0 m-0 border-0'>
                                            <tr>
                                                <th className='p-0 m-0 px-1 border-0' rowspan='2'>Amount Paid</th>
                                                <th className='p-0 m-0 px-1 border-0' rowspan='2'>Pending Date</th>
                                                <th className='p-0 m-0 px-1 border-0' rowspan='2'>Paid Date</th>
                                                <th className='p-0 m-0 px-1 border-0 border-bottom' colspan='7' scope='colgroup'>Payment Method</th>
                                            </tr>
                                            <tr>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Cash</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Card</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Paytm</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Phonepe</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Razorpay</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Wire-Transfer</th>
                                                <th className='p-0 m-0 px-1 border-0 bg-pearl' scope='col'>Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pendingpayments.map((data) => (
                                                    <tr className={`d-${data.is_paid == 1 ? '' : 'none'}`}>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.paid_amount}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{reversefunction(data.pending_date)}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{reversefunction(data.paid_date)}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Cash : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Card : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Paytm : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Phonepe : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Razorpay : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details)['Wire-Transfer'] : 'N/A'}</td>
                                                        <td className='p-0 m-0 px-1 border-0'>{data.payment_method_details && data.payment_method_details != null ? JSON.parse(data.payment_method_details).Points : 'N/A'}</td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    pendingpayments.map((Data) => (
                                        <div className={`d-${Data.is_paid == 0 ? 'block' : 'none'} `}>
                                            <div className="row p-0 m-0 align-items-center mt-2 justify-content-center">
                                                <div className="col-auto">
                                                    <span className='text-burntumber fw-bolder'>Pending Amount: {Data.pending_amount}</span>
                                                </div>
                                                <div className="col-auto">
                                                    <button className='btn p-0' onClick={() => setpendingpaymentmethods(prevState => [...prevState, pendingpaymentmethoddetails])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' /></button>
                                                </div>
                                            </div>

                                            {
                                                pendingpaymentmethods.map((data, i) => (
                                                    <div className={``}>
                                                        <label className='text-charcoal fw-bold mt-3'>Select Payment Method to Pay Remaining pendings</label>
                                                        <div className="row p-0 m-0 justify-content-start">
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
                                                            <div className="col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 ms-2 ">

                                                                <button className='btn btn-sm p-0 m-0' onClick={() => { DeletependingPaymentMethods(i); setpendingpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ))

                                }

                                <div className="container text-center">
                                    <button className='button button-charcoal mt-lg-4 mt-md-3 mt-1 mb-2' onClick={UpdatePendingPayments}>Save</button>
                                </div>

                            </>
                        )
                    ) : (

                        props.paymentsi !== undefined ? (
                            <div className='rounded-1 bg-lightgreen text-white fw-bolder p-2 my-4'>Please see or update the bill first</div>
                        ) : (
                            <div className='rounded-1 bg-lightgreen text-white fw-bolder p-2 my-4'>No Pending Payments Found</div>
                        )


                    )
                }
            </div>
        </div>

    )

}

export { Payments }
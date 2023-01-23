import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
const Bill = (props) => {
    const Charges = {
        description: '',
        amount: 0,
        discount: 0,
        total_amount: function () {
            let total = []
            
            if (this.amount, this.discount) {
                total.push(this.amount - this.discount)
                return total[extrachargeindex]
            }
            return this.amount
        }
    }
    //ExtraCharge
    const [extrachargedescription, setextrachargedescription] = useState()
    const [extrachargetotal, setextrachargetotal] = useState()
    const [extrachargeamount, setextrachargeamount] = useState()
    const [extrachargefinalamt, setextrachargefinalamt] = useState([])
    const [saveextracharge, setsaveextracharge] = useState('none')
    const [updateextracharge, setupdateextracharge] = useState('block')
    const [extrachargeindex, setextrachargeindex] = useState(0)
    const [extrachargecount, setextrachargecount] = useState([{
        description: '',
        amount: 0,
        discount: 0,
        gross_amount: 0,
        total_amount: function () {
             setextrachargeamount([])
            let total = 0
            if (this.amount, this.discount) {
                total = this.amount - this.discount
                return total
            } else {
                return this.amount
            }

        }

    }])
    const [loadextracharge, setloadextracharge] = useState()
    //Bill
    const [constext, setconstext] = useState()
    const [g_total, setg_total] = useState()
    const [description, setdescription] = useState()    
    const [docdiscount, setdocdiscount] = useState()
    const [aartasdiscount, setaartasdiscount] = useState()
    const [SGST, setSGST] = useState()
    const [CGST, setCGST] = useState()
    const [showconsfee, setshowconsfee] = useState()
    const [paymentmethods, setpaymentmethods] = useState({
        card: '',
        cash: '',
        paytm: '',
        phonepe: '',
        wiretransfer: '',
        points: '',
        razorpay: ''

    })
    const [AtC, setAtc] = useState()


    function refresh() {
    }

    function AddExtraCharges() {
        props.Appointmentlist()
    }


    function DeleteExtraCharges() {
    }
    function OpenSaveExtraCharge() {
        if (updateextracharge === 'block') {
            setupdateextracharge('none')
            setsaveextracharge('block')
        }
    }
    function OpenEditExtraCharge() {
        if (saveextracharge === 'block') {
            setsaveextracharge('none')
            setupdateextracharge('block')
        }
    }
    async function SaveBill() {

    }
    console.log(extrachargecount)
    return (
        <div className='bg-seashell rounded-4 position-relative'>
            <h5 className='p-1'>{props.patientname} Bill</h5>
            <button className='btn btn-close position-absolute top-0 end-0 p-2 me-2' onClick={props.CloseBillForm}></button>
            <div className='scroll'>
                <div className="container-fluid text-start p-2">
                    <h6 className='fw-bolder text-charcoal'>Consultation</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Doctor's Consultation Charge</label>
                            <input className='form-control bg-seashell' value={props.doctorfee} />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Consultation text</label>
                            <input className='form-control bg-seashell' value={constext ? constext : ''} onChange={(e) => setconstext(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Procedure</label>
                            <select className='form-control bg-seashell'>
                                <option>Procedures</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="container-fluid text-start p-2">
                    <h6 className='fw-bolder text-charcoal'>Discounts</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Coupon</label>
                            <input className='form-control bg-seashell' />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Doctor</label>
                            <input className='form-control bg-seashell' />
                        </div>
                    </div>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Aartas</label>
                            <input className='form-control bg-seashell' />
                        </div>
                    </div>
                </div>
                <div className="container-fluid text-start p-2">
                    <div className='bg-seashell rounded-2 position-relative pb-4'>
                        <h6 className='p-1 text-charcoal fw-bolder'>ExtraCharges</h6>

                        <button className='btn p-0 m-0 position-absolute top-0 end-0 ms-2 m-1' onClick={props.Appointmentlist}><img src={process.env.PUBLIC_URL + '/images/refresh.png'} style={{ width: '1.8rem' }} /></button>
                        {
                            extrachargecount.map((data,i) => (
                                <div className="container-fluid">
                                    <div className="row p-0 m-0 justify-content-center">
                                        <div className="col-3 p-0 m-0">
                                            <label>Description</label>
                                            <input className='form-control p-0 bg-seashell' onChange={(e) => { data.description = e.target.value }} />
                                        </div>
                                        <div className="col-auto">
                                            <label>Amount</label>
                                            <input type='number' className='form-control bg-seashell p-0' onChange={(e) => { data.amount = e.target.value }} />
                                        </div>
                                        <div className="col-2">
                                            <label>Discount</label>
                                            <input type='number' className='form-control bg-seashell p-0'onFocus={()=>setextrachargeindex(i)}onChange={(e) => { data.discount = e.target.value; data.gross_amount = data.total_amount(data.amount, data.discount);}}/>
                                        </div>
                                        <div className="col-2">
                                            <label>Total Amount</label>
                                            <div className=' bg-seashell p-0'>{data.gross_amount}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="container-fluid text-center mt-2">
                            <button className='btn py-0' onClick={() => setextrachargecount(prevState => [...prevState, Charges])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} /></button>
                        </div>
                    </div>                </div>
                <div className="container-fluid text-start ">
                    <h6 className='fw-bolder text-charcoal'>Tax</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>SGST</label>
                            <input className='form-control bg-seashell' value={SGST ? SGST : ''} onChange={(e) => setSGST(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>CGST</label>
                            <input className='form-control bg-seashell' value={CGST ? CGST : ''} onChange={(e) => setCGST(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="container-fluid text-start position-relative p-2">
                    <h6 className='text-charcoal fw-bolder'>Payments</h6>
                    <button className='btn p-0 m-0 position-absolute top-0 end-0 ms-2 m-1' onClick={refresh}><img src={process.env.PUBLIC_URL + '/images/refresh.png'} style={{ width: '1.8rem' }} /></button>

                    <div className='bg-lightred p-2 mb-2 text-center align-items-center '><h6 className='text-center text-charcoal-75 fw-bold mb-0'>No Payments Added</h6></div>

                    <div className="row p-0 m-0">
                        <div className="col-5 p-0 m-0">
                            <select className='form-control bg-seashell py-1 '>
                                <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                                <option value='cash'>Cash</option>
                                <option value='card'>Card</option>
                                <option value='paytm'>Paytm</option>
                                <option value='phonepe'>Phone Pe</option>
                                <option value='wiretransfer'>Wire Transfer</option>
                                <option value='razorpay'>Razorpay</option>
                                <option value='points'>Points</option>
                                <option value='adjustadvance'>Adjust-Advance Cash</option>
                            </select>
                        </div>
                        <div className="col-4 ">
                            <input className='form-control bg-seashell py-1' />
                        </div>
                        <div className="col-3 align-self-center">
                            <button className='button button-burntumber py-0 ms-2'>Add</button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="container-fluid pb-2">
                    <div className="row p-0 m-0">
                        <div className="col-6 justify-content-center">
                            <button className='button button-burntumber'>Save</button>
                        </div>
                        <div className="col-6 justify-content-center">
                            <button className='button button-brandy'>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Bill }
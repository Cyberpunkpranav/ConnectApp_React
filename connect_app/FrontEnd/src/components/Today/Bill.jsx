import React, { useState, useEffect } from 'react'
import '../../css/dashboard.css'
const Bill = (props) => {
    const procedures = []
    const [extrachargeid, setextrachargeid] = useState()
    const [extrachargeamount, setextrachargeamount] = useState()
    const [saveextracharge, setsaveextracharge] = useState()
    const [updateextracharge, setupdatecharge] = useState('block')
    const [extrachargeindex, setextrachargeindex] = useState('none')
    const [extracharge, setextracharge] = useState()
    const [extrachargeupdatevalue, setextrachargeupdatevalue] = useState()
    const [loadextracharge, setloadextracharge] = useState()
    function refresh() {
    }
    function AddExtraCharges() {
    }
    function UpdateExtraCharges() {
    }
    function DeleteExtraCharges() {
    }
    function OpenSaveExtraCharge() {

    }
    return (
        <div className='bg-seashell rounded-2 position-relative'>
            <h5 className='p-1'>Bill</h5>
            <button className='btn btn-close position-absolute top-0 end-0 p-2 me-2' onClick={props.CloseBillForm}></button>
            <div className='scroll'>
                <div className="container-fluid text-start p-2">
                    <h6 className='fw-bolder text-charcoal'>Consultation</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Doctor's Consultation Charge</label>
                            <input className='form-control bg-seashell' />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Extra Consultation Charges</label>
                            <input className='form-control bg-seashell' />
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
                    <h6 className='fw-bolder text-charcoal'>Tax</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>SGST</label>
                            <input className='form-control bg-seashell' />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>CGST</label>
                            <input className='form-control bg-seashell' />
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
                        <h6 className='p-1 text-charcoal fw-bolder'>{props.patientname}ExtraCharges</h6>

                        <button className='btn p-0 m-0 position-absolute top-0 end-0 ms-2 m-1' onClick={refresh}><img src={process.env.PUBLIC_URL + '/images/refresh.png'} style={{ width: '1.8rem' }} /></button>
                        {
                            props.loadextracharge ? (
                                <div className="col-6 py-2 pb-2 m-auto text-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                props.extrachargeslist.length == 0 ? (
                                    <>
                                        <div className='bg-lightred p-2 mb-2 text-center align-items-center '><h6 className='text-center text-charcoal-75 fw-bold mb-0'>No Extra Charges Added</h6></div>
                                    </>
                                ) : (
                                    props.extrachargeslist.map((data, i) => (
                                        <div className='container-fluid'>
                                            <div className={`row justify-content-center`}>
                                                <div className="col-3">
                                                    <select className='form-control text-end p-0 border-0 bg-seashell' value={data.id ? data.id : ''}>
                                                        <option value={data.id}>{data.vital.title}</option>
                                                    </select>
                                                </div>
                                                <div className={`col-2 text-center d-${i == extrachargeindex ? updateextracharge : 'block'}`}>
                                                    <input className='form-control bg-seashell text-center py-0 ' disabled value={data.value} />
                                                </div>
                                                {
                                                    i == extrachargeindex ? (
                                                        <div className={`col-2 text-center d-${i == extrachargeindex ? saveextracharge : 'none'}`}>
                                                            <input className='form-control bg-seashell text-center py-0 ' onChange={(e) => setextrachargeupdatevalue(e.target.value)} />
                                                        </div>
                                                    ) : (<></>)
                                                }


                                                <div className={`col-2 d-${i == extrachargeindex ? updateextracharge : 'block'}`}>
                                                    <button className='button py-0 button-lightbrown' value={data.id} onClick={() => { OpenSaveExtraCharge(); setextrachargeindex(i) }}>Update</button>
                                                </div>
                                                {
                                                    i == extrachargeindex ? (
                                                        <div className={`col-2 d-${i == extrachargeindex ? saveextracharge : 'none'}`}>
                                                            <button className='button py-0 button-lightgreen' onClick={() => { UpdateExtraCharges(data.vital.id, data.id) }}>Save</button>
                                                        </div>
                                                    ) : (<></>)
                                                }
                                                <div className="col-auto ms-2">
                                                    <button className='btn p-0 m-0'><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.3rem' }} onClick={() => DeleteExtraCharges(data.id)} /></button>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                )

                            )
                        }
                        <div className="container-fluid">
                            {
                                loadextracharge ? (
                                    <div className="col-6 py-2 pb-2 m-auto text-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row p-0 m-0 justify-content-center">
                                        <div className="col-3 p-0 m-0">
                                            <label>Description</label>
                                            <input className='form-control p-0 bg-seashell' value={extrachargeid ? extrachargeid : ''} onChange={(e) => { setextrachargeid(e.target.value) }} />
                                        </div>
                                        <div className="col-2">
                                            <label>Amount</label>
                                            <input className='form-control bg-seashell p-0' value={extrachargeamount ? extrachargeamount : ''} onChange={(e) => { setextrachargeamount(e.target.value) }} />
                                        </div>
                                        <div className="col-2">
                                            <label>Discount</label>
                                            <input className='form-control bg-seashell p-0' value={extrachargeamount ? extrachargeamount : ''} onChange={(e) => { setextrachargeamount(e.target.value) }} />
                                        </div>
                                        <div className="col-2">
                                            <label>Total Amt</label>
                                            <input className='form-control bg-seashell p-0' value={extrachargeamount ? extrachargeamount : ''} onChange={(e) => { setextrachargeamount(e.target.value) }} />
                                        </div>
                                        <div className="col-auto align-self-end">
                                            {
                                                loadextracharge ? (
                                                    <div className="col-6 py-2 pb-2 m-auto text-center">
                                                        <div class="spinner-border" role="status">
                                                            <span class="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button className='btn py-0 button-burntumber' onClick={AddExtraCharges}>Add</button>
                                                )
                                            }

                                        </div>
                                        <div className="col-1"></div>
                                    </div>
                                )
                            }


                        </div>
                    </div>
                </div>
                <div className="container-fluid text-start position-relative p-2">
                    <h6 className='text-charcoal fw-bolder'>Payments</h6>
                    <button className='btn p-0 m-0 position-absolute top-0 end-0 ms-2 m-1' onClick={refresh}><img src={process.env.PUBLIC_URL + '/images/refresh.png'} style={{ width: '1.8rem' }} /></button>

                    <div className='bg-lightred p-2 mb-2 text-center align-items-center '><h6 className='text-center text-charcoal-75 fw-bold mb-0'>No Payments Added</h6></div>

                    <div className="row p-0 m-0">
                        <div className="col-4">
                            <select className='form-control bg-seashell py-1 '>
                                <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                                <option>Cash</option>
                                <option>Card</option>
                                <option>Paytm</option>
                                <option>Phone Pe</option>
                                <option>Wire Transfer</option>
                                <option>Razorpay</option>
                                <option>Points</option>
                                <option>Adjust-Advance Cash</option>
                            </select>
                        </div>
                        <div className="col-auto">
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
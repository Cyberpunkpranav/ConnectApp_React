import React, { useState, useEffect, useContext } from 'react'
import { URL } from '../../index'
import Notiflix from 'notiflix'
import { customconfirm } from '../features/notiflix/customconfirm'
import '../../css/dashboard.css'
import axios from 'axios'
const Bill = (props) => {
    const url = useContext(URL)
    const adminid = localStorage.getItem('id')
    const Charges = {
        description: '',
        amount: 0,
        discount: 0,
        cgst: 0,
        sgst: 0,
        gross_amount: 0
    }
    const paymentmethoddetails = {
        paymentmethod: '',
        amount: 0
    }

    //ExtraCharge
    const [extrachargedescription, setextrachargedescription] = useState()
    const [extrachargetotal, setextrachargetotal] = useState()
    const [extrachargeamount, setextrachargeamount] = useState()
    const [extrachargefinalamt, setextrachargefinalamt] = useState([])
    const [saveextracharge, setsaveextracharge] = useState('none')
    const [updateextracharge, setupdateextracharge] = useState('block')
    const [extrachargeindex, setextrachargeindex] = useState(0)
    const [extrachargecount, setextrachargecount] = useState([])
    const [loadextracharge, setloadextracharge] = useState()
  
    //Bill
    const [constext, setconstext] = useState('')
    const [docdiscount, setdocdiscount] = useState(0)
    const [coupondiscount, setcoupondiscount] = useState(0)
    const [aartasdiscount, setaartasdiscount] = useState(0)
    const [AtC, setAtC] = useState(0)
    const[AddConsAmt,setAddConsAmt]=useState(props.doctorfee)
    const [SGST, setSGST] = useState()
    const [CGST, setCGST] = useState()
    const [paymentmethods, setpaymentmethods] = useState([])
    // console.log(paymentmethods)
    function GSTinPercent(amount,discount,cgst,sgst) {
        console.log(amount,discount,cgst,sgst)
        let gstpercent = 0
        if (amount && amount !== null && cgst && sgst && cgst !== null && sgst!==null) {
            gstpercent = ((cgst+sgst)/(amount-discount))*100
            return gstpercent
        } else {
            return gstpercent
        }
    }
    async function AddExtraCharges() {
        let extracharges = []
        for (let i = 0; i < props.appointmentdata.length; i++) {
            if (props.appointmentid == props.appointmentdata[i].id) {
                for (let j = 0; j < props.appointmentdata[i].other_charges.length; j++) {
                    extracharges.push({
                        description: props.appointmentdata[i].other_charges[j].description != null ? props.appointmentdata[i].other_charges[j].description : 'N/A',
                        amount: props.appointmentdata[i].other_charges[j].total_amount != null ? props.appointmentdata[i].other_charges[j].total_amount : 0,
                        discount: props.appointmentdata[i].other_charges[j].discount != null ? props.appointmentdata[i].other_charges[j].discount : 0,
                        cgst: props.appointmentdata[i].CGST != null ? GSTinPercent(props.appointmentdata[i].other_charges[j].amount,props.appointmentdata[i].other_charges[j].discount, props.appointmentdata[i].CGST,props.appointmentdata[i].SGST)/2 : 0,
                        sgst: props.appointmentdata[i].SGST != null ? GSTinPercent(props.appointmentdata[i].other_charges[j].amount,props.appointmentdata[i].other_charges[j].discount, props.appointmentdata[i].CGST, props.appointmentdata[i].SGST)/2 : 0,
                        gross_amount: Number(props.appointmentdata[i].other_charges[j].amount) + Number(props.appointmentdata[i].SGST) + Number(props.appointmentdata[i].CGST)
                    })
                }
            }
        }
          console.log(extracharges)
        setextrachargecount(extracharges)
    }

    async function AddPaymentMethods() {
        let Payments = []
        let amounts = []
        let allamounts = []
        for (let i = 0; i < props.appointmentdata.length; i++) {
            if (props.appointmentid == props.appointmentdata[i].id && props.appointmentdata[i].payment_method_details) {
                Payments.push(Object.keys(JSON.parse(props.appointmentdata[i].payment_method_details)))
                amounts.push(Object.values(JSON.parse(props.appointmentdata[i].payment_method_details)))
                
            }
        }
        let paymentobj = []
        let p = {
            paymentmethod: '',
            amount: 0
        }
        if (Payments[0]) {
            for (let j = 0; j < Payments[0].length; j++){
                allamounts.push( p={ paymentmethod: Payments[0][j], amount: amounts[0][j] })
               
            }
            setpaymentmethods(allamounts)
        }
     
        console.log(paymentmethods)
        // paymentmethods.push(paymentobj)
    }
    useEffect(() => {
        AddExtraCharges()
        AddPaymentMethods()
    }, [])

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
        let GrandTotal = Get_Grand_Total()
        GrandTotal= Number(GrandTotal)
        let Docfee = Number(props.doctorfee)
        let DoctorDiscount = Number(docdiscount)
        let AartasDiscount = Number(aartasdiscount)
        let TotalCGST = Get_total_Seperate_gsts();
        let TotalSGST = Get_total_Seperate_gsts()
        let Description = []
        let TotalAmount = []
        let Discount = []
        let DiscountedAmount = []
        for (let i = 0; i < extrachargecount.length; i++) {
            Description.push(extrachargecount[i].description)
            TotalAmount.push(Number(extrachargecount[i].amount))
            Discount.push(Number(extrachargecount[i].discount))
            DiscountedAmount.push(Number(extrachargecount[i].amount) - Number(extrachargecount[i].discount))
        }
        let Paymentmethod = [];
        let Paymentmethodsvalue = []
        for (let j = 0; j < paymentmethods.length; j++) {
            Paymentmethod.push(paymentmethods[j].paymentmethod)
            Paymentmethodsvalue.push(Number(paymentmethods[j].amount))
        }
        let Data={
            appointment_id:props.appointmentid,
            g_total_main: GrandTotal,
            cons_fee: Docfee,
            description: Description,
            total_amount: TotalAmount,
            discount: Discount,
            amount: DiscountedAmount,
            doc_dis: DoctorDiscount,
            aartas_discount: AartasDiscount,
            payment_method:Paymentmethod,
            payment_method_main:Paymentmethod,
            payment_method_details:Paymentmethodsvalue,
            SGST: Number(TotalSGST),
            CGST: Number(TotalCGST),
            admin_id: Number(adminid),
            cons_text: constext,
            add_to_cart: AtC,
            show_cons_fee:AddConsAmt==props.doctorfee ? 1:0,
            // ot_id:[0]
        }
        async function Payment(){
            await axios.post(`${url}/appointment/save/charges`, Data).then((response)=>{
                console.log(response)
                props.fetchapi()
                Notiflix.Notify.success(response.data.message)
        })
        }
        Payment()
    }
    function DeleteExtraCharges(i) {
        extrachargecount.splice(i, i)
    }
    function DeletePaymentMethods(i) {
        paymentmethods.splice(i, i)
    }
    function Calculate_gst(amount, discount, cgst, sgst) {
        setextrachargeamount()
        setextrachargecount(prevState => [...prevState]);
        let AMOUNT = amount ? amount : 0
        let DISCOUNT = discount ? discount : 0
        let CGST = cgst ? cgst : 0
        let SGST = sgst ? sgst : 0
        let total = AMOUNT - DISCOUNT
        // console.log(AMOUNT,DISCOUNT,CGST,SGST,total)
        CGST = (((CGST + SGST) * total) / 100)
        total = total + CGST
        // console.log(AMOUNT,DISCOUNT,CGST,SGST,total)
        return total
    }
    function Get_total_Seperate_gsts() {
        let grosstotal = []
        let total = 0
        for (let i = 0; i < extrachargecount.length; i++) {
            grosstotal.push((Number(extrachargecount[i].gross_amount) - (Number(extrachargecount[i].amount) - Number(extrachargecount[i].discount))) / 2)
        }
        // console.log(grosstotal,total)
        grosstotal.forEach(item => {
            total += item
        })
        return total
    }
    function Get_Grand_Total() {
        let total = 0
        let discounts = Number(aartasdiscount) + Number(docdiscount) + Number(coupondiscount)
        extrachargecount.map((data) => (
            total += Number(data.gross_amount)
        ))
        total = total + Number(AddConsAmt) - discounts
        return total
    }
    function Total_Amount() {
        let totalarr = []
        let total = 0
        for (let i = 0; i < paymentmethods.length; i++) {
            totalarr.push(Number(paymentmethods[i].amount))
        }
        totalarr.forEach(item => {
            total += item
        })
        return total
    }
    function Return_Amount() {
        let totalarr = []
        let total = 0
        let Advance = 0
        for (let i = 0; i < paymentmethods.length; i++) {
            totalarr.push(Number(paymentmethods[i].amount))
        }
        totalarr.forEach(item => {
            total += item
        })
        if (total > Get_Grand_Total()) {
            Advance = total - Get_Grand_Total()
            return Advance
        } else {
            return Advance
        }


    }
    const confirmmessage = (e) => {
        customconfirm()
        Notiflix.Confirm.show(
            `Add Charges and Payments`,
            `Do you surely want to add the following Charges and Payments with Grand Total ${Get_Grand_Total()}`,
            'Yes',
            'No',
            () => {
                setAtC(0)
                SaveBill()

            },
            () => {
                return 0
            },
            {
            },
        );
    }
    const AddtoCart = () => {
        customconfirm()
        Notiflix.Confirm.show(
            `Add Charges and Payments in Cart`,
            `Do you surely want to add the following Charges and Payments with Grand Total ${Get_Grand_Total()} in Cart`,
            'Yes',
            'No',
            () => {
                setAtC(1)
            },
            () => {
                setAtC(0)

            },
            {
            },
        );
    }
    return (
        <div className='bg-seashell rounded-4 position-relative'>
            <h5 className='p-1'>{props.patientname} Bill</h5>
            <button className='btn btn-close position-absolute top-0 end-0 p-2 me-2' onClick={props.CloseBillForm}></button>
            <div className='scroll'>
                <div className="container-fluid text-start p-2 position-relative">
                    <h6 className='fw-bolder text-charcoal'>Consultation</h6>
                    <label className='position-absolute end-0 top-0 mt-1 me-4 text-cahrcoal fw-bolder'><input type='checkbox'  checked={AddConsAmt} onClick={AddConsAmt==props.doctorfee ? ()=>setAddConsAmt(0):()=>setAddConsAmt(props.doctorfee)}/>Add Consultation Amount</label>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Doctor's Consultation Charge</label>
                            <input className='form-control bg-seashell' value={AddConsAmt} />
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
                            <input className='form-control bg-seashell' onChange={(e) => setcoupondiscount(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Doctor</label>
                            <input className='form-control bg-seashell' onChange={(e) => setdocdiscount(e.target.value)} />
                        </div>
                    </div>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>Aartas</label>
                            <input className='form-control bg-seashell' onChange={(e) => setaartasdiscount(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="container-fluid text-start p-2">
                    <div className='bg-seashell rounded-2 position-relative'>
                        <h6 className='p-1 text-charcoal fw-bolder'>ExtraCharges</h6>
                        {
                            extrachargecount.map((data, i) => (
                                <div className="container-fluid p-0 m-0">
                                    <div className="row p-0 m-0">
                                        <div className="col-2">
                                            <label>Description</label>
                                            <input className='form-control p-0 bg-seashell' value={data.description ? data.description : ''} onChange={(e) => { data.description = e.target.value; Calculate_gst(data.amount, data.discount, data.cgst, data.sgst) }} />
                                        </div>
                                        <div className="col-2 p-0 m-0">
                                            <label>Amount</label>
                                            <input type='number' className='form-control bg-seashell p-0' value={data.amount ? data.amount : ''} onChange={(e) => { data.amount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst) }} />
                                        </div>
                                        <div className="col-2 m-0 p-0 ">
                                            <label>Discount</label>
                                            <input type='number' className='form-control bg-seashell p-0' value={data.discount ? data.discount : ''} onFocus={() => setextrachargeindex(i)} onChange={(e) => { data.discount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                                        </div>
                                        <div className="col-2 m-0 p-0">
                                            <label>FinalAmount</label>
                                            <input type='number' className='form-control bg-seashell p-0' value={data.amount && data.discount ? data.amount - data.discount : ''} onFocus={() => setextrachargeindex(i)} onChange={(e) => { data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                                        </div>
                                        <div className="col-1 p-0 m-0">
                                            <label>GST %</label>
                                            <input type='number' className='form-control bg-seashell p-0' value={data.cgst && data.sgst ? data.cgst + data.sgst : ''} onFocus={() => setextrachargeindex(i)} onChange={(e) => { data.cgst = (e.target.value / 2); data.sgst = (e.target.value / 2); data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                                        </div>
                                        <div className="col-2 p-0 m-0">
                                            <label>Total Amount</label>
                                            <input className=' form-control bg-seashell p-0' value={data.gross_amount ? data.gross_amount : ''} />
                                        </div>
                                        <div className="col-auto align-self-end">
                                            <button className='btn btn-sm p-0 m-0' onClick={() => { DeleteExtraCharges(i); setpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="container-fluid text-center mt-2">
                            <button className='btn py-0' onClick={() => setextrachargecount(prevState => [...prevState, Charges])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} /></button>
                        </div>
                    </div>
                </div>
                <div className="container-fluid text-start ">
                    <h6 className='fw-bolder text-charcoal'>Tax</h6>
                    <div className="row p-0 m-0">
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>SGST</label>
                            <input className='form-control bg-seashell' value={SGST ? SGST : Get_total_Seperate_gsts()} onChange={(e) => setSGST(e.target.value)} />
                        </div>
                        <div className="col-6">
                            <label className='text-charcoal75 fw-bold'>CGST</label>
                            <input className='form-control bg-seashell' value={CGST ? CGST : Get_total_Seperate_gsts()} onChange={(e) => setCGST(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="container-fluid p-2 text-center rounded-2 bg-lightyellow mt-2">
                    <div className="row text-center p-0 m-0 align-items-center">
                        <div className='col-4'>
                            <label className=' fw-bolder text-charcoal'>Grand Total</label>
                            <input className='form-control text-success text-center border-0 fw-bolder p-0 fs-5 bg-seashell' value={Get_Grand_Total()} />
                        </div>
                        <div className="col-4">
                            <label className=' fw-bolder text-charcoal'>Advance Amount Balance</label>
                            <input className='form-control text-lightgreen text-center border-0 fw-bolder p-0 fs-5 bg-seashell' />
                        </div>
                        <div className="col-4">
                            <label className=' fw-bolder text-charcoal'>Consumables Amount</label>
                            <input className='form-control text-primary text-center border-0 fw-bolder p-0 fs-5 bg-seashell' />
                        </div>

                    </div>

                </div>
                <div className="container-fluid text-start position-relative p-2">
                    <h6 className='text-charcoal fw-bolder'>Payments</h6>
                    <div className="row justify-content-center p-0 m-0">
                        <div className="col-5 text-center">
                            <div className="row text-center p-0 m-0">
                                <p className="col-6 text-center p-0 m-0 fw-bold"> Total Amount: </p>
                                <p className="col-6 text-start p-0 m-0 text-success fw-bold"> {Total_Amount()} </p>
                            </div>
                        </div>
                        <div className='col-5 text-center'>
                            <div className="row text-center p-0 m-0">
                                <p className="col-6 text-center p-0 m-0 fw-bold"> Return Amount: </p>
                                <p className="col-6 text-start p-0 m-0 text-burntumber fw-bold"> {Return_Amount()} </p>
                            </div>
                        </div>
                    </div>

                    {
                        paymentmethods.map((data, i) => (
                            <div className="row p-0 m-0 justify-content-center m-2 ps-2">
                                <div className="col-4 p-0 mx-2">
                                    <select className='form-control bg-seashell py-1' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods(prevState => [...prevState]) }}>
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
                                <div className="col-4 p-0 m-0">
                                    <input className='form-control bg-seashell py-1' value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods(prevState => [...prevState]) }} />
                                </div>
                                <div className="col-2">
                                    <button className='btn btn-sm p-0 m-0' onClick={() => { DeletePaymentMethods(i); setpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                                </div>
                            </div>
                        ))
                    }
                    <div className="container-fluid text-center mt-2">
                        <button className='btn py-0' onClick={() => setpaymentmethods(prevState => [...prevState, paymentmethoddetails])}><img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} /></button>
                    </div>
                </div>
                <hr />
                <div className="container-fluid pb-2">
                    <div className="row p-0 m-0">
                        <div className="col-6 justify-content-center">
                            <button className='button button-burntumber' onClick={confirmmessage}>Save</button>
                        </div>
                        <div className="col-6 justify-content-center">
                            <button className='button button-brandy' onClick={AddtoCart}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Bill }
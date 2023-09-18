import React, { useState, useEffect, useContext } from "react";
import { URL } from "../../index";
import Notiflix from "notiflix";
import { customconfirm } from "../features/notiflix/customconfirm";
import "../../css/dashboard.css";
import axios from "axios";
const Bill = (props) => {
  const url = useContext(URL);
  const adminid = localStorage.getItem("id");
  const Charges = {
    description: "",
    amount: 0,
    discount: 0,
    cgst: 0,
    sgst: 0,
    gross_amount: 0,
    id: "",
  };
  const paymentmethoddetails = {
    paymentmethod: "",
    amount: 0,
  };
  //Advance payments
  const [loadadvancepayments, setloadadvancepayments] = useState(false);
  const [advancepayments, setadvancepayments] = useState();

  //ExtraCharge
  const [extrachargecount, setextrachargecount] = useState([{
    description: "",
    amount: 0,
    discount: 0,
    cgst: 0,
    sgst: 0,
    gross_amount: 0,
    id: "",
  }]);

  //Bill
  const [constext, setconstext] = useState("");
  const [docdiscount, setdocdiscount] = useState(0);
  const [coupondiscount, setcoupondiscount] = useState(0);
  const [aartasdiscount, setaartasdiscount] = useState(0);
  const [AtC, setAtC] = useState(0);
  const [AddConsAmt, setAddConsAmt] = useState(props.doctorfee);
  const [SGST, setSGST] = useState();
  const [CGST, setCGST] = useState();
  const [paymentmethods, setpaymentmethods] = useState([{
    paymentmethod: "",
    amount: '',
  }]);
  const [load, setload] = useState();
  const [ischecked, setischecked] = useState();


  async function AddExtraCharges() {
    let extracharges = [];
    for (let i = 0; i < props.appointmentdata.length; i++) {
      if (props.appointmentid == props.appointmentdata[i].id) {
        for ( let j = 0; j < props.appointmentdata[i].other_charges.length; j++ ) {
          extracharges.push({
            description: props.appointmentdata[i].other_charges[j].description != null ? props.appointmentdata[i].other_charges[j].description : "N/A",
            amount: props.appointmentdata[i].other_charges[j].total_amount != null ? props.appointmentdata[i].other_charges[j].total_amount : 0,
            discount: props.appointmentdata[i].other_charges[j].discount != null ? props.appointmentdata[i].other_charges[j].discount : 0,
            cgst: props.appointmentdata[i].other_charges[j] != null && props.appointmentdata[i].other_charges[j].gst_rate != null ? props.appointmentdata[i].other_charges[j].gst_rate / 2 : 0, sgst: props.appointmentdata[i].other_charges[j] != null && props.appointmentdata[i].other_charges[j].gst_rate != null ? props.appointmentdata[i].other_charges[j].gst_rate / 2 : 0,
            gross_amount: props.appointmentdata[i].other_charges[j].final_amount && props.appointmentdata[i].other_charges[j].final_amount !== null ? props.appointmentdata[i].other_charges[j].final_amount : "",
            id: props.appointmentdata[i].other_charges[j].id && props.appointmentdata[i].other_charges[j].id != null ? props.appointmentdata[i].other_charges[j].id : "",
          });
        }
        setaartasdiscount(props.appointmentdata[i].aartas_discount);
        setdocdiscount(props.appointmentdata[i].doc_discount);
        setconstext(props.appointmentdata[i].cons_text);
      }
    }
    if(extracharges.length>0){
      setextrachargecount(extracharges);
    }else{
      setextrachargecount([Charges])
    }
  }
  async function AddPaymentMethods() {
    let Payments = [];
    let amounts = [];
    let allamounts = [];
    for (let i = 0; i < props.appointmentdata.length; i++) {
      if (props.appointmentid == props.appointmentdata[i].id && props.appointmentdata[i].payment_method_details) {
        Payments.push(Object.keys(JSON.parse(props.appointmentdata[i].payment_method_details)));
        amounts.push(Object.values(JSON.parse(props.appointmentdata[i].payment_method_details)));
      }
    }
    let paymentobj = [];
    let p = {
      paymentmethod: "",
      amount: 0,
    };
    if (Payments[0]) {
      for (let j = 0; j < Payments[0].length; j++) {
        allamounts.push(
          (p = { paymentmethod: Payments[0][j], amount: amounts[0][j] })
        );
      }
      if(allamounts.length>0){
        setpaymentmethods(allamounts);
      }else{
        setpaymentmethods([paymentmethoddetails]);
      }
    
    }

    // paymentmethods.push(paymentobj);
  }

  useEffect(() => {
    AddExtraCharges()
    AddPaymentMethods();
  }, [props.billform])

  useEffect(() => {
      AddExtraCharges()
  }, [])

  async function DeleteExtraCharges(i) {
    if (extrachargecount[i].id) {
      setextrachargecount([]);
      await axios
        .post(`${url}/appointment/delete/extra/charges`, {
          id: extrachargecount[i].id,
        })
        .then((response) => {
          setextrachargecount([]);
          extrachargecount.splice(i, i);
          Notiflix.Notify.success(response.data.message);
          props.Appointmentlist();
        });
    } else {
      extrachargecount.splice(i, i);
    }
  }
  function DeletePaymentMethods(i) {
    paymentmethods.splice(i, i);
  }
  function Calculate_gst(amount, discount, cgst, sgst) {
    setextrachargecount((prevState) => [...prevState]);
    let AMOUNT = amount ? amount : 0;
    let DISCOUNT = discount ? discount : 0;
    let CGST = cgst ? cgst : 0;
    let SGST = sgst ? sgst : 0;
    let total = AMOUNT - DISCOUNT;
    CGST = ((CGST + SGST) * total) / 100;
    total = total + CGST;
    total = total.toFixed(2);
    return total;
  }
  function Get_total_Seperate_gsts() {
    let grosstotal = [];
    let total = 0;
    for (let i = 0; i < extrachargecount.length; i++) {
      grosstotal.push( (Number(extrachargecount[i].gross_amount) - (Number(extrachargecount[i].amount) - Number(extrachargecount[i].discount))) / 2);
    }
    grosstotal.forEach((item) => {
      total += item;
    });
    total = total.toFixed(2);
    return total;
  }
  function Get_Grand_Total() {
    let total = 0;
    let discounts =
      Number(aartasdiscount) + Number(docdiscount) + Number(coupondiscount);
    extrachargecount.map((data) => (total += Number(data.gross_amount)));
    total = total + Number(AddConsAmt) - discounts;
    total = total.toFixed(2);
    // if (Addcons == true) {
    //   total = Number(total) + Number(ConsumableAmount())
    // } else {
    //   total = total
    // }
    return total;
  }
  function Total_Amount() {
    let totalarr = [];
    let total = 0;
    if (paymentmethods && paymentmethods.length > 0) {
      for (let i = 0; i < paymentmethods.length; i++) {
        if(paymentmethods[i].amount){
          totalarr.push(Number(paymentmethods[i].amount));
        }
      }
      totalarr.forEach((item) => {
        total += Number(item);
      });
      total = total.toFixed(2)
      return total;
    } else {
      return 0;
    }
  }
  function Return_Amount() {
    let totalarr = [];
    let total = 0;
    let Advance = 0;
    for (let i = 0; i < paymentmethods.length; i++) {
      totalarr.push(Number(paymentmethods[i].amount));
    }
    totalarr.forEach((item) => {
      total += item;
    });
    if (total > Get_Grand_Total()) {
      Advance = total - Get_Grand_Total();
      return Advance;
    } else {
      return Advance;
    }
  }
  async function SaveBill() {
    let GrandTotal = Get_Grand_Total();
    GrandTotal = Number(GrandTotal);
    let Docfee = Number(props.doctorfee);
    let DoctorDiscount = Number(docdiscount);
    let AartasDiscount = Number(aartasdiscount);
    let TotalCGST = Get_total_Seperate_gsts();
    let TotalSGST = Get_total_Seperate_gsts();
    let Description = [];
    let TotalAmount = [];
    let Discount = [];
    let Grossamount = [];
    let DiscountedAmount = [];
    let ids = [];
    let gstrate = [];
    for (let i = 0; i < extrachargecount.length; i++) {
      Description.push(extrachargecount[i].description);
      TotalAmount.push(Number(extrachargecount[i].amount));
      Discount.push(Number(extrachargecount[i].discount));
      DiscountedAmount.push(
        Number(extrachargecount[i].amount) -
        Number(extrachargecount[i].discount)
      );
      if (extrachargecount[i].id) {
        ids.push(Number(extrachargecount[i].id));
      }
      if (extrachargecount[i].cgst && extrachargecount[i].sgst) {
        gstrate.push(
          Number(extrachargecount[i].cgst + extrachargecount[i].sgst)
        );
      } else {
        gstrate.push(0);
      }
      Grossamount.push(extrachargecount[i].gross_amount);
    }
    let Paymentmethod = [];
    let Paymentmethodsvalue = [];
    for (let j = 0; j < paymentmethods.length; j++) {
      Paymentmethod.push(paymentmethods[j].paymentmethod);
      Paymentmethodsvalue.push(Number(paymentmethods[j].amount));
    }
    let Data = {
      appointment_id: props.appointmentid,
      g_total_main: GrandTotal,
      cons_fee: Docfee,
      description: Description,
      total_amount: TotalAmount,
      discount: Discount,
      amount: DiscountedAmount,
      doc_dis: DoctorDiscount,
      aartas_discount: AartasDiscount,
      payment_method: Paymentmethod,
      payment_method_main: Paymentmethod,
      payment_method_details: Paymentmethodsvalue,
      SGST: Number(TotalSGST),
      CGST: Number(TotalCGST),
      admin_id: Number(adminid),
      cons_text: constext,
      add_to_cart: AtC,
      show_cons_fee: AddConsAmt == props.doctorfee ? 1 : 0,
      ot_id: ids,
      gst_rate: gstrate,
      final_amount: Grossamount,
    };
    async function Payment() {
      try {
        setload(true);
        await axios
          .post(`${url}/appointment/save/charges`, Data)
          .then((response) => {
            props.Appointmentlist();          
            console.log(response)
            if(response.data.status ==true){
              toggleStage3()
              toggleStage4()
              Notiflix.Notify.success(response.data.message);  
            }else{
              Notiflix.Notify.failure(response.data.message);  
            }
               
            setload(false);
            // props.CloseBillForm();
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    }
    Payment();
  }
  const confirmmessage = (e) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to add the following Charges and Payments with Grand Total ${Get_Grand_Total()}`,
      "Yes",
      "No",
      () => {
        setAtC(0);
        SaveBill();
      },
      () => {
        return 0;
      },
      {}
    );
  };
  const AddtoCart = async () => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments in Cart`,
      `Do you surely want to add the following Charges and Payments with Grand Total ${Get_Grand_Total()} in Cart`,
      "Yes",
      "No",
      () => {
        setAtC(1);
        SaveBill();
      },
      () => {
        setAtC(0);
        SaveBill();
      },
      {}
    );
  };
  async function AdvancePayments() {
    setloadadvancepayments(true);
    axios
      .post(`${url}/advance/balance`, {
        patient_id: props.patientid,
      })
      .then((response) => {
        setloadadvancepayments(false);
        setadvancepayments(response.data.data);
      });
  }
  const ConsumableAmount = () => {
    let consumables_amount = []
    let Total = 0;
    for (let i = 0; i < props.appointmentdata.length; i++) {
      if (props.appointmentid == props.appointmentdata[i].id) {
        for (let j = 0; j < props.appointmentdata[i].medicine_used.length; j++) {
          consumables_amount.push(props.appointmentdata[i].medicine_used[j].total_amount)
        }
      }
    }

    consumables_amount.forEach((data) => (
      Total += data
    ))
    Total = Total.toFixed(2)
    return Total
  }
  useEffect(() => {
    AdvancePayments();
    ConsumableAmount();
  }, []);
  const [stage1, setstage1] = useState('block')
  const toggleStage1 = () => {
    if (stage1 == 'block') {
      setstage1('none')
    }
    if (stage1 == 'none') {
      setstage1('block')
    }
  }
  const [stage2, setstage2] = useState('none')
  const toggleStage2 = () => {
    if (stage2 == 'block') {
      setstage2('none')
    }
    if (stage2 == 'none') {
      setstage2('block')
    }
  }
  const [stage3, setstage3] = useState('none')

  const toggleStage3 = () => {
    if (stage3 == 'none') {
      setstage3('block')
    }
    if (stage3 == 'block') {
      setstage3('none')
    }
  }

  const [stage4, setstage4] = useState('none')
  const toggleStage4 = () => {
    if (stage4 == 'none') {
      setstage4('block')
    }
    if (stage4 == 'block') {
      setstage4('none')
    }
  }
  const Go_Back = () => {
    if (stage2 === 'block') {
      toggleStage2()
      toggleStage1()
    }
    if (stage3 === 'block') {
      toggleStage3()
      toggleStage2()
    }
    if (stage4 === 'block') {
      toggleStage4()
      toggleStage3()
    }
  }
    
  function AddMethods() {
    if (paymentmethods && paymentmethods.length > 0) {
      setpaymentmethods((prevState) => [...prevState, paymentmethoddetails]);
    } else {
      setpaymentmethods([paymentmethoddetails]);
    }
  }
  function AddCharges() {
    if (extrachargecount && extrachargecount.length > 0) {
      setextrachargecount((prevState) => [...prevState, Charges]);
    } else {
      setextrachargecount([Charges]);
    }
  }

  const Generate_Bill = async (id) => {
    Notiflix.Loading.circle('Generating Bill', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.5rem'
    })
    try {
      axios.post(`${url}/appointment/bill`, {
        appointment_id: id,
        admin_id: adminid
      }).then((response) => {
        
        Notiflix.Notify.success(response.data.message)
        Notiflix.Loading.remove()
        window.open(response.data.data.bill_url, '_blank', 'noreferrer');
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      Notiflix.Loading.remove()
    }
  }
  const Generate_Prescription = async (id) => {
    Notiflix.Loading.circle('Generating Prescription', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.5rem'
    })
    try {
      axios.post(`${url}/swift/pdf`, {
        appointment_id: id,
      }).then((response) => {
        
        Notiflix.Notify.success(response.data.message)
        Notiflix.Loading.remove()
        window.open(response.data.data.prescription_pdf, '_blank', 'noreferrer');
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      Notiflix.Loading.remove()
    }
  }
  const Send_On_WhatsApp = async (id, phone, check) => {
    let checkpres = check
    if (phone == undefined || phone == null) {
      Notiflix.Notify.failure('Please Add a Phone Number to send the message on WhatsApp')
    } else {
      Notiflix.Loading.circle('Sending Bill on Whats App', {
        backgroundColor: 'rgb(242, 242, 242,0.5)',
        svgColor: '#96351E',
        messageColor: '#96351E',
        messageFontSize: '1.5rem'
      })
      try {
        axios.post(`${url}/send/bill/whatsapp`, {
          appointment_id: id,
          check_pres: checkpres,
          admin_id: adminid
        }).then((response) => {
          
          Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
          Notiflix.Loading.remove()
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        Notiflix.Loading.remove()
      }
    }

  }

  const Send_On_SMS = async (id, phone, check) => {
    let checkpres = check
    if (phone == undefined || phone == null) {
      Notiflix.Notify.failure('Please Add a Phone Number to send the message on SMS')
    } else {
      Notiflix.Loading.circle('Sending Bill on SMS', {
        backgroundColor: 'rgb(242, 242, 242,0.5)',
        svgColor: '#96351E',
        messageColor: '#96351E',
        messageFontSize: '1.5rem'
      })
      try {
        axios.post(`${url}/send/bill/sms`, {
          appointment_id: id,
          check_bill: 1,
          check_pre: checkpres,
        }).then((response) => {
          
          Notiflix.Notify.success(`${response.data.message}${checkpres == 1 ? ' with Prescription' : ' without Prescription'}`)
          Notiflix.Loading.remove()
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        Notiflix.Loading.remove()
      }
    }

  }
  console.log(props.appointmentdata)
  // console.log(props.Data.patient.reward_points.points_total)
  return (
    <>
  
      <div className="container-fluid position-relative bg-seashell p-0 m-0 rounded-2 pt-2 pb-0 col-lg-8 p-0 m-0 d-none mx-auto">
        <h5 className="text-charcoal mt-2 fw-bold text-start ps-3">
          {props.patientname} Bill
        </h5>
        <button className="btn btn-close position-absolute top-0 end-0 me-2 mt-1 pt-3 " onClick={() => { props.CloseBillForm(); }} ></button>
        <hr className="p-0 m-0" />
        <div className="scroll">
          {props.isLoading ? (
            <div className="col-6 py-2 pb-2 m-auto text-center">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="container-fluid text-start px-3 py-2 position-relative">
                <h6 className="fw-bold text-charcoal">Consultation</h6>
                <label className="position-absolute end-0 top-0 mt-2 me-4 text-cahrcoal fw-bolder">
                  <input className="form-check-input me-1 " type="checkbox" checked={AddConsAmt} onClick={AddConsAmt == props.doctorfee ? () => setAddConsAmt(0) : () => setAddConsAmt(props.doctorfee)} />
                  Add Consultation Amount
                </label>
                <div className="row p-0 m-0 justify-content-between">
                  <div className="col-8 ps-0 ">
                    <label className="text-charcoal75 fw-bold"> Consultation text </label>
                    <input className="form-control bg-seashell fw-bold" value={constext ? constext : ""} onChange={(e) => setconstext(e.target.value)} />
                  </div>
                  <div className="col-4 pe-0 ">
                    <label className="text-charcoal75 fw-bold"> Doctor's Consultation Charge </label>
                    <input className="form-control bg-seashell fw-bold" disabled={true} value={AddConsAmt} />
                  </div>
                </div>
              </div>

              <div className="container-fluid text-start p-2 ps-3">
                <h6 className="fw-bolder text-charcoal">Discounts</h6>
                <div className="row p-0 m-0">
                  <div className="col-4 ps-0">
                    <label className="text-charcoal75 fw-bold">Coupon</label>
                    <input className="form-control fw-bold text-charcoal text-start" disabled={true} value={coupondiscount ? coupondiscount : ""} onChange={(e) => setcoupondiscount(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Doctor</label>
                    <input className="form-control bg-seashell fw-bold text-charcoal text-start" value={docdiscount ? docdiscount : ""} onChange={(e) => setdocdiscount(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Aartas</label>
                    <input className="form-control bg-seashell fw-bold text-charcoal text-start" value={aartasdiscount ? aartasdiscount : ""} onChange={(e) => setaartasdiscount(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="container-fluid text-start p-2">
                <div className="bg-seashell position-relative">
                  <div className="row p-0 m-0 align-items-center mb-2">
                    <div className="col-auto p-0 m-0 ps-2 pe-1">
                      <h6 className=" p-0 m-0 text-charcoal fw-bolder"> Extra Charges </h6>
                    </div>
                    <div className="col-auto p-0 m-0">
                      <button className="btn p-0 m-0 py-0" onClick={() => setextrachargecount((prevState) => [...prevState, Charges,])} >
                        <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" />
                      </button>
                    </div>
                  </div>
                  {props.isLoading ? (
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                      <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    extrachargecount.map((data, i) => (
                      <div className="container-fluid p-0 m-0">
                        <div className="row p-0 m-0">
                          <div className="col-3">
                            <label className="fw-bold text-charcoal75 text-start ps-1"> Description </label>
                            <input className="form-control bg-seashell m-0 text-start fw-bold " value={data.description ? data.description : ""} onChange={(e) => { data.description = e.target.value; Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-2">
                            <label className="fw-bold text-charcoal75 text-start ps-1">
                              Amount
                            </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.amount ? data.amount : ""} onChange={(e) => { data.amount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-2 ">
                            <label className="fw-bold text-charcoal75 text-start ps-1">
                              Discount
                            </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.discount ? data.discount : ""} onChange={(e) => { data.discount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>

                          <div className="col-2">
                            <label className="fw-bold text-charcoal75 text-start ps-1"> GST % </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.cgst && data.sgst ? data.cgst + data.sgst : ""} onChange={(e) => { data.cgst = e.target.value / 2; data.sgst = e.target.value / 2; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-2 p-0 align-self-end ">
                            <div className="row p-0 m-0 ">
                              <div className="col-6 p-0 m-0 fw-bold text-charcoal75 text-end"> Amount: </div>
                              <input type="number" className="col-6 p-0 border-0 text-start bg-seashell m-0 ps-1 fw-bold text-burntumber" style={{ letterSpacing: "1px" }} value={data.amount && data.discount ? data.amount - data.discount : ""} onChange={(e) => { data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                            </div>
                            <div className="row p-0 m-0">
                              <div className="col-6 p-0 m-0 fw-bold text-charcoal75 text-end"> incl. gst: </div>
                              <input className="col-6 p-0 border-0 m-0 text-start bg-seashell ps-1 fw-bold text-burntumber" style={{ letterSpacing: "1px" }} value={data.gross_amount ? data.gross_amount : ""} />
                            </div>
                          </div>
                          <div className="col-1 align-self-end">
                            <button className="btn btn-sm p-0 m-0" onClick={() => { DeleteExtraCharges(i); setpaymentmethods((prevState) => [...prevState]); }} >
                              <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid" style={{ width: "1.5rem" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="container-fluid p-1 mt-2">
             
             <div className="row text-center p-0 m-0 p-0 m-0">
               <div className="col-4 text-start">
                 <label className=" fw-bolder text-charcoal text-wrap text-start"> Advance Amount Balance </label>
                 {
                   loadadvancepayments ? (
                     <div className=" py-2 pb-2 m-auto text-center">
                       <div class="spinner-border spinner-border-sm" role="status" >
                         <span class="visually-hidden">Loading...</span>
                       </div>
                     </div>
                   ) : advancepayments ? (
                     <div className="text-success text-start border-0 rounded-1 fw-bolder p-0  bg-seashell">
                       {"₹" + advancepayments.advnace_total}
                     </div>
                   ) : (
                     // <input className='form-control text-success text-start border-0 rounded-1 fw-bolder p-0  bg-seashell' value= />
                     <div className="bg-lightred text-center fw-bold rounded-1 p-2"> No Advance Payments Found </div>
                   )}
               </div>
               <div className="col-4 p-0 m-0 text-start">
                 <label className="fw-bolder text-charcoal text-start text-wrap"> Consumables Amount </label>
                 {/* defaultValue=" not available" */}
                 <input className="form-control bg-seashell text-success text-start rounded-1  border-0 fw-bolder p-0 text-charcoal50" value={"₹" + ConsumableAmount()} />
               </div>
               <div className="col-4 p-0 m-0 text-start">
               <label className="fw-bolder text-charcoal text-start text-wrap"> Reward Points </label>
                 <div className="text-success text-start border-0 rounded-1 fw-bolder p-0  bg-seashell">
                   {props.Data.patient.reward_points !=undefined  && props.Data.patient.reward_points.points_total!=undefined && props.Data.patient.reward_points.points_total !=null ? props.Data.patient.reward_points.points_total :0}
                   </div>
               </div>
             </div>
           </div>

              <hr/>
              <div className="container-fluid text-start position-relative mt-2">
                <div className="row p-0 m-0 align-items-center">
                  <div className="col-auto p-0 m-0 ps-1">
                    <h6 className="text-charcoal p-0 m-0 fw-bolder">Payments</h6>
                  </div>
           
                  <div className="col-auto p-0 m-0">
                    <button className="btn p-0 ms-1" onClick={() => setpaymentmethods((prevState) => [...prevState, paymentmethoddetails,])} >
                      <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" />
                    </button>
                  </div>
                </div>

                <div className=" justify-content-start p-0 m-0 mt-2 me-3">
                  <div className="col-5 text-start p-0 m-0">
                    <span className=" text-end p-0 m-0 text-charcoal fw-bold ps-1"> Amount Recieved:{" "} </span>
                    <span className="text-success fw-bolder"> {" "} {paymentmethods && paymentmethods.length > 0 ? "₹" + Total_Amount() : "₹" + 0} </span>
                  </div>
                  <div className="col-5 text-start m-0 p-0">
                    {/* <span className="text-wrap text-center p-0 m-0 fw-bold ps-1"> Return Amount: </span> */}
                    <span className="text-start align-self-end p-0 m-0 ms-1 text-burntumber fw-bolder"> {" "} {Return_Amount() > 0 ? `Amount Exceeded by ${Return_Amount()}` : ""}{" "} </span>
                  </div>
                </div>

                {paymentmethods.map((data, i) => (
                  <div className="row p-0 m-0 justify-content-start mt-3 mb-3">
                    <div className="col-4 p-0 me-2 ms-1">
                      <select className="form-control bg-seashell fw-bold" value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} >
                        <option className="text-charcoal75 fw-bolder"> Payment Method </option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Paytm">Paytm</option>
                        <option value="Phonepe">Phone Pe</option>
                        <option value="Wire-Transfer">Wire Transfer</option>
                        <option value="Razorpay">Razorpay</option>
                        <option value="Points">Points</option>
                        <option value="Adjust-Advance">Adjust-Advance</option>
                      </select>
                    </div>
                    <div className="col-4 p-0 m-0">
                      <input className="form-control bg-seashell fw-bold border-0" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} />
                    </div>
                    <div className="col-2">
                      <button className="btn btn-sm p-0 m-0" onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                        <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid"/>
                      </button>
                    </div>
                    <hr/>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="container-fluid pb-2 position-sticky bottom-0 bg-seashell border border-1 " style={{ marginTop: '20vh' }}>
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row p-0 m-0 text-center align-items-center mt-1 justify-content-between ">
                <div className="col-4 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start">
                    Grand Total
                  </label>
                  <input
                    className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0  bg-seashell"
                    value={"₹" + Get_Grand_Total()}
                  />
                </div>
                {/* <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div> */}
                <div className="col-sm-auto col-2 d-flex justify-content-start ps-2">
                  <button className="button button-charcoal " onClick={confirmmessage} > Save </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    <div className=" position-relative rounded-2 bg-seashell" style={{minHeight:'100%'}}>
    <div className="shadow-sm">
      <h5 className="text-center fw-bold py-2">{props.patientname} Bill</h5>
      <button className={`btn btn-back position-absolute start-0 top-0 ms-2 d-${stage1 == 'block' ? 'none' : 'block'}`} onClick={() => { Go_Back() }}   ></button>
      <button className="btn btn-close position-absolute end-0 top-0 me-2" onClick={() => { props.CloseBillForm(); }}  ></button>
    </div>
    <div className={`stage1 d-${stage1}`}>
               <div className="px-4 pt-4">
               <label className=" text-charcoal fw-bolder mt-2 mb-3">
                 <input className="form-check-input me-1 " type="checkbox" checked={AddConsAmt} onClick={AddConsAmt == props.doctorfee ? () => setAddConsAmt(0) : () => setAddConsAmt(props.doctorfee)} />
                 Add Consultation Amount
               </label>
               <div className="row p-0 m-0 justify-content-between">
                 <div className="col-4 ps-0 ">
                   <label className="text-charcoal75 fw-bold"> Doctor's Consultation Charge </label>
                   <input className="form-control bg-seashell fw-bold" disabled={true} value={AddConsAmt} />
                 </div>
                 <div className="col-8 pe-0 ">
                   <label className="text-charcoal75 fw-bold"> Consultation text </label>
                   <input className="form-control bg-seashell fw-bold" value={constext ? constext : ""} onChange={(e) => setconstext(e.target.value)} />
                 </div>
               </div>
               <div className="mt-5 text-start">
                <h5 className="fw-bolder text-charcoal">Discounts</h5>
                <div className="row p-0 m-0">
                  <div className="col-4 ps-0">
                    <label className="text-charcoal75 fw-bold">Coupon</label>
                    <input
                      className="form-control fw-bold text-charcoal text-start"
                      disabled={true}
                      value={coupondiscount ? coupondiscount : ""}
                      onChange={(e) => setcoupondiscount(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Doctor</label>
                    <input className="form-control bg-seashell fw-bold text-charcoal text-start" value={docdiscount ? docdiscount : ""} onChange={(e) => setdocdiscount(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Aartas</label>
                    <input className="form-control bg-seashell fw-bold text-charcoal text-start" value={aartasdiscount ? aartasdiscount : ""} onChange={(e) => setaartasdiscount(e.target.value)} />
                  </div>
                </div>
              </div>
               </div>
               
        
      <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
      {
      load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row p-0 m-0 text-center align-items-center mt-1 justify-content-between ">
                <div className="col-4 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start"> Grand Total </label>
                  <input className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0  bg-pearl" value={"₹" + Get_Grand_Total()} />
                </div>
                {/* <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div> */}
                <div className="col-sm-auto col-2 d-flex justify-content-start ps-2">
                  <button className="button button-charcoal " onClick={()=>{toggleStage1();toggleStage2();}} >Extra Charges </button>
                </div>
              </div>
            )
        }
      </div>
    </div>

    <div className={`stage2 d-${stage2} scroll`}>
                <div className="container-fluid text-start p-2">
                <div className="bg-seashell position-relative">
                  <div className="row p-0 m-0 align-items-center mb-2">
                    <div className="col-auto p-0 m-0 ps-2 pe-1">
                      <h5 className=" p-0 m-0 text-charcoal fw-bolder"> Extra Charges </h5>
                    </div>
                    {/* <div className="col-auto p-0 m-0">
                      <button className="btn p-0 m-0 py-0" onClick={() =>AddCharges()} >
                        <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" />
                      </button>
                    </div> */}
                  </div>
                  {props.isLoading ? (
                    <div className="col-6 py-2 pb-2 m-auto text-center">
                      <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    extrachargecount.map((data, i) => (
                      <div className="container-fluid p-0 m-0">
                        <div className="row p-0 m-0 align-items-center">
                          <div className="col-10">
                          <div className="row p-0 m-0">
                          <div className="col-8 ps-0 ms-0">
                            <label className="fw-bold text-charcoal75 text-start ps-1"> Description </label>
                            <input className="form-control bg-seashell m-0 text-start fw-bold " value={data.description ? data.description : ""} onChange={(e) => { data.description = e.target.value; Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-4">
                            <label className="fw-bold text-charcoal75 text-start ps-1">
                              Amount
                            </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.amount ? data.amount : ""} onChange={(e) => { data.amount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          </div>
                          <div className="row p-0 m-0 mt-1">
                          <div className="col-4 ms-0 ps-0">
                            <label className="fw-bold text-charcoal75 text-start ps-1">
                              Discount ₹
                            </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.discount ? data.discount : ""} onChange={(e) => { data.discount = e.target.value; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-4">
                            <label className="fw-bold text-charcoal75 text-start ps-1"> GST % </label>
                            <input type="number" className="form-control text-start bg-seashell m-0 fw-bold " value={data.cgst && data.sgst ? data.cgst + data.sgst : ""} onChange={(e) => { data.cgst = e.target.value / 2; data.sgst = e.target.value / 2; data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                          </div>
                          <div className="col-4 p-0 align-self-end ">
                            <div className="row p-0 m-0 ">
                              <div className="col-6 p-0 m-0 fw-bold text-charcoal75 text-end"> Amount: </div>
                              <input type="number" className="col-6 p-0 border-0 text-start bg-seashell m-0 ps-1 fw-bold text-burntumber" style={{ letterSpacing: "1px" }} value={data.amount && data.discount ? data.amount - data.discount : ""} onChange={(e) => { data.gross_amount = Calculate_gst(data.amount, data.discount, data.cgst, data.sgst); }} />
                            </div>
                            <div className="row p-0 m-0">
                              <div className="col-6 p-0 m-0 fw-bold text-charcoal75 text-end"> incl. gst: </div>
                              <input className="col-6 p-0 border-0 m-0 text-start bg-seashell ps-1 fw-bold text-burntumber" style={{ letterSpacing: "1px" }} value={data.gross_amount ? data.gross_amount : ""} />
                            </div>
                          </div>
                          </div>
                          </div>
                          <div className="col-2">
                            <button className={`btn btn-sm p-0 m-0 d-${i==0?'none':'block'}`} onClick={() => { DeleteExtraCharges(i); setpaymentmethods((prevState) => [...prevState]); }} >
                              <img src={process.env.PUBLIC_URL + "/images/minus.png"} className="img-fluid p-0 m-0" style={{width:'1.5rem'}} />
                            </button>
                          </div>
                        </div>
           
                      </div>
                    ))
                  )}
                               <div className={`container-fluid text-center mt-2  `}>    
                        <button className="btn p-0 m-0 py-0" onClick={() =>AddCharges()} >
                        <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" style={{width:'1.8rem'}} />
                      </button>
            </div>
                 
                </div>
              </div>
      <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
      {
      load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row p-0 m-0 text-center align-items-center mt-1 ">
                <div className="col-3 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start"> Grand Total </label>
                  <input className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0 bg-pearl" value={"₹" + Get_Grand_Total()} />
                </div>
                <div className="col-3 align-self-end text-start">
                <label className="fw-bolder text-charcoal text-wrap text-start"><small>SGST</small> </label>
                <input className="form-control rounded-1 text-burntumber text-start border-0 fw-bolder p-0 bg-pearl" disabled value={SGST ? SGST : "₹" +Get_total_Seperate_gsts()} onChange={(e) => setSGST(e.target.value)} />
                </div>
                <div className="col-3 align-self-end text-start">
                <label className="fw-bolder text-charcoal text-wrap text-start"><small>CGST</small></label>
                <input className="form-control rounded-1 text-burntumber text-start border-0 fw-bolder p-0 bg-pearl" disabled value={CGST ? CGST : "₹" + Get_total_Seperate_gsts()} onChange={(e) => setCGST(e.target.value)} />
                </div>
                {/* <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div> */}
                <div className=" col-3 d-flex justify-content-end ps-2">
                  <button className="button button-charcoal " onClick={()=>{toggleStage2();toggleStage3();}} > Payments </button>
                </div>
              </div>
            )
        }
      </div>
    </div>

    <div className={`stage3 d-${stage3} scroll`}>

            <div className=" text-start position-relative px-3">
            <h5 className="text-charcoal fw-bolder text-start ps-1">Payments</h5>
            {
              paymentmethods && paymentmethods !== undefined ? (
                paymentmethods.map((data, i) =>
                    <>
                      <div className=" mt-4">
                        <div className="row p-0 m-0 align-items-center">
                          <div className="col-10 ps-0">
                            <h6 className="text-charcoal75 fw-bold">Enter Amount</h6>
                            <input type="number" placeholder="₹00" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} className="form-control rounded-1 fw-bold text-charocoal75 bg-seashell w-25 border-2" />
                          </div>
                          <div className="col-2">
                            <button className={`btn btn-sm p-0 m-0 d-${i == 0 ? 'none' : 'block'}`} onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                              <img src={process.env.PUBLIC_URL + "/images/minus.png"} className="img-fluid" style={{ width: "1.5rem" }}/>
                            </button>
                          </div>
                        </div>
                      </div >
                      <h6 className="text-charcoal75 fw-bold mt-2">Select Payment Method</h6>
                      <div className="d-flex flex-horizontal mt-2 scroll" style={{minHeight:'min-content'}}>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Cash'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Cash' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Cash' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Cash</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Points'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Points' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Points' />
                        <span>
                        <h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Points<div className=" text-success fw-bold">{props.Data.patient.reward_points !=undefined  && props.Data.patient.reward_points.points_total!=undefined && props.Data.patient.reward_points.points_total !=null ? props.Data.patient.reward_points.points_total :0}</div></h6>
                        </span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Adjust-Advance'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Adjust-Advance' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Adjust-Advance' />
                        <span>
                        <h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Adjust-Advance                {
                      loadadvancepayments ? (
                        <div className=" py-2 pb-2 m-auto text-center">
                          <div class="spinner-border spinner-border-sm" role="status" >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : advancepayments ? (
                        <div className="text-success text-start border-0 rounded-1 fw-bolder p-0  bg-seashell">
                          {"₹" + advancepayments.advnace_total}
                        </div>
                      ) : (
                        // <input className='form-control text-success text-start border-0 rounded-1 fw-bolder p-0  bg-seashell' value= />
                        <div className="text-success fw-bold"> 0 </div>
                      )}</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Card'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Card' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Card' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Card</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Paytm'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Paytm' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Paytm' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Paytm</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Phonepe'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Phonepe' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Phonepe' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Phonepe</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Razorpay'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Razorpay' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Razorpay' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Razorpay</h6></span>
                        <input type="checkbox" className="form-check-input p-2 mt-1" onChange={() => { data.paymentmethod = 'Wire-Transfer'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Wire-Transfer' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Wire-Transfer' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Wire-Transfer</h6></span>
                      </div>
                    </>
                )
              ) : (
                <></>
              )
            }
            <div className={`container-fluid text-center mt-2  `}>    
                  <button className="btn py-0" onClick={AddMethods}>
                    <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" style={{ width: "1.8rem" }} />
                  </button>
            </div>
          </div>
      <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
      {
      load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row p-0 m-0 text-center align-items-center mt-1 ">
                <div className="col-3 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start"> Grand Total </label>
                  <input className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0 bg-pearl" value={"₹" + Get_Grand_Total()} />
                </div>
                <div className="col-3 align-self-end text-start">
                <label className=" fw-bolder text-charcoal text-wrap text-start"> Amount Recieved</label>
                  <div className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0 bg-pearl"> {paymentmethods && paymentmethods.length > 0 ? "₹" + Total_Amount() : "₹" + 0} </div>
                </div>
                <div className="col-3 align-self-end text-start fw-bolder text-charcoal text-wrap text-start ">
                 Extra Amount
                 <div className="toolTip">
                 {
                  Return_Amount() > 0 ?(
                    <img src={process.env.PUBLIC_URL+'/images/info.png'} className="p-0 m-0 ms-2 img-fluid toolTip" style={{width:'1rem'}}/>
                  ):(<></>)
                 }
                <span className="tooltiptext">Click to save it as Advance Payment</span>
              </div>
      
                <div className="form-control rounded-1 fs-6 text-success text-start border-0 fw-bolder p-0 bg-pearl">{Return_Amount() > 0 ? `+ ₹${Return_Amount()}` : "₹"+0} </div>
                  </div>
                {/* <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div> */}
                <div className="col-sm-auto col-2 d-flex justify-content-start ps-2">
                  <button className="button button-charcoal" onClick={()=>{confirmmessage();}}> Bill & Prescription </button>
                </div>
              </div>
            )
        }
      </div>
    </div>

    <div className={`stage4 d-${stage4} scroll`}>
        <div className="container px-3">
        <h5 className="text-charcoal fw-bold mb-3">Bill & Prescription</h5>
          <div className="row mt-2 p-0 m-0 justify-content-start align-items-center">
          <h6 className="fw-bold text-charcoal75 ps-0 ms-0">Generate Bill & Prescription</h6>
            <div className="col-auto ps-0 ms-0">
            <button className="button button-charcoal px-4" onClick={()=>{Generate_Bill(props.appointmentid)}}>Bill</button>
            </div>
            <div className="col-auto">
            <div className='vr rounded-1 align-self-center' style={{ padding: '0.8px' }}></div>
            </div>
            <div className="col-6">
            <button className="button button-charcoal" onClick={()=>{Generate_Prescription(props.appointmentid)}}>Prescription</button>
            </div>
          </div>
          <div className="row p-0 m-0 mt-4">
            <h6 className="fw-bold text-charcoal75 ms-0 ps-0">Send Bill and Prescription</h6>
            <div className="row ps-0 ms-0">
              <div className="col-12 ms-0 ps-0 mt-2">
                <div className="row ps-0 ms-0">
                <h6 className="ms-0 ps-0 text-charcoal fw-bold">On WhatsApp</h6>
                  <div className="col-6 ms-0 ps-0">
                  <button className="btn border-0 p-0 m-0 fw-bold" onClick={()=>{Send_On_WhatsApp(props.appointmentid, props.Data.patient.phone_number, 0)}}><img src={process.env.PUBLIC_URL+'/images/whatsapp.png'} className="img-fluid" style={{width:'1.5rem'}}/>Bill</button>
                  </div>
                  <div className="col-6">
                  <button className="btn border-0 p-0 m-0 fw-bold" onClick={()=>{Send_On_WhatsApp(props.appointmentid, props.Data.patient.phone_number, 1)}}><img src={process.env.PUBLIC_URL+'/images/whatsapp.png'} className="img-fluid" style={{width:'1.5rem'}}/>Bill with Prescription</button>
                  </div>
                </div>
              </div>
              <div className="col-12 ms-0 ps-0 mt-2">
              <div className="row ps-0 ms-0">
                <h6 className="ms-0 ps-0 text-charcoal fw-bold">On SMS</h6>
                  <div className="col-6 ms-0 ps-0">
                  <button className="btn border-0 p-0 m-0 fw-bold" onClick={()=>{Send_On_SMS(props.appointmentid, props.Data.patient.phone_number, 0)}}><img src={process.env.PUBLIC_URL+'/images/message.png'} className="img-fluid" style={{width:'1.2rem'}}/>Bill</button>
                  </div>
                  <div className="col-6">
                  <button className="btn border-0 p-0 m-0 fw-bold" onClick={()=>{ Send_On_SMS(props.appointmentid, props.Data.patient.phone_number, 1)}}><img src={process.env.PUBLIC_URL+'/images/message.png'} className="img-fluid" style={{width:'1.2rem'}}/>Bill with Prescription</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
      {
      load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row p-0 m-0 text-center align-items-center mt-1 justify-content-between ">
                <div className="col-4 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start"> Grand Total </label>
                  <input className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0  bg-pearl" value={"₹" + Get_Grand_Total()} />
                </div>
                {/* <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div> */}
                <div className="col-sm-auto col-2 d-flex justify-content-start ps-2">
                  <button className="button button-charcoal " onClick={()=>{props.setsingleload(0);props.Appointmentlist();props.CloseBillForm()}} > Done </button>
                </div>
              </div>
            )
        }
      </div>
    </div>
  </div >
  </>
  );
};

export { Bill };

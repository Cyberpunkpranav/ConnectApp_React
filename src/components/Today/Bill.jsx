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
  const [extrachargecount, setextrachargecount] = useState([]);

  //Bill
  const [constext, setconstext] = useState("");
  const [docdiscount, setdocdiscount] = useState(0);
  const [coupondiscount, setcoupondiscount] = useState(0);
  const [aartasdiscount, setaartasdiscount] = useState(0);
  const [AtC, setAtC] = useState(0);
  const [AddConsAmt, setAddConsAmt] = useState(props.doctorfee);
  const [SGST, setSGST] = useState();
  const [CGST, setCGST] = useState();
  const [paymentmethods, setpaymentmethods] = useState([]);
  const [load, setload] = useState();


  async function AddExtraCharges() {
    let extracharges = [];
    for (let i = 0; i < props.appointmentdata.length; i++) {
      if (props.appointmentid == props.appointmentdata[i].id) {
        for (
          let j = 0;
          j < props.appointmentdata[i].other_charges.length;
          j++
        ) {
          extracharges.push({
            description:
              props.appointmentdata[i].other_charges[j].description != null
                ? props.appointmentdata[i].other_charges[j].description
                : "N/A",
            amount:
              props.appointmentdata[i].other_charges[j].total_amount != null
                ? props.appointmentdata[i].other_charges[j].total_amount
                : 0,
            discount:
              props.appointmentdata[i].other_charges[j].discount != null
                ? props.appointmentdata[i].other_charges[j].discount
                : 0,
            cgst:
              props.appointmentdata[i].other_charges[j] != null &&
                props.appointmentdata[i].other_charges[j].gst_rate != null
                ? props.appointmentdata[i].other_charges[j].gst_rate / 2
                : 0,
            sgst:
              props.appointmentdata[i].other_charges[j] != null &&
                props.appointmentdata[i].other_charges[j].gst_rate != null
                ? props.appointmentdata[i].other_charges[j].gst_rate / 2
                : 0,
            gross_amount:
              props.appointmentdata[i].other_charges[j].final_amount &&
                props.appointmentdata[i].other_charges[j].final_amount !== null
                ? props.appointmentdata[i].other_charges[j].final_amount
                : "",
            id:
              props.appointmentdata[i].other_charges[j].id &&
                props.appointmentdata[i].other_charges[j].id != null
                ? props.appointmentdata[i].other_charges[j].id
                : "",
          });
        }
        setaartasdiscount(props.appointmentdata[i].aartas_discount);
        setdocdiscount(props.appointmentdata[i].doc_discount);
        setconstext(props.appointmentdata[i].cons_text);
      }
    }
    setextrachargecount(extracharges);
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
      setpaymentmethods(allamounts);
    }

    paymentmethods.push(paymentobj);
  }
  useEffect(() => {
    AddExtraCharges();
    AddPaymentMethods();
  }, [props.billform]);
  // useEffect(() => {
  //     AddExtraCharges()
  // }, [props.isLoading])

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
            props.setsingleload(0);
            setextrachargecount([]);
            Notiflix.Notify.success(response.data.message);
            setload(false);
            props.CloseBillForm();
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
  return (
    <>
  
      <div className="container-fluid position-relative bg-seashell p-0 m-0 rounded-2 pt-2 pb-0 col-lg-8 p-0 m-0 col-md-10 col-sm-12 col-11 col-xl-6 mx-auto">
        <h5 className="text-charcoal mt-2 fw-bold text-start ps-3">
          {props.patientname} Bill
        </h5>
        <button
          className="btn btn-close position-absolute top-0 end-0 me-2 mt-1 pt-3 "
          onClick={() => {
            props.CloseBillForm();
          }}
        ></button>
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
                  {/* <div className="col-6">
                                        <label className='text-charcoal75 fw-bold'>Procedure</label>
                                        <select className='form-control bg-seashell'>
                                            <option>Procedures</option>
                                        </select>
                                    </div> */}
                </div>
              </div>

              <div className="container-fluid text-start p-2 ps-3">
                <h6 className="fw-bolder text-charcoal">Discounts</h6>
                <div className="row p-0 m-0">
                  <div className="col-4 ps-0">
                    <label className="text-charcoal75 fw-bold">Coupon</label>
                    <input
                      className="form-control border-0 fw-bold text-burntumber text-start"
                      disabled={true}
                      value={coupondiscount ? coupondiscount : ""}
                      onChange={(e) => setcoupondiscount(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Doctor</label>
                    <input className="form-control bg-seashell fw-bold text-burntumber text-start" value={docdiscount ? docdiscount : ""} onChange={(e) => setdocdiscount(e.target.value)} />
                  </div>
                  <div className="col-4">
                    <label className="text-charcoal75 fw-bold">Aartas</label>
                    <input className="form-control bg-seashell fw-bold text-burntumber text-start" value={aartasdiscount ? aartasdiscount : ""} onChange={(e) => setaartasdiscount(e.target.value)} />
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
              <div className="container-fluid text-start my-2 border border-1 py-1 rounded-1 w-auto mx-3">
                <div className="row p-0 m-0 align-items-center">
                  <div className="col-auto">
                    <div className="row p-0 m-0">
                      <div className="col-auto p-0 m-0">
                        <div className="row p-0 m-0">
                          <div className="col-auto p-0 m-0 align-self-center">
                            <label className="text-burntumber fw-bold p-0 m-0"> SGST:- ₹ </label>
                          </div>
                          <div className="col-auto p-0 m-0">
                            <input className="form-control bg-seashell fw-bold border-0 p-0 m-0" disabled value={SGST ? SGST : Get_total_Seperate_gsts()} onChange={(e) => setSGST(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto p-0 m-0">
                        <div className="row p-0 m-0">
                          <div className="col-auto p-0 m-0">
                            <label className="text-burntumber fw-bold p-0 m-0"> CGST:- ₹ </label>
                          </div>
                          <div className="col-auto p-0 m-0">
                            <input className="form-control bg-seashell fw-bold border-0 p-0 m-0" disabled value={CGST ? CGST : Get_total_Seperate_gsts()} onChange={(e) => setCGST(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="col-4 p-0 m-0  text-start">
                    <label className="fw-bolder text-charcoal text-start text-wrap"> Consumables Amount </label>
                    {/* defaultValue=" not available" */}
                    <input className="form-control bg-seashell text-success text-start rounded-1  border-0 fw-bolder p-0 text-charcoal50" value={"₹" + ConsumableAmount()} />
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
                      <input className="form-control bg-seashell fw-bold" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} />
                    </div>
                    <div className="col-2">
                      <button className="btn btn-sm p-0 m-0" onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                        <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid"/>
                      </button>
                    </div>
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
              <div className="row p-0 m-0 text-center align-items-center mt-1 ">
                <div className="col-4 align-self-end text-start">
                  <label className=" fw-bolder text-charcoal text-wrap text-start">
                    Grand Total
                  </label>
                  <input
                    className="form-control rounded-1 fs-6 text-burntumber text-start border-0 fw-bolder p-0  bg-seashell"
                    value={"₹" + Get_Grand_Total()}
                  />
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <button className="button button-pearl" onClick={AddtoCart}>
                    Add to Cart
                  </button>
                </div>
                <div className="col-sm-auto col-2 d-flex justify-content-start ps-2">
                  <button className="button button-charcoal " onClick={confirmmessage} > Save </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { Bill };

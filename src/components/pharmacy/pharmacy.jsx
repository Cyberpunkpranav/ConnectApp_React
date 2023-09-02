import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../index";
import { ExportPurchaseEntry, ExportPurchaseReturn, ExportSaleEntry, ExportSaleReturn,ExportTransferIn,ExportTransferOut,ExportDump } from "../pharmacy/Exports";
import { QRcode } from "../features/qrcode";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { customconfirm } from "../features/notiflix/customconfirm";
import "../../css/bootstrap.css";
import "../../css/dashboard.css";
import "../../css/pharmacy.css";
import { AddAddress } from '../Patients/AddAddress';
import { NewMedicine } from "./Medicines/NewMedicine";
import { UpdateMedicine } from "./Medicines/UpdateMedicine";
import {UpdateVaccine} from './Vaccines/UpdateVaccine'
import {NewVaccine} from './Vaccines/NewVaccine'

//-------------------------------------------------Sales------------------------------------------------------------------------------------------
function Salesection(props) {
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const permission = useContext(Permissions);
  const first = [
    {
      option: "Sale Entry",
      display: permission.sale_entry_view ? 1 : 0,
    },
    {
      option: "Sale Returns",
      display: permission.sale_return_view ? 1 : 0,
    },
  ];
  const [second, setSecond] = useState("Sale Entry");

  const _selectedScreen = (_selected) => {
    if (_selected === "Sale Entry") {
      return (
        <Saleentrysection function={props.func} function2={props.function} fromdate={fromdate} todate={todate} ClinicID={ClinicID} />
      );
    }
    if (_selected === "Sale Returns") {
      return <SaleReturns fromdate={fromdate} todate={todate} ClinicID={ClinicID} />;
    }
    return <div className="fs-2">Nothing Selected</div>;
  }
  return (
    <>
      <section className="salesection pt-1">
        <div className="container-fluid p-0 m-0 mt-3">
          <div className="row gx-3 p-0 m-0 ms-1 position-relative">
            <div className="col-auto">
              <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                 {second?second:" Sale Type "}
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                  {
                    first.map((e, i) => (
                      <li className={`dropdown-item text-${e.option === second ? "light" : "dark"} fw-bold bg-${e.option === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(e.option)} > {e.option} </li>
                    )
                    )
                  }
                </ul>
              </div>
            </div>
            <div className="col-auto bg-seashell rounded-2 ">
              <div className="row p-0 m-0 align-items-center align-self-center">
                <div className="col-auto p-0 m-0">
                  <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 border-0 text-charcoal text-center fw-bold " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                </div>
                <div className="col-auto p-0 m-0">-</div>
                <div className="col-auto p-0 m-0">
                  <input type="date" className=" border-0 button button-seashell text-charcoal text-center fw-bold" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />                </div>
              </div>
            </div>
            <div className="col-auto p-0 m-0">
            </div>
          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className="container-fluid p-0 m-0 pt-3">
          <div className="">{_selectedScreen(second)}</div>
        </div>
      </section>
    </>
  );
}
function Saleentrysection(props) {
  const permission = useContext(Permissions);
  const currentDate = useContext(TodayDate);
  const ClinicID = props.ClinicID;
  const fromdate = props.fromdate;
  const todate = props.todate;
  const adminid = localStorage.getItem("id");
  const url = useContext(URL);
  const [seidw, setseidw] = useState("none");
  const [channel, setchannel] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [saleentryarr, setsaleentryarr] = useState([]);
  const [saleentryarrforExcel, setsaleentryarrforExcel] = useState([]);
  const [index, setindex] = useState();
  const [nsef, setnsef] = useState("none");
  const [pages, setpages] = useState([]);
  const [paymentsapage, setpaymentsapage] = useState("none");
  const [tabindex, settabindex] = useState();
  const [pagecount, setpagecount] = useState();


  const toggle_nsef = () => {
    if (nsef === "none") {
      setnsef("block");
    }
    if (nsef === "block") {
      setnsef("none");
    }
  };
  const toggle_seidw = () => {
    if (seidw === "none") {
      setseidw("block");
    }
    if (seidw === "block") {
      setseidw("none");
      setindex();
    }
  };
  const toggle_payments = () => {
    if (paymentsapage === "none") {
      setpaymentsapage("block");
    }
    if (paymentsapage === "block") {
      setpaymentsapage("none");
      settabindex();
    }
  }
  function GetPages() {
    try {
      axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }
  function GETSalesList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
          .then((response) => {
            ;
            setsaleentryarr(response.data.data.sale_entry);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
          .then((response) => {
            ;
            setsaleentryarr(response.data.data.sale_entry);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.message);
        setLoading(false);
      }
    }
  }
  function GETSalesListForExcel() {
    try {
      axios
        .get(
          `${url}/sale/entry?clinic_id=${ClinicID}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          ;
          setsaleentryarrforExcel(response.data.data.sale_entry);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    GetPages();
  }, [fromdate, todate]);

  useEffect(() => {
    GETSalesList();
    GETSalesListForExcel();
  }, [pagecount]);

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  let array = [
    [1, "Confirmed", "lightgreen"],
    [2, "Payment done", "success"],
    [3, "Completed", "lightyellow"],
    [4, "Cancelled", "lightred"],
  ];
  function status(number) {
    let status;
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1];
        break;
      }
    }
    return status;
  }
  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2];
        break;
      }
    }
    return status_color;
  }
  //Status
  const UpdateStatus = async (e, id) => {
    try {
      await axios.post(`${url}/sale/entry/change/status`, { sale_entry_id: id, status: e.target.value, admin_id: adminid, })
        .then((response) => {
          ;
          Notiflix.Notify.success(response.data.message);
          GETSalesList();
        })
    } catch (e) {
      Notiflix.Notify.failure(e.message);
    }
  }
  const Generate_Bill = async (id) => {
    Notiflix.Loading.circle("Generating Bill", {
      backgroundColor: "rgb(242, 242, 242,0.5)",
      svgColor: "#96351E",
      messageColor: "#96351E",
      messageFontSize: "1.5rem",
    });
    try {
      axios
        .post(`${url}/sale/entry/bill`, {
          sale_entry_id: id,
          admin_id: adminid,
        })
        .then((response) => {
          ;
          Notiflix.Notify.success(response.data.message);
          window.open(response.data.data.bill_url, "_blank", "noreferrer");
          Notiflix.Loading.remove();
        });
    } catch (e) {
      Notiflix.Notify.failure(e.message);
      Notiflix.Loading.remove();
    }
  };
  const Send_On_WhatsApp = async (id, phone) => {
    if (phone == undefined || phone == null) {
      Notiflix.Notify.failure(
        "Please Add a Phone Number to send the message on WhatsApp"
      );
    } else {
      Notiflix.Loading.circle("Sending Bill on Whats App", {
        backgroundColor: "rgb(242, 242, 242,0.5)",
        svgColor: "#96351E",
        messageColor: "#96351E",
        messageFontSize: "1.5rem",
      });
      try {
        axios
          .post(`${url}/sale/entry/send/bill/whatsapp`, {
            sale_entry_id: id,
            admin_id: adminid,
          })
          .then((response) => {
            ;
            Notiflix.Notify.success(response.data.message);
            Notiflix.Loading.remove();
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        Notiflix.Loading.remove();
      }
    }
  };  
  return (
    <>
           <div className="col-auto position-absolute p-0 m-0 export align-self-center text-center ">
          <ExportSaleEntry saleentryarr={saleentryarrforExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      <button className={`button addentrypurchase button-charcoal end-0 me-3  position-absolute d-${permission.sale_entry_add == 1 ? "" : "none"}`} onClick={toggle_nsef} >
        <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" />
        Entry Sale
      </button>
          <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Sale Entries" : "Sale Entry"}{" "} </h2>
          <div className="position-relative">
      <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "100%" }} >
        <table className="table text-start table-responsive ">
          <thead className=" position-sticky top-0 bg-pearl">
            <tr className=" ">
              {/* <th className="text-charcoal75 fw-bolder text-center px-3"> ID </th> */}
              <th className="text-charcoal75 fw-bolder px-3"> Bill ID </th>
              <th className="text-charcoal75 fw-bolder"> Patient Name </th>
              <th className="text-charcoal75 fw-bolder"> Bill Date </th>
              <th className="text-charcoal75 fw-bolder"> Bill Total </th>
              {/* <th className="text-charcoal75 fw-bolder"> Appointment Date </th> */}
              <th className="text-charcoal75 fw-bolder"> Doctor Name </th>
              <th className="text-charcoal75 fw-bolder"> Invoice No. </th>
              <th className="text-charcoal75 fw-bolder text-center"> Status </th>
              <th className="text-charcoal75 fw-bolder text-center "> Actions </th>
              {/* <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>more</th> */}
            </tr>
          </thead>
          {Loading ? (
            <tbody
              className="text-center"
              style={{ minHeight: "55vh", height: "55vh" }}
            >
              <tr className="position-absolute border-0 start-0 end-0 px-5">
                <div class="d-flex align-items-center spinner">
                  <strong className="" style={{ fontSize: "1rem" }}>
                    Getting Details please be Patient ...
                  </strong>
                  <div className="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
                </div>
              </tr>
            </tbody>
          ) : saleentryarr && saleentryarr.length != 0 ? (
            <tbody>
              {saleentryarr.map((item, i) => (
                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                  {/* <td className="text-charcoal fw-bold text-center px-3"> {item.id && item.id !== null ? item.id : ""} </td> */}
                  <td className="text-charcoal fw-bold px-3"> {item.bill_id && item.bill_id !== null ? "P-" + item.bill_id : ""} </td>
                  <td className="text-charcoal fw-bold"> {item.patient && item.patient && item.patient.full_name != null ? item.patient.full_name : ""} </td>
                  <td className="text-charcoal fw-bold"> {item.bill_date && item.bill_date ? reversefunction(item.bill_date) : ""} </td>
                  <td className="text-charcoal fw-bold"> {item.grand_total && item.grand_total ? "Rs. " + item.grand_total : ""} </td>
                  {/* <td className="text-charcoal fw-bold"> {item.appointment && item.appointment != null && item.appointment.appointment_date && item.appointment.appointment_date != null ? reversefunction(item.appointment.appointment_date) : ""} </td> */}
                  <td className="text-charcoal fw-bold"> {item && item.doctor_name != null ? item.doctor_name : ""} </td>
                  <td className="text-charcoal fw-bold"> {item.bill_id && item.bill_id !== null ? "P-" + item.bill_id : ""} </td>
                  <td className="text-charcoal fw-bold text-center">
                    <select disabled={item.sale_entry_status == 4 ? true : false} className={` fw-bolder border-0 bg-${i % 2 == 0 ? "seashell" : "pearl"} text-center rounded-pill  bg-${status_color(item.sale_entry_status)}`} name={item.id} onChange={(e) => { UpdateStatus(e, item.id); }} style={{ appearance: "none" }} >
                      <option className="button" selected disabled> {status(item.sale_entry_status)} </option>
                      <option key={0} className="text-lightred bg-pearl" value="1" > Confirmed </option>
                      <option key={1} className="text-lightblue  bg-pearl" value="2" > Payment Done </option>
                      <option key={2} className="text-lightred  bg-pearl" value="3" > Completed </option>
                      <option key={3} className="text-charcoal  bg-pearl" value="4" > Cancelled </option>
                    </select>
                  </td>
                  <td className={`text-charcoal text-center bg-transparent fw-bold`} >
                    <div className={`dropdown  bg-${tabindex == i ? "lightyellow" : ""} d-inline-block text-center text-decoration-none`} >
                      <button className="button border-0 p-0 m-0 text-decoration-none dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" >
                        <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image"/>
                      </button>
                      <ul className="dropdown-menu text-start">
                        <li className={`text-start dropdown-item border-bottom `} onClick={() => { settabindex(i); toggle_payments(); }}> <img src={process.env.PUBLIC_URL + "/images/rupee.png"} alt="displaying_image" className="me-1" /> Payments </li>
                        <li className=" text-start dropdown-item border-bottom" onClick={() => { setindex(i); toggle_seidw(); }}> <img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="me -1" />{" "} Inventory </li>
                        <li className="text-start dropdown-item border-bottom" onClick={() => { Generate_Bill(item.id); }}> <img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" />{" "} Generate Bill </li>
                        <li className="text-start dropdown-item" onClick={() => { Send_On_WhatsApp(item.id, item.patient.phone_number); }}> <img src={process.env.PUBLIC_URL + "/images/whatsapp.png"} alt="displaying_image" />{" "} Send Bill On WhatsApp{" "} </li>
                      </ul>
                    </div>
                  </td>

                  <td className="p-0 m-0">
                    {i == index ? (
                      <>
                      <div className="backdrop"></div>
                      <section className={`position-absolute d-${i == index ? seidw : "none"} start-0 end-0 mx-auto border border-1 bg-seashell rounded-4`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }}>
                      <SEitemdetailssection saleentryarr={saleentryarr[i]} itembillid={"P-" + item.bill_id} toggle_seidw={toggle_seidw} />
                      </section>
                      </>
                    ) : (
                      <></>
                    )}
       

                  </td>

                  <td className="p-0 m-0">
                    {i == tabindex ? (
                      <>
                      <div className="backdrop"></div>
                      <section className={`col-lg-8 col-xl-6 col-md-8 col-sm-10 start-0 end-0 top-0 mx-auto shadow rounded-4 position-absolute bg-pearl d-${tabindex == i ? paymentsapage : "none"}`}>
                      <SaleEntrypayments GETSalesList={GETSalesList} saleentryarr={saleentryarr[i]} toggle_payments={toggle_payments} itembillid={"P-" + item.bill_id} />
                      </section>
                      </>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <strong className="text-charcoal fw-bolder text-center"> No Sale Entries </strong>
              </div>
            </tbody>
          )}
        </table>
      </div>
      </div>
      <div className="container-fluid mt-2 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GETSalesList}
          containerClassName={
            "pagination scroll align-self-center align-items-center"
          }
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={
            "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
          }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"d-flex mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active "}
        />
      </div>
      <section className={`newsaleentryform col-xl-6 col-lg-8 col-md-10 p-0 m-0 position-absolute d-${nsef} border rounded-2 shadow mx-auto top-0 bottom-0 m-auto start-0 end-0 bg-seashell`} style={{ height: "70vh" }} >
        <SaleEntryForm toggle_nsef={toggle_nsef} GETSalesList={GETSalesList} />
      </section>
    </>
  );
}
function SaleEntrypayments(props) {
  const url = useContext(URL);
  const permission = useContext(Permissions);
  const adminid = localStorage.getItem("id");
  const [paymentmethods, setpaymentmethods] = useState([]);
  const [previoustotal, setprevioustotal] = useState(0);
  const [loading, setloading] = useState();
  const paymentmethoddetails = {
    paymentmethod: "",
    amount: 0,
  };
  async function AddPaymentMethods() {
    let Payments = []
    let amounts = []
    let allamounts = []
    Payments.push(Object.keys(JSON.parse(props.saleentryarr.payment_method_details)))
    amounts.push(Object.values(JSON.parse(props.saleentryarr.payment_method_details)))
    let paymentobj = []
    let p = {
      paymentmethod: "",
      amount: 0,
    }
    if (Payments[0]) {
      for (let j = 0; j < Payments[0].length; j++) {
        allamounts.push((p = { paymentmethod: Payments[0][j], amount: amounts[0][j] }))
      }
      setpaymentmethods(allamounts)
    }
    paymentmethods.push(paymentobj)
  }
  useEffect(() => {
    AddPaymentMethods();
  }, [])
  function DeletePaymentMethods(i) {
    paymentmethods.splice(i, i);
  }
  const confirmmessage = (e) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to add the following Charges and Payments of  ${props.itembillid}`,
      "Yes",
      "No",
      () => {
        SaveSaleEntryCharges();
      },
      () => {
        return 0;
      },
      {}
    );
  }
  async function SaveSaleEntryCharges() {
    let PaymentMethod = [];
    let PaymentMethodDetails = [];
    for (let i = 0; i < paymentmethods.length; i++) {
      PaymentMethod.push(paymentmethods[i].amount);
      PaymentMethodDetails.push(paymentmethods[i].paymentmethod);
    }
    let Data = {
      sale_entry_id: props.saleentryarr.id,
      g_total_main: props.saleentryarr.grand_total,
      payment_method: PaymentMethodDetails,
      payment_method_main: PaymentMethodDetails,
      payment_method_details: PaymentMethod,
      admin_id: adminid,
    };
    try {
      setloading(true);
      await axios
        .post(`${url}/sale/entry/save/charges`, Data)
        .then((response) => {
          props.GETSalesList();
          setloading(false);
          Notiflix.Notify.success(response.data.message);
        });
    } catch (e) {
      setloading(false);
      Notiflix.Notify.failure(e.message);
    }
  }
  const CalPrevTotal = async () => {
    let total = 0;
    paymentmethods && paymentmethods.map((data) => (total += Number(data.amount)));
    setprevioustotal(total);
  }
  useEffect(() => {
    CalPrevTotal();
  }, [props.saleentryarr]);

  function AddMethods() {
    if (paymentmethods && paymentmethods.length > 0) {
      setpaymentmethods((prevState) => [...prevState, paymentmethoddetails]);
    } else {
      setpaymentmethods([paymentmethoddetails]);
    }
  }
  function Return_Amount() {
    let totalarr = [];
    let total = 0;
    let Advance = 0;
    if (paymentmethods && paymentmethods !== undefined) {
      for (let i = 0; i < paymentmethods.length; i++) {
        totalarr.push(Number(paymentmethods[i].amount));
      }
      totalarr.forEach((item) => {
        total += item;
      });
      if (total > props.saleentryarr.grand_total) {
        Advance = total - props.saleentryarr.grand_total;
        return Number(Advance).toFixed(2);
      } else {
        return Number(Advance).toFixed(2);
      }
    }

  }
// console.log(paymentmethods)
  return (
    <div className="p-0 m-0 text-center">
      <h6 className="text-center mt-2 fw-bold">{props.itembillid} Payments</h6>
      <hr className="p-0 m-0 mt-1" />
      <button className="btn-close position-absolute top-0 end-0 p-2 m-2 " onClick={() => {props.toggle_payments();setpaymentmethods([])}} ></button>

      <p className="text-charcoal p-0 m-auto fw-bolder"> Grand Total :{" "} <span className="text-burntumber"> Rs {props.saleentryarr.grand_total} </span> </p>
      <hr className="p-0 m-0 mb-1" />
      <div className="container-fluid text-start position-relative">
        <div className={`d-${previoustotal == props.saleentryarr.grand_total ? "" : "none"} bg-lightgreen fw-bold text-center p-2 my-2`} > Payment Done </div>
        <h6 className="text-charcoal fw-bolder text-center">Payments</h6>
        <h6 className="text-burntumber fw-bolder text-center">{Return_Amount() > 0 ? `Amount Exceeded by ${Return_Amount()}` : ""}</h6>
        {
          paymentmethods ? (
            paymentmethods.map((data, i) =>
              permission.sale_entry_charges_edit == 1 ? (
                <div className={`row p-0 m-0 justify-content-end g-2`}>
                  <div className="col-4 ">
                    <select className="form-control border-success py-1 text-center" value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} >
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
                  <div className="col-4 text-center ">
                    <input className="form-control border-success py-1 text-center" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} />
                  </div>
                  <div className="col-2 text-center">
                    <button className="btn btn-sm p-0 m-0" onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                      <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid"/>
                    </button>
                  </div>
                </div>
              ) : props.saleentryarr.payment_method_details == null ? (
                <div className={`row p-0 m-0 justify-content-end g-2`}>
                  <div className="col-4 ">
                    <select className="form-control border-success py-1 text-center" value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} >
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
                  <div className="col-4 text-center ">
                    <input className="form-control border-success py-1 text-center" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} />
                  </div>
                  <div className="col-2 text-center">
                    <button className="btn btn-sm p-0 m-0" onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                      <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`row p-0 m-0 justify-content-center g-2`}>
                  <div className="col-4 text-center ">
                    <input className="form-control py-1" disabled={true} value={data.paymentmethod} />
                  </div>
                  <div className="col-4 text-center ">
                    <input className="form-control py-1 text-center" disabled={true} value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} />
                  </div>
                </div>
              )
            )
          ) : (
            <></>
          )}
        <div className={`container-fluid text-center mt-2 `}>
          {permission.sale_entry_charges_edit == 1 ? (
            <button className="btn py-0" onClick={AddMethods}>
              <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" style={{ width: "2rem" }} />
            </button>
          ) : props.saleentryarr.payment_method_details == null ? (
            <button className="btn py-0" onClick={AddMethods}>
              <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" style={{ width: "2rem" }} />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="mt-2 pb-3">
        {loading ? (
          <div className="container-fliud pt-2">
            <div className="d-flex fs-6 align-items-center justify-content-around">
              <h6 className="text-charcoal">Updating...</h6>
              <div className="text-charcoal spinner-border ml-auto" role="status" aria-hidden="true" ></div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-6">
              <button className="button button-charcoal m-0 p-0 py-1 px-5" disabled={previoustotal == props.saleentryarr.grand_total ? true : false} onClick={confirmmessage} > Save </button>
            </div>
            <div className="col-6">
              <button className="button button-pearl border-charcoal p-0 m-0 py-1 px-5" onClick={() => { setpaymentmethods(); props.toggle_payments(); }} > Cancel </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function SEitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];

  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      let e = Number(cgst) + Number(sgst) + Number(igst);
      return e;
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst && igst !== null) || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      return e;
    }
  }
  return (
    <div className="container-fluid p-0 m-0 ">
      <h5 className="text-center text-charcoal pt-3"> {props.itembillid} Sale Entry Item Details </h5>
      <button
        type="button"
        className="btn-close closebtn position-absolute end-0 me-4"
        onClick={props.toggle_seidw}
        aria-label="Close"
      ></button>

      <div className="d-flex p-0 m-0 mt-3 mb-1 justify-content-center">
        {Items.map((data, i) => (
          <button
            className={`button shadow-0 rounded-0 border-charcoal button-${i == index ? "charcoal" : "seashell"
              }`}
            onClick={() => {
              setindex(i);
            }}
          >
            {data}
          </button>
        ))}
      </div>

      <div className="row p-0 m-0 justify-content-between">
        <div className="col-auto ms-2 mb-2 text-burntumber rounded-1 fw-bolder bg-pearl">
          <p className="text-charcoal p-0 m-0 ms-1 text-start">Grand Total</p>
          <hr className="p-0 m-0" />
          <h5 className="text-charcoal p-0 m-0 fw-bold text-start ms-1">
            {props.saleentryarr.grand_total
              ? props.saleentryarr.grand_total
              : 0}
          </h5>
        </div>
        <div className="col-auto align-self-end justify-content-end me-4">
          <input
            type="checkbox"
            className="form-check-input"
            value={Taxon ? Taxon : ""}
            onChange={() => {
              Taxon == true ? setTaxon(false) : setTaxon(true);
            }}
          />
          <label>Show Tax Details</label>
        </div>
      </div>

      <div
        className={`scroll bg-seashell scroll-y d-${medicine}`}
        style={{ Height: "100%"}}
      >
        <table className="table datatable text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Medicine </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc. % </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> {" "} Amt </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Grand Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST%{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total Tax </th>
            </tr>
          </thead>
          {props.saleentryarr.sale_medicines &&
            props.saleentryarr.sale_medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.saleentryarr.sale_medicines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle"> {item.medicine_stocks && item.medicine_stocks.id !== null ? "m" + item.medicine_stocks.id : ""} </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.medicine && item.medicine.name !== null
                      ? item.medicine.name
                      : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.main_mrp ? item.main_mrp : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.qty && item.qty != null ? item.qty : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.discount != null ? item.discount : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST_rate ? Number(item.SGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST ? Number(item.SGST) * Number(item.qty) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST_rate ? Number(item.CGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST ? Number(item.CGST) * Number(item.qty) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST_rate ? Number(item.IGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST ? Number(item.IGST) * Number(item.qty) : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxPercent(
                      item.CGST_rate,
                      item.SGST_rate,
                      item.IGST_rate
                    )}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.disc_mrp ? item.disc_mrp : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item && item.total_amount ? item.total_amount : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <p className=" text-center text-charcoal fw-bold">
                  No Medicines Found
                </p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div
        className={`scroll bg-seashell scroll-y d-${vaccine}`}
        style={{Height: "100%" }}
      >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Vaccine </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc. % </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Amt </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Grand Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > Total IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total Tax </th>
            </tr>
          </thead>
          {props.saleentryarr.sale_vaccines !== undefined &&
            props.saleentryarr.sale_vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.saleentryarr.sale_vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle"> {item.vaccine_stocks && item.vaccine_stocks.id !== null ? "v" + item.vaccine_stocks.id : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.vaccine && item.vaccine.name !== null ? item.vaccine.name : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.main_mrp ? item.main_mrp : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.qty && item.qty != null ? item.qty : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.discount != null ? item.discount : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST_rate ? Number(item.SGST_rate) : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST ? Number(item.SGST) * Number(item.qty) : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST_rate ? Number(item.CGST_rate) : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST ? Number(item.CGST) * Number(item.qty) : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST_rate ? Number(item.IGST_rate) : ""} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST ? Number(item.IGST) * Number(item.qty) : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxPercent( item.CGST_rate, item.SGST_rate, item.IGST_rate )} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)} </td>
                  <td className="border p-0 m-0 align-middle"> {item.disc_mrp ? item.disc_mrp : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.total_amount ? item.total_amount : ""} </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className=" text-center fw-bold text-charcoal"> No Vaccines Found </p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}
function SaleReturns(props) {
  const currentDate = useContext(TodayDate);
  const ClinicID = props.ClinicID;
  const fromdate = props.fromdate;
  const todate = props.todate;
  const url = useContext(URL);
  const [sridw, setsridw] = useState("none");
  const [Loading, setLoading] = useState(false);
  const [salereturnarr, setsalereturnarr] = useState([]);
  const [salereturnarrExcel, setsalereturnarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [nref, setnref] = useState("none");

  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();

  function GetPages() {
    try {
      axios
        .get(
          `${url}/sale/return?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }
  function GETSaleReturns(Data) {
    if (Data == undefined || Data.selected == undefined) {
      try {
        axios
          .get(
            `${url}/sale/return?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate
            }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
          )
          .then((response) => {
            ;
            setsalereturnarr(response.data.data.sale_return);

            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      try {
        axios
          .get(
            `${url}/sale/return?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25
            }&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate
            }`
          )
          .then((response) => {
            ;
            setsalereturnarr(response.data.data.sale_return);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
  function GETSaleReturnsForExcel() {
    setLoading(true);
    try {
      axios
        .get(
          `${url}/sale/return?clinic_id=${ClinicID}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          ;
          setpagecount(response.data.data.total_count);
          setsalereturnarrExcel(response.data.data.sale_return);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [fromdate, todate]);

  useEffect(() => {
    GETSaleReturns();
    GETSaleReturnsForExcel();
  }, [pagecount]);

  const toggle_sridw = () => {
    if (sridw === "none") {
      setsridw("block");
    }
    if (sridw === "block") {
      setsridw("none");
    }
  };
  const toggle_nref = () => {
    if (nref === "none") {
      setnref("block");
    }
    if (nref === "block") {
      setnref("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  return (
    <>
         <div className="col-auto position-absolute p-0 m-0 export align-self-center text-center ms-3">
            <ExportSaleReturn salereturnarr={salereturnarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
          </div>
      <button className="button addentrypurchase button-charcoal position-absolute end-0 me-3" onClick={toggle_nref} >
        <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0"/> Entry Return </button>
      <div classsName="p-0 m-0">
            <h2 className=" p-0 m-0 heading text-charcoal fw-bolder ms-3  " style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Sale Returns" : "Sale Return"}{" "} </h2>
 
        <div className="scroll scroll-y overflow-scroll p-0 m-0" style={{ minHeight: "40vh", height: "59vh", maxHeight: "70vh" }} >
          <table className="table text-start p-0 m-0">
            <thead className="p-0 m-0 align-middle">
              <tr>
                <th className="fw-bolder text-charcoal75 text-center" scope="col"> Return No. </th>
                <th className="fw-bolder text-charcoal75 text-start" scope="col"> Name </th>
                <th className="fw-bolder text-charcoal75 text-start" scope="col"> Sale Entry ID </th>
                <th className="fw-bolder text-charcoal75 text-start" scope="col"> Return Date </th>
                <th className="fw-bolder text-charcoal75 text-start" scope="col"> Return Amount </th>
                <th className="fw-bolder text-charcoal75 text-center" scope="col"> Inventory </th>
                {/* <th className="fw-bolder text-charcoal75 text-center" scope="col"> more </th> */}
              </tr>
            </thead>
            {Loading ? (
              <body className=" text-center" style={{ minHeight: "55vh" }}>
                <tr className="position-absolute border-0 start-0 end-0 px-5">
                  <div class="d-flex align-items-center">
                    <strong className="fs-5"> Getting Details please be Patient ... </strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
                  </div>
                </tr>
              </body>
            ) : salereturnarr && salereturnarr.length != 0 ? (
              <tbody>
                {
                  salereturnarr.map((item, i) => (
                    <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} >
                      <td className="text-charcoal fw-bold text-center"> SR-{item.return_no} </td>
                      <td className="text-charcoal fw-bold text-start"> {item.sale_entry && item.sale_entry.patient && item.sale_entry.patient.full_name != null ? item.sale_entry.patient.full_name : "N/A"} </td>
                      <td className="text-charcoal fw-bold text-start"> {item.sale_entry && item.sale_entry && item.sale_entry.id != null ? item.sale_entry.id : ""}</td>
                      <td className="text-charcoal fw-bold text-start"> {item.return_date ? reversefunction(item.return_date) : ""} </td>
                      <td className="text-charcoal fw-bold text-start"> {item.grand_total ? item.grand_total : "N/A"} </td>
                      <td className="text-charcoal fw-bold text-center">
                        {/* <button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button> */}
                        <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_sridw(); }} >
                          <img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1"/>
                        </button>
                      </td>
                      {/* <td className="p-0 m-0 text-charcoal text-center fw-bold">
                        <button className="btn position-relative cursor-pointer more p-0 m-0">
                          <img
                            src={process.env.PUBLIC_URL + "/images/more.png"}
                            alt="displaying_image"
                          />
                        </button>
                      </td> */}
                      <td className={` position-absolute d-${i == index ? sridw : "none"} bg-seashell border border-1 start-0 end-0 mx-auto p-0 m-0 rounded-4`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }} >
                        {
                          i == index ? (
                            <SRitemdetailssection salereturnarr={salereturnarr[i]} toggle_sridw={toggle_sridw} />
                          ) : (
                            <></>
                          )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
                <tr className="">
                  <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0"> No Sale Returns </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <div className="container-fluid d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={". . ."}
            pageCount={pages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={GETSaleReturns}
            containerClassName={"pagination"}
            pageClassName={"page-item text-charcoal"}
            pageLinkClassName={
              "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
            }
            previousClassName={"btn button-charcoal-outline me-2"}
            previousLinkClassName={"text-decoration-none text-charcoal"}
            nextClassName={"btn button-charcoal-outline ms-2"}
            nextLinkClassName={"text-decoration-none text-charcoal"}
            breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
            breakLinkClassName={"text-decoration-none text-charcoal"}
            activeClassName={"active"}
          />
        </div>
      </div>
      <section className={`rounded-2 position-absolute start-0 top-0 end-0 mx-auto border shadow bg-seashell d-${nref}`} style={{height:'70vh',width:'60vh'}} >
         {<NewSaleReturnentryform toggle_nref={toggle_nref} GETSaleReturns={GETSaleReturns} />} 
        </section>
    </>
  );
}
function SaleEntryForm(props) {
  const tableref = useRef(null);
  const cliniclist = useContext(Clinic);
  const permission = useContext(Permissions);
  const url = useContext(URL);
  const Doclist = useContext(DoctorsList);
  const clinicID = localStorage.getItem("ClinicId");
  const medicinesref = useRef(null);
  const medbyidref = useRef(null);
  const patientaddref = useRef(null);
  const stockref = useRef(null);
  const [searchinput, setsearchinput] = useState(props.patientname ? props.patientname : "");
  const [searchlist, setsearchlist] = useState([]);
  const [displaysearchlist, setdisplaysearchlist] = useState("none");
  const [patientid, setpatientid] = useState(props.patientid ? props.patientid : "");
  const [patientdata, setpatientdata] = useState([]);
  const [doctorid, setdoctorid] = useState(props.DoctorID ? props.DoctorID : "");
  const [doctorname, setdoctorname] = useState(props.DoctorName ? props.DoctorName : "");
  const [otherdoctor, setotherdoctor] = useState();
  const [clinicid, setclinicid] = useState(clinicID);
  const [ischecked, setischecked] = useState();
  const [ischecked2, setischecked2] = useState();
  const [Dc, setDc] = useState(0);
  const [AtC, setAtC] = useState(0);
  const [load, setload] = useState();
  const [searchload, setsearchload] = useState(false);
  const [products, setproducts] = useState([]);
  const [itemsearch, setitemsearch] = useState([]);
  const [itembyid, setitembyid] = useState([]);
  const [loadbyId, setloadbyId] = useState();
  const [itemname, setitemname] = useState();
  const [itemid, setitemid] = useState();
  const [SelectedProducts, setSelectedProducts] = useState([]);
  const [Grandtotal, setGrandtotal] = useState();
  const [loadsearch, setloadsearch] = useState();
  const [addressid, setaddressid] = useState();
  const [addressform, setaddressform] = useState("none");
  const [number, setnumber] = useState(props.data ? props.data.patient.phone_number ? props.data.patient.phone_number : '' : "")
  const [Response, setResponse] = useState()

  const searchpatient = (e) => {
    setsearchload(true);
    setsearchinput(e.target.value);
    axios
      .get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`)
      .then((response) => {
        setsearchlist(response.data.data.patients_list);
        setsearchload(false);
      });
    if (searchinput && searchinput.length > 1) {
      setdisplaysearchlist("block");
    } else {
      setdisplaysearchlist("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  const get_value = (id, name, data) => {
    setsearchinput(name);
    setpatientid(id);
    setpatientdata(data);
    setnumber(data.phone_number)
    setdisplaysearchlist("none");
  };
  const selectaddress = (data) => {
    if (data) {
      setaddressid(data.id);
      setDc(1);
    } else {
      setaddressid();
      setDc(0);
    }
  };
  const DC = () => {
    if (Dc == 0) {
      setaddressform("block");
    }
    if (Dc == 1) {
      if (addressid) {
        setDc(0);
        setaddressform("none");
      } else {
        setaddressform("block");
      }
    }
  };
  const searchmeds = async (search) => {
    setloadsearch(true);
    try {
      await axios.get(`${url}/stock/list?search=${search}`).then((response) => {
        let medicines = [];
        let vaccines = [];
        let items = [];
        medicines.push(
          response.data.data.medicines ? response.data.data.medicines : []
        );
        vaccines.push(
          response.data.data.vaccines ? response.data.data.vaccines : []
        );
        items = medicines.concat(vaccines);
        items = items.flat();
        setitemsearch(items);
        setloadsearch(false);
        if (search.length > 1) {
          medicinesref.current.style.display = "block";
        } else {
          medicinesref.current.style.display = "none";
        }
      });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
    }
  };
  const searchmedbyId = async (search) => {
    if (search.length > 0) {
      setloadbyId(true);
      try {
        await axios
          .get(`${url}/sale/item/search/by/id?item=${search}`)
          .then((response) => {
            setloadbyId(false);
            setitembyid([response.data.data]);
          });
      } catch (e) {
        setloadbyId(false);
        Notiflix.Notify.failure(e.message);
      }
    }
  };
  useEffect(() => {
    Doclist.map((data) => (data[0] == doctorid ? setdoctorname(data[1]) : ""));
  }, [doctorid]);

  function CalSellingCost(mrp, disc) {
    let cost = mrp;
    if (!disc) {
      cost = Number(mrp);
      return cost;
    } else {
      cost = Number(mrp) - (Number(mrp) * Number(disc)) / 100;
      cost = cost.toFixed(2);
      return cost;
    }
  }
  function CalTotalAmount(qty, cst, realcst) {
    let cost = cst;
    if (Number(realcst) > Number(cost)) {
      Notiflix.Notify.failure("Selling Cost should not less than Cost");
    }
    if (!qty) {
      return 0;
    } else if (qty == 1) {
      cst = Number(cst);
      return cst;
    } else {
      cost = Number(cst) * Number(qty);
      cost = cost.toFixed(2);
      return cost;
    }
  }
  function CalGrandttl() {
    let ttl = 0;
    SelectedProducts.map((data) => (ttl += Number(data.totalamt)));
    setGrandtotal(ttl);
  }
  function CaltotalDiscount(data) {
    let total = 0;
    if (data) {
      data.forEach((item) => {
        total += Number(item.discount);
      });
      return total;
    } else {
      return total;
    }
  }
  useEffect(() => {
    CalGrandttl();
  }, [SelectedProducts]);
  function AddProducts(data) {
    let T = "";
    if (data.vaccine_brand_id) {
      T = "v";
    } else {
      T = "m";
    }
    let ProductDetails = {
      productid: data.id,
      type: data.type ? data.type : T,
      product: data.item_name ? data.item_name : itemname,
      batch: data.batch_no,
      expiry: data.expiry_date,
      quantity: data.current_stock,
      qtytoSale: 1,
      discount: 0,
      cost: data.cost,
      mainmrp: data.mrp,
      disccost: data.mrp,
      gst:
        Number(data.CGST_rate) +
        Number(data.SGST_rate) +
        Number(data.IGST_rate),
      totalamt: data.mrp,
    };

    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails]);
    } else {
      setSelectedProducts((prevState) => [...prevState, ProductDetails]);
    }
  }
  async function DeleteProduct(Batch) {
    let obj = [];
    obj.push(
      SelectedProducts.filter(function (e) {
        return e.batch !== Batch;
      })
    );
    obj = obj.flat();
    setSelectedProducts(obj);
  }
  async function SubmitSaleEntry() {
    let productids = [];
    let proquantity = [];
    let Discount = [];
    let discountonmrp = [];
    let mrp = [];
    let GST = [];
    let Totalamount = [];
    if (doctorname != undefined && doctorname.length > 0 || otherdoctor != undefined && otherdoctor.length > 0) {
      for (let i = 0; i < SelectedProducts.length; i++) {
        productids.push(
          SelectedProducts[i].type + SelectedProducts[i].productid
        );
        proquantity.push(SelectedProducts[i].qtytoSale);
        Discount.push(SelectedProducts[i].discount);
        discountonmrp.push(SelectedProducts[i].disccost);
        mrp.push(SelectedProducts[i].mainmrp);
        GST.push(SelectedProducts[i].gst);
        Totalamount.push(SelectedProducts[i].totalamt);
      }
      let Data = {
        clinic_id: clinicid,
        doctor_id: doctorid,
        doctor_name: doctorid ? doctorname : otherdoctor,
        patient_id: patientid,
        pro_id: productids,
        qty: proquantity,
        discount: Discount,
        disc_mrp: discountonmrp,
        main_mrp: mrp,
        gst: GST,
        total_amount: Totalamount,
        grand_total: Grandtotal,
        appointment_id: "",
        add_to_cart: AtC,
        deliver: Dc,
        address_id: addressid,
      }
      setload(true);
      try {
        await axios
          .post(`${url}/sale/entry/save`, Data).then((response) => {
            setload(false);
            setResponse(response)
            if (props.saleindex == undefined) {
              props.GETSalesList();
              // props.toggle_nsef();
            }
            if (response.data.status == true) {
              Notiflix.Notify.success(response.data.message);
            } else {
              Notiflix.Notify.warning(response.data.message);
            }

          })
          .catch(function error(e) {
            Notiflix.Notify.failure(e.message);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    } else {

      Notiflix.Notify.failure("Please Choose A Doctor to further proceed the sale entry");
    }
  }
  function confirmmessage() {
    customconfirm();
    Notiflix.Confirm.show(
      `Save Sale Entry`,
      `Do you surely want to add total ${SelectedProducts.length} Sale ${SelectedProducts.length <= 1 ? "entry" : "entries"
      }  `,
      "Yes",
      "No",
      () => {
        // SaveSaleEntryCharges()
        SubmitSaleEntry();
        toggleStage4();
        toggleStage3();
      },
      () => {
        return 0;
      },
      {}
    );
  }
  const UpdateStatus = async (e, id) => {
    try {
      await axios
        .post(`${url}/sale/entry/change/status`, {
          sale_entry_id: Response.data.data.id,
          status: 2,
          admin_id: adminid,
        })
        .then((response) => {
          ;
          Notiflix.Notify.success(response.data.message);
          props.GETSalesList();
        });
    } catch (e) {
      Notiflix.Notify.failure(e.message);
    }
  };
  useEffect(() => {
    if (AtC == 1) {
      SubmitSaleEntry();
    }
  }, [AtC]);
  const ClearForm = async () => {
    setSelectedProducts([]);
    setaddressid();
    setitemname();
    setdoctorname();
    setdoctorid();
    setpatientid();
    setGrandtotal();
    setAtC();
    setDc(0);
    setsearchinput();
    setpatientdata();
  };

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
  // Payments
  const adminid = localStorage.getItem("id");
  const [paymentmethods, setpaymentmethods] = useState([{
    paymentmethod: "",
    amount: 0,
  }]);
  const [previoustotal, setprevioustotal] = useState(0);
  const [loading, setloading] = useState();
  const paymentmethoddetails = {
    paymentmethod: "",
    amount: 0,
  };
  // async function AddPaymentMethods() {
  //   let Payments = []
  //   let amounts = []
  //   let allamounts = []
  //   Payments.push(Object.keys(JSON.parse(props.saleentryarr.payment_method_details)))
  //   amounts.push(Object.values(JSON.parse(props.saleentryarr.payment_method_details)))
  //   let paymentobj = []
  //   let p = {
  //     paymentmethod: "",
  //     amount: 0,
  //   }
  //   if (Payments[0]) {
  //     for (let j = 0; j < Payments[0].length; j++) {
  //       allamounts.push((p = { paymentmethod: Payments[0][j], amount: amounts[0][j] }))
  //     }
  //     setpaymentmethods(allamounts)
  //   }
  //   paymentmethods.push(paymentobj)
  // }
  // useEffect(() => {
  //   AddPaymentMethods();
  // }, [])
  function DeletePaymentMethods(i) {
    paymentmethods.splice(i, i);
  }
  const confirmmessage2 = (e) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to add the following Charges and Payments of  ${Response.data.data.id}`,
      "Yes",
      "No",
      () => {
        SaveSaleEntryCharges();

      },
      () => {
        return 0;
      },
      {}
    );
  };
  async function SaveSaleEntryCharges() {
    let PaymentMethod = [];
    let PaymentMethodDetails = [];
    let total_money = 0
    for (let i = 0; i < paymentmethods.length; i++) {
      PaymentMethod.push(paymentmethods[i].amount);
      PaymentMethodDetails.push(paymentmethods[i].paymentmethod);
    }
    let Data = {
      sale_entry_id: Response ? Response.data.data.id : '',
      g_total_main: Response ? Response.data.data.grand_total : '',
      payment_method: PaymentMethodDetails,
      payment_method_main: PaymentMethodDetails,
      payment_method_details: PaymentMethod,
      admin_id: adminid,
    };
    for (let i = 0; i < paymentmethods.length; i++) {
      total_money += Number(paymentmethods[i].amount)
    }
    if (total_money == Math.round(Data.g_total_main)) {

      Notiflix.Notify.success('Payment Successfull')
      try {
        setloading(true);
        await axios
          .post(`${url}/sale/entry/save/charges`, Data)
          .then((response) => {
            if (props.saleindex != undefined) {
              console.log('Run')
            } else {
              props.GETSalesList()
            }
            props.toggle_nsef()

            setpaymentmethods([{
              paymentmethod: "",
              amount: 0,
            }])
            setResponse()
            UpdateStatus()
            ClearForm();
            setloading(false);

            Notiflix.Notify.success(response.data.message);
          });
      } catch (e) {
        setloading(false);
        // Notiflix.Notify.failure(e.message);
      }
    } else {
      Notiflix.Notify.warning('Unsufficent Amount to proceed Payment successfully')
    }
  }
  // useEffect(() => {
  //   SaveSaleEntryCharges()
  // }, [props.saleentryarr])
  const CalPrevTotal = async () => {
    let total = 0;
    paymentmethods && paymentmethods.map((data) => (total += Number(data.amount)));
    setprevioustotal(total);
  };
  useEffect(() => {
    CalPrevTotal();
  }, [props.saleentryarr]);
  

  function AddMethods() {
    if (paymentmethods && paymentmethods.length > 0) {
      setpaymentmethods((prevState) => [...prevState, paymentmethoddetails]);
    } else {
      setpaymentmethods([paymentmethoddetails]);
    }
  }
  // function Return_Amount() {
  //   let totalarr = [];
  //   let total = 0;
  //   let Advance = 0;
  //   if (paymentmethods && paymentmethods !== undefined) {
  //     for (let i = 0; i < paymentmethods.length; i++) {
  //       totalarr.push(Number(paymentmethods[i].amount));
  //     }
  //     totalarr.forEach((item) => {
  //       total += item;
  //     });
  //     if (total > props.saleentryarr.grand_total) {
  //       Advance = total - props.saleentryarr.grand_total;
  //       return Advance;
  //     } else {
  //       return Advance;
  //     }
  //   }

  // }

  const [addresspage, setaddresspage] = useState('none')
  const Toggle_Address = () => {
    if (addresspage == 'block') {
      setaddresspage('none')
    }
    if (addresspage == 'none') {
      setaddresspage('block')
    }
  }

  return (
    <>
      <div className="saleentry rounded-2">
        <div className="shadow-sm">
          <h5 className="text-center fw-bold py-2">New Sale Entry</h5>
          <button className={`btn btn-back position-absolute start-0 top-0 ms-2 d-${stage1 == 'block' ? 'none' : 'block'}`} onClick={() => { Go_Back() }}   ></button>
          <button className="btn btn-close position-absolute end-0 top-0 me-2" onClick={props.toggle_nsef}  ></button>
        </div>
        <div className={`stage1 d-${stage1}`}>
          <div className="container-fluid ps-5 mt-2">
            <div className="order mt-4">
              <div className="patient mt-4">
                <h6 className="m-0 p-0 pb-1 fw-bold text-charcoal75">Patient</h6>
                <input type="text" placeholder="Search Name or Number" className="form-control rounded-1 border-2 border-charcoal75 fw-bold w-auto bg-seashell" value={searchinput ? searchinput : ""} onFocus={() => setsearchload(true)} onChange={searchpatient} />
                <div className={`col-auto d-${displaysearchlist} text-decoration-none searchinput position-absolute rounded-1 shadow bg-pearl px-2`} style={{ width: "max-content", zIndex: "2" }} >
                  {searchload == true || searchinput == undefined ? (
                    <p className="btn text-charcoal75 fs-6 p-0 m-0 ps-1"> Loading...{" "} </p>
                  ) : searchlist.length == 0 ? (
                    <p className="text-danger btn fs-6 p-0 m-0">Patient not found</p>
                  ) : (
                    searchlist.map((data) => (
                      <div className="col-auto ms-1 py-2 bg-pearl text-decoration-none text-charcoal text-start px-1" onClick={() => { get_value(data.id, data.full_name, data); }} style={{ width: "max-content", cursor: 'pointer' }}>
                        <div className=" fw-bold text-charcoal"> {data.full_name} <span className="fw-bold text-charcoal75">{data.phone_number}</span> </div>
                      </div>

                    ))
                  )}
                </div>
              </div>
  
              <div className="row mt-4">
                <div className="doctor col-6">
                  <h6 className="m-0 p-0 pb-1 fw-bold text-charcoal75">Doctor</h6>
                  <select className="col-10 form-control selectdoctor text-charcoal fw-bold rounded-1 border-2 border-charcoal75 w-auto bg-seashell" placeholder="Select Doctor" value={doctorid ? doctorid : ""} onChange={(e) => { setdoctorid(e.target.value); }} >
                    <option className="text-charcoal">Select Doctor</option>
                    {
                      Doclist.map((data, i) => (
                        <option className={`text-charcoal`} key={i} value={data[0]}> {"Dr."} {data[1]} </option>
                      ))
                    }
                  </select>
                </div>
                <div className="anotherdoctor col-6">
                  <h6 className="m-0 p-0 pb-1 fw-bold text-charcoal75"> Another Doctor</h6>
                  <input type="text" placeholder="Type Name" className="form-control rounded-1 fw-bold text-charcoal border-2 border-charcoal75 w-auto bg-seashell" value={otherdoctor ? otherdoctor : ""} onChange={(e) => { setotherdoctor(e.target.value); }} />
                </div>
              </div>

              {/* <button className="button-sm button-charcoal rounded-1 my-2">Add Doctor</button> */}
            </div>
          </div>
          <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
            <div className="row p-0 m-0">
              <div className="col-8">
                <div className="row">
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> {" "} Order Total{" "} </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3"> {Grandtotal} </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Discount %
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {CaltotalDiscount(SelectedProducts)}
                    </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Total Items
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {SelectedProducts.length}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-4 align-self-center d-flex justify-content-end">

                <button className="button button-charcoal px-5" onMouseDown={() => { toggleStage2(); }} onMouseUp={() => { toggleStage1() }} > Next </button>

              </div>
            </div>
          </div>
        </div>
        <div className={`stage2 d-${stage2}`}>
          <div className="container-fluid mt-4 text-center p-0 m-0">
            <div className="col-12 p-0 m-0 justify-content-center">
              <h6 className="text-charcoal75 p-0 m-0 fw-bolder text-start ms-3"> Add Products </h6>
              <div className="row p-0 m-0 my-2 justify-content-start">
                <div className="col-4">
                  <input className="form-control fw-bold border-charcoal75 border-2 rounded-1 bg-seashell" placeholder="Search Product by Name" value={itemname ? itemname : ""} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemid(); setproducts(); stockref.current.style.display = "none"; }} />
                  <div ref={medicinesref} className="position-absolute rounded-1 mt-1" style={{ Width: "max-content", zIndex: "1" }} >
                    {
                      itemsearch ? (
                        loadsearch ? (
                          <div className="rounded-1 p-1 bg-pearl">
                            Searching Please wait....
                            <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                              <span className="sr-only"> </span>
                            </div>
                          </div>
                        ) : loadsearch == false && itemsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-1 p-1"> Oops! Not Avaliable </div>
                        ) : (
                          <div className={`rounded-4 scroll border border-1 bg-pearl p-1 d-${itemsearch && itemsearch.length > 0 ? "block" : "none"}`} style={{ height: '30vh' }} >
                            <p className={`text-start p-2 position-sticky top-0 bg-pearl fw-bold text-charcoal75 ms-2`} style={{ fontSize: "0.8rem" }} > {itemsearch.length} Search Results </p>
                            {
                              itemsearch.map((data, i) => (
                                <div style={{ cursor: "pointer", Width: "10rem" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} text-start fw-bold p-2 border-bottom text-charcoal `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = "block"; }} > {data.display_name ? data.display_name : data.name} <span className='text-burntumber fw-bold rounded-2 px-1'>{data && data.stock_info !== undefined ? data.stock_info.length : ""} stocks</span> </div>
                              ))
                            }
                          </div>
                        )
                      ) : (
                        <div className="bg-seashell"></div>
                      )}
                  </div>
                  <div ref={stockref} className={`position-absolute start-50 mt-1 bg-pearl scroll scroll-y align-self-center rounded-2 border border-1 p-2 d-${products && products.stock_info && products.stock_info !== undefined ? "block" : "none"}`} style={{ zIndex: "2", width: "10rem", 'min-height': "30vh", }} >
                    <p className={`text-start fw-bold text-charcoal75`} style={{ fontSize: "0.8rem" }} > {products && products.stock_info !== undefined ? products.stock_info.length : ""}{" "} Batch Stocks </p>
                    {
                      products && products.length != 0 ? (
                        products.stock_info.length == 0 ? (
                          <div className="bg-burntumber text-white fw-bold p-2">Oops! Not Available</div>
                        ) : (
                          products.stock_info.map((data, i) => (
                            <div style={{ cursor: "pointer", Width: "max-content" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} border-bottom text-wrap`} onClick={() => { AddProducts(data); setitemname(); setitemid(); setproducts(); setitemsearch(); }} >
                              <p className="text-start m-0 p-0 fw-bold">{itemname}</p>
                              <p className="text-start p-0 m-0 "> BatchNo. -{" "} {data.batch_no && data.batch_no !== null ? data.batch_no : ""} </p>
                              <p className="text-start p-0 m-0 "> Stock -{" "} {data.current_stock && data.current_stock ? data.current_stock : ""} </p>
                              <p className="text-start p-0 m-0 "> Expiry Date -{" "} {data.expiry_date ? reversefunction(data.expiry_date) : ""} </p>
                            </div>
                          ))
                        )
                      ) : (
                        <div className="bg-seashell p-2">Not Avaliable</div>
                      )
                    }
                  </div>
                  <div>
                  </div>
                </div>
                <div className="col-1 text-burntumber fw-bold align-self-center">
                  OR
                </div>
                <div className="col-4 ">
                  <input className="form-control bg-seashell border-charcoal75 border-2 rounded-1 fw-bold" value={itemid ? itemid : ""} placeholder="Search Product by ID" onChange={(e) => { searchmedbyId(e.target.value); setitemid(e.target.value); medbyidref.current.style.display = "block"; }} />
                  <div ref={medbyidref} className="position-absolute rounded-1 mt-1" style={{ Width: "max-content", zIndex: "2" }} >
                    {itembyid ? (
                      loadbyId ? (
                        <div className="rounded-1 p-1 bg-pearl"> Searching Please wait.... 
                        <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" > 
                        <span className="sr-only"> </span>{" "} </div> </div>
                      ) : loadbyId == false && itembyid.length == 0 ? (
                        <div className="bg-burntumber text-light rounded-1 p-1"> Oops! Not Avaliable </div>
                      ) : (
                        itembyid.map((data, i) => (
                          <div style={{ cursor: "pointer", Width: "max-content" }} className={`p-0 p-1 rounded-pill shadow bg-${i % 2 == 0 ? "pearl" : "seashell"} fs-6 `} onClick={(e) => { setitemid(data.type + data.id); AddProducts(data); medbyidref.current.style.display = "none"; }} > {data.item_name ? data.item_name : ""} </div>
                        ))
                      )
                    ) : (
                      <div className="bg-seashell"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 m-0 p-0 mt-5">
              <div className="d-flex p-0 m-0 justify-content-between">
                <h6 className="text-charcoal75 p-0 m-0 fw-bolder text-start ms-3">
                  Product Added
                </h6>
              </div>

              <div className="p-0 m-0 scroll scroll-y" style={{ height: "35vh" }}>
                <table className="table p-0 m-0">
                  <thead className="p-0 m-0">
                    <tr className={`p-0 m-0 `}>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item ID </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item Name </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> BatchNo. </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Expiry Date </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Avl.Stock </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Qty To Sale </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Discount % </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" colSpan="4" scope="col-group"> Costing </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Total Amount </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Delete </th>
                    </tr>
                    <tr className="p-0 m-0">
                      <th className="p-0 m-0 px-2 text-charcoal75" scope="col"> MRP </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" scope="col"> Cost </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" scope="col"> GST Rate </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" scope="col"> Selling Cost/Unit </th>
                    </tr>
                  </thead>
                  {SelectedProducts && SelectedProducts.length !== 0 ? (
                    <tbody className="p-0 m-0">
                      {SelectedProducts.map((data) => (
                        <tr className={`p-0 m-0 align-middle text-charcoal fw-bold bg-${Number(data.disccost) < Number(data.cost) ? "lightred50" : ""}`} >
                          <td>{data.type} {data.productid} </td>
                          <td>{data.product}</td>
                          <td>{data.batch}</td>
                          <td>{reversefunction(data.expiry)}</td>
                          <td>{data.quantity}</td>
                          <td>
                            <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell" value={data.qtytoSale ? data.qtytoSale : ""} onChange={(e) => { e.target.value <= data.quantity ? (data.qtytoSale = e.target.value) : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available"); data.totalamt = CalTotalAmount(data.qtytoSale, data.disccost); setSelectedProducts((prevState) => [...prevState]); }} />{" "}
                          </td>
                          <td className="text-center p-0 m-0" style={{ Width: "0rem" }} >
                            <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell" value={data.discount ? data.discount : ""} onChange={(e) => { data.discount = e.target.value; data.disccost = CalSellingCost(data.mainmrp, e.target.value); data.totalamt = CalTotalAmount(data.qtytoSale, Number(data.disccost), Number(data.cost)); setSelectedProducts((prevState) => [...prevState]); }} />{" "}
                          </td>
                          <td>{data.mainmrp}</td>
                          <td>{data.cost}</td>
                          <td>{data.gst + "%"}</td>
                          <td>{data.disccost}</td>
                          <td>{data.totalamt}</td>
                          <td>
                            <button className="btn p-0 m-0" onClick={() => { DeleteProduct(data.batch); }} >
                              <img src={process.env.PUBLIC_URL + "images/delete.png"} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="p-0 m-0 position-relative">
                      <tr className="p-0 m-0">
                        <td className="p-0 m-0 position-absolute text-charcoal75 fw-bold start-0 end-0"> No Product Added </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
            <div className="row p-0 m-0">
              <div className="col-8">
                <div className="row">
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> {" "} Order Total{" "} </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3"> {Grandtotal} </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Discount %
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {CaltotalDiscount(SelectedProducts)}
                    </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Total Items
                    </p>
                    <h4 className="text-charcoal p-0 m-0 fw-bolder card-header text-start ps-3">
                      {SelectedProducts.length}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-4 align-self-center d-flex justify-content-end">
                <button className="button button-charcoal px-5" onMouseDown={() => { toggleStage3(); }} onMouseUp={() => { toggleStage2() }} > + Address </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`stage3 d-${stage3} `}>
          <div className="row align-items-center p-0 m-0 pt-2">
            <div className="col-auto">
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal75">Patient Details</h6>
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal">Name:{searchinput}</h6>
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal">Phone:{number != undefined ? number : ''}</h6>
            </div>
          </div>
          <hr className="my-1" />
          <div className="container mt-4 position-relative " >
            <h6 className="fw-bold text-charcoal75">Select Shipping Address</h6>
            {
              props.data != undefined && patientdata != undefined && patientdata.length == 0 ? (
                props.data && props.data.patient && props.data.patient.address && props.data.patient.address.length !== 0 ? (
                  <div className="overflow-scroll " style={{ height: '30vh' }}>
                    {
                      props.data.patient.address.map((data, i) => (
                        <>
                          <input type="checkbox" className="form-check-input" checked={ischecked2 === i ? true : false} name={data.id} onClick={(e) => { setischecked2(i); addressid ? selectaddress() : selectaddress(data); }} /> <h6 className="fw-bold text-charcoal d-inline-block">{data.address_line1 && data.address_line1 !== null ? data.address_line1 : ""} {data.address_line2 && data.address_line2 !== null ? data.address_line2 : ""} {data.zip_code && data.zip_code !== null ? data.zip_code : ""}</h6>
                          <br />
                        </>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-danger fw-bold p-2"> Addresses not found.Please add a new address{" "} </div>
                )
              ) : (<></>)
            }
            {
              patientdata && patientdata.address != undefined ? (
                patientdata != undefined && patientdata.address.length == 0 ? (
                  <div className="text-danger fw-bold p-2"> Addresses not found.Please add a new address{" "} </div>
                ) : (
                  <div className="overflow-scroll" style={{ height: '30vh' }}>
                    {
                      patientdata.address.map((data, i) => (
                        <>
                          <input type="checkbox" className="form-check-input" checked={ischecked2 === i ? true : false} name={data.id} onClick={(e) => { setischecked2(i); addressid ? selectaddress() : selectaddress(data); }} /> <h6 className="fw-bold text-charcoal d-inline-block">{data.address_line1 && data.address_line1 !== null ? data.address_line1 : ""} {data.address_line2 && data.address_line2 !== null ? data.address_line2 : ""} {data.zip_code && data.zip_code !== null ? data.zip_code : ""}</h6>
                          <br />
                        </>
                      ))
                    }
                  </div>
                )
              ) : (<></>)
            }



            <div className="button button-charcoal" onClick={() => Toggle_Address()}>Add Address</div>
            <div className={`container position-absolute bg-seashell w-75 border border-1 shadow-sm rounded-2 start-0 end-0 d-${addresspage}`} style={{ top: '-3rem' }}>
              <AddAddress Toggle_Address={Toggle_Address} patientid={patientid} searchinput={searchinput} setpatientdata={setpatientdata} />
            </div>
          </div>
          <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
            <div className="row p-0 m-0">
              <div className="col-8">
                <div className="row">
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> {" "} Order Total{" "} </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3"> {Grandtotal} </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      Discount %
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {CaltotalDiscount(SelectedProducts)}
                    </h4>
                  </div>
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> Total Items </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {SelectedProducts.length}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-4 align-self-center d-flex justify-content-end">
                <button className="button button-charcoal px-5" onClick={() => { confirmmessage(); }}  > + Payment </button>

              </div>
            </div>
          </div>
        </div>
        <div className={`stage4 d-${stage4}`}>
          <div className="row align-items-center p-0 m-0 pt-2">
            <div className="col-auto">
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal75">Patient Details</h6>
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal">Order Id:{Response != undefined ? Response.data.data.id : ''}</h6>
            </div>
            <div className="col-auto">
              <h6 className="fw-bold text-charcoal">Phone:{number != undefined ? number : ''}</h6>
            </div>
          </div>
          <hr className="my-1" />
          <div className="container">
            <h6 className="text-charcoal75 fw-bold">Total Amount Due</h6>
            <h1 className="fw-bold text-charcoal">₹{Response != undefined ? Math.round(Response.data.data.grand_total) : 0}</h1>
          </div>
          <div className="container-fluid text-start position-relative scroll scroll-y" style={{ height: '35vh' }}>
            {/* <div className={`d-${previoustotal == props.saleentryarr.grand_total ? "" : "none"} bg-lightgreen fw-bold text-center p-2 my-2`} > Payment Done </div> */}
            {/* <h6 className="text-charcoal fw-bolder text-center">Payments</h6> */}
            {/* <h6 className="text-burntumber fw-bolder text-center">{Return_Amount() > 0 ? `Amount Exceeded by ${Return_Amount()}` : ""}</h6> */}
            {
              paymentmethods && paymentmethods !== undefined ? (
                paymentmethods.map((data, i) =>
                  permission.sale_entry_charges_edit == 1 ? (
                    <>
                      <div className="container mt-4">
                        <div className="row align-items-center">
                          <div className="col-10">
                            <h6 className="text-charcoal75 fw-bold">Enter Amount</h6>
                            <input type="number" placeholder="₹00" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} className="form-control rounded-1 fw-bold text-charocoal75 bg-seashell w-25 border-2" />
                          </div>
                          <div className="col-2">
                            <button className={`btn btn-sm p-0 m-0 d-${i == 0 ? 'none' : 'block'}`} onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                              <img src={process.env.PUBLIC_URL + "/images/minus.png"} className="img-fluid" style={{ width: "1.8rem" }}/>
                            </button>
                          </div>
                        </div>
                      </div >
                      <h6 className="text-charcoal75 fw-bold mt-2 ms-2">Select Payment Method</h6>
                      <div className="d-flex flex-horizontal ms-2 mt-2 scroll scroll-y">
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Cash'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Cash' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Cash' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Cash</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Card'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Card' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Card' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Card</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Paytm'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Paytm' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Paytm' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Paytm</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Phonepe'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Phonepe' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Phonepe' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Phonepe</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Razorpay'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Razorpay' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Razorpay' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Razorpay</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Wire-Transfer'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Wire-Transfer' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Wire-Transfer' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Wire-Transfer</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Points'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Points' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Points' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Points</h6></span>
                        <input type="checkbox" className="form-check-input border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Adjust-Advance'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Adjust-Advance' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Adjust-Advance' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Adjust-Advance</h6></span>

                      </div>
                    </>
                  ) :
                    (
                      <>
                        <div className="container mt-4">
                          <div className="row align-items-center">
                            <div className="col-10">
                              <h6 className="text-charcoal75 fw-bold">Enter Amount</h6>
                              <input type="number" placeholder="₹00" value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods((prevState) => [...prevState]); }} className="form-control rounded-1 fw-bold text-charocoal75 bg-seashell w-25 border-2" />
                            </div>
                            <div className="col-2">
                              <button className={`btn btn-sm p-0 m-0 d-${i == 0 ? 'none' : 'block'}`} onClick={() => { DeletePaymentMethods(i); setpaymentmethods((prevState) => [...prevState]); }} >
                                <img src={process.env.PUBLIC_URL + "/images/minus.png"} className="img-fluid" style={{ width: "1.8rem" }} />
                              </button>
                            </div>
                          </div>
                        </div >
                        <h6 className="text-charcoal75 fw-bold mt-2 ms-2">Select Payment Method</h6>
                        <div className="d-flex flex-horizontal ms-2 mt-2 scroll scroll-y">
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Cash'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Cash' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Cash' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Cash</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Card'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Card' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Card' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Card</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Paytm'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Paytm' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Paytm' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Paytm</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Phonepe'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Phonepe' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Phonepe' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Phonepe</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Razorpay'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Razorpay' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Razorpay' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Razorpay</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Wire-Transfer'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Wire-Transfer' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Wire-Transfer' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Wire-Transfer</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Points'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Points' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Points' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Points</h6></span>
                          <input type="checkbox" disabled className="form-check-input bg-seashell border-charcoal p-2 mt-1" onChange={() => { data.paymentmethod = 'Adjust-Advance'; setpaymentmethods((prevState) => [...prevState]); }} checked={'Adjust-Advance' == data.paymentmethod ? true : false} onClick={(e) => { ischecked != undefined ? setischecked() : setischecked(e.target.value); }} value='Adjust-Advance' /><span><h6 className="d-block text-charcoal fw-bold pt-1 ms-2 me-5">Adjust-Advance</h6></span>

                        </div>
                      </>
                    )
                )
              ) : (
                <></>
              )
            }
            <div className={`container-fluid text-center mt-2  `}>
              {
                permission.sale_entry_charges_edit == 1 ? (
                  <button className="btn py-0" onClick={AddMethods}>
                    <img src={process.env.PUBLIC_URL + "/images/add.png"} className="img-fluid" style={{ width: "1.8rem" }} />
                  </button>
                ) : (
                  <></>
                )}
            </div>
          </div>
          <div className="w-100 position-absolute bottom-0 bg-pearl py-2 bottom_bar">
            <div className="row p-0 m-0">
              <div className="col-8">
                <div className="row">
                  <div className="col-4">
                    <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> {" "} Order Total{" "} </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">₹{Response != undefined ? Math.round(Response.data.data.grand_total) : 0} </h4>
                  </div>
                  <div className="col-4">
                    {/* <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Discount %
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {CaltotalDiscount(SelectedProducts)}
                    </h4> */}
                  </div>
                  <div className="col-4">
                    {/* <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                      {" "}
                      Total Items
                    </p>
                    <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                      {SelectedProducts.length}
                    </h4> */}
                  </div>
                </div>
              </div>
              <div className="col-4 align-self-center d-flex justify-content-end">
                <button className="button button-charcoal px-5" onClick={() => confirmmessage2()} > Sale </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
function NewSaleReturnentryform(props) {
  const url = useContext(URL);
  const medicinesref = useRef(null);
  const vendorsref = useRef(null);
  const [billname, setbillname] = useState();
  const [billid, setbillid] = useState();
  const [loadbills, setloadbills] = useState();
  const [billsearch, setbillsearch] = useState([""]);
  const [itemsearch, setitemsearch] = useState([""]);
  const [itemname, setitemname] = useState("");
  const [load, setload] = useState();
  const [MedicineentriesArr, setMedicineentriesArr] = useState([]);

  const CalculateCost = (cost, currentstock, qtytotreturn) => {
    let costing = 0;
    if (cost && qtytotreturn && currentstock >= qtytotreturn) {
      costing = 0;
      costing = Number(cost) * Number(qtytotreturn);
      return costing.toFixed(2);
    } else {
      return cost;
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  async function InsertMedicines(data) {
    let MedicineentriesObj = {
      Itemid: data.id,
      Type: data.type,
      Item: data.item_name,
      batchno: data.batch_no,
      expirydate: data.expiry_date,
      cost: data.sale_disc_mrp,
      totalcost: data.sale_disc_mrp,
      saleqty: data.sale_qty,
      qtytoReturn: data.sale_qty,
    };

    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr([MedicineentriesObj]);
      setitemname();
    } else {
      setMedicineentriesArr((prevState) => [...prevState, MedicineentriesObj]);
      setitemname();
    }
  }

  const searchProduct = async () => {
    medicinesref.current.style.display = "block";
    setloadbills(true);
    try {
      await axios
        .get(
          `${url}/sale/return/item/search/by/id?item=${itemname}&bill_id=${billid}`
        )
        .then((response) => {
          ;
          setbillsearch([response.data.data]);

          setloadbills(false);
        })
        .catch(function (error) {
          if (error.response) {
            Notiflix.Notify.failure(error.response.data);
            Notiflix.Notify.failure(error.response.status);
            Notiflix.Notify.failure(error.response.headers);
          }
          setloadbills(false);
        });
    } catch (e) {
      Notiflix.Notify.failure(e);
      setloadbills(false);
    }
  };
  const SaveReturnEntry = async () => {
    let ProductId = [];
    let Totalamount = [];
    let quantity = [];

    let grosstotal = 0;
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      ProductId.push(
        MedicineentriesArr[i].Itemid
          ? `${MedicineentriesArr[i].Type}${MedicineentriesArr[i].Itemid}`
          : ""
      );
      Totalamount.push(
        MedicineentriesArr[i].totalcost ? MedicineentriesArr[i].totalcost : ""
      );
      quantity.push(
        MedicineentriesArr[i].qtytoReturn
          ? MedicineentriesArr[i].qtytoReturn
          : ""
      );
    }

    Totalamount.forEach((item) => {
      grosstotal += Number(item);
    });

    var Data = {
      bill_id: billid,
      pro_id: ProductId,
      qty: quantity,
      total_amount: Totalamount,
      grand_total: grosstotal,
    };
    setload(true);
    try {
      await axios.post(`${url}/sale/return/save`, Data).then((response) => {
        Notiflix.Notify.success(response.data.message);
        props.GETSaleReturns();
        setMedicineentriesArr();
        setbillid();
        setbillname();
        setload(false);
        props.toggle_nref();
      });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);
    }
  };

  function confirmmessage() {
    customconfirm();
    Notiflix.Confirm.show(
      `Save Purchase Return `,
      `Do you surely want to add total ${MedicineentriesArr.length} Sale ${MedicineentriesArr.length <= 1 ? "Return " : "Returns"
      } of Bill P-${billid} `,
      "Yes",
      "No",
      () => {
        SaveReturnEntry();
      },
      () => {
        return 0;
      },
      {}
    );
  }

  async function DeleteMedicine(id) {
    let obj = [];
    obj.push(
      MedicineentriesArr.filter(function (e) {
        return e.Itemid !== id;
      })
    );
    obj = obj.flat();
    setMedicineentriesArr(obj);
  }
  function Grand() {
    let c = 0;
    if (MedicineentriesArr && MedicineentriesArr.length > 0) {
      MedicineentriesArr.map((data) => (c += Number(data.totalcost)));
    }
    return c;
  }
  return (
    <div className="p-0 m-0 ">
      <div className="shadow-sm">
          <h5 className="text-center fw-bold py-2"> New Sale Return Entry </h5>
          <button type="button" className="btn-close closebtn position-absolute end-0 me-3" onClick={props.toggle_nref} disabled={load ? true : false} aria-label="Close" ></button>
        </div>
        <div className="container-fluid p-0 m-0 w-100 entrydetails bg-seashell mt-4">
          <div className="row p-0 m-0 justify-content-end">
            <div className="col-5">
              <h6 className="p-0 m-0 ms-3 fw-bold">Select Bill</h6>
              <input className="form-control ms-2 rounded-1 bg-seashell" placeholder="Bill Id (Does not require initials)" value={billid ? billid : ""} onChange={(e) => { setbillid(e.target.value); setMedicineentriesArr([]); }} />
            </div>
            <div className="col-5">
              <div className="position-relative">
                <h6 className="p-0 m-0 ms-3 fw-bold">Product ID</h6>
                <input className="form-control bg-seashell" placeholder="Product Id (Require initials)" value={itemname ? itemname : ""} onChange={(e) => { billid ? setitemname(e.target.value) : Notiflix.Notify.failure("Please Add Bill id First"); medicinesref.current.style.display = "block"; }} />
                <div
                  ref={medicinesref}
                  className="position-absolute rounded-1 bg-pearl col-12"
                  style={{ zIndex: "1" }}
                >
                  {billsearch ? (
                    loadbills ? (
                      <div className="rounded-1 p-1">
                        Searching Please wait....
                        <div
                          className="spinner-border my-auto"
                          style={{ width: "1rem", height: "1rem" }}
                          role="status"
                        >
                          <span className="sr-only"> </span>{" "}
                        </div>
                      </div>
                    ) : billsearch.length == 0 ? (
                      <div className="bg-burntumber text-light rounded-1 p-1">
                        Oops! Not Avaliable
                      </div>
                    ) : (
                      billsearch.map((data, i) => (
                        <div style={{ cursor: "pointer" }} className={`p-0 ps-1 shadow bg-${i % 2 == 0 ? "pearl" : "lightyellow" } fs-6 `} name={data.id} onClick={(e) => { setitemname(data.item_name); InsertMedicines(data); medicinesref.current.style.display = "none"; }} > {data.item_name} </div>
                      ))
                    )
                  ) : (
                    <div className="bg-seashell"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-2 align-self-center ">
              <p></p>
              <button className="p-0 m-0 btn" onClick={searchProduct}> <img src={process.env.PUBLIC_URL + "images/search.png"} /> </button>
            </div>
          </div>
          <h6 className="text-start fw-bold text-charcoal p-0 m-0 ms-4 mt-4"> Items To Return </h6>
          <div className=" p-0 m-0 mt-2 scroll scroll-y" style={{ height: "40vh", zIndex: "2" }} >
            <table className="table datatable text-center position-relative">
              <thead className="text-charcoal75 fw-bold">
                <tr>
                  <th className="px-2">Stock ID</th>
                  <th className="px-2">Item Name</th>
                  <th className="px-2">batch No.</th>
                  <th className="px-2">Expiry Date</th>
                  <th className="px-2">Sale Qty</th>
                  <th className="px-2">Qty to Return</th>
                  <th className="px-2">Sale Rate/Unit</th>
                  <th className="px-2">Sale Rate</th>
                  <th className="px-2">Delete</th>
                </tr>
              </thead>
              {MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                  <tbody className="position-relative" style={{ height: "40vh", color: "var(--charcoal)", fontWeight: "600", }} >
                    <tr className="">
                      <td className="position-absolute start-0 end-0 top-0 text-center mx-auto">
                        No items Added
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="align-middle" style={{ height: "40vh", color: "var(--charcoal)", fontWeight: "600", }} >
                    {MedicineentriesArr.map((item, _key) => (
                      <tr key={_key} className="">
                        <td> {item.Type} {item.Itemid} </td>
                        <td>{item.Item}</td>
                        <td>{item.batchno}</td>
                        <td>{reversefunction(item.expirydate)}</td>
                        <td>{item.saleqty}</td>
                        <td className="p-0 m-0" style={{ width: "0px", height: "0px" }} >
                          <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell  mt-2" value={item.qtytoReturn ? item.qtytoReturn : ""} onChange={(e) => { e.target.value <= item.saleqty ? (item.qtytoReturn = e.target.value) : Notiflix.Notify.failure( "Quantity Cannot be Greater then Current Stock Available" ); item.totalcost = CalculateCost( item.cost, item.saleqty, e.target.value ); setMedicineentriesArr((prevState) => [ ...prevState, ]); }} />
                        </td>
                        <td>{item.cost}</td>
                        <td>{item.totalcost}</td>
                        <td>
                          <button onClick={() => { DeleteMedicine(item.Itemid); }} className="btn p-0 m-0" > <img className="img-fluid" src={process.env.PUBLIC_URL + '/images/delete.png'}/> </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )
                }
            </table>
          </div>
        </div>
      <div className="col-12 position-absolute start-0 end-0 bottom-0 text-center bg-pearl  border border-1 py-3 bottom_bar">
        <div className="row p-0 m-0">
          <div className="col-6">
            <div className="row">
              <div className="col-auto">
                <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                  {" "}
                  Order Total{" "}
                </p>
                <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                  {Grand()}
                </h4>
              </div>
              <div className="col-auto">
                <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3">
                  {" "}
                  Total Items
                </p>
                <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                  {MedicineentriesArr ? MedicineentriesArr.length : 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-6 align-self-center">
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button className="button button-charcoal px-5" onClick={confirmmessage} > Proceed Return </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function SRitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst && igst !== null) || undefined) {
      let c = Number(cgst) + Number(sgst) + Number(igst);
      return c * Number(qty);
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  return (

    <div className="container-fluid p-0 m-0 ">
      <div className="container-fluid p-0 m-0">
        <div className="row p-0 m-0 position-relative">
          <h5 className="text-center text-charcoal pt-3"> {props.itembillid} Sale Return Item Details </h5>
          <button type="button" className="btn-close closebtn m-auto position-absolute end-0 me-4" onClick={props.toggle_sridw} aria-label="Close" ></button>
          <div className="col-2 d-none">
            <div className=" position-relative searchbutton" style={{ top: "0.25rem", right: "1rem" }} >
              <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
              <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }} > <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /> </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? "charcoal" : "seashell" }`} onClick={() => { setindex(i); }} > {data} </button>
        ))}
      </div>

      <div className="row justify-content-end me-5">
        <div className="col-3">
          <input type="checkbox" className="form-check-input" value={Taxon ? Taxon : ""} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true); }} />
          <label>Show Tax Details</label>
        </div>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ height:'100%' }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP in Rs. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Selling Cost </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Discount% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total in Rs. </th>
              {/* <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th> */}
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > CGST in Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > SGST in Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"}`} > IGST in Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total in Rs. </th>
            </tr>
          </thead>
          {props.salereturnarr.sale_medicines &&
            props.salereturnarr.sale_medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.salereturnarr.sale_medicines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle"> {item.medicine_stocks && item.medicine_stocks.id !== null ? "m" + item.medicine_stocks.id : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.medicine && item.medicine.name !== null ? item.medicine.name : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.medicine_stocks.batch_no && item.medicine_stocks.batch_no != null ? item.medicine_stocks.batch_no : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.medicine_stocks.expiry_date && item.medicine_stocks.expiry_date != null ? reversefunction(item.medicine_stocks.expiry_date) : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.main_mrp ? item.main_mrp : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.disc_mrp ? item.disc_mrp : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.discount ? item.discount : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST_rate ? item.SGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST ? Number(item.SGST) * Number(item.qty) : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST_rate ? item.CGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST ? Number(item.CGST) * Number(item.qty) : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST_rate ? item.IGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST ? Number(item.IGST) * Number(item.qty) : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxPercent( item.CGST_rate, item.SGST_rate, item.IGST_rate )} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)} </td>
                  <td className="border p-0 m-0 align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
                  {/* <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td> */}
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred">
                <strong className="fs-5 text-center bg-lightred">
                  No Medicines Found
                </strong>
              </div>
            </body>
          )}
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ height:"100%"}} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
            <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP in Rs. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate in Rs. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className={`border p-0 m-0 px-1`} > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost in Rs. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total in Rs. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Print QR </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST in Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST in Rs. </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total in Rs. </th>
            </tr>
          </thead>
          {props.salereturnarr.purchase_vaccines &&
            props.salereturnarr.purchase_vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.salereturnarr.purchase_vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                   <td className="border p-0 m-0 align-middle"> {item.vaccine_stocks && item.vaccine_stocks.id !== null ? "v" + item.vaccine_stocks.id : ""} </td>
                  <td className="border p-0 m-0 align-middle"> {item.vaccine && item.vaccine.name !== null ? item.vaccine.name : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.batch_no && item.batch_no != null ? item.batch_no : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.mrp ? item.mrp : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.rate ? item.rate : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.discount ? item.discount : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.trade_discount ? item.trade_discount : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST_rate ? item.SGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST ? item.SGST : "N/A"} </td> 
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST_rate ? item.CGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST ? item.CGST : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST_rate ? item.IGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST ? item.IGST : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxPercent( item.CGST_rate, item.SGST_rate, item.IGST_rate )} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxRate(item.CGST, item.SGST, item.IGST)} </td>
                  <td className="border p-0 m-0 align-middle"> {item.cost ? item.cost : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> <button className="btn"> <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" className="me-1" /> </button> </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <strong className="fs-6 text-center">No Vaccines Found</strong>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}
export { Salesection };
export { SaleEntryForm };

//  ---------------------------------------------------------------purchase-----------------------------------------------------------------------------------------
function Purchasesection(props) {
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [channel, setchannel] = useState(1);
  const permission = useContext(Permissions);
  const [pageindex,setpageindex] =useState("Purchase Entry")
  const first = [
    {
      option: "Purchase Entry",
      display: permission.purchase_entry_view,
    },
    {
      option: "Purchase Returns",
      display: permission.purchase_return_view,
    },
  ]
  const [second, setSecond] = useState("Pharmacy");

  const _selectedScreen = (_selected) => {
    if (_selected === "Purchase Entry") {
      return (
        <Purchaseentrysection function={props.func} function2={props.function} channel = {channel} fromdate={fromdate} todate={todate} ClinicID={ClinicID} />
      );
    }
    if (_selected === "Purchase Returns") {
      return <PurchaseReturns fromdate={fromdate} todate={todate} ClinicID={ClinicID} channel={channel} />;
    }
    // if (_selected === 2) {
    //   return <Purchaseordersection />;
    // }
    return <div className="">Nothing Selected</div>;
  }
  return (
    <>  
      <section className="purchasesection">
      <div className="container-fluid p-0 m-0 mt-3">
        <div className="row p-0 m-0 mt-1 gx-3 position-relative">
        <div className="col-auto">
              <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {pageindex?pageindex:"Purchase Type "}
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                  {
                    first.map((e, i) => (
                      <li className={`dropdown-item text-${ pageindex == e.option ? "light" : "dark"} fw-bold bg-${pageindex == e.option? "charcoal" : "seashell"}`} onClick={(a) => setpageindex(e.option)} > {e.option} </li>
                    )
                    )
                  }
                </ul>
              </div>
            </div>
            <div className="col-auto">
            <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {second?second:""}
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                      <li className={`dropdown-item text-${second === "Pharmacy" ? "light" : "dark"} fw-bold bg-${second === 'Pharmacy' ? "charcoal" : "seashell"}`} onClick={(a) => {setSecond('Pharmacy');setchannel(1)}} > Pharmacy </li>
                      <li className={`dropdown-item text-${second === "Consumables" ? "light" : "dark"} fw-bold bg-${second === 'Consumables' ? "charcoal" : "seashell"}`} onClick={(a) => {setSecond('Consumables');setchannel(2)}} > Consumables </li>
                </ul>
              </div>
                {/* <select className=" border-0 text-burntumber fw-bolder button-seashell rounded-2 button" value={channel ? channel : ""} onChange={(e) => { setchannel(e.target.value); }} >
                <option className="border-0 text-charcoal fw-bolder" value="1" > Pharmacy </option>
                <option className="border-0 text-charcoal fw-bolder" value="2" > Consumables </option>
              </select> */}
            </div>
          <div className="col-auto bg-seashell rounded-2 ">
              <div className="row p-0 m-0 align-items-center align-self-center">
                <div className="col-auto p-0 m-0">
                  <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 border-0 text-charcoal text-center fw-bold " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                </div>
                <div className="col-auto p-0 m-0">-</div>
                <div className="col-auto p-0 m-0">
                  <input type="date" className=" border-0 button button-seashell text-charcoal text-center fw-bold" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />                
                  </div>
              </div>
            </div>
        </div>
        </div>
      </section>
  
      <section className="tablesrender position-relative">
        <div className="container-fluid mt-lg-4 mt-md-3 mt-2 p-0 m-0">
          <div className="">{_selectedScreen(pageindex)}</div>
        </div>
      </section>
   
    </>
  );
}
function Purchaseentrysection(props) {
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const permission = useContext(Permissions);
  const url = useContext(URL);
  const [peidw, setpeidw] = useState("none");

  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  };

  const fromdate = props.fromdate
  const todate = props.todate
  const channel = props.channel
  const [Loading, setLoading] = useState(false);
  const [purchaseentryarr, setpurchaseentryarr] = useState([]);
  const [purchaseentryarrExcel, setpurchaseentryarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [npef, setnpef] = useState("none");
  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();
  const [qr, setqr] = useState("none");
  function GetPages() {
    try {
      axios
        .get(
          `${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }

  function GETPurchaseList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios
          .get(
            `${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate
            }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
          )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            setpurchaseentryarr(response.data.data.purchase_entry);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios
          .get(
            `${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${Data.selected * 25
            }&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate
            }`
          )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            setpurchaseentryarr(response.data.data.purchase_entry);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
  function GETPurchaseListForExcel() {
    setLoading(true);
    try {
      axios
        .get(
          `${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpurchaseentryarrExcel(response.data.data.purchase_entry);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [channel, fromdate, todate]);

  useEffect(() => {
    GETPurchaseList();
    GETPurchaseListForExcel();
  }, [pagecount]);

  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");
    }
    if (npef === "block") {
      setnpef("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  function GenerateQR(props) {
    let medicines = props.purchaseentry.medicines ? props.purchaseentry.medicines : 0;
    let vaccines = props.purchaseentry.vaccines
      ? props.purchaseentry.vaccines
      : 0;
    let medicineobj = {};
    let vaccineobj = {};
    let medcount = [];
    let vaccount = [];
    if (
      props.purchaseentry.medicines !== undefined &&
      props.purchaseentry.medicines.length !== 0
    ) {
      for (let i = 0; i < medicines.length; i++) {
        for (let j = 0; j < props.purchaseentry.medicines[i].qty; j++) {
          medicineobj[j] = {
            id: "m" + props.purchaseentry.medicines[i].id,
            name: props.purchaseentry.medicines[i].medicine.name,
            qrcode: <QRcode id={"m" + props.purchaseentry.medicines[i].id} />,
          };
          medcount.push(medicineobj[j]);
        }
      }
    }
    if (
      props.purchaseentry.vaccines !== undefined &&
      props.purchaseentry.vaccines.length !== 0
    ) {
      for (let i = 0; i < vaccines.length; i++) {
        for (let j = 0; j < props.purchaseentry.vaccines[i].qty; j++) {
          vaccineobj[j] = {
            id: "v" + props.purchaseentry.vaccines[i].id,
            name: props.purchaseentry.vaccines[i].vaccine.name,
            qrcode: <QRcode id={"v" + props.purchaseentry.vaccines[i].id} />,
          };
          vaccount.push(vaccineobj[j]);
        }
      }
    }

    return (
      <div className="container-fluid">
        <h5 className="text-charcoal75 fw-bold">Medicines</h5>
        <div className="row">
          {medcount.map((Data) => (
            <div className="col-auto m-2" key={Data}>
              <p className="text-charcoal75">
                {Data.name} | {Data.id}
              </p>
              <div className="container">{Data.qrcode}</div>
            </div>
          ))}
        </div>
        <h5 className="text-charcoal75 fw-bold mt-2">Vaccines</h5>
        <div className="row">
          {vaccount.map((Data) => (
            <div className="col-auto m-2" key={Data}>
              <p className="text-charcoal75">
                {Data.name} | {Data.id}
              </p>
              <div className="container">{Data.qrcode}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
         <div className="col-auto position-absolute p-0 m-0 ms-2 export_2 align-self-center text-center">
          <ExportPurchaseEntry purchaseentryarr={purchaseentryarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      <button className={`button addpurchase button-charcoal position-absolute d-${permission.purchase_entry_add == 1 ? "" : "none" }`} onClick={toggle_npef} > <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" /> Entry Purchase </button>
          <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 1 ? "Purchase Entries" : "Purchase Entry"}{" "} </h2>
      <div>
        <div className="scroll scroll-y overflow-scroll p-0 m-0 mt-2" style={{ minHeight: "56vh", height: "56vh" }} >
          <table className="table">
            <thead className=" align-middle position-sticky top-0 bg-pearl">
              <tr>
                <th className="fw-bolder   text-charcoal75" > PE ID </th>
                <th className="fw-bolder   text-charcoal75" > PO ID </th>
                <th className="fw-bolder   text-charcoal75" > Channel </th>
                <th className="fw-bolder   text-charcoal75" > Invoice No. </th>
                <th className="fw-bolder   text-charcoal75" > Bill Date </th>
                <th className="fw-bolder   text-charcoal75" > Bill Total </th>
                <th className="fw-bolder   text-charcoal75" > Vendor </th>
                <th className="fw-bolder  text-center  text-charcoal75"  > Inventory </th>
                <th className="fw-bolder  text-center  text-charcoal75"  > QR Code </th>
                {/* <th className='fw-bolder p-0 m-0  text-charcoal75 text-center' scope='col' style={{ zIndex: '3' }}>more</th> */}
              </tr>
            </thead>
            {Loading ? (
              <tbody className=" text-center" style={{ minHeight: "55vh" }}>
                <tr className="position-absolute border-0 start-0 end-0 px-5">
                  <div class="d-flex align-items-center">
                    <strong className="">
                      Getting Details please be Patient ...
                    </strong>
                    <div
                      class="spinner-border ms-auto"
                      role="status"
                      aria-hidden="true"
                    ></div>
                  </div>
                </tr>
              </tbody>
            ) : purchaseentryarr && purchaseentryarr.length != 0 ? (
              <tbody>
                {purchaseentryarr.map((item, i) => (
                  <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl" } align-middle`} >
                    <td className="py-0 my-0 text-charcoal fw-bold ps-2"> PE-{item.bill_id} </td>
                    <td className="text-charcoal fw-bold"> {item.purchase_order_id && item.purchase_order_id !== null ? item.purchase_order_id : "N/A"} </td>
                    <td className="text-charcoal fw-bold"> {item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"} </td>
                    <td className="text-charcoal fw-bold"> {item.invoice_no ? item.invoice_no : "N/A"} </td>
                    <td className="text-charcoal fw-bold">
                      {item.bill_date && item.bill_date
                        ? reversefunction(item.bill_date)
                        : "N/A"}
                    </td>
                    <td className="text-charcoal fw-bold">
                      {item.bill_total && item.bill_total
                        ? "Rs. " + item.bill_total
                        : "N/A"}
                    </td>
                    <td className="text-charcoal fw-bold">
                      {item.distributor &&
                        item.distributor != null &&
                        item.distributor.entity_name &&
                        item.distributor.entity_name != null
                        ? item.distributor.entity_name
                        : "N/A"}
                    </td>
                    <td className="text-charcoal fw-bold text-center">
                      {/* <button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button> */}
                      <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_peidw(); }} > <img src={ process.env.PUBLIC_URL + "/images/archivebox.png" } alt="displaying_image" className="ms-1 img-fluid" /> </button>
                    </td>
                    <td className='text-charcoal fw-bold text-center'>
                    <button className="btn p-0 m-0" onClick={() => { setqr(i); }} > <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" className="me-1 img-fluid" /> </button>
                          </td>
                    <td>
                       {i == index ? ( 
                        <>
                        {/* <div className="backdrop"></div> */}
                        <section className={` position-absolute d-${i == index ? peidw : "none" } border border-1 start-0 mx-auto end-0 bg-seashell rounded-4 p-0 m-0`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }}>
                       <PEitemdetailssection purchaseentryarr={purchaseentryarr[i]} itembillid={"PE-" + item.bill_id} toggle_peidw={toggle_peidw} /> 
                       </section>
                       </>
                       ) : ( <></> )}
                    </td>
                    <td className={`position-absolute start-0 text-start bg-pearl container-fluid d-${qr == i ? "block" : "none" }`} style={{ top: "-8.5rem", zIndex: "5", height: "89vh" }} >
                      {i == qr ? (
                        <div className="container-fluid position-relative">
                          <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={() => setqr()} aria-label="Close" ></button>
                          <div className="row">
                            <GenerateQR purchaseentry={purchaseentryarr[i]} />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
                <tr className="">
                  <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0"> No Purchase Entries </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <div className="container-fluid mt-2 d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={". . ."}
            pageCount={pages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={GETPurchaseList}
            containerClassName={"pagination"}
            pageClassName={"page-item text-charcoal"}
            pageLinkClassName={ "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1" }
            previousClassName={"btn button-charcoal-outline me-2"}
            previousLinkClassName={"text-decoration-none text-charcoal"}
            nextClassName={"btn button-charcoal-outline ms-2"}
            nextLinkClassName={"text-decoration-none text-charcoal"}
            breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
            breakLinkClassName={"text-decoration-none text-charcoal"}
            activeClassName={"active"}
          />
        </div>
      </div>
      <section className={`newpurchaseentrysection position-absolute start-0 end-0 bg-seashell d-${npef}` } style={{Height:'100vh'}} >
        {
          <Newpurchaseentryform toggle_npef={toggle_npef} GETPurchaseList={GETPurchaseList} />
        }
      </section>
    </>
  );
}
function PEitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  const [qr, setqr] = useState("none");
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst) || igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      e = e.toFixed(2);
      return e;
    }
  }
  function GenerateQR(props) {
    let count = [];
    for (let i = 0; i < props.qty; i++) {
      count.push(props.qty);
    }
    return count.map((data) => (
      <div className="col-auto m-2" key={data}>
        <QRcode id={props.id} />
      </div>
    ));
  }
  return (
    <div className="container-fluid p-0 m-0 ">
      <div className="container-fluid p-0 m-0">
        <h5 className="text-center pt-3 text-charcoal">
          {props.itembillid} Purchase Entry Item Details
        </h5>
        <button
          type="button"
          className="btn-close closebtn position-absolute end-0 me-2"
          onClick={props.toggle_peidw}
          aria-label="Close"
        ></button>

        <div className="col-2 d-none">
          <div
            className=" position-relative searchbutton"
            style={{ top: "0.25rem", right: "1rem" }}
          >
            <input
              type="text"
              className=" form-control d-inline PEsearch bg-seashell"
              placeholder="Search PE"
            />
            <button
              className="btn p-0 m-0 bg-transparent border-0 position-absolute"
              style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }}
            >
              <img
                src={process.env.PUBLIC_URL + "/images/search.png"}
                alt="displaying_image"
                className="img-fluid p-0 m-0"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button
            className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? "charcoal" : "seashell"
              }`}
            onClick={() => {
              setindex(i);
            }}
          >
            {data}
          </button>
        ))}
      </div>

      <div className=" d-flex justify-content-end me-5">
        <input
          type="checkbox"
          className="form-check-input"
          value={Taxon ? Taxon : ""}
          onChange={() => {
            Taxon == true ? setTaxon(false) : setTaxon(true);
          }}
        />
        <label>Show Tax Details</label>
      </div>
      <div
        className={`scroll bg-seashell scroll-y d-${medicine}`}
        style={{ height:"100%" }}
      >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Item ID
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Item Name
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Batch No.
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Expiry Date
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                MRP
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Rate
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Qty.
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Disc%
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Trade Disc%
              </th>
              <th
                colspan={Taxon == true ? "8" : "2"}
                scope="col-group"
                className="border p-0 m-0 px-1"
              >
                Total Tax
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Cost
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Total
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Print QR
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                CGST%
              </th>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                CGST
              </th>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                SGST%
              </th>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                SGST
              </th>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                IGST%
              </th>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                IGST
              </th>
              <th scope="col" className={`border p-0 m-0 px-1`}>
                Total%
              </th>
              <th scope="col" className={`border p-0 m-0 px-1`}>
                Total
              </th>
            </tr>
          </thead>
          {props.purchaseentryarr.medicines &&
            props.purchaseentryarr.medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.purchaseentryarr.medicines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle">
                    {item && item.id !== null ? "m" + item.id : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.medicine && item.medicine.name !== null
                      ? item.medicine.name
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.batch_no && item.batch_no != null
                      ? item.batch_no
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.expiry_date && item.expiry_date != null
                      ? reversefunction(item.expiry_date)
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.mrp ? item.mrp : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.rate ? item.rate : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.qty ? item.qty : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.discount ? item.discount : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.trade_discount ? item.trade_discount : "N/A"}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST_rate ? Number(item.SGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST
                      ? (Number(item.SGST) * Number(item.qty)).toFixed(2)
                      : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST_rate ? Number(item.CGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST
                      ? (Number(item.CGST) * Number(item.qty)).toFixed(2)
                      : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST_rate ? Number(item.IGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST
                      ? (Number(item.IGST) * Number(item.qty)).toFixed(2)
                      : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxPercent(
                      item.CGST_rate,
                      item.SGST_rate,
                      item.IGST_rate
                    )}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.cost ? item.cost : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.total_amount ? item.total_amount : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    <button
                      className="btn"
                      onClick={() => {
                        setqr(_key);
                      }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/images/qrcode.png"}
                        alt="displaying_image"
                        className="me-1"
                      />
                    </button>
                  </td>
                  <div
                    className={`position-absolute top-0 start-0  text-start bg-pearl container-fluid d-${qr == _key ? "block" : "none"
                      }`}
                    style={{ top: "-4.2rem", zIndex: "5", height: "89vh" }}
                  >
                    <div className="container-fluid position-relative">
                      <button
                        type="button"
                        className="btn-close closebtn position-absolute end-0 me-2"
                        onClick={() => setqr()}
                        aria-label="Close"
                      ></button>
                      <p className="mt-2 text-burntumber border-1 ">
                        {item.medicine && item.medicine.name !== null
                          ? item.medicine.name
                          : "N/A"}{" "}
                        | {item && item.id !== null ? "m" + item.id : "N/A"}
                      </p>
                      <div className="row">
                        <GenerateQR qty={item.qty} id={"m" + item.id} />
                      </div>
                    </div>
                  </div>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className=" text-center fw-bold">No Medicines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div
        className={`scroll bg-seashell scroll-y d-${vaccine}`}
        style={{ height:'100%' }}
      >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className={`border p-0 m-0 px-1`} > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Print QR </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total{" "} </th>
            </tr>
          </thead>
          {props.purchaseentryarr.vaccines &&
            props.purchaseentryarr.vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.purchaseentryarr.vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle"> {item && item.id !== null ? "v" + item.id : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.vaccine && item.vaccine.name !== null ? item.vaccine.name : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.batch_no && item.batch_no != null ? item.batch_no : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.mrp ? item.mrp : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.rate ? item.rate : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.discount ? item.discount : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.trade_discount ? item.trade_discount : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST_rate ? item.SGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.SGST ? item.SGST : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST_rate ? item.CGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST ? item.CGST : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST_rate ? item.IGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST ? item.IGST : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxPercent( item.CGST_rate, item.SGST_rate, item.IGST_rate )} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)} </td>
                  <td className="border p-0 m-0 align-middle"> {item.cost ? item.cost : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle">
                    <button className="btn" onClick={() => { setqr(_key); }} > <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" className="me-1" /> </button>
                  </td>
                  <div className={`position-absolute top-0 start-0  text-start bg-pearl container-fluid d-${qr == _key ? "block" : "none" }`} style={{ top: "-8.2rem", zIndex: "5", height: "89vh" }} >
                    <div className="container-fluid position-relative">
                      <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={() => setqr()} aria-label="Close" ></button>
                      <p className="mt-2 text-burntumber border-1 "> {item.vaccine && item.vaccine.name !== null ? item.vaccine.name : "N/A"}{" "} | {item && item.id !== null ? "v" + item.id : "N/A"} </p>
                      <div className="row">
                        <GenerateQR qty={item.qty} id={"v" + item.id} />
                      </div>
                    </div>
                  </div>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className="fw-bold text-center">No Vaccines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}
function Newpurchaseentryform(props) {
  const url = useContext(URL);
  const ClinicId = localStorage.getItem("ClinicId");
  const ClinicList = useContext(Clinic);
  const medicinesref = useRef(null);
  const vendorsref = useRef(null);
  const Tableref = useRef(null);
  const [channel, setchannel] = useState();
  const [po, setpo] = useState();
  const [invoice, setinvoice] = useState();
  const [invoicedate, setinvoicedate] = useState();
  const [vendorname, setvendorname] = useState();
  const [vendorid, setvendorid] = useState();
  const [loadvendors, setloadvendors] = useState();
  const [vendorcode, setvendorcode] = useState();
  const [vendorsearch, setvendorsearch] = useState();
  const [itemsearch, setitemsearch] = useState([""]);
  const [itemname, setitemname] = useState();
  const [itemid, setitemid] = useState();
  const [IsConsumable, setIsConsumable] = useState(0);
  const [itemtype, setitemtype] = useState();
  const [batchno, setbatchno] = useState();
  const [expdate, setexpdate] = useState();
  const [manufdate, setmanufdate] = useState();
  const [mrp, setmrp] = useState();
  const [rate, setrate] = useState();
  const [qty, setqty] = useState();
  const [freeqty, setfreeqty] = useState(0);
  const [disc, setdisc] = useState(0);
  const [trddisc, settrddisc] = useState(0);
  const [cgst, setcgst] = useState(0);
  const [cgstprcnt, setcgstprcnt] = useState(0);
  const [sgst, setsgst] = useState(0);
  const [sgstprcnt, setsgstprcnt] = useState(0);
  const [igst, setigst] = useState(0);
  const [igstprcnt, setigstprcnt] = useState(0);
  const [cpu, setcpu] = useState(0);
  const [totalamt, settotalamt] = useState();
  const [loadsearch, setloadsearch] = useState();
  const [MedicineentriesArr, setMedicineentriesArr] = useState();
  const [tableindex, settableindex] = useState();
  const [clinicstatecode, setclinicstatecode] = useState();
  const [load, setload] = useState();
  const [Exceldata, setExceldata] = useState([]);
  const [NewMed, setNewMed] = useState("none");

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  }
  async function filterclinic() {
    for (let i = 0; i < ClinicList.length; i++) {
      if (ClinicList[i].id == ClinicId) {
        setclinicstatecode(ClinicList[i].state_code);
      } 
    }
  }
  let MedicineentriesObj = {
    type: "",
    isconsumable: 0,
    Itemid: "",
    Itemname: "",
    batchno: "",
    expirydate: "",
    manufacturingDate: "",
    quantity: "",
    freeQty: "",
    MRP: "",
    Rate: "",
    Discount: "",
    tradeDiscount: "",
    sgst: "",
    sgstpercent: "",
    cgst: "",
    cgstper: "",
    igst: "",
    igstper: "",
    costperunit: "",
    totalamount: "",
  };
  async function InsertMedicines() {
    MedicineentriesObj = {
      type: itemtype,
      isconsumable: IsConsumable,
      Itemid: itemid,
      Itemname: itemname,
      batchno: batchno,
      expirydate: expdate,
      manufacturingDate: manufdate,
      MRP: mrp,
      Rate: rate,
      Qty: qty,
      freeQty: freeqty,
      Discount: disc,
      tradeDiscount: trddisc,
      sgstper: sgstprcnt,
      sgst: sgst,
      cgstper: cgstprcnt,
      cgst: cgst,
      igstper: igstprcnt,
      igst: igst,
      costperunit: cpu,
      totalamount: totalamt,
    };
    if (qty) {
      if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
        setMedicineentriesArr([MedicineentriesObj]);
      } else {
        setMedicineentriesArr((prevState) => [...prevState, MedicineentriesObj,]);
      }
    } else {
      Notiflix.Notify.warning("please choose quantity");
    }

    resetfields();
  }
  const searchmeds = async (search) => {
    setloadsearch(true);
    try {
      await axios
        .get(`${url}/item/search?search=${search}`)
        .then((response) => {
          let medicines = [];
          let vaccines = [];
          let items = [];
          medicines.push(
            response.data.data.medicines ? response.data.data.medicines : []
          );
          vaccines.push(
            response.data.data.vaccines ? response.data.data.vaccines : []
          );
          items = medicines.concat(vaccines);
          items = items.flat();
          setitemsearch(items);
          setloadsearch(false);
          if (search.length > 1) {
            medicinesref.current.style.display = "block";
          } else {
            medicinesref.current.style.display = "none";
          }
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
    }
  };
  const searchvendors = async (search) => {
    setloadvendors(true);
    try {
      await axios
        .get(`${url}/kyc/list?limit=10&offset=0&search=${search}`)
        .then((response) => {
          setvendorsearch(response.data.data);
          setloadvendors(false);
          if (search.length > 1) {
            vendorsref.current.style.display = "block";
          } else {
            vendorsref.current.style.display = "none";
          }
        })
        .catch(function error(e) {
          Notiflix.Notify.warning(e.data.message);
          setloadvendors(false);
        });
    } catch (e) {
      setloadvendors(false);
      Notiflix.Notify.warning(e.data.message);
    }
  };
  const SavePurchase = async () => {
    let Is_consumable = [];
    let MedId = [];
    let medname = [];
    let Type = [];
    let batches = [];
    let expirydate = [];
    let manufacturingDate = [];
    let MRP = [];
    let Rate = [];
    let Discount = [];
    let tradeDiscount = [];
    let sgst = [];
    let sgstpercent = [];
    let cgst = [];
    let cgstpercent = [];
    let igst = [];
    let igstpercent = [];
    let costperunit = [];
    let totalamount = [];
    let quantity = [];
    let freequantity = [];
    let grosstotal = 0;
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      Type.push(MedicineentriesArr[i].type ? MedicineentriesArr[i].type : "");
      Is_consumable.push(
        MedicineentriesArr[i].isconsumable
          ? MedicineentriesArr[i].isconsumable
          : 0
      );
      MedId.push(
        MedicineentriesArr[i].Itemid ? MedicineentriesArr[i].Itemid : ""
      );
      medname.push(
        MedicineentriesArr[i].Itemname ? MedicineentriesArr[i].Itemname : ""
      );
      batches.push(
        MedicineentriesArr[i].batchno ? MedicineentriesArr[i].batchno : ""
      );
      expirydate.push(
        MedicineentriesArr[i].expirydate ? MedicineentriesArr[i].expirydate : ""
      );
      manufacturingDate.push(
        MedicineentriesArr[i].manufacturingDate
          ? MedicineentriesArr[i].manufacturingDate
          : ""
      );
      MRP.push(
        MedicineentriesArr[i].MRP ? Number(MedicineentriesArr[i].MRP) : ""
      );
      Rate.push(
        MedicineentriesArr[i].Rate ? Number(MedicineentriesArr[i].Rate) : ""
      );
      Discount.push(
        MedicineentriesArr[i].Discount
          ? Number(MedicineentriesArr[i].Discount)
          : 0
      );
      tradeDiscount.push(
        MedicineentriesArr[i].tradeDiscount
          ? Number(MedicineentriesArr[i].tradeDiscount)
          : 0
      );
      sgst.push(
        MedicineentriesArr[i].sgst ? Number(MedicineentriesArr[i].sgst) : ""
      );
      sgstpercent.push(MedicineentriesArr[i].sgstper ? Number(MedicineentriesArr[i].sgstper) : 0);
      cgst.push(MedicineentriesArr[i].cgst ? Number(MedicineentriesArr[i].cgst) : "");
      cgstpercent.push(MedicineentriesArr[i].cgstper ? Number(MedicineentriesArr[i].cgstper) : 0);
      igst.push(MedicineentriesArr[i].igst ? Number(MedicineentriesArr[i].igst) : "");
      igstpercent.push(MedicineentriesArr[i].igstper ? Number(MedicineentriesArr[i].igstper) : 0);
      costperunit.push(MedicineentriesArr[i].costperunit ? Number(MedicineentriesArr[i].costperunit) : "");
      totalamount.push(MedicineentriesArr[i].totalamount ? Number(MedicineentriesArr[i].totalamount) : "");
      quantity.push(MedicineentriesArr[i].Qty ? Number(MedicineentriesArr[i].Qty) : "");
      freequantity.push(MedicineentriesArr[i].freeQty ? Number(MedicineentriesArr[i].freeQty) : 0);
    }

    totalamount.forEach((item) => {
      grosstotal += Number(item);
    });
    var Data = { distributor_id: vendorid, purchase_order_id: po, invoice_no: invoice, bill_date: invoicedate, clinic_id: ClinicId, channel: channel, is_consumable: Is_consumable, bill_total: grosstotal, id: MedId, type: Type, qty: quantity, free_qty: freequantity, mrp: MRP, rate: Rate, trade_discount: tradeDiscount, discount: Discount, SGST_rate: sgstpercent, SGST: sgst, CGST_rate: cgstpercent, CGST: cgst, IGST_rate: igstpercent, IGST: igst, cost: costperunit, total_amount: totalamount, expiry_date: expirydate, mfd_date: manufacturingDate, batch_no: batches, };
    setload(true);
    try {
      await axios.post(`${url}/purchase/entry/save`, Data).then((response) => {
        setload(false);
        props.GETPurchaseList();
        setload(false);
        props.toggle_npef();
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message);
        } else {
          Notiflix.Notify.warning(response.data.message);
        }
      });
    } catch (e) {
      setload(false);
      Notiflix.Notify.warning(e.message);
    }
  };
  const ClearFields = () => {
    setMedicineentriesArr();
    setchannel();
    setpo();
    setinvoice();
    setinvoicedate();
    setvendorname();
    setvendorid();
  };
  const resetfields = async () => {
    setitemname();
    setitemid();
    setbatchno();
    setexpdate();
    setmanufdate();
    setmrp();
    setrate();
    setqty();
    setfreeqty();
    setdisc();
    settrddisc();
    setcgst();
    setsgst();
    setigst();
    setcgstprcnt();
    setsgstprcnt();
    setigstprcnt();
    setcpu();
    settotalamt();
    setloadsearch();
  };
  function confirmmessage(entries, vendor) {
    customconfirm();
    Notiflix.Confirm.show(
      `Save Purchase Entry`,
      `Do you surely want to add total ${entries.length} purchase ${entries.length <= 1 ? "entry" : "entries"
      } of Distributor ${vendor}  `,
      "Yes",
      "No",
      () => {
        SavePurchase();
      },
      () => {
        return 0;
      },
      {}
    );
  }
  function indexing(i) {
    if (tableindex == i) {
      settableindex(-1);
      Emptytableindex();
    } else {
      settableindex(i);
      EditTableEntry(i);
    }
  }
  function EditTableEntry(index) {
    setitemid(MedicineentriesArr[index].Itemid);
    setitemname(MedicineentriesArr[index].Itemname);
    setbatchno(MedicineentriesArr[index].batchno);
    setexpdate(MedicineentriesArr[index].expirydate);
    setmanufdate(MedicineentriesArr[index].manufacturingDate);
    setmrp(MedicineentriesArr[index].MRP);
    setrate(MedicineentriesArr[index].Rate);
    setqty(MedicineentriesArr[index].Qty);
    setfreeqty(MedicineentriesArr[index].freeQty);
    setdisc(MedicineentriesArr[index].Discount);
    settrddisc(MedicineentriesArr[index].tradeDiscount);
    setcgst(MedicineentriesArr[index].cgst);
    setcgstprcnt(MedicineentriesArr[index].cgstper);
    setsgst(MedicineentriesArr[index].sgst);
    setsgstprcnt(MedicineentriesArr[index].sgstper);
    setigst(MedicineentriesArr[index].igst);
    setigstprcnt(MedicineentriesArr[index].igstper);
    setcpu(MedicineentriesArr[index].costperunit);
    settotalamt(MedicineentriesArr[index].totalamount);
  }
  function Emptytableindex() {
    setIsConsumable(0);
    setitemid();
    setitemname();
    setbatchno();
    setexpdate();
    setmanufdate();
    setmrp();
    setrate();
    setqty();
    setfreeqty();
    setdisc();
    settrddisc();
    setcgst();
    setcgstprcnt();
    setsgst();
    setsgstprcnt();
    setigst();
    setigstprcnt();
    setcpu();
    settotalamt();
  }
  async function UpdateMedicines() {
    for (let j = 0; j < MedicineentriesArr.length; j++) {
      if (tableindex == j) {
        MedicineentriesArr[j] = {
          type: itemtype,
          isconsumable: IsConsumable,
          Itemid: itemid,
          Itemname: itemname,
          batchno: batchno,
          expirydate: expdate,
          manufacturingDate: manufdate,
          MRP: mrp,
          Rate: rate,
          Qty: qty,
          freeQty: freeqty,
          Discount: disc,
          tradeDiscount: trddisc,
          sgstper: sgstprcnt,
          sgst: sgst,
          cgstper: cgstprcnt,
          cgst: cgst,
          igstper: igstprcnt,
          igst: igst,
          costperunit: cpu,
          totalamount: totalamt,
        };
        Notiflix.Notify.success(
          `Item Number ${tableindex + 1} Updated Successfully`
        );
        Emptytableindex();
        settableindex(-1);
      }
    }
  }
  async function DeleteMedicine(id) {
    let obj = [];
    obj.push(
      MedicineentriesArr.filter(function (e) {
        return e.Itemid !== id;
      })
    );
    obj = obj.flat();
    setMedicineentriesArr(obj);
  }
  let total = 0;
  function Calculate() {
    total = qty ? rate * qty : rate;
    // total = freeqty ? total - (rate * freeqty) : total
    total = disc ? total - (total * disc) / 100 : total;
    total = trddisc ? total - (total * trddisc) / 100 : total;
    total = sgstprcnt
      ? Number(total) +
      Number((total * sgstprcnt) / 100 + (total * sgstprcnt) / 100)
      : total;
    total = igstprcnt
      ? Number(total) + Number((total * Number(igstprcnt)) / 100)
      : total;
    total = total ? parseFloat(total).toFixed(2) : total;
    return total;
  }
  let CostPerUnit = 0;
  function CalculateCPU() {
    let newqty = Number(qty) + Number(freeqty);
    CostPerUnit = Number(parseFloat(Calculate() / newqty));
    CostPerUnit = parseFloat(CostPerUnit).toFixed(2);
    return CostPerUnit;
  }
  let GsT = 0;
  function CalculateGst() {
    total = qty ? rate * qty : rate;
    total = disc ? total - (total * disc) / 100 : total;
    total = trddisc ? total - (total * trddisc) / 100 : total;
    GsT = sgstprcnt
      ? Number(((rate * sgstprcnt) / 100 + (rate * sgstprcnt) / 100) / 2)
      : GsT;
    GsT = parseFloat(GsT).toFixed(2);
    return GsT;
  }
  let IgsT = 0;
  function CalculateIGst() {
    total = qty ? rate * qty : rate;
    total = disc ? total - (total * disc) / 100 : total;
    total = trddisc ? total - (total * trddisc) / 100 : total;
    IgsT = igstprcnt ? Number((rate * igstprcnt) / 100) : IgsT;
    IgsT = parseFloat(IgsT).toFixed(2);
    return IgsT;
  }

  useEffect(() => {
    CalculateGst();
    setsgst(CalculateGst());
    setcgst(CalculateGst());
  }, [sgstprcnt]);

  useEffect(() => {
    CalculateIGst();
    setigst(CalculateIGst());
  }, [igstprcnt]);
  useEffect(() => {
    settotalamt(Calculate());
  }, [Calculate()]);

  useEffect(() => {
    setcpu(CalculateCPU());
  }, [CalculateCPU(), Calculate()]);

  const searchmedAuto = async (search) => {
    await axios.get(`${url}/item/search?search=${search}`).then((response) => {
      let medicines = [];
      let vaccines = [];
      let items = [];
      medicines.push(
        response.data.data.medicines ? response.data.data.medicines : []
      );
      vaccines.push(
        response.data.data.vaccines ? response.data.data.vaccines : []
      );
      items = medicines.concat(vaccines);
      items = items.flat();
      if (items[0] && items[0].id !== undefined) {
        let ID = items[0].id;
        return ID;
      } else {
        return "Please Select ID";
      }
    });
  };
  const CalGST = (rate, cgst) => {
    let gst = 0;
    if (cgst && rate) {
      gst = (cgst * rate) / 100;
      gst = Number(gst);
      gst = gst.toFixed(2);
      return gst;
    } else {
      return 0;
    }
  };
  const Disc = (rate, dis) => {
    let disrate = 0;
    if (rate && dis) {
      disrate = (rate * dis) / 100;
      return disrate;
    } else {
      return 0;
    }
  };
  const SubmitExcel = () => {
    if (Tableref.current.files[0].type == "application/vnd.ms-excel") {
      let SelectedFile = Tableref.current.files[0];
      let reader = new FileReader();
      reader.readAsArrayBuffer(SelectedFile);
      reader.onload = (e) => {
        setExceldata(e.target.result);
      };
    } else {
      Notiflix.Notify.failure("Choose Only Excel File to Upload");
    }
  };
  const ConvertExcel = async () => {
    let e = [];
    if (vendorid == 2) {
      if (Exceldata && Exceldata.length != 0) {
        const Excelfile = XLSX.read(Exceldata, { type: "buffer" });
        const ExcelSheet = Excelfile.SheetNames[0];
        const Sheet = Excelfile.Sheets[ExcelSheet];
        const data = XLSX.utils.sheet_to_json(Sheet);
        for (let i = 0; i < data.length; i++) {
          let expiry = data[i].EXPIRY.replace("/", "-20");
          expiry = "01-" + expiry;
          expiry = reversefunction(expiry);
          let CpU = Number(data[i].SRATE);
          CpU = data[i]["CGST"]
            ? CpU +
            Number(CalGST(CpU, data[i]["CGST"])) +
            Number(CalGST(CpU, data[i]["SGST"]))
            : CpU;
          CpU = CpU - Number(Disc(CpU, data[i].DIS));
          CpU = Number(CpU).toFixed(2);
          let ITEMID = await searchmedAuto(data[i]["ITEM NAME"]);

          MedicineentriesObj = {
            type: "",
            Itemid: "",
            Itemname: data[i]["ITEM NAME"],
            batchno: data[i].BATCH,
            expirydate: expiry,
            manufacturingDate: manufdate,
            MRP: data[i].MRP,
            Rate: data[i].SRATE,
            Qty: data[i].QTY,
            freeQty: data[i]["F.QTY"],
            Discount: "",
            tradeDiscount: data[i].DIS,
            sgstper: data[i]["SGST"],
            sgst: CalGST(data[i].SRATE, data[i]["SGST"]),
            cgstper: data[i]["CGST"],
            cgst: CalGST(data[i].SRATE, data[i]["CGST"]),
            igstper: CalGST(data[i].SRATE, data[i]["IGST"]),
            igst: data[i].IGST,
            costperunit: CpU,
            totalamount: CpU * data[i].QTY.toFixed(2),
          };
          e.push(MedicineentriesObj);
        }
      }
    }
    if (vendorid == 4 || vendorid == 3) {
      if (Exceldata && Exceldata.length != 0) {
        const Excelfile = XLSX.read(Exceldata, { type: "buffer" });
        const ExcelSheet = Excelfile.SheetNames[0];
        const Sheet = Excelfile.Sheets[ExcelSheet];
        const data = XLSX.utils.sheet_to_json(Sheet);
        for (let i = 0; i < data.length; i++) {
          let expiry = "20" + data[i].EXPYEAR;
          expiry =
            expiry +
            (data[i].EXPMONTH < 10
              ? "-" + "0" + data[i].EXPMONTH
              : "-" + data[i].EXPMONTH);
          expiry =
            expiry +
            (data[i].EXPDAY < 10 ? "-" + "0" + data[i].EXPDAY : data[i].EXPDAY);
          let CpU = Number(data[i].SRATE);
          CpU = data[i]["CGST"]
            ? CpU +
            Number(CalGST(CpU, data[i]["CGST"])) +
            Number(CalGST(CpU, data[i]["SGST"]))
            : CpU;
          CpU = CpU - Number(Disc(CpU, data[i].DIS));
          CpU = Number(CpU).toFixed(2);
          MedicineentriesObj = {
            type: "",
            Itemid: "",
            Itemname: data[i]["ITEM NAME"],
            batchno: data[i].BATCH,
            expirydate: expiry,
            manufacturingDate: "",
            MRP: data[i].MRP,
            Rate: data[i].SRATE,
            Qty: data[i].QTY,
            freeQty: data[i]["F.QTY"],
            Discount: "",
            tradeDiscount: data[i].DIS,
            sgstper: data[i]["SGST"],
            sgst: CalGST(data[i].SRATE, data[i]["SGST"]),
            cgstper: data[i]["CGST"],
            cgst: CalGST(data[i].SRATE, data[i]["CGST"]),
            igstper: CalGST(data[i].SRATE, data[i]["IGST"]),
            igst: data[i].IGST,
            costperunit: CpU,
            totalamount: (CpU * data[i].QTY).toFixed(2),
          };
          e.push(MedicineentriesObj);
        }
      }
    }
    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr(e);
    } else {
      setMedicineentriesArr((prevState) => [...prevState, e]);
    }
  };
  const ToggleNewMedicine = () => {
    if (NewMed == "block") {
      setNewMed("none");
    }
    if (NewMed == "none") {
      setNewMed("block");
    }
  };
  console.log(vendorsearch)
  return (
    <div className=" p-0 m-0" style={{ zIndex: "2" }}>
        <div className="row p-0 m-0 p-2">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto mt-2" onClick={props.toggle_npef} aria-label="Close" ></button>
          </div>
          <div className="col-8 col-md-7 col-lg-8 col-xl-8">
            <h5 className="text-center mt-2 fw-bold text-charcoal"> New Purchase Entry </h5>
          </div>
          <div className="col-auto">
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button disabled={MedicineentriesArr == undefined || (MedicineentriesArr && MedicineentriesArr.length == 0) ? true : false} className="button button-charcoal" onClick={() => { confirmmessage(MedicineentriesArr, vendorname); }} > Save All </button>
            )}
          </div>
          <div className="col-auto">
            <button className="btn btn-sm text-burntumber fw-bold" onClick={ClearFields}> Clear </button>
          </div>
        </div>

      <div className="container-fluid p-0 m-0 entrydetails bg-pearl" style={{ Height: "100vh" }} >
        <div className="row p-0 m-0">
          <div className={`col-${vendorid ? "8" : "12"} p-0 m-0`}>
            <div className="row p-0 m-0 align-items-center">
              <div className="col-auto">
                <div className="row p-0 m-0">
                  <div className="col-auto">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={channel == 1 ? true : false}
                      value="1"
                      onClick={(e) => {
                        setchannel(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <span className="ms-0">Pharmacy</span>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="row">
                  <div className="col-auto">
                    <input type="checkbox" className="form-check-input" checked={channel == 2 ? true : false} value="2" onClick={(e) => { setchannel(e.target.value); }} />
                  </div>
                  <div className="col-auto">
                    <span className="ms-0">Clinic</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8 p-0 m-0">
              <div className="row p-0 m-0 gx-2 gy-1">
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Select PO</h6>
                  <input className="form-control ms-2 rounded-1" placeholder="Enter PO" value={po ? po : ""} onChange={(e) => { setpo(e.target.value); }} style={{ zIndex: "5" }} />
                </div>
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Select Vendor</h6>
                  <input className="form-control ms-2 rounded-1" placeholder="Search Vendors" value={vendorname ? vendorname : ""} onChange={(e) => { searchvendors(e.target.value); setvendorname(e.target.value); setvendorid(); setvendorcode(); }} />
                  <div ref={vendorsref} className="position-absolute ms-2 rounded-1 bg-pearl col-auto" style={{ zIndex: "5", width: "fit-content" }} >
                    {vendorsearch ? (
                      loadvendors ? (
                        <div className="rounded-1 p-1 bg-pearl mt-1 border shadow" style={{ width: "fit-content" }} >
                          Searching Please wait....
                          <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                            <span className="sr-only"></span>
                          </div>
                        </div>
                      ) : vendorsearch.length == 0 ? (
                        <div className="bg-burntumber text-light rounded-1 p-2">
                          Oops! Not Avaliable
                        </div>
                      ) : (
                        <div className="bg-pearl border shadow rounded-1 p-1 col-12" style={{ zIndex: "40" }} >
                          {
                          vendorsearch.map((data, i) => (
                            <div style={{ cursor: "pointer" }} className={`p-0 p-1 d-${vendorsearch == undefined || vendorsearch.length > 0 ? "" : "none" }  bg-${i % 2 == 0 ? "pearl" : "seashell" } `} name={data.id} onClick={(e) => { setvendorname(data.entity_name); setvendorid(data.id); setvendorcode(data.state_code); filterclinic(); vendorsref.current.style.display = "none"; }} > {data.entity_name} </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <></> 
                    )}
                  </div>
                </div>
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Number</h6>
                  <input type="text" placeholder="Enter No." className="form-control ms-2 rounded-1" value={invoice ? invoice : ""} onChange={(e) => { setinvoice(e.target.value); }} style={{ color: "gray" }} />
                </div>
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Date</h6>
                  <input type="date" className="form-control ms-2 rounded-1" value={invoicedate ? invoicedate : ""} onChange={(e) => { setinvoicedate(e.target.value); }} style={{ color: "gray" }} />
                </div>
              </div>
              <div className="row p-0 m-0 align-items-center mt-2">
                <div className="col-6 col-lg-5 col-md-5 p-0 m-0 align-self-center ms-1">
                  <button className="button button-charcoal p-0 m-0 pe-3 ms-2" onClick={ToggleNewMedicine} > {" "} <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" />{" "} Medicine{" "} </button>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-5">
                      <input ref={Tableref} className="form-control w-100 p-0 m-0 px-2 py-1 rounded-1 bg-pearl" onChange={SubmitExcel} type="file" />
                    </div>
                    <div className="col-5 text-end">
                      <button className="button button-charcoal" onClick={ConvertExcel} > Submit </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" p-0 m-0 scroll scroll-y" >
              <table className="table m-0 datatable bg-pearl text-start position-relative align-middle">
                <thead className=" bg-pearl position-sticky top-0" style={{ color: "gray", fontWeight: "600" }} >
                  <tr>
                    <th>Edit</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>batch No.</th>
                    <th>Expiry Date</th>
                    <th>MRP</th>
                    <th>Rate</th>
                    <th>Total Disc</th>
                    <th>Qty.</th>
                    <th>Cost</th>
                    <th>Amount</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                {MedicineentriesArr ? (
                  <tbody style={{ Height: "48vh", maxHeight: "48vh", color: "var(--charcoal)", fontWeight: "600", }} >
                    {
                    MedicineentriesArr.map((item, _key) => (
                      <tr key={_key} className={`bg-${_key % 2 == 0 ? "seashell" : "pearl"}`} >
                        <td><input type="checkbox" checked={_key == tableindex ? true : false} onClick={() => { indexing(_key); }} className=" form-check-input p-1" /> </td>
                        <td>{item.Itemid}</td>
                        <td>{item.Itemname}</td>
                        {/* <td>{reversefunction(item.manufacturingDate)}</td> */}
                        <td>{item.batchno}</td>
                        <td>{reversefunction(item.expirydate)}</td>
                        <td>{item.MRP}</td>
                        <td>{item.Rate}</td>
                        <td>{Number(item.Discount) + Number(item.tradeDiscount)} </td>
                        <td>{item.Qty}</td>
                        <td>{item.costperunit}</td>
                        <td>{item.totalamount}</td>
                        <td><button onClick={() => { DeleteMedicine(item.Itemid); }} className="btn btn-sm text-burntumber fw-bold" > Delete </button> </td>
                      </tr>
                    ))}
                  </tbody>
                ) : MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                  <tbody className="position-relative bg-pearl text-center" style={{ height: "48vh", maxHeight: "48vh", color: "var(--charcoal)", fontWeight: "600", }} >
                    <tr>
                      <td className="position-absolute start-0 end-0 top-0"> No items Added </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="position-relative bg-pearl text-center" style={{ height: "48vh", maxHeight: "48vh", color: "var(--charcoal)", fontWeight: "600", }} >
                    <tr className="">
                      <td className="position-absolute start-0 end-0"> No items Added </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <div
            className={`col-4 m-0 p-0 scroll scroll-y border border-1 medicineinfosection d-${vendorid ? "block" : "none"} bg-seashell ps-2`} id="medicineinfosection" style={{ maxHeight: "81vh", Height: "81vh" }} >
            <h5 className="mt-2">Add Items</h5>
            <div className="col-12">
              <input type="checkbox" checked={IsConsumable == 0 ? false : true} className="form-check-input" onChange={() => { IsConsumable == 0 ? setIsConsumable(1) : setIsConsumable(0); }} />
              <label>Is Consumable</label>
              <div className=" col-lg-10 col-12">
                <div className="position-relative">
                  <label>Search Items </label>
                  <input className="form-control bg-seashell" placeholder="Items" value={itemname ? itemname : ""} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemtype(); }} />
                  <div ref={medicinesref} className="position-absolute rounded-4 col-12" style={{ zIndex: "2" }} >
                    {
                      itemsearch ? (
                        loadsearch ? (
                          <div className="rounded-1 p-1 bg-pearl">
                            Searching Please wait....
                            <div
                              className="spinner-border my-auto"
                              style={{ width: "1rem", height: "1rem" }}
                              role="status"
                            >
                              <span className="sr-only"> </span>{" "}
                            </div>
                          </div>
                        ) : itemsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-1 p-1 text-wrap">
                            Oops! Not Avaliable
                          </div>
                        ) : (
                          <div className={`mt-1 rounded-4 bg-pearl shadow px-1 pb-2 d-${itemsearch && itemsearch.length > 1 ? "block" : "none"}`} >
                            <p className={`p-0 m-0 bg-pearl fw-bold text-charcoal75 rounded-4 ps-2 `} style={{ fontSize: "0.8rem" }} > {itemsearch.length} Search Results </p>
                            {itemsearch.map((data, i) => (
                              <div style={{ cursor: "pointer" }} className={`p-0 ps-1 text-wrap  bg-${i % 2 == 0 ? "" : "lightyellow"}`} name={data.id} onClick={(e) => { setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); setitemtype(data.vaccines_id ? "v" : "m"); medicinesref.current.style.display = "none"; }} >
                                {data.display_name ? data.display_name : data.name}
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <></>
                      )}
                  </div>
                </div>
                <label className="mb-2 pt-2">Batch Number</label>
                <input type="text" max="10" className="form-control bg-seashell batchnumber rounded-1" id="inputEmail4" placeholder="Batch Number" value={batchno ? batchno : ""} onChange={(e) => setbatchno(e.target.value)} required />
                <label className="pt-3 mb-2">Expiry Date</label>
                <input type="Date" className="form-control bg-seashell reounded-1 expirydate" value={expdate ? expdate : ""} onChange={(e) => { setexpdate(e.target.value); }} required />
                <label className="pt-3 mb-2">Manufacturing Date</label>
                <input type="Date" className="form-control bg-seashell reounded-1 manufacturingdate" value={manufdate ? manufdate : ""} onChange={(e) => { setmanufdate(e.target.value); }} required />
              </div>
              <div className="col-12 form-group col-md-12 col-lg-11">
                <div className="row p-0 m-0">
                  <div className="col-5">
                    <label className="mb-2">MRP</label>
                    <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={mrp ? mrp : ""} onChange={(e) => { setmrp(e.target.value); }} required />
                  </div>
                  <div className="col-5">
                    <label className="mb-2"> Rate</label>
                    <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={rate ? rate : ""} onChange={(e) => { setrate(e.target.value); Calculate(e.target.value); }} required />
                  </div>
                </div>
                <div className="row p-0 m-0">
                  <div className="col-5">
                    <label className="mb-2">Qty</label>
                    <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={qty ? qty : ""} onChange={(e) => { setqty(e.target.value); Calculate(rate, e.target.value); }} required />
                  </div>
                  <div className="col-5">
                    <label className="mb-2">Free Qty</label>
                    <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={freeqty ? freeqty : ""} onChange={(e) => { setfreeqty(e.target.value); }} required />
                  </div>
                </div>
                <div className="row p-0 m-0 mt-2">
                  <div className="col-5">
                    <label className="mb-2">Discount &#40;%&#41;</label>
                    <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={disc ? disc : ""} onChange={(e) => { setdisc(e.target.value); }} required />
                  </div>
                  <div className="col-5 pb-3">
                    <label className="mb-2">Trade Disc. &#40;%&#41;</label>
                    <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={trddisc ? trddisc : ""} onChange={(e) => { settrddisc(e.target.value); }} required />
                  </div>
                  <hr />
                  <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? "block" : "none" }`} >
                    <div className="row align-items-center p-0 m-0">
                      <div className="col-auto ">
                        <h6>SGST</h6>
                      </div>
                      <div className="col-5">
                        <input type="number" max="10" className=" bg-seashell mrp rounded-1 w-100 border border-seashell m-auto" placeholder="00" disabled={true} value={sgst ? sgst : ""} required />
                      </div>
                      <div className="col-3">
                        <input type="number" max="10" className=" bg-seashell mrp rounded-1 w-100 border border-seashell m-auto p-0 m-0" placeholder="Rate" value={sgstprcnt ? sgstprcnt : ""} onChange={(e) => { setsgstprcnt(e.target.value); setcgstprcnt(e.target.value); CalculateGst(); }} required />
                      </div>
                    </div>
                  </div>
                  <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? "block" : "none" }`} >
                    <div className="row p-0 m-0 align-items-center">
                      <div className="col-auto">
                        <h6>CGST</h6>
                      </div>
                      <div className="col-5">
                        <input type="number" max="10" className=" bg-seashell mrp rounded-1 w-100 border border-seashell  m-auto" disabled={true} placeholder="00" value={cgst ? cgst : sgst ? sgst : ""} required />
                      </div>
                      <div className="col-3">
                        <input type="number" max="10" className=" bg-seashell mrp rounded-1 w-100 border border-seashell  m-auto" disabled={true} placeholder="Rate" value={ cgstprcnt ? cgstprcnt : sgstprcnt ? sgstprcnt : "" } required />
                      </div>
                    </div>
                  </div>
                  <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? "none" : "block" }`} >
                    <div className="row p-0 m-0 align-items-center">
                      <div className="col-2 ">
                        <h6>IGST</h6>
                      </div>
                      <div className="col-5">
                        <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" disabled={true} value={CalculateIGst() ? CalculateIGst() : ""} />
                      </div>
                      <div className="col-3">
                        <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="Rate" value={igstprcnt ? igstprcnt : ""} onChange={(e) => { setigstprcnt(e.target.value); }} required />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="col-12 form-group">
                <div className="row p-0 m-0 g-3">
                  <div className="col-5">
                    <label className="mb-2">Cost/Unit</label>
                    <input type="number" max="10" className="form-control bg-seashell costunit rounded-1" placeholder="00" disabled value={CalculateCPU() ? CalculateCPU() : ""} onChange={(e) => { setcpu(e.target.value); }} required />
                  </div>
                  <div className="col-5">
                    <label className="mb-2">Total Amount</label>
                    <input type="number" max="10" className="form-control bg-seashell totalamount rounded-1" placeholder="00" disabled value={Calculate() ? Calculate() : ""} onChange={(e) => { settotalamt(e.target.value); }} required />
                  </div>
                </div>
              </div>
              <div className="col-6 py-3 m-auto text-center">
                {tableindex == -1 || tableindex == undefined ? (
                  <button type="submit" className="btn  button-charcoal done px-5" onClick={InsertMedicines} > {" "} Add{" "} </button>
                ) : (
                  <button type="submit" className="btn  button-charcoal done px-5" onClick={UpdateMedicines} > {" "} Update{" "} </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className={`position-absolute top-0 start-0 end-0 d-${NewMed}`}>
        <NewMedicine ToggleNewMedicine={ToggleNewMedicine} />
      </section>
    </div>
  );
}
// function Purchaseordersection() {
//   let cartselect = ["Pharmacy", "Clinic"];
//   const [cartselectindex, setcartselectindex] = useState(0);
//   const [displayviewcart, setdisplayviewcart] = useState("none");
//   const [displayitemdetails, setdisplayitemdetails] = useState("none");
//   const _displayviewcart = () => {
//     if (displayviewcart === "none") {
//       setdisplayviewcart("block");
//     }
//     if (displayviewcart === "block") {
//       setdisplayviewcart("none");
//     }
//   };
//   const _displayitemdetails = () => {
//     if (displayitemdetails === "none") {
//       setdisplayitemdetails("block");
//     }
//     if (displayitemdetails === "block") {
//       setdisplayitemdetails("none");
//     }
//   };
//   const _selectedcart = (cardindex) => {
//     if (cardindex === 0) {
//       return (
//         <table className="table datatable text-center">
//           <thead>
//             <tr>
//               <th>No.</th>
//               <th>Item Name</th>
//               <th>Total Qty</th>
//               <th>Amount</th>
//               <th>Last Vendor</th>
//               <th>Add</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>{<Pharmacystocktable />}</tbody>
//         </table>
//       );
//     }
//     if (cardindex === 1) {
//       return <div className="">{cardindex}</div>;
//     }
//     return <div className="fs-2">Nothing Selected</div>;
//   };
//   return (
//     <>
//       <button
//         className="button viewcart button-charcoal position-absolute"
//         onClick={_displayviewcart}
//       >
//         <img
//           src={process.env.PUBLIC_URL + "/images/cartwhite.png"}
//           alt="displaying_image"
//           className="img-fluid"
//         />
//         View Cart
//       </button>
//       <div
//         className={`container-fluid pt-2  p-0 m-0 cartform d-${displayviewcart} w-50 border1 rounded bg-seashell position-absolute text-center`}
//       >
//         <div className="container-fluid  w-100 shadow-sm">
//           <h5 className="text-dark fw-bold">Items in Cart</h5>
//         </div>
//         <button
//           type="button"
//           className="btn-close closebtn position-absolute"
//           aria-label="Close"
//           onClick={_displayviewcart}
//         ></button>
//         <div className="pt-1">
//           <div className="row g-0 justify-content-center">
//             {cartselect.map((e, i) => {
//               return (
//                 <button
//                   className={`col-2 p-0 m-0 button text-${i === cartselectindex ? "light" : "dark"
//                     } bg-${i === cartselectindex ? "charcoal" : "seashell"
//                     } rounded-0`}
//                   onClick={(a) => setcartselectindex(i)}
//                 >
//                   {e}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//         <div className="scroll scroll-y">{_selectedcart(cartselectindex)}</div>
//         <div className="bg-pearl rounded">
//           <div className="row p-3 justify-content-between">
//             <div className="col-3">
//               <select
//                 className="form-control bg-pearl"
//                 style={{ color: "gray" }}
//               >
//                 <option
//                   selected
//                   disabled
//                   defaultValue="Select Vendor"
//                   className="Selectvendor"
//                   style={{ color: "gray" }}
//                 >
//                   Select Vendor
//                 </option>
//               </select>
//             </div>
//             <div className="col-3">
//               <button className="button button-charcoal">Create New PO</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div
//         className={`container-fluid pt-2  p-0 m-0 itemdetailsform d-${displayitemdetails} w-50 border1 rounded bg-seashell position-absolute text-center`}
//       >
//         <div className="container-fluid  w-100 shadow-sm">
//           <h5 className="text-dark fw-bold">PO-14 Item Details</h5>
//         </div>
//         <button
//           type="button"
//           className="btn-close closebtn position-absolute"
//           aria-label="Close"
//           onClick={_displayitemdetails}
//         ></button>
//         <div className="scroll scroll-y">{<POitemdetailsarray />}</div>
//         <button
//           type="button"
//           className="btn btn-lg text-center button-charcoal m-2"
//           onClick={_displayitemdetails}
//         >
//           Done
//         </button>
//       </div>
//       <h3 className="ps-3">Purchase Order List</h3>
//       <table className="table datatable text-center">
//         <thead>
//           <tr>
//             <th>PO ID</th>
//             <th>Channel</th>
//             <th>Vendor</th>
//             <th>PO Date</th>
//             <th>Created By</th>
//             <th>Total Items</th>
//             <th>Amount</th>
//             <th>Approval Status</th>
//             <th></th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {<Purchaseorderarray itemdetails={_displayitemdetails} />}
//         </tbody>
//       </table>
//     </>
//   );
// }
// function POitemdetailssection() {
//   return (
//     <table className="table datatable text-center">
//       <thead>
//         <tr>
//           <th>No.</th>
//           <th>Item Name</th>
//           <th>Total Qty</th>
//           <th>Amount</th>
//           <th>Last Vendor</th>
//           <th>Add</th>
//           <th>Delete</th>
//         </tr>
//       </thead>
//       <tbody>{<POitemdetailsarray />}</tbody>
//     </table>
//   );
// }
function PurchaseReturns(props) {
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const url = useContext(URL);
  const [pridw, setpridw] = useState("none");
  const channel =  props.channel
  const fromdate = props.fromdate
  const todate = props.todate
  const [Loading, setLoading] = useState(false);
  const [purchasereturnarr, setpurchasereturnarr] = useState([]);
  const [purchasereturnarrExcel, setpurchasereturnarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [nref, setnref] = useState("none");
  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();
  function GetPages() {
    try {
      axios
        .get(
          `${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }
  function GETPurchaseReturns(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios
          .get(
            `${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate
            }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
          )
          .then((response) => {
            setpurchasereturnarr(response.data.data.purchase_return);
            setpagecount(response.data.data.total_count);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios
          .get(
            `${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${Data.selected * 25
            }&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate
            }`
          )
          .then((response) => {
            setpurchasereturnarr(response.data.data.purchase_return);
            setpagecount(response.data.data.total_count);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
  function GETPurchaseReturnsForExcel() {
    setLoading(true);
    try {
      axios
        .get(
          `${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpurchasereturnarrExcel(response.data.data.purchase_return);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [channel, fromdate, todate]);

  useEffect(() => {
    GETPurchaseReturns();
    GETPurchaseReturnsForExcel();
  }, [pagecount]);

  const toggle_pridw = () => {
    if (pridw === "none") {
      setpridw("block");
    }
    if (pridw === "block") {
      setpridw("none");
    }
  };
  const toggle_nref = () => {
    if (nref === "none") {
      setnref("block");
    }
    if (nref === "block") {
      setnref("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  return (
    <>
    <div className="col-auto position-absolute p-0 m-0 ms-2  export_2 align-self-center text-center   ">
          <ExportPurchaseReturn purchasereturnarr={purchasereturnarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      <button className="button addpurchase button-charcoal position-absolute" onClick={toggle_nref} >
        <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" />
        Entry Return
      </button>

        <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 1 ? "Purchase Returns" : "Purchase Return"}{" "} </h2>
        
      
      <div className="scroll scroll-y overflow-scroll p-0 m-0" style={{ minHeight: "57vh", height: "57vh" }} >
        <table className="table text-center p-0 m-0">
          <thead className="p-0 m-0 align-middle">
            <tr>
              <th className="fw-bolder text-charcoal75" scope="col"> PR ID </th>
              <th className="fw-bolder text-charcoal75" scope="col"> Distributor </th>
              <th className="fw-bolder text-charcoal75" scope="col"> Return Date </th>
              <th className="fw-bolder text-charcoal75" scope="col"> Return Amount </th>
              <th className="fw-bolder text-charcoal75" scope="col"> Inventory </th>
              <th className="fw-bolder text-charcoal75" scope="col"> more </th>
            </tr>
          </thead>
          {
          Loading ? (
            <body className=" text-center" style={{ minHeight: "57vh" }}>
              <tr className="position-absolute border-0 start-0 end-0 px-5">
                <div className="d-flex align-items-center">
                  <strong className="fs-5">
                    Getting Details please be Patient ...
                  </strong>
                  <div
                    className="spinner-border ms-auto"
                    role="status"
                    aria-hidden="true"
                  ></div>
                </div>
              </tr>
            </body>
          ) : purchasereturnarr && purchasereturnarr.length != 0 ? (
            <tbody>
              {purchasereturnarr.map((item, i) => (
                <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl" } align-middle`} >
                  <td className="p-0 m-0 text-charcoal fw-bold"> PR-{item.return_no} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold"> {item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : "N/A"} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold"> {item.return_date ? reversefunction(item.return_date) : ""} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold"> {item.grand_total ? item.grand_total : "N/A"} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold">
                    <button className="btn" onClick={() => { setindex(i); toggle_pridw(); }} > <img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1"/> </button>
                  </td>
                  <td className="p-0 m-0 text-charcoal fw-bold">
                    <button className="btn position-relative cursor-pointer more p-0 m-0"> <img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image"  /> </button>
                  </td>
                  <td className={` position-absolute d-${i == index ? pridw : "none" } border border-1 start-0 mx-auto end-0 bg-seashell rounded-4 p-0 m-0`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }} >
                    {
                    i == index ? (
                      <PRitemdetailssection purchasereturnarr={purchasereturnarr[i]} itembillid={"PR-" + item.return_no} toggle_pridw={toggle_pridw} />
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
              <tr className="">
                <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0"> No Purchase Returns </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="container-fluid mt-2 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={". . ."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GETPurchaseReturns}
          containerClassName={"pagination"}
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={ "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1" }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active"}
        />
      </div>

      <section className={`top-0 position-absolute bg-seashell border shaodw rounded-2 start-0 end-0 mx-auto d-${nref}`} style={{height:'70vh',width:'60vh'}}>
        {
          <NewPurchaseReturnentryform toggle_nref={toggle_nref} GETPurchaseReturns={GETPurchaseReturns} />
        }
      </section>
    </>
  );
}
function PRitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst && igst !== null) || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      e = e.toFixed(2);
      return e;
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };


  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0 position-relative">
        <h5 className="text-center text-charcoal mt-3">
          {props.itembillid} Purchase Return Item Details
        </h5>
        <button
          type="button"
          className="btn-close closebtn position-absolute end-0 me-2 "
          onClick={props.toggle_pridw}
          aria-label="Close"
        ></button>
        <div className="col-2 d-none">
          <div
            className=" position-relative searchbutton"
            style={{ top: "0.25rem", right: "1rem" }}
          >
            <input
              type="text"
              className=" form-control d-inline PEsearch bg-seashell"
              placeholder="Search PE"
            />
            <button
              className="btn p-0 m-0 bg-transparent border-0 position-absolute"
              style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }}
            >
              <img
                src={process.env.PUBLIC_URL + "/images/search.png"}
                alt="displaying_image"
                className="img-fluid p-0 m-0"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button
            className={`button border-charcoal rounded-0 button-${i == index ? "charcoal" : "seashell"
              }`}
            onClick={() => {
              setindex(i);
            }}
          >
            {data}
          </button>
        ))}
      </div>

      <div className="d-flex justify-content-end me-5 ">
        <input
          type="checkbox"
          className="form-check-input"
          value={Taxon ? Taxon : ""}
          onChange={() => {
            Taxon == true ? setTaxon(false) : setTaxon(true);
          }}
        />
        <label>Show Tax Details</label>
      </div>

      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ height:"100%"}} >
        <table className="table datatable text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total </th>
            </tr>
          </thead>
          {props.purchasereturnarr.purchase_medicines &&
            props.purchasereturnarr.purchase_medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.purchasereturnarr.purchase_medicines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle">
                    {item && item.id !== null ? item.id : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.medicine && item.medicine.name !== null
                      ? item.medicine.name
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.batch_no && item.batch_no != null
                      ? item.batch_no
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.expiry_date && item.expiry_date != null
                      ? reversefunction(item.expiry_date)
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.mrp ? item.mrp : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.rate ? item.rate : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.qty ? item.qty : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.discount ? item.discount : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.trade_discount ? item.trade_discount : "N/A"}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST_rate ? Number(item.SGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST ? Number(item.SGST) * Number(item.qty) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST_rate ? Number(item.CGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST ? Number(item.CGST) * Number(item.qty) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST_rate ? Number(item.IGST_rate) : ""}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.IGST ? Number(item.IGST) * Number(item.qty) : ""}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxPercent(
                      item.CGST_rate,
                      item.SGST_rate,
                      item.IGST_rate
                    )}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.cost ? item.cost : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.total_amount ? item.total_amount : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <p className=" text-charcoal fw-bold text-center">
                  No Medicines Found
                </p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div
        className={`scroll bg-seashell scroll-y d-${vaccine}`}
        style={{ height:"100%" }}
      >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Item ID
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Item Name
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Batch No.
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Expiry Date
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                MRP
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Rate
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Disc%
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Trade Disc%
              </th>
              <th
                colspan={Taxon == true ? "8" : "2"}
                scope="col-group"
                className={`border p-0 m-0 px-1`}
              >
                Total Tax
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Cost
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Qty
              </th>
              <th rowspan="2" className="border p-0 m-0 px-1">
                Total
              </th>
            </tr>
            <tr>
              <th
                scope="col"
                className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none"
                  }`}
              >
                CGST%
              </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total </th>
            </tr>
          </thead>
          {props.purchasereturnarr.purchase_vaccines &&
            props.purchasereturnarr.purchase_vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.purchasereturnarr.purchase_vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border p-0 m-0 align-middle">
                    {item && item.id !== null ? item.id : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.vaccine && item.vaccine.name !== null
                      ? item.vaccine.name
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.batch_no && item.batch_no != null
                      ? item.batch_no
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.expiry_date && item.expiry_date != null
                      ? reversefunction(item.expiry_date)
                      : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.mrp ? item.mrp : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.rate ? item.rate : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.qty ? item.qty : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.discount ? item.discount : "N/A"}
                  </td>
                  <td className="border p-0 m-0 align-middle">
                    {item.trade_discount ? item.trade_discount : "N/A"}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST_rate ? item.SGST_rate : "N/A"}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.SGST ? item.SGST : "N/A"}
                  </td>
                  <td
                    className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none"
                      }`}
                  >
                    {item.CGST_rate ? item.CGST_rate : "N/A"}
                  </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.CGST ? item.CGST : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST_rate ? item.IGST_rate : "N/A"} </td>
                  <td className={`border p-0 m-0 align-middle d-${Taxon == true ? "" : "none" }`} > {item.IGST ? item.IGST : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxPercent( item.CGST_rate, item.SGST_rate, item.IGST_rate )} </td>
                  <td className="border p-0 m-0 align-middle"> {TotalTaxRate(item.CGST, item.SGST, item.IGST)} </td>
                  <td className="border p-0 m-0 align-middle"> {item.cost ? item.cost : "N/A"} </td>
                  <td className="border p-0 m-0 align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <p className=" text-center fw-bold">No Vaccines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}
function NewPurchaseReturnentryform(props) {
  const url = useContext(URL);
  const ClinicId = localStorage.getItem("ClinicId");
  const ClinicList = useContext(Clinic);
  const medicinesref = useRef(null);
  const vendorsref = useRef(null);

  const [vendorname, setvendorname] = useState();
  const [vendorid, setvendorid] = useState();
  const [loadvendors, setloadvendors] = useState();
  const [vendorsearch, setvendorsearch] = useState([""]);
  const [itemsearch, setitemsearch] = useState([""]);
  const [itemname, setitemname] = useState();
  const [loadsearch, setloadsearch] = useState();
  const [MedicineentriesArr, setMedicineentriesArr] = useState([]);
  const [load, setload] = useState();

  const CalculateCost = (cost, currentstock, qtytotreturn) => {
    let costing = 0;
    if (cost && qtytotreturn && currentstock >= qtytotreturn) {
      costing = 0;
      costing = Number(cost) * Number(qtytotreturn);
      return costing.toFixed(2);
    } else {
      return costing;
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  async function InsertMedicines(data) {
    let MedicineentriesObj = {
      Itemid: data.id,
      Type: data.type,
      Item: data.item_name,
      batchno: data.batch_no,
      expirydate: data.expiry_date,
      cost: data.cost,
      totalcost: 0,
      currentstock: data.current_stock,
      qtytoReturn: 0,
    };

    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr([MedicineentriesObj]);
    } else {
      setMedicineentriesArr((prevState) => [...prevState, MedicineentriesObj]);
    }
  }
  const searchmeds = async () => {
    setloadsearch(true);
    try {
      await axios
        .get(
          `${url}/purchase/item/search/by/id?item=${itemname}&distributor_id=${vendorid}`
        )
        .then((response) => {
          setitemsearch([response.data.data]);
          setloadsearch(false);
          if (itemname.length >= 1) {
            medicinesref.current.style.display = "block";
          } else {
            medicinesref.current.style.display = "none";
          }
        })
        .catch(function (error) {
          if (error.response) {
            Notiflix.Notify.failure(error.response.data);
            Notiflix.Notify.failure(error.response.status);
            Notiflix.Notify.failure(error.response.headers);
          }
        });
    } catch (e) {
      Notiflix.Notify.failure(e);
    }
  };
  const searchvendors = async (search) => {
    setloadvendors(true);
    try {
      await axios
        .get(`${url}/kyc/list?limit=10&offset=0&search=${search}`)
        .then((response) => {
          setvendorsearch(response.data.data);
          setloadvendors(false);
          if (search.length > 1) {
            vendorsref.current.style.display = "block";
          } else {
            vendorsref.current.style.display = "none";
          }
        })
        .catch(function (error) {
          if (error.response) {
            Notiflix.Notify.failure(error.response.data);
            Notiflix.Notify.failure(error.response.status);
            Notiflix.Notify.failure(error.response.headers);
          }
        });
    } catch (e) {
      Notiflix.Notify.failure(e);
    }
  };
  const SaveReturnEntry = async () => {
    let ProductId = [];
    let Totalamount = [];
    let quantity = [];

    let grosstotal = 0;
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      ProductId.push(
        MedicineentriesArr[i].Itemid
          ? `${MedicineentriesArr[i].Type}${MedicineentriesArr[i].Itemid}`
          : ""
      );
      Totalamount.push(
        MedicineentriesArr[i].totalcost ? MedicineentriesArr[i].totalcost : ""
      );
      quantity.push(
        MedicineentriesArr[i].qtytoReturn
          ? MedicineentriesArr[i].qtytoReturn
          : ""
      );
    }

    Totalamount.forEach((item) => {
      grosstotal += Number(item);
    });

    var Data = {
      distributor_id: vendorid,
      pro_id: ProductId,
      qty: quantity,
      total_amount: Totalamount,
      grand_total: grosstotal,
    };
   
    setload(true);
    try {
      await axios.post(`${url}/purchase/return/save`, Data).then((response) => {
        props.GETPurchaseReturns();
        setMedicineentriesArr();
        setvendorname();
        setvendorid();
        setitemname();
        setload(false);
        props.toggle_nref();
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message);
        } else {
          Notiflix.Notify.warning(response.data.message);
        }
      });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);

    }
  };
  function confirmmessage() {
    customconfirm();
    Notiflix.Confirm.show(
      `Save Purchase Return `,
      `Do you surely want to add total ${MedicineentriesArr.length} Purchase ${MedicineentriesArr.length <= 1 ? "Return " : "Returns"
      } of Distributor ${vendorname}  `,
      "Yes",
      "No",
      () => {
        SaveReturnEntry();
      },
      () => {
        return 0;
      },
      {}
    );
  }
  async function DeleteMedicine(id) {
    let obj = [];
    obj.push(
      MedicineentriesArr.filter(function (e) {
        return e.Itemid !== id;
      })
    );
    obj = obj.flat();
    setMedicineentriesArr(obj);
  }
  function Grand() {
    let c = 0;
    if (MedicineentriesArr && MedicineentriesArr.length > 0) {
      MedicineentriesArr.map((data) => (c += Number(data.totalcost)));
    }
    return c;
  }
  return (
    <div className="newpurchaseentryform p-0 m-0">
        <div className=" p-0 m-0 shadow-sm  position-relative  ">
          <h5 className="text-center fw-bold text-charcoal py-2"> New Purchase Return Entry </h5>
          <button type="button" className="btn-close position-absolute top-0 end-0 closebtn me-2 pt-2" onClick={props.toggle_nref} aria-label="Close" ></button>
        </div>
        <div className="container-fluid p-0 m-0 w-100 entrydetails bg-seashell">
          <div className="row p-0 pt-2 justify-content-center">
            <div className="col-5">
              <h6 className="p-0 m-0 ms-3 fw-bold">Select Distributor</h6>
              <input className="form-control ms-2 rounded-1 bg-seashell" placeholder="Search Vendors" value={vendorname ? vendorname : ""} onChange={(e) => { searchvendors(e.target.value); setvendorname(e.target.value); setvendorid(); setMedicineentriesArr([]); }} />
              <div ref={vendorsref} className="position-absolute ms-2 rounded-1 bg-pearl col-2" style={{ display: "none", zIndex: "1" }} >
                {
                vendorsearch ? (
                  loadvendors ? (
                    <div className="rounded-1 p-1">
                      Searching Please wait....
                      <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                        <span className="sr-only"> </span>
                      </div>
                    </div>
                  ) : vendorsearch.length == 0 ? (
                    <div className="bg-burntumber text-light rounded-1 p-1">
                      Oops! Not Avaliable
                    </div>
                  ) : (
                    vendorsearch.map((data, i) => (
                      <div
                        style={{ cursor: "pointer" }}
                        className={`p-0 p-1  bg-${i % 2 == 0 ? "pearl" : "lightblue"
                          } fs-6 `}
                        name={data.id}
                        onClick={(e) => {
                          setvendorname(data.entity_name);
                          setvendorid(data.id);
                          vendorsref.current.style.display = "none";
                        }}
                      >
                        {data.entity_name}
                      </div>
                    ))
                  )
                ) : (
                  <div className="bg-seashell"></div>
                )}
              </div>
            </div>
            <div className="col-5">
              <div className="position-relative">
                <h6 className="p-0 m-0 ms-3 fw-bold">Product ID</h6>
                <input
                  className="form-control bg-seashell"
                  placeholder="Product Id"
                  value={itemname ? itemname : ""}
                  onChange={(e) => {
                    vendorid
                      ? setitemname(e.target.value)
                      : Notiflix.Notify.failure("Please Add Vendor First");
                  }}
                />
                <div
                  ref={medicinesref}
                  className="position-absolute rounded-1 bg-pearl col-12"
                  style={{ zIndex: "1" }}
                >
                  {itemsearch ? (
                    loadsearch ? (
                      <div className="rounded-1 p-1">
                        Searching Please wait....
                        <div
                          className="spinner-border my-auto"
                          style={{ width: "1rem", height: "1rem" }}
                          role="status"
                        >
                          <span className="sr-only"> </span>{" "}
                        </div>
                      </div>
                    ) : itemsearch.length == 0 ? (
                      <div className="bg-burntumber text-light rounded-1 p-1">
                        Oops! Not Avaliable
                      </div>
                    ) : (
                      itemsearch.map((data, i) => (
                        <div
                          style={{ cursor: "pointer" }}
                          className={`p-0 ps-1 shadow bg-${i % 2 == 0 ? "pearl" : "lightyellow"
                            } fs-6 `}
                          name={data.id}
                          onClick={(e) => {
                            setitemname(data.item_name);
                            InsertMedicines(data);
                            medicinesref.current.style.display = "none";
                          }}
                        >
                          {data.item_name}
                        </div>
                      ))
                    )
                  ) : (
                    <div className="bg-seashell"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-2 align-self-center ">
              <p></p>
              <button className="p-0 m-0 btn" onClick={searchmeds}>
                <img
                  src={process.env.PUBLIC_URL + "images/search.png"}
                />
              </button>
            </div>
          </div>
          <div className=" p-0 m-0 mt-3 scroll scroll-y" style={{ Height: "65vh" }} >
            <table className="table datatable text-center position-relative">
              <thead style={{ color: "gray", fontWeight: "600" }}>
                <tr>
                  <th className="px-2">Item ID</th>
                  <th className="px-2">Item Name</th>
                  <th className="px-2">batch No.</th>
                  <th className="px-2">Expiry Date</th>
                  <th className="px-2">Avl. Stock</th>
                  <th className="px-2">Qty to Return</th>
                  <th className="px-2">Purchase Rate/Unit</th>
                  <th className="px-2">Purchase Rate</th>
                  <th className="px-2">Delete</th>
                </tr>
              </thead>
              {
              MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                <tbody style={{ maxHeight: "65vh", minHeight: "65vh", color: "var(--charcoal)", fontWeight: "600", }} >
                  {
                  MedicineentriesArr.map((item, _key) => (
                    <tr key={_key} className="">
                      <td>{item.Itemid}</td>
                      <td>{item.Item}</td>
                      <td>{item.batchno}</td>
                      <td>{reversefunction(item.expirydate)}</td>
                      <td>{item.currentstock}</td>
                      <td className="p-0 m-0" style={{ width: "0px", height: "0px" }} >
                        <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell  mt-2" value={item.qtytoReturn ? item.qtytoReturn : ""} onChange={(e) => { e.target.value <= item.currentstock ? (item.qtytoReturn = e.target.value) : Notiflix.Notify.failure( "Quantity Cannot be Greater then Current Stock Available" ); item.totalcost = CalculateCost( item.cost, item.currentstock, e.target.value ); setMedicineentriesArr((prevState) => [ ...prevState, ]); }} />
                      </td>
                      <td>{item.cost}</td>
                      <td>{item.totalcost}</td>
                      <td><button onClick={() => { DeleteMedicine(item.Itemid); }} className="btn btn-sm button-burntumber" > Delete </button> </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody className="position-relative" style={{ height: "65vh", maxHeight: "65vh", color: "var(--charcoal)", fontWeight: "600", }} >
                  <tr>
                    <td className="position-absolute start-0 end-0 top-0">
                      No items Added
                    </td>
                  </tr>
                </tbody>
              ) }
            </table>
          </div>
        </div>
      <div className="col-12 position-absolute start-0 end-0 bottom-0 rounded-bottom text-center bg-pearl align-items-center border border-1 py-3">
        <div className="row p-0 m-0">
          <div className="col-auto">
            <div className="row">
              <div className="col-auto">
                <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> Order Total </p>
                <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3"> {Grand()} </h4>
              </div>
              <div className="col-auto">
                <p className="text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3"> Total Items </p>
                <h4 className="text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3">
                  {MedicineentriesArr ? MedicineentriesArr.length : 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-6 mx-auto align-self-center text-end">
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button className="button button-charcoal px-5" onClick={confirmmessage} > Save Return </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// export { Purchaseordersection };
// export { POitemdetailssection };
export { Purchasesection };
export { Purchaseentrysection };
export { PEitemdetailssection };

//-------------------------------------------------------------------------Stock Info---------------------------------------------------------

function Stocksection() {
  let menu = ["Vaccines", "Medicines"];
  const [menuindex, setmenuindex] = useState(0);
  const [stockname,setstockname] = useState('Vaccines')
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return (
        <div className="">
          <Stockvaccinesection />
        </div>
      );
    }
    if (_menu === 1) {
      return (
        <div className="">
          <Stockmedicinesection />
        </div>
      );
    }
    return <div className="fs-2">Nothing Selected</div>;
  };  
  return (
    <>
      <section className="stocksection pt-1">
        <div className="container-fluid mt-2">
          <div className="row gx-3">
            <div className="row m-0 p-0">
            <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {stockname?stockname:'Stock Type'} 
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                  {
                    menu.map((e, i) => (
                      <li className={`dropdown-item text-${i === menuindex ? "light" : "dark"} fw-bold bg-${i === menuindex ? "charcoal" : "seashell"}`} onClick={(a) => {setmenuindex(i);setstockname(e)}} > {e} </li>
                    )
                    )
                  }
                </ul>
              </div>

            </div>    
          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className="container-fluid p-0 m-0 pt-3">
          <div className="">{_selectedmenu(menuindex)}</div>
        </div>
      </section>
    </>
  );
}
function Stockvaccinesection() {
  const url = useContext(URL);
  const Todaydate = useContext(TodayDate);
  const [pagecount, setpagecount] = useState();
  const [pages, setpages] = useState();
  const [vaccineslist, setvaccineslist] = useState([]);
  const [vaccinearr, setvaccinearr] = useState([]);
  const [load, setload] = useState();
  const [searchname, setsearchname] = useState("");
  const [index, setindex] = useState();
  const [detailsform, setdetailsform] = useState("none")
  
  function GetPages() {
    try {
      axios
        .get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`)
        .then((response) => {
          setpagecount(response.data.data.total_count_vaccines);
          setpages(
            Math.round(response.data.data.total_count_vaccines / 10) + 1
          );
          setload(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setload(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);
    }
  }
  const GetVaccines = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true);
      try {
        axios
          .get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`)
          .then((response) => {
            setvaccineslist(response.data.data.vaccines);
            setload(false);
          })
          .catch(function error(e) {
            Notiflix.Notify.failure(e.message);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    } else {
      setload(true);
      try {
        axios.get( `${url}/stock/list?search=${searchname}&limit=10&offset=${Data.selected * 10 }` )
          .then((response) => {
            setvaccineslist(response.data.data.vaccines);
            setload(false);
          })
          .catch(function error(e) {
            Notiflix.Notify.failure(e.message);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    }
  };

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  const Get_Detailed_Data = async () => {
    setvaccinearr([]);
    for (let i = 0; i < vaccineslist.length; i++) {
      let totalcurrentstockarr = [];
      if (vaccineslist[i].stock_info.length == 0) {
        let vaccineobj = {
          id: vaccineslist[i].id,
          name: vaccineslist[i].name,
          manufacturer: vaccineslist[i].manufacturer,
          max_stock_count: vaccineslist[i].max_stock_count,
          alert_stock_count: vaccineslist[i].alert_stock_count,
          min_stock_count: vaccineslist[i].min_stock_count,
        }
        if (vaccinearr == undefined && vaccinearr.length == 0) {
          setvaccinearr(vaccineobj);
        } else {
          setvaccinearr((prevState) => [...prevState, vaccineobj]);
        }
      } else {
        for (let j = 0; j < vaccineslist[i].stock_info.length; j++) {
          totalcurrentstockarr.push(
            vaccineslist[i].stock_info[j].current_stock
          );
          let ExpireDays = Get_Diff(vaccineslist[i].stock_info[j].expiry_date);
          let vaccineobj = {
            id: vaccineslist[i].id,
            name: vaccineslist[i].name,
            manufacturer: vaccineslist[i].manufacturer,
            max_stock_count: vaccineslist[i].max_stock_count,
            alert_stock_count: vaccineslist[i].alert_stock_count,
            min_stock_count: vaccineslist[i].min_stock_count,
            CGST: vaccineslist[i].stock_info[j].CGST,
            CGST_rate: vaccineslist[i].stock_info[j].CGST_rate,
            IGST: vaccineslist[i].stock_info[j].IGST,
            IGST_rate: vaccineslist[i].stock_info[j].IGST_rate,
            SGST: vaccineslist[i].stock_info[j].SGST,
            SGST_rate: vaccineslist[i].stock_info[j].SGST_rate,
            batch_no: vaccineslist[i].stock_info[j].batch_no,
            channel: vaccineslist[i].stock_info[j].channel,
            cost: vaccineslist[i].stock_info[j].cost,
            current_stock: vaccineslist[i].stock_info[j].current_stock,
            discount: vaccineslist[i].stock_info[j].discount,
            expiry_date: vaccineslist[i].stock_info[j].expiry_date,
            free_qty: vaccineslist[i].stock_info[j].free_qty,
            Batch_stock_id: vaccineslist[i].stock_info[j].id,
            mfd_date: vaccineslist[i].stock_info[j].mfd_date,
            mrp: vaccineslist[i].stock_info[j].mrp,
            purchase_entry_id: vaccineslist[i].stock_info[j].purchase_entry_id,
            qty: vaccineslist[i].stock_info[j].qty,
            rate: vaccineslist[i].stock_info[j].rate,
            trade_discount: vaccineslist[i].stock_info[j].trade_discount,
            total_amount: vaccineslist[i].stock_info[j].total_amount,
            totalstock: totalcurrentstockarr,
            Days_to_expire: ExpireDays,
          };
          if (vaccinearr == undefined && vaccinearr.length == 0) {
            setvaccinearr(vaccineobj);
          } else {
            setvaccinearr((prevState) => [...prevState, vaccineobj]);
          }
        }
      }
    }
  }


  const CalculateTStock = (totalarr) => {
    if (totalarr !== undefined) {
      let total = 0;
      totalarr.map((item) => (total += Number(item)));
      return total;
    }
  };

  const GetStatus = (totalstockarr, alertstockcount) => {
    if (totalstockarr !== undefined) {
      let total = 0;
      totalstockarr.map((item) => (total += Number(item)));

      if (total <= alertstockcount) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const toggle_detailsform = () => {
    if (detailsform == "none") {
      setdetailsform("block");
    }
    if (detailsform === "block") {
      setdetailsform("none");
      setindex();
    }
  };
  const reversefunction2 = (date) => {
    if (date) {
      let newdate = [];
      let DATE = "";
      date = date.split("-").reverse();
      newdate.push(date[1]);
      newdate.push(date[0]);
      newdate.push(date[2]);
      DATE = newdate[0] + "/" + newdate[1] + "/" + newdate[2];
      return DATE;
    }
  };
  const Get_Diff = (expiry) => {
    // let currentdate = reversefunction(Todaydate).replaceAll('-', '/')
    let expirydate = reversefunction2(expiry);
    var date1 = new Date();
    var date2 = new Date(expirydate);
    const diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(Number(diffTime) / (1000 * 60 * 60 * 24));
    diffDays = (Number(diffDays) / 30).toFixed(1);
    return diffDays;
  };

  useEffect(() => {
    GetPages();
    GetVaccines();
    Get_Detailed_Data();
  }, [pagecount, searchname]);
  // Do_Pagination()
  useEffect(() => {
    Get_Detailed_Data();
  }, [vaccineslist]);
  return (
    <div className="p-0 m-0 vaccinestockinfo">
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className="position-absolute searchbutton">
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Vaccine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn searchbtn p-0 m-0 bg-transparent border-0 position-absolute"> <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0" style={{width:'1.5rem',marginTop:'0.05rem'}} /> </button>
      </div>
      <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Vaccine Stocks Info" : "Vaccine Stock Info"}{" "} </h2>

      <div className="heading text-start text-charcoal p-lg-2 p-md-2 p-2 ms-lg-5 ms-md-3 ms-1 fw-bold">
        
      </div>
      <div className="scroll scroll-y">
        <table className="table datatable text-start">
          <thead className="position-sticky top-0 bg-pearl">
            <tr className="text-start">
              <th className="text-charcoal75 fw-bold">ID</th>
              <th className="text-charcoal75 fw-bold">Vaccine Name</th>
              <th className="text-charcoal75 fw-bold">Batch No.</th>
              <th className="text-charcoal75 fw-bold">Expiry Date</th>
              <th className="text-charcoal75 fw-bold">MRP</th>
              <th className="text-charcoal75 fw-bold">Cost/Unit</th>
              <th className="text-charcoal75 fw-bold">B.Stock</th>
              <th className="text-charcoal75 fw-bold">T.Stock</th>
              <th className="text-charcoal75 fw-bold text-center"> Expired in </th>
              <th className="text-charcoal75 fw-bold text-center"> Stock Status </th>
              <th className="text-charcoal75 fw-bold text-center"></th>
              <th className="text-charcoal75 fw-bold text-center">more info</th>
            </tr>
          </thead>
          {load ? (
                     <tbody
                     className="text-center"
                     style={{ minHeight: "55vh", height: "55vh" }}
                   >
                     <tr className="position-absolute border-0 start-0 end-0 px-5">
                       <div class="d-flex align-items-center spinner">
                         <strong className="" style={{ fontSize: "1rem" }}>
                           Getting Details please be Patient ...
                         </strong>
                         <div className="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
                       </div>
                     </tr>
                   </tbody>
          ) : vaccinearr == undefined || vaccinearr.length == 0 ? (
            <tbody className="text-center">
              <tr>
                <td className="position-absolute text-charcoal fw-bolder start-0 end-0 text-center"> No Vaccines Found </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="">
              {
              vaccinearr.map((data, i) => (
                <tr className={`text-start align-middle`}>
                  <td className=" text-charcoal fw-bold"> v{data.Batch_stock_id} </td>
                  <td className=" text-charcoal fw-bold"> {data.name && data.name !== null ? data.name : ""} </td>
                  <td className=" text-charcoal fw-bold">{data.batch_no}</td>
                  <td className=" text-charcoal fw-bold"> {reversefunction(data.expiry_date)} </td>
                  <td className=" text-charcoal fw-bold">{data.mrp}</td>
                  <td className=" text-charcoal fw-bold">{data.cost}</td>
                  <td className=" text-charcoal fw-bold"> {data.current_stock} </td>
                  <td className=" text-charcoal fw-bold"> {CalculateTStock(data.totalstock)} </td>
                  <td className={`text-${data.Days_to_expire <= 2 ? "burntumber" : "charcoal" } fw-bold text-center`} > {data.Days_to_expire} Months </td>
                  <td className=" text-charcoal fw-bold text-center"> {GetStatus(data.totalstock, data.alert_stock_count) == 1 ? ( <img src={process.env.PUBLIC_URL + "images/exclamation.png"} /> ) : ( <></> )} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold align-items-center text-center "> <div className="vr rounded-1 align-self-center" style={{ padding: "0.8px" }} ></div> </td>
                  <td className={` bg-${index == i ? "lightyellow" : "" } p-0 m-0 text-charcoal fw-bold text-center`} >
                    <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_detailsform(); }} > <img src={process.env.PUBLIC_URL + "images/info.png"} /> </button>
                  </td>
                  {
                  index == i ? (
                    <td className={`stockdetailsfrom bg-white border border-1 col-lg-11 rounded-4 shadow p-0 col-md-11 col-sm-11 col-10 col-xl-6 d-${index == i ? detailsform : "none" } position-absolute start-0 end-0 top-0`} >
                      <VaccinesectionItemDetails
                        toggle_detailsform={toggle_detailsform}
                        data={vaccinearr[i]}
                      />
                    </td>
                  ) : (
                    <></>
                  )
                  }
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="container-fluid d-flex justify-content-center mt-2">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={". . ."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GetVaccines}
          containerClassName={"pagination"}
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={
            "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
          }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}
function Stockmedicinesection() {
  const url = useContext(URL);
  const [pagecount, setpagecount] = useState();
  const [pages, setpages] = useState();
  const [medicineslist, setmedicineslist] = useState([]);
  const [medicinearr, setmedicinearr] = useState([]);
  const [load, setload] = useState();
  const [searchname, setsearchname] = useState("");
  const [index, setindex] = useState();
  const [detailsform, setdetailsform] = useState("none");

  function GetPages() {       
    try {
      axios
        .get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`)
        .then((response) => {
          setpagecount(response.data.data.total_count_medicines);
          setpages(
            Math.round(response.data.data.total_count_medicines / 10) + 1
          );
          setload(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setload(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);
    }
  }
  const GetMedicines = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true);
      try {
        axios
          .get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`)
          .then((response) => {
            setmedicineslist(response.data.data.medicines);
            setload(false);
          })
          .catch(function error(e) {
            Notiflix.Notify.failure(e.message);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    } else {
      setload(true);
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=${Data.selected * 10}`)
          .then((response) => {
            setmedicineslist(response.data.data.medicines);
            setload(false);
          })
          .catch(function error(e) {
            Notiflix.Notify.failure(e.message);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    }
  };
  const Get_Detailed_Data = async () => {
    setmedicinearr([]);
    for (let i = 0; i < medicineslist.length; i++) {
      let totalcurrentstockarr = [];
      if (medicineslist[i].stock_info.length == 0) {
        let medicineobj = {
          id: medicineslist[i].id ? medicineslist[i].id : "", 
          name: medicineslist[i].name ? medicineslist[i].name : "",
          manufacturer: medicineslist[i].manufacturer ? medicineslist[i].manufacturer : "",
          max_stock_count: medicineslist[i].max_stock_count ? medicineslist[i].max_stock_count : "",
          alert_stock_count: medicineslist[i].alert_stock_count ? medicineslist[i].alert_stock_count : "",
          min_stock_count: medicineslist[i].min_stock_count ? medicineslist[i].min_stock_count : "",
        };
        if (medicinearr == undefined && medicinearr.length == 0) {
          setmedicinearr(medicineobj);
        } else {
          setmedicinearr((prevState) => [...prevState, medicineobj]);
        }
      } else {
        for (let j = 0; j < medicineslist[i].stock_info.length; j++) {
          let ExpireDays = "";
          if (medicineslist[i].stock_info[j].current_stock) {
            totalcurrentstockarr.push(
              medicineslist[i].stock_info[j].current_stock
            );
          } else {
            totalcurrentstockarr = [];
          }
          ExpireDays = Get_Diff(medicineslist[i].stock_info[j].expiry_date);

          let medicineobj = {
            id: medicineslist[i].id ? medicineslist[i].id : "",
            name: medicineslist[i].name ? medicineslist[i].name : "",
            manufacturer: medicineslist[i].manufacturer ? medicineslist[i].manufacturer : "",
            max_stock_count: medicineslist[i].max_stock_count ? medicineslist[i].max_stock_count : "",
            alert_stock_count: medicineslist[i].alert_stock_count ? medicineslist[i].alert_stock_count : "",
            min_stock_count: medicineslist[i].min_stock_count ? medicineslist[i].min_stock_count : "",
            CGST: medicineslist[i].stock_info[j].CGST ? medicineslist[i].stock_info[j].CGST : "",
            CGST_rate: medicineslist[i].stock_info[j].CGST_rate ? medicineslist[i].stock_info[j].CGST_rate : "",
            IGST: medicineslist[i].stock_info[j].IGST ? medicineslist[i].stock_info[j].IGST : "",
            IGST_rate: medicineslist[i].stock_info[j].IGST_rate ? medicineslist[i].stock_info[j].IGST_rate : "",
            SGST: medicineslist[i].stock_info[j].SGST ? medicineslist[i].stock_info[j].SGST : "",
            SGST_rate: medicineslist[i].stock_info[j].SGST_rate ? medicineslist[i].stock_info[j].SGST_rate : "",
            batch_no: medicineslist[i].stock_info[j].batch_no ? medicineslist[i].stock_info[j].batch_no : "",
            channel: medicineslist[i].stock_info[j].channel ? medicineslist[i].stock_info[j].channel : "",
            cost: medicineslist[i].stock_info[j].cost ? medicineslist[i].stock_info[j].cost : "",
            current_stock: medicineslist[i].stock_info[j].current_stock ? medicineslist[i].stock_info[j].current_stock : "",
            discount: medicineslist[i].stock_info[j].discount ? medicineslist[i].stock_info[j].discount : "",
            expiry_date: medicineslist[i].stock_info[j].expiry_date ? medicineslist[i].stock_info[j].expiry_date : "",
            free_qty: medicineslist[i].stock_info[j].free_qty ? medicineslist[i].stock_info[j].free_qty : "",
            Batch_stock_id: medicineslist[i].stock_info[j].id ? medicineslist[i].stock_info[j].id : "",
            mfd_date: medicineslist[i].stock_info[j].mfd_date ? medicineslist[i].stock_info[j].mfd_date : "",
            mrp: medicineslist[i].stock_info[j].mrp ? medicineslist[i].stock_info[j].mrp : "",
            purchase_entry_id: medicineslist[i].stock_info[j].purchase_entry_id ? medicineslist[i].stock_info[j].purchase_entry_id : "",
            qty: medicineslist[i].stock_info[j].qty ? medicineslist[i].stock_info[j].qty : "",
            rate: medicineslist[i].stock_info[j].rate ? medicineslist[i].stock_info[j].rate : "",
            trade_discount: medicineslist[i].stock_info[j].trade_discount ? medicineslist[i].stock_info[j].trade_discount : "",
            total_amount: medicineslist[i].stock_info[j].total_amount ? medicineslist[i].stock_info[j].total_amount : "",
            totalstock: totalcurrentstockarr ? totalcurrentstockarr : "",
            Days_to_expire: ExpireDays ? ExpireDays : "",
          };
          if (medicinearr == undefined && medicinearr.length == 0) {
            setmedicinearr(medicineobj);
          } else {
            setmedicinearr((prevState) => [...prevState, medicineobj]);
          }
        }
      }
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  const reversefunction2 = (date) => {
    if (date) {
      let newdate = [];
      let DATE = "";
      date = date.split("-").reverse();
      newdate.push(date[1]);
      newdate.push(date[0]);
      newdate.push(date[2]);
      DATE = newdate[0] + "/" + newdate[1] + "/" + newdate[2];
      return DATE;
    }
  };
  const Get_Diff = (expiry) => {
    // let currentdate = reversefunction(Todaydate).replaceAll('-', '/')
    let expirydate = reversefunction2(expiry);
    var date1 = new Date();
    var date2 = new Date(expirydate);
    const diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(Number(diffTime) / (1000 * 60 * 60 * 24));
    diffDays = (Number(diffDays) / 30).toFixed(1);
    return diffDays;
  };
  const GetStatus = (totalstockarr, alertstockcount) => {
    if (totalstockarr && alertstockcount) {
      let total = 0;
      totalstockarr.map((item) => (total += Number(item)));

      if (total <= alertstockcount) {
        return 1;
      } else {
        return 0;
      }
    }
  };
  const CalculateTStock = (totalarr) => {
    let total = 0;
    totalarr.map((item) => (total += Number(item)));
    return total;
  };
  useEffect(() => {
    GetPages();
    GetMedicines();
    Get_Detailed_Data();
  }, [pagecount, searchname]);

  useEffect(() => {
    Get_Detailed_Data();
  }, [medicineslist]);

  const toggle_detailsform = () => {
    if (detailsform == "none") {
      setdetailsform("block");
    }
    if (detailsform === "block") {
      setdetailsform("none");
      setindex();
    }
  };
  return (
    <div className="p-0 m-0 vaccinestockinfo">
      <div className="position-absolute searchbutton" style={{ top: "0.25rem", right: "1rem" }} >
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Medicine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn searchbtn p-0 m-0 bg-transparent border-0 position-absolute">
          <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0" style={{width:'1.5rem',marginTop:'0.05rem'}} />
        </button>
      </div>
      <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Medicine Stocks Info" : "Medicine Stock Info"}{" "} </h2>

      <div className="scroll scroll-y p-0 m-0">
        <table className="table datatable text-start">
          <thead className="position-sticky top-0 bg-pearl">
            <tr>
       
              <th className="text-charcoal75 fw-bold">ID</th>
              <th className="text-charcoal75 fw-bold">Medicine Name</th>
              <th className="text-charcoal75 fw-bold">Batch No.</th>
              <th className="text-charcoal75 fw-bold">Expiry Date</th>
              <th className="text-charcoal75 fw-bold">MRP</th>
              <th className="text-charcoal75 fw-bold">Cost/Unit</th>
              <th className="text-charcoal75 fw-bold">B.Stock</th>
              <th className="text-charcoal75 fw-bold">T.Stock</th>
              <th className="text-charcoal75 fw-bold text-center"> Expired in </th>
              <th className="text-charcoal75 fw-bold text-center"> Stock Status </th>
              <th className="text-charcoal75 fw-bold text-center"></th>
              <th className="text-charcoal75 fw-bold text-center">more info</th>
            </tr>
          </thead>
          {load ? (
            <tbody
            className="text-center"
            style={{ minHeight: "55vh", height: "55vh" }}
          >
            <tr className="position-absolute border-0 start-0 end-0 px-5">
              <div class="d-flex align-items-center spinner">
                <strong className="" style={{ fontSize: "1rem" }}>
                  Getting Details please be Patient ...
                </strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
              </div>
            </tr>
          </tbody>
          ) : medicinearr == undefined || medicinearr.length == 0 ? (
            <tbody className="">
              <tr>
                <td className="position-absolute w-100 text-charcoal fw-bolder start-0 end-0 text-center">
                  No Medicines Found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="">
              {medicinearr.map((data, i) => (
                <tr className={`text-start align-middle`}>
         
                  <td className=" text-charcoal fw-bold"> m{data.Batch_stock_id} </td>
                  <td className=" text-charcoal fw-bold"> {data.name && data.name !== null ? data.name : ""} </td>
                  <td className=" text-charcoal fw-bold">{data.batch_no}</td>
                  <td className=" text-charcoal fw-bold"> {reversefunction(data.expiry_date)} </td>
                  <td className=" text-charcoal fw-bold">{data.mrp}</td>
                  <td className=" text-charcoal fw-bold">{data.cost}</td>
                  <td className=" text-charcoal fw-bold"> {data.current_stock} </td>
                  <td className=" text-charcoal fw-bold"> {data.totalstock ? CalculateTStock(data.totalstock) : ""} </td>
                  <td className={`text-${data.Days_to_expire ? data.Days_to_expire : "" <= 2 ? "burntumber" : "charcoal" } fw-bold text-center`} > {data.Days_to_expire ? data.Days_to_expire : ""} Months </td>
                  <td className=" text-charcoal fw-bold text-center"> {GetStatus(data.totalstock, data.alert_stock_count) == 1 ? ( <img src={process.env.PUBLIC_URL + "images/exclamation.png"} /> ) : ( <></> )} </td>
                  <td className="p-0 m-0 text-charcoal fw-bold align-items-center text-center "> <div className="vr rounded-1 align-self-center" style={{ padding: "0.8px" }} ></div> </td>
                  <td className={` bg-${index == i ? "lightyellow" : "" } p-0 m-0 text-charcoal fw-bold text-center`} > <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_detailsform(); }} > <img src={process.env.PUBLIC_URL + "images/info.png"} /> </button> </td>
                  {index == i ? (
                    <td className={`stockdetailsfrom bg-white border border-1 col-lg-11 rounded-4 shadow p-0 col-md-11 col-sm-11 col-10 col-xl-6 d-${index == i ? detailsform : "none" } position-absolute start-0 end-0 top-0`} >
                      <MedicinesectionItemDetails
                        toggle_detailsform={toggle_detailsform}
                        data={medicinearr[i]}
                      />
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="container-fluid mt-2 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GetMedicines}
          containerClassName={
            "pagination scroll align-self-center align-items-center"
          }
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={
            "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
          }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"d-flex mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active "}
        />
      </div>
    </div>
  )
}
function VaccinesectionItemDetails(props) {
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  return (
    <div className=" p-0 m-0 position-relative bg-seashell rounded-4">
      <h6 className="text-center text-charcoal fw-bold pt-2">
        {props.data.name}
      </h6>
      <hr className="p-0 m-0" />
      <button
        className="btn-close position-absolute end-0 top-0 p-1 m-1"
        onClick={props.toggle_detailsform}
      ></button>

      <div className="p-0 m-0 scroll py-4">
        <table className="table text-center scroll">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>MRP</th>
              <th>Disc%</th>
              <th>Rate</th>
              <th className="bg-seashell">CGST</th>
              <th className="bg-seashell">CGST%</th>
              <th className="bg-seashell">SGST</th>
              <th className="bg-seashell">SGST%</th>
              <th className="bg-seashell">IGST</th>
              <th className="bg-seashell">IGST%</th>
              <th>Cost</th>

              <th>Total Amt.</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-0 m-0 px-1">
              <td className="p-0 m-0 px-1">
                {props.data.channel == 1 ? "Pharmacy" : "Clinic"}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.expiry_date
                  ? reversefunction(props.data.expiry_date)
                  : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.qty ? props.data.qty : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.mrp ? props.data.mrp : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.discount && props.data.trade_discount
                  ? Number(props.data.discount) +
                  Number(props.data.trade_discount)
                  : props.data.discount
                    ? props.data.discount
                    : props.data.trade_discount}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.rate ? props.data.rate : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.CGST ? props.data.CGST : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.CGST ? props.data.CGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.SGST ? props.data.SGST : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.SGST_rate ? props.data.SGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.IGST ? props.data.IGST : ""}
              </td>
              <td className="p-0 m-0 px-1 bg-seashell">
                {props.data.IGST_rate ? props.data.IGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.cost ? props.data.cost : ""}
              </td>

              <td className="p-0 m-0 px-1">
                {props.data.total_amount ? props.data.total_amount : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
function MedicinesectionItemDetails(props) {
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  return (
    <div className=" p-0 m-0 position-relative bg-seashell rounded-4">
      <h6 className="text-center text-charcoal fw-bold pt-2">
        {props.data.name}
      </h6>
      <hr className="p-0 m-0" />
      <button
        className="btn-close position-absolute end-0 top-0 p-1 m-1 me-2"
        onClick={props.toggle_detailsform}
      ></button>
      <div className="p-0 m-0 scroll">
        <table className="table text-center scroll">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Manuf.</th>
              <th>Expiry</th>
              <th>MRP</th>
              <th>Disc%</th>
              <th>Rate</th>
              <th>CGST%</th>
              <th>CGST</th>
              <th>SGST%</th>
              <th>SGST</th>
              <th>IGST%</th>
              <th>IGST</th>
              <th>Cost</th>
              <th>Qty</th>
              <th>Total Amt.</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-0 m-0 px-1">
              <td className="p-0 m-0 px-1">
                {props.data.channel == 1 ? "Pharmacy" : "Clinic"}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.mfd_date
                  ? reversefunction(props.data.mfd_date)
                  : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.expiry_date
                  ? reversefunction(props.data.expiry_date)
                  : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.mrp ? props.data.mrp : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.discount && props.data.trade_discount
                  ? Number(props.data.discount) +
                  Number(props.data.trade_discount)
                  : props.data.discount
                    ? props.data.discount
                    : props.data.trade_discount}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.rate ? props.data.rate : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.CGST ? props.data.CGST : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.CGST ? props.data.CGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.SGST ? props.data.SGST : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.SGST_rate ? props.data.SGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.IGST ? props.data.IGST : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.IGST_rate ? props.data.IGST_rate : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.cost ? props.data.cost : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.qty ? props.data.qty : ""}
              </td>
              <td className="p-0 m-0 px-1">
                {props.data.total_amount ? props.data.total_amount : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
//-------------------------------------------------------------------------Lists--------------------------------------------------------------
function Listsection() {
  const permission = useContext(Permissions);
  let menu = [
    {
      option: "Vaccines",
      display: permission.vaccine_view,
    },
    {
      option: "Medicines",
      display: permission.medicine_view,
    },
  ];

  const [menuindex, setmenuindex] = useState('Vaccines');
  const _selectedmenu = (_menu) => {
    if (_menu === 'Vaccines') {
      return (
        <div className="">
          <VaccineList />
        </div>
      );
    }
    if (_menu === 'Medicines') {
      return (
        <div className="">
          <MedicineList />
        </div>
      );
    }
    return <div className="fs-2">Nothing Selected</div>;
  };
  return (
    <>
      <section className="stocksection pt-1">
        <div className="container-fluid mt-2">
          <div className="row gx-3">
            <div className="row m-0 p-0">
                  <div class="dropdown">
                  <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                   {menuindex?menuindex:" List "}
                  </button>
                  <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                    {
                      menu.map((e, i) => (
                        <li className={`dropdown-item text-${e.option === menuindex ? "light" : "dark"} fw-bold bg-${e.option === menuindex ? "charcoal" : "seashell"}`} onClick={(a) => setmenuindex(e.option)} > {e.option} </li>
                      )
                      )
                    }
                  </ul>
                </div>
            </div>
          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className="container-fluid mt-lg-3 mt-md-3 mt-sm-2 mt-1 p-0">
          <div className="">{_selectedmenu(menuindex)}</div>
        </div>
      </section>
    </>
  );
}
function VaccineList() { 
  const url = useContext(URL);
  const permission = useContext(Permissions);
  const [pagecount, setpagecount] = useState();
  const [pages, setpages] = useState();
  const [vaccines, setvaccines] = useState([]);
  const [load, setload] = useState(false);
  const [index, setindex] = useState();
  const [NewVacc, setNewVacc] = useState("none");
  const [UptVacc, setUptVacc] = useState("none");

  function GetPages() {
    try {
      axios
        .get(`${url}/vaccine/brand/list?limit=20&offset=0`)
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 20) + 1);
          setload(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setload(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);
    }
  }
  const vaccinelist = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true);
      try {
        await axios
          .get(`${url}/vaccine/brand/list?limit=20&offset=0`)
          .then((response) => {
            setvaccines(response.data.data.vaccine_brand_list);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    } else {
      setload(true);
      try {
        await axios
          .get(`${url}/vaccine/brand/list?limit=20&offset=${Data.selected * 20}`)
          .then((response) => {
            setvaccines(response.data.data.vaccine_brand_list);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    }
  };
  useEffect(() => {
    GetPages();
    vaccinelist();
  }, [pagecount]);
  const ToggleNewVaccine = () => {
    if (NewVacc == "block") {
      setNewVacc("none");
    }
    if (NewVacc == "none") {
      setNewVacc("block");
    }
  };
  const ToggleUpdateVaccine = () => {
    if (UptVacc == "none") {
      setUptVacc("block");
    }
    if (UptVacc == "block") {
      setUptVacc("none");
      setindex();
    }
  };
  const DeleteVaccine = async (vaccid) => {
    try {
      await axios.post(`${url}/vaccine/brand/delete`, { id: vaccid, })
        .then((response) => {
          Notiflix.Notify.success(response.data.message);
          vaccinelist();
        });
    } catch (e) {
      Notiflix.Notify.failure(e.message);
    }
  };
  const confirmmessage = (name, vaccid) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to delete Medicine ${name}`,
      "Yes",
      "No",
      () => {
        DeleteVaccine(vaccid);
      },
      () => {
        return 0;
      },
      {}
    );
  }
  return (
    <div className="position-relative">
      <div className="row p-0 m-0 justify-content-between align-items-center align-self-center">
        <div className="col-auto">
        <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Vaccines" : "Vaccine"}{" "} </h2>
        </div>
        <div className="col-auto">
        <div className={` p-0 m-0 align-self-center ms-1 d-${permission.vaccine_add == 1 ? "" : "none"} `} >
        <button className="button button-charcoal m-0 p-0 py-1 px-4 me-3" onClick={ToggleNewVaccine} >
          <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} className="p-0 m-0 img-fluid" alt="displaying_image"/>
          Vaccine
        </button>
      </div>
        </div>
      </div>

      <div className="scroll scroll-y p-0 m-0 overflow-scroll" style={{ height: "68vh", minHeight: "68vh", maxHeight: "68vh" }} >
        <table className="table datatable text-start">
          <thead className="position-sticky top-0 bg-pearl">
            <tr>
              <th rowSpan="2" className={`text-charcoal75 fw-bold d-${permission.vaccine_edit == 1 ? "" : "none"}`} > Update </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Name </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Salt Name </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> HSN Code </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Manufacturer </th>
              {/* <th rowSpan="2" className={`text-charcoal75 fw-bold d-${permission.vaccine_delete == 1 ? "" : "none"}`} > Delete </th> */}
            </tr>
          </thead>
          {load ? (
            <tr className="p-0 m-0">
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              {/* <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td> */}
            </tr>
          ) : vaccines == undefined || vaccines.length == 0 ? (
            <tbody className="">
              <tr>
                <td className="position-absolute text-charcoal text-center fw-bolder start-0 end-0">
                  No Vaccines Found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="">
              {vaccines.map((data, i) => (
                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle text-start`} >
                  <td className={`py-0 bg-${index === i ? "lightyellow" : ""} d-${permission.vaccine_edit == 1 ? "" : "none"}`} >
                    <button className="btn m-0 p-0" key={i} onClick={(e) => { ToggleUpdateVaccine(); setindex(i); }} >
                      <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" key={i} />
                    </button>
                  </td>
                  <td className=" text-charcoal fw-bold"> {data.name && data.name !== null ? data.name : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.salt_name && data.salt_name !== null ? data.salt_name : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.hsn_code && data.hsn_code !== null ? data.hsn_code : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.manufacturer && data.manufacturer !== null ? data.manufacturer : ""} </td>
                  {/* <td className={`d-${permission.vaccine_delete == 1 ? "" : "none"}`} >
                    <button className="btn p-0 m-0" onClick={() => { confirmmessage(data.name, data.id); }} >
                      <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid" />
                    </button>
                  </td> */}
                  {index == i ? (
                    <>
                    <div className="backdrop"></div>
                    <td className={` text-start  d-${index == i ? UptVacc : "none"} border position-absolute rounded-2 start-0 end-0 top-0 mx-auto bg-seashell`} style={{ padding: 0, zIndex: "2",width:'60vh',height:'70vh' }} >
                      <UpdateVaccine vaccinelist={vaccinelist} ToggleUpdateVaccine={ToggleUpdateVaccine} data={vaccines[i]} />
                    </td>
                    </>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <section className={`position-absolute border-1 shadow start-0 bg-seashell rounded-1 mx-auto end-0 d-${NewVacc}`} style={{ top: "-4rem", zIndex: "2",width:'60vh',height:'70vh' }} >
        <NewVaccine ToggleNewVaccine={ToggleNewVaccine} vaccinelist={vaccinelist} />
      </section>  
      <div className="container-fluid d-flex justify-content-center mt-2">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={vaccinelist}
          containerClassName={
            "pagination scroll align-self-center align-items-center"
          }
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={
            "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
          }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"d-flex mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active "}
        />
      </div>
    </div>
  );
}
function MedicineList() {
  const url = useContext(URL);
  const permission = useContext(Permissions);
  const [pagecount, setpagecount] = useState();
  const [pages, setpages] = useState();
  const [medicines, setmedicines] = useState([]);
  const [load, setload] = useState(false);
  const [index, setindex] = useState();
  const [NewMed, setNewMed] = useState("none");
  const [UptMed, setUptMed] = useState("none");

  function GetPages() {
    try {
      axios
        .get(`${url}/medicine/list?limit=20&offset=0`)
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 20) + 1);
          setload(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setload(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setload(false);
    }
  }
  const medcinelist = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true);
      try {
        await axios
          .get(`${url}/medicine/list?limit=20&offset=0`)
          .then((response) => {
            setmedicines(response.data.data.medicine);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    } else {
      setload(true);
      try {
        await axios
          .get(`${url}/medicine/list?limit=20&offset=${Data.selected * 20}`)
          .then((response) => {
            setmedicines(response.data.data.medicine);
            setload(false);
          });
      } catch (e) {
        Notiflix.Notify.failure(e.message);
        setload(false);
      }
    }
  };
  useEffect(() => {
    GetPages();
    medcinelist();
  }, [pagecount]);
  const ToggleNewMedicine = () => {
    if (NewMed == "block") {
      setNewMed("none");
    }
    if (NewMed == "none") {
      setNewMed("block");
    }
  };
  const ToggleUpdateMedicine = () => {
    if (UptMed == "none") {
      setUptMed("block");
    }
    if (UptMed == "block") {
      setUptMed("none");
      setindex();
    }
  };
  const DeleteMedicine = async (medid) => {
    try {
      await axios
        .post(`${url}/medicine/delete`, {
          id: medid,
        })
        .then((response) => {
          Notiflix.Notify.success(response.data.message);
          medcinelist();
        });
    } catch (e) {
      Notiflix.Notify.failure(e.message);
    }
  };
  const confirmmessage = (name, medid) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to delete Medicine ${name}`,
      "Yes",
      "No",
      () => {
        DeleteMedicine(medid);
      },
      () => {
        return 0;
      },
      {}
    );
  };
  return (
    <div className="position-relative">
        <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Medicines" : "Medicine"}{" "} </h2>
      <div className={` p-0 m-0 align-self-center ms-1 position-absolute top-0 end-0 d-${permission.medicine_add == 1 ? "" : "none"} `} >
        <button className="button button-charcoal m-0 p-0 py-1 px-4 me-3" onClick={ToggleNewMedicine} >
          <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} className="p-0 m-0 img-fluid" alt="displaying_image"/>
          Medicine
        </button>
      </div>
      <div className="scroll scroll-y p-0 m-0 overflow-scroll" style={{  height: "68vh", minHeight: "68vh", maxHeight: "68vh"  }} >
        <table className="table datatable text-start">
          <thead className="position-sticky top-0 bg-pearl">
            <tr>
              <th rowSpan="2" className={`text-charcoal75 fw-bold d-${permission.medicine_edit == 1 ? "" : "none"}`} > Update </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Display Name </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Name </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Salt Name </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> HSN Code </th>
              <th rowSpan="2" className="text-charcoal75 fw-bold"> Manufacturer </th>
            </tr>
          </thead>
          {load ? (
            <tr className="p-0 m-0">
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td>
              {/* <td className="placeholder-glow">
                <div className="placeholder col-12 p-0 m-0 w-100 px-1"> Loading.. </div>
              </td> */}
            </tr>
          ) : medicines == undefined || medicines.length == 0 ? (
            <tbody className="">
              <tr>
                <td className="position-absolute text-charcoal fw-bolder start-0 end-0">
                  No Medicines Found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="">
              {medicines.map((data, i) => (
                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle text-start`} >
                  <td className={`py-0 bg-${index === i ? "lightyellow" : ""} d-${permission.medicine_edit == 1 ? "" : "none"}`} >
                    <button className="btn m-0 p-0" key={i} onClick={(e) => { ToggleUpdateMedicine(); setindex(i); }} >
                      <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" key={i} />
                    </button>
                  </td>
                  <td className=" text-charcoal fw-bold"> {data.display_name && data.display_name !== null ? data.display_name : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.name && data.name !== null ? data.name : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.salt_name && data.salt_name !== null ? data.salt_name : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.hsn_code && data.hsn_code !== null ? data.hsn_code : ""} </td>
                  <td className=" text-charcoal fw-bold"> {data.manufacturer && data.manufacturer !== null ? data.manufacturer : ""} </td>
                  {/* <td className={`d-${permission.medicine_delete == 1 ? "" : "none"}`} >
                    <button className="btn p-0 m-0" onClick={() => { confirmmessage(data.name, data.id); }} >
                      <img src={process.env.PUBLIC_URL + "/images/delete.png"} className="img-fluid" />
                    </button>
                  </td> */}
                  {index == i ? (
                    <>
                     <div className="backdrop"></div>
                    <td className={` text-start d-${index == i ? UptMed : "none"} mx-auto rounded-2 p-0 m-0 border position-absolute shadow start-0 top-0 end-0 top-0 bg-seashell`} style={{zIndex: "2", height:'70vh',width:'60vh' }} >
                      <UpdateMedicine medcinelist={medcinelist} ToggleUpdateMedicine={ToggleUpdateMedicine} data={medicines[i]} />
                    </td>
                    </>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <section className={`position-absolute border-1 shadow start-0 bg-seashell rounded-2 mx-auto top-0 end-0 d-${NewMed}`} style={{  zIndex: "2",height:'70vh',width:'60vh' }} >
        <NewMedicine ToggleNewMedicine={ToggleNewMedicine}  medcinelist={medcinelist}/>
      </section>  
      <div className="container-fluid d-flex justify-content-center mt-2">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"."}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={medcinelist}
          containerClassName={
            "pagination scroll align-self-center align-items-center"
          }
          pageClassName={"page-item text-charcoal"}
          pageLinkClassName={
            "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"
          }
          previousClassName={"btn button-charcoal-outline me-2"}
          previousLinkClassName={"text-decoration-none text-charcoal"}
          nextClassName={"btn button-charcoal-outline ms-2"}
          nextLinkClassName={"text-decoration-none text-charcoal"}
          breakClassName={"d-flex mx-2 text-charcoal fw-bold fs-4"}
          breakLinkClassName={"text-decoration-none text-charcoal"}
          activeClassName={"active "}
        />
      </div>
    </div>
  );
}
export { Stocksection}
export { Listsection}

function Transfersection(){
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const permission = useContext(Permissions);
  const [pageindex,setpageindex] =useState("Transfers In")
  const [status,setstatus] =useState()
  const [statusname,setstatusname]=useState()
  const first = [
    {
      option: "Transfers In",
      display: permission.purchase_entry_view,
    },
    {
      option: "Transfers Out",
      display: permission.purchase_return_view,
    },
  ]

  const Selected_Screen=(_menu)=>{
    if(_menu  == "Transfers In"){
      return <TransferIn fromdate={fromdate} todate={todate} status={status}/>
    }
    if(_menu == "Transfers Out"){
      return <TransferOut/>
    }
  }
return(
  <>
  <section className="purchasesection">
  <div className="container-fluid p-0 m-0 mt-3">
    <div className="row p-0 m-0 mt-1 gx-3 position-relative">
    <div className="col-auto">
          <div class="dropdown">
            <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {pageindex?pageindex:"Transfers Type "}
            </button>
            <ul class="dropdown-menu bg-seashell shadow-sm border-0">
              {
                first.map((e, i) => (
                  <li className={`dropdown-item text-${e.option === pageindex ? "light" : "dark"} fw-bold bg-${e.option === pageindex ? "charcoal" : "seashell"}`} onClick={(a) => setpageindex(e.option)} > {e.option} </li>
                )
                )
              }
            </ul>
          </div>
        </div>
        <div className="col-auto">
          <div className="dropdown">
          <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {statusname?statusname:'Status'} 
            </button>
            <ul class="dropdown-menu bg-seashell shadow-sm border-0">
            <li className={`dropdown-item fw-bolder text-charcoal`} onClick={(a) =>{setstatus('');setstatusname('Status')} }>Status</li>
                  <li className={`dropdown-item fw-bolder text-charcoal`} onClick={(a) =>{setstatus(0);setstatusname('Pending')} }>Pending</li>
                  <li className={`dropdown-item fw-bolder text-charcoal`} onClick={(a) =>{setstatus(1);setstatusname('Accepted')}}>Accepted</li>
                  <li className={`dropdown-item fw-bolder text-charcoal`} onClick={(a) =>{setstatus(2);setstatusname('Rejected')}}>Rejected</li>
            </ul>
          </div>
        </div>
      <div className="col-auto bg-seashell rounded-2">
          <div className="row p-0 m-0 align-items-center align-self-center">
            <div className="col-auto p-0 m-0">
              <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 border-0 text-charcoal text-center fw-bold " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
            </div>
            <div className="col-auto p-0 m-0">-</div>
            <div className="col-auto p-0 m-0">
              <input type="date" className=" border-0 button button-seashell text-charcoal text-center fw-bold" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />                
            </div>
          </div>
        </div>
    </div>
    </div>
  </section>
  <section className="tablesrender position-relative">
  <div className=" p-0 mt-lg-4 mt-md-3 mt-2 me-0 ms-0">
    {Selected_Screen(pageindex)}
  </div>
  </section>
  </>
)
}
function TransferIn(props){
  const currentDate = useContext(TodayDate);
  const adminid = localStorage.getItem("id");
  const ClinicID = localStorage.getItem("ClinicId");
  const permission = useContext(Permissions);
  const url = useContext(URL);
  const [peidw, setpeidw] = useState("none");

  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  }

  const fromdate = props.fromdate
  const todate = props.todate
  const stat = props.status
  const [Loading, setLoading] = useState(false);
  const [transferinarr, settransferinarr] = useState([]);
  const [transferinarrExcel, settransferinarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [npef, setnpef] = useState("none");
  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();
  const [updateload, setupdateload] = useState(false);
  const[updateindex,setupdateindex]=useState()
  
  function GetPages() {
    try {
      axios.get( `${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=0` )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }

  // &from_date=${fromdate ? fromdate : currentDate }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}
  // &from_date=${fromdate ? fromdate : currentDate }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}
  // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/transfer/stocks/list?location_id=1&limit=10&offset=0
  
  function GETTransferInList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios.get( `${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=0` )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            settransferinarr(response.data.data.transfer_stocks_recevied);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=${Data.selected * 25 }` )
          .then((response) => {
    
            setpagecount(response.data.data.total_count);
            settransferinarr(response.data.data.transfer_stocks_recevied);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
  function GETTransferInListForExcel() {
    setLoading(true);
    try {
      axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=${pagecount?pagecount:25}&offset=0` )
        .then((response) => {
          settransferinarrExcel(response.data.data.transfer_stocks_recevied);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [fromdate, todate,stat]);

  useEffect(() => {
    GETTransferInList();
    GETTransferInListForExcel();
  }, [fromdate, todate,stat]);

  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");
    }
    if (npef === "block") {
      setnpef("none");
    }
  };
  let array = [[0, 'Pending', 'lightred'], [1, 'Accepted', 'lightgreen'], [3, 'Rejected', 'lightred']]
  function status(number) {
    let status
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1]
        break;
      }
    }
    return status
  }
  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2]
        break;
      }
    }
    return status_color
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  const UpdateStatus = async (data,e) => {
    setupdateload(true)
    try {
      await axios.post(`${url}/transfer/stocks/change/status`, { 
        transfer_id: data.id, 
        transfer_status: e.target.value, 
        admin_id: adminid, 
      })
        .then((response) => {
          Notiflix.Notify.success(response.data.message);
          GETTransferInList();
          setupdateload(false)
        })
    } catch (e) {
      Notiflix.Notify.failure(e.message);
      setupdateload(false)
    }
  }
  return(
    <>
    <div className="col-auto position-absolute p-0 m-0 ms-2 export_2 align-self-center text-center">
     <ExportTransferIn transferinarr={transferinarrExcel} fromdate={reversefunction(fromdate ? fromdate:currentDate)} todate={reversefunction(todate?todate:fromdate?fromdate:currentDate)}  />
   </div>
 {/* <button className={`button addpurchase button-charcoal me-3 position-absolute d-${permission.purchase_entry_add == 1 ? "" : "none" }`} onClick={toggle_npef} > <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" />Transfer In </button> */}
     <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {transferinarr!=undefined?transferinarr.length:""} {transferinarr!=undefined?transferinarr.length > 1 ? "Transfers In" : "Transfer In":""}{" "} </h2>
 <div>
   <div className="scroll scroll-y overflow-scroll p-0 m-0 mt-2" style={{ minHeight: "56vh", height: "56vh" }} >
   <table className="table">
       <thead className=" align-middle position-sticky top-0 bg-pearl">
         <tr>
           <th className="fw-bolder text-charcoal75"> TI ID </th>
           <th className="fw-bolder text-charcoal75"> Channel </th>
           <th className="fw-bolder text-charcoal75"> Location From </th>
           <th className="fw-bolder text-charcoal75"> Location To </th>
           <th className="fw-bolder text-charcoal75"> Date </th>
           <th className="fw-bolder text-charcoal75">Transfer By </th>
           <th className="fw-bolder text-charcoal75">Transfer To </th>
           <th className="fw-bolder text-charcoal75"> Total Items</th>
           <th className="fw-bolder text-charcoal75"> Amount </th>
           <th className="fw-bolder text-charcoal75"> Approval Status </th>
           <th className="fw-bolder  text-center  text-charcoal75"  > Inventory </th>
           {/* <th className='fw-bolder p-0 m-0  text-charcoal75 text-center' scope='col' style={{ zIndex: '3' }}>more</th> */}
         </tr>
       </thead>
       {Loading ? (
         <tbody className=" text-center" style={{ minHeight: "55vh" }}>
           <tr className="position-absolute border-0 start-0 end-0 px-5">
             <div class="d-flex align-items-center">
               <strong className="">
                 Getting Details please be Patient ...
               </strong>
               <div
                 class="spinner-border ms-auto"
                 role="status"
                 aria-hidden="true"
               ></div>
             </div>
           </tr>
         </tbody> 
       ) : transferinarr && transferinarr.length != 0 ? (
         <tbody>
           {
           transferinarr.map((item, i) => (
             <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl" } align-middle`} >
               <td className="py-0 my-0 text-charcoal fw-bold ps-2"> TI-{item.id} </td>
               <td className="text-charcoal fw-bold"> {item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"} </td>
               <td className="text-charcoal fw-bold"> {item.from_location.title ? item.from_location.title : "N/A"} </td>
               <td className="text-charcoal fw-bold"> {item.to_location.title ? item.to_location.title : "N/A"} </td>
               <td className="text-charcoal fw-bold"> {item.transfer_date && item.transfer_date ? reversefunction(item.transfer_date) : "N/A"} </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> {item.total_amount && item.total_amount ? "Rs. " + item.total_amount : "N/A"} </td>
               <td className="text-center">
                { 
                updateload == true && updateindex==i ? (
        <div className="col-6 py-2 pb-2 m-auto text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
                ):(
                  <select className={`bg-${status_color(item.transfer_status)} rounded-2 rounded-pill py-1 px-2 fw-bold text-center border-0 text-wrap `} value={status(item.transfer_status)} onChange={(e)=>{UpdateStatus(item,e);updateindex(i)}} name={item.transfer_status}>
                  <option className="button text-center" selected disabled>{status(item.transfer_status)}</option>
                  <option className="button-lightred" value='0'  >Pending</option>
                  <option className="button-lightblue" value='1'>Accepted</option>
                  <option className="button-lightred" value='2'   >Rejected</option>
              </select>
                )}

               </td>
               <td className="text-charcoal fw-bold text-center">
                 <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_peidw(); }} > <img src={ process.env.PUBLIC_URL + "/images/archivebox.png" } alt="displaying_image" className="ms-1 img-fluid" /> </button>
               </td>
               <td className={` position-absolute d-${i == index ? peidw : "none" } border border-1 start-0 mx-auto end-0 bg-seashell rounded-4 p-0 m-0`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }} >
                  {i == index ? 
                  ( <TIitemdetailssection transferinarr={transferinarr[i]} id={"TI-" + item.id} toggle_peidw={toggle_peidw} /> ) : ( <></> )}
               </td>
             </tr>
           ))}
         </tbody>
       ) : (
         <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
           <tr className="">
             <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0">
               No Transfers In
             </td>
           </tr>
         </tbody>
       )}
     </table>
   </div>
   <div className="container-fluid mt-2 d-flex justify-content-center">
     <ReactPaginate
       previousLabel={"Previous"}
       nextLabel={"Next"}
       breakLabel={". . ."}
       pageCount={pages}
       marginPagesDisplayed={3}
       pageRangeDisplayed={2}
       onPageChange={GETTransferInList}
       containerClassName={"pagination"}
       pageClassName={"page-item text-charcoal"}
       pageLinkClassName={ "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1" }
       previousClassName={"btn button-charcoal-outline me-2"}
       previousLinkClassName={"text-decoration-none text-charcoal"}
       nextClassName={"btn button-charcoal-outline ms-2"}
       nextLinkClassName={"text-decoration-none text-charcoal"}
       breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
       breakLinkClassName={"text-decoration-none text-charcoal"}
       activeClassName={"active"}
     />
   </div>
 </div>

</>
)
}
function TransferOut(props){
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const adminid = localStorage.getItem("id");
  const permission = useContext(Permissions);
  const url = useContext(URL);  
  const [peidw, setpeidw] = useState("none");

  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  }

  const fromdate = props.fromdate
  const todate = props.todate
  const channel = props.channel
  const [Loading, setLoading] = useState(false);
  const [transferoutarr, settransferoutarr] = useState([]);
  const [transferoutarrExcel, settransferoutarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [npef, setnpef] = useState("none");
  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();

  function GetPages() {
    try {
      axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=0` )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }

  async function GETTransferOutList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=0` )
          .then((response) => {
            // setpagecount(response.data.data.total_count);
            settransferoutarr(response.data.data.transfer_stocks_sent);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=25&offset=${Data.selected * 25 }` )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            settransferoutarr(response.data.data.transfer_stocks_sent);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
 async  function GETTransferOutListForExcel() {
    setLoading(true);
    try {
      await axios.get(`${url}/transfer/stocks/list?location_id=${ClinicID}&limit=${pagecount?pagecount:''}&offset=0` ) .then((response) => {
          settransferoutarrExcel(response.data.data.transfer_stocks_sent);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setLoading(false);
        })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [fromdate, todate]);

  useEffect(() => {
    GETTransferOutList();
    GETTransferOutListForExcel();
  }, [fromdate, todate]);

  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");
    }
    if (npef === "block") {
      setnpef("none");
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  let array = [[0, 'Pending', 'lightred'], [1, 'Accepted', 'lightgreen'], [3, 'Rejected', 'lightred']]
  function status(number) {
    let status
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1]
        break;
      }
    }
    return status
  }
  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2]
        break;
      }
    }
    return status_color
  }
  const UpdateStatus = async (data,e) => {
    try {
      await axios.post(`${url}/transfer/stocks/change/status`, { 
        transfer_id: data.id, 
        transfer_status: e.target.value, 
        admin_id: adminid, 
      })
        .then((response) => {
          ;
          Notiflix.Notify.success(response.data.message);
          GETTransferOutList();
        })
    } catch (e) {
      Notiflix.Notify.failure(e.message);
    }
  }
  return(
    <>
    <div className="col-auto position-absolute p-0 m-0 ms-2 export_2 align-self-center text-center">
     <ExportTransferOut transferoutarr={transferoutarrExcel} fromdate={reversefunction(fromdate ?fromdate:currentDate)} todate={reversefunction(todate?todate:fromdate?fromdate:currentDate)} />
   </div>
 <button className={`button addpurchase button-charcoal me-3 position-absolute d-${permission.purchase_entry_add == 1 ? "" : "none" }`} onClick={toggle_npef} > <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" />Transfer Out </button>
     <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {transferoutarr!=undefined?transferoutarr.length:''} {transferoutarr!=undefined?transferoutarr.length > 1 ? "Transfers Out" : "Transfer Out":''}{" "} </h2>
 <div>
   <div className="scroll scroll-y overflow-scroll p-0 m-0 mt-2" style={{ minHeight: "56vh", height: "56vh" }} >
     <table className="table">
       <thead className=" align-middle position-sticky top-0 bg-pearl">
         <tr>
           <th className="fw-bolder text-charcoal75"> TO ID </th>
           <th className="fw-bolder text-charcoal75"> Channel </th>
           <th className="fw-bolder text-charcoal75"> Location From </th>
           <th className="fw-bolder text-charcoal75"> Location To </th>
           <th className="fw-bolder text-charcoal75"> Date </th>
           <th className="fw-bolder text-charcoal75">Transfer By </th>
           <th className="fw-bolder text-charcoal75">Transfer To </th>
           <th className="fw-bolder text-charcoal75"> Total Items</th>
           <th className="fw-bolder text-charcoal75"> Amount </th>
           <th className="fw-bolder text-charcoal75"> Approval Status </th>
           <th className="fw-bolder  text-center  text-charcoal75"  > Inventory </th>
           {/* <th className='fw-bolder p-0 m-0  text-charcoal75 text-center' scope='col' style={{ zIndex: '3' }}>more</th> */}
         </tr>
       </thead>
       {Loading ? (
         <tbody className=" text-center" style={{ minHeight: "55vh" }}>
           <tr className="position-absolute border-0 start-0 end-0 px-5">
             <div class="d-flex align-items-center">
               <strong className="">
                 Getting Details please be Patient ...
               </strong>
               <div class="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
             </div>
           </tr>
         </tbody> 
       ) : transferoutarr && transferoutarr.length != 0 ? (
         <tbody>
           {
           transferoutarr.map((item, i) => (
             <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl" } align-middle`} >
               <td className="py-0 my-0 text-charcoal fw-bold ps-2"> TO-{item.id} </td>
               <td className="text-charcoal fw-bold"> {item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"} </td>
               <td className="text-charcoal fw-bold"> {item.from_location.title ? item.from_location.title : "N/A"} </td>
               <td className="text-charcoal fw-bold"> {item.to_location.title ? item.to_location.title : "N/A"} </td>
               <td className="text-charcoal fw-bold"> {item.transfer_date && item.transfer_date ? reversefunction(item.transfer_date) : "N/A"} </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> </td>
               <td className="text-charcoal fw-bold"> {item.total_amount && item.total_amount ? "Rs. " + item.total_amount : "N/A"} </td>
               <td>
               <select className={`bg-${status_color(item.transfer_status)} rounded-2 rounded-pill py-1 px-2  fw-bold border-0 text-wrap `} onChange={(e)=>{UpdateStatus(item,e)}} name={item.transfer_status}>
                                            <option className="button text-center" selected disabled>{status(item.transfer_status)}</option>
                                            <option className="button-lightred" value='0'>Pending</option>
                                            <option className="button-lightblue" value='1'>Accepted</option>
                                            <option className="button-lightred" value='2'>Rejected</option>
                  
                                        </select>
               </td>
               <td className="text-charcoal fw-bold text-center">
                 <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_peidw(); }} > <img src={ process.env.PUBLIC_URL + "/images/archivebox.png" } alt="displaying_image" className="ms-1 img-fluid" /> </button>
               </td>
               <td className={` position-absolute d-${i == index ? peidw : "none" } border border-1 start-0 mx-auto end-0 bg-seashell rounded-4 p-0 m-0`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }} >
                  {i == index ? 
                  ( <TOitemdetailssection transferoutarr={transferoutarr[i]} id={"TO-" + item.id} toggle_peidw={toggle_peidw} /> ) : ( <></> )}
               </td>
             </tr>
           ))}
         </tbody>
       ) : (
         <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
           <tr className="">
             <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0">
               No Transfers Out
             </td>
           </tr>
         </tbody>
       )}
     </table>
   </div>
   <div className="container-fluid mt-2 d-flex justify-content-center">
     <ReactPaginate
       previousLabel={"Previous"}
       nextLabel={"Next"}
       breakLabel={". . ."}
       pageCount={pages}
       marginPagesDisplayed={3}
       pageRangeDisplayed={2}
       onPageChange={GETTransferOutList}
       containerClassName={"pagination"}
       pageClassName={"page-item text-charcoal"}
       pageLinkClassName={ "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1" }
       previousClassName={"btn button-charcoal-outline me-2"}
       previousLinkClassName={"text-decoration-none text-charcoal"}
       nextClassName={"btn button-charcoal-outline ms-2"}
       nextLinkClassName={"text-decoration-none text-charcoal"}
       breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
       breakLinkClassName={"text-decoration-none text-charcoal"}
       activeClassName={"active"}
     />
   </div>
 </div>
 <section className={` position-absolute start-0 top-0 end-0 mx-auto bg-seashell rounded-2 border shadow border-1 d-${npef}`} style={{height:'70vh',width:'60vh'}} >
   {
     <NewTransferOutForm toggle_npef={toggle_npef} GETTransferOutList={GETTransferOutList} />
   }
 </section>
</>
)
}
function TIitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  const [qr, setqr] = useState("none");
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst) || igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      e = e.toFixed(2);
      return e;
    }
  }

  return (
    <div className="container-fluid p-0 m-0 ">
      <div className="container-fluid p-0 m-0">
        <h5 className="text-center pt-3 text-charcoal">
          {props.id} Transfer In Item Details
        </h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={props.toggle_peidw} aria-label="Close" ></button>

        <div className="col-2 d-none">
          <div className=" position-relative searchbutton" style={{ top: "0.25rem", right: "1rem" }} >
            <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
            <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }} >
              <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" />
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? "charcoal" : "seashell" }`} onClick={() => { setindex(i); }} > {data} </button>
        ))}
      </div>

      <div className=" d-flex justify-content-end me-5">
        <input type="checkbox" className="form-check-input" value={Taxon ? Taxon : ""} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true); }} />
        <label>Show Tax Details</label>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ height:"100%" }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total </th>
            </tr>
          </thead>
          {props.transferinarr.medicines && props.transferinarr.medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.transferinarr.medicines.map((item, _key) => (
                <tr className="border align-middle" key={_key}>
                  <td className="border align-middle"> {item.medicies_stocks_id && item.medicies_stocks_id !== undefined ? "m"+item.medicies_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.medicine.display_name !== undefined ? item.medicine_stock_details.medicine.display_name : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.batch_no !== undefined ? item.medicine_stock_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.expiry_date !== undefined ? reversefunction(item.medicine_stock_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.mrp !== undefined ? "₹"+item.medicine_stock_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.rate !== undefined ? "₹"+item.medicine_stock_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.discount !== undefined ?  item.medicine_stock_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.trade_discount !== undefined ?  item.medicine_stock_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.SGST_rate ? Number( item.medicine_stock_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.SGST ? (Number(item.medicine_stock_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.CGST_rate ? Number(item.medicine_stock_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.CGST ? (Number(item.medicine_stock_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.IGST_rate ? Number(item.medicine_stock_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.IGST ? (Number(item.medicine_stock_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.medicine_stock_details.CGST_rate , item.medicine_stock_details.SGST_rate, item.medicine_stock_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.medicine_stock_details.CGST,item.medicine_stock_details.SGST,item.medicine_stock_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.medicine_stock_details.cost ?"₹"+item.medicine_stock_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
  
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className=" text-center fw-bold">No Medicines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ height:'100%' }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className={`border p-0 m-0 px-1`} > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total{" "} </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total{" "} </th>
            </tr>
          </thead>
          {props.transferinarr.vaccines &&
            props.transferinarr.vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.transferinarr.vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border align-middle"> {item.vaccine_stocks_id  && item.vaccine_stocks_id !== undefined ? "v"+item.vaccine_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.vaccine.name !== undefined ? item.vaccine_stock_details.vaccine.name : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.batch_no !== undefined ? item.vaccine_stock_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.expiry_date !== undefined ? reversefunction(item.vaccine_stock_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.mrp !== undefined ? "₹"+item.vaccine_stock_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.rate !== undefined ? "₹"+item.vaccine_stock_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details && item.vaccine_stock_details.discount !== undefined ?  item.vaccine_stock_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details && item.vaccine_stock_details.trade_discount !== undefined ?  item.vaccine_stock_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.SGST_rate ? Number( item.vaccine_stock_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.SGST ? (Number(item.vaccine_stock_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.CGST_rate ? Number(item.vaccine_stock_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.CGST ? (Number(item.vaccine_stock_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.IGST_rate ? Number(item.vaccine_stock_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.IGST ? (Number(item.vaccine_stock_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.vaccine_stock_details.CGST_rate , item.vaccine_stock_details.SGST_rate, item.vaccine_stock_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.vaccine_stock_details.CGST,item.vaccine_stock_details.SGST,item.vaccine_stock_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details.cost ?"₹"+item.vaccine_stock_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>

                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className="fw-bold text-center">No Vaccines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}
function TOitemdetailssection(props) {
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  const [qr, setqr] = useState("none");
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst) || igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      e = e.toFixed(2);
      return e;
    }
  }
  function GenerateQR(props) {
    let count = [];
    for (let i = 0; i < props.qty; i++) {
      count.push(props.qty);
    }
    return count.map((data) => (
      <div className="col-auto m-2" key={data}>
        <QRcode id={props.id} />
      </div>
    ));
  }
  return (
    <div className="container-fluid p-0 m-0 ">
      <div className="container-fluid p-0 m-0">
        <h5 className="text-center pt-3 text-charcoal">
          {props.id} Transfer Out Item Details
        </h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={props.toggle_peidw} aria-label="Close" ></button>

        <div className="col-2 d-none">
          <div className=" position-relative searchbutton" style={{ top: "0.25rem", right: "1rem" }} >
            <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
            <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }} >
              <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" />
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? "charcoal" : "seashell" }`} onClick={() => { setindex(i); }} > {data} </button>
        ))}
      </div>

      <div className=" d-flex justify-content-end me-5">
        <input type="checkbox" className="form-check-input" value={Taxon ? Taxon : ""} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true); }} />
        <label>Show Tax Details</label>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ height:"100%" }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total </th>
            </tr>
          </thead>
          {props.transferoutarr.medicines && props.transferoutarr.medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.transferoutarr.medicines.map((item, _key) => (
                <tr className="border align-middle" key={_key}>
                  <td className="border align-middle"> {item.medicies_stocks_id && item.medicies_stocks_id !== undefined ? "m"+item.medicies_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.medicine.display_name !== undefined ? item.medicine_stock_details.medicine.display_name : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.batch_no !== undefined ? item.medicine_stock_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.expiry_date !== undefined ? reversefunction(item.medicine_stock_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.mrp !== undefined ? "₹"+item.medicine_stock_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.rate !== undefined ? "₹"+item.medicine_stock_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.discount !== undefined ?  item.medicine_stock_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_stock_details && item.medicine_stock_details.trade_discount !== undefined ?  item.medicine_stock_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.SGST_rate ? Number( item.medicine_stock_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.SGST ? (Number(item.medicine_stock_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.CGST_rate ? Number(item.medicine_stock_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.CGST ? (Number(item.medicine_stock_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.IGST_rate ? Number(item.medicine_stock_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_stock_details && item.medicine_stock_details.IGST ? (Number(item.medicine_stock_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.medicine_stock_details.CGST_rate , item.medicine_stock_details.SGST_rate, item.medicine_stock_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.medicine_stock_details.CGST,item.medicine_stock_details.SGST,item.medicine_stock_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.medicine_stock_details.cost ?"₹"+item.medicine_stock_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
  
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className=" text-center fw-bold">No Medicines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ height:'100%' }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className={`border p-0 m-0 px-1`} > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total{" "} </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total{" "} </th>
            </tr>
          </thead>
          {props.transferoutarr.vaccines &&
            props.transferoutarr.vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.transferoutarr.vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border align-middle"> {item.vaccine_stocks_id  && item.vaccine_stocks_id !== undefined ? "v"+item.vaccine_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.vaccine.name !== undefined ? item.vaccine_stock_details.vaccine.name : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.batch_no !== undefined ? item.vaccine_stock_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.expiry_date !== undefined ? reversefunction(item.vaccine_stock_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.mrp !== undefined ? "₹"+item.vaccine_stock_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details  && item.vaccine_stock_details.rate !== undefined ? "₹"+item.vaccine_stock_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details && item.vaccine_stock_details.discount !== undefined ?  item.vaccine_stock_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details && item.vaccine_stock_details.trade_discount !== undefined ?  item.vaccine_stock_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.SGST_rate ? Number( item.vaccine_stock_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.SGST ? (Number(item.vaccine_stock_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.CGST_rate ? Number(item.vaccine_stock_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.CGST ? (Number(item.vaccine_stock_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.IGST_rate ? Number(item.vaccine_stock_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_stock_details && item.vaccine_stock_details.IGST ? (Number(item.vaccine_stock_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.vaccine_stock_details.CGST_rate , item.vaccine_stock_details.SGST_rate, item.vaccine_stock_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.vaccine_stock_details.CGST,item.vaccine_stock_details.SGST,item.vaccine_stock_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.vaccine_stock_details.cost ?"₹"+item.vaccine_stock_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>

                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className="fw-bold text-center">No Vaccines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}

function NewTransferOutForm(props){
  const url = useContext(URL)
  const medicinesref = useRef(null)
  const stockref = useRef(null)
  const cliniclist = useContext(Clinic)
  const currentDate = useContext(TodayDate);
  const clinicid = localStorage.getItem('ClinicId')
  const [clinicname,setclinicname]= useState("")
  const [fromlocation,setfromlocation] =useState(clinicid)
  const [fromlocationname,setfromlocationname] =useState("")
  const [tolocation,settolocation] =useState()
  const [tolocationname,settolocationname] =useState("")
  const [channel,setchannel]=useState("")
  const [channelname,setchannelname]=useState()
  const [transferdate,settransferdate]=useState(currentDate)
  const [stage1, setstage1] = useState('block')
  const [stage2, setstage2] = useState('none')
  const [loadsearch,setloadsearch]=useState(false)
  const [itemsearch, setitemsearch] = useState();
  const [itemname, setitemname] = useState();
  const [itemid, setitemid] = useState();
  const [itemtype, setitemtype] = useState();
  const [qty,setqty] =useState();
  const [tableindex, settableindex] = useState()
  const [products, setproducts] = useState([]);
  const [SelectedProducts, setSelectedProducts] = useState([]); 
  const [load,setload]=useState(false)
  const [Grandtotal, setGrandtotal] = useState();
  const toggleStage1 = () => {
    if (stage1 == 'block') {
      setstage1('none')
    }
    if (stage1 == 'none') {
      setstage1('block')
    }
  }

  const toggleStage2 = () => {
    if (stage2 == 'block') {
      setstage2('none')
    }
    if (stage2 == 'none') {
      setstage2('block')
    }
  }
  const Go_Back = () => {
    if (stage2 === 'block') { 
      toggleStage2()
      toggleStage1()
    }
  }
  const confirmmessage = (e) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Transfer Out`,
      `Do you surely want to do the following Transfer Out `,
      "Yes",
      "No",
      () => {
        SaveTransferOut();
      },
      () => {
        return 0;
      },
      {}
    );
  };
  const SaveTransferOut = async () => {
    let MedId = [];
    let Type = [];
    let quantity = [];
    for (let i = 0; i < SelectedProducts.length; i++) {
      Type.push(SelectedProducts[i].type ? SelectedProducts[i].type : "");
      MedId.push( SelectedProducts[i].productid ? SelectedProducts[i].productid : "" );
      quantity.push(SelectedProducts[i].qtytoTransfer ? Number(SelectedProducts[i].qtytoTransfer) : "");
    }
    var Data = {
      from_location:fromlocation,
      to_location:tolocation, 
      channel: channel, 
      transfer_date: transferdate,
      total_amount:Grandtotal,
      items: MedId, 
      items_type: Type, 
      qty: quantity
     }
    setload(true);
    try {
      await axios.post(`${url}/transfer/stocks/add`, Data).then((response) => {
        setload(false);
        props.GETTransferOutList();
        setload(false);
        props.toggle_npef();
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message);
        } else {
          Notiflix.Notify.warning(response.data.message);
        }
        resetfields()
      });
    } catch (e) {
      setload(false);
      Notiflix.Notify.warning(e.message);
    }
  };

  function Emptytableindex() {
    setitemid();
    setitemname();
    setqty();
  }

  useEffect(() => {
    CalGrandttl();
  }, [SelectedProducts]);

  function AddProducts(data) {
    let T = "";
    if (data.vaccine_brand_id) {
      T = "v";
    } else {
      T = "m";
    }
    let ProductDetails = {
      productid: data.id,
      product: data.item_name ? data.item_name : itemname,
      type: data.type ? data.type : T,
      avlstock: data.current_stock,
      qtytoTransfer: '',
      mrp: data.mrp,
    }
    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails]);
    } else {
      setSelectedProducts((prevState) => [...prevState, ProductDetails]);
    }
  }
  async function DeleteProduct(productid) {
    let obj = [];
    obj.push(
      SelectedProducts.filter(function (e) {
        return e.productid !== productid;
      })
    );
    obj = obj.flat();
    setSelectedProducts(obj);
  }
  const resetfields = async () => {
    setclinicname()
    setfromlocation()
    settolocation()
    settransferdate()
    setchannelname()
    setchannel()
    setSelectedProducts([])
  };

  const searchmeds = async (search) => {
    setloadsearch(true);
    try {
      await axios.get(`${url}/stock/list?search=${search}`).then((response) => {
        let medicines = [];
        let vaccines = [];
        let items = [];
        medicines.push(
          response.data.data.medicines ? response.data.data.medicines : []
        );
        vaccines.push(
          response.data.data.vaccines ? response.data.data.vaccines : []
        );
        items = medicines.concat(vaccines);
        items = items.flat();
        setitemsearch(items);
        setloadsearch(false);
        if (search.length > 1) {
          medicinesref.current.style.display = "block";
        } else {
          medicinesref.current.style.display = "none";
        }
      });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  }
  const ClinicName = ()=>{
    for(let i=0;i<cliniclist.length;i++){
      if(clinicid == cliniclist[i].id){
        setclinicname(cliniclist[i].title)
      }
    }
  }
  function AddProducts(data) {
    let T = "";
    if (data.vaccine_brand_id) {
      T = "v";
    } else {
      T = "m";
    }
    let ProductDetails = {
      productid: data.id,
      type: data.type ? data.type : T,
      product: data.item_name ? data.item_name : itemname,
      avlstock: data.current_stock,
      qtytoTransfer: '',
      mrp: data.mrp,
    };

    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails]);
    } else {
      setSelectedProducts((prevState) => [...prevState, ProductDetails]);
    }
  }
  function CalTotalAmount(qty, mrp) {
    let cost = mrp;
    if (!qty) {
      return 0;
    } else if (qty == 1 || qty =='1') {
      mrp = Number(mrp);
      return mrp;
    } else {
      cost = Number(mrp) * Number(qty);
      cost = cost.toFixed(2);
      return cost;
    }
  }
  function CalGrandttl() {
    let ttl = 0;
    SelectedProducts.map((data) => (ttl += Number(data.totalamt)));
    setGrandtotal(ttl);
  }
  useEffect(()=>{
    ClinicName()
  },[])

  return(
    <section className="position-relative" style={{minHeight:'100%'}}>
      <h5 className="text-center text-charocal fw-bold pt-2 shadow-sm pb-2">New Transfer Out</h5> 
      <button className={`btn btn-back position-absolute start-0 top-0 ms-2 d-${stage1 == 'block' ? 'none' : 'block'}`} onClick={() => { Go_Back() }}   ></button>
      <button type="button" className="btn-close closebtn m-auto mt-2 position-absolute top-0 end-0 me-2 mt-2" onClick={props.toggle_npef} aria-label="Close" ></button>
      <div className={`stage1 d-${stage1}`} style={{minHeight:'90%'}}>
      <div className="row p-0 m-0 mt-4 ms-3 align-items-end align-self-end">
        <div className="col-5">
          <label className="text-charcoal75 fw-bold" htmlFor="">From Location</label>
        <div className="dropdown ">
            <button className=" button button-pearl text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {fromlocationname?fromlocationname:clinicname} </button>
            <ul className="dropdown-menu p-2 bg-pearl border-0 shadow-sm" >
            {
                        cliniclist ? (
                        cliniclist.map((data) => (
                            <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" onClick={() => { setfromlocation(data.id);setfromlocationname(data.title) }}>{data.title} </li>
                          ))
                        ) : (
                          <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" >Loading...</li>
                          )
            }
            </ul>
          </div>
        </div>

        <div className="col-5">
        <label className="text-charcoal75 fw-bold" htmlFor="">To Location</label>
        <div className="dropdown ">
            <button className=" button button-pearl text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {tolocationname?tolocationname:"To Location"} </button>
            <ul className="dropdown-menu p-2 bg-pearl border-0 shadow-sm" >
            {
                        cliniclist ? (
                        cliniclist.map((data) => (
                            <li className={`text-start p-2 text-charcoal fw-bolder border-bottom py-2 d-${clinicid==data.id?'none':''}`} onClick={() => { settolocation(data.id);settolocationname(data.title) }}>{data.title} </li>
                          ))
                        ) : (
                          <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" >Loading...</li>
                          )
            }
            </ul>
          </div>
        </div>
      </div>
      <div className="row p-0 m-0 mt-5 ms-3 ">
        <div className="col-5">
        <div className="text-charcoal75 fw-bold" htmlFor="">Select Channel</div>
        <div className="dropdown ">
            <button className=" button button-pearl text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {channelname?channelname:"Select Channel"} </button>
            <ul className="dropdown-menu p-2 bg-pearl border-0 shadow-sm" >
              <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" onClick={() => { setchannel(1);setchannelname("Pharmacy") }}>Pharmacy </li>
              <li className="text-start p-2 text-charcoal fw-bolder py-2" onClick={() => { setchannel(2);setchannelname("Clinic") }}>Clinic </li>
            </ul>
          </div>
            </div>
            <div className="col-5">
            <div className="text-charcoal75 fw-bold" htmlFor="">Transfer Date</div>
              <input type="date" className="button button-pearl fw-bolder tet-charcoal " onChange={(e)=>{settransferdate(e.target.value)}} value={transferdate?transferdate:currentDate}/>
            </div>
        </div>
        <div className="container-fluid p-0 m-0 position-absolute bottom-0 bg-pearl bottom_bar">
          <div className="row p-0 m-0 py-3 justify-content-end">
            <div className="col-auto">
            <button className="button button-charcoal" onMouseDown={() => { toggleStage2(); }} onMouseUp={() => { toggleStage1() }} >Add Items</button>
            </div>
          </div>
        </div>
        </div>
        <div className={`stage2 d-${stage2}`}>
          <div className="row p-0 m-0 align-items-end align-self-end">
            <div className="col-auto">
                  <input className="form-control fw-bold border-charcoal75 border-2 rounded-1 bg-seashell" placeholder="Search Product by Name" value={itemname ? itemname : ""} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemid(); setproducts(); stockref.current.style.display = "none"; }} />
                  <div ref={medicinesref} className="position-absolute rounded-1 mt-1" style={{ Width: "max-content", zIndex: "1" }} >
                    {
                      itemsearch ? (
                        loadsearch ? (
                          <div className="rounded-1 p-1 bg-pearl">
                            Searching Please wait....
                            <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                              <span className="sr-only"> </span>
                            </div>
                          </div>
                        ) : loadsearch == false && itemsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-1 p-1"> Oops! Not Avaliable </div>
                        ) : (
                          <div className={`rounded-4 scroll border border-1 bg-pearl p-1 d-${itemsearch && itemsearch.length > 0 ? "block" : "none"}`} style={{ height: '30vh' }} >
                            <p className={`text-start p-2 position-sticky top-0 bg-pearl fw-bold text-charcoal75 ms-2`} style={{ fontSize: "0.8rem" }} > {itemsearch.length} Search Results </p>
                            {
                              itemsearch.map((data, i) => (
                                <div style={{ cursor: "pointer", Width: "10rem" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} text-start fw-bold p-2 border-bottom text-charcoal `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = "block"; }} > {data.display_name ? data.display_name : data.name} <span className='text-burntumber fw-bold rounded-2 px-1'>{data && data.stock_info !== undefined ? data.stock_info.length : ""} stocks</span> </div>
                              ))
                            }
                          </div>
                        )
                      ) : (
                        <div className="bg-seashell"></div>
                      )}
                  </div>
                  <div ref={stockref} className={`position-absolute start-50 mt-1 bg-pearl scroll scroll-y align-self-center rounded-2 border border-1 p-2 d-${products && products.stock_info && products.stock_info !== undefined ? "block" : "none"}`} style={{ zIndex: "2", width: "10rem", 'min-height': "30vh", }} >
                    <p className={`text-start fw-bold text-charcoal75`} style={{ fontSize: "0.8rem" }} > {products && products.stock_info !== undefined ? products.stock_info.length : ""}{" "} Batch Stocks </p>
                    {
                      products && products.length != 0 ? (
                        products.stock_info.length == 0 ? (
                          <div className="bg-burntumber text-white fw-bold p-2">Oops! Not Available</div>
                        ) : (
                          products.stock_info.map((data, i) => (
                            <div style={{ cursor: "pointer", Width: "max-content" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} border-bottom text-wrap`} onClick={() => { AddProducts(data); setitemname(); setitemid(); setproducts(); setitemsearch(); }} >
                              <p className="text-start m-0 p-0 fw-bold">{itemname}</p>
                              <p className="text-start p-0 m-0 "> BatchNo. -{" "} {data.batch_no && data.batch_no !== null ? data.batch_no : ""} </p>
                              <p className="text-start p-0 m-0 "> Stock -{" "} {data.current_stock && data.current_stock ? data.current_stock : ""} </p>
                              <p className="text-start p-0 m-0 "> Expiry Date -{" "} {data.expiry_date ? reversefunction(data.expiry_date) : ""} </p>
                            </div>
                          ))
                        )
                      ) : (
                        <div className="bg-seashell p-2">Not Avaliable</div>
                      )
                    }
                  </div>
                  <div>
                  </div>
       
            </div>
          </div>
     
                <div className="container-fluid p-0 m-0 mt-2">
                <table className="table p-0 m-0">
                  <thead className="p-0 m-0">
                    <tr className={`p-0 m-0 `}>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item ID </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item Name </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Mrp </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Avl.Stock </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Qty To Transfer </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Total </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Delete </th>
                    </tr>
                  </thead>
                  {SelectedProducts && SelectedProducts.length !== 0 ? (
                    <tbody className="p-0 m-0">
                      {
                      SelectedProducts.map((data) => (
                        <tr className={`p-0 m-0 align-middle text-charcoal fw-bold`} >
                          <td>{data.type} {data.productid} </td>
                          <td>{data.product}</td>
                          <td>{data.mrp}</td>
                          <td>{data.avlstock}</td>
                          <td>
                            <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell" value={data.qtytoTransfer ? data.qtytoTransfer : ""} onChange={(e) => { e.target.value <= data.avlstock ? (data.qtytoTransfer = e.target.value) : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available"); data.totalamt = CalTotalAmount(data.qtytoTransfer, data.mrp); setSelectedProducts((prevState) => [...prevState]); }} />{" "}
                          </td>
                          <td>{data.totalamt}</td>
                          <td>
                            <button className="btn p-0 m-0" onClick={() => { DeleteProduct(data.productid); }} >
                              <img src={process.env.PUBLIC_URL + "images/minus.png"} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="p-0 m-0 position-relative">
                      <tr className="p-0 m-0">
                        <td className="p-0 m-0 position-absolute text-charcoal75 fw-bold text-center start-0 end-0"> No Product Added </td>
                      </tr>
                    </tbody>
                  )}
                </table>
                </div>
                     
        <div className="container-fluid p-0 m-0 position-absolute bottom-0 bottom_bar bg-pearl">
          <div className="row p-0 m-0 py-3 justify-content-between align-items-center align-self-center">
            <div className="col-auto">
              <label className="fw-bolder text-charcoal75" htmlFor="">Grand Total</label>
              <div className="col-auto ">
              <h5 className="fw-bolder text-charcoal">₹{Grandtotal }</h5>
              </div>
          
            </div>
            <div className="col-auto">
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
            <button className="button button-charcoal"onClick={()=>confirmmessage()} >Save Transfer</button>
            )
            }
            </div>
          </div>
        </div>
        </div>
    </section>
  )
}

export{Transfersection}

function Dumpsection(props){
  const currentDate = useContext(TodayDate);
  const adminid = localStorage.getItem("id");
  const ClinicID = localStorage.getItem("ClinicId");
  const [cliniclist,setcliniclist]=useState('')
  const permission = useContext(Permissions);
  const url = useContext(URL);
  const [peidw, setpeidw] = useState("none");
  const [Loading, setLoading] = useState(false);
  const [dumpsarr, setdumpsarr] = useState([]);
  const [dumpsarrExcel, setdumpsarrExcel] = useState([]);
  const [index, setindex] = useState();
  const [npef, setnpef] = useState("none");
  const [pages, setpages] = useState();
  const [pagecount, setpagecount] = useState();
  const [updateload, setupdateload] = useState(false);
  const [fromdate,setfromdate] =useState()
  const [todate,settodate] =useState()
  const [channel,setchannel] =useState()
  const [second ,setSecond] =  useState()
  const [statusindex,setstatusindex] = useState()


  function ClinicList() {
    axios.get(`${url}/clinic/list`).then((response) => {
        setcliniclist(response.data.data)
    })
}
useEffect(() => {
    ClinicList()
}, [])

  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  }
  function GetPages() {
    try {
      axios
        .get(
          `${url}/dump/stocks/list?clinic_id=${ClinicID}&channel=${channel}&from_date=${fromdate ? fromdate : currentDate
          }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
        )
        .then((response) => {
          setpagecount(response.data.data.total_count);
          setpages(Math.round(response.data.data.total_count / 25) + 1);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.message);
      setLoading(false);
    }
  }

  // &from_date=${fromdate ? fromdate : currentDate }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}
  // &from_date=${fromdate ? fromdate : currentDate }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}
  // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/transfer/stocks/list?location_id=1&limit=10&offset=0
  
  function GETDumpList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios.get( `${url}/dump/stocks/list?location_id=${ClinicID}&limit=25&offset=0` )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            setdumpsarr(response.data.data.dump_stocks);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        axios.get(`${url}/dump/stocks/list?location_id=${ClinicID}&limit=25&offset=${Data.selected * 25 }` )
          .then((response) => {
            setpagecount(response.data.data.total_count);
            setdumpsarr(response.data.data.dump_stocks);
            setLoading(false);
          })
          .catch((e) => {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
          });
      } catch (e) {
        Notiflix.Notify.warning(e.data.message);
        setLoading(false);
      }
    }
  }
  function GETDumpListForExcel() {
    setLoading(true);
    try {
      axios.get(`${url}/dump/stocks/list?location_id=${ClinicID}&limit=${pagecount?pagecount:''}&offset=0` )
        .then((response) => {
          setdumpsarrExcel(response.data.data.dump_stocks);
          setLoading(false);
        })
        .catch((e) => {
          Notiflix.Notify.warning(e.message);
          setLoading(false);
        });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
      setLoading(false);
    }
  }
  useEffect(() => {
    GetPages();
  }, [fromdate, todate,channel])

  useEffect(() => {
    GETDumpList()
    GETDumpListForExcel()
  }, [fromdate, todate,channel])

  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");
    }
    if (npef === "block") {
      setnpef("none");
    }
  }
  let array = [[1, 'Dumped', 'lightgreen'], [2, 'Cancelled', 'lightred']]
  function status(number) {
    let status
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1]
        break;
      }
    }
    return status
  }
  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2]
        break;
      }
    }
    return status_color
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };
  const UpdateStatus = async (data,e) => {
    setupdateload(true)
    try {
      await axios.post(`${url}/transfer/stocks/change/status`, { 
        transfer_id: data.id, 
        transfer_status: e.target.value, 
        admin_id: adminid, 
      }).then((response) => {
          Notiflix.Notify.success(response.data.message);
          GETDumpList();
          setupdateload(false)
        })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      setupdateload(false)
    }
  }
  return(
    <>
   <div className="row p-0 m-0 mt-3">
   <div className="col-auto">
            <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {second?second:"Channel"}
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                      <li className={`dropdown-item text-${second === "Pharmacy" ? "light" : "dark"} fw-bold bg-${second === 'Pharmacy' ? "charcoal" : "seashell"}`} onClick={(a) => {setSecond('Pharmacy');setchannel(1)}} > Pharmacy </li>
                      <li className={`dropdown-item text-${second === "Consumables" ? "light" : "dark"} fw-bold bg-${second === 'Consumables' ? "charcoal" : "seashell"}`} onClick={(a) => {setSecond('Consumables');setchannel(2)}} > Consumables </li>
                </ul>
              </div>
            </div>
            <div className="col-auto bg-seashell rounded-2 ">
              <div className="row p-0 m-0 align-items-center align-self-center">
                <div className="col-auto p-0 m-0">
                  <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 border-0 text-charcoal text-center fw-bold " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                </div>
                <div className="col-auto p-0 m-0">-</div>
                <div className="col-auto p-0 m-0">
                  <input type="date" className=" border-0 button button-seashell text-charcoal text-center fw-bold" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />                </div>
              </div>
            </div>
    <div className="col-auto">
    <ExportDump dumpsarr={dumpsarrExcel} fromdate={reversefunction(fromdate?fromdate:currentDate)} todate={reversefunction(todate?todate:fromdate?fromdate:currentDate)} />
    </div>
   </div>
   <div className="row p-0 m-0 justify-content-between mt-3">
    <div className="col-auto ps-0 ms-0">
    <h2 className=" ms-3 text-charcoal fw-bolder" style={{ width: "fit-content" }} > {dumpsarr!=undefined?dumpsarr.length:""} {dumpsarr!=undefined?dumpsarr.length > 1 ? "Dumps" : "Dump":""}{" "} </h2>
    </div>
    <div className="col-auto me-3">
    <button className={`button addpurchase button-charcoal  d-${permission.purchase_entry_add == 1 ? "" : "none" }`} onClick={toggle_npef} > <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" className="img-fluid p-0 m-0" />Dump </button>
    </div>
   </div>
 <div>
   <div className="scroll scroll-y overflow-scroll p-0 m-0 mt-2 position-relative" style={{ minHeight: "56vh", height: "56vh" }} >
   <table className="table">
       <thead className=" align-middle position-sticky top-0 bg-pearl">
       <tr>
           <th className="fw-bolder text-charcoal75">  ID </th>
           <th className="fw-bolder text-charcoal75"> Channel </th>
           <th className="fw-bolder text-charcoal75"> Dump From </th>
           <th className="fw-bolder text-charcoal75"> Dump Date </th>
           <th className="fw-bolder text-charcoal75"> Amount </th>
           <th className="fw-bolder text-charcoal75 text-center"> Status </th>
           <th className="fw-bolder  text-center  text-charcoal75"  > Inventory </th>
           {/* <th className='fw-bolder p-0 m-0  text-charcoal75 text-center' scope='col' style={{ zIndex: '3' }}>more</th> */}
         </tr>
       </thead>
       {Loading ? (
         <tbody className=" text-center" style={{ minHeight: "55vh" }}>
           <tr className="position-absolute border-0 start-0 end-0 px-5">
             <div class="d-flex align-items-center">
               <strong className="">
                 Getting Details please be Patient ...
               </strong>
               <div
                 class="spinner-border ms-auto"
                 role="status"
                 aria-hidden="true"
               ></div>
             </div>
           </tr>
         </tbody> 
       ) : dumpsarr && dumpsarr.length != 0 ? (
        <tbody>
        {
        dumpsarr.map((item, i) => (
          <tr key={i} className={`bg-${i % 2 == 0 ? "seashell" : "pearl" } align-middle`} >
            <td className="py-0 my-0 text-charcoal fw-bold ps-2"> D-{item.id} </td>
            <td className="text-charcoal fw-bold"> {item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"} </td>
            <td className="text-charcoal fw-bold pe-3"> 
                 {
                    cliniclist ? cliniclist.map((data, i) => (
                         <label className={`d-${ClinicID == data.id ? 'block' : 'none'}`}>{data.title}</label>

                     )):(<></>)
                 }
           </td>
            <td className="text-charcoal fw-bold"> {item.dump_date && item.dump_date ? reversefunction(item.dump_date) : "N/A"} </td>
            <td className="text-charcoal fw-bold"> {item.total_amount && item.total_amount ? "Rs. " + item.total_amount : "N/A"} </td>
            <td className="text-center">
             {     updateload == true && statusindex == i ? (
     <div className="col-6 py-2 pb-2 m-auto text-center">
     <div className="spinner-border" role="status">
       <span className="visually-hidden">Loading...</span>
     </div>
   </div>  
             ):(
               <select disabled={item.dump_status==2?true:false} className={`bg-${status_color(item.dump_status)} rounded-2 rounded-pill py-1 px-2 fw-bold text-center border-0 text-wrap `} onChange={(e)=>{UpdateStatus(item,e)}} name={item.dump_status}>
               <option className="button text-center" selected disabled>{status(item.dump_status)}</option>
               <option className="button-lightgreen" value='1' onClick={()=>{setstatusindex(i)}}>Dumped</option>
               <option className="button-lightred" value='2' onClick={()=>{setstatusindex(i)}}>Cancelled</option>
           </select>
             )}

            </td>
            <td className="text-charcoal fw-bold text-center">
              <button className="btn p-0 m-0" onClick={() => { setindex(i); toggle_peidw(); }} > <img src={ process.env.PUBLIC_URL + "/images/archivebox.png" } alt="displaying_image" className="ms-1 img-fluid" /> </button>
            </td>
            <td className={` position-absolute d-${i == index ? peidw : "none" } border border-1 start-0 mx-auto end-0 bg-seashell rounded-4 p-0 m-0`} style={{zIndex:'10', top: "0",width:'70vh',height: "40vh" }} >
               {i == index ? 
               ( <DumpItemDetails dumpsarr={dumpsarr[i]} id={"D-" + item.id} toggle_peidw={toggle_peidw} /> ) : ( <></> )}
            </td>
          </tr>
        ))}
      </tbody>

       ) : (
         <tbody className="text-center position-relative p-0 m-0 " style={{ minHeight: "55vh" }} >
           <tr className="">
             <td className="fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0">
               No Dumps
             </td>
           </tr>
         </tbody>
       )}
     </table>
   </div>
   <div className="container-fluid mt-2 d-flex justify-content-center">
     <ReactPaginate
       previousLabel={"Previous"}
       nextLabel={"Next"}
       breakLabel={". . ."}
       pageCount={pages}
       marginPagesDisplayed={3}
       pageRangeDisplayed={2}
       onPageChange={GETDumpList}
       containerClassName={"pagination"}
       pageClassName={"page-item text-charcoal"}
       pageLinkClassName={ "page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1" }
       previousClassName={"btn button-charcoal-outline me-2"}
       previousLinkClassName={"text-decoration-none text-charcoal"}
       nextClassName={"btn button-charcoal-outline ms-2"}
       nextLinkClassName={"text-decoration-none text-charcoal"}
       breakClassName={"mx-2 text-charcoal fw-bold fs-4"}
       breakLinkClassName={"text-decoration-none text-charcoal"}
       activeClassName={"active"}
     />
   </div>
 </div>
 <section className={` position-absolute bottom-0 start-0 mx-auto end-0 bg-seashell border border-1 shadow rounded-2 d-${npef}`} style={{minHeight:'70vh',height:'70vh',width:'60vh'}} >
   {
     <NewDumpForm toggle_npef={toggle_npef} GETDumpList={GETDumpList} />
   }
 </section>
</>
  )
}
export {Dumpsection}
function DumpItemDetails(props){
  const [medicine, setmedicine] = useState("block");
  const [vaccine, setvaccine] = useState("none");
  const [index, setindex] = useState(0);
  const Items = ["Medicine", "Vaccine"];
  const [qr, setqr] = useState("none");
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  if (index == 0) {
    if (medicine == "none") {
      setmedicine("block");
      setvaccine("none");
    }
  }
  if (index == 1) {
    if (vaccine == "none") {
      setvaccine("block");
      setmedicine("none");
    }
  }
  const [Taxon, setTaxon] = useState(false);

  function TotalTaxPercent(cgst, sgst, igst) {
    if ((cgst && sgst && igst !== null) || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst);
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if ((cgst && sgst) || igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty);
      e = e.toFixed(2);
      return e;
    }
  }

  return (
    <div className="container-fluid p-0 m-0 ">
      <div className="container-fluid p-0 m-0">
        <h5 className="text-center pt-3 text-charcoal">
          {props.id} Dump Item Details
        </h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={props.toggle_peidw} aria-label="Close" ></button>

        <div className="col-2 d-none">
          <div className=" position-relative searchbutton" style={{ top: "0.25rem", right: "1rem" }} >
            <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
            <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: "2rem", right: "0", left: "0", top: "0.25rem" }} >
              <img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" />
            </button>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center p-0 m-0 mt-3 mb-1">
        {Items.map((data, i) => (
          <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? "charcoal" : "seashell" }`} onClick={() => { setindex(i); }} > {data} </button>
        ))}
      </div>

      <div className=" d-flex justify-content-end me-5">
        <input type="checkbox" className="form-check-input" value={Taxon ? Taxon : ""} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true); }} />
        <label>Show Tax Details</label>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ height:"100%" }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className="border p-0 m-0 px-1" > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total </th>
            </tr>
          </thead>
          {props.dumpsarr.medicines && props.dumpsarr.medicines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.dumpsarr.medicines.map((item, _key) => (
                <tr className="border align-middle" key={_key}>
                  <td className="border align-middle"> {item.medicies_stocks_id && item.medicies_stocks_id !== undefined ? "m"+item.medicies_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.medicine.display_name !== undefined ? item.medicine_details.medicine.display_name : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.batch_no !== undefined ? item.medicine_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.expiry_date !== undefined ? reversefunction(item.medicine_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.mrp !== undefined ? "₹"+item.medicine_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.rate !== undefined ? "₹"+item.medicine_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.discount !== undefined ?  item.medicine_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.medicine_details && item.medicine_details.trade_discount !== undefined ?  item.medicine_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.SGST_rate ? Number( item.medicine_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.SGST ? (Number(item.medicine_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.CGST_rate ? Number(item.medicine_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.CGST ? (Number(item.medicine_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.IGST_rate ? Number(item.medicine_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.medicine_details && item.medicine_details.IGST ? (Number(item.medicine_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.medicine_details.CGST_rate , item.medicine_details.SGST_rate, item.medicine_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.medicine_details.CGST,item.medicine_details.SGST,item.medicine_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.medicine_details.cost ?"₹"+item.medicine_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>
  
                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className=" text-center fw-bold">No Medicines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ height:'100%' }} >
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan="2" className="border p-0 m-0 px-1"> Stock ID </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Item Name </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Batch No. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Expiry Date </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> MRP{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Rate{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Qty. </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Disc% </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Trade Disc% </th>
              <th colspan={Taxon == true ? "8" : "2"} scope="col-group" className={`border p-0 m-0 px-1`} > Total Tax </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Cost{" "} </th>
              <th rowspan="2" className="border p-0 m-0 px-1"> Total{" "} </th>
            </tr>
            <tr>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > CGST </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > SGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST% </th>
              <th scope="col" className={`border p-0 m-0 px-1 d-${Taxon == true ? "" : "none" }`} > IGST{" "} </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total% </th>
              <th scope="col" className={`border p-0 m-0 px-1`}> Total{" "} </th>
            </tr>
          </thead>
          {props.dumpsarr.vaccines &&
            props.dumpsarr.vaccines.length !== 0 ? (
            <tbody className="border align-items-center p-0 m-0">
              {props.dumpsarr.vaccines.map((item, _key) => (
                <tr className="border p-0 m-0 align-middle" key={_key}>
                  <td className="border align-middle"> {item.vaccine_stocks_id  && item.vaccine_stocks_id !== undefined ? "v"+item.vaccine_stocks_id : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details  && item.vaccine_details.vaccine.name !== undefined ? item.vaccine_details.vaccine.name : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details  && item.vaccine_details.batch_no !== undefined ? item.vaccine_details.batch_no : "N/A"}</td>
                  <td className="border align-middle"> {item.vaccine_details  && item.vaccine_details.expiry_date !== undefined ? reversefunction(item.vaccine_details.expiry_date) : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details  && item.vaccine_details.mrp !== undefined ? "₹"+item.vaccine_details.mrp : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details  && item.vaccine_details.rate !== undefined ? "₹"+item.vaccine_details.rate : "N/A"} </td>
                  <td className="border align-middle"> {item.qty ? item.qty : "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details && item.vaccine_details.discount !== undefined ?  item.vaccine_details.discount: "N/A"} </td>
                  <td className="border align-middle"> {item.vaccine_details && item.vaccine_details.trade_discount !== undefined ?  item.vaccine_details.trade_discount: "N/A"} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.SGST_rate ? Number( item.vaccine_details.SGST_rate) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.SGST ? (Number(item.vaccine_details.SGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.CGST_rate ? Number(item.vaccine_details.CGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.CGST ? (Number(item.vaccine_details.CGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.IGST_rate ? Number(item.vaccine_details.IGST_rate ) : ""} </td>
                  <td className={`border align-middle d-${Taxon == true ? "" : "none" }`} > {item.vaccine_details && item.vaccine_details.IGST ? (Number(item.vaccine_details.IGST) * Number(item.qty)).toFixed(2) : ""} </td>
                  <td className="border align-middle"> {TotalTaxPercent(item.vaccine_details.CGST_rate , item.vaccine_details.SGST_rate, item.vaccine_details.IGST_rate)} </td>
                  <td className="border align-middle"> {TotalTaxRate(item.vaccine_details.CGST,item.vaccine_details.SGST,item.vaccine_details.IGST, item.qty)} </td>
                  <td className="border align-middle"> {item.vaccine_details.cost ?"₹"+item.vaccine_details.cost  : "N/A"} </td>
                  <td className="border align-middle"> {item.total_amount ? item.total_amount : "N/A"} </td>

                </tr>
              ))}
            </tbody>
          ) : (
            <body className="text-center p-0 m-0 border border-1 ">
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2 ">
                <p className="fw-bold text-center">No Vaccines Found</p>
              </div>
            </body>
          )}
        </table>
      </div>
    </div>
  );
}

function NewDumpForm(props){

  const url = useContext(URL)
  const medicinesref = useRef(null)
  const stockref = useRef(null)
  const cliniclist = useContext(Clinic)
  const currentDate = useContext(TodayDate);
  const clinicid = localStorage.getItem('ClinicId')
  const [channel,setchannel]=useState("")
  const [channelname,setchannelname]=useState()
  const [dumpdate,setdumpdate]=useState(currentDate)
  const [stage1, setstage1] = useState('block')
  const [stage2, setstage2] = useState('none')
  const [loadsearch,setloadsearch]=useState(false)
  const [itemsearch, setitemsearch] = useState();
  const [itemname, setitemname] = useState();
  const [itemid, setitemid] = useState();
  const [itemtype, setitemtype] = useState();
  const [qty,setqty] =useState();
  const [tableindex, settableindex] = useState()
  const [products, setproducts] = useState([]);
  const [SelectedProducts, setSelectedProducts] = useState([]); 
  const [load,setload]=useState(false)
  const [Grandtotal, setGrandtotal] = useState();
  const toggleStage1 = () => {
    if (stage1 == 'block') {
      setstage1('none')
    }
    if (stage1 == 'none') {
      setstage1('block')
    }
  }

  const toggleStage2 = () => {
    if (stage2 == 'block') {
      setstage2('none')
    }
    if (stage2 == 'none') {
      setstage2('block')
    }
  }
  const Go_Back = () => {
    if (stage2 === 'block') { 
      toggleStage2()
      toggleStage1()
    }
  }
  const confirmmessage = (e) => {
    customconfirm();
    Notiflix.Confirm.show(
      `Add Transfer Out`,
      `Do you surely want to do the following Dump `,
      "Yes",
      "No",
      () => {
        SaveDump();
      },
      () => {
        return 0;
      },
      {}
    );
  };
  const SaveDump = async () => {
    let MedId = [];
    let Type = [];
    let quantity = [];
    for (let i = 0; i < SelectedProducts.length; i++) {
      Type.push(SelectedProducts[i].type ? SelectedProducts[i].type : "");
      MedId.push( SelectedProducts[i].productid ? SelectedProducts[i].productid : "" );
      quantity.push(SelectedProducts[i].qtytoTransfer ? Number(SelectedProducts[i].qtytoTransfer) : "");
    }
    var Data = {
      location_id:clinicid,
      dump_date:dumpdate,
      channel: channel, 
      dump_date: dumpdate,
      total_amount:Grandtotal,
      items: MedId, 
      items_type: Type, 
      qty: quantity
     }
    setload(true);
    try {
      await axios.post(`${url}/dump/stocks/add`, Data).then((response) => {
        setload(false);
        props.GETDumpList();
        setload(false);
        props.toggle_npef();
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message);
        } else {
          Notiflix.Notify.warning(response.data.message);
        }
        resetfields()
      });
    } catch (e) {
      setload(false);
      Notiflix.Notify.warning(e.message);
    }
  };

  useEffect(() => {
    CalGrandttl();
  }, [SelectedProducts]);

  function AddProducts(data) {
    let T = "";
    if (data.vaccine_brand_id) {
      T = "v";
    } else {
      T = "m";
    }
    let ProductDetails = {
      productid: data.id,
      product: data.item_name ? data.item_name : itemname,
      type: data.type ? data.type : T,
      avlstock: data.current_stock,
      qtytoTransfer: '',
      mrp: data.mrp,
    }
    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails]);
    } else {
      setSelectedProducts((prevState) => [...prevState, ProductDetails]);
    }
  }
  async function DeleteProduct(productid) {
    let obj = [];
    obj.push(
      SelectedProducts.filter(function (e) {
        return e.productid !== productid;
      })
    );
    obj = obj.flat();
    setSelectedProducts(obj);
  }
  const resetfields = async () => {
    setdumpdate()
    setchannelname()
    setchannel()
    setSelectedProducts([])
  };

  const searchmeds = async (search) => {
    setloadsearch(true);
    try {
      await axios.get(`${url}/stock/list?search=${search}`).then((response) => {
        let medicines = [];
        let vaccines = [];
        let items = [];
        medicines.push(
          response.data.data.medicines ? response.data.data.medicines : []
        );
        vaccines.push(
          response.data.data.vaccines ? response.data.data.vaccines : []
        );
        items = medicines.concat(vaccines);
        items = items.flat();
        setitemsearch(items);
        setloadsearch(false);
        if (search.length > 1) {
          medicinesref.current.style.display = "block";
        } else {
          medicinesref.current.style.display = "none";
        }
      });
    } catch (e) {
      Notiflix.Notify.warning(e.data.message);
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  }

  function AddProducts(data) {
    let T = "";
    if (data.vaccine_brand_id) {
      T = "v";
    } else {
      T = "m";
    }
    let ProductDetails = {
      productid: data.id,
      type: data.type ? data.type : T,
      product: data.item_name ? data.item_name : itemname,
      avlstock: data.current_stock,
      qtytoTransfer: '',
      mrp: data.mrp,
    };

    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails]);
    } else {
      setSelectedProducts((prevState) => [...prevState, ProductDetails]);
    }
  }
  function CalTotalAmount(qty, mrp) {
    let cost = mrp;
    if (!qty) {
      return 0;
    } else if (qty == 1 || qty =='1') {
      mrp = Number(mrp);
      return mrp;
    } else {
      cost = Number(mrp) * Number(qty);
      cost = cost.toFixed(2);
      return cost;
    }
  }
  function CalGrandttl() {
    let ttl = 0;
    SelectedProducts.map((data) => (ttl += Number(data.totalamt)));
    setGrandtotal(ttl);
  }


  return(
    <section className="position-relative" style={{minHeight:'100%'}}>
      <h5 className="text-center text-charocal fw-bold pt-2 shadow-sm pb-2">New Dump</h5> 
      <button className={`btn btn-back position-absolute start-0 top-0 ms-2 d-${stage1 == 'block' ? 'none' : 'block'}`} onClick={() => { Go_Back() }}   ></button>
      <button type="button" className="btn-close closebtn m-auto mt-2 position-absolute top-0 end-0 me-2 mt-2" onClick={props.toggle_npef} aria-label="Close" ></button>
      <div className={`stage1 d-${stage1}`} style={{minHeight:'90%'}}>
      <div className="row p-0 m-0 mt-4 ms-3 align-items-end align-self-end">
          <div className="col-12 clinics bg-seashell align-self-center border-0 ps-2" >
                    {
                        cliniclist.map((data, i) => (
                            <div key={i} className={`d-${clinicid == data.id ? 'block' : 'none'} `}>
                                <div className="row p-0 m-0 align-items-center">
                                    <div className="col-auto p-0 m-0 me-1">
                                        <img src={process.env.PUBLIC_URL + '/images/location.png'}  />
                                    </div>
                                    <div className="col-auto p-0 m-0 fw-bold mt-1" style={{ letterSpacing: '1px' }}>
                                        {data.title} {data.address}
                                    </div>
                                </div></div>
                        ))
                    }
                </div>
      </div>
      <div className="row p-0 m-0 mt-3 ms-3 ">
        <div className="col-5">
        <div className="text-charcoal75 fw-bold" htmlFor="">Select Channel</div>
        <div className="dropdown ">
            <button className=" button button-pearl text-charcoal fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {channelname?channelname:"Select Channel"} </button>
            <ul className="dropdown-menu p-2 bg-pearl border-0 shadow-sm" >
              <li className="text-start p-2 text-charcoal fw-bolder border-bottom py-2" onClick={() => { setchannel(1);setchannelname("Pharmacy") }}>Pharmacy </li>
              <li className="text-start p-2 text-charcoal fw-bolder py-2" onClick={() => { setchannel(2);setchannelname("Clinic") }}>Clinic </li>
            </ul>
          </div>
            </div>
            <div className="col-5">
            <div className="text-charcoal75 fw-bold" htmlFor="">Dump Date</div>
              <input type="date" className="button button-pearl fw-bolder tet-charcoal " onChange={(e)=>{setdumpdate(e.target.value)}} value={dumpdate?dumpdate:currentDate}/>
            </div>
        </div>
        <div className="container-fluid p-0 m-0 position-absolute bottom-0 bg-pearl bottom_bar">
          <div className="row p-0 m-0 py-3 justify-content-end">
            <div className="col-auto">
            <button className="button button-charcoal" onMouseDown={() => { toggleStage2(); }} onMouseUp={() => { toggleStage1() }} >Add Items</button>
            </div>
          </div>
        </div>
        </div>
        <div className={`stage2 d-${stage2}`}>
          <div className="row p-0 m-0 align-items-end align-self-end">
            <div className="col-auto">
                  <input className="form-control fw-bold border-charcoal75 border-2 rounded-1 bg-seashell" placeholder="Search Product by Name" value={itemname ? itemname : ""} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemid(); setproducts(); stockref.current.style.display = "none"; }} />
                  <div ref={medicinesref} className="position-absolute rounded-1 mt-1" style={{ Width: "max-content", zIndex: "1" }} >
                    {
                      itemsearch ? (
                        loadsearch ? (
                          <div className="rounded-1 p-1 bg-pearl">
                            Searching Please wait....
                            <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                              <span className="sr-only"> </span>
                            </div>
                          </div>
                        ) : loadsearch == false && itemsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-1 p-1"> Oops! Not Avaliable </div>
                        ) : (
                          <div className={`rounded-4 scroll border border-1 bg-pearl p-1 d-${itemsearch && itemsearch.length > 0 ? "block" : "none"}`} style={{ height: '30vh' }} >
                            <p className={`text-start p-2 position-sticky top-0 bg-pearl fw-bold text-charcoal75 ms-2`} style={{ fontSize: "0.8rem" }} > {itemsearch.length} Search Results </p>
                            {
                              itemsearch.map((data, i) => (
                                <div style={{ cursor: "pointer", Width: "10rem" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} text-start fw-bold p-2 border-bottom text-charcoal `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = "block"; }} > {data.display_name ? data.display_name : data.name} <span className='text-burntumber fw-bold rounded-2 px-1'>{data && data.stock_info !== undefined ? data.stock_info.length : ""} stocks</span> </div>
                              ))
                            }
                          </div>
                        )
                      ) : (
                        <div className="bg-seashell"></div>
                      )}
                  </div>
                  <div ref={stockref} className={`position-absolute start-50 mt-1 bg-pearl scroll scroll-y align-self-center rounded-2 border border-1 p-2 d-${products && products.stock_info && products.stock_info !== undefined ? "block" : "none"}`} style={{ zIndex: "2", width: "10rem", 'min-height': "30vh", }} >
                    <p className={`text-start fw-bold text-charcoal75`} style={{ fontSize: "0.8rem" }} > {products && products.stock_info !== undefined ? products.stock_info.length : ""}{" "} Batch Stocks </p>
                    {
                      products && products.length != 0 ? (
                        products.stock_info.length == 0 ? (
                          <div className="bg-burntumber text-white fw-bold p-2">Oops! Not Available</div>
                        ) : (
                          products.stock_info.map((data, i) => (
                            <div style={{ cursor: "pointer", Width: "max-content" }} className={`bg-${i % 2 == 0 ? "pearl" : "seashell"} border-bottom text-wrap`} onClick={() => { AddProducts(data); setitemname(); setitemid(); setproducts(); setitemsearch(); }} >
                              <p className="text-start m-0 p-0 fw-bold">{itemname}</p>
                              <p className="text-start p-0 m-0 "> BatchNo. -{" "} {data.batch_no && data.batch_no !== null ? data.batch_no : ""} </p>
                              <p className="text-start p-0 m-0 "> Stock -{" "} {data.current_stock && data.current_stock ? data.current_stock : ""} </p>
                              <p className="text-start p-0 m-0 "> Expiry Date -{" "} {data.expiry_date ? reversefunction(data.expiry_date) : ""} </p>
                            </div>
                          ))
                        )
                      ) : (
                        <div className="bg-seashell p-2">Not Avaliable</div>
                      )
                    }
                  </div>
                  <div>
                  </div>
       
            </div>
          </div>
     
                <div className="container-fluid p-0 m-0 mt-2">
                <table className="table p-0 m-0">
                  <thead className="p-0 m-0">
                    <tr className={`p-0 m-0 `}>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item ID </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Item Name </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Mrp </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Avl.Stock </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Qty To Dump </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Total </th>
                      <th className="p-0 m-0 px-2 text-charcoal75" rowSpan="2"> Delete </th>
                    </tr>
                  </thead>
                  {SelectedProducts && SelectedProducts.length !== 0 ? (
                    <tbody className="p-0 m-0">
                      {
                      SelectedProducts.map((data) => (
                        <tr className={`p-0 m-0 align-middle text-charcoal fw-bold`} >
                          <td>{data.type} {data.productid} </td>
                          <td>{data.product}</td>
                          <td>{data.mrp}</td>
                          <td>{data.avlstock}</td>
                          <td>
                            <input className="border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell" value={data.qtytoTransfer ? data.qtytoTransfer : ""} onChange={(e) => { e.target.value <= data.avlstock ? (data.qtytoTransfer = e.target.value) : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available"); data.totalamt = CalTotalAmount(data.qtytoTransfer, data.mrp); setSelectedProducts((prevState) => [...prevState]); }} />{" "}
                          </td>
                          <td>{data.totalamt}</td>
                          <td>
                            <button className="btn p-0 m-0" onClick={() => { DeleteProduct(data.productid); }} >
                              <img src={process.env.PUBLIC_URL + "images/minus.png"} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="p-0 m-0 position-relative">
                      <tr className="p-0 m-0">
                        <td className="p-0 m-0 position-absolute text-charcoal75 fw-bold text-center start-0 end-0"> No Product Added </td>
                      </tr>
                    </tbody>
                  )}
                </table>
                </div>
                     
        <div className="container-fluid p-0 m-0 position-absolute bottom-0 bg-pearl bottom_bar">
          <div className="row p-0 m-0 py-3 justify-content-between align-items-center align-self-center">
            <div className="col-auto">
              <label className="fw-bolder text-charcoal75" htmlFor="">Grand Total</label>
              <div className="col-auto ">
              <h5 className="fw-bolder text-charcoal">₹{Grandtotal }</h5>
              </div>
          
            </div>
            <div className="col-auto">
            {load ? (
              <div className="col-6 py-2 pb-2 m-auto text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
            <button className="button button-charcoal"onClick={()=>confirmmessage()} >Save Dump</button>
            )
            }
            </div>
          </div>
        </div>
        </div>
    </section>
  )
}
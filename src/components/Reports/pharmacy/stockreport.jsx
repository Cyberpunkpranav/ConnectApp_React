import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { customconfirm } from "../../features/notiflix/customconfirm";
//css
import "../../../css/bootstrap.css";
import "../../../css/dashboard.css";
import "../../../css/pharmacy.css";

const StockReport = () => {
    const clinic = useContext(Clinic)
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const StockReportref = useRef();
    // const [seidw, setseidw] = useState("none");
    // const [channel, setchannel] = useState(1);
    const [Location_Id, setLocation_Id] = useState()
    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [stockreportarr, setstockreportarr] = useState([]);
    const [index, setindex] = useState();
    // const [nsef, setnsef] = useState("none");
    const [pages, setpages] = useState([]);
    // const [paymentsapage, setpaymentsapage] = useState("none");
    const [tabindex, settabindex] = useState();
    const [pagecount, setpagecount] = useState();

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };

    function GetPages() {
        setLoading(true);
        try {
            axios.get(`${url}/reports/stock/report?location_id=${Location_Id}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
                .then((response) => {
                    setpagecount(response.data.data.count);
                    console.log(response.data.data.count);
                    console.log(Math.round(response.data.data.count / 10) + 1)
                    setpages(Math.round(response.data.data.count / 10) + 1);
                    setLoading(false);
                })
                .catch((e) => {
                    Notiflix.Notify.warning(e.message);
                    setLoading(false);
                });
        } catch (e) {
            Notiflix.Notify.warning(e.message);
            setLoading(false);
        }
    }
    function GETStockReport(Data) {
        if (Data == undefined || Data.selected == undefined) {
            setLoading(true);
            try {
                axios.get(`${url}/reports/stock/report?location_id=${Location_Id}&limit=10&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
                    .then((response) => {
                        console.log(response);
                        setstockreportarr(response.data.data.medicine);
                        setLoading(false);
                    }).catch((e) => {
                        Notiflix.Notify.warning(e.message);
                        setLoading(false);
                    });
            } catch (e) {
                Notiflix.Notify.warning(e.message);
                setLoading(false);
            }
        } else {
            setLoading(true);
            try {
                axios.get(`${url}/reports/stock/report?location_id=${Location_Id}&limit=10&offset=${Data.selected * 10}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
                    console.log(response);
                    let medicines = []
                    let vaccines = []
                    let dataarr = []
                    const medicinearr = Object.keys(response.data.data.medicine).map(key => ({
                        medicine_id: key,
                        ...response.data.data.medicine[key]
                    }));
                    medicines.push(medicinearr)
                    const vaccinearr = Object.keys(response.data.data.vaccine).map(key => ({
                        vaccine_id: key,
                        ...response.data.data.vaccine[key]
                    }));
                    vaccines.push(vaccinearr)
                    dataarr.push(medicines)
                    dataarr.push(vaccines)
                    dataarr = dataarr.flat()
                    setstockreportarr(dataarr.flat());
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


    useEffect(() => {
        GetPages();
    }, [Location_Id, fromdate, todate]);

    useEffect(() => {
        GETStockReport();
    }, [pagecount]);
    const parentArray = Object.keys(stockreportarr).map(key => ({
        id: key,
        ...stockreportarr[key]
    }));
    // console.log(parentArray, pages);

    return (
        <>
            <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
                <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
                    <button type="button" className="btn p-0 m-0 heading text-charcoal fw-bolder" style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Stock Reports" : "Stock Report"}{" "} </button>
                </div>
                <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0">
                    <div className="row p-0 m-0 border-burntumber fw-bolder rounded-1">
                        <div className="col-4 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <select className="fw-bold text-burntumber border-0" onChange={(e) => { setLocation_Id(e.target.value) }}>
                                <option value="Choose Location">Choose Location</option>
                                {
                                    clinic.map((data) => (
                                        <option value={data.id}>{data.title}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="col-4 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <input type="date" placeholder="fromdate" className="p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        <div className="col-4 p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-1">
                            <input type="date" className=" p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div>
                    </div>
                </div>
                <div className="col-2 p-0 m-0 export col-md-2 col-lg-2 align-self-center text-center ">
                    <DownloadTableExcel
                        filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} StockReports`}
                        sheet="StockReports"
                        currentTableRef={StockReportref.current}
                    >
                        <button className='btn button-lightyellow text-start p-0 m-0 px-2 fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={StockReportref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Item ID </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Item Name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Opening Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Opening Value </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Purchase Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Purchase Value </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Sale Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Sale Value </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Closing Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Closing Value </th>
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
                                    <div
                                        className="spinner-border ms-auto"
                                        role="status"
                                        aria-hidden="true"
                                    ></div>
                                </div>
                            </tr>
                        </tbody>
                    ) : stockreportarr && stockreportarr.length != 0 ? (
                        <tbody>
                            {
                                parentArray.map((key, i) => (
                                    <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                        <td className="text-charcoal fw-bold">{key.id != undefined ? key.id : ''} </td>
                                        <td className="text-charcoal fw-bold">{key.item_name != undefined ? key.item_name : ''} </td>
                                        <td className="text-charcoal fw-bold">{key.opening_qty != undefined ? key.opening_qty : ''} </td>
                                        <td className="text-charcoal fw-bold">₹{key.opening_value != undefined ? key.opening_value : ''}</td>
                                        <td className="text-charcoal fw-bold">{key.purchase_qty != undefined ? key.purchase_qty : ''} </td>
                                        <td className="text-charcoal fw-bold">₹{key.purchase_value != undefined ? key.purchase_value : ''} </td>
                                        <td className="text-charcoal fw-bold">{key.sale_qty != undefined ? key.sale_qty : ''} </td>
                                        <td className="text-charcoal fw-bold">₹{key.sale_value != undefined ? key.sale_value : ''}</td>
                                        <td className="text-charcoal fw-bold">{key.closing_qty != undefined ? key.closing_qty : ''} </td>
                                        <td className="text-charcoal fw-bold">₹{key.closing_value != undefined ? key.closing_value : ''}</td>
                                    </tr>
                                ))}
                        </tbody>
                    ) : (
                        <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
                            <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                                <strong className="text-charcoal fw-bolder text-center"> No Stock Reports </strong>
                            </div>
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
                    onPageChange={GETStockReport}
                    containerClassName={"pagination scroll align-self-center align-items-center"}
                    pageClassName={"page-item text-charcoal"}
                    pageLinkClassName={"page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1"}
                    previousClassName={"btn button-charcoal-outline me-2"}
                    previousLinkClassName={"text-decoration-none text-charcoal"}
                    nextClassName={"btn button-charcoal-outline ms-2"}
                    nextLinkClassName={"text-decoration-none text-charcoal"}
                    breakClassName={"d-flex mx-2 text-charcoal fw-bold fs-4"}
                    breakLinkClassName={"text-decoration-none text-charcoal"}
                    activeClassName={"active "}
                />
            </div>
        </>
    )
}

export { StockReport }
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const RateList = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const OpeningStockref = useRef();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [ratelistarr, setratelistarr] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };

    function GetPages() {
        try {
            axios
                .get(
                    `${url}/sale/entry?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate
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
    function GETRateList(Data) {
        if (Data == undefined || Data.selected == undefined) {
            setLoading(true);
            try {
                axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
                    .then((response) => {
                        ;
                        setratelistarr(response.data.data.sale_entry);
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
                axios
                    .get(
                        `${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25
                        }&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate
                        }`
                    )
                    .then((response) => {
                        ;
                        setratelistarr(response.data.data.sale_entry);
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
    }, [fromdate, todate]);

    useEffect(() => {
        GETRateList();
    }, [pagecount]);
    return (
        <>
        <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> {pagecount} {pagecount > 0 ? "Rate Lists" : "Rate List"}{" "} </h2>

            <div className="row p-0 m-0 ms-2 mt-2">
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
                <div className="col-auto p-0 m-0 export align-self-center text-center ">
                    <DownloadTableExcel
                        filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} StockReports`}
                        sheet="StockReports"
                        currentTableRef={OpeningStockref.current}
                    >
                        <button className='button button-seashell text-start fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={OpeningStockref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Item ID </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Item Name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Party </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> GST Rate </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Sales Price </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Purchase Price </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> MRP </th>
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
                    ) : ratelistarr && ratelistarr.length != 0 ? (
                        <tbody>
                            {ratelistarr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">  </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
                            <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                                <strong className="text-charcoal fw-bolder text-center"> No Rate Lists </strong>
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
                    onPageChange={GETRateList}
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
        </>
    )
}
export { RateList }
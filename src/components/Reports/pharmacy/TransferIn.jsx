import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const TransferIn = () => {
    const clinic = useContext(Clinic)
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const TransferInref = useRef();
    const [searchname, setsearchname] = useState('')
    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [transferinarr, settransferinarr] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [Location_Id, setLocation_Id] = useState()

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };
    // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/transfer/stocks/list?location_id=1&limit=10&offset=0

    function GETTransferIn(Data) {

        setLoading(true);
        try {
            axios.get(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/transfer/stocks/list?location_id=${Location_Id} `)
                .then((response) => {
                    ;
                    settransferinarr(response.data.data.transfer_stocks_recevied);
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


    // useEffect(() => {
    //     GetPages();
    // }, [Location_Id]);

    useEffect(() => {
        GETTransferIn();
    }, [Location_Id]);
    return (
        <>
          <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> {pagecount} {pagecount > 1 ? "Transfer Stocks In" : "Transfer Stock In"}{" "}  </h2>
            <div className="row p-0 m-0 ms-2 mt-2">
                <div className="col-auto bg-seashell rounded-2">
                    <div className="row p-0 m-0 align-items-center align-self-center">
                        <div className="col-auto bg-seashell">
                            <select className="fw-bold form-control bg-seashell border-0 text-charcoal" onChange={(e) => { setLocation_Id(e.target.value) }}>
                                <option value="Choose Location">Choose Location</option>
                                {
                                    clinic.map((data) => (
                                        <option value={data.id}>{data.title}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="col-auto p-0 m-0 text-charcoal text-center fw-bolder bg-seashell  ">
                            <input type="date" placeholder="fromdate" className="form-control bg-seashell text-charcoal text-center border-0 fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        <div className="col-auto p-0 m-0">-</div>
                        <div className="col-auto p-0 m-0 text-charcoal  text-center fw-bolder bg-seashell ">
                            <input type="date" className=" form-control bg-seashell text-charcoal text-center border-0 fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div>
                    </div>
                </div>
                <div className="col-auto p-0 m-0 export text-center ">
                    <DownloadTableExcel filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} Stock transfer In`} sheet="StockTransferIn" currentTableRef={TransferInref.current} >
                        <button className='button button-seashell fw-bold'> Export</button>
                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={TransferInref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Delivery Note No. </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Date</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Location Name</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Item name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Batch</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Expiry </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Taxable </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Tax Rate</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Total </th>
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
                    ) : transferinarr && transferinarr.length != 0 ? (
                        <tbody>
                            {transferinarr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"></td>
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold"> </td>
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
                                <strong className="text-charcoal fw-bolder text-center"> No Stocks Transfers In </strong>
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
                    onPageChange={GETTransferIn}
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
                    activeClassName={"active"}
                />
            </div>
        </>
    )
}

export { TransferIn }
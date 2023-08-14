import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const SummaryData = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const OpeningStockref = useRef();

    // const [fromdate, setfromdate] = useState();
    // const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [summarydataarr, setsummarydataarr] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [fromdate, setfromdate] = useState()

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };
    // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/reports/summary/wise/data

    function GETSummaryData() {
        setLoading(true);
        try {
            axios.get(`${url}/reports/summary/wise/data?from_date=${fromdate ? fromdate : currentDate}`)
                .then((response) => {
                    ;
                    const parentArray = Object.keys(response.data.data).map(key => ({
                        particular: key,
                        ...response.data.data[key]
                    }));
                    setsummarydataarr(parentArray);
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

    useEffect(() => {
        GETSummaryData();
    }, [fromdate]);
    let months = [["Jan", '01'], ["Feb", "02"], ["Mar", "03"], ["Apr", "04"], ["May", "05"], ["Jun", "06"], ["Jul", "07"], ["Aug", "08"], ["Sep", "09"], ["Oct", "10"], ["Nov", "11"], ["Dec", "12"]]
    function month_explorer(date) {
        date = date.split(" to ")
        let fromdate = date[0];
        let todate = date[1]
        fromdate = fromdate.split('-')

        for (let i = 0; i < months.length; i++) {
            if (fromdate[1] == months[i][1]) {
                fromdate[1] = months[i][0]
            }
        }
        let newdate = fromdate[1] + " " + fromdate[0]
        return newdate
    }
    return (
        <>
                <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> {pagecount} {pagecount > 1 ? "Summary Data" : "Summary Data"}{" "} </h2>

            <div className="row p-0 m-0">
            <div className="col-auto row text-charcoal text-center fw-bolder bg-seashell ms-2 rounded-2 ">
            <input type="month" placeholder="month and year" className="p-0 m-0 border-0 bg-seashell text-charcoal text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
            </div>
        
                <div className="col-auto p-0 m-0 export align-self-center text-center ">
                    <DownloadTableExcel
                        filename={` Summary Data`}
                        sheet="SummaryData"
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
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Particular</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
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
                    ) : summarydataarr && summarydataarr.length != 0 ? (
                        <tbody>
                            {summarydataarr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">{item.particular !== undefined ? month_explorer(item.particular) : ""} </td>
                                    <td className="text-charcoal fw-bold">₹{item.taxable !== undefined ? Number(item.taxable).toFixed(2) : ""} </td>
                                    <td className="text-charcoal fw-bold">₹{item.tax !== undefined ? Number(item.tax).toFixed(2) : ""} </td>
                                    <td className="text-charcoal fw-bold">₹{item.taxable !== undefined && item.tax !== undefined ? Number(Number(item.taxable) + Number(item.tax)).toFixed(2) : ''} </td>
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

        </>
    )
}

export { SummaryData }
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

const StockReport_By_Name = () => {
    const medicinesref = useRef(null);
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const StockReport_By_Name_ref = useRef();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [stockreportarr, setstockreportarr] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    //search meds
    const [itemsearch, setitemsearch] = useState([""]);
    const [itemname, setitemname] = useState();
    const [itemid, setitemid] = useState('');
    const [itemtype, setitemtype] = useState('');
    const [loadsearch, setloadsearch] = useState();

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    }

    // function GetPages() {
    //     if (itemid && itemtype && itemid !== undefined && itemtype !== undefined) {
    //     try {
    //         axios.get(`${url}/reports/stock/report/by/item?item_id=${itemid}&item_type=${itemtype}&from=${fromdate ? fromdate : currentDate}&to=${todate ? todate : fromdate ? fromdate : currentDate}`)
    //             .then((response) => {
    //                 setpagecount(response.data.data.count);
    //                 setpages(Math.round(response.data.data.count / 25) + 1);
    //                 setLoading(false);
    //             })
    //             .catch((e) => {
    //                 Notiflix.Notify.warning(e.message);
    //                 setLoading(false);
    //             });
    //     } catch (e) {
    //         Notiflix.Notify.warning(e.message);
    //         setLoading(false);
    //     }
    //     }
    // }
    function GETStockReport(Data) {
        // if (itemid && itemtype && itemid !== undefined && itemtype !== undefined) {

        if (Data == undefined || Data.selected == undefined) {
            setLoading(true);
            try {
                axios.get(`${url}/reports/stock/report/by/item?item_id=${itemid ? itemid : ''}&item_type=${itemtype ? itemtype : ''}&from=${fromdate ? fromdate : currentDate}&to=${todate ? todate : fromdate ? fromdate : currentDate}`)
                    .then((response) => {
                        ;
                        setstockreportarr(response.data.data.medicine);
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
        } else {
            setLoading(true);
            try {
                axios.get(`${url}/reports/stock/report/by/item?item_id=${itemid}&item_type=${itemtype}&from=${fromdate ? fromdate : currentDate}&to=${todate ? todate : fromdate ? fromdate : currentDate}`)
                    .then((response) => {
                        ;
                        setstockreportarr(response.data.data.sale_entry);
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
        // } else {
        //     Notiflix.Notify.info('Please Select Item to get the stock report')
        // }
    }

    const searchmeds = async (search) => {
        setloadsearch(true);
        try {
            await axios.get(`${url}/item/search?search=${search}`)
                .then((response) => {
                    let medicines = [];
                    let vaccines = [];
                    let items = [];
                    medicines.push(response.data.data.medicines ? response.data.data.medicines : []);
                    vaccines.push(response.data.data.vaccines ? response.data.data.vaccines : []);
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
    // useEffect(() => {
    //     GetPages();
    // }, [itemid, fromdate, todate]);

    useEffect(() => {
        GETStockReport();
    }, [itemid, fromdate, todate]);

    const parentArray = Object.keys(stockreportarr).map(key => ({
        id: key,
        ...stockreportarr[key]
    }));
    return (
        <>
            <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
                <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
                    <button type="button" className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: "fit-content" }} > {pagecount} {pagecount > 1 ? "Stock Reports" : "Stock Report"}{" "} </button>
                </div>
                <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0">
                    <div className="row p-0 m-0 border-burntumber fw-bolder rounded-1">
                        <div className="col-4 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <div className="position-relative">
                                <input className="fw-bold text-burntumber border-0 bg-pearl bg-seashell" placeholder="Search Items" value={itemname ? itemname : ""} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemtype(); }} />
                                <div ref={medicinesref} className="position-absolute rounded-4 col-12" style={{ zIndex: "2" }} >
                                    {
                                        itemsearch ? (
                                            loadsearch ? (
                                                <div className="rounded-1 p-1 bg-pearl">
                                                    Searching Please wait....
                                                    <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                                                        <span className="sr-only"> </span>{" "}
                                                    </div>
                                                </div>
                                            ) : itemsearch.length == 0 ? (
                                                <div className="bg-burntumber text-light rounded-1 p-1 text-wrap"> Oops! Not Avaliable </div>
                                            ) : (
                                                <div className={`mt-1 rounded-4 bg-pearl shadow px-1 pb-2 d-${itemsearch && itemsearch.length > 1 ? "block" : "none"}`} >
                                                    <p className={`p-0 m-0 bg-pearl fw-bold text-charcoal75 text-start rounded-4 ps-2 `} style={{ fontSize: "0.8rem" }} > {itemsearch.length} Search Results </p>
                                                    {itemsearch.map((data, i) => (
                                                        <div style={{ cursor: "pointer" }} className={`p-0 ps-1 text-start text-charcoal text-wrap py-2  bg-${i % 2 == 0 ? "" : "seashell"}`} name={data.id} onClick={(e) => { setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); setitemtype(data.vaccines_id ? "v" : "m"); medicinesref.current.style.display = "none"; }} >
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
                        filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} StockReports_by_Name`}
                        sheet="StockReports_by_Name"
                        currentTableRef={StockReport_By_Name_ref.current}
                    >
                        <button className='btn button-lightyellow text-start p-0 m-0 px-2 fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={StockReport_By_Name_ref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Date Opening </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Type </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Invoice No. </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Party Name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Batch </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">  Price </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">  Qty In </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Qty Out  </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Closing </th>
                        </tr>
                    </thead>
                    {Loading ? (
                        <tbody className="text-center" style={{ minHeight: "55vh", height: "55vh" }} >
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
                            {parentArray.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold"> </td>
                                    <td className="text-charcoal fw-bold">{itemtype} </td>
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
                                <strong className="text-charcoal fw-bolder text-center"> No Stock Reports By Name </strong>
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

export { StockReport_By_Name }

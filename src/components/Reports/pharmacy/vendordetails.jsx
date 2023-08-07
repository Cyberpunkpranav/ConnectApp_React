import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const VendorDetails = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const VendorDetailsref = useRef();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [vendorsearch, setvendorsearch] = useState([])
    const [loadvendors, setloadvendors] = useState(false)

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };
    const GETVendorDetails = async (search) => {
        setloadvendors(true);
        try {
            await axios
                .get(`${url}/kyc/list?limit=100&offset=0`)
                .then((response) => {
                    setvendorsearch(response.data.data);
                    setloadvendors(false);
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

    // function GetPages() {
    //     try {
    //         axios
    //             .get(
    //                 `${url}/sale/entry?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate
    //                 }&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`
    //             )
    //             .then((response) => {
    //                 setpagecount(response.data.data.total_count);
    //                 setpages(Math.round(response.data.data.total_count / 25) + 1);
    //                 setLoading(false);
    //             })
    //             .catch((e) => {
    //                 Notiflix.Notify.warning(e);
    //                 setLoading(false);
    //             });
    //     } catch (e) {
    //         Notiflix.Notify.warning(e.message);
    //         setLoading(false);
    //     }
    // }
    // function GETVendorDetails(Data) {
    //     if (Data == undefined || Data.selected == undefined) {
    //         setLoading(true);
    //         try {
    //             axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`)
    //                 .then((response) => {
    //                     console.log(response);
    //                     setvendordetailsarr(response.data.data.sale_entry);
    //                     setLoading(false);
    //                 })
    //                 .catch((e) => {
    //                     Notiflix.Notify.warning(e);
    //                     setLoading(false);
    //                 });
    //         } catch (e) {
    //             Notiflix.Notify.warning(e.message);
    //             setLoading(false);
    //         }
    //     } else {
    //         setLoading(true);
    //         try {
    //             axios
    //                 .get(
    //                     `${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25
    //                     }&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate
    //                     }`
    //                 )
    //                 .then((response) => {
    //                     console.log(response);
    //                     setvendordetailsarr(response.data.data.sale_entry);
    //                     setLoading(false);
    //                 })
    //                 .catch((e) => {
    //                     Notiflix.Notify.warning(e);
    //                     setLoading(false);
    //                 });
    //         } catch (e) {
    //             Notiflix.Notify.warning(e.message);
    //             setLoading(false);
    //         }
    //     }
    // }


    // useEffect(() => {
    //     GetPages();
    // }, [fromdate, todate]);

    useEffect(() => {
        GETVendorDetails();
    }, []);
    console.log(vendorsearch)
    return (
        <>
            <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
                <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
                    <button type="button" className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: "fit-content" }} > {pagecount} {pagecount > 0 ? "Vendors Details" : "Vendor Details"}{" "} </button>
                </div>
                <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0">
                    {/* <div className="row p-0 m-0 border-burntumber fw-bolder rounded-1">
                        <div className="col-6 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <input type="date" placeholder="fromdate" className="p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        <div className="col-6 p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-1">
                            <input type="date" className=" p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div>
                    </div> */}
                </div>
                <div className="col-2 p-0 m-0 export col-md-2 col-lg-2 align-self-center text-center ">
                    <DownloadTableExcel
                        filename={`Vendor Details`}
                        sheet="VendorDetails"
                        currentTableRef={VendorDetailsref.current}
                    >
                        <button className='btn button-lightyellow text-start p-0 m-0 px-2 fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={VendorDetailsref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Vendor Name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">GSTIN</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Pan </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">MSME Certificate </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Bank Account </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">IFSC </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Bank Name </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Contact Person Number </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Email ID </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">State </th>
                        </tr>
                    </thead>
                    {Loading ? (
                        <tbody className="text-center" style={{ minHeight: "55vh", height: "60vh" }} >
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
                    ) : vendorsearch && vendorsearch.length != 0 ? (
                        <tbody>
                            {vendorsearch.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">{item.entity_name != undefined ? item.entity_name : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.GSTIN_no != undefined ? item.GSTIN_no : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.PAN_no != undefined ? item.PAN_no : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.MSME_no != undefined ? item.MSME_no : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.account_number != undefined ? item.account_number : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.ifsc_code != undefined ? item.ifsc_code : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.bank_name != undefined ? item.bank_name : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.mobile_no != undefined ? item.mobile_no : ''}</td>
                                    <td className="text-charcoal fw-bold">{item.email_for_communication != undefined ? item.email_for_communication : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.state != undefined ? item.state : ''} </td>

                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
                            <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                                <strong className="text-charcoal fw-bolder text-center"> No Vendor Details </strong>
                            </div>
                        </tbody>
                    )}
                </table>
            </div>

        </>
    )
}

export { VendorDetails }
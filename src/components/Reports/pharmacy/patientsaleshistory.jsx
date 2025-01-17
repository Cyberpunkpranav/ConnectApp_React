import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const PatientSalesHistory = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const PatientSalesHistoryref = useRef();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [patientname, setpatientname] = useState()
    const [patientsalehistoryarr, setpatientsalehistoryarr] = useState([]);
    const [patientsalereturnhistoryarr, setpatientsalereturnhistoryarr] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [patientid, setpatientid] = useState()
    const [searchinput, setsearchinput] = useState()
    const [searchlist, setsearchlist] = useState([])
    const [displaysearchlist, setdisplaysearchlist] = useState('none')
    const [searchload, setsearchload] = useState(false)
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };
    // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/reports/sales/patient?from_date=2023-01-01&to_date=2023-06-01&patient_id=3647

    const searchpatient = (e) => {
        setsearchload(true)
        if (searchinput && searchinput.length >= 0) {
            setdisplaysearchlist('block');
        } else {
            setdisplaysearchlist('none');
        }
        setsearchinput(e.target.value)
        axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
            setsearchlist(response.data.data.patients_list)
            setsearchload(false)
        })

    }
    const get_value = async (value, name) => {
        setsearchinput(value);
        setpatientid(name);
        setdisplaysearchlist('none');

    }
    function GETPatientSalesHistory() {
        if (patientid) {

            setLoading(true);
            try {
                axios.get(`${url}/reports/sales/patient?&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}&patient_id=${patientid}`)
                    .then((response) => {
                        ;
                        const parentArray = Object.keys(response.data.data.sales).map(key => ({
                            invoice_no: key,
                            ...response.data.data.sales[key]
                        }));
                        setpatientsalehistoryarr(parentArray);
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
    function GETPatientSalesReturnHistory() {
        if (patientid) {
            setLoading(true);
            try {
                axios.get(`${url}/reports/sales/return/patient?&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}&patient_id=${patientid}`)
                    .then((response) => {
                        
                        const parentArray = Object.keys(response.data.data.sales_return).map(key => ({
                            invoice_no: key,
                            ...response.data.data.sales_return[key]
                        }));
                        setpatientsalereturnhistoryarr(parentArray);
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
    }

    useEffect(() => {
        GETPatientSalesHistory();
        GETPatientSalesReturnHistory();
    }, [patientid, fromdate, todate]);

    return (
        <>
                        <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}>{pagecount} {pagecount > 0 ? "Patient Sales History" : "Patient Sales History"}{" "} </h2>

            <div className="row p-0 m-0 text-center mt-2 ms-2">
            <div className="col-auto p-0 m-0 text-burntumber text-center fw-bolder bg-seashell position-relative align-self-center rounded-2 ">
                            <input type="text" placeholder="patient name" className="button button-seashell selectpatient bg-seashell border-0 position-relative text-center text-charcoal fw-bold" value={searchinput ? searchinput : ''} onChange={searchpatient} />
                            <div className={`w-100 d-${displaysearchlist} position-absolute top-10 mt-2 border shadow-sm`} style={{ zIndex: '10' }}>
                                {
                                    searchload ? (
                                        <p className="btn text-charcoal75 fw-bold bg-pearl rounded-2  p-0 m-0 ps-1">Loading... </p>
                                    ) : (
                                        searchinput && searchlist.length == 0 ? (
                                            <p className="text-danger btn bg-lightred p-0 m-0">Patient not found add as new user to book appointements</p>
                                        ) : (
                                            <div className="p-2 bg-pearl">
                                                {
                                                    searchlist.map((data) => (
                                                        <div style={{ cursor: 'pointer' }} className='col-12 d-block p-0 m-0 ms-1 border-0 bg-pearl py-1 border-bottom text-charcoal text-start border border-1' onClick={(e) => get_value(data.full_name, data.id)}>{data.full_name}  {data.phone_number}</div>
                                                    ))
                                                }
                                            </div>

                                        )
                                    )

                                }
                            </div>
                        </div>
                <div className="col-auto p-0 m-0">
                    <div className="row align-items-center rounded-2 bg-seashell rounded-2 ms-2">

                        <div className="col-auto">
                        <div className="row p-0 m-0 align-items-center align-self-center bg-seashell">
                        <div className="col-auto text-burntumber text-center fw-bolder bg-seashell  rounded-1 ">
                            <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 border-0 text-charcoal text-center fw-bold" value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        <div className="col-auto p-0 m-0">
                                -
                        </div>
                        <div className="col-auto text-charcoal text-center fw-bolder bg-seashell rounded-1">
                            <input type="date" className="border-0 button button-seashell text-charcoal text-center fw-bold" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div>
                        </div>
                        </div>
                        </div>
                </div>
                <div className="col-auto p-0 m-0 export align-self-center text-center ">
                    <DownloadTableExcel
                        filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} Patient Sales History`}
                        sheet="PatientSalesHistory"
                        currentTableRef={PatientSalesHistoryref.current}
                    >
                        <button className='button button-seashell fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={PatientSalesHistoryref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Date </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Invoice</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Type </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Amount </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
                            {/* <th className="text-charcoal75 fw-bolder p-0 m-0 px-1"> more info </th> */}
                        </tr>
                    </thead>
                    {Loading ? (
                        <tbody className="text-center" style={{ minHeight: "55vh", height: "55vh" }} >
                            <tr className="position-absolute border-0 start-0 end-0 px-5">
                                <div class="d-flex align-items-center spinner">
                                    <strong className="" style={{ fontSize: "1rem" }}>
                                        Getting Details please be Patient ...
                                    </strong>
                                    <div className="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
                                </div>
                            </tr>
                        </tbody>
                    ) : patientsalehistoryarr && patientsalehistoryarr.length != 0 ? (
                        <tbody>
                            {patientsalehistoryarr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">{reversefunction(item.date)}</td>
                                    <td className="text-charcoal fw-bold">{item.invoice}</td>
                                    <td className="text-charcoal fw-bold">{item.type} </td>
                                    <td className="text-charcoal fw-bold">₹{Number(item.amount).toFixed(2)}</td>
                                    <td className="text-charcoal fw-bold">₹{item.tax} </td>
                                    <td className="text-charcoal fw-bold">₹{item.total} </td>
                                    {/* <td className="text-charcoal fw-bold"> </td> */}
                                </tr>
                            ))}
                            {patientsalereturnhistoryarr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">{reversefunction(item.date)}</td>
                                    <td className="text-charcoal fw-bold">{item.invoice}</td>
                                    <td className="text-charcoal fw-bold">{item.type} </td>
                                    <td className="text-charcoal fw-bold">₹{Number(item.amount).toFixed(2)}</td>
                                    <td className="text-charcoal fw-bold">₹{item.tax} </td>
                                    <td className="text-charcoal fw-bold">₹{item.total} </td>
                                    {/* <td className="text-charcoal fw-bold"> </td> */}
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
                            <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                                <strong className="text-charcoal fw-bolder text-center"> No Patient Sales History </strong>
                            </div>
                        </tbody>
                    )}
                </table>
            </div>

        </>
    )
}

export { PatientSalesHistory }
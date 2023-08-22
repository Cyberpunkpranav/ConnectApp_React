import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';


const DoctorWiseSales = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const BatchDetailsref = useRef();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [doctorwisesales, setdoctorwisesales] = useState([]);
    const [doctorwisesalesreturn, setdoctorwisesalesreturn] = useState([]);
    const [pages, setpages] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [doctorid, setdoctorid] = useState()
    const docnames = useContext(DoctorsList)

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };
    // https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/reports/sales/doctor?from_date=2023-01-01&to_date=2023-06-01&doctor_id=1

    function GETDoctorWiseSales() {
        if (doctorid && doctorid !== undefined) {
            setLoading(true);
            try {
                axios.get(`${url}/reports/sales/doctor?from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}&doctor_id=${doctorid}`)
                    .then((response) => {
                        ;
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
                        setdoctorwisesales(dataarr.flat());
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
    function GETDoctorWiseSalesReturn() {
        if (doctorid && doctorid !== undefined) {
            setLoading(true);
            try {
                axios.get(`${url}/reports/sales/return/doctor?from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}&doctor_id=${doctorid}`)
                    .then((response) => {
                        ;
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
                        setdoctorwisesalesreturn(dataarr.flat());
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
        GETDoctorWiseSales();
        GETDoctorWiseSalesReturn()
    }, [doctorid, fromdate, todate]);
    return (
        <>
            <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> Doctor Wise Sales</h2>
            <div className="row p-0 m-0 ms-2  mt-2">
            <div className="col-auto p-0 m-0 text-charcoal text-center fw-bolder bg-seashell me-2 rounded-2">
                            <select className="button button-seashell border-0 text-charcoal fw-bold text-center" value={doctorid ? doctorid : ''} onChange={(e) => { setdoctorid(e.target.value) }}>
                                <option selected value="Select Doctor">Select Doctor</option>
                                {
                                    docnames ? (
                                        docnames.map((response, i) => (
                                            <option className={`form-control text-charcoal`} key={i} value={response[0]} >Dr. {response[1]}</option>
                                        ))

                                    ) : (<option>Loading..</option>)
                                }
                            </select>
                        </div>
                <div className="col-auto bg-seashell rounded-2">
                    <div className="row p-0 m-0 align-items-center align-self-center">

                        <div className="col-auto p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <input type="date" placeholder="fromdate" className="form-control bg-seashell border-0 bg-seashell text-charcoal text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        <div className="col-auto p-0 m-0">-</div>
                        <div className="col-auto p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-1">
                            <input type="date" className="form-control bg-seashell border-0 bg-seashell text-charcoal text-center fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div>
                    </div>
                </div>
                <div className="col-auto p-0 m-0 export ">
                    <DownloadTableExcel
                        filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} Doctor Wise Sales`}
                        sheet="DoctorWiseSales"
                        currentTableRef={BatchDetailsref.current}
                    >
                        <button className='button button-seashell fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={BatchDetailsref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            {/* <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Item ID </th> */}
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Item Name</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Type</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">SaleType</th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Batch No. </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Invoice </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Date </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Qty </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Taxable Amt </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Tax </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Total </th>
                            <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Total Profit </th>
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
                    ) : doctorwisesales && doctorwisesales.length != 0 ? (
                        <tbody>
                            {doctorwisesales.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    {/* <td className="text-charcoal fw-bold">{item.medicine_id ? item.medicine_id : item.vaccine_id ? item.vaccine_id : ''} </td> */}
                                    <td className="text-charcoal fw-bold">{item.item ? item.item : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.medicine_id ? 'medicine' : item.vaccine_id ? 'vaccine' : ''} </td>
                                    <td className="text-charcoal fw-bold">Sales</td>
                                    <td className="text-charcoal fw-bold">{item.batch_no ? item.batch_no : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.invoice ? item.invoice : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.date ? reversefunction(item.date) : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.qty ? item.qty : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.taxable_amount ? Number(item.taxable_amount).toFixed(2) : ''}  </td>
                                    <td className="text-charcoal fw-bold">{item.tax ? Number(item.tax).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.total ? item.total : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.total_profit ? Number(item.total_profit).toFixed(2) : ''} </td>
                                </tr>
                            ))}
                            {doctorwisesalesreturn.length !== undefined ? doctorwisesalesreturn.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    {/* <td className="text-charcoal fw-bold">{item.medicine_id ? item.medicine_id : item.vaccine_id ? item.vaccine_id : ''} </td> */}
                                    <td className="text-charcoal fw-bold">{item.item ? item.item : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.medicine_id ? 'medicine' : item.vaccine_id ? 'vaccine' : ''} </td>
                                    <td className="text-charcoal fw-bold">Sales Return</td>
                                    <td className="text-charcoal fw-bold">{item.batch_no ? item.batch_no : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.invoice ? item.invoice : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.date ? reversefunction(item.date) : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.qty ? item.qty : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.taxable_amount ? Number(item.taxable_amount).toFixed(2) : ''}  </td>
                                    <td className="text-charcoal fw-bold">{item.tax ? Number(item.tax).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.total ? item.total : ''} </td>
                                    <td className="text-charcoal fw-bold">{item.total_profit ? Number(item.total_profit).toFixed(2) : ''} </td>
                                </tr>
                            )) : ''}
                        </tbody>
                    ) : (
                        <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
                            <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                                <strong className="text-charcoal fw-bolder text-center"> No Doctor Wise Sales </strong>
                            </div>
                        </tbody>
                    )}
                </table>
            </div>
        </>
    )
}

export { DoctorWiseSales }
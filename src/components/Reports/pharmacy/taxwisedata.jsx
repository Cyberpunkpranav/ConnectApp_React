import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const TaxWiseData = () => {
    const permission = useContext(Permissions);
    const currentDate = useContext(TodayDate);
    const ClinicID = localStorage.getItem("ClinicId");
    const adminid = localStorage.getItem("id");
    const url = useContext(URL);
    const TaxWiseDataref = useRef();

    // const [fromdate, setfromdate] = useState();
    // const [todate, settodate] = useState();
    const [Loading, setLoading] = useState(false);
    const [taxwisearr, settaxwisearr] = useState([]);
    const [pagecount, setpagecount] = useState();
    const [fromdate, setfromdate] = useState()

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-");
            return date;
        }
    };

    function GETTaxWiseData() {
        setLoading(true);
        try {
            axios.get(`${url}/reports/summary/wise/data?from_date=${fromdate ? fromdate : ''}`)
                .then((response) => {
                    console.log(response);
                    const parentArray = Object.keys(response.data.data).map(key => ({
                        particular: key,
                        ...response.data.data[key]
                    }));
                    settaxwisearr(parentArray);
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
        GETTaxWiseData();
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
        console.log(fromdate)
        let newdate = fromdate[1] + " " + fromdate[0]
        return newdate
    }
    return (
        <>
            <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
                <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
                    <button type="button" className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: "fit-content" }} > {taxwisearr.length} Tax-Wise Data</button>
                </div>
                <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0">
                    <div className="row p-0 m-0 border-burntumber fw-bolder rounded-1">
                        <div className="col-12 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ">
                            <input type="month" placeholder="month" className="p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate.trim(4) : ""} onChange={(e) => { setfromdate(e.target.value); }} />
                        </div>
                        {/* <div className="col-6 p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-1">
                            <input type="date" className=" p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
                        </div> */}
                    </div>
                </div>
                <div className="col-2 p-0 m-0 export col-md-2 col-lg-2 align-self-center text-center ">
                    <DownloadTableExcel
                        filename={`TaxWiseData`}
                        sheet="StockReports"
                        currentTableRef={TaxWiseDataref.current}
                    >
                        <button className='btn button-lightyellow text-start p-0 m-0 px-2 fw-bold'> Export</button>

                    </DownloadTableExcel>
                </div>
            </div>
            <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
                <table className="table text-start table-responsive" ref={TaxWiseDataref}>
                    <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
                        <tr className=" ">
                            <th rowSpan='2' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Particular </th>
                            <th colSpan='3' scope="colgroup" className="text-charcoal75 fw-bolder p-0 m-0 px-1"> 0% </th>
                            <th colSpan='3' scope="colgroup" className="text-charcoal75 fw-bolder p-0 m-0 px-1"> 5% </th>
                            <th colSpan='3' scope="colgroup" className="text-charcoal75 fw-bolder p-0 m-0 px-1"> 12% </th>
                            <th colSpan='3' scope="colgroup" className="text-charcoal75 fw-bolder p-0 m-0 px-1"> 18% </th>
                            <th colSpan='3' scope="colgroup" className="text-charcoal75 fw-bolder p-0 m-0 px-1"> 28% </th>
                        </tr>
                        <tr>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Taxable </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Tax </th>
                            <th scope='col' className="text-charcoal75 fw-bolder p-0 m-0 px-1"> Total </th>
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
                    ) : taxwisearr && taxwisearr.length != 0 ? (
                        <tbody>
                            {taxwisearr.map((item, i) => (
                                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                                    <td className="text-charcoal fw-bold">{month_explorer(item.particular)} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 0%'] !== undefined ? Number(item['taxable 0%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['tax 0%'] !== undefined ? Number(item['tax 0%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 0%'] !== undefined && item['tax 0%'] !== undefined ? Number(Number(item['taxable 0%']) + Number(item['tax 0%'])).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 5%'] !== undefined ? Number(item['taxable 5%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['tax 5%'] !== undefined ? Number(item['tax 5%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 5%'] !== undefined && Number(item['tax 5%']).toFixed(2) !== undefined ? Number(Number(item['taxable 5%']) + Number(item['tax 5%'])).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 12%'] !== undefined ? Number(item['taxable 12%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['tax 12%'] !== undefined ? Number(item['tax 12%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 12%'] !== undefined && Number(item['tax 12%']).toFixed(2) !== undefined ? Number(Number(item['taxable 12%']) + Number(item['tax 12%'])).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 18%'] !== undefined ? Number(item['taxable 18%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['tax 18%'] !== undefined ? Number(item['tax 18%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 18%'] !== undefined && Number(item['tax 18%']).toFixed(2) !== undefined ? Number(Number(item['taxable 18%']) + Number(item['tax 18%'])).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 28%'] !== undefined ? Number(item['taxable 28%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['tax 28%'] !== undefined ? Number(item['tax 28%']).toFixed(2) : ''} </td>
                                    <td className="text-charcoal fw-bold">₹{item['taxable 28%'] !== undefined && item['tax 28%'] !== undefined ? Number(Number(item['taxable 28%']) + Number(item['tax 28%'])).toFixed(2) : ''} </td>
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

export { TaxWiseData }
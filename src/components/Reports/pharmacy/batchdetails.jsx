import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const BatchDetails = () => {
  const permission = useContext(Permissions);
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const adminid = localStorage.getItem("id");
  const url = useContext(URL);
  const BatchDetailsref = useRef();
  const [searchname, setsearchname] = useState('')
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [Loading, setLoading] = useState(false);
  const [batchdetailsarr, setbatchdetailsarr] = useState([]);
  const [batcharr,setbatcharr] =useState([])
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
      axios.get(`${url}/stock/list?search=${searchname}&limit=25&offset=0`)
        .then((response) => {
          setpagecount(Number(response.data.data.total_count_medicines + response.data.data.total_count_vaccines));
          setpages(Math.round(Number(response.data.data.total_count_medicines + response.data.data.total_count_vaccines) / 25) + 1);
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
  function GETBatchDetails(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true);
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=25&offset=0`)
          .then((response) => {
            ;
            let arr = response.data.data.vaccines.concat(response.data.data.medicines)
            setbatchdetailsarr(arr);
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
        axios.get(`${url}/stock/list?search=${searchname}&limit=25&offset=${Data.selected * 25}`)
          .then((response) => {
            ;
            let arr = response.data.data.vaccines.concat(response.data.data.medicines)
            setbatchdetailsarr(arr);
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
  const Get_Detailed_Data = async () => {
    setbatcharr([]);
    for (let i = 0; i < batchdetailsarr.length; i++) {
      let totalcurrentstockarr = [];
      if (batchdetailsarr[i].stock_info.length == 0) {
        let batchobj = {
          id: batchdetailsarr[i].id,
          name: batchdetailsarr[i].name,
          manufacturer: batchdetailsarr[i].manufacturer,
          max_stock_count: batchdetailsarr[i].max_stock_count,
          alert_stock_count: batchdetailsarr[i].alert_stock_count,
          min_stock_count: batchdetailsarr[i].min_stock_count,
        }
        if (batchdetailsarr == undefined && batchdetailsarr.length == 0) {
          setbatcharr(batchobj);
        } else {
          setbatcharr((prevState) => [...prevState, batchobj]);
        }
      } else {
        for (let j = 0; j < batchdetailsarr[i].stock_info.length; j++) {
          totalcurrentstockarr.push(
            batchdetailsarr[i].stock_info[j].current_stock
          );
          let batchobj = {
            id: batchdetailsarr[i].id,
            name: batchdetailsarr[i].name,
            manufacturer: batchdetailsarr[i].manufacturer,
            max_stock_count: batchdetailsarr[i].max_stock_count,
            alert_stock_count: batchdetailsarr[i].alert_stock_count,
            min_stock_count: batchdetailsarr[i].min_stock_count,
            CGST: batchdetailsarr[i].stock_info[j].CGST,
            CGST_rate: batchdetailsarr[i].stock_info[j].CGST_rate,
            IGST: batchdetailsarr[i].stock_info[j].IGST,
            IGST_rate: batchdetailsarr[i].stock_info[j].IGST_rate,
            SGST: batchdetailsarr[i].stock_info[j].SGST,
            SGST_rate: batchdetailsarr[i].stock_info[j].SGST_rate,
            batch_no: batchdetailsarr[i].stock_info[j].batch_no,
            channel: batchdetailsarr[i].stock_info[j].channel,
            cost: batchdetailsarr[i].stock_info[j].cost,
            current_stock: batchdetailsarr[i].stock_info[j].current_stock,
            discount: batchdetailsarr[i].stock_info[j].discount,
            expiry_date: batchdetailsarr[i].stock_info[j].expiry_date,
            free_qty: batchdetailsarr[i].stock_info[j].free_qty,
            Batch_stock_id: batchdetailsarr[i].stock_info[j].id,
            mfd_date: batchdetailsarr[i].stock_info[j].mfd_date,
            mrp: batchdetailsarr[i].stock_info[j].mrp,
            purchase_entry_id: batchdetailsarr[i].stock_info[j].purchase_entry_id,
            qty: batchdetailsarr[i].stock_info[j].qty,
            rate: batchdetailsarr[i].stock_info[j].rate,
            trade_discount: batchdetailsarr[i].stock_info[j].trade_discount,
            total_amount: batchdetailsarr[i].stock_info[j].total_amount,
            totalstock: totalcurrentstockarr,
          };
          if (batchdetailsarr == undefined && batchdetailsarr.length == 0) {
            setbatcharr(batchobj);
          } else {
            setbatcharr((prevState) => [...prevState, batchobj]);
          }
        }
      }
    }
  }
  useEffect(() => {
    GetPages();
    GETBatchDetails();
    Get_Detailed_Data()
  }, [searchname,fromdate,todate]);

  useEffect(() => {
    GETBatchDetails();
  }, [pagecount]);
  console.log(batchdetailsarr,batcharr)
  return (
    <>
    <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> {pagecount} {pagecount > 1 ? "Batches Details" : "Batch Details"}{" "}  </h2>
      <div className="row p-0 m-0 text-center mt-2 ms-2">
        <div className="col-auto border-0 rounded-2 bg-seashell">
          <div className="row p-0 m-0 fw-bolder align-items-center align-self-center">
            <div className="col-auto p-0 m-0 text-charcoal text-center fw-bolder bg-seashell ">
              <input type="text" placeholder="itemname" className="button button-seashell rounded-0 text-charcoal text-center fw-bolder " value={searchname ? searchname : ""} onChange={(e) => { setsearchname(e.target.value); }} />
            </div>
            <div className="col-auto p-0 m-0 text-charcoal text-center fw-bolder bg-seashell ">
              <input type="date" placeholder="fromdate" className="button button-seashell rounded-0 text-charcoal text-center fw-bolder " value={fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { setfromdate(e.target.value); }} />
            </div>
            <div className="col-auto p-0 m-0">-</div>
            <div className="col-auto p-0 m-0  text-charcoal text-center fw-bolder bg-seashell">
              <input type="date" className="button button-seashell rounded-0 text-charcoal text-center bg-seashell fw-bolder" value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ""} onChange={(e) => { settodate(e.target.value); }} />
            </div>
          </div>
        </div>
        <div className="col-auto p-0 m-0 export align-self-center text-center ">
          <DownloadTableExcel
            filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} Batch Details`}
            sheet="BatchDetails"
            currentTableRef={BatchDetailsref.current}
          >
            <button className='button button-seashell text-start fw-bold'> Export</button>

          </DownloadTableExcel> 
        </div>
      </div>  
      <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
        <table className="table text-start table-responsive" ref={BatchDetailsref}>
          <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
            <tr className=" ">
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Item ID </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Item Name</th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Batch No. </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Purchase Date </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Expiry Date </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Qty </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">MRP </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Cost </th>
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
          ) : batcharr && batcharr.length != 0 ? (
            <tbody>
              {batcharr.map((item, i) => (
                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                  <td className="text-charcoal fw-bold">{item.id?item.id:''} </td>
                  <td className="text-charcoal fw-bold">{item.name?item.name:''}</td>
                  <td className="text-charcoal fw-bold">{item.batch_no?item.batch_no:''} </td>
                  <td className="text-charcoal fw-bold"> </td>
                  <td className="text-charcoal fw-bold">{item.expiry_date?reversefunction(item.expiry_date):""} </td>
                  <td className="text-charcoal fw-bold">{item.qty?item.qty:''} </td>
                  <td className="text-charcoal fw-bold">₹{item.mrp?item.mrp:''}</td>
                  <td className="text-charcoal fw-bold">₹{item.cost?item.cost:''}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <strong className="text-charcoal fw-bolder text-center"> No Batch Details </strong>
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
          onPageChange={GETBatchDetails}
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

export { BatchDetails }
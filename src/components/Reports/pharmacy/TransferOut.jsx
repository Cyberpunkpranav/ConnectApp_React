import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import Notiflix from "notiflix";
import ReactPaginate from "react-paginate";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const TransferOut = () => {
  const clinic = useContext(Clinic)
  const permission = useContext(Permissions);
  const currentDate = useContext(TodayDate);
  const ClinicID = localStorage.getItem("ClinicId");
  const adminid = localStorage.getItem("id");
  const url = useContext(URL);
  const TransferInref = useRef();
  const [transferout, settransferout] = useState('')
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [Loading, setLoading] = useState(false);
  const [transferoutarr, settransferoutarr] = useState([]);
  const [pages, setpages] = useState([]);
  const [pagecount, setpagecount] = useState();
  const [Location_Id, setLocation_Id] = useState()

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-");
      return date;
    }
  };

  // function GetPages() {
  //   try {
  //     axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`)
  //       .then((response) => {
  //         setpagecount(response.data.data.total_count);
  //         setpages(Math.round(response.data.data.total_count / 25) + 1);
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         Notiflix.Notify.warning(e);
  //         setLoading(false);
  //       });
  //   } catch (e) {
  //     Notiflix.Notify.warning(e.message);
  //     setLoading(false);
  //   }
  // }
  function GETTransferOut(Data) {
    setLoading(true);
    try {
      axios.get(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/transfer/stocks/list?location_id=${Location_Id} `)
        .then((response) => {
          ;
          settransferoutarr(response.data.data.transfer_stocks_sent);
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
  let TransferOut = {
    receipt_no: '',
    date: '',
    location: '',
    item_name: '',
    qty: '',
    batch: '',
    expiry: '',
    taxable: '',
    tax_rate: '',
    total: ''
  }
  const Detailed_Data = async () => {
    settransferout();
    let Transferout = []
    for (let i = 0; i < transferoutarr.length; i++) {
      for (let j = 0; j < transferoutarr[i].medicines.length; j++) {
        TransferOut = {
          receipt_no: '',
          date: transferoutarr[i].transfer_date ? transferoutarr[i].transfer_date : '',
          location: transferoutarr[i].to_location.title != undefined ? transferoutarr[i].to_location.title : '',
          item_name: transferoutarr[i].medicines[j].medicine_stock_details.medicine.display_name ? transferoutarr[i].medicines[j].medicine_stock_details.medicine.display_name : "",
          qty: transferoutarr[i].medicines[j].qty,
          batch: transferoutarr[i].medicines[j].medicine_stock_details.batch_no ? transferoutarr[i].medicines[j].medicine_stock_details.batch_no : '',
          expiry: transferoutarr[i].medicines[j].medicine_stock_details.expiry_date ? transferoutarr[i].medicines[j].medicine_stock_details.expiry_date : '',
          taxable: transferoutarr[i].medicines[j].medicine_stock_details.rate ? transferoutarr[i].medicines[j].medicine_stock_details.rate : '',
          tax_rate: '',
          total: transferoutarr[i].total_amount
        }
        Transferout.push(TransferOut)
      }
    }
    settransferout(Transferout)
  }

  useEffect(() => {
    Detailed_Data()
  }, [transferoutarr]);

  useEffect(() => {
    GETTransferOut();
    Detailed_Data()
  }, [Location_Id]);
  return (
    <>
      <h2 className=" ms-3 text-charcoal fw-bolder mt-2" style={{ width: "fit-content" }}> {pagecount} {pagecount > 1 ? "Transfer Stocks Out" : "Transfer Stock Out"}{" "}  </h2>
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
        <div className="col-auto export">
          <DownloadTableExcel filename={`${reversefunction(fromdate) + ' to ' + reversefunction(todate)} Stock transfer In`} sheet="StockTransferIn" currentTableRef={TransferInref.current} >
            <button className='button button-seashell fw-bold'> Export</button>
          </DownloadTableExcel>
        </div>
      </div>
      <div className="scroll scroll-y p-0 m-0 mt-2" style={{ minHeight: "40vh", height: "58vh", maxHeight: "70vh" }} >
        <table className="table text-start table-responsive" ref={TransferInref}>
          <thead className=" p-0 m-0 position-sticky top-0 bg-pearl">
            <tr className=" ">
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Reciept Note No. </th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">Date</th>
              <th className="text-charcoal75 fw-bolder p-0 m-0 px-1">To Location </th>
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
            <tbody className="text-center" style={{ minHeight: "55vh", height: "55vh" }} >
              <tr className="position-absolute border-0 start-0 end-0 px-5">
                <div class="d-flex align-items-center spinner">
                  <strong className="" style={{ fontSize: "1rem" }}> Getting Details please be Patient ... </strong>
                  <div className="spinner-border ms-auto" role="status" aria-hidden="true" ></div>
                </div>
              </tr>
            </tbody>
          ) : transferoutarr && transferoutarr.length != 0 ? (
            <tbody>
              {transferout.map((item, i) => (
                <tr className={` bg-${i % 2 == 0 ? "seashell" : "pearl"} align-middle`} key={i} >
                  <td className="text-charcoal fw-bold">{item.receipt_no != undefined ? item.receipt_no : ''} </td>
                  <td className="text-charcoal fw-bold">{item.date != undefined ? reversefunction(item.date) : ''}</td>
                  <td className="text-charcoal fw-bold">{item.location != undefined ? item.location : ''} </td>
                  <td className="text-charcoal fw-bold">{item.item_name != undefined ? item.item_name : ''} </td>
                  <td className="text-charcoal fw-bold">{item.qty != undefined ? item.qty : ''}  </td>
                  <td className="text-charcoal fw-bold">{item.batch != undefined ? item.batch : ''}</td>
                  <td className="text-charcoal fw-bold">{item.expiry != undefined ? item.expiry : ''} </td>
                  <td className="text-charcoal fw-bold">{item.taxable != undefined ? item.taxable : ''} </td>
                  <td className="text-charcoal fw-bold">{item.tax_rate != undefined ? item.tax_rate : ''} </td>
                  <td className="text-charcoal fw-bold">{item.total != undefined ? item.total : ''} </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody className="text-center p-0 m-0" style={{ minHeight: "55vh", maxHeight: "55vh" }} >
              <div className="position-absolute border-0 start-0 end-0 mx-3 p-2">
                <strong className="text-charcoal fw-bolder text-center"> No Stocks Transfers Out </strong>
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
          onPageChange={GETTransferOut}
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

export { TransferOut }
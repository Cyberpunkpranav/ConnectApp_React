
import React, { useState, useEffect, useContext, useRef } from "react";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../index";
import axios from "axios";
import { lazy } from "react";
// const StockReport =  lazy(() => import("./components/App/Report"));
import { TransferIn } from '../Reports/pharmacy/TransferIn'
import { TransferOut } from '../Reports/pharmacy/TransferOut'
import { StockConfirmation } from '../Reports/pharmacy/stockconfirmation'
import { DoctorWiseSales } from '../Reports/pharmacy/doctorwisesales'
import { VendorDetails } from '../Reports/pharmacy/vendordetails'
import { BatchDetails } from '../Reports/pharmacy/batchdetails'
import { ScheduleWiseSales } from '../Reports/pharmacy/schedulewisesales'
import { PatientSalesHistory } from '../Reports/pharmacy/patientsaleshistory'
import { TaxWiseData } from '../Reports/pharmacy/taxwisedata'
import { GrossProfitMargin } from '../Reports/pharmacy/grossprofitmargin'
import { SummaryData } from '../Reports/pharmacy/summarydata'
import { RateList } from '../Reports/pharmacy/ratelist'
import { StockReport } from '../Reports/pharmacy/stockreport'
import { OpeningStock } from '../Reports/pharmacy/openingstock'
import { StockValuation } from '../Reports/pharmacy/stockvaluation'
import { StockReport_By_Name } from '../Reports/pharmacy/stockreport_by_name'
//css
import "../../css/bootstrap.css";
import "../../css/dashboard.css";
import "../../css/pharmacy.css";
// const StockReport = lazy(() => import("../Reports/stockreport"));
// const StockReport_By_Name = lazy(() => import("../Reports/stock_report_by_name"));

const Reports = () => {
  const permission = useContext(Permissions);
  const [select, setselect] = useState('')
  const [reportname,setreportname] =  useState('')
  const first = [
    {
      option: "Pharmacy",
      display: permission.sale_entry_view ? 1 : 0,
    },
    {
      option: "Clinic",
      display: permission.sale_return_view ? 1 : 0,
    },
  ];
  const [second, setSecond] = useState(0)
  const [secondname, setSecondname] = useState("Pharmacy")


  function selectfunc() {
    if( select == ''){
      return (
        <div className="container rounded-4 border border-1  mt-5" >
          <h1 className="row p-0 m-0 align-items-center text-center fw-bold justify-content-center text-charcoal75"style={{height:'50vh'}}>
               Select Report to show data   
            </h1> 
        </div>
      )
    }

    if (select == 1) {
      window.open('/Reports/stock_report_by_name','_blank')
      window.location.reload()
      // return <StockReport_By_Name />
    }
    if (select == 2) {
      window.open('/Reports/stock_valuation','_blank')
      window.location.reload()

      // return <StockValuation />
    }
    if (select == 3) {
      window.open('/Reports/opening_stock','_blank')
      window.location.reload()
      // return <OpeningStock />
    }
    if (select == 4) {
      return <RateList />
    }
    if (select == 5) {
      return <SummaryData />
    }
    if (select == 6) {
      return <TaxWiseData />
    }
    if (select == 7) {
      return <GrossProfitMargin />
    }
    if (select == 7) {
      return <GrossProfitMargin />
    }
    if (select == 8) {
      return <PatientSalesHistory />
    }
    if (select == 9) {
      return <ScheduleWiseSales />
    }
    if (select == 10) {
      return <VendorDetails />
    }
    if (select == 11) {
      return <BatchDetails />
    }
    if (select == 12) {
      return <StockConfirmation />
    }
    if (select == 13) {
      return <DoctorWiseSales />
    }
    if (select == 14) {
      return <TransferIn />
    }
    if (select == 15) {
      return <TransferOut />
    }
    if (select == 16) {
      window.open('/Reports/stock_report','_blank')
      window.location.reload()
      // return <StockReport />

    }
  }
  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return (
        <div class="dropdown">
        <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {reportname?reportname:"Select Report"}
        </button>
        <ul class="dropdown-menu bg-seashell shadow-sm border-0">
            <li className={`dropdown-item fw-bold text-charcoal`} onClick={(a) =>{ setselect(16);setreportname("Stock Report");}} >Stock Report<img src={process.env.PUBLIC_URL + '/images/new_tab.png'} className="img-fluid"/></li>
            <li className={`dropdown-item fw-bold text-charcoal`} onClick={(a) =>{setselect(1); setreportname("StockReport By ItemName ");}}>StockReport By ItemName<img src={process.env.PUBLIC_URL + '/images/new_tab.png'} className="img-fluid"/></li>
            <li className={`dropdown-item fw-bold text-charcoal`} onClick={(a) =>{setselect(2); setreportname("Stock Valuation");}}>Stock Valuation<img src={process.env.PUBLIC_URL + '/images/new_tab.png'} className="img-fluid"/></li>
            <li className={`dropdown-item fw-bold text-charcoal`} onClick={(a) =>{setselect(3); setreportname("Opening Stocks");}}>Opening Stocks <img src={process.env.PUBLIC_URL + '/images/new_tab.png'} className="img-fluid"/></li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(4); setreportname("Rate List");}}>Rate List</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(5); setreportname("Summary Wise Data (for All)");}}>Summary Wise Data (for All)</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(6); setreportname("Tax Rate Wise Data");}}>Tax Rate Wise Data</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(7); setreportname("Gross Profit Margin");}}>Gross Profit Margin</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(8); setreportname("Patient Sales History");}}>Patient Sales History</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(9); setreportname("Schedule Wise Sales");}}>Schedule Wise Sales</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(10); setreportname("Vendor Details");}}>Vendor Details</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(11); setreportname("Batch Details");}}>Batch Details</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(12); setreportname("Stock Value Confirmation");}}>Stock Value Confirmation</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(13); setreportname("Doctor Wise Sales");}}>Doctor Wise Sales</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(14); setreportname("Transfer Stocks In");}}>Transfer Stocks In</li>
            <li className={`dropdown-item fw-bold text-charcoal py-2`} onClick={(a) =>{setselect(15); setreportname("Transfer Stocks Out");}}>Transfer Stocks Out</li>
      </ul>
      </div>

      )

    }
    return <div className="fs-2">Nothing Selected</div>;
  };
  return (
    <>
      <section className="pharmacy_report_section pt-2">
        <div className="container-fluid p-0 m-0 mt-3">
          <div className="row gx-3 p-0 m-0">
            <div className="col-auto">
            <div class="dropdown">
                <button class="button button-seashell border-0 rounded-2 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {secondname?secondname:'Report Type '}
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                  {
                    first.map((e, i) => (
                      <li className={`dropdown-item text-${i === second ? "light" : "dark"} fw-bold bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => {setSecond(i);setSecondname(e.option)}} > {e.option} </li>
                    )
                    ) 
                  }
                </ul>
              </div>
            </div>
              <div className="col-auto">
              <div className="">{_selectedScreen(second)}</div>
              </div>
          </div>
        </div>
      </section>
      <div className="col-auto">
            <section className="tablesrender position-relative p-0 m-0">
        <div className="container-fluid p-0 m-0 ">
        <div>{selectfunc(select)}</div>
   
        </div>
      </section>
            </div>
      </>
  )
}

export default Reports
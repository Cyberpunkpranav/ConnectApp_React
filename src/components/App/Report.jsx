
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
  const [second, setSecond] = useState(0);
  function selectfunc() {
    if( select == ''){
      return (
        <div className="container rounded-4 border border-1  mt-5" >
          <h1 className="row p-0 m-0 align-items-center text-center fw-bold justify-content-center text-charcoal75"style={{height:'50vh'}}>
               select Report to show data   
            </h1> 
        </div>
      )
    }
    if (select == 0) {
      window.open('/Reports/stock_report','_blank')
      window.location.reload()
      // return <StockReport />

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
  }
  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return (
          <select className="button button-seashell text-charcoal text-center fw-bold rounded-2 border-0  bg-seashell " onChange={(e) => { setselect(e.target.value) }} style={{ cursor: 'pointer' }} >
          <option className="bg-seashell text-charcoal" value="" style={{ cursor: 'pointer' }} >Select report</option>
            <option className="bg-seashell text-charcoal" value="0" style={{ cursor: 'pointer' }} >Stock Report</option>
            <option className="bg-seashell text-charcoal" value="1" style={{ cursor: 'pointer' }} >StockReport By ItemName</option>
            <option className="bg-seashell text-charcoal" value="2" style={{ cursor: 'pointer' }} >Stock Valuation</option>
            <option className="bg-seashell text-charcoal" value="3" style={{ cursor: 'pointer' }} >Opening Stock</option>
            <option className="bg-seashell text-charcoal" value="4" style={{ cursor: 'pointer' }} >Rate List</option>
            <option className="bg-seashell text-charcoal" value="5" style={{ cursor: 'pointer' }} >Summary Wise Data (for All)</option>
            <option className="bg-seashell text-charcoal" value="6" style={{ cursor: 'pointer' }} >Tax Rate Wise Data</option>
            <option className="bg-seashell text-charcoal" value="7" style={{ cursor: 'pointer' }} >Gross Profit Margin</option>
            <option className="bg-seashell text-charcoal" value="8" style={{ cursor: 'pointer' }} >Patient Sales History</option>
            <option className="bg-seashell text-charcoal" value="9" style={{ cursor: 'pointer' }} >Schedule Wise Sales</option>
            <option className="bg-seashell text-charcoal" value="10" style={{ cursor: 'pointer' }} >Vendor Details</option>
            <option className="bg-seashell text-charcoal" value="11" style={{ cursor: 'pointer' }} >Batch Details</option>
            <option className="bg-seashell text-charcoal" value="12" style={{ cursor: 'pointer' }} >Stock Value Confirmation</option>
            <option className="bg-seashell text-charcoal" value="13" style={{ cursor: 'pointer' }} >Doctor Wise Sales</option>
            <option className="bg-seashell text-charcoal" value="14" style={{ cursor: 'pointer' }} >Transfer Stock In</option>
            <option className="bg-seashell text-charcoal" value="15" style={{ cursor: 'pointer' }} >Transfer Stock Out</option>
          </select>
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
                  Report Type 
                </button>

                <ul class="dropdown-menu bg-seashell shadow-sm border-0">
                  {
                    first.map((e, i) => (
                      <li className={`dropdown-item text-${i === second ? "light" : "dark"} fw-bold bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} > {e.option} </li>
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
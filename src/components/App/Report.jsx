
import React, { useState, useEffect, useContext, useRef } from "react";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../index";
import axios from "axios";
import { lazy } from "react";
// const StockReport =  lazy(() => import("./components/App/Report"));
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
  const [select, setselect] = useState('0')
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
    if (select == 0) {
      return <StockReport />

    }
    if (select == 1) {
      return <StockReport_By_Name />
    }
    if (select == 2) {
      return <StockValuation />
    }
    if (select == 3) {
      return <OpeningStock />
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
    if (select == 13) {
      return <DoctorWiseSales />
    }
  }
  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return (
        <>
          <select className="ms-2 mt-2 px-4 py-1 text-pearl rounded-pill bg-charcoal text-center " onChange={(e) => { setselect(e.target.value) }} >
            <option className="bg-seashell text-charcoal" value="0">Stock Report</option>
            <option className="bg-seashell text-charcoal" value="1">StockReport By ItemName</option>
            <option className="bg-seashell text-charcoal" value="2">Stock Valuation</option>
            <option className="bg-seashell text-charcoal" value="3">Opening Stock</option>
            <option className="bg-seashell text-charcoal" value="4">Rate List</option>
            <option className="bg-seashell text-charcoal" value="5">Summary Wise Data (for All)</option>
            <option className="bg-seashell text-charcoal" value="6">Tax Rate Wise Data</option>
            <option className="bg-seashell text-charcoal" value="7">Gross Profit Margin</option>
            <option className="bg-seashell text-charcoal" value="8">Patient Sales History</option>
            <option className="bg-seashell text-charcoal" value="9">Schedule Wise Sales</option>
            <option className="bg-seashell text-charcoal" value="10">Vendor Details</option>
            <option className="bg-seashell text-charcoal" value="11">Batch Details</option>
            <option className="bg-seashell text-charcoal" value="13">Doctor Wise Sales</option>
          </select>
          <div>{selectfunc(select)}</div>
        </>
      )

    }

    return <div className="fs-2">Nothing Selected</div>;
  };
  return (
    <>
      <section className="pharmacy_report_section pt-2">
        <div className="container-fluid p-0 m-0">
          <div className="row gx-3 p-0 m-0">
            <div className="col-10">
              <div className="row">
                {first.map((e, i) => {
                  return (
                    <div className={`col-auto d-${e.display == 1 ? "" : "none"}`} >
                      <button className={`btn btn-sm rounded-pill text-${i === second ? "light" : "dark"} bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} >
                        {e.option}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className="container-fluid p-0 m-0 pt-3">
          <div className="">{_selectedScreen(second)}</div>
        </div>
      </section></>
  )
}

export default Reports
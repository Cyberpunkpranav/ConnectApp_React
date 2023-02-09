import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { URL, TodayDate, Clinic } from '../../index';
import { ExportPurchaseEntry, ExportSaleEntry } from '../pharmacy/Exports'
import Notiflix from 'notiflix';
import { customconfirm } from '../features/notiflix/customconfirm';
import '../../css/bootstrap.css';
import '../../css/pharmacy.css';
import '../../css/dashboard.css'
import { Purchaseorderarray, Pharmacystocktable, Stockvaccinearray, Stockmedicinearray, POitemdetailsarray, PEitemdetailsarray } from './apiarrays';

//-------------------------------------------------Sales------------------------------------------------------------------------------------------
function Salesection(props) {
  const first = ["Sale Orders", "Sale Entry", "Sale Returns"];
  const [second, setSecond] = useState(0);

  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return <Saleordersection />
    }
    if (_selected === 1) {
      return <Saleentrysection function={props.func} function2={props.function} />
    }
    if (_selected === 2) {
      return <div className="">{_selected}</div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>

      <section className='purchasesection pt-3'>
        <div className="container-fluid">
          <div className="row g-3">
            <div className="col-10">
              <div className='row'>
                {
                  first.map((e, i) => {
                    return (
                      <div className="col-auto">
                        <button className={`btn btn-sm px-4 rounded-5 text-${i === second ? "light" : "dark"} bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} >{e}</button>
                      </div>
                    )
                  }
                  )
                }
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid pt-5'>
          <div className="scroll scroll-y">
            {_selectedScreen(second)}
          </div>
        </div>
      </section>
    </>
  )
}
function Saleentrysection(props) {
  const currentDate = useContext(TodayDate)
  const ClinicID = localStorage.getItem('ClinicId')
  const url = useContext(URL)
  const [peidw, setpeidw] = useState("none");
  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  };
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [saleentryarr, setsaleentryarr] = useState([])
  const [index, setindex] = useState()

  function GETSalesList() {
    setLoading(true)
    try {
      axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=5&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        console.log(response)
        setsaleentryarr(response.data.data)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    GETSalesList()
  }, [channel, fromdate, todate])
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }

  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={props.function}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Sale</button>
      <div className="row p-0 m-0">
        <div className="col-3 col-md-2 col-lg-2 align-self-center text-charcoal fw-bolder fs-6">
          Purchase Entry
        </div>
        <div className="col-6 col-xl-6 col-lg-7 col-md-auto align-self-center m-1 ">
          <div className="row border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
            <div className="col-4">
              <select className='p-0 m-0 border-0 text-burntumber fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={fromdate ? fromdate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={todate ? todate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 align-self-center">
          <ExportSaleEntry saleentryarr={saleentryarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div className='scroll scroll-y' style={{ maxHeight: '55vh' }}>
        <table className="table  text-center table-responsive table-bordered p-0 m-0">
          <thead>
            <tr>
              <th scope='col'>Bill Date</th>
              <th scope='col'>Invoice No.</th>
              <th scope='col'>Patient Name</th>
              <th scope='col'>Invoice No.</th>
              <th scope='col'>Bill Date</th>
              <th scope='col'>Bill Total</th>
              <th scope='col'>Vendor</th>
              <th scope='col'>Actions</th>
              <th scope='col'>more</th>
            </tr>
          </thead>
          {
            Loading ? (
              <body className=' text-center'>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center">
                    <strong className='fs-5'>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>

              </body>

            ) : (
              saleentryarr && saleentryarr.length != 0 ? (
                <tbody>
                  {
                    saleentryarr.map((item, i) => (
                      <tr key={i}>
                        <td>{item.bill_date && item.bill_date !== null ? reversefunction(item.bill_date) : ''}</td>
                        <td>{item.purchase_order_id && item.purchase_order_id !== null ? item.purchase_order_id : 'N/A'}</td>
                        <td>{item.patient && item.patient && item.patient.id != null && item.patient.full_name != null ? item.patient.id + "." + item.patient.full_name : ''}</td>
                        <td>{item.invoice_no ? item.invoice_no : 'N/A'}</td>
                        <td>{item.bill_date && item.bill_date ? reversefunction(item.bill_date) : 'N/A'}</td>
                        <td>{item.bill_total && item.bill_total ? "Rs. " + item.bill_total : 'N/A'}</td>
                        <td>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                        <td><button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button><buttton className="btn" onClick={() => { setindex(i); toggle_peidw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                        <td><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? peidw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                          {
                            i == index ? (
                              <SEitemdetailssection saleentryarr={saleentryarr[i]} itembillid={"PE-" + item.bill_id} toggle_peidw={toggle_peidw} />
                            ) : (<></>)
                          }
                        </td>

                      </tr>

                    ))

                  }

                </tbody>
              ) : (
                <body className='text-center p-0 m-0 border border-1 '>
                  <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
                    <strong className='fs-5 text-center bg-lightred'>No Purchase Entries</strong>
                  </div>

                </body>
              )
            )
          }

        </table>
      </div>
    </>
  )
}
function SEitemdetailssection(props) {
  console.log(props.purchaseentryarr)
  const [medicine, setmedicine] = useState('block')
  const [vaccine, setvaccine] = useState('none')
  const [index, setindex] = useState(0)
  const Items = ['Medicine', 'Vaccine']


  if (index == 0) {
    if (medicine == 'none') {
      setmedicine('block')
      setvaccine('none')
    }
  }
  if (index == 1) {
    if (vaccine == 'none') {
      setvaccine('block')
      setmedicine('none')
    }
  }
  const [Taxon, setTaxon] = useState(false)

  function TotalTaxPercent(cgst, sgst, igst) {
    if (cgst && sgst && igst !== null || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst)
    }
  }
  function TotalTaxRate(cgst, sgst, igst) {
    if (cgst && sgst && igst !== null || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst)
    }
  }
  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <div className="row p-0 m-0">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_peidw} aria-label="Close"></button>
          </div>
          <div className="col-9">
            <h4 className='text-center' style={{ color: 'var(--charcoal)', fontWeight: '600' }}>{props.itembillid} Purchase Entry Item Details</h4>
          </div>
          <div className="col-2">
            <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
              <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
              <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className='row p-0 m-0 mb-3'>
        {
          Items.map((data, i) => (
            <div className="col-3 col-xl-2 col-lg-2 col-md-4 col-sm-6 p-0 m-0">
              <button className={`button border button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>
            </div>
          ))
        }

      </div>


      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <div className="row">
          <div className="col-9"><h5 className='ps-1'>Medicine</h5></div>
          <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
        </div>

        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
          </tr>
        </thead>
          {
            props.saleentryarr.medicines && props.saleentryarr.medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.saleentryarr.medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? item.expiry_date : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? item.SGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? item.CGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? item.IGST : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
                  <strong className='fs-5 text-center bg-lightred'>No Medicines Found</strong>
                </div>

              </body>
            )


          }
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <div className="row">
          <div className="col-9"><h5 className='ps-1'>Vaccine</h5></div>
          <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
        </div>
        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className={`border p-0 m-0 px-1`}>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
          </tr>
        </thead>
          {
            props.saleentryarr.vaccines && props.saleentryarr.vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchaseentryarr.vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? item.expiry_date : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? item.SGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? item.CGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? item.IGST : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
                  <strong className='fs-5 text-center bg-lightred'>No Vaccines Found</strong>
                </div>

              </body>
            )


          }
        </table>
      </div>
    </div>

  )
}
function Saleordersection() {
  let cartselect = ["Pharmacy", "Clinic"];
  const [cartselectindex, setcartselectindex] = useState(0);
  const [displayviewcart, setdisplayviewcart] = useState("none");
  const [displayitemdetails, setdisplayitemdetails] = useState("none");
  const _displayviewcart = () => {
    if (displayviewcart === "none") {
      setdisplayviewcart("block");
    }
    if (displayviewcart === "block") {
      setdisplayviewcart("none");
    }
  }
  const _displayitemdetails = () => {
    if (displayitemdetails === "none") {
      setdisplayitemdetails("block");
    }
    if (displayitemdetails === "block") {
      setdisplayitemdetails("none");
    }
  }
  const _selectedcart = (cardindex) => {
    if (cardindex === 0) {
      return <table className="table datatable text-center"><thead>
        <tr>
          <th>No.</th>
          <th>Item Name</th>
          <th>Total Qty</th>
          <th>Amount</th>
          <th>Last Vendor</th>
          <th>Add</th>
          <th>Delete</th>
        </tr>
      </thead>
        <tbody>
          {<Pharmacystocktable />}
        </tbody>
      </table>
    }
    if (cardindex === 1) {
      return <div className="">{cardindex}</div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>
      <button className="button viewcart button-charcoal position-absolute" onClick={_displayviewcart}><img src={process.env.PUBLIC_URL + "/images/cartwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />View Cart</button>
      <div className={`container-fluid pt-2  p-0 m-0 cartform d-${displayviewcart} w-50 border1 rounded bg-seashell position-absolute text-center`} >
        <div className="container-fluid  w-100 shadow-sm">
          <h5 className="text-dark fw-bold">Items in Cart</h5>
        </div>
        <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={_displayviewcart}></button>
        <div className="pt-1">
          <div className="row g-0 justify-content-center">
            {
              cartselect.map((e, i) => {
                return (
                  <button className={`col-2 p-0 m-0 button text-${i === cartselectindex ? "light" : "dark"} bg-${i === cartselectindex ? "charcoal" : "seashell"} rounded-0`} onClick={(a) => setcartselectindex(i)}>{e}</button>
                )
              })
            }
          </div>
        </div>
        <div className="scroll scroll-y">
          {_selectedcart(cartselectindex)}
        </div>
        <div className="bg-pearl rounded">
          <div className="row p-3 justify-content-between">
            <div className="col-3">
              <select className="form-control bg-pearl" style={{ color: 'gray' }}>
                <option selected disabled defaultValue='Select Vendor' className="Selectvendor" style={{ color: 'gray' }}>Select Vendor</option>
              </select>
            </div>
            <div className="col-3">
              <button className="button button-charcoal">Create New PO</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`container-fluid pt-2  p-0 m-0 itemdetailsform d-${displayitemdetails} w-50 border1 rounded bg-seashell position-absolute text-center`} >
        <div className="container-fluid  w-100 shadow-sm">
          <h5 className="text-dark fw-bold">PO-14 Item Details</h5>
        </div>
        <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={_displayitemdetails}></button>
        <div className="scroll scroll-y">
          {<POitemdetailsarray />}
        </div>
        <button type="button" className="btn btn-lg text-center button-charcoal m-2" onClick={_displayitemdetails}>Done</button>
      </div>
      <h3 className='ps-3'>Purchase Order List</h3>
      <table className="table datatable text-center">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Channel</th>
            <th>Vendor</th>
            <th>PO Date</th>
            <th>Created By</th>
            <th>Total Items</th>
            <th>Amount</th>
            <th>Approval Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {<Purchaseorderarray itemdetails={_displayitemdetails} />}
        </tbody>
      </table>
    </>
  )
}
function SOitemdetailssection() {
  return (
    <table className="table datatable text-center"><thead>
      <tr>
        <th>No.</th>
        <th>Item Name</th>
        <th>Total Qty</th>
        <th>Amount</th>
        <th>Last Vendor</th>
        <th>Add</th>
        <th>Delete</th>
      </tr>
    </thead>
      <tbody>
        {<POitemdetailsarray />}
      </tbody>
    </table>
  )
}
export { Salesection }

// ---------------------------------------------------------------purchase------------------------------------------------------------------
function Purchasesection(props) {
  const first = ["Purchase Orders", "Purchase Entry", "Purchase Returns"];
  const [second, setSecond] = useState(2);

  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return <Purchaseordersection />
    }
    if (_selected === 1) {
      return <Purchaseentrysection function={props.func} function2={props.function} />
    }
    if (_selected === 2) {
      return <PurchaseReturns/>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>

      <section className='purchasesection pt-3'>
        <div className="container-fluid">
          <div className="row g-3">
            <div className="col-10">
              <div className='row'>
                {
                  first.map((e, i) => {
                    return (
                      <div className="col-auto">
                        <button className={`btn btn-sm px-4 rounded-5 text-${i === second ? "light" : "dark"} bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} >{e}</button>
                      </div>
                    )
                  }
                  )
                }
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid pt-4 p-0 m-0'>
          <div className="scroll scroll-y">
            {_selectedScreen(second)}
          </div>
        </div>
      </section>
    </>
  )
}
function Purchaseentrysection(props) {
  const currentDate = useContext(TodayDate)
  const ClinicID = localStorage.getItem('ClinicId')
  const url = useContext(URL)
  const [peidw, setpeidw] = useState("none");
  const nextref = useRef()
  const previousref = useRef()
  const toggle_peidw = () => {
    if (peidw === "none") {
      setpeidw("block");
    }
    if (peidw === "block") {
      setpeidw("none");
    }
  };
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [purchaseentryarr, setpurchaseentryarr] = useState([])
  const [index, setindex] = useState()
  const [npef, setnpef] = useState("none");
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [tabindex, settabindex] = useState()

  function GETPurchaseList(i) {
    if (i == undefined) {
      i = 0
    }
    setLoading(true)
    if (i == 0 || i == undefined || nxtoffset == 0) {
      previousref.current.disabled = true
    } else {
      previousref.current.disabled = false
    }
    try {
      axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${i*25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpurchaseentryarr(response.data.data)
        let nxt = Number(i) + 1

        setnxtoffset(nxt)
        if (i != 0) {
          let prev = i--
          setprevoffset(prev)
        }
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    GETPurchaseList()
  }, [channel, fromdate, todate])
  const toggle_npef = () => {
    if (npef === "none") {
      setnpef("block");

    }
    if (npef === "block") {
      setnpef("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  async function getnextpages(e) {
    GETPurchaseList(e.target.value)
  }
  async function getpreviouspages(e) {
    GETPurchaseList(e.target.value - 1)
  }
  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={toggle_npef}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Purchase</button>
      <div className="row p-0 m-0">
        <div className="col-3 col-md-2 col-lg-2 align-self-center text-charcoal fw-bolder fs-6">Purchase Entry</div>
        <div className="col-6 col-xl-6 col-lg-7 col-md-auto align-self-center m-1 ">
          <div className="row border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
            <div className="col-4">
              <select className='p-0 m-0 border-0 text-burntumber fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={fromdate ? fromdate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={todate ? todate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 align-self-center">
          <ExportPurchaseEntry purchaseentryarr={purchaseentryarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div>
      <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{minHeight:'55vh',height:'55vh'}}>
        <table className="table text-center p-0 m-0">
          <thead className='p-0 m-0 align-middle'>
            <tr>
              <th className='fw-bolder text-charcoal75' scope='col'>PE ID</th>
              <th className='fw-bolder text-charcoal75' scope='col'>PO ID</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Channel</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Invoice No.</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Bill Date</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Bill Total</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Vendor</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Actions</th>
              <th className='fw-bolder text-charcoal75' scope='col'>more</th>
            </tr>
          </thead>
          {
            Loading ? (
              <body className=' text-center' style={{minHeight:'55vh'}}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center">
                    <strong className='fs-5'>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>

              </body>

            ) : (
              purchaseentryarr && purchaseentryarr.length != 0 ? (
                <tbody>
                  {
                    purchaseentryarr.map((item, i) => (
                      <tr key={i} className={`bg-${((i % 2) == 0)?'seashell':'pearl'} align-middle`}>
                        <td className='p-0 m-0 text-charcoal fw-bold'>PE-{item.bill_id}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.purchase_order_id && item.purchase_order_id !== null ? item.purchase_order_id : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.invoice_no ? item.invoice_no : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.bill_date && item.bill_date ? reversefunction(item.bill_date) : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.bill_total && item.bill_total ? "Rs. " + item.bill_total : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button><buttton className="btn" onClick={() => { setindex(i); toggle_peidw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                        <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? peidw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                          {
                            i == index ? (
                              <PEitemdetailssection purchaseentryarr={purchaseentryarr[i]} itembillid={"PE-" + item.bill_id} toggle_peidw={toggle_peidw} />
                            ) : (<></>)
                          }
                        </td>

                      </tr>

                    ))

                  }

                </tbody>
              ) : (
                <tbody className='text-center position-relative p-0 m-0 ' style={{minHeight:'55vh'}}>
                  <tr className=''>
                    <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Purchase Entries</td>
                  </tr>

                </tbody>
              )
            )
          }

        </table>
        </div>
      <div className="container-fluid mb-1">
        <div className="row p-0 m-0 text-center">
          <div className="col-3 col-xl-4">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-auto col-xl-auto">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); GETPurchaseList(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-3 col-xl-4">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
      </div>
      <section className={`newpurchaseentrysection position-absolute start-0 end-0 top-0 bottom-0 d-${npef}`}  >
        {<Newpurchaseentryform toggle_npef={toggle_npef} GETPurchaseList={GETPurchaseList} />}
      </section>
    </>
  )
}
function PEitemdetailssection(props) {
  console.log(props.purchaseentryarr)
  const [medicine, setmedicine] = useState('block')
  const [vaccine, setvaccine] = useState('none')
  const [index, setindex] = useState(0)
  const Items = ['Medicine', 'Vaccine']


  if (index == 0) {
    if (medicine == 'none') {
      setmedicine('block')
      setvaccine('none')
    }
  }
  if (index == 1) {
    if (vaccine == 'none') {
      setvaccine('block')
      setmedicine('none')
    }
  }
  const [Taxon, setTaxon] = useState(false)

  function TotalTaxPercent(cgst, sgst, igst) {
    if (cgst && sgst && igst !== null || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst)
    }
  }
  function TotalTaxRate(cgst, sgst, igst) {
    if (cgst && sgst && igst !== null || undefined) {
      return Number(cgst) + Number(sgst) + Number(igst)
    }
  }
  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <div className="row p-0 m-0">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_peidw} aria-label="Close"></button>
          </div>
          <div className="col-9">
            <h4 className='text-center' style={{ color: 'var(--charcoal)', fontWeight: '600' }}>{props.itembillid} Purchase Entry Item Details</h4>
          </div>
          <div className="col-2">
            <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
              <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
              <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className='row p-0 m-0 mb-3'>
        {
          Items.map((data, i) => (
            <div className="col-3 col-xl-2 col-lg-2 col-md-4 col-sm-6 p-0 m-0">
              <button className={`button border button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>
            </div>
          ))
        }

      </div>


      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <div className="row">
          <div className="col-9"><h5 className='ps-1'>Medicine</h5></div>
          <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
        </div>

        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
          </tr>
        </thead>
          {
            props.purchaseentryarr.medicines && props.purchaseentryarr.medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchaseentryarr.medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? item.expiry_date : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? item.SGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? item.CGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? item.IGST : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
                  <strong className='fs-5 text-center bg-lightred'>No Medicines Found</strong>
                </div>

              </body>
            )


          }
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <div className="row">
          <div className="col-9"><h5 className='ps-1'>Vaccine</h5></div>
          <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
        </div>
        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className={`border p-0 m-0 px-1`}>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
          </tr>
        </thead>
          {
            props.purchaseentryarr.vaccines && props.purchaseentryarr.vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchaseentryarr.vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? item.expiry_date : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? item.SGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? item.CGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? item.IGST : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
                  <strong className='fs-5 text-center bg-lightred'>No Vaccines Found</strong>
                </div>

              </body>
            )


          }
        </table>
      </div>
    </div>

  )
}
function Newpurchaseentryform(props) {
  const url = useContext(URL)
  const ClinicId = localStorage.getItem('ClinicId')
  const ClinicList = useContext(Clinic)
  const medicinesref = useRef(null)
  const vendorsref = useRef(null)
  const [channel, setchannel] = useState()
  const [po, setpo] = useState()
  const [invoice, setinvoice] = useState()
  const [invoicedate, setinvoicedate] = useState()
  const [vendorname, setvendorname] = useState()
  const [vendorid, setvendorid] = useState()
  const [loadvendors, setloadvendors] = useState()
  const [vendorcode, setvendorcode] = useState()
  const [vendorsearch, setvendorsearch] = useState([''])
  const [itemsearch, setitemsearch] = useState([''])
  const [itemname, setitemname] = useState()
  const [itemid, setitemid] = useState()
  const [itemtype, setitemtype] = useState()
  const [batchno, setbatchno] = useState()
  const [expdate, setexpdate] = useState()
  const [manufdate, setmanufdate] = useState()
  const [mrp, setmrp] = useState()
  const [rate, setrate] = useState()
  const [qty, setqty] = useState()
  const [freeqty, setfreeqty] = useState()
  const [disc, setdisc] = useState(0)
  const [trddisc, settrddisc] = useState(0)
  const [cgst, setcgst] = useState(0)
  const [cgstprcnt, setcgstprcnt] = useState(0)
  const [sgst, setsgst] = useState(0)
  const [sgstprcnt, setsgstprcnt] = useState(0)
  const [igst, setigst] = useState(0)
  const [igstprcnt, setigstprcnt] = useState(0)
  const [cpu, setcpu] = useState(0)
  const [totalamt, settotalamt] = useState()
  const [loadsearch, setloadsearch] = useState()
  const [MedicineentriesArr, setMedicineentriesArr] = useState()
  const [tableindex, settableindex] = useState()
  const [clinicstatecode, setclinicstatecode] = useState()

  async function filterclinic() {
    for (let i = 0; i < ClinicList.length; i++) {
      if (ClinicList[i].id == ClinicId) {
        setclinicstatecode(ClinicList[i].state_code)
      }
    }
  }
  let MedicineentriesObj = {
    type: '',
    Itemid: '',
    Itemname: '',
    batchno: '',
    expirydate: '',
    manufacturingDate: '',
    quantity: '',
    freeQty: '',
    MRP: '',
    Rate: '',
    Discount: '',
    tradeDiscount: '',
    sgst: '',
    sgstpercent: '',
    cgst: '',
    cgstper: '',
    igst: '',
    igstper: '',
    costperunit: '',
    totalamount: ''
  }
  async function InsertMedicines() {
    MedicineentriesObj = {
      type: itemtype,
      Itemid: itemid,
      Itemname: itemname,
      batchno: batchno,
      expirydate: expdate,
      manufacturingDate: manufdate,
      MRP: mrp,
      Rate: rate,
      Qty: qty,
      freeQty: freeqty,
      Discount: disc,
      tradeDiscount: trddisc,
      sgstper: sgstprcnt,
      sgst: sgst,
      cgstper: cgstprcnt,
      cgst: cgst,
      igstper: igstprcnt,
      igst: igst,
      costperunit: cpu,
      totalamount: totalamt
    }
    if (qty) {
      if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
        setMedicineentriesArr([MedicineentriesObj])
      } else {
        setMedicineentriesArr(prevState => [...prevState, MedicineentriesObj])
      }
    } else {
      Notiflix.Notify.warning("please choose quantity")
    }

    resetfields()
  }
  const searchmeds = async (search) => {
    setloadsearch(true)
    try {
      await axios.get(`${url}/item/search?search=${search}`).then((response) => {
        let medicines = []
        let vaccines = []
        let items = []
        medicines.push(response.data.data.medicines ? response.data.data.medicines : [])
        vaccines.push(response.data.data.vaccines ? response.data.data.vaccines : [])
        items = medicines.concat(vaccines)
        items = items.flat()
        console.log(items)
        setitemsearch(items)
        setloadsearch(false)
        if (search.length > 1) {
          medicinesref.current.style.display = 'block';
        } else {
          medicinesref.current.style.display = 'none';
        }

      })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message)
    }

  }
  const searchvendors = async (search) => {
    setloadvendors(true)
    try {
      await axios.get(`${url}/kyc/list?limit=10&offset=0&search=${search}`).then((response) => {
        setvendorsearch(response.data.data)
        setloadvendors(false)
        if (search.length > 1) {
          vendorsref.current.style.display = 'block';
        } else {
          vendorsref.current.style.display = 'none';
        }
      }).catch(
        function error(e) {
          Notiflix.Notify.warning(e.data.message)
          setloadvendors(false)
        }
      )
    } catch (e) {
      setloadvendors(false)
      Notiflix.Notify.warning(e.data.message)
    }
  }
  const SavePurchase = async () => {
    let MedId = []
    let medname = []
    let Type = []
    let batches = []
    let expirydate = []
    let manufacturingDate = []
    let MRP = []
    let Rate = []
    let Discount = []
    let tradeDiscount = []
    let sgst = []
    let sgstpercent = []
    let cgst = []
    let cgstpercent = []
    let igst = []
    let igstpercent = []
    let costperunit = []
    let totalamount = []
    let quantity = []
    let freequantity = []
    let grosstotal = 0
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      Type.push(MedicineentriesArr[i].type ? MedicineentriesArr[i].type : '')
      MedId.push(MedicineentriesArr[i].Itemid ? MedicineentriesArr[i].Itemid : '')
      medname.push(MedicineentriesArr[i].Itemname ? MedicineentriesArr[i].Itemname : '')
      batches.push(MedicineentriesArr[i].batchno ? MedicineentriesArr[i].batchno : '')
      expirydate.push(MedicineentriesArr[i].expirydate ? MedicineentriesArr[i].expirydate : '')
      manufacturingDate.push(MedicineentriesArr[i].manufacturingDate ? MedicineentriesArr[i].manufacturingDate : '')
      MRP.push(MedicineentriesArr[i].MRP ? MedicineentriesArr[i].MRP : '')
      Rate.push(MedicineentriesArr[i].Rate ? MedicineentriesArr[i].Rate : '')
      Discount.push(MedicineentriesArr[i].Discount ? MedicineentriesArr[i].Discount : 0)
      tradeDiscount.push(MedicineentriesArr[i].tradeDiscount ? MedicineentriesArr[i].tradeDiscount : 0)
      sgst.push(MedicineentriesArr[i].sgst ? MedicineentriesArr[i].sgst : '')
      sgstpercent.push(MedicineentriesArr[i].sgstper ? Number(MedicineentriesArr[i].sgstper) : 0)
      cgst.push(MedicineentriesArr[i].cgst ? MedicineentriesArr[i].cgst : '')
      cgstpercent.push(MedicineentriesArr[i].cgstper ? Number(MedicineentriesArr[i].cgstper) : 0)
      igst.push(MedicineentriesArr[i].igst ? MedicineentriesArr[i].igst : '')
      igstpercent.push(MedicineentriesArr[i].igstper ? Number(MedicineentriesArr[i].igstper) : 0)
      costperunit.push(MedicineentriesArr[i].costperunit ? MedicineentriesArr[i].costperunit : '')
      totalamount.push(MedicineentriesArr[i].totalamount ? MedicineentriesArr[i].totalamount : '')
      quantity.push(MedicineentriesArr[i].quantity ? MedicineentriesArr[i].quantity : '')
      freequantity.push(MedicineentriesArr[i].freeQty ? MedicineentriesArr[i].freeQty : '')
    }
  
    totalamount.forEach(item=>{
      grosstotal+=Number(item)
    })
    console.log(grosstotal,Type, MedId, medname, batches, expirydate, manufacturingDate, MRP, Rate, Discount, tradeDiscount, sgst, sgstpercent, cgst, cgstpercent, igst, igstpercent, costperunit, totalamount, quantity, freequantity)
    var Data = {
      distributor_id: vendorid,
      purchase_order_id: po,
      invoice_no: invoice,
      bill_date: invoicedate,
      clinic_id: ClinicId,
      channel: channel,
      bill_total: grosstotal,
      id: MedId,
      type: Type,
      qty: quantity,
      free_qty: freequantity,
      mrp: MRP,
      rate: Rate,
      trade_discount: tradeDiscount,
      discount: Discount,
      SGST_rate: sgstpercent,
      SGST: sgst,
      CGST_rate: cgstpercent,
      CGST: cgst,
      IGST_rate: igstpercent,
      IGST: igst,
      cost: costperunit,
      total_amount: totalamount,
      expiry_date: expirydate,
      mfd_date: manufacturingDate,
      batch_no: batches,
    }

    try {
      await axios.post(`${url}/purchase/entry/save`, Data).then((response) => {
        Notiflix.Notify.success(response.data.message)
        props.GETPurchaseList()
        setMedicineentriesArr()
        setchannel()
        setpo()
        setinvoice()
        setinvoicedate()
        setvendorname()
        setvendorid()
        props.toggle_npef()
      })
    } catch (e) {
      Notiflix.Notify.warning(e)
      console.log(e)
    }

  }
  const resetfields = async () => {
    setitemname()
    setitemid()
    setbatchno()
    setexpdate()
    setmanufdate()
    setmrp()
    setrate()
    setqty()
    setfreeqty()
    setdisc()
    settrddisc()
    setcgst()
    setsgst()
    setigst()
    setcgstprcnt()
    setsgstprcnt()
    setigstprcnt()
    setcpu()
    settotalamt()
    setloadsearch()
  }
  function confirmmessage(entries, vendor) {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Purchase Entry`,
      `Do you surely want to add total ${entries.length} purchase ${entries.length <= 1 ? 'entry' : 'entries'} of Distributor ${vendor}  `,
      'Yes',
      'No',
      () => {
        SavePurchase()
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  function indexing(i) {
    console.log(i)
    if (tableindex == i) {
      settableindex(-1)
      Emptytableindex()
    } else {
      settableindex(i)
      EditTableEntry(i)
    }
  }
  function EditTableEntry(index) {
    setitemid(MedicineentriesArr[index].Itemid)
    setitemname(MedicineentriesArr[index].Itemname)
    setbatchno(MedicineentriesArr[index].batchno)
    setexpdate(MedicineentriesArr[index].expirydate)
    setmanufdate(MedicineentriesArr[index].manufacturingDate)
    setmrp(MedicineentriesArr[index].MRP)
    setrate(MedicineentriesArr[index].Rate)
    setqty(MedicineentriesArr[index].Qty)
    setfreeqty(MedicineentriesArr[index].freeQty)
    setdisc(MedicineentriesArr[index].Discount)
    settrddisc(MedicineentriesArr[index].tradeDiscount)
    setcgst(MedicineentriesArr[index].cgst)
    setcgstprcnt(MedicineentriesArr[index].cgstper)
    setsgst(MedicineentriesArr[index].sgst)
    setsgstprcnt(MedicineentriesArr[index].sgstper)
    setigst(MedicineentriesArr[index].igst)
    setigstprcnt(MedicineentriesArr[index].igstper)
    setcpu(MedicineentriesArr[index].costperunit)
    settotalamt(MedicineentriesArr[index].totalamount)
  }
  function Emptytableindex() {

    setitemid()
    setitemname()
    setbatchno()
    setexpdate()
    setmanufdate()
    setmrp()
    setrate()
    setqty()
    setfreeqty()
    setdisc()
    settrddisc()
    setcgst()
    setcgstprcnt()
    setsgst()
    setsgstprcnt()
    setigst()
    setigstprcnt()
    setcpu()
    settotalamt()

  }
  async function UpdateMedicines() {
    for (let j = 0; j < MedicineentriesArr.length; j++) {
      if (tableindex == j) {
        MedicineentriesArr[j] = {
          type: itemtype,
          Itemid: itemid,
          Itemname: itemname,
          batchno: batchno,
          expirydate: expdate,
          manufacturingDate: manufdate,
          MRP: mrp,
          Rate: rate,
          Qty: qty,
          freeQty: freeqty,
          Discount: disc,
          tradeDiscount: trddisc,
          sgstper: sgstprcnt,
          sgst: sgst,
          cgstper: cgstprcnt,
          cgst: cgst,
          igstper: igstprcnt,
          igst: igst,
          costperunit: cpu,
          totalamount: totalamt
        }
        Notiflix.Notify.success(`Item Number ${tableindex + 1} Updated Successfully`)
        Emptytableindex()
        settableindex(-1)
      }
    }
  }
  async function DeleteMedicine(id) {
    let obj = []
    obj.push(MedicineentriesArr.filter(function (e) {
      return e.Itemid !== id
    }))
    obj = obj.flat()
    setMedicineentriesArr(obj)
  }
  let total = 0;
  function Calculate() {
    total = qty ? rate * qty : rate
    // total = freeqty ? total - (rate * freeqty) : total
    total = disc ? total - (total * disc) / 100 : total
    total = trddisc ? total - (total * trddisc) / 100 : total
    total = sgstprcnt ? Number(total) + Number((((total * sgstprcnt) / 100) + ((total * sgstprcnt) / 100))) : total
    total = igstprcnt ? Number(total) + Number((total * Number(igstprcnt) / 100)) : total
    total = total ? Math.round(parseFloat(total).toFixed(2)) : total
    return total
  }
  let CostPerUnit = 0
  function CalculateCPU() {
    let newqty = Number(qty) + Number(freeqty)
    CostPerUnit = Number(parseFloat(Calculate() / newqty))
    // console.log(Calculate(), CostPerUnit, qty, freeqty)
    CostPerUnit = parseFloat(CostPerUnit).toFixed(2)
    return CostPerUnit
  }
  let GsT = 0
  function CalculateGst() {
    total = qty ? rate * qty : rate
    total = disc ? total - (total * disc) / 100 : total
    total = trddisc ? total - (total * trddisc) / 100 : total
    GsT = sgstprcnt ? Number((((rate * sgstprcnt) / 100) + ((rate * sgstprcnt) / 100)) / 2) : GsT
    GsT = parseFloat(GsT).toFixed(2)
    return GsT
  }
  let IgsT = 0
  function CalculateIGst() {
    total = qty ? rate * qty : rate
    total = disc ? total - (total * disc) / 100 : total
    total = trddisc ? total - (total * trddisc) / 100 : total
    IgsT = igstprcnt ? Number((rate * igstprcnt) / 100) : IgsT
    IgsT = parseFloat(IgsT).toFixed(2)
    return IgsT
  }

  useEffect(() => {
    CalculateGst()
    setsgst(CalculateGst())
    setcgst(CalculateGst())
  }, [sgstprcnt])

  useEffect(() => {
    CalculateIGst()
    setigst(CalculateIGst())
  }, [igstprcnt])
  useEffect(() => {
    settotalamt(Calculate())
  }, [Calculate()])

  useEffect(() => {
    setcpu(CalculateCPU())
  }, [CalculateCPU(), Calculate()])

  // console.log(totalamt,cpu)
  // console.log(sgst,cgst)
  console.log(MedicineentriesArr, ClinicList)
  console.log(clinicstatecode, vendorcode)


  return (
    <section className="newpurchaseentryform mt-1">
      <div className="container-fluid p-0 m-0">
        <div className="container-fluid bg-seashell border border-2 border-top-0 border-start-0 border-end-0 ">
          <div className="row p-2">
            <div className="col-1">
              <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_npef} aria-label="Close" ></button>
            </div>
            <div className="col-9">
              <h6 className="text-center" style={{ color: "var(--charcoal)", fontWeight: "600" }} > New Purchase Entry </h6>
            </div>
            <div className="col-auto">
              <button disabled={MedicineentriesArr == undefined || MedicineentriesArr && MedicineentriesArr.length == 0 ? true : false} className="button button-burntumber" onClick={() => { confirmmessage(MedicineentriesArr, vendorname) }}>Save All</button>
            </div>
          </div>
        </div>
        <div className="container-fluid entrydetails bg-pearl">
          <div className="row">
            <div className={`col-${vendorid ? '8' : '12'} p-0 m-0`}>
              <div className="container m-2">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className="row">
                      <div className="col-auto">
                        <input type="checkbox" className="" checked={channel == 1 ? true : false} value='1' onClick={(e) => { setchannel(e.target.value) }} />
                      </div>
                      <div className="col-auto">
                        <span className="ms-0">Pharmacy</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="row">
                      <div className="col-auto">
                        <input type="checkbox" className="" checked={channel == 2 ? true : false} value='2' onClick={(e) => { setchannel(e.target.value) }} />
                      </div>
                      <div className="col-auto">
                        <span className="ms-0">Clinic</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8 p-0 m-0">
                <div className="row g-4">
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Select PO</h6>
                    <input className="form-control ms-2 rounded-1" placeholder="Enter PO" value={po ? po : ''} onChange={(e) => { setpo(e.target.value) }} />
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Select Vendor</h6>
                    <input className="form-control ms-2 rounded-1" placeholder='Search Vendors' value={vendorname ? vendorname : ''} onChange={(e) => { searchvendors(e.target.value); setvendorname(e.target.value); setvendorid(); setvendorcode() }} />
                    <div ref={vendorsref} className='position-absolute ms-2 rounded-2 bg-pearl col-2' >
                      {
                        vendorsearch ? (
                          loadvendors ? (
                            <div className='rounded-2 p-1'>
                              Searching Please wait....
                              <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                                <span className="sr-only"> </span> </div>
                            </div>
                          ) : (
                            vendorsearch.length == 0 ? (
                              <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                            ) : (
                              vendorsearch.map((data, i) => (
                                <div style={{ cursor: 'pointer' }} className={`p-0 p-1  bg-${((i % 2) == 0) ? 'pearl' : 'lightblue'} fs-6 `} name={data.id} onClick={(e) => { setvendorname(data.entity_name); setvendorid(data.id); setvendorcode(data.state_code); filterclinic(); vendorsref.current.style.display = 'none'; }}>{data.entity_name}</div>
                              ))
                            )
                          )
                        ) : (<></>)
                      }
                    </div>
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Number</h6>
                    <input type="text" placeholder="Enter No." className="form-control ms-2 rounded-1" value={invoice ? invoice : ''} onChange={(e) => { setinvoice(e.target.value) }} style={{ color: "gray" }} />
                  </div>
                  <div className="col-5">
                    <h6 className="p-0 m-0 ms-3 fw-bold">Invoice Date</h6>
                    <input type="date" className="form-control ms-2 rounded-1" value={invoicedate ? invoicedate : ''} onChange={(e) => { setinvoicedate(e.target.value) }} style={{ color: "gray" }} />
                  </div>
                </div>
                <div className="row p-0 m-0 align-items-center mt-2">
                  <div className="col-6 col-lg-5 col-md-5 p-0 m-0 align-self-center ms-1">
                    <button className="button button-charcoal m-0 p-0 py-1 px-4"> <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" style={{ width: "1.5rem" }} /> Medicine </button>
                  </div>

                </div>
              </div>
              <div className=" p-0 m-0  mt-2 scroll scroll-y" style={{ maxHeight: '53vh' }}>
                <table className="table datatable text-center position-relative">
                  <thead style={{ color: 'gray', fontWeight: '600' }}>
                    <tr>
                      <th>Edit</th>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>batch No.</th>
                      <th>Expiry Date</th>
                      <th>MRP</th>
                      <th>Rate</th>
                      <th>Total Disc</th>
                      <th>Cost</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  {
                    MedicineentriesArr ? (
                      <tbody style={{ Height: '50vh', maxHeight: '50vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                        {
                          MedicineentriesArr.map((item, _key) => (
                            <tr key={_key}>
                              <td><input type='checkbox' checked={_key == tableindex ? true : false} onClick={() => { indexing(_key) }} className='bg-seashell' /></td>
                              <td>{item.Itemid}</td>
                              <td>{item.Itemname}</td>
                              <td>{item.batchno}</td>
                              <td>{item.expirydate}</td>
                              <td>{item.MRP}</td>
                              <td>{item.Rate}</td>
                              <td>{Number(item.Discount) + Number(item.tradeDiscount)}</td>
                              <td>{item.costperunit}</td>
                              <td ><button onClick={() => { DeleteMedicine(item.Itemid); }} className='btn btn-sm button-burntumber'>Delete</button></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    ) : (
                      MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                        <tbody className="position-relative" style={{ height: '50vh', maxHeight: '50vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                          <tr >
                            <td className="position-absolute start-0 end-0 top-0">No items Added</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody className="position-relative" style={{ height: '50vh', maxHeight: '50vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                          <tr className=""  >
                            <td className="position-absolute start-0 end-0 top-0" >No items Added</td>
                          </tr>
                        </tbody>
                      )

                    )
                  }
                </table>
              </div>
            </div>
            <div className={`col-4 m-0 p-0 medicineinfosection d-${vendorid ? 'block' : 'none'} bg-seashell ps-2`} id='medicineinfosection'>
              <h5 className="mt-2">Add Items</h5>
              <div className="col-12">
                <div className="form-group col-10 col-md-11">
                  <div className='position-relative'>
                    <label>Search Items </label>
                    <input className='form-control bg-seashell' placeholder='Items' value={itemname ? itemname : ''} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemtype() }} />
                    <div ref={medicinesref} className='position-absolute rounded-2 bg-pearl col-12' >
                      {
                        itemsearch ? (
                          loadsearch ? (
                            <div className='rounded-2 p-1'>
                              Searching Please wait....
                              <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                                <span className="sr-only"> </span> </div>
                            </div>
                          ) : (
                            itemsearch.length == 0 ? (
                              <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                            ) : (
                              itemsearch.map((data, i) => (
                                <div style={{ cursor: 'pointer' }} className={`p-0 ps-1 shadow bg-${((i % 2) == 0) ? 'pearl' : 'lightyellow'} fs-6 `} name={data.id} onClick={(e) => { setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); setitemtype(data.vaccines_id ? 'v' : 'm'); medicinesref.current.style.display = 'none'; }}>{data.display_name ? data.display_name : data.name}</div>
                              ))
                            )
                          )
                        ) : (<></>)
                      }
                    </div>
                  </div>

                  <label className="mb-2 pt-2">Batch Number</label>
                  <input type="text" max="10" className="form-control bg-seashell batchnumber rounded-1" id="inputEmail4" placeholder="Batch Number" value={batchno ? batchno : ''} onChange={(e) => setbatchno(e.target.value)} required />
                  <label className="pt-3 mb-2">Expiry Date</label>
                  <input type="Date" className="form-control bg-seashell reounded-1 expirydate" value={expdate ? expdate : ''} onChange={(e) => { setexpdate(e.target.value) }} required />
                  <label className="pt-3 mb-2">Manufacturing Date</label>
                  <input type="Date" className="form-control bg-seashell reounded-1 manufacturingdate" value={manufdate ? manufdate : ''} onChange={(e) => { setmanufdate(e.target.value) }} required />
                </div>
                <div className="col-12 form-group col-md-11 col-lg-11">
                  <div className="row p-0 m-0">
                    <div className="col-5">
                      <label className="mb-2">MRP</label>
                      <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={mrp ? mrp : ''} onChange={(e) => { setmrp(e.target.value) }} required />
                    </div>
                    <div className="col-5">
                      <label className="mb-2"> Rate</label>
                      <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={rate ? rate : ''} onChange={(e) => { setrate(e.target.value); Calculate(e.target.value) }} required />
                    </div>
                  </div>
                  <div className="row p-0 m-0">
                    <div className="col-5">
                      <label className="mb-2">Qty</label>
                      <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={qty ? qty : ''} onChange={(e) => { setqty(e.target.value); Calculate(rate, e.target.value) }} required />
                    </div>
                    <div className="col-5">
                      <label className="mb-2">Free Qty</label>
                      <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={freeqty ? freeqty : ''} onChange={(e) => { setfreeqty(e.target.value) }} required />
                    </div>
                  </div>
                  <div className="row p-0 m-0 mt-2">
                    <div className="col-5">
                      <label className="mb-2">Discount &#40;%&#41;</label>
                      <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" value={disc ? disc : ''} onChange={(e) => { setdisc(e.target.value) }} required />
                    </div>
                    <div className="col-5 pb-3">
                      <label className="mb-2">Trade Disc. &#40;%&#41;</label>
                      <input type="number" max="10" className="form-control bg-seashell rate rounded-1  m-auto" placeholder="00" value={trddisc ? trddisc : ''} onChange={(e) => { settrddisc(e.target.value) }} required />
                    </div>
                    <hr />
                    <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? 'block' : 'none'}`}>
                      <div className="row align-items-center p-0 m-0">
                        <div className="col-2 ">
                          <h6>SGST</h6>
                        </div>
                        <div className="col-5">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" disabled={true} value={sgst ? sgst : ''} required />
                        </div>
                        <div className="col-3">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="Rate" value={sgstprcnt ? sgstprcnt : ''} onChange={(e) => { setsgstprcnt(e.target.value); setcgstprcnt(e.target.value); CalculateGst() }} required />
                        </div>
                      </div>
                    </div>
                    <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? 'block' : 'none'}`}>
                      <div className="row p-0 m-0 align-items-center">
                        <div className="col-2">
                          <h6>CGST</h6>
                        </div>
                        <div className="col-5">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" disabled={true} placeholder="00" value={cgst ? cgst : sgst ? sgst : ''} required />
                        </div>
                        <div className="col-3">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" disabled={true} placeholder="Rate" value={cgstprcnt ? cgstprcnt : sgstprcnt ? sgstprcnt : ''} required />
                        </div>
                      </div>
                    </div>
                    <div className={`col-12 ps-2 py-2 d-${vendorcode == clinicstatecode ? 'none' : 'block'}`}>
                      <div className="row p-0 m-0 align-items-center">
                        <div className="col-2 ">
                          <h6>IGST</h6>
                        </div>
                        <div className="col-5">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="00" disabled={true} value={CalculateIGst() ? CalculateIGst() : ''} />
                        </div>
                        <div className="col-3">
                          <input type="number" max="10" className="form-control bg-seashell mrp rounded-1  m-auto" placeholder="Rate" value={igstprcnt ? igstprcnt : ''} onChange={(e) => { setigstprcnt(e.target.value) }} required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="col-12 form-group">
                  <div className="row p-0 m-0 g-3">
                    <div className="col-5">
                      <label className="mb-2">Cost/Unit</label>
                      <input type="number" max="10" className="form-control bg-seashell costunit rounded-1" placeholder="00" disabled value={CalculateCPU() ? CalculateCPU() : ''} onChange={(e) => { setcpu(e.target.value) }} required />
                    </div>
                    <div className="col-5">
                      <label className="mb-2">Total Amount</label>
                      <input type="number" max="10" className="form-control bg-seashell totalamount rounded-1" placeholder="00" disabled value={Calculate() ? Calculate() : ''} onChange={(e) => { settotalamt(e.target.value) }} required />
                    </div>
                  </div>
                </div>

                <div className="col-6 py-3 m-auto text-center">
                  {
                    tableindex == -1 || tableindex == undefined ? (
                      <button type="submit" className="btn  button-charcoal done px-5" onClick={InsertMedicines} > Add </button>
                    ) : (
                      <button type="submit" className="btn  button-charcoal done px-5" onClick={UpdateMedicines} > Update </button>
                    )
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Purchaseordersection() {
  let cartselect = ["Pharmacy", "Clinic"];
  const [cartselectindex, setcartselectindex] = useState(0);
  const [displayviewcart, setdisplayviewcart] = useState("none");
  const [displayitemdetails, setdisplayitemdetails] = useState("none");
  const _displayviewcart = () => {
    if (displayviewcart === "none") {
      setdisplayviewcart("block");
    }
    if (displayviewcart === "block") {
      setdisplayviewcart("none");
    }
  }
  const _displayitemdetails = () => {
    if (displayitemdetails === "none") {
      setdisplayitemdetails("block");
    }
    if (displayitemdetails === "block") {
      setdisplayitemdetails("none");
    }
  }
  const _selectedcart = (cardindex) => {
    if (cardindex === 0) {
      return <table className="table datatable text-center"><thead>
        <tr>
          <th>No.</th>
          <th>Item Name</th>
          <th>Total Qty</th>
          <th>Amount</th>
          <th>Last Vendor</th>
          <th>Add</th>
          <th>Delete</th>
        </tr>
      </thead>
        <tbody>
          {<Pharmacystocktable />}
        </tbody>
      </table>
    }
    if (cardindex === 1) {
      return <div className="">{cardindex}</div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>
      <button className="button viewcart button-charcoal position-absolute" onClick={_displayviewcart}><img src={process.env.PUBLIC_URL + "/images/cartwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />View Cart</button>
      <div className={`container-fluid pt-2  p-0 m-0 cartform d-${displayviewcart} w-50 border1 rounded bg-seashell position-absolute text-center`} >
        <div className="container-fluid  w-100 shadow-sm">
          <h5 className="text-dark fw-bold">Items in Cart</h5>
        </div>
        <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={_displayviewcart}></button>
        <div className="pt-1">
          <div className="row g-0 justify-content-center">
            {
              cartselect.map((e, i) => {
                return (
                  <button className={`col-2 p-0 m-0 button text-${i === cartselectindex ? "light" : "dark"} bg-${i === cartselectindex ? "charcoal" : "seashell"} rounded-0`} onClick={(a) => setcartselectindex(i)}>{e}</button>
                )
              })
            }
          </div>
        </div>
        <div className="scroll scroll-y">
          {_selectedcart(cartselectindex)}
        </div>
        <div className="bg-pearl rounded">
          <div className="row p-3 justify-content-between">
            <div className="col-3">
              <select className="form-control bg-pearl" style={{ color: 'gray' }}>
                <option selected disabled defaultValue='Select Vendor' className="Selectvendor" style={{ color: 'gray' }}>Select Vendor</option>
              </select>
            </div>
            <div className="col-3">
              <button className="button button-charcoal">Create New PO</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`container-fluid pt-2  p-0 m-0 itemdetailsform d-${displayitemdetails} w-50 border1 rounded bg-seashell position-absolute text-center`} >
        <div className="container-fluid  w-100 shadow-sm">
          <h5 className="text-dark fw-bold">PO-14 Item Details</h5>
        </div>
        <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={_displayitemdetails}></button>
        <div className="scroll scroll-y">
          {<POitemdetailsarray />}
        </div>
        <button type="button" className="btn btn-lg text-center button-charcoal m-2" onClick={_displayitemdetails}>Done</button>
      </div>
      <h3 className='ps-3'>Purchase Order List</h3>
      <table className="table datatable text-center">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Channel</th>
            <th>Vendor</th>
            <th>PO Date</th>
            <th>Created By</th>
            <th>Total Items</th>
            <th>Amount</th>
            <th>Approval Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {<Purchaseorderarray itemdetails={_displayitemdetails} />}
        </tbody>
      </table>
    </>
  )
}
function POitemdetailssection() {
  return (
    <table className="table datatable text-center"><thead>
      <tr>
        <th>No.</th>
        <th>Item Name</th>
        <th>Total Qty</th>
        <th>Amount</th>
        <th>Last Vendor</th>
        <th>Add</th>
        <th>Delete</th>
      </tr>
    </thead>
      <tbody>
        {<POitemdetailsarray />}
      </tbody>
    </table>
  )
}
function PurchaseReturns(){
const currentDate = useContext(TodayDate)
const ClinicID = localStorage.getItem('ClinicId')
const url = useContext(URL)
const [peidw, setpeidw] = useState("none");
const nextref = useRef()
const previousref = useRef()
const [channel, setchannel] = useState(1)
const [fromdate, setfromdate] = useState()
const [todate, settodate] = useState()
const [Loading, setLoading] = useState(false)
const [purchasereturnarr, setpurchasereturnarr] = useState([])
const [index, setindex] = useState()
const [npef, setnpef] = useState("none");
const [nxtoffset, setnxtoffset] = useState(0)
const [prevoffset, setprevoffset] = useState(0)
const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const [tabindex, settabindex] = useState()

function GETPurchaseReturns(i) {
  if (i == undefined) {
    i = 0
  }
  setLoading(true)
  if (i == 0 || i == undefined || nxtoffset == 0) {
    previousref.current.disabled = true
  } else {
    previousref.current.disabled = false
  }
  try {
    axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${i*25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
      setpurchasereturnarr(response.data.data)
      let nxt = Number(i) + 1
      setnxtoffset(nxt)
      if (i != 0) {
        let prev = i--
        setprevoffset(prev)
      }
      setLoading(false)
    }).catch((e) => {
      Notiflix.Notify.warning(e)
      setLoading(false)
    })
  } catch (e) {
    Notiflix.Notify.warning(e.data.message)
    setLoading(false)
  }
}
useEffect(() => {
  GETPurchaseReturns()
}, [channel, fromdate, todate])

const toggle_peidw = () => {
  if (peidw === "none") {
    setpeidw("block");
  }
  if (peidw === "block") {
    setpeidw("none");
  }
};
const toggle_npef = () => {
  if (npef === "none") {
    setnpef("block");

  }
  if (npef === "block") {
    setnpef("none");
  }
};
const reversefunction = (date) => {
  if (date) {
    date = date.split("-").reverse().join("-")
    return date
  }

}
async function getnextpages(e) {
  GETPurchaseReturns(e.target.value)
}
async function getpreviouspages(e) {
  GETPurchaseReturns(e.target.value - 1)
}
console.log(purchasereturnarr)
return(
  <div classsName='p-0 m-0'>
      <div className="row p-0 m-0">
        <div className="col-3 col-md-2 col-lg-2 align-self-center text-charcoal fw-bolder fs-6">Purchase Entry</div>
        <div className="col-6 col-xl-6 col-lg-7 col-md-auto align-self-center m-1 ">
          <div className="row border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
            <div className="col-4">
              <select className='p-0 m-0 border-0 text-burntumber fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={fromdate ? fromdate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-4 text-burntumber fw-bolder">
              <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder ' value={todate ? todate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 align-self-center">
          <ExportPurchaseEntry purchasereturnarr={purchasereturnarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{minHeight:'55vh',height:'55vh'}}>
        <table className="table text-center p-0 m-0">
          <thead className='p-0 m-0 align-middle'>
            <tr>
              <th className='fw-bolder text-charcoal75' scope='col'>PR ID</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Distributor</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Return Date</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Return Amount</th>
              <th className='fw-bolder text-charcoal75' scope='col'>Actions</th>
              <th className='fw-bolder text-charcoal75' scope='col'>more</th>
            </tr>
          </thead>
          {
            Loading ? (
              <body className=' text-center' style={{minHeight:'55vh'}}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center">
                    <strong className='fs-5'>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>

              </body>

            ) : (
              purchasereturnarr && purchasereturnarr.length != 0 ? (
                <tbody>
                  {
                    purchasereturnarr.map((item, i) => (
                      <tr key={i} className={`bg-${((i % 2) == 0)?'seashell':'pearl'} align-middle`}>
                        <td className='p-0 m-0 text-charcoal fw-bold'>PR-{item.return_no}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.return_date ? reversefunction(item.return_date): ''}</td>
                        <td className='p-0 m-0 text-charcoal fw-bold'>{item.grand_total ? item.grand_total : 'N/A'}</td>                       
                        <td className='p-0 m-0 text-charcoal fw-bold'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button><buttton className="btn" onClick={() => { setindex(i); toggle_peidw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                        <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? peidw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                          {
                            i == index ? (
                              <PRitemdetailssection purchasereturnarr={purchasereturnarr[i]} itembillid={"PR-" + item.return_no} toggle_peidw={toggle_peidw} />
                            ) : (<></>)
                          }
                        </td>

                      </tr>

                    ))

                  }

                </tbody>
              ) : (
                <tbody className='text-center position-relative p-0 m-0 ' style={{minHeight:'55vh'}}>
                  <tr className=''>
                    <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Purchase Returns</td>
                  </tr>
                </tbody>
              )
            )
          }

        </table>
        </div>
      <div className="container-fluid mb-1">
        <div className="row p-0 m-0 text-center">
          <div className="col-3 col-xl-4">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-auto col-xl-auto">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); GETPurchaseReturns(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-3 col-xl-4">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
      </div>
 
)
}
function PRitemdetailssection(){

}

export { Purchasesection };
export { Purchaseordersection };
export { Purchaseentrysection };
export { POitemdetailssection };
export { PEitemdetailssection };


//-------------------------------------------------------------------------Stock Info---------------------------------------------------------

function Stocksection() {
  let menu = ["Vaccines", "Medicines"];
  const [menuindex, setmenuindex] = useState(0);
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <div className=""><Stockvaccinesection /></div>
    }
    if (_menu === 1) {
      return <div className=""><Stockmedicinesection /></div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>
      <section className='stocksection pt-3'>
        <div className="container-fluid">
          <div className="row g-3">
            <div className="col-10">
              <div className='row'>
                {
                  menu.map((e, i) => {
                    return (
                      <div className="col-auto">
                        <button className={`btn btn-sm px-4 rounded-5 text-${i === menuindex ? "light" : "dark"} bg-${i === menuindex ? "charcoal" : "seashell"}`} onClick={(a) => setmenuindex(i)} >{e}</button>
                      </div>
                    )
                  }
                  )
                }
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid pt-5'>
          <div className="scroll scroll-y">
            {_selectedmenu(menuindex)}
          </div>
        </div>
      </section>
    </>
  )
}
function Stockvaccinesection() {
  return (
    <>
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className='position-absolute searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Vaccine Name" />
        <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <h3 className='ps-3'>Vaccine Stock Info</h3>
      <table className="table datatable text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicine Name</th>
            <th>Batch No.</th>
            <th>Expiry Date</th>
            <th>MRP</th>
            <th>Cost/Unit</th>
            <th>B.Stock</th>
            <th>T.Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {<Stockvaccinearray />}
        </tbody>
      </table>
    </>
  )
}
function Stockmedicinesection() {
  return (
    <>
      <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button>
      <div className='position-absolute searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
        <input type="text" className=" form-control d-inline itemsearch bg-pearl" placeholder="Medicine Name" />
        <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <h3 className='ps-3'>Medicine Stock Info</h3>
      <table className="table datatable text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicine Name</th>
            <th>Batch No.</th>
            <th>Expiry Date</th>
            <th>MRP</th>
            <th>Cost/Unit</th>
            <th>B.Stock</th>
            <th>T.Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {<Stockmedicinearray />}
        </tbody>
      </table>
    </>
  )
}
export { Stocksection };




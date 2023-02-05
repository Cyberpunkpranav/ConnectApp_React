import axios from 'axios';
import React, { useState, useEffect, useContext,useRef } from 'react';

import { URL, TodayDate } from '../../index';
import {ExportPurchaseEntry} from '../pharmacy/Exports'
import '../../css/pharmacy.css';
import Notiflix from 'notiflix';
import '../../css/bootstrap.css';
import { Purchaseorderarray, Pharmacystocktable, Stockvaccinearray, Stockmedicinearray, POitemdetailsarray, PEitemdetailsarray } from './apiarrays';

// ---------------------------------------------------------------purchase------------------------------------------------------------------
function Purchasesection(props) {
  const first = ["Purchase Orders", "Purchase Entry", "Purchase Returns"];
  const [second, setSecond] = useState(0);

  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return <Purchaseordersection />
    }
    if (_selected === 1) {
      return <Purchaseentrysection function={props.func} function2={props.function} />
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
function Purchaseentrysection(props) {
  const currentDate = useContext(TodayDate)
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
  const [purchaseentryarr, setpurchaseentryarr] = useState([])
  const [index, setindex] = useState()
 
  function GETPurchaseList() {
    setLoading(true)
    try {
      axios.get(`${url}/purchase/entry?clinic_id=1&channel=${channel}&limit=25&offset=5&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpurchaseentryarr(response.data.data)
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
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }

  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={props.function}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Purchase</button>
      <div className="row p-0 m-0">
        <div className="col-3 col-lg-2 align-self-center">
          <h5 className=''>Purchase Entry</h5>
        </div>
        <div className="col-6 col-xl-6 col-lg-8">
          <div className="row bg-lightblue fw-bolder rounded-2 p-1 text-center justify-content-center">
            <div className="col-3">
              <select className='p-0 m-0 border-0 bg-lightblue fw-bolder text-charcoal' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0' value='1'>Pharmacy</option>
                <option className='border-0' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-3 bg-lightblue">
              <input type='date' className='p-0 m-0 border-0 bg-lightblue fw-bolder text-charcoal ' value={fromdate ? fromdate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-3 bg-lightblue">
              <input type='date' className='p-0 m-0 border-0 bg-lightblue fw-bolder text-charcoal ' value={todate ? todate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2">
        <ExportPurchaseEntry purchaseentryarr={purchaseentryarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)}/>
        </div>
      </div>
      <div className='scroll scroll-y' style={{maxHeight:'55vh'}}>
      <table className="table  text-center table-responsive table-bordered p-0 m-0">
        <thead>
          <tr>
            <th scope='col'>PE ID</th>
            <th scope='col'>PO ID</th>
            <th scope='col'>Channel</th>
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
            purchaseentryarr &&purchaseentryarr.length!=0 ? (
              <tbody>
              {
                purchaseentryarr.map((item, i) => (
                   <tr key={i}>
                    <td>PE-{item.bill_id}</td>
                    <td>{item.purchase_order_id && item.purchase_order_id !== null ? item.purchase_order_id : 'N/A'}</td>
                    <td>{item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"}</td>
                    <td>{item.invoice_no ? item.invoice_no : 'N/A'}</td>
                    <td>{item.bill_date && item.bill_date ? reversefunction(item.bill_date) : 'N/A'}</td>
                    <td>{item.bill_total && item.bill_total ? "Rs. " + item.bill_total : 'N/A'}</td>
                    <td>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                    <td><button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button><buttton className="btn" onClick={()=>{setindex(i);toggle_peidw()} }><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                    <td><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                    <td className={`PEdetailssection position-absolute mt-1 d-${i==index ? peidw:'none'} bg-seashell p-0 m-0`} style={{top:'-8.5rem'}} >
                    {
                    i == index  ? (
                      <PEitemdetailssection purchaseentryarr={purchaseentryarr[i]} itembillid= {"PE-"+item.bill_id} toggle_peidw={toggle_peidw} />
                    ):(<></>)
                    }
                    </td>
               
                  </tr>
              
                ))

              }

            </tbody>
            ):(
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
function PEitemdetailssection(props) {
  console.log(props.purchaseentryarr)
  const [medicine,setmedicine] =useState('block')
  const [vaccine,setvaccine]=useState('none')
  const [index,setindex]=useState(0)
  const Items = ['Medicine','Vaccine']


  if(index ==0){
    if(medicine == 'none'){
      setmedicine('block')
      setvaccine('none')
    }
  }
  if(index ==1){
    if(vaccine =='none'){
      setvaccine('block')
      setmedicine('none')
    }
  }
const [Taxon,setTaxon]=useState(false)

 function TotalTaxPercent(cgst,sgst,igst){
    if(cgst&&sgst&&igst !==null||undefined){
      return Number(cgst)+Number(sgst)+Number(igst)
    }
 }
 function TotalTaxRate(cgst,sgst,igst){
  if(cgst&&sgst&&igst !==null||undefined){
    return Number(cgst)+Number(sgst)+Number(igst)
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
          Items.map((data,i)=>(
            <div className="col-3 col-xl-2 col-lg-2 col-md-4 col-sm-6 p-0 m-0">
            <button className={`button border button-${i==index ?'charcoal':'seashell'}`} onClick={()=>{setindex(i)}}>{data}</button>
            </div>
          ))
        }
    
    </div>
    
 
    <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{minHeight:'82vh',maxHeight:'82vh'}}>
      <div className="row">
        <div className="col-9"><h5 className='ps-1'>Medicine</h5></div>
        <div className="col-3"><input type='checkbox' className='' value={Taxon?Taxon:''} onChange={()=>{Taxon ==true ? setTaxon(false):setTaxon(true)}}/><label>Show Tax Details</label></div>
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
        <th colspan={Taxon ==true ?'8':'2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
      </tr>
      <tr>
      <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>CGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>CGST in Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>SGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>SGST in Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>IGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>IGST in Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
        <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
      </tr>
    </thead>
      {
      props.purchaseentryarr.medicines && props.purchaseentryarr.medicines.length!==0?(
        <tbody className='border align-items-center p-0 m-0'>
          {
          props.purchaseentryarr.medicines.map((item, _key) => (
         <tr className='border p-0 m-0 align-middle' key={_key}>
         <td className='border p-0 m-0 align-middle'>{item && item.id!==null ?item.id:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !==null ?item.medicine.name:'N/A' }</td>
         <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no !=null ? item.batch_no :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.expiry_date &&item.expiry_date !=null ?item.expiry_date:'N/A' }</td>
         <td className='border p-0 m-0 align-middle'>{item.mrp?item.mrp:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.rate ?item.rate :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.discount?item.discount:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.trade_discount ?item.trade_discount:'N/A' }</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.SGST_rate? item.SGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.SGST?item.SGST:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.CGST_rate?item.CGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.CGST?item.CGST:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.IGST_rate?item.IGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.IGST?item.IGST:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate,item.SGST_rate,item.IGST_rate)}</td>
         <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST,item.SGST,item.IGST)}</td>
         <td className='border p-0 m-0 align-middle'>{item.cost?item.cost:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.qty?item.qty:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.total_amount ?item.total_amount :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
     </tr>
      ))
          }

     </tbody>

      ):(
        <body className='text-center p-0 m-0 border border-1 '>
        <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 bg-lightred'>
            <strong className='fs-5 text-center bg-lightred'>No Medicines Found</strong>
        </div>

      </body>
      )


    }
    </table>
    </div>
    <div className={`scroll bg-seashell scroll-y d-${vaccine}`}style={{minHeight:'82vh',maxHeight:'82vh'}}>
    <div className="row">
        <div className="col-9"><h5 className='ps-1'>Vaccine</h5></div>
        <div className="col-3"><input type='checkbox' className='' value={Taxon?Taxon:''} onChange={()=>{Taxon ==true ? setTaxon(false):setTaxon(true)}}/><label>Show Tax Details</label></div>
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
        <th colspan={Taxon ==true ?'8':'2'} scope='col-group' className={`border p-0 m-0 px-1`}>Total Tax</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Cost in Rs.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
        <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
      </tr>
      <tr>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>CGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>CGST Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>SGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>SGST in Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>IGST%</th>
        <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true?'':'none'}`}>IGST in Rs.</th>
        <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
        <th scope='col' className={`border p-0 m-0 px-1`}>Total in Rs.</th>
      </tr>
    </thead>
      {
      props.purchaseentryarr.vaccines && props.purchaseentryarr.vaccines.length!==0?(
        <tbody className='border align-items-center p-0 m-0'>
          {
          props.purchaseentryarr.vaccines.map((item, _key) => (
         <tr className='border p-0 m-0 align-middle' key={_key}>
         <td className='border p-0 m-0 align-middle'>{item && item.id!==null ?item.id:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !==null ?item.medicine.name:'N/A' }</td>
         <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no !=null ? item.batch_no :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.expiry_date &&item.expiry_date !=null ?item.expiry_date:'N/A' }</td>
         <td className='border p-0 m-0 align-middle'>{item.mrp?item.mrp:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.rate ?item.rate :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.discount?item.discount:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.trade_discount ?item.trade_discount:'N/A' }</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.SGST_rate? item.SGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.SGST?item.SGST:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.CGST_rate?item.CGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.CGST?item.CGST:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.IGST_rate?item.IGST_rate:'N/A'}</td>
         <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '':'none' }`}>{item.IGST?item.IGST:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate,item.SGST_rate,item.IGST_rate)}</td>
         <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST,item.SGST,item.IGST)}</td>
         <td className='border p-0 m-0 align-middle'>{item.cost?item.cost:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.qty?item.qty:'N/A'}</td>
         <td className='border p-0 m-0 align-middle'>{item.total_amount ?item.total_amount :'N/A'}</td>
         <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td>
     </tr>
      ))
          }

     </tbody>

      ):(
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
        <input type="text" className=" form-control d-inline medicinesearch bg-pearl" placeholder="Medicine Name" />
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




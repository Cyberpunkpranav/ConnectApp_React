import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { URL, TodayDate, DoctorsList, Clinic } from '../../index';
import { ExportPurchaseEntry, ExportSaleEntry, ExportSaleReturn } from '../pharmacy/Exports'
import Notiflix from 'notiflix';
import { customconfirm } from '../features/notiflix/customconfirm';
import { customnotify } from '../features/notiflix/customnotify';
import '../../css/bootstrap.css';
import '../../css/pharmacy.css';
import '../../css/dashboard.css'
import { Purchaseorderarray, Pharmacystocktable, Stockvaccinearray, Stockmedicinearray, POitemdetailsarray, PEitemdetailsarray } from './apiarrays';

//-------------------------------------------------Sales------------------------------------------------------------------------------------------
function Salesection(props) {
  const first = ["Sale Entry", "Sale Returns"];
  const [second, setSecond] = useState(0);

  const _selectedScreen = (_selected) => {
    if (_selected === 0) {
      return <Saleentrysection function={props.func} function2={props.function} />
    }
    if (_selected === 1) {
      return <SaleReturns />
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
  const adminid = localStorage.getItem('id')
  const url = useContext(URL)
  const nextref = useRef()
  const previousref = useRef()
  const [seidw, setseidw] = useState("none");
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [saleentryarr, setsaleentryarr] = useState([])
  const [index, setindex] = useState()
  const [nsef, setnsef] = useState("none");
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [tabindex, settabindex] = useState()
  console.log(saleentryarr)
  const toggle_nsef = () => {
    if (nsef === 'none') {
      setnsef('block')
    }
    if (nsef === 'block') {
      setnsef('none')
    }
  }
  const toggle_seidw = () => {
    if (seidw === "none") {
      setseidw("block");
    }
    if (seidw === "block") {
      setseidw("none");
    }
  };
  function GETSalesList(i) {
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
      axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=${i * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        console.log(response)
        setsaleentryarr(response.data.data)
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
  async function getnextpages(e) {
    GETSalesList(e.target.value)
  }
  async function getpreviouspages(e) {
    GETSalesList(e.target.value - 1)
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
  let array = [[1, 'Pending', 'lightred'], [2, 'Booked', 'lightblue'], [3, 'Cancelled', 'lightred'], [4, 'QR Generated', 'light'], [5, 'Checked_in', 'brandy'], [6, 'Vitals Done', 'lightred'], [7, 'In_apppointment', 'lightyellow'], [8, 'Payment done', 'lightgreen'], [9, 'Unattained', 'lightyellow'], [10, 'Completed', 'lightgreen']]
  function status(number) {
    let status
    for (let i = 0; i < array.length; i++) {
      if (number == array[i][0]) {
        status = array[i][1]
        break;
      }
    }
    return status
  }

  function status_color(number) {
    let status_color;
    for (let j = 0; j < array.length; j++) {
      if (number == array[j][0]) {
        status_color = array[j][2]
        break;
      }
    }
    return status_color
  }

  async function UpadteStatus(e) {
    if (e.target.value && adminid && e.target.name) {
      try {
        Notiflix.Loading.circle('Upadating Appointment Status', {
          backgroundColor: 'rgb(242, 242, 242,0.5)',
          svgColor: '#96351E',
          messageColor: '#96351E'
        })
        await axios.post(`${url}/appointment/change/status`, {
          appointment_id: e.target.name,
          status: e.target.value,
          admin_id: adminid
        }).then((response) => {
          GETSalesList()
          Notiflix.Loading.remove()
          Notiflix.Notify.success(response.data.message)
        })
      } catch (e) {
        alert(e)
      }
    } else {
      Notiflix.Notify.alert('Please try Again')
    }
  }

  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={toggle_nsef}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Sale</button>
      <div className="row p-0 m-0">
        <div className="col-3 col-md-2 col-lg-2 align-self-center text-charcoal fw-bolder fs-6">
          Sale Entry
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
      <div className='scroll scroll-y p-0 m-0' style={{ minHeight: '55vh', height: '55vh' }}>
        <table className="table text-center table-responsive p-0 m-0">
          <thead className=' p-0 m-0'>
            <tr className=' p-0 m-0'>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Bill ID</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Patient Name</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Bill Date</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Bill Total</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' colspan='3'>Appointment Details</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Status</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>Actions</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>more</th>
            </tr>
            <tr className='p-0 m-0'>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' scope='col'>Appointment Date</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' scope='col'>Doctor Name</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' scope='col'>Invoice No.</th>
            </tr>
          </thead>
          {
            Loading ? (
              <body className=' text-center' style={{ minHeight: '55vh', height: '55vh' }}>
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
                      <tr className={` bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} align-middle`} key={i}>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.bill_id && item.bill_id !== null ? "P-" + item.bill_id : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.patient && item.patient && item.patient.full_name != null ? item.patient.full_name : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.bill_date && item.bill_date ? reversefunction(item.bill_date) : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.grand_total && item.grand_total ? "Rs. " + item.grand_total : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.appointment && item.appointment != null && item.appointment.appointment_date && item.appointment.appointment_date != null ? reversefunction(item.appointment.appointment_date) : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.appointment && item.appointment != null && item.appointment.doctor && item.appointment.doctor.doctor_name != null ? item.appointment.doctor.doctor_name : ''}</td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'>{item.appointment && item.appointment != null && item.appointment.bill_id && item.appointment.bill_id != null ? item.appointment.bill_id : ''}</td>
                        <td className="text-charcoal fw-bold p-0 m-0 px-1">
                          <select className={` fw-bolder border-0 bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} text-center  text-${status_color(item.status)}`} name={item.id} onChange={(e) => { UpadteStatus(e) }} style={{ appearance: 'none' }}>
                            <option className="button" selected disabled>{status(item.status)}</option>
                            <option key={0} className="text-lightred" value='1'>Pending</option>
                            <option key={1} className="text-lightblue" value='2'>Booked</option>
                            <option key={2} className="text-lightred" value='3'>Cancelled</option>
                            <option key={3} className="text-pearl" value='4'>QR Generated</option>
                            <option key={4} className="text-brandy" value='5'>Checked_in</option>
                            <option key={5} className="text-lightred" value='6'>Vitals Done</option>
                            <option key={6} className="text-lightyellow" value='7'>In_apppointment</option>
                            <option key={7} className="text-lightgreen" value='8'>Payment done</option>
                            <option key={8} className="text-lightyellow" value='9'>Unattained</option>
                            <option key={9} className="text-lightgreen" value='10'>Completed</option>
                          </select>
                        </td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button><buttton className="btn" onClick={() => { setindex(i); toggle_seidw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                        <td className='text-charcoal fw-bold p-0 m-0 px-1'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? seidw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                          {
                            i == index ? (
                              <SEitemdetailssection saleentryarr={saleentryarr[i]} itembillid={"P-" + item.bill_id} toggle_seidw={toggle_seidw} />
                            ) : (<></>)
                          }
                        </td>

                      </tr>

                    ))

                  }

                </tbody>
              ) : (
                <body className='text-center p-0 m-0' style={{ minHeight: '55vh', maxHeight: '55vh' }}>
                  <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                    <strong className='text-charcoal fw-bolder text-center'>No Sale Entries</strong>
                  </div>
                </body>
              )
            )
          }

        </table>
      </div>
      <div className="container-fluid mb-1 p-0 m-0">
        <div className="row p-0 m-0 text-center">
          <div className="col-3 col-xl-4 col-md-2 col-sm-2 p-0 m-0">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-auto col-xl-auto col-sm-8 col-md-8 p-0 m-0">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); GETSalesList(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-3 col-xl-4 col-md-2 col-sm-2 p-0 m-0">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
      <section className={`newsaleentryform position-absolute d-${nsef} start-0 end-0 bg-seashell m-2 rounded-4 shadow`} style={{ height: '90vh' }}>
        <SaleEntryForm toggle_nsef={toggle_nsef} GETSalesList={GETSalesList} />
      </section>
    </>
  )
}
function SEitemdetailssection(props) {
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
      let e = Number(cgst) + Number(sgst) + Number(igst)
      return e
    }
  }
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if (cgst && sgst && igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
      return e
    }
  }
  console.log(props.saleentryarr)
  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <div className="row p-0 m-0">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_seidw} aria-label="Close"></button>
          </div>
          <div className="col-9">
            <h5 className='text-center text-charcoal fw-bolder'>{props.itembillid} Sale Entry Item Details</h5>
          </div>
          <div className="col-2 d-none">
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

      <div className="row p-0 m-0 justify-content-between">
        <div className="col-auto ms-2 text-burntumber fw-bolder" >
          Grand Total : {props.saleentryarr.grand_total ? props.saleentryarr.grand_total : 0}
        </div>
        <div className="col-auto justify-content-end me-4">
          <input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label>
        </div>

      </div>

      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan='2' className='border p-0 m-0 px-1'>Stock ID</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Medicine Name</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Quantity</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Discount %</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Discounted MRP in Rs.</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Amount in Rs.</th>
              <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            </tr>
            <tr>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total amount in Rs.</th>
            </tr>
          </thead>
          {
            props.saleentryarr.sale_medicines && props.saleentryarr.sale_medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.saleentryarr.sale_medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item.medicine_stocks && item.medicine_stocks.id !== null ? "m" + item.medicine_stocks.id : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty && item.qty != null ? item.qty : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.main_mrp ? item.main_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount != null ? item.discount : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.disc_mrp ? item.disc_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine_stocks && item.medicine_stocks.total_amount ? item.medicine_stocks.total_amount : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : ''}</td>
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
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan='2' className='border p-0 m-0 px-1'>Stock ID</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Vaccine Name</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Quantity</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Discount %</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Discounted MRP in Rs.</th>
              <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            </tr>
            <tr>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST in Rs.</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total amount in Rs.</th>
            </tr>
          </thead>
          {
            props.saleentryarr.sale_vaccines !== undefined && props.saleentryarr.sale_vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.saleentryarr.sale_vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item.vaccine_stocks && item.vaccine_stocks.id !== null ? "v" + item.vaccine_stocks.id : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.vaccine && item.vaccine.name !== null ? item.vaccine.name : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty && item.qty != null ? item.qty : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.main_mrp ? item.main_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount != null ? item.discount : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.disc_mrp ? item.disc_mrp : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : ''}</td>
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
function SaleReturns() {
  const currentDate = useContext(TodayDate)
  const url = useContext(URL)
  const [sridw, setsridw] = useState("none");
  const nextref = useRef()
  const previousref = useRef()
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [salereturnarr, setsalereturnarr] = useState([])
  const [index, setindex] = useState()
  const [nref, setnref] = useState("none");
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [tabindex, settabindex] = useState()
  console.log(salereturnarr)
  function GETSaleReturns(i) {
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
      // /sale/return?from_date=2023-01-01&to_date=2023-01-31&limit=2&offset=0
      axios.get(`${url}/sale/return?limit=25&offset=${i * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        console.log(response)
        setsalereturnarr(response.data.data)
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
    GETSaleReturns()
  }, [channel, fromdate, todate])

  const toggle_sridw = () => {
    if (sridw === "none") {
      setsridw("block");
    }
    if (sridw === "block") {
      setsridw("none");
    }
  };
  const toggle_nref = () => {
    if (nref === "none") {
      setnref("block");

    }
    if (nref === "block") {
      setnref("none");
    }
  };
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }
  async function getnextpages(e) {
    GETSaleReturns(e.target.value)
  }
  async function getpreviouspages(e) {
    GETSaleReturns(e.target.value - 1)
  }
  console.log(salereturnarr)
  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={toggle_nref}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Return</button>
      <div classsName='p-0 m-0'>
        <div className="row p-0 m-0">
          <div className="col-3 col-md-2 col-lg-3 align-self-center text-charcoal fw-bolder fs-6">Sale Return </div>
          <div className="col-6 col-xl-6 col-lg-7 col-md-auto col-sm-auto align-self-center m-1 ">
            <div className="row border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
              <div className="col-4 d-none">
                <select className='p-0 m-0 border-0 text-burntumber fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                  <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                  <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
                </select>
              </div>
              <div className="col-4 col-md-6 col-sm-6 text-burntumber bg-pearl fw-bolder">
                <input type='date' className='p-0 m-0 border-0 text-burntumber  bg-pearl fw-bolder' placeholder='fromdate' value={fromdate ? fromdate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
              </div>
              <div className="col-4 col-md-6 col-sm-6 text-burntumber bg-pearl fw-bolder">
                <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder bg-pearl' placeholder='fromdate' value={todate ? todate : ''} onChange={(e) => { settodate(e.target.value) }} />
              </div>
            </div>
          </div>
          <div className="col-2 align-self-center d-none">
            <ExportSaleReturn salereturnarr={salereturnarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
          </div>
        </div>
        <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{ minHeight: '55vh', height: '55vh' }}>
          <table className="table text-center p-0 m-0">
            <thead className='p-0 m-0 align-middle'>
              <tr>
                <th className='fw-bolder text-charcoal75' scope='col'>Return No.</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Name</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Sale Entry ID</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Return Date</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Return Amount</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Actions</th>
                <th className='fw-bolder text-charcoal75' scope='col'>more</th>
              </tr>
            </thead>
            {
              Loading ? (
                <body className=' text-center' style={{ minHeight: '55vh' }}>
                  <tr className='position-absolute border-0 start-0 end-0 px-5'>
                    <div class="d-flex align-items-center">
                      <strong className='fs-5'>Getting Details please be Patient ...</strong>
                      <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                  </tr>

                </body>

              ) : (
                salereturnarr && salereturnarr.length != 0 ? (
                  <tbody>
                    {
                      salereturnarr.map((item, i) => (
                        <tr key={i} className={`bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} align-middle`}>
                          <td className='p-0 m-0 text-charcoal fw-bold'>SR-{item.return_no}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.sale_entry && item.sale_entry.patient && item.sale_entry.patient.full_name != null ? item.sale_entry.patient.full_name : 'N/A'}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.sale_entry && item.sale_entry && item.sale_entry.id != null ? 'P-' + item.sale_entry.id : 'N/A'}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.return_date ? reversefunction(item.return_date) : ''}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.grand_total ? item.grand_total : 'N/A'}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>
                            {/* <button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button> */}
                            <buttton className="btn" onClick={() => { setindex(i); toggle_sridw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                          <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                          <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? sridw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                            {
                              i == index ? (
                                <SRitemdetailssection salereturnarr={salereturnarr[i]} toggle_sridw={toggle_sridw} />
                              ) : (<></>)
                            }
                          </td>

                        </tr>

                      ))

                    }

                  </tbody>
                ) : (
                  <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '55vh' }}>
                    <tr className=''>
                      <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Sale Returns</td>
                    </tr>
                  </tbody>
                )
              )
            }

          </table>
        </div>
        <div className="container-fluid mb-1">
          <div className="row p-0 m-0 text-center">
            <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
              <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); }} style={{ marginTop: '0.15rem' }}>Previous</button>
            </div>
            <div className="col-auto col-xl-auto col-md-8 col-lg-8 col-sm-auto p-0 m-0">

              {
                pages ? (
                  pages.map((page, i) => (
                    <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { settabindex(i); GETSaleReturns(i) }} key={i}>{page}</button>
                  ))
                ) : (
                  <div>Loading...</div>
                )

              }
            </div>
            <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
              <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); }} style={{ marginTop: '0.15rem' }}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <section className={`newreturnentrysection position-absolute start-0 end-0 top-0 bottom-0 d-${nref}`} style={{ marginTop: '-8.5rem' }}  >
        {<NewSaleReturnentryform toggle_nref={toggle_nref} GETSaleReturns={GETSaleReturns} />}
      </section>
    </>
  )
}
function SaleEntryForm(props) {
  const cliniclist = useContext(Clinic)
  const url = useContext(URL)
  const Doclist = useContext(DoctorsList)
  const clinicID = localStorage.getItem('ClinicId')
  const medicinesref = useRef(null)
  const medbyidref = useRef(null);
  const patientaddref = useRef(null)
  const stockref = useRef(null)
  const [searchinput, setsearchinput] = useState()
  const [searchlist, setsearchlist] = useState([])
  const [displaysearchlist, setdisplaysearchlist] = useState('none')
  const [patientid, setpatientid] = useState()
  const [patientdata, setpatientdata] = useState([])
  const [doctorid, setdoctorid] = useState()
  const [doctorname, setdoctorname] = useState()
  const [clinicid, setclinicid] = useState(clinicID)
  const [ischecked, setischecked] = useState()
  const [Dc, setDc] = useState(0)
  const [AtC, setAtC] = useState(0)
  const [load, setload] = useState()
  const [searchload, setsearchload] = useState(false)
  const [products, setproducts] = useState([])
  const [itemsearch, setitemsearch] = useState([''])
  const [itembyid, setitembyid] = useState([''])
  const [loadbyId, setloadbyId] = useState()
  const [itemname, setitemname] = useState()
  const [itemid, setitemid] = useState()
  const [SelectedProducts, setSelectedProducts] = useState([])
  const [Grandtotal, setGrandtotal] = useState()
  const [loadsearch, setloadsearch] = useState()
  const [addressid, setaddressid] = useState()
  const [addressform, setaddressform] = useState('none')

  const searchpatient = (e) => {
    setsearchload(true)
    setsearchinput(e.target.value)
    axios.get(`${url}/patient/list?search=${searchinput}&limit=5&offset=0`).then((response) => {
      setsearchlist(response.data.data)
      setsearchload(false)
    })
    if (searchinput && searchinput.length > 1) {
      setdisplaysearchlist('block');
    } else {
      setdisplaysearchlist('none');
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  const get_value = (id, name, data) => {
    setsearchinput(name)
    setpatientid(id)
    setpatientdata(data)
    setdisplaysearchlist('none');
  }
  const selectaddress = (data) => {
    if (data) {
      setaddressid(data.id)
      setDc(1)
    } else {
      setaddressid()
      setDc(0)
    }
  }
  const DC = () => {
    if (Dc == 0) {
      setaddressform('block')
    }
    if (Dc == 1) {
      if (addressid) {
        setDc(0)
        setaddressform('none')
      } else {
        setaddressform('block')
      }
    }
  }
  const searchmeds = async (search) => {
    setloadsearch(true)
    try {
      await axios.get(`${url}/stock/list?search=${search}`).then((response) => {
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

  const searchmedbyId = async (search) => {
    if (search.length > 0) {
      setloadbyId(true)
      try {
        await axios.get(`${url}/sale/item/search/by/id?item=${search}`).then((response) => {
          setloadbyId(false)
          setitembyid([response.data.data])
        })
      } catch (e) {
        setloadbyId(false)
        Notiflix.Notify.failure(e.message)
      }
    }

  }

  useEffect(() => {
    Doclist.map((data) => (
      data[0] == doctorid ? setdoctorname(data[1]) : ''
    ))
  }, [doctorid])

  function CalSellingCost(mrp, disc) {
    let cost = mrp
    if (!disc) {
      cost = Number(mrp)
      return cost
    } else {
      cost = Number(mrp) - ((Number(mrp) * Number(disc)) / 100)
      cost = cost.toFixed(2)
      return cost
    }
  }
  function CalTotalAmount(qty, cst) {
    let cost = cst
    if (!qty) {
      cost = Number(cst)
      return cost
    } else {
      cost = Number(cst) * Number(qty)
      cost = cost.toFixed(2)
      return cost
    }
  }
  function CalGrandttl() {
    let ttl = 0
    SelectedProducts.map((data) => (
      ttl += Number(data.totalamt)
    ))
    setGrandtotal(ttl)
  }
  function CaltotalDiscount(data) {
    let total = 0
    if (data) {
      data.forEach(item => {
        total += Number(item.discount)
      })
      return total
    } else {
      return total
    }

  }
  useEffect(() => {
    CalGrandttl()
  }, [SelectedProducts])
  function AddProducts(data) {
    console.log(data)
    let T = ''
    if (data.vaccine_brand_id) {
      T = 'v'
    } else {
      T = 'm'
    }
    let ProductDetails = {
      productid: data.id,
      type: data.type?data.type:T,
      product: data.item_name?data.item_name:itemname,
      batch: data.batch_no,
      expiry: data.expiry_date,
      quantity: data.current_stock,
      qtytoSale: 1,
      discount: 0,
      cost: data.cost,
      mainmrp: data.mrp,
      disccost: data.mrp,
      gst: Number(data.CGST_rate) + Number(data.SGST_rate) + Number(data.IGST_rate),
      totalamt: data.mrp

    }

    if (SelectedProducts && SelectedProducts.length == 0) {
      setSelectedProducts([ProductDetails])
    } else {
      setSelectedProducts(prevState => [...prevState, ProductDetails])
    }

  }

  async function DeleteProduct(Batch) {
    let obj = []
    obj.push(SelectedProducts.filter(function (e) {
      return e.batch !== Batch
    }))
    obj = obj.flat()
    setSelectedProducts(obj)
  }
  async function SubmitSaleEntry() {
    let productids = [];
    let proquantity = [];
    let Discount = [];
    let discountonmrp = [];
    let mrp = [];
    let GST = [];
    let Totalamount = []
    for (let i = 0; i < SelectedProducts.length; i++) {
      productids.push(SelectedProducts[i].type + SelectedProducts[i].productid)
      proquantity.push(SelectedProducts[i].qtytoSale)
      Discount.push(SelectedProducts[i].discount)
      discountonmrp.push(SelectedProducts[i].disccost)
      mrp.push(SelectedProducts[i].mainmrp)
      GST.push(SelectedProducts[i].gst)
      Totalamount.push(SelectedProducts[i].totalamt)
    }
    let Data = {
      clinic_id: clinicid,
      doctor_id: doctorid,
      doctor_name: doctorname,
      patient_id: patientid,
      pro_id: productids,
      qty: proquantity,
      discount: Discount,
      disc_mrp: discountonmrp,
      main_mrp: mrp,
      gst: GST,
      total_amount: Totalamount,
      grand_total: Grandtotal,
      appointment_id: '',
      add_to_cart: AtC,
      deliver: Dc,
      address_id: addressid,
    }
    try {
      await axios.post(`${url}/sale/entry/save`, Data).then((response) => {
        props.toggle_nsef()
        ClearForm()
        props.GETSalesList()
        Notiflix.Notify.success(response.data.message)
      }).catch(function error(e) {
        console.log(e)
        Notiflix.Notify.failure(e)
      })
    } catch (e) {
      Notiflix.Notify.failure(e)
    }
  }
  function confirmmessage() {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Sale Entry`,
      `Do you surely want to add total ${SelectedProducts.length} Sale ${SelectedProducts.length <= 1 ? 'entry' : 'entries'}  `,
      'Yes',
      'No',
      () => {
        SubmitSaleEntry()
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  function confirmmessage2() {
    customconfirm()
    Notiflix.Confirm.show(
      `Add to Cart`,
      `Do you surely want to add the following Sale entries to the Cart  `,
      'Yes',
      'No',
      () => {
        setAtC(1)
      },
      () => {
        setAtC(0)
      },
      {
      },
    );
  }
  const ClearForm = async () => {
    setSelectedProducts([])
    setaddressid()
    setitemname()
    setdoctorname()
    setdoctorid()
    setpatientid()
    setGrandtotal()
    setAtC()
    setDc(0)
    setsearchinput()
    setpatientdata()
  }
  // console.log(patientid, doctorid, doctorname, Dc, itemname, itemid)
  // console.log(SelectedProducts, Grandtotal)
  // console.log(patientdata)
  let c = 0
  console.log(products, addressid, Dc, SelectedProducts)
  console.log(itembyid)
  return (
    <>
      <div className="container-fluid p-0 m-0 p-2 rounded-4">
        <div className='position-relative mb-3'>
          <h5 className='text-center fw-bolder text-charcoal '>Sale Entry Form</h5>
          <button className='btn btn-close position-absolute end-0 top-0 me-2' onClick={props.toggle_nsef}></button>
        </div>
        <hr className='p-0 m-0' />
        <div className="p-0 m-0 text-center bg-seashell">

          {
            cliniclist.map((data, i) => (
              <label className={` text-burntumber fw-bolder d-${clinicID == data.id ? 'block' : 'none'}`}><input type="checkbox" className={`radio form me-1  text-burntumber fw-bolder`} key={i} checked={clinicID == data.id ? true : false} name={data.id} /> {data.title} {data.address}</label>
            ))
          }
        </div>
        <hr className='p-0 m-0' />
        <div className='my-2 text-center align-self-center'>
          <div className=" form-switch justify-content-center position-relative">
            <label className="form-check-label text-charcoal fw-bolder" for="flexSwitchCheckDefault">Deliver to Customer</label>
            <input className="form-check-input ms-2 outline-none text-center" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={Dc == 1 ? true : false} onChange={() => { DC() }} />
            <div className={`d-${addressform} position-absolute start-0 end-0 m-5 mt-0 top-0 bg-pearl shadow rounded-2 `} style={{ zIndex: 2 }} ref={patientaddref}>
              <div className='p-0 m-0 position-relative text-wrap'>
                <button className='btn btn-close position-absolute end-0 p-1 m-1' onClick={() => { addressid ? setaddressform('none') : setaddressform('none') }}></button>
                {
                  patientdata && patientdata.address && patientdata.address.length !== 0 ? (
                    <div className="row p-0 m-0 gx-2  ">
                      <h6 className='ms-1 text-burntumber fw-bold text-start'>Choose Address for Delivery</h6>
                      {
                        patientdata.address.map((data) => (
                          <div className={`col-12 px-1 m-2 text-start card bg-${addressid == data.id ? 'lightgreen' : 'lightyellow'} text-charcoal fw-bold`} onClick={() => { addressid ? selectaddress() : selectaddress(data) }}>
                            <div>Patient Name:- {data.full_name}</div>
                            <div>Address:-{data.address_line1 && data.address_line1 !== null ? data.address_line1 : ''}</div>
                            <div>{data.address_line2 && data.address_line2 !== null ? data.address_line2 : ''}</div>
                            <div>PinCode:-{data.zip_code && data.zip_code !== null ? data.zip_code : ''}</div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className='text-danger fw-bold'>Addresses not found.Update Patient Details to get Address </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <label className="m-0">Search Using Phone or Name</label>
            <input type="text" className="form-control bg-seashell selectpatient col-10 position-relative" placeholder='Search for Patients' value={searchinput ? searchinput : ''} onFocus={() => setsearchload(true)} onChange={searchpatient} />
            <div className={`col-auto d-${displaysearchlist} searchinput rounded-2 shadow bg-pearl px-2`} style={{ width: 'max-content' }}>
              {
                searchload == true || searchinput == undefined ? (
                  <p className="btn text-charcoal75 fs-6 p-0 m-0 ps-1">Loading... </p>
                ) : (
                  searchlist.length == 0 ? (
                    <p className="text-danger btn fs-6 p-0 m-0">Patient not found</p>
                  ) : (
                    searchlist.map((data) => (
                      <div className='col-auto p-0 m-0 ms-1 bg-pearl text-charcoal text-start' style={{ width: 'max-content' }} onClick={() => { get_value(data.id, data.full_name, data) }}>{data.full_name} {data.phone_number}</div>
                    )))

                )

              }
            </div>
          </div>
          <div className="col-4">
            <label>Select Doctor</label>
            <div className="col-12">
              <select className="col-10 form-control selectdoctor bg-seashell" placeholder='Select Doctor' value={doctorid ? doctorid : ''} onChange={(e) => { setdoctorid(e.target.value); }} >
                <option className='text-charcoal50'>Select Doctor</option>
                {
                  Doclist.map((data, i) => (
                    <option className={`text-charcoal`} key={i} value={data[0]}>{data[0]}.{' '}{'Dr.'}{' '}{data[1]}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="col-4">
            <label>Other Doctor</label>
            <div className="col-12">
              <input className='col-10 form-control bg-seashell' placeholder='Other Doctors' />
            </div>
          </div>

        </div>
        <div className="container-fluid mt-4 text-center p-0 m-0">
          <div className="col-12 p-0 m-0 justify-content-center">
            <h6 className='text-charcoal p-0 m-0 fw-bolder text-start'>Add Products</h6>
            <hr className='p-0 m-0' />
            {/* <div className="col-12">
              <button className='button button-seashell text-burntumber border-burntumber '>Scan to Add Product</button>
            </div>
            <h4 className='my-2'>OR</h4> */}
            <div className="row p-0 m-0 my-2 justify-content-center">


              <div className="col-4">
                <input className='form-control bg-seashell' placeholder='Search Product by Name'
                  value={itemname ? itemname : ''}
                  onChange={(e) => {
                    searchmeds(e.target.value);
                    setitemname(e.target.value);
                    setitemid();
                    setproducts();
                    stockref.current.style.display = 'none'
                  }} />
                <div ref={medicinesref} className='position-absolute rounded-2 mt-1' style={{ Width: 'max-content', zIndex: '1' }} >
                  {
                    itemsearch ? (
                      loadsearch ? (
                        <div className='rounded-2 p-1 bg-pearl'>
                          Searching Please wait....
                          <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                            <span className="sr-only"> </span> </div>
                        </div>
                      ) : (
                        itemsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                        ) : (
                          itemsearch.map((data, i) => (
                            <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`p-0 ps-1 shadow bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} fs-6 `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = 'block' }}>{data.display_name ? data.display_name : data.name}</div>
                          ))
                        )
                      )
                    ) : (<div className='bg-seashell'></div>)
                  }
                </div>
                <div ref={stockref} className="position-absolute scroll scroll-y p-2 " style={{ marginLeft: '13.5rem', marginTop: '2rem', zIndex: '2', 'width': '20rem', 'height': '30rem' }}>
                  {
                    products && products.length !== 0 ? (
                      products.stock_info.map((data, i) => (
                        <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} rounded-2 p-2 border border-bottom text-wrap`}
                          onClick={
                            () => {
                              AddProducts(data);
                              setitemname();
                              setitemid();
                              setproducts();
                              setitemsearch([''])
                            }}>
                          <p className='text-center m-0 p-0 fw-bold'>{itemname}</p>
                          <p className='p-0 m-0 '>BatchNo. {data.batch_no && data.batch_no !== null ? data.batch_no : ''}</p>
                          <p className='p-0 m-0 '>Stock {data.current_stock && data.current_stock ? data.current_stock : ''}</p>
                          <p className='p-0 m-0 '>Expiry {data.expiry_date ? reversefunction(data.expiry_date) : ''}</p>
                        </div>
                      ))
                    ) : (<div className='bg-seashell'></div>)

                  }
                </div>
                <div></div>
              </div>
              <div className='col-1 text-burntumber fw-bold align-self-center'>
                OR
              </div>
              <div className="col-4 ">
                <input className='form-control bg-seashell border border-1 rounded-2' value={itemid ? itemid : ''} placeholder='Search Product by ID' onChange={(e) => { searchmedbyId(e.target.value); setitemid(e.target.value) }} />
                <div ref={medbyidref} className='position-absolute rounded-2 mt-1' style={{ Width: 'max-content', zIndex: '2' }} >
                  {
                    itembyid ? (
                      loadbyId ? (
                        <div className='rounded-2 p-1 bg-pearl'>
                          Searching Please wait....
                          <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                            <span className="sr-only"> </span> </div>
                        </div>
                      ) : (
                        itembyid.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                        ) : (
                          itembyid.map((data, i) => (
                            <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`p-0 ps-1 shadow bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} fs-6 `}
                              onClick={(e) => {
                                setitemid(data.type + data.id);
                                AddProducts(data)
                                medbyidref.current.style.display = 'none';
                              }}>{data.item_name ? data.item_name : ''}</div>
                          ))
                        )
                      )
                    ) : (<div className='bg-seashell'></div>)
                  }
                </div>

              </div>
            </div>
          </div>
          <div className="col-12 m-0 p-0">
            <div className="d-flex p-0 m-0 justify-content-between">
              <h6 className='text-charcoal p-0 m-0 fw-bolder text-start'>Product Added</h6>

            </div>

            <hr className='p-0 m-0' />
            <div className='p-0 m-0 scroll scroll-y' style={{ height: '35vh' }}>
              <table className='table p-0 m-0'>
                <thead className='p-0 m-0'>
                  <tr className='p-0 m-0'>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Item ID</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Item Name</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>BatchNo.</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Expiry Date</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Avl.Stock</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Qty To Sale</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Discount %</th>
                    <th className='p-0 m-0 px-2' colSpan='4' scope='col-group'>Costing</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Total Amount</th>
                    <th className='p-0 m-0 px-2' rowSpan='2'>Delete</th>
                  </tr>
                  <tr className='p-0 m-0'>
                    <th className='p-0 m-0 px-2' scope='col'>MRP</th>
                    <th className='p-0 m-0 px-2' scope='col'>Cost</th>
                    <th className='p-0 m-0 px-2' scope='col'>GST Rate</th>
                    <th className='p-0 m-0 px-2' scope='col'>Selling Cost/Unit</th>
                  </tr>
                </thead>
                {
                  SelectedProducts && SelectedProducts.length !== 0 ? (
                    <tbody className='p-0 m-0'>
                      {
                        SelectedProducts.map((data) => (
                          <tr className='p-0 m-0 align-middle'>
                            <td>{data.type} {data.productid}</td>
                            <td>{data.product}</td>
                            <td>{data.batch}</td>
                            <td>{reversefunction(data.expiry)}</td>
                            <td>{data.quantity}</td>

                            <td><input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell'
                              value={data.qtytoSale ? data.qtytoSale : ''}
                              onChange={(e) => {
                                data.qtytoSale = e.target.value;
                                data.totalamt = CalTotalAmount(e.target.value, data.disccost)
                                setSelectedProducts(prevState => [...prevState])
                              }} /> </td>

                            <td className='text-center p-0 m-0' style={{ Width: '0rem' }}>
                              <input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell'
                                value={data.discount ? data.discount : ''}
                                onChange={(e) => {
                                  data.discount = e.target.value;
                                  data.disccost = CalSellingCost(data.mainmrp, e.target.value);
                                  data.totalamt = CalTotalAmount(data.qtytoSale, data.disccost)
                                  setSelectedProducts(prevState => [...prevState])
                                }} /> </td>
                            <td>{data.mainmrp}</td>
                            <td>{data.cost}</td>
                            <td>{data.gst + '%'}</td>
                            <td>{data.disccost}</td>
                            <td>{data.totalamt}</td>
                            <td><button className='btn p-0 m-0' onClick={() => { DeleteProduct(data.batch) }}><img src={process.env.PUBLIC_URL + 'images/delete.png'} style={{ width: '1.5rem' }} /></button></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  ) : (
                    <tbody className='p-0 m-0 position-relative'>
                      <tr className='p-0 m-0'>
                        <td className='p-0 m-0 position-absolute text-charcoal fw-bold start-0 end-0'>No Product Added</td>
                      </tr>
                    </tbody>
                  )
                }
              </table>
            </div>
          </div>

        </div>
        <div className='col-12 position-absolute start-0 end-0 bottom-0 text-center bg-pearl align-items-center rounded-bottom'>
          <div className="row p-0 m-0">
            <div className="col-6">
              <div className="row">
                <div className="col-3">
                  <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Order Total </p>
                  <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{Grandtotal}</h4>
                </div>
                <div className="col-3">
                  <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Discount %</p>
                  <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{CaltotalDiscount(SelectedProducts)}</h4>
                </div>
                <div className="col-3">
                  <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Total Items</p>
                  <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{SelectedProducts.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-3 align-self-center">
              <button className='button button-charcoal px-5' onClick={() => { confirmmessage() }}>Save Entry</button>
            </div>
            <div className="col-3 align-self-center">
              <button className='button button-pearl border-charcoal text-charcoal px-4' onClick={() => { confirmmessage2() }}>Add To Cart</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
function NewSaleReturnentryform(props) {
  const url = useContext(URL)
  const medicinesref = useRef(null)
  const vendorsref = useRef(null)
  const [billname, setbillname] = useState()
  const [billid, setbillid] = useState()
  const [loadbills, setloadbills] = useState()
  const [billsearch, setbillsearch] = useState([''])
  const [itemsearch, setitemsearch] = useState([''])
  const [itemname, setitemname] = useState('')
  const [loadsearch, setloadsearch] = useState()
  const [MedicineentriesArr, setMedicineentriesArr] = useState([])

  const CalculateCost = (cost, currentstock, qtytotreturn) => {
    let costing = 0;
    if (cost && qtytotreturn && currentstock >= qtytotreturn) {
      costing = 0
      costing = Number(cost) * Number(qtytotreturn)
      return costing.toFixed(2)
    } else {
      return costing
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  async function InsertMedicines(data) {
    let MedicineentriesObj = {
      Itemid: data.id,
      Type: data.type,
      Item: data.item_name,
      batchno: data.batch_no,
      expirydate: data.expiry_date,
      cost: data.sale_disc_mrp,
      totalcost: data.cost,
      saleqty: data.sale_qty,
      qtytoReturn: data.sale_qty,
    }

    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr([MedicineentriesObj])
      setitemname()
    } else {
      setMedicineentriesArr(prevState => [...prevState, MedicineentriesObj])
      setitemname()
    }
  }


  const searchProduct = async () => {
    setloadbills(true)
    try {
      await axios.get(`${url}/sale/return/item/search/by/id?item=${itemname}&bill_id=${billid}`).then((response) => {
        console.log(response)
        setbillsearch([response.data.data])

        setloadbills(false)
      }).catch(function (error) {
        if (error.response) {
          Notiflix.Notify.failure(error.response.data);
          Notiflix.Notify.failure(error.response.status);
          Notiflix.Notify.failure(error.response.headers);
        }
        setloadbills(false)
      })

    } catch (e) {
      Notiflix.Notify.failure(e);
      setloadbills(false)
    }
  }
  const SaveReturnEntry = async () => {
    let ProductId = []
    let Totalamount = []
    let quantity = []

    let grosstotal = 0
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      ProductId.push(MedicineentriesArr[i].Itemid ? `${MedicineentriesArr[i].Type}${MedicineentriesArr[i].Itemid}` : '')
      Totalamount.push(MedicineentriesArr[i].totalcost ? MedicineentriesArr[i].totalcost : '')
      quantity.push(MedicineentriesArr[i].qtytoReturn ? MedicineentriesArr[i].qtytoReturn : '')
    }

    Totalamount.forEach(item => {
      grosstotal += Number(item)
    })

    var Data = {
      bill_id: billid,
      pro_id: ProductId,
      qty: quantity,
      total_amount: Totalamount,
      grand_total: grosstotal
    }
    console.log(Data)

    try {
      await axios.post(`${url}/sale/return/save`, Data).then((response) => {
        Notiflix.Notify.success(response.data.message)
        props.GETSaleReturns()
        setMedicineentriesArr()
        setbillid()
        setbillname()
        props.toggle_nref()
      })
    } catch (e) {
      Notiflix.Notify.warning(e)
      console.log(e)
    }

  }

  function confirmmessage() {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Purchase Return `,
      `Do you surely want to add total ${MedicineentriesArr.length} Purchase ${MedicineentriesArr.length <= 1 ? 'Return ' : 'Returns'} of item ${itemname}  `,
      'Yes',
      'No',
      () => {
        SaveReturnEntry()
      },
      () => {
        return 0
      },
      {
      },
    );
  }

  async function DeleteMedicine(id) {
    let obj = []
    obj.push(MedicineentriesArr.filter(function (e) {
      return e.Itemid !== id
    }))
    obj = obj.flat()
    setMedicineentriesArr(obj)
  }
  function Grand() {
    let c = 0
    if (MedicineentriesArr && MedicineentriesArr.length > 0) {
      MedicineentriesArr.map((data) => (
        c += Number(data.totalcost)
      ))
    }
    return c
  }
  console.log(billid, itemname, billsearch)
  return (
    <section className="newpurchaseentryform mt-1 position-relative bg-seashell m-2 shadow rounded-4 " style={{ 'height': '90vh' }}>
      <div className="container-fluid p-0 m-0 rounded-4">
        <div className="container-fluid bg-seashell rounded-4 position-relative  ">
          <div className="row p-2 pe-1">
            <div className="col-1 position-absolute end-0">
              <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_nref} aria-label="Close" ></button>
            </div>
            <div className="col-12 justify-content-center">
              <h6 className="text-center" style={{ color: "var(--charcoal)", fontWeight: "600" }} >New Sale Return Entry</h6>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0 m-0 w-100 entrydetails bg-seashell">
          <div className="row p-0 m-0 justify-content-center">
            <div className="col-5">
              <h6 className="p-0 m-0 ms-3 fw-bold">Select Bill</h6>
              <input className="form-control ms-2 rounded-1 bg-seashell" placeholder='Bill Id' value={billid ? billid : ''} onChange={(e) => { setbillid(e.target.value); setMedicineentriesArr([]) }} />
            </div>
            <div className="col-5">
              <div className='position-relative'>
                <h6 className="p-0 m-0 ms-3 fw-bold">Product ID</h6>
                <input className='form-control bg-seashell' placeholder='Product Id' value={itemname ? itemname : ''}
                  onChange={(e) => {
                    billid ? setitemname(e.target.value) : Notiflix.Notify.failure('Please Add Bill id First')
                  }} />
                <div ref={medicinesref} className='position-absolute rounded-2 bg-pearl col-12' style={{ zIndex: '1' }}>
                  {
                    billsearch ? (
                      loadbills ? (
                        <div className='rounded-2 p-1'>
                          Searching Please wait....
                          <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                            <span className="sr-only"> </span> </div>
                        </div>
                      ) : (
                        billsearch.length == 0 ? (
                          <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                        ) : (
                          billsearch.map((data, i) => (
                            <div style={{ cursor: 'pointer' }} className={`p-0 ps-1 shadow bg-${((i % 2) == 0) ? 'pearl' : 'lightyellow'} fs-6 `} name={data.id}
                              onClick={(e) => {
                                setitemname(data.item_name);
                                InsertMedicines(data);
                                medicinesref.current.style.display = 'none';
                              }}>{data.item_name}</div>
                          ))
                        )
                      )
                    ) : (<div className='bg-seashell'></div>)
                  }
                </div>

              </div>

            </div>
            <div className="col-2 align-self-center ">
              <p></p>
              <button className='p-0 m-0 btn' onClick={searchProduct}><img src={process.env.PUBLIC_URL + 'images/search.png'} style={{ width: '1.8rem' }} /></button>
            </div>
          </div>
          <div className=" p-0 m-0 mt-2 scroll scroll-y" style={{ Height: '65vh' }}>
            <table className="table datatable text-center position-relative">
              <thead style={{ color: 'gray', fontWeight: '600' }}>
                <tr>
                  <th className='p-0 m-0 px-1'>Item ID</th>
                  <th className='p-0 m-0 px-1'>Item Name</th>
                  <th className='p-0 m-0 px-1'>batch No.</th>
                  <th className='p-0 m-0 px-1'>Expiry Date</th>
                  <th className='p-0 m-0 px-1'>Sale Qty</th>
                  <th className='p-0 m-0 px-1'>Qty to Return</th>
                  <th className='p-0 m-0 px-1'>Sale Rate/Unit</th>
                  <th className='p-0 m-0 px-1'>Sale Rate</th>
                  <th className='p-0 m-0 px-1'>Delete</th>
                </tr>
              </thead>
              {
                MedicineentriesArr ? (
                  <tbody style={{ maxHeight: '65vh', minHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                    {
                      MedicineentriesArr.map((item, _key) => (
                        <tr key={_key} className=''>
                          <td>{item.Type}{item.Itemid}</td>
                          <td>{item.Item}</td>
                          <td>{item.batchno}</td>
                          <td>{reversefunction(item.expirydate)}</td>
                          <td>{item.saleqty}</td>
                          <td className='p-0 m-0' style={{ 'width': '0px', 'height': '0px' }}>
                            <input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell  mt-2' value={item.qtytoReturn ? item.qtytoReturn : ''}
                              onChange={(e) => {
                                e.target.value <= item.saleqty ? item.qtytoReturn = e.target.value : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available")
                                item.totalcost = CalculateCost(item.cost, item.saleqty, e.target.value)
                                setMedicineentriesArr(prevState => [...prevState])
                              }} /></td>
                          <td>{item.cost}</td>
                          <td>{item.totalcost}</td>
                          <td ><button onClick={() => { DeleteMedicine(item.Itemid); }} className='btn btn-sm button-burntumber'>Delete</button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                ) : (
                  MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                    <tbody className="position-relative" style={{ height: '65vh', maxHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                      <tr >
                        <td className="position-absolute start-0 end-0 top-0">No items Added</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="position-relative" style={{ height: '65vh', maxHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
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
      </div>
      <div className='col-12 position-absolute start-0 end-0 bottom-0 text-center bg-pearl align-items-center rounded-bottom p-2'>
        <div className="row p-0 m-0">
          <div className="col-6">
            <div className="row">
              <div className="col-3">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Order Total </p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{Grand()}</h4>
              </div>
              <div className="col-3">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Total Items</p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{MedicineentriesArr ? MedicineentriesArr.length : 0}</h4>
              </div>
            </div>
          </div>
          <div className="col-3 align-self-center">
            <button className='button button-charcoal px-5' onClick={confirmmessage}>Save Entry</button>
          </div>
          <div className="col-3 align-self-center">
            <button className='button button-pearl border-charcoal text-charcoal px-4' >Add To Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
}
function SRitemdetailssection(props) {
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
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if (cgst && sgst && igst !== null || undefined) {
      let c = Number(cgst) + Number(sgst) + Number(igst)
      return c * Number(qty)
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }

  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <div className="row p-0 m-0 position-relative">

          <button type="button" className="btn-close closebtn m-auto position-absolute end-0 me-4" onClick={props.toggle_sridw} aria-label="Close"></button>

          <div className="col-12 mt-2">
            <h4 className='text-center' style={{ color: 'var(--charcoal)', fontWeight: '600' }}>{props.itembillid} Sale Return Item Details</h4>
          </div>
          <div className="col-2 d-none">
            <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
              <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
              <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className='row p-0 m-0'>
        {
          Items.map((data, i) => (
            <div className="col-3 col-xl-2 col-lg-2 col-md-4 col-sm-6 p-0 m-0">
              <button className={`button border button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>
            </div>
          ))
        }

      </div>

      <div className="row justify-content-end me-5">
        <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '82vh', maxHeight: '82vh' }}>
        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP in Rs.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Selling Cost</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Discount%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total in Rs.</th>
            {/* <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th> */}
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
            props.salereturnarr.sale_medicines && props.salereturnarr.sale_medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.salereturnarr.sale_medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine_stocks.batch_no && item.medicine_stocks.batch_no != null ? item.medicine_stocks.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine_stocks.expiry_date && item.medicine_stocks.expiry_date != null ? reversefunction(item.medicine_stocks.expiry_date) : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.main_mrp ? item.main_mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.disc_mrp ? item.disc_mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      {/* <td className='border p-0 m-0 align-middle'><button className='btn'><img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button></td> */}
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
            props.salereturnarr.purchase_vaccines && props.salereturnarr.purchase_vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.salereturnarr.purchase_vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.vaccine && item.vaccine.name !== null ? item.vaccine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : 'N/A'}</td>
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
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                  <strong className='fs-6 text-center'>No Vaccines Found</strong>
                </div>

              </body>
            )


          }
        </table>
      </div>
    </div>
  )
}
export { Salesection }

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
      return <PurchaseReturns />
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
      axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${i * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
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
        <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{ minHeight: '55vh', height: '55vh' }}>
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
                <body className=' text-center' style={{ minHeight: '55vh' }}>
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
                        <tr key={i} className={`bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} align-middle`}>
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
                  <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '55vh' }}>
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
      quantity.push(MedicineentriesArr[i].Qty ? MedicineentriesArr[i].Qty : '')
      freequantity.push(MedicineentriesArr[i].freeQty ? MedicineentriesArr[i].freeQty : '')
    }

    totalamount.forEach(item => {
      grosstotal += Number(item)
    })
    console.log(grosstotal, Type, MedId, medname, batches, expirydate, manufacturingDate, MRP, Rate, Discount, tradeDiscount, sgst, sgstpercent, cgst, cgstpercent, igst, igstpercent, costperunit, totalamount, quantity, freequantity)
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
function PurchaseReturns() {
  const currentDate = useContext(TodayDate)
  const ClinicID = localStorage.getItem('ClinicId')
  const url = useContext(URL)
  const [pridw, setpridw] = useState("none");
  const nextref = useRef()
  const previousref = useRef()
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [purchasereturnarr, setpurchasereturnarr] = useState([])
  const [index, setindex] = useState()
  const [nref, setnref] = useState("none");
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
      axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${i * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
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

  const toggle_pridw = () => {
    if (pridw === "none") {
      setpridw("block");
    }
    if (pridw === "block") {
      setpridw("none");
    }
  };
  const toggle_nref = () => {
    if (nref === "none") {
      setnref("block");

    }
    if (nref === "block") {
      setnref("none");
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
  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={toggle_nref}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Return</button>
      <div classsName='p-0 m-0'>
        <div className="row p-0 m-0">
          <div className="col-3 col-md-2 col-lg-2 align-self-center text-charcoal fw-bolder fs-6">Purchase Return </div>
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
          {/* <div className="col-2 align-self-center">
          <ExportPurchaseEntry purchasereturnarr={purchasereturnarr} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div> */}
        </div>
        <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{ minHeight: '55vh', height: '55vh' }}>
          <table className="table text-center p-0 m-0">
            <thead className='p-0 m-0 align-middle'>
              <tr>
                <th className='fw-bolder text-charcoal75' scope='col'>PR ID</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Distributor</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Return Date</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Return Amount</th>
                <th className='fw-bolder text-charcoal75' scope='col'>Inventory</th>
                <th className='fw-bolder text-charcoal75' scope='col'>more</th>
              </tr>
            </thead>
            {
              Loading ? (
                <body className=' text-center' style={{ minHeight: '55vh' }}>
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
                        <tr key={i} className={`bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} align-middle`}>
                          <td className='p-0 m-0 text-charcoal fw-bold'>PR-{item.return_no}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.return_date ? reversefunction(item.return_date) : ''}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>{item.grand_total ? item.grand_total : 'N/A'}</td>
                          <td className='p-0 m-0 text-charcoal fw-bold'>
                            {/* <button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button> */}
                            <buttton className="btn" onClick={() => { setindex(i); toggle_pridw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></buttton></td>
                          <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                          <td className={`PEdetailssection position-absolute mt-1 d-${i == index ? pridw : 'none'} bg-seashell p-0 m-0`} style={{ top: '-8.5rem' }} >
                            {
                              i == index ? (
                                <PRitemdetailssection purchasereturnarr={purchasereturnarr[i]} itembillid={"PR-" + item.return_no} toggle_pridw={toggle_pridw} />
                              ) : (<></>)
                            }
                          </td>

                        </tr>

                      ))

                    }

                  </tbody>
                ) : (
                  <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '55vh' }}>
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
            <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
              <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Previous</button>
            </div>
            <div className="col-auto col-xl-auto col-md-8 col-lg-8 col-sm-auto p-0 m-0">

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
            <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
              <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); console.log(e.target.value) }} style={{ marginTop: '0.15rem' }}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <section className={`newreturnentrysection position-absolute start-0 end-0 top-0 bottom-0 d-${nref}`} style={{ marginTop: '-8.5rem', 'height': '90vh' }}  >
        {<NewPurchaseReturnentryform toggle_nref={toggle_nref} GETPurchaseReturns={GETPurchaseReturns} />}
      </section>
    </>
  )
}
function PRitemdetailssection(props) {
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
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }

  console.log(props.purchasereturnarr)
  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <div className="row p-0 m-0">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_pridw} aria-label="Close"></button>
          </div>
          <div className="col-9">
            <h4 className='text-center' style={{ color: 'var(--charcoal)', fontWeight: '600' }}>{props.itembillid} Purchase Return Item Details</h4>
          </div>
          <div className="col-2 d-none">
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
            props.purchasereturnarr.purchase_medicines && props.purchasereturnarr.purchase_medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchasereturnarr.purchase_medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : 'N/A'}</td>
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
            props.purchasereturnarr.purchase_vaccines && props.purchasereturnarr.purchase_vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchasereturnarr.purchase_vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.vaccine && item.vaccine.name !== null ? item.vaccine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : 'N/A'}</td>
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
function NewPurchaseReturnentryform(props) {
  const url = useContext(URL)
  const ClinicId = localStorage.getItem('ClinicId')
  const ClinicList = useContext(Clinic)
  const medicinesref = useRef(null)
  const vendorsref = useRef(null)

  const [vendorname, setvendorname] = useState()
  const [vendorid, setvendorid] = useState()
  const [loadvendors, setloadvendors] = useState()
  const [vendorsearch, setvendorsearch] = useState([''])
  const [itemsearch, setitemsearch] = useState([''])
  const [itemname, setitemname] = useState()
  const [loadsearch, setloadsearch] = useState()
  const [MedicineentriesArr, setMedicineentriesArr] = useState([])

  const CalculateCost = (cost, currentstock, qtytotreturn) => {
    let costing = 0;
    if (cost && qtytotreturn && currentstock >= qtytotreturn) {
      costing = 0
      costing = Number(cost) * Number(qtytotreturn)
      return costing.toFixed(2)
    } else {
      return costing
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  async function InsertMedicines(data) {
    let MedicineentriesObj = {
      Itemid: data.id,
      Type: data.type,
      Item: data.item_name,
      batchno: data.batch_no,
      expirydate: data.expiry_date,
      cost: data.cost,
      totalcost: 0,
      currentstock: data.current_stock,
      qtytoReturn: 0,
    }

    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr([MedicineentriesObj])
    } else {
      setMedicineentriesArr(prevState => [...prevState, MedicineentriesObj])
    }
  }
  const searchmeds = async () => {
    setloadsearch(true)
    try {
      await axios.get(`${url}/purchase/item/search/by/id?item=${itemname}&distributor_id=${vendorid}`).then((response) => {
        console.log(response.data.data)
        setitemsearch([response.data.data])
        setloadsearch(false)
        if (itemname.length >= 1) {
          medicinesref.current.style.display = 'block';
        } else {
          medicinesref.current.style.display = 'none';
        }
      }).catch(function (error) {
        if (error.response) {
          Notiflix.Notify.failure(error.response.data);
          Notiflix.Notify.failure(error.response.status);
          Notiflix.Notify.failure(error.response.headers);
        }
      })

    } catch (e) {
      Notiflix.Notify.failure(e);
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
      }).catch(function (error) {
        if (error.response) {
          Notiflix.Notify.failure(error.response.data);
          Notiflix.Notify.failure(error.response.status);
          Notiflix.Notify.failure(error.response.headers);
        }
      })

    } catch (e) {
      Notiflix.Notify.failure(e);
    }
  }
  const SaveReturnEntry = async () => {
    let ProductId = []
    let Totalamount = []
    let quantity = []

    let grosstotal = 0
    for (let i = 0; i < MedicineentriesArr.length; i++) {
      ProductId.push(MedicineentriesArr[i].Itemid ? `${MedicineentriesArr[i].Type}${MedicineentriesArr[i].Itemid}` : '')
      Totalamount.push(MedicineentriesArr[i].totalcost ? MedicineentriesArr[i].totalcost : '')
      quantity.push(MedicineentriesArr[i].qtytoReturn ? MedicineentriesArr[i].qtytoReturn : '')
    }

    Totalamount.forEach(item => {
      grosstotal += Number(item)
    })

    var Data = {
      distributor_id: vendorid,
      pro_id: ProductId,
      qty: quantity,
      total_amount: Totalamount,
      grand_total: grosstotal
    }
    console.log(Data)

    try {
      await axios.post(`${url}/purchase/return/save`, Data).then((response) => {
        Notiflix.Notify.success(response.data.message)
        props.GETPurchaseReturns()
        setMedicineentriesArr()
        setvendorname()
        setvendorid()
        setitemname()
        props.toggle_nref()
      })
    } catch (e) {
      Notiflix.Notify.warning(e)
      console.log(e)
    }

  }

  function confirmmessage() {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Purchase Return `,
      `Do you surely want to add total ${MedicineentriesArr.length} Purchase ${MedicineentriesArr.length <= 1 ? 'Return ' : 'Returns'} of Distributor ${vendorname}  `,
      'Yes',
      'No',
      () => {
        SaveReturnEntry()
      },
      () => {
        return 0
      },
      {
      },
    );
  }

  async function DeleteMedicine(id) {
    let obj = []
    obj.push(MedicineentriesArr.filter(function (e) {
      return e.Itemid !== id
    }))
    obj = obj.flat()
    setMedicineentriesArr(obj)
  }
  function Grand() {
    let c = 0
    if (MedicineentriesArr && MedicineentriesArr.length > 0) {
      MedicineentriesArr.map((data) => (
        c += Number(data.totalcost)
      ))
    }
    return c
  }
  return (
    <section className="newpurchaseentryform mt-1 position-relative bg-seashell m-2 shadow rounded-4 " style={{ 'height': '90vh' }}>
      <div className="container-fluid p-0 m-0 rounded-4">
        <div className="container-fluid bg-seashell rounded-4 position-relative  ">
          <div className="row p-2 pe-1">
            <div className="col-1 position-absolute end-0">
              <button type="button" className="btn-close closebtn m-auto" onClick={props.toggle_nref} aria-label="Close" ></button>
            </div>
            <div className="col-12 justify-content-center">
              <h6 className="text-center" style={{ color: "var(--charcoal)", fontWeight: "600" }} >New Purchase Return Entry</h6>
            </div>
          </div>
        </div>
        <div className="container-fluid p-0 m-0 w-100 entrydetails bg-seashell">
          <div className="row p-0 m-0 justify-content-center">
            <div className="col-5">
              <h6 className="p-0 m-0 ms-3 fw-bold">Select Distributor</h6>
              <input className="form-control ms-2 rounded-1 bg-seashell" placeholder='Search Vendors' value={vendorname ? vendorname : ''} onChange={(e) => { searchvendors(e.target.value); setvendorname(e.target.value); setvendorid(); setMedicineentriesArr([]) }} />
              <div ref={vendorsref} className='position-absolute ms-2 rounded-2 bg-pearl col-2' style={{ display: 'none', zIndex: '1' }} >
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
                          <div style={{ cursor: 'pointer' }} className={`p-0 p-1  bg-${((i % 2) == 0) ? 'pearl' : 'lightblue'} fs-6 `} name={data.id} onClick={(e) => { setvendorname(data.entity_name); setvendorid(data.id); vendorsref.current.style.display = 'none'; }}>{data.entity_name}</div>
                        ))
                      )
                    )
                  ) : (<div className='bg-seashell'></div>)
                }
              </div>
            </div>
            <div className="col-5">
              <div className='position-relative'>
                <h6 className="p-0 m-0 ms-3 fw-bold">Product ID</h6>
                <input className='form-control bg-seashell' placeholder='Product Id' value={itemname ? itemname : ''}
                  onChange={(e) => {
                    vendorid ? setitemname(e.target.value) : Notiflix.Notify.failure('Please Add Vendor First')
                  }} />
                <div ref={medicinesref} className='position-absolute rounded-2 bg-pearl col-12' style={{ zIndex: '1' }}>
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
                            <div style={{ cursor: 'pointer' }} className={`p-0 ps-1 shadow bg-${((i % 2) == 0) ? 'pearl' : 'lightyellow'} fs-6 `} name={data.id}
                              onClick={(e) => {
                                setitemname(data.item_name);
                                InsertMedicines(data);
                                medicinesref.current.style.display = 'none';
                              }}>{data.item_name}</div>
                          ))
                        )
                      )
                    ) : (<div className='bg-seashell'></div>)
                  }
                </div>

              </div>

            </div>
            <div className="col-2 align-self-center ">
              <p></p>
              <button className='p-0 m-0 btn' onClick={searchmeds}><img src={process.env.PUBLIC_URL + 'images/search.png'} style={{ width: '1.8rem' }} /></button>
            </div>
          </div>
          <div className=" p-0 m-0 mt-2 scroll scroll-y" style={{ Height: '65vh' }}>
            <table className="table datatable text-center position-relative">
              <thead style={{ color: 'gray', fontWeight: '600' }}>
                <tr>

                  <th className='p-0 m-0 px-1'>Item ID</th>
                  <th className='p-0 m-0 px-1'>Item Name</th>
                  <th className='p-0 m-0 px-1'>batch No.</th>
                  <th className='p-0 m-0 px-1'>Expiry Date</th>
                  <th className='p-0 m-0 px-1'>Avl. Stock</th>
                  <th className='p-0 m-0 px-1'>Qty to Return</th>
                  <th className='p-0 m-0 px-1'>Purchase Rate/Unit</th>
                  <th className='p-0 m-0 px-1'>Purchase Rate</th>
                  <th className='p-0 m-0 px-1'>Delete</th>
                </tr>
              </thead>
              {
                MedicineentriesArr ? (
                  <tbody style={{ maxHeight: '65vh', minHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                    {
                      MedicineentriesArr.map((item, _key) => (
                        <tr key={_key} className=''>
                          <td>{item.Itemid}</td>
                          <td>{item.Item}</td>
                          <td>{item.batchno}</td>
                          <td>{reversefunction(item.expirydate)}</td>
                          <td>{item.currentstock}</td>
                          <td className='p-0 m-0' style={{ 'width': '0px', 'height': '0px' }}>
                            <input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell  mt-2' value={item.qtytoReturn ? item.qtytoReturn : ''}
                              onChange={(e) => {
                                e.target.value <= item.currentstock ? item.qtytoReturn = e.target.value : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available")
                                item.totalcost = CalculateCost(item.cost, item.currentstock, e.target.value)
                                setMedicineentriesArr(prevState => [...prevState])
                              }} /></td>
                          <td>{item.cost}</td>
                          <td>{item.totalcost}</td>
                          <td ><button onClick={() => { DeleteMedicine(item.Itemid); }} className='btn btn-sm button-burntumber'>Delete</button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                ) : (
                  MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                    <tbody className="position-relative" style={{ height: '65vh', maxHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                      <tr >
                        <td className="position-absolute start-0 end-0 top-0">No items Added</td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="position-relative" style={{ height: '65vh', maxHeight: '65vh', color: 'var(--charcoal)', fontWeight: '600' }}>
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
      </div>
      <div className='col-12 position-absolute start-0 end-0 bottom-0 text-center bg-pearl align-items-center rounded-bottom p-2'>
        <div className="row p-0 m-0">
          <div className="col-6">
            <div className="row">
              <div className="col-3">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Order Total </p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{Grand()}</h4>
              </div>
              <div className="col-3">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Total Items</p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{MedicineentriesArr ? MedicineentriesArr.length : 0}</h4>
              </div>
            </div>
          </div>
          <div className="col-3 align-self-center">
            <button className='button button-charcoal px-5' onClick={confirmmessage}>Save Entry</button>
          </div>
          <div className="col-3 align-self-center">
            <button className='button button-pearl border-charcoal text-charcoal px-4' >Add To Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
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
  const url = useContext(URL)
  const nextref = useRef()
  const previousref = useRef()
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [vaccineslist, setvaccineslist] = useState([])
  const [load, setload] = useState()
  const [searchname, setsearchname] = useState('')
  const [index, setindex] = useState()
  const [detailsform, setdetailsform] = useState('none')

  const GetVaccines = async (i) => {
    if (i == undefined) {
      i = 0
    }
    setload(true)
    if (i == 0 || i == undefined || nxtoffset == 0) {
      previousref.current.disabled = true
    } else {
      previousref.current.disabled = false
    }
    try {
      axios.get(`${url}/stock/list?search=${searchname}&limit=20&offset=${i * 10}`).then((response) => {
        console.log(response.data.data.vaccines)
        setvaccineslist(response.data.data.vaccines)
        let nxt = Number(i) + 1
        setnxtoffset(nxt)
        if (i != 0) {
          let prev = i--
          setprevoffset(prev)
        }
        setload(false)
      }).catch(function error(e) {
        Notiflix.Notify.failure(e.message)
        // setload(false)
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      // setload(false)
    }
  }
  useEffect(() => {
    GetVaccines()
  }, [searchname])
  async function getnextpages(e) {
    GetVaccines(e.target.value)
  }
  async function getpreviouspages(e) {
    GetVaccines(e.target.value - 1)
  }

  const CalculateBStock = (data) => {
    let total = 0
    data.map((item) => (
      total += Number(item.current_stock)
    ))
    return total
  }
  const CalculateTStock = (data) => {
    let total = 0
    data.map((item) => (
      total += Number(item.qty)
    ))
    return total
  }
  const GetStatus = (data) => {
    let currentstock = 0
    data.stock_info.map((item) => (
      currentstock += Number(item.current_stock)
    ))
    if (currentstock <= data.alert_stock_count) {
      return 1
    } else {
      return 0
    }
  }
  let c = 0
  const toggle_detailsform = () => {
    if (detailsform == 'none') {
      setdetailsform('block')
    }
    if (detailsform === 'block') {
      setdetailsform('none')
      setindex()
    }
  }
  return (
    <div className='p-0 m-0 vaccinestockinfo'>
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className='position-absolute searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Vaccine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <h3 className='ps-3'>Vaccine Stock Info</h3>
      <div className='scroll scroll-y' style={{ 'height': '52vh', minHeight: '52vh', maxHeight: '52vh' }}>
        <table className="table datatable text-center" >
          <thead>
            <tr>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>ID</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Vaccine Name</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>B.Stock</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>T.Stock</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Status</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'></th>
            </tr>
          </thead>
          {
            load ? (
              <tr className='p-0 m-0'>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>

              </tr>
            ) : (
              vaccineslist == undefined || vaccineslist.length == 0 ? (
                <tbody className='' >
                  <tr>
                    <td className='position-absolute text-charcoal fw-bolder start-0 end-0'>No Vaccines Found</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className=''>
                  {
                    vaccineslist.map((data, i) => (
                      <tr className={`align-middle text-center`}>
                        <td className=' text-charcoal fw-bold'>{data.id}</td>
                        <td className=' text-charcoal fw-bold'>{data.name && data.name !== null ? data.name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{CalculateBStock(data.stock_info)}</td>
                        <td className=' text-charcoal fw-bold'>{CalculateTStock(data.stock_info)}</td>
                        <td className=' text-charcoal fw-bold'>{
                          GetStatus(data) == 1 ? (
                            <img src={process.env.PUBLIC_URL + 'images/exclamation.png'} style={{ 'width': '1.5rem' }} />
                          ) : (<></>)
                        }</td>
                        <td className='p-0 m-0 text-charcoal fw-bold align-items-center '>
                          <div className='vr rounded-2 align-self-center' style={{ padding: '0.8px' }}></div>
                        </td>
                        <td className={` bg-${index == i ? 'lightred' : ''} p-0 m-0 text-charcoal fw-bold`}>
                          <button className='btn p-0 m-0' onClick={() => { setindex(i); toggle_detailsform() }}>
                            <img src={process.env.PUBLIC_URL + 'images/archivebox.png'} style={{ 'width': '1.5rem' }} />
                          </button>
                        </td>
                        {
                          index == i ? (
                            <td className={`stockdetailsfrom bg-white border border-1 col-lg-10 rounded-4 shadow p-0 col-md-10 col-sm-10 col-10 col-xl-6 d-${index == i ? detailsform : 'none'} position-absolute start-0 end-0 top-0`}>
                              <VaccinesectionItemDetails toggle_detailsform={toggle_detailsform} name={vaccineslist[i].name} data={vaccineslist[i].stock_info} />
                            </td>
                          ) : (<></>)
                        }
                      </tr>

                    ))
                  }

                </tbody>
              )

            )
          }
        </table>
      </div>
      <div className="container-fluid mb-1">
        <div className="row p-0 m-0 text-center">
          <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-auto col-xl-auto col-md-8 col-lg-8 col-sm-auto p-0 m-0">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { GetVaccines(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
function Stockmedicinesection() {
  const url = useContext(URL)
  const nextref = useRef()
  const previousref = useRef()
  const [nxtoffset, setnxtoffset] = useState(0)
  const [prevoffset, setprevoffset] = useState(0)
  const [pages, setpages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const [vaccineslist, setvaccineslist] = useState([])
  const [load, setload] = useState()
  const [searchname, setsearchname] = useState('')
  const [index, setindex] = useState()
  const [detailsform, setdetailsform] = useState('none')

  const GetVaccines = async (i) => {
    if (i == undefined) {
      i = 0
    }
    setload(true)
    if (i == 0 || i == undefined || nxtoffset == 0) {
      previousref.current.disabled = true
    } else {
      previousref.current.disabled = false
    }
    try {
      axios.get(`${url}/stock/list?search=${searchname}&limit=20&offset=${i * 10}`).then((response) => {
        console.log(response.data.data.medicines)
        setvaccineslist(response.data.data.medicines)
        let nxt = Number(i) + 1
        setnxtoffset(nxt)
        if (i != 0) {
          let prev = i--
          setprevoffset(prev)
        }
        setload(false)
      }).catch(function error(e) {
        Notiflix.Notify.failure(e.message)
        // setload(false)
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      // setload(false)
    }
  }
  useEffect(() => {
    GetVaccines()
  }, [searchname])
  async function getnextpages(e) {
    GetVaccines(e.target.value)
  }
  async function getpreviouspages(e) {
    GetVaccines(e.target.value - 1)
  }

  const CalculateBStock = (data) => {
    let total = 0
    data.map((item) => (
      total += Number(item.current_stock)
    ))
    return total
  }
  const CalculateTStock = (data) => {
    let total = 0
    data.map((item) => (
      total += Number(item.qty)
    ))
    return total
  }
  const GetStatus = (data) => {
    let currentstock = 0
    data.stock_info.map((item) => (
      currentstock += Number(item.current_stock)
    ))
    if (currentstock <= data.alert_stock_count) {
      return 1
    } else {
      return 0
    }
  }
  let c = 0
  const toggle_detailsform = () => {
    if (detailsform == 'none') {
      setdetailsform('block')
    }
    if (detailsform === 'block') {
      setdetailsform('none')
      setindex()
    }
  }
  return (
    <div className='p-0 m-0 vaccinestockinfo'>
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className='position-absolute searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Medicine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <h3 className='ps-3'>Vaccine Stock Info</h3>
      <div className='scroll scroll-y' style={{ 'height': '52vh', minHeight: '52vh', maxHeight: '52vh' }}>
        <table className="table datatable text-center" >
          <thead>
            <tr>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>ID</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Medicine Name</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>B.Stock</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>T.Stock</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Status</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'></th>
            </tr>
          </thead>
          {
            load ? (
              <tr className='p-0 m-0'>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>

              </tr>
            ) : (
              vaccineslist == undefined || vaccineslist.length == 0 ? (
                <tbody className='' >
                  <tr>
                    <td className='position-absolute text-charcoal fw-bolder start-0 end-0'>No Vaccines Found</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className=''>
                  {
                    vaccineslist.map((data, i) => (
                      <tr className={`align-middle text-center`}>
                        <td className=' text-charcoal fw-bold'>{data.id}</td>
                        <td className=' text-charcoal fw-bold'>{data.name && data.name !== null ? data.name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{CalculateBStock(data.stock_info)}</td>
                        <td className=' text-charcoal fw-bold'>{CalculateTStock(data.stock_info)}</td>
                        <td className=' text-charcoal fw-bold'>{
                          GetStatus(data) == 1 ? (
                            <img src={process.env.PUBLIC_URL + 'images/exclamation.png'} style={{ 'width': '1.5rem' }} />
                          ) : (<></>)
                        }</td>
                        <td className='p-0 m-0 text-charcoal fw-bold align-items-center '>
                          <div className='vr rounded-2 align-self-center' style={{ padding: '0.8px' }}></div>
                        </td>
                        <td className={` bg-${index == i ? 'lightred' : ''} p-0 m-0 text-charcoal fw-bold`}>
                          <button className='btn p-0 m-0' onClick={() => { setindex(i); toggle_detailsform() }}>
                            <img src={process.env.PUBLIC_URL + 'images/archivebox.png'} style={{ 'width': '1.5rem' }} />
                          </button>
                        </td>
                        {
                          index == i ? (
                            <td className={`stockdetailsfrom bg-white border border-1 col-lg-10 rounded-4 shadow p-0 col-md-10 col-sm-10 col-10 col-xl-6 d-${index == i ? detailsform : 'none'} position-absolute start-0 end-0 top-0`}>
                              <MedicinesectionItemDetails toggle_detailsform={toggle_detailsform} name={vaccineslist[i].name} data={vaccineslist[i].stock_info} />
                            </td>
                          ) : (<></>)
                        }
                      </tr>

                    ))
                  }

                </tbody>
              )

            )
          }
        </table>
      </div>
      <div className="container-fluid mb-1">
        <div className="row p-0 m-0 text-center">
          <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
            <button className="button ms-1 button-seashell" ref={previousref} value={prevoffset} onClick={(e) => { getpreviouspages(e); }} style={{ marginTop: '0.15rem' }}>Previous</button>
          </div>
          <div className="col-auto col-xl-auto col-md-8 col-lg-8 col-sm-auto p-0 m-0">

            {
              pages ? (
                pages.map((page, i) => (
                  <button className={`button ms-2 button-${nxtoffset - 1 == i ? 'pearl' : 'burntumber'} border  shadow-${nxtoffset - 1 == i ? 'lg' : 'none'}`} ref={nextref} value={page} id={page} onClick={(e) => { GetVaccines(i) }} key={i}>{page}</button>
                ))
              ) : (
                <div>Loading...</div>
              )

            }
          </div>
          <div className="col-3 col-xl-4 col-md-2 col-lg-2 col-sm-4 p-0 m-0">
            <button className={`button button-burntumber`} ref={nextref} value={nxtoffset} onClick={(e) => { getnextpages(e); }} style={{ marginTop: '0.15rem' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
function VaccinesectionItemDetails(props) {
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }
  return (
    <div className=' p-0 m-0 position-relative bg-pearl rounded-4'>
      <h6 className='text-center text-charcoal fw-bold pt-2'>{props.name}</h6>
      <hr className='p-0 m-0' />
      <button className='btn-close position-absolute end-0 top-0 p-1 m-1' onClick={props.toggle_detailsform}></button>
      <div className='p-0 m-0 scroll'>
        <table className='table text-center scroll'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Channel</th>
              <th>Batch No.</th>
              <th>Manuf. Date</th>
              <th>Expiry Date</th>
              <th>Avl Stock</th>
              <th>MRP in Rs.</th>
              <th>Cost in Rs.</th>

            </tr>
          </thead>
          <tbody>
            {
              props.data.map((Data) => (
                <tr className='p-0 m-0 px-1'>
                  <td className='p-0 m-0 px-1'>{Data.id ? 'v' + Data.id : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.channel == 1 ? 'Pharmacy' : 'Clinic'}</td>
                  <td className='p-0 m-0 px-1'>{Data.batch_no ? Data.batch_no : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.mfd_date ? reversefunction(Data.mfd_date) : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.expiry_date ? reversefunction(Data.expiry_date) : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.current_stock ? Data.current_stock : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.mrp ? Data.mrp : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.cost ? Data.cost : ''}</td>
                </tr>
              ))
            }


          </tbody>
        </table>
      </div>
    </div>

  )
}
function MedicinesectionItemDetails(props) {
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }
  }
  return (
    <div className=' p-0 m-0 position-relative bg-pearl rounded-4'>
      <h6 className='text-center text-charcoal fw-bold pt-2'>{props.name}</h6>
      <hr className='p-0 m-0' />
      <button className='btn-close position-absolute end-0 top-0 p-1 m-1' onClick={props.toggle_detailsform}></button>
      <div className='p-0 m-0 scroll'>
        <table className='table text-center scroll'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Channel</th>
              <th>Batch No.</th>
              <th>Manuf. Date</th>
              <th>Expiry Date</th>
              <th>Avl Stock</th>
              <th>MRP in Rs.</th>
              <th>Cost in Rs.</th>

            </tr>
          </thead>
          <tbody>
            {
              props.data.map((Data) => (
                <tr className='p-0 m-0 px-1'>
                  <td className='p-0 m-0 px-1'>{Data.id ? 'm' + Data.id : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.channel == 1 ? 'Pharmacy' : 'Clinic'}</td>
                  <td className='p-0 m-0 px-1'>{Data.batch_no ? Data.batch_no : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.mfd_date ? reversefunction(Data.mfd_date) : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.expiry_date ? reversefunction(Data.expiry_date) : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.current_stock ? Data.current_stock : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.mrp ? Data.mrp : ''}</td>
                  <td className='p-0 m-0 px-1'>{Data.cost ? Data.cost : ''}</td>
                </tr>
              ))
            }


          </tbody>
        </table>
      </div>
    </div>

  )
}
export { Stocksection };




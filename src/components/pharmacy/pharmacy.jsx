import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from '../../index';
import { ExportPurchaseEntry, ExportPurchaseReturn, ExportSaleEntry, ExportSaleReturn } from '../pharmacy/Exports'
import { QRcode } from '../features/qrcode';
import Notiflix from 'notiflix';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { customconfirm } from '../features/notiflix/customconfirm';
import '../../css/bootstrap.css';
import '../../css/dashboard.css'
import '../../css/pharmacy.css';
import { Purchaseorderarray, Pharmacystocktable, POitemdetailsarray } from './apiarrays';
import { NewMedicine } from './NewMedicine';
import { UpdateMedicine } from './UpdateMedicine';

//-------------------------------------------------Sales------------------------------------------------------------------------------------------
function Salesection(props) {
  const permission = useContext(Permissions)
  const first = [
    {
      option: "Sale Entry",
      display: permission.sale_entry_view ? 1 : 0
    },
    {
      option: "Sale Returns",
      display: permission.sale_return_view ? 1 : 0
    }
  ];
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

      <section className='salesection pt-1'>
        <div className="container-fluid p-0 m-0">
          <div className="row gx-3 p-0 m-0">
            <div className="col-10">
              <div className='row'>
                {
                  first.map((e, i) => {
                    return (
                      <div className={`col-auto salebuttons d-${e.display == 1 ? '' : 'none'}`}>
                        <button className={`btn btn-sm px-4 rounded-5 text-${i === second ? "light" : "dark"} bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} >{e.option}</button>
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
        <div className='container-fluid p-0 m-0 pt-3'>
          <div className="">
            {_selectedScreen(second)}
          </div>
        </div>
      </section>
    </>
  )
}
function Saleentrysection(props) {
  const permission = useContext(Permissions)
  const currentDate = useContext(TodayDate)
  const ClinicID = localStorage.getItem('ClinicId')
  const adminid = localStorage.getItem('id')
  const url = useContext(URL)
  const [seidw, setseidw] = useState("none");
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [saleentryarr, setsaleentryarr] = useState([])
  const [saleentryarrforExcel, setsaleentryarrforExcel] = useState([])
  const [index, setindex] = useState()
  const [nsef, setnsef] = useState("none");
  const [pages, setpages] = useState([])
  const [paymentsapage, setpaymentsapage] = useState('none')
  const [tabindex, settabindex] = useState()
  const [pagecount, setpagecount] = useState()

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
      setindex()
    }
  };
  const toggle_payments = () => {
    if (paymentsapage === 'none') {
      setpaymentsapage('block')
    }
    if (paymentsapage === 'block') {
      setpaymentsapage('none')
      settabindex()
    }

  }
  function GetPages() {
    try {
      axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 25) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }
  function GETSalesList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true)
      try {
        axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          console.log(response)
          setsaleentryarr(response.data.data.sale_entry)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          console.log(response)
          setsaleentryarr(response.data.data.sale_entry)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      }
    }

  }
  function GETSalesListForExcel() {

    try {
      axios.get(`${url}/sale/entry?clinic_id=${ClinicID}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        console.log(response)
        setsaleentryarrforExcel(response.data.data.sale_entry)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    GetPages()
  }, [channel, fromdate, todate])

  useEffect(() => {
    GETSalesList()
    GETSalesListForExcel()
  }, [pagecount])

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  let array = [[1, 'Confirmed', 'lightgreen'], [2, 'Payment done', 'success'], [3, 'Completed', 'lightyellow'], [4, 'Cancelled', 'lightred']]
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
  //Status
  const UpdateStatus = async (e, id) => {
    console.log(e.target.value, id)
    try {
      await axios.post(`${url}/sale/entry/change/status`, {
        sale_entry_id: id,
        status: e.target.value,
        admin_id: adminid,
      }).then((response) => {
        console.log(response)
        Notiflix.Notify.success(response.data.message)
        GETSalesList()
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
    }

  }
  const Generate_Bill = async (id) => {
    Notiflix.Loading.circle('Generating Bill', {
      backgroundColor: 'rgb(242, 242, 242,0.5)',
      svgColor: '#96351E',
      messageColor: '#96351E',
      messageFontSize: '1.5rem'
    })
    try {
      axios.post(`${url}/sale/entry/bill`, {
        sale_entry_id: id,
        admin_id: adminid
      }).then((response) => {
        console.log(response)
        Notiflix.Notify.success(response.data.message)
        window.open(response.data.data.bill_url, '_blank', 'noreferrer');
        Notiflix.Loading.remove()
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
      Notiflix.Loading.remove()
    }
  }
  const Send_On_WhatsApp = async (id, phone) => {
    if (phone == undefined || phone == null) {
      Notiflix.Notify.failure('Please Add a Phone Number to send the message on WhatsApp')
    } else {
      Notiflix.Loading.circle('Sending Bill on Whats App', {
        backgroundColor: 'rgb(242, 242, 242,0.5)',
        svgColor: '#96351E',
        messageColor: '#96351E',
        messageFontSize: '1.5rem'
      })
      try {
        axios.post(`${url}/sale/entry/send/bill/whatsapp`, {
          sale_entry_id: id,
          admin_id: adminid
        }).then((response) => {
          console.log(response)
          Notiflix.Notify.success(response.data.message)
          Notiflix.Loading.remove()
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        Notiflix.Loading.remove()
      }
    }

  }
  console.log(saleentryarr, pages)
  return (
    <>
      <button className={`button addentrypurchase button-charcoal position-absolute d-${permission.sale_entry_add == 1 ? '' : 'none'}`} onClick={toggle_nsef}>
        <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Sale</button>
      <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
        <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
          <button type='button' className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: 'fit-content' }}>{pagecount}  {pagecount > 0 ? 'Sale Entries' : 'Sale Entry'} </button>
        </div>
        <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0">
          <div className="row p-0 m-0 border-burntumber fw-bolder rounded-2">
            {/* <div className="col-4 bg-pearl rounded-2">
              <select className='p-0 m-0 bg-pearl border-0 text-burntumber fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div> */}
            <div className="col-6 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-2 ">
              <input type='date' placeholder='fromdate' className='p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder ' value={fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-6 p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-2">
              <input type='date' className=' p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder' value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 p-0 m-0 export col-md-2 col-lg-2 align-self-center text-center ">
          <ExportSaleEntry saleentryarr={saleentryarrforExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div className='scroll scroll-y p-0 m-0 mt-2' style={{ minHeight: '40vh', height: '58vh', maxHeight: '70vh' }}>
        <table className="table text-start table-responsive p-0 m-0">
          <thead className=' p-0 m-0 position-sticky top-0 bg-pearl'>
            <tr className=' p-0 m-0'>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Bill ID</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Patient Name</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Bill Date</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Bill Total</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Appointment Date</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Doctor Name</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1'>Invoice No.</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1 text-center'>Status</th>
              <th className='text-charcoal75 fw-bolder p-0 m-0 px-1 text-center'>Actions</th>
              {/* <th className='text-charcoal75 fw-bolder p-0 m-0 px-1' rowspan='2'>more</th> */}
            </tr>
          </thead>
          {
            Loading ? (
              <tbody className='text-center' style={{ minHeight: '55vh', height: '55vh' }}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center spinner">
                    <strong className='' style={{ fontSize: '1rem' }}>Getting Details please be Patient ...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>
              </tbody>

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
                        <td className="text-charcoal fw-bold p-0 m-0 px-1 text-center">
                          <select disabled={item.sale_entry_status == 4 ? true : false} className={` fw-bolder border-0 bg-${((i % 2) == 0) ? 'seashell' : 'pearl'} text-center rounded-pill  bg-${status_color(item.sale_entry_status)}`} name={item.id} onChange={(e) => { UpdateStatus(e, item.id) }} style={{ appearance: 'none' }}>
                            <option className="button" selected disabled>{status(item.sale_entry_status)}</option>
                            <option key={0} className="text-lightred bg-pearl" value='1'>Confirmed</option>
                            <option key={1} className="text-lightblue  bg-pearl" value='2'>Payment Done</option>
                            <option key={2} className="text-lightred  bg-pearl" value='3'>Completed</option>
                            <option key={3} className="text-charcoal  bg-pearl" value='4'>Cancelled</option>
                          </select>
                        </td>

                        <td className={`text-charcoal text-center bg-transparent fw-bold p-0 m-0 px-1 `}>
                          <div className={`dropdown  bg-${tabindex == i ? 'lightred' : ''} text-center text-decoration-none`}>
                            <button className="btn p-0 m-0 px-1 py-1 text-decoration-none dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" style={{ width: "1.5rem" }} />
                            </button>
                            <ul className="dropdown-menu  text-start" >
                              <li className={`text-start border-bottom `}><button className={`btn`} onClick={() => { settabindex(i); toggle_payments() }}>
                                <img src={process.env.PUBLIC_URL + "/images/rupee.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" />Payments
                              </button></li>
                              <li className=" text-start border-bottom">
                                <button className="btn" onClick={() => { setindex(i); toggle_seidw() }}>
                                  <img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /> Inventory
                                </button></li>
                              <li className="text-start border-bottom"><button className="btn" onClick={() => { Generate_Bill(item.id) }}><img src={process.env.PUBLIC_URL + "/images/pdf.png"} alt="displaying_image" style={{ width: "2rem" }} /> Generate Bill</button>
                              </li>
                              <li className="text-start"><button className="btn" onClick={() => { Send_On_WhatsApp(item.id, item.patient.phone_number) }}><img src={process.env.PUBLIC_URL + "/images/whatsapp.png"} alt="displaying_image" style={{ width: "2rem" }} /> Send Bill On WhatsApp </button>
                              </li>
                            </ul>
                          </div>

                        </td>

                        <td className={`position-absolute mt-1 d-${i == index ? seidw : 'none'} start-0 end-0 border border-1 bg-seashell p-0 m-0`} style={{ zIndex: '2', top: '-7.5rem', 'height': '90vh' }} >
                          {
                            i == index ? (
                              <SEitemdetailssection saleentryarr={saleentryarr[i]} itembillid={"P-" + item.bill_id} toggle_seidw={toggle_seidw} />
                            ) : (<></>)
                          }
                        </td>

                        <td className={`col-lg-8 col-xl-6 col-md-8 col-sm-10 start-0 end-0 top-0 mx-auto shadow rounded-4 position-absolute bg-pearl d-${tabindex == i ? paymentsapage : 'none'}`} style={{ marginTop: '10rem' }}>
                          {
                            i == tabindex ? (
                              <SaleEntrypayments GETSalesList={GETSalesList} saleentryarr={saleentryarr[i]} toggle_payments={toggle_payments} itembillid={"P-" + item.bill_id} />
                            ) : (<></>)
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              ) : (
                <tbody className='text-center p-0 m-0' style={{ minHeight: '55vh', maxHeight: '55vh' }}>
                  <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                    <strong className='text-charcoal fw-bolder text-center'>No Sale Entries</strong>
                  </div>
                </tbody>
              )
            )
          }
        </table>
      </div>
      <div className="container-fluid mt-2 d-flex justify-content-center">

        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'.'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GETSalesList}
          containerClassName={'pagination scroll align-self-center align-items-center'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'d-flex mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active '}
        />
      </div>
      <section className={`newsaleentryform p-0 m-0 position-absolute d-${nsef} border border-1 mx-auto start-0 end-0 bg-seashell`} style={{ height: '90vh' }}>
        <SaleEntryForm toggle_nsef={toggle_nsef} GETSalesList={GETSalesList} />
      </section>
    </>
  )
}
function SaleEntrypayments(props) {
  const url = useContext(URL)
  const permission = useContext(Permissions)
  const adminid = localStorage.getItem('id')
  const [paymentmethods, setpaymentmethods] = useState()
  const [previouspayments, setpreviouspayments] = useState([])
  const [previoustotal, setprevioustotal] = useState(0)
  const [loading, setloading] = useState()
  const paymentmethoddetails = {
    paymentmethod: '',
    amount: 0
  }
  async function AddPaymentMethods() {
    let Payments = []
    let amounts = []
    let allamounts = []
    Payments.push(Object.keys(JSON.parse(props.saleentryarr.payment_method_details)))
    amounts.push(Object.values(JSON.parse(props.saleentryarr.payment_method_details)))
    let paymentobj = []
    let p = {
      paymentmethod: '',
      amount: 0
    }
    if (Payments[0]) {
      for (let j = 0; j < Payments[0].length; j++) {
        allamounts.push(p = { paymentmethod: Payments[0][j], amount: amounts[0][j] })
      }
      setpaymentmethods(allamounts)
    }

    paymentmethods.push(paymentobj)
  }
  useEffect(() => {
    AddPaymentMethods()
  }, [])
  function DeletePaymentMethods(i) {
    paymentmethods.splice(i, i)
  }
  const confirmmessage = (e) => {
    customconfirm()
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to add the following Charges and Payments of  ${props.itembillid}`,
      'Yes',
      'No',
      () => {
        SaveSaleEntryCharges()
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  async function SaveSaleEntryCharges() {
    let PaymentMethod = []
    let PaymentMethodDetails = []
    for (let i = 0; i < paymentmethods.length; i++) {
      PaymentMethod.push(paymentmethods[i].amount)
      PaymentMethodDetails.push(paymentmethods[i].paymentmethod)
    }
    let Data = {
      sale_entry_id: props.saleentryarr.id,
      g_total_main: props.saleentryarr.grand_total,
      payment_method: PaymentMethodDetails,
      payment_method_main: PaymentMethodDetails,
      payment_method_details: PaymentMethod,
      admin_id: adminid
    }
    try {
      setloading(true)
      await axios.post(`${url}/sale/entry/save/charges`, Data).then((response) => {
        props.GETSalesList()
        setloading(false)
        Notiflix.Notify.success(response.data.message)
      })
    } catch (e) {
      setloading(false)
      Notiflix.Notify.failure(e.message)
    }
  }
  const CalPrevTotal = async () => {
    let total = 0
    paymentmethods.map((data) => (
      total += Number(data.amount)
    ))
    console.log(total)
    setprevioustotal(total)
  }
  useEffect(() => {
    CalPrevTotal()
  }, [props.saleentryarr])
  console.log(props.saleentryarr, paymentmethods, previoustotal)

  function AddMethods() {
    if (paymentmethods && paymentmethods.length > 0) {
      setpaymentmethods(prevState => [...prevState, paymentmethoddetails])
    } else {
      setpaymentmethods([paymentmethoddetails])
    }

  }
  console.log(paymentmethods)
  return (
    <div className='p-0 m-0 text-center'>
      <h6 className='text-center mt-2 fw-bold'>{props.itembillid} Payments</h6>
      <hr className='p-0 m-0 mt-1' />
      <button className='btn-close position-absolute top-0 end-0 p-2 m-2 ' onClick={() => props.toggle_payments()}></button>

      <p className='text-charcoal p-0 m-auto fw-bolder'>Grand Total : <span className='text-burntumber'>Rs {props.saleentryarr.grand_total}</span></p>
      <hr className='p-0 m-0 mb-1' />
      <div className="container-fluid text-start position-relative">
        <div className={`d-${previoustotal == props.saleentryarr.grand_total ? '' : 'none'} bg-lightgreen fw-bold text-center p-2 my-2`}>Payment Done</div>
        <h6 className='text-charcoal fw-bolder text-center'>Payments</h6>
        {/* d-${previoustotal < props.saleentryarr.grand_total ? '  ' : 'none'} */}
        {
          paymentmethods ? (
            paymentmethods.map((data, i) => (
              // permission.sale_entry_charges_edit == 1

              permission.sale_entry_charges_edit == 1 ? (
                <div className={`row p-0 m-0 justify-content-end g-2`}>
                  <div className="col-4 ">
                    <select className='form-control border-success py-1 text-center' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods(prevState => [...prevState]) }}>
                      <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                      <option value='Cash'>Cash</option>
                      <option value='Card'>Card</option>
                      <option value='Paytm'>Paytm</option>
                      <option value='Phonepe'>Phone Pe</option>
                      <option value='Wire-Transfer'>Wire Transfer</option>
                      <option value='Razorpay'>Razorpay</option>
                      <option value='Points'>Points</option>
                      <option value='Adjust-Advance'>Adjust-Advance</option>
                    </select>
                  </div>
                  <div className="col-4 text-center ">
                    <input className='form-control border-success py-1 text-center' value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods(prevState => [...prevState]) }} />
                  </div>
                  <div className="col-2 text-center">
                    <button className='btn btn-sm p-0 m-0' onClick={() => { DeletePaymentMethods(i); setpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                  </div>
                </div>
              ) : (
                props.saleentryarr.payment_method_details == null ? (
                  <div className={`row p-0 m-0 justify-content-end g-2`}>
                    <div className="col-4 ">
                      <select className='form-control border-success py-1 text-center' value={data.paymentmethod} onChange={(e) => { data.paymentmethod = e.target.value; setpaymentmethods(prevState => [...prevState]) }}>
                        <option className='text-charcoal75 fw-bolder'>Payment Method</option>
                        <option value='Cash'>Cash</option>
                        <option value='Card'>Card</option>
                        <option value='Paytm'>Paytm</option>
                        <option value='Phonepe'>Phone Pe</option>
                        <option value='Wire-Transfer'>Wire Transfer</option>
                        <option value='Razorpay'>Razorpay</option>
                        <option value='Points'>Points</option>
                        <option value='Adjust-Advance'>Adjust-Advance</option>
                      </select>
                    </div>
                    <div className="col-4 text-center ">
                      <input className='form-control border-success py-1 text-center' value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods(prevState => [...prevState]) }} />
                    </div>
                    <div className="col-2 text-center">
                      <button className='btn btn-sm p-0 m-0' onClick={() => { DeletePaymentMethods(i); setpaymentmethods(prevState => [...prevState]) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} className='img-fluid' style={{ width: '1.5rem' }} /></button>
                    </div>
                  </div>
                ) : (
                  <div className={`row p-0 m-0 justify-content-center g-2`}>
                    <div className="col-4 text-center ">
                      <input className='form-control py-1' disabled={true} value={data.paymentmethod} />
                    </div>
                    <div className="col-4 text-center ">
                      <input className='form-control py-1 text-center' disabled={true} value={data.amount} onChange={(e) => { data.amount = e.target.value; setpaymentmethods(prevState => [...prevState]) }} />
                    </div>
                  </div>
                )

              )
            ))
          ) : (<></>)

        }
        <div className={`container-fluid text-center mt-2 `}>
          {
            permission.sale_entry_charges_edit == 1 ? (
              <button className='btn py-0' onClick={AddMethods}>
                <img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} />
              </button>
            ) : (
              props.saleentryarr.payment_method_details == null ? (
                <button className='btn py-0' onClick={AddMethods}>
                  <img src={process.env.PUBLIC_URL + '/images/add.png'} className='img-fluid' style={{ width: '2rem' }} />
                </button>
              ) : (<></>)

            )
          }

        </div>
      </div>

      <div className='mt-2'>
        {
          loading ? (
            <div className="container-fliud pt-2">
              <div className="d-flex fs-6 align-items-center justify-content-around">
                <h6 className="text-burntumber">Updating...</h6>
                <div className="text-burntumber spinner-border ml-auto" role="status" aria-hidden="true" ></div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-6">
                <button className='button button-burntumber m-0 p-0 py-1 px-5' disabled={previoustotal == props.saleentryarr.grand_total ? true : false} onClick={confirmmessage}>Save</button>
              </div>
              <div className="col-6">
                <button className='button button-pearl border-charcoal p-0 m-0 py-1 px-5' onClick={() => { setpaymentmethods(); props.toggle_payments() }}>Cancel</button>
              </div>
            </div>
          )
        }

      </div>
    </div >
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

      <h5 className='text-center text-charcoal pt-3'>{props.itembillid} Sale Entry Item Details</h5>
      <button type="button" className="btn-close closebtn position-absolute end-0 me-4" onClick={props.toggle_seidw} aria-label="Close"></button>

      <div className="col-2 d-none">
        <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
          <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
          <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
        </div>
      </div>
      <div className='d-flex p-0 m-0 mt-3 mb-1 justify-content-center'>
        {
          Items.map((data, i) => (
            <button className={`button shadow-0 rounded-0 border-charcoal button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>

          ))
        }
      </div>

      <div className="row p-0 m-0 justify-content-between">
        <div className="col-auto ms-2 mb-2 text-burntumber rounded-2 fw-bolder bg-pearl" >
          <p className='text-charcoal p-0 m-0 ms-1 text-start'>Grand Total</p>
          <hr className='p-0 m-0' />
          <h5 className='text-charcoal p-0 m-0 fw-bold text-start ms-1'>{props.saleentryarr.grand_total ? props.saleentryarr.grand_total : 0}</h5>
        </div>
        <div className="col-auto align-self-end justify-content-end me-4">
          <input type='checkbox' className='form-check-input' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label>
        </div>

      </div>

      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '65vh', Height: '65vh', maxHeight: '70vh' }}>
        <table className="table datatable text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan='2' className='border p-0 m-0 px-1'>Stock ID</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Medicine</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>MRP</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Qty</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Disc. %</th>
              <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
              <th rowspan='2' className='border p-0 m-0 px-1'> Amt</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Grand Total</th>
            </tr>
            <tr>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total CGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST% </th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total SGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total IGST</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total Tax</th>
            </tr>
          </thead>
          {
            props.saleentryarr.sale_medicines && props.saleentryarr.sale_medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.saleentryarr.sale_medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item.medicine_stocks && item.medicine_stocks.id !== null ? "m" + item.medicine_stocks.id : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.main_mrp ? item.main_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty && item.qty != null ? item.qty : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount != null ? item.discount : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.disc_mrp ? item.disc_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item && item.total_amount ? item.total_amount : ''}</td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                  <p className=' text-center text-charcoal fw-bold'>No Medicines Found</p>
                </div>

              </body>
            )


          }
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '65vh', Height: '65vh', maxHeight: '65vh' }}>
        <table className="table datatable table-responsive text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan='2' className='border p-0 m-0 px-1'>Stock ID</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Vaccine</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>MRP</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Qty</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Disc. %</th>
              <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Amt</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Grand Total</th>
            </tr>
            <tr>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total CGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total SGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>Total IGST</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total Tax</th>
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
                      <td className='border p-0 m-0 align-middle'>{item.main_mrp ? item.main_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty && item.qty != null ? item.qty : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount != null ? item.discount : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.disc_mrp ? item.disc_mrp : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : ''}</td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 '>
                  <p className=' text-center fw-bold text-charcoal'>No Vaccines Found</p>
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
  const ClinicID = localStorage.getItem('ClinicId')
  const url = useContext(URL)
  const [sridw, setsridw] = useState("none");
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [salereturnarr, setsalereturnarr] = useState([])
  const [salereturnarrExcel, setsalereturnarrExcel] = useState([])
  const [index, setindex] = useState()
  const [nref, setnref] = useState("none");

  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()

  console.log(salereturnarr, pagecount)
  function GetPages() {
    try {
      axios.get(`${url}/sale/return?clinic_id=${ClinicID}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 25) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }
  function GETSaleReturns(Data) {
    if (Data == undefined || Data.selected == undefined) {
      try {
        axios.get(`${url}/sale/return?clinic_id=${ClinicID}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          console.log(response)
          setsalereturnarr(response.data.data.sale_return)

          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.data.message)
        setLoading(false)
      }
    } else {
      try {
        axios.get(`${url}/sale/return?clinic_id=${ClinicID}&limit=25&offset=${Data.selected * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          console.log(response)
          setsalereturnarr(response.data.data.sale_return)
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
  }
  function GETSaleReturnsForExcel() {
    setLoading(true)
    try {
      axios.get(`${url}/sale/return?clinic_id=${ClinicID}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        console.log(response)
        setpagecount(response.data.data.total_count)
        setsalereturnarrExcel(response.data.data.sale_return)
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
    GetPages()
  }, [fromdate, todate])

  useEffect(() => {
    GETSaleReturns()
    GETSaleReturnsForExcel()
  }, [pagecount])

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

  console.log(salereturnarr)
  return (
    <>
      <button className="button addentrypurchase button-charcoal position-absolute" onClick={toggle_nref}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Return</button>
      <div classsName='p-0 m-0'>
        <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-center text-center mt-2">
          <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 ">
            <button type='button' className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: 'fit-content' }}>{pagecount}  {pagecount > 0 ? 'Sale Returns' : 'Sale Return'} </button>
          </div>
          <div className="col-lg-8 col-md-8 col-7  p-0 m-0  border-0 ">
            <div className="row p-0 m-0 border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
              <div className="col-6 p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-2 ">
                <input type='date' placeholder='fromdate' className='p-0 m-0 border-0 bg-pearl text-burntumber text-center fw-bolder ' value={fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
              </div>
              <div className="col-6 p-0 m-0 text-burntumber bg-pearl fw-bolder rounded-2">
                <input type='date' className='p-0 m-0 border-0 text-burntumber fw-bolder bg-pearl' placeholder='todate' value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { settodate(e.target.value) }} />
              </div>
            </div>
          </div>
          <div className="col-md-2 col-lg-2 col-2 p-0 m-0 export align-self-center text-center ">
            <ExportSaleReturn salereturnarr={salereturnarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
          </div>
        </div>
        <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{ minHeight: '40vh', height: '59vh', maxHeight: '70vh' }}>
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
                            <button className="btn" onClick={() => { setindex(i); toggle_sridw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></button></td>
                          <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                          <td className={` position-absolute d-${i == index ? sridw : 'none'} bg-seashell border border-1 start-0 end-0 p-0 m-0`} style={{ top: '-7.5rem', zIndex: '2' }} >
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
        <div className="container-fluid d-flex justify-content-center">
          < ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'. . .'}
            pageCount={pages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={GETSaleReturns}
            containerClassName={'pagination'}
            pageClassName={'page-item text-charcoal'}
            pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
            previousClassName={'btn button-charcoal-outline me-2'}
            previousLinkClassName={'text-decoration-none text-charcoal'}
            nextClassName={'btn button-charcoal-outline ms-2'}
            nextLinkClassName={'text-decoration-none text-charcoal'}
            breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
            breakLinkClassName={'text-decoration-none text-charcoal'}
            activeClassName={'active'}
          />
        </div>
      </div>
      <section className={`newreturnentrysection position-absolute start-0 end-0 border border-1 bg-seashell d-${nref}`}  >
        {<NewSaleReturnentryform toggle_nref={toggle_nref} GETSaleReturns={GETSaleReturns} />}
      </section>
    </>
  )
}
function SaleEntryForm(props) {
  const tableref = useRef(null)
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
  const [otherdoctor, setotherdoctor] = useState()
  const [clinicid, setclinicid] = useState(clinicID)
  const [ischecked, setischecked] = useState()
  const [Dc, setDc] = useState(0)
  const [AtC, setAtC] = useState(0)
  const [load, setload] = useState()
  const [searchload, setsearchload] = useState(false)
  const [products, setproducts] = useState([])
  const [itemsearch, setitemsearch] = useState([])
  const [itembyid, setitembyid] = useState([])
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
      setsearchlist(response.data.data.patients_list)
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
  function CalTotalAmount(qty, cst, realcst) {
    let cost = cst
    if (Number(realcst) > Number(cost)) {

      Notiflix.Notify.failure('Selling Cost should not less than Cost')
    }
    console.log(typeof (realcst), typeof (cost))
    if (!qty) {
      return 0
    } else if (qty == 1) {
      cst = Number(cst)
      return cst
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
    let T = ''
    if (data.vaccine_brand_id) {
      T = 'v'
    } else {
      T = 'm'
    }
    let ProductDetails = {
      productid: data.id,
      type: data.type ? data.type : T,
      product: data.item_name ? data.item_name : itemname,
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
    if (doctorname !== undefined || otherdoctor !== undefined) {
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
        doctor_name: doctorid ? doctorname : otherdoctor,
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
      setload(true)
      try {
        await axios.post(`${url}/sale/entry/save`, Data).then((response) => {
          setload(false)
          props.GETSalesList()
          props.toggle_nsef()
          if (response.data.status == true) {
            Notiflix.Notify.success(response.data.message)
          } else {
            Notiflix.Notify.warning(response.data.message)
          }
          ClearForm()
        }).catch(function error(e) {
          console.log(e)
          Notiflix.Notify.failure(e.message)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    } else {
      Notiflix.Notify.failure('Please Choose A Doctor to further proceed the sale entry')
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
  useEffect(() => {
    if (AtC == 1) {
      SubmitSaleEntry()
    }
  }, [AtC])
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
  console.log(itemsearch)
  return (

    <div className="container-fluid p-0 m-0">
      <div className='position-relative mb-3'>
        <h5 className='text-center text-charcoal pt-2 '>New Sale Entry</h5>
        <button className='btn btn-close position-absolute end-0 top-0 me-2' disabled={load ? true : false} onClick={props.toggle_nsef}></button>
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
      <div className="row p-0 m-0">
        <div className="col-4">
          <label className="m-0">Search Using Phone or Name</label>
          <input type="text" className="form-control bg-seashell selectpatient col-10 position-relative" placeholder='Search for Patients' value={searchinput ? searchinput : ''} onFocus={() => setsearchload(true)} onChange={searchpatient} />
          <div className={`col-auto d-${displaysearchlist} text-decoration-none searchinput position-absolute rounded-2 shadow bg-pearl px-2`} style={{ width: 'max-content', zIndex: '2' }}>
            {
              searchload == true || searchinput == undefined ? (
                <p className="btn text-charcoal75 fs-6 p-0 m-0 ps-1">Loading... </p>
              ) : (
                searchlist.length == 0 ? (
                  <p className="text-danger btn fs-6 p-0 m-0">Patient not found</p>
                ) : (
                  searchlist.map((data) => (
                    <div className='col-auto p-0 m-0 ms-1 bg-pearl text-decoration-none list-style-none text-charcoal text-start px-1 border-bottom' style={{ width: 'max-content' }} onClick={() => { get_value(data.id, data.full_name, data) }}>{data.full_name} {data.phone_number}</div>
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
            <input className='col-10 form-control bg-seashell' placeholder='Other Doctors' value={otherdoctor ? otherdoctor : ''} onChange={(e) => { setotherdoctor(e.target.value) }} />
          </div>
        </div>

      </div>
      <div className="container-fluid mt-4 text-center p-0 m-0">
        <div className="col-12 p-0 m-0 justify-content-center">
          <h6 className='text-charcoal p-0 m-0 fw-bolder text-start ms-1'>Add Products</h6>
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
                      loadsearch == false && itemsearch.length == 0 ? (
                        <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                      ) : (
                        <div className={`rounded-4 border border-1 bg-pearl p-1 d-${itemsearch && itemsearch.length > 0 ? 'block' : 'none'}`}>
                          <p className={`text-start p-0 m-0 m-1 fw-bold text-charcoal75 ms-2`} style={{ fontSize: '0.8rem' }}>{itemsearch.length} Search Results</p>
                          {
                            itemsearch.map((data, i) => (
                              <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} p-0 ps-1 border-bottom text-charcoal `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = 'block' }}>{data.display_name ? data.display_name : data.name}</div>
                            ))
                          }
                        </div>
                      )
                    )
                  ) : (<div className='bg-seashell'></div>)
                }
              </div>
              <div ref={stockref} className={`position-absolute bg-pearl scroll scroll-y align-self-center rounded-4 border border-1 p-1 d-${products && products.stock_info && products.stock_info.length > 0 ? 'block' : 'none'}`} style={{ marginLeft: '15.7rem', marginTop: '2rem', zIndex: '2', 'width': '13rem', 'height': '10rem' }}>
                <p className={`text-start p-0 m-0 m-1 fw-bold text-charcoal75`} style={{ fontSize: '0.8rem' }}>{products && products.stock_info !== undefined ? products.stock_info.length : ''} Batch Stocks</p>
                {
                  products && products.length == 0 ? (
                    <div className='bg-seashell'>Not Avaliable</div>
                  ) : (

                    products ? (

                      products.stock_info.map((data, i) => (
                        <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} border-bottom text-wrap`}
                          onClick={
                            () => {
                              AddProducts(data);
                              setitemname();
                              setitemid();
                              setproducts();
                              setitemsearch()
                            }}>
                          <p className='text-center m-0 p-0 fw-bold'>{itemname}</p>
                          <p className='p-0 m-0 '>BatchNo. - {data.batch_no && data.batch_no !== null ? data.batch_no : ''}</p>
                          <p className='p-0 m-0 '>Stock - {data.current_stock && data.current_stock ? data.current_stock : ''}</p>
                          <p className='p-0 m-0 '>Expiry Date - {data.expiry_date ? reversefunction(data.expiry_date) : ''}</p>
                        </div>
                      ))

                    ) : (<div>Not available</div>)


                  )

                }
              </div>
              <div></div>
            </div>
            <div className='col-1 text-burntumber fw-bold align-self-center'>
              OR
            </div>
            <div className="col-4 ">
              <input className='form-control bg-seashell border border-1 rounded-2' value={itemid ? itemid : ''} placeholder='Search Product by ID' onChange={(e) => { searchmedbyId(e.target.value); setitemid(e.target.value); medbyidref.current.style.display = 'block' }} />
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
                      loadbyId == false && itembyid.length == 0 ? (
                        <div className="bg-burntumber text-light rounded-2 p-1">Oops! Not Avaliable</div>
                      ) : (
                        itembyid.map((data, i) => (
                          <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`p-0 p-1 rounded-pill shadow bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} fs-6 `}
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
            <h6 className='text-charcoal p-0 m-0 fw-bolder text-start ms-1'>Product Added</h6>

          </div>

          <hr className='p-0 m-0' />
          <div className='p-0 m-0 scroll scroll-y' style={{ height: '35vh' }}>
            <table className='table p-0 m-0'>
              <thead className='p-0 m-0'>
                <tr className={`p-0 m-0 `}>
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
                        <tr className={`p-0 m-0 align-middle bg-${Number(data.disccost) < Number(data.cost) ? 'lightred50' : ''}`}>
                          <td>{data.type}{data.productid}</td>
                          <td>{data.product}</td>
                          <td>{data.batch}</td>
                          <td>{reversefunction(data.expiry)}</td>
                          <td>{data.quantity}</td>

                          <td><input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell'
                            value={data.qtytoSale ? data.qtytoSale : ''}
                            onChange={(e) => {
                              e.target.value <= data.quantity ? data.qtytoSale = e.target.value : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available");
                              data.totalamt = CalTotalAmount(data.qtytoSale, data.disccost)
                              setSelectedProducts(prevState => [...prevState])
                            }} /> </td>

                          <td className='text-center p-0 m-0' style={{ Width: '0rem' }}>
                            <input className='border border-1 rounded-1 w-25 text-center p-0 m-0 bg-seashell'
                              value={data.discount ? data.discount : ''}
                              onChange={(e) => {
                                data.discount = e.target.value;
                                data.disccost = CalSellingCost(data.mainmrp, e.target.value);
                                data.totalamt = CalTotalAmount(data.qtytoSale, Number(data.disccost), Number(data.cost))
                                setSelectedProducts(prevState => [...prevState]);
                              }} /> </td>
                          <td>{data.mainmrp}</td>                          <td>{data.cost}</td>
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
      <div className='col-12 position-absolute start-0 end-0 bottom-0 py-3 border border-1 text-center bg-pearl align-items-center rounded-bottom'>
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
            {
              load ? (
                <div className="col-6 py-2 pb-2 m-auto text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button className='button button-charcoal px-5' onClick={() => { confirmmessage() }}>Save Entry</button>
              )
            }
          </div>
          <div className="col-3 align-self-center">
            <button className='button button-pearl border-charcoal text-charcoal px-4' disabled={load ? true : false} onClick={() => { confirmmessage2() }}>Add To Cart</button>
          </div>
        </div>
      </div>
    </div>

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
  const [load, setload] = useState()
  const [MedicineentriesArr, setMedicineentriesArr] = useState([])

  const CalculateCost = (cost, currentstock, qtytotreturn) => {
    let costing = 0;
    if (cost && qtytotreturn && currentstock >= qtytotreturn) {
      costing = 0
      costing = Number(cost) * Number(qtytotreturn)
      return costing.toFixed(2)
    } else {
      return cost
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
      totalcost: data.sale_disc_mrp,
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
    medicinesref.current.style.display = 'block';
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
    setload(true)
    try {
      await axios.post(`${url}/sale/return/save`, Data).then((response) => {
        Notiflix.Notify.success(response.data.message)
        props.GETSaleReturns()
        setMedicineentriesArr()
        setbillid()
        setbillname()
        setload(false)
        props.toggle_nref()
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      console.log(e.message)
      setload(false)
    }
  }

  function confirmmessage() {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Purchase Return `,
      `Do you surely want to add total ${MedicineentriesArr.length} Sale ${MedicineentriesArr.length <= 1 ? 'Return ' : 'Returns'} of Bill P-${billid} `,
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
    <div className="p-0 m-0 ">
      <div className="container-fluid p-0 m-0 border border-1 ">
        <h5 className="text-center pt-3" style={{ color: "var(--charcoal)" }} >New Sale Return Entry</h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 p-2 me-2" onClick={props.toggle_nref} disabled={load ? true : false} aria-label="Close" ></button>
        <hr />
        <div className="container-fluid p-0 m-0 w-100 entrydetails bg-seashell">
          <div className="row p-0 m-0 justify-content-end">
            <div className="col-5">
              <h6 className="p-0 m-0 ms-3 fw-bold">Select Bill</h6>
              <input className="form-control ms-2 rounded-1 bg-seashell" placeholder='Bill Id (Does not require initials)' value={billid ? billid : ''} onChange={(e) => { setbillid(e.target.value); setMedicineentriesArr([]); }} />
            </div>
            <div className="col-5">
              <div className='position-relative'>
                <h6 className="p-0 m-0 ms-3 fw-bold">Product ID</h6>
                <input className='form-control bg-seashell' placeholder='Product Id (Require initials)' value={itemname ? itemname : ''}
                  onChange={(e) => {
                    billid ? setitemname(e.target.value) : Notiflix.Notify.failure('Please Add Bill id First');
                    medicinesref.current.style.display = 'block';
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
              <button className='p-0 m-0 btn' onClick={searchProduct}>
                <img src={process.env.PUBLIC_URL + 'images/search.png'} style={{ width: '1.8rem' }} /></button>
            </div>
          </div>
          <div className=" p-0 m-0 mt-2 scroll scroll-y" style={{ Height: '65vh', zIndex: '2' }}>
            <p className='text-center fw-bold text-burntumber p-0 m-0  mt-2 mb-1'>Items Selected</p>
            <table className="table datatable text-center position-relative">
              <thead className='text-charcoal75 fw-bold'>
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
      <div className='col-12 position-absolute start-0 end-0 bottom-0 text-center bg-pearl  border border-1 py-3'>

        <div className="row p-0 m-0">
          <div className="col-6">
            <div className="row">
              <div className="col-auto">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Order Total </p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{Grand()}</h4>
              </div>
              <div className="col-auto">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Total Items</p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{MedicineentriesArr ? MedicineentriesArr.length : 0}</h4>
              </div>
            </div>
          </div>
          <div className="col-6 align-self-center">
            {
              load ? (
                <div className="col-6 py-2 pb-2 m-auto text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button className='button button-charcoal px-5' onClick={confirmmessage}>Save Entry</button>
              )
            }
          </div>
        </div>
      </div>
    </div>
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
          <h5 className='text-center text-charcoal pt-3'>{props.itembillid} Sale Return Item Details</h5>
          <button type="button" className="btn-close closebtn m-auto position-absolute end-0 me-4" onClick={props.toggle_sridw} aria-label="Close"></button>
          <div className="col-2 d-none">
            <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
              <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
              <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-center p-0 m-0 mt-3 mb-1'>
        {
          Items.map((data, i) => (

            <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>

          ))
        }

      </div>

      <div className="row justify-content-end me-5">
        <div className="col-3"><input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label></div>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '70vh', Height: '70vh', maxHeight: '82vh' }}>
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
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '70vh', Height: '70vh', maxHeight: '70vh' }}>
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

//  ---------------------------------------------------------------purchase------------------------------------------------------------------
function Purchasesection(props) {
  const permission = useContext(Permissions)
  const first = [
    {
      option: "Purchase Entry",
      display: permission.purchase_entry_view,
    },
    {
      option: "Purchase Returns",
      display: permission.purchase_return_view
    },
    {
      option: "Purchase Orders",
      display: permission.purchase_orders_view
    }
  ];
  const [second, setSecond] = useState(0);

  const _selectedScreen = (_selected) => {

    if (_selected === 0) {
      return <Purchaseentrysection function={props.func} function2={props.function} />
    }
    if (_selected === 1) {
      return <PurchaseReturns />
    }
    if (_selected === 2) {
      return <Purchaseordersection />
    }
    return <div className=''>Nothing Selected</div>

  }
  return (
    <>
      <section className='purchasesection'>

        <div className="row p-0 m-0 mt-1 gx-lg-3 gx-md-2">

          {
            first.map((e, i) => {
              return (
                <div className={`col-auto d-${e.display == 1 ? '' : 'none'}`}>
                  <button className={`btn btn-sm px-lg-4 px-md-3 rounded-pill text-${i === second ? "light" : "dark"} bg-${i === second ? "charcoal" : "seashell"}`} onClick={(a) => setSecond(i)} >{e.option}</button>
                </div>
              )
            }
            )
          }

        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid mt-lg-4 mt-md-3 mt-2 p-0 m-0'>
          <div className="">
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
  const permission = useContext(Permissions)
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
  const [purchaseentryarrExcel, setpurchaseentryarrExcel] = useState([])
  const [index, setindex] = useState()
  const [npef, setnpef] = useState("none");
  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()
  const [qr, setqr] = useState('none')
  function GetPages() {
    try {
      axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 25) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }

  function GETPurchaseList(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true)
      try {
        axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          setpagecount(response.data.data.total_count)
          setpurchaseentryarr(response.data.data.purchase_entry)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e.message)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.data.message)
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${Data.selected * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          setpagecount(response.data.data.total_count)
          setpurchaseentryarr(response.data.data.purchase_entry)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e.message)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.data.message)
        setLoading(false)
      }
    }
  }
  function GETPurchaseListForExcel() {
    setLoading(true)
    try {
      axios.get(`${url}/purchase/entry?clinic_id=${ClinicID}&channel=${channel}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpurchaseentryarrExcel(response.data.data.purchase_entry)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    GetPages()
  }, [channel, fromdate, todate])

  useEffect(() => {
    GETPurchaseList()
    GETPurchaseListForExcel()
  }, [pagecount])

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
  function GenerateQR(props) {
    console.log(props.purchaseentry)
    let medicines = props.purchaseentry.medicines ? props.purchaseentry.medicines : 0
    let vaccines = props.purchaseentry.vaccines ? props.purchaseentry.vaccines : 0
    let medicineobj = {}
    let vaccineobj = {}
    let medcount = []
    let vaccount = []
    if (props.purchaseentry.medicines !== undefined && props.purchaseentry.medicines.length !== 0) {
      for (let i = 0; i < medicines.length; i++) {
        for (let j = 0; j < props.purchaseentry.medicines[i].qty; j++) {
          medicineobj[j] = {
            id: 'm' + props.purchaseentry.medicines[i].id,
            name: props.purchaseentry.medicines[i].medicine.name,
            qrcode: <QRcode id={'m' + props.purchaseentry.medicines[i].id} />
          }
          medcount.push(medicineobj[j])
        }
      }
    }
    if (props.purchaseentry.vaccines !== undefined && props.purchaseentry.vaccines.length !== 0) {
      for (let i = 0; i < vaccines.length; i++) {
        for (let j = 0; j < props.purchaseentry.vaccines[i].qty; j++) {
          vaccineobj[j] = {
            id: 'v' + props.purchaseentry.vaccines[i].id,
            name: props.purchaseentry.vaccines[i].vaccine.name,
            qrcode: <QRcode id={'v' + props.purchaseentry.vaccines[i].id} />
          }
          vaccount.push(vaccineobj[j])
        }

      }
    }

    console.log(medcount, vaccount)
    return (
      <div className="container-fluid">
        <h5 className='text-charcoal75 fw-bold'>Medicines</h5>
        <div className="row">
          {
            medcount.map((Data) => (
              <div className='col-auto m-2' key={Data}>
                <p className='text-charcoal75'>{Data.name} | {Data.id}</p>
                <div className="container">
                  {Data.qrcode}
                </div>
              </div>

            ))
          }
        </div>
        <h5 className='text-charcoal75 fw-bold mt-2'>Vaccines</h5>
        <div className="row">
          {
            vaccount.map((Data) => (
              <div className='col-auto m-2' key={Data}>
                <p className='text-charcoal75'>{Data.name} | {Data.id}</p>
                <div className="container">
                  {Data.qrcode}
                </div>
              </div>

            ))
          }
        </div>
      </div>
    )

  }
  return (
    <>
      <button className={`button addpurchase button-charcoal position-absolute d-${permission.purchase_entry_add == 1 ? '' : 'none'}`} onClick={toggle_npef}>
        <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Purchase</button>
      <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-left text-center">
        <div className="col-lg-2 col-md-2 col-3 text-center p-0 m-0 order-lg-0 order-md-0 order-sm-0 order-0 ms-lg-0 ms-md-0 ms-sm-0 ms-4">
          <button type='button' className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: 'fit-content' }}>{pagecount}  {pagecount > 1 ? 'Purchase Entries' : 'Purchase Entry'} </button>
        </div>
        <div className="col-lg-8 col-md-7 col-11 ms-lg-0 ms-md-0 ms-sm-0 ms-3 align-self-center p-0 m-0 order-lg-1 order-md-1 order-sm-1 order-2 mt-lg-0 mt-md-0 mt-1  ">
          <div className="row p-0 m-0 border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
            <div className="col-4 p-0 m-0  bg-pearl rounded-2">
              <select className='p-0 m-0 border-0 text-burntumber fw-bolder bg-pearl' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-4 p-0 m-0 text-burntumber fw-bolder bg-pearl">
              <input type='date' className=' p-0 m-0 border-0 text-burntumber fw-bolder bg-pearl ' value={fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-4 p-0 m-0  text-burntumber fw-bolder bg-pearl rounded-2">
              <input type='date' className=' p-0 m-0 border-0 text-burntumber fw-bolder bg-pearl rounded-2 ' value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 export col-md-2 col-lg-2 align-self-center order-lg-2 order-md-2 order-sm-0 order-1 ">
          <ExportPurchaseEntry purchaseentryarr={purchaseentryarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div>
        <div className='scroll scroll-y overflow-scroll p-0 m-0 mt-2' style={{ minHeight: '56vh', height: '56vh' }}>
          <table className="table p-0 m-0">
            <thead className='p-0 m-0 align-middle position-sticky top-0 bg-pearl'>
              <tr>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>PE ID</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>PO ID</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>Channel</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>Invoice No.</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>Bill Date</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>Bill Total</th>
                <th className='fw-bolder py-0 my-0  text-charcoal75' scope='col'>Vendor</th>
                <th className='fw-bolder py-0 my-0 text-center  text-charcoal75' scope='col'>Actions</th>
                {/* <th className='fw-bolder p-0 m-0  text-charcoal75 text-center' scope='col' style={{ zIndex: '3' }}>more</th> */}
              </tr>
            </thead>
            {
              Loading ? (
                <body className=' text-center' style={{ minHeight: '55vh' }}>
                  <tr className='position-absolute border-0 start-0 end-0 px-5'>
                    <div class="d-flex align-items-center">
                      <strong className=''>Getting Details please be Patient ...</strong>
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
                          <td className='py-0 my-0 text-charcoal fw-bold ps-2'>PE-{item.bill_id}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.purchase_order_id && item.purchase_order_id !== null ? item.purchase_order_id : 'N/A'}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.channel && item.channel == 1 ? "Pharmacy" : "Clinic"}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.invoice_no ? item.invoice_no : 'N/A'}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.bill_date && item.bill_date ? reversefunction(item.bill_date) : 'N/A'}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.bill_total && item.bill_total ? "Rs. " + item.bill_total : 'N/A'}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold'>{item.distributor && item.distributor != null && item.distributor.entity_name && item.distributor.entity_name != null ? item.distributor.entity_name : 'N/A'}</td>
                          <td className='py-0 my-0 text-charcoal fw-bold text-center'>
                            {/* <button className='btn'><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button> */}
                            <button className="btn" onClick={() => { setindex(i); toggle_peidw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></button>
                            <button className='btn' onClick={() => { setqr(i) }}>
                              <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" />
                            </button>
                          </td>
                          {/* <td className='p-0 m-0 text-charcoal fw-bold text-center'>
                            <button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button>
                          </td> */}
                          <td className={` position-absolute d-${i == index ? peidw : 'none'} border border-1 start-0 end-0 bg-seashell p-0 m-0`} style={{ top: '-8.5rem', zIndex: '5' }} >
                            {
                              i == index ? (
                                <PEitemdetailssection purchaseentryarr={purchaseentryarr[i]} itembillid={"PE-" + item.bill_id} toggle_peidw={toggle_peidw} />
                              ) : (<></>)
                            }
                          </td>
                          <td className={`position-absolute start-0 text-start bg-pearl container-fluid d-${qr == i ? 'block' : 'none'}`} style={{ top: '-8.5rem', zIndex: '5', height: '89vh' }}>
                            {
                              i == qr ? (
                                <div className="container-fluid position-relative">
                                  <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={() => setqr()} aria-label="Close"></button>
                                  <div className='row'>
                                    <GenerateQR purchaseentry={purchaseentryarr[i]} />
                                  </div>
                                </div>
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
        <div className="container-fluid mt-2 d-flex justify-content-center">
          < ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'. . .'}
            pageCount={pages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={GETPurchaseList}
            containerClassName={'pagination'}
            pageClassName={'page-item text-charcoal'}
            pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
            previousClassName={'btn button-charcoal-outline me-2'}
            previousLinkClassName={'text-decoration-none text-charcoal'}
            nextClassName={'btn button-charcoal-outline ms-2'}
            nextLinkClassName={'text-decoration-none text-charcoal'}
            breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
            breakLinkClassName={'text-decoration-none text-charcoal'}
            activeClassName={'active'}
          />
        </div>
      </div>
      <section className={`newpurchaseentrysection position-absolute start-0 end-0 bg-seashell border border-1 d-${npef}`}>
        {<Newpurchaseentryform toggle_npef={toggle_npef} GETPurchaseList={GETPurchaseList} />}
      </section>
    </>
  )
}
function PEitemdetailssection(props) {

  const [medicine, setmedicine] = useState('block')
  const [vaccine, setvaccine] = useState('none')
  const [index, setindex] = useState(0)
  const Items = ['Medicine', 'Vaccine']
  const [qr, setqr] = useState('none')
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }

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
    if (cgst && sgst || igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
      e = e.toFixed(2)
      return e
    }
  }
  function GenerateQR(props) {
    let count = []
    for (let i = 0; i < props.qty; i++) {
      count.push(props.qty)
    }
    // console.log(count)
    return (
      count.map((data) => (
        <div className='col-auto m-2' key={data}>
          <QRcode id={props.id} />
        </div>
      ))

    )

  }
  console.log(props.purchaseentryarr)
  return (
    <div className="container-fluid p-0 m-0 bg-seashell ">
      <div className="container-fluid bg-seashell p-0 m-0">
        <h5 className='text-center pt-3 text-charcoal'>{props.itembillid} Purchase Entry Item Details</h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={props.toggle_peidw} aria-label="Close"></button>

        <div className="col-2 d-none">
          <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
            <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
            <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
          </div>
        </div>

      </div>
      <div className='d-flex justify-content-center p-0 m-0 mt-3 mb-1'>
        {
          Items.map((data, i) => (
            <button className={`button border-charcoal rounded-0 shadow-0 button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>

          ))
        }

      </div>


      <div className=" d-flex justify-content-end me-5">
        <input type='checkbox' className='form-check-input' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '70vh', Height: '70vh', maxHeight: '70vh' }}>
        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>

          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total</th>
          </tr>
        </thead>
          {
            props.purchaseentryarr.medicines && props.purchaseentryarr.medicines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchaseentryarr.medicines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? 'm' + item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? (Number(item.SGST) * Number(item.qty)).toFixed(2) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? (Number(item.CGST) * Number(item.qty)).toFixed(2) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? (Number(item.IGST) * Number(item.qty)).toFixed(2) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>
                        <button className='btn' onClick={() => { setqr(_key) }}>
                          <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" />
                        </button></td>
                      <div className={`position-absolute top-0 start-0  text-start bg-pearl container-fluid d-${qr == _key ? 'block' : 'none'}`} style={{ top: '-4.2rem', zIndex: '5', height: '89vh' }}>
                        <div className="container-fluid position-relative">
                          <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={() => setqr()} aria-label="Close"></button>
                          <p className='mt-2 text-burntumber border-1 '>{item.medicine && item.medicine.name !== null ? item.medicine.name : 'N/A'} | {item && item.id !== null ? 'm' + item.id : 'N/A'}</p>
                          <div className='row'>
                            <GenerateQR qty={item.qty} id={'m' + item.id} />
                          </div>

                        </div>

                      </div>


                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 '>
                  <p className=' text-center fw-bold'>No Medicines Found</p>
                </div>

              </body>
            )


          }
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '70vh', Height: '70vh', maxHeight: '70vh' }}>
        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP </th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate </th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className={`border p-0 m-0 px-1`}>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost </th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total </th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Print QR</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST </th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST </th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total </th>
          </tr>
        </thead>
          {
            props.purchaseentryarr.vaccines && props.purchaseentryarr.vaccines.length !== 0 ? (
              <tbody className='border align-items-center p-0 m-0'>
                {
                  props.purchaseentryarr.vaccines.map((item, _key) => (
                    <tr className='border p-0 m-0 align-middle' key={_key}>
                      <td className='border p-0 m-0 align-middle'>{item && item.id !== null ? 'v' + item.id : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.vaccine && item.vaccine.name !== null ? item.vaccine.name : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.batch_no && item.batch_no != null ? item.batch_no : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.expiry_date && item.expiry_date != null ? reversefunction(item.expiry_date) : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.mrp ? item.mrp : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.rate ? item.rate : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? item.SGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? item.SGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? item.CGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? item.CGST : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? item.IGST_rate : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? item.IGST : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>
                        <button className='btn' onClick={() => { setqr(_key) }}>
                          <img src={process.env.PUBLIC_URL + "/images/qrcode.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" />
                        </button></td>
                      <div className={`position-absolute top-0 start-0  text-start bg-pearl container-fluid d-${qr == _key ? 'block' : 'none'}`} style={{ top: '-8.2rem', zIndex: '5', height: '89vh' }}>
                        <div className="container-fluid position-relative">
                          <button type="button" className="btn-close closebtn position-absolute end-0 me-2" onClick={() => setqr()} aria-label="Close"></button>
                          <p className='mt-2 text-burntumber border-1 '>{item.vaccine && item.vaccine.name !== null ? item.vaccine.name : 'N/A'} | {item && item.id !== null ? 'v' + item.id : 'N/A'}</p>
                          <div className='row'>
                            <GenerateQR qty={item.qty} id={'v' + item.id} />
                          </div>
                        </div>
                      </div>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2 '>
                  <p className='fw-bold text-center'>No Vaccines Found</p>
                </div>

              </body>
            )


          }
        </table>
      </div>
    </div >

  )
}
function Newpurchaseentryform(props) {
  const url = useContext(URL)
  const ClinicId = localStorage.getItem('ClinicId')
  const ClinicList = useContext(Clinic)
  const medicinesref = useRef(null)
  const vendorsref = useRef(null)
  const Tableref = useRef(null)
  const [channel, setchannel] = useState()
  const [po, setpo] = useState()
  const [invoice, setinvoice] = useState()
  const [invoicedate, setinvoicedate] = useState()
  const [vendorname, setvendorname] = useState()
  const [vendorid, setvendorid] = useState()
  const [loadvendors, setloadvendors] = useState()
  const [vendorcode, setvendorcode] = useState()
  const [vendorsearch, setvendorsearch] = useState()
  const [itemsearch, setitemsearch] = useState([''])
  const [itemname, setitemname] = useState()
  const [itemid, setitemid] = useState()
  const [IsConsumable, setIsConsumable] = useState(0)
  const [itemtype, setitemtype] = useState()
  const [batchno, setbatchno] = useState()
  const [expdate, setexpdate] = useState()
  const [manufdate, setmanufdate] = useState()
  const [mrp, setmrp] = useState()
  const [rate, setrate] = useState()
  const [qty, setqty] = useState()
  const [freeqty, setfreeqty] = useState(0)
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
  const [load, setload] = useState()
  const [Exceldata, setExceldata] = useState([])
  const [NewMed, setNewMed] = useState('none')

  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  async function filterclinic() {
    for (let i = 0; i < ClinicList.length; i++) {
      if (ClinicList[i].id == ClinicId) {
        setclinicstatecode(ClinicList[i].state_code)
      }
    }
  }
  let MedicineentriesObj = {
    type: '',
    isconsumable: 0,
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
      isconsumable: IsConsumable,
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
    let Is_consumable = []
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
      Is_consumable.push(MedicineentriesArr[i].isconsumable ? MedicineentriesArr[i].isconsumable : 0)
      MedId.push(MedicineentriesArr[i].Itemid ? MedicineentriesArr[i].Itemid : '')
      medname.push(MedicineentriesArr[i].Itemname ? MedicineentriesArr[i].Itemname : '')
      batches.push(MedicineentriesArr[i].batchno ? MedicineentriesArr[i].batchno : '')
      expirydate.push(MedicineentriesArr[i].expirydate ? MedicineentriesArr[i].expirydate : '')
      manufacturingDate.push(MedicineentriesArr[i].manufacturingDate ? MedicineentriesArr[i].manufacturingDate : '')
      MRP.push(MedicineentriesArr[i].MRP ? Number(MedicineentriesArr[i].MRP) : '')
      Rate.push(MedicineentriesArr[i].Rate ? Number(MedicineentriesArr[i].Rate) : '')
      Discount.push(MedicineentriesArr[i].Discount ? Number(MedicineentriesArr[i].Discount) : 0)
      tradeDiscount.push(MedicineentriesArr[i].tradeDiscount ? Number(MedicineentriesArr[i].tradeDiscount) : 0)
      sgst.push(MedicineentriesArr[i].sgst ? Number(MedicineentriesArr[i].sgst) : '')
      sgstpercent.push(MedicineentriesArr[i].sgstper ? Number(MedicineentriesArr[i].sgstper) : 0)
      cgst.push(MedicineentriesArr[i].cgst ? Number(MedicineentriesArr[i].cgst) : '')
      cgstpercent.push(MedicineentriesArr[i].cgstper ? Number(MedicineentriesArr[i].cgstper) : 0)
      igst.push(MedicineentriesArr[i].igst ? Number(MedicineentriesArr[i].igst) : '')
      igstpercent.push(MedicineentriesArr[i].igstper ? Number(MedicineentriesArr[i].igstper) : 0)
      costperunit.push(MedicineentriesArr[i].costperunit ? Number(MedicineentriesArr[i].costperunit) : '')
      totalamount.push(MedicineentriesArr[i].totalamount ? Number(MedicineentriesArr[i].totalamount) : '')
      quantity.push(MedicineentriesArr[i].Qty ? Number(MedicineentriesArr[i].Qty) : '')
      freequantity.push(MedicineentriesArr[i].freeQty ? Number(MedicineentriesArr[i].freeQty) : 0)
    }

    totalamount.forEach(item => {
      grosstotal += Number(item)
    })
    console.log(Is_consumable, grosstotal, Type, MedId, medname, batches, expirydate, manufacturingDate, MRP, Rate, Discount, tradeDiscount, sgst, sgstpercent, cgst, cgstpercent, igst, igstpercent, costperunit, totalamount, quantity, freequantity)
    var Data = {
      distributor_id: vendorid,
      purchase_order_id: po,
      invoice_no: invoice,
      bill_date: invoicedate,
      clinic_id: ClinicId,
      channel: channel,
      is_consumable: Is_consumable,
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
    setload(true)
    try {
      await axios.post(`${url}/purchase/entry/save`, Data).then((response) => {
        setload(false)
        props.GETPurchaseList()
        setload(false)
        props.toggle_npef()
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message)
        } else {
          Notiflix.Notify.warning(response.data.message)
        }
      })
    } catch (e) {
      setload(false)
      Notiflix.Notify.warning(e.message)
    }

  }
  const ClearFields = () => {
    setMedicineentriesArr()
    setchannel()
    setpo()
    setinvoice()
    setinvoicedate()
    setvendorname()
    setvendorid()
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
    setIsConsumable(0)
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
          isconsumable: IsConsumable,
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
    total = total ? parseFloat(total).toFixed(2) : total
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

  const searchmedAuto = async (search) => {

    await axios.get(`${url}/item/search?search=${search}`).then((response) => {
      let medicines = []
      let vaccines = []
      let items = []
      medicines.push(response.data.data.medicines ? response.data.data.medicines : [])
      vaccines.push(response.data.data.vaccines ? response.data.data.vaccines : [])
      items = medicines.concat(vaccines)
      items = items.flat()
      console.log(items)
      if (items[0] && items[0].id !== undefined) {
        let ID = items[0].id
        return ID
      } else {
        return 'Please Select ID'
      }

      // for(let i=0;i<items.length;i++){
      //     if(items[i].itemname){

      //     }
      // }
    })


  }
  const CalGST = (rate, cgst) => {
    let gst = 0
    if (cgst && rate) {
      gst = (cgst * rate) / 100
      gst = Number(gst)
      gst = gst.toFixed(2)
      return gst
    } else {
      return 0
    }
  }
  const Disc = (rate, dis) => {
    let disrate = 0
    if (rate && dis) {
      disrate = (rate * dis) / 100
      return disrate
    } else {
      return 0
    }
  }
  const SubmitExcel = () => {
    if (Tableref.current.files[0].type == "application/vnd.ms-excel") {
      let SelectedFile = Tableref.current.files[0]
      let reader = new FileReader();
      reader.readAsArrayBuffer(SelectedFile)
      reader.onload = (e) => {
        setExceldata(e.target.result)
      }
    } else {
      Notiflix.Notify.failure('Choose Only Excel File to Upload')
    }
  }
  const ConvertExcel = async () => {

    let e = []
    if (vendorid == 2) {
      if (Exceldata && Exceldata.length != 0) {
        const Excelfile = XLSX.read(Exceldata, { 'type': 'buffer' });
        const ExcelSheet = Excelfile.SheetNames[0]
        const Sheet = Excelfile.Sheets[ExcelSheet]
        const data = XLSX.utils.sheet_to_json(Sheet)
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          let expiry = data[i].EXPIRY.replace('/', '-20')
          expiry = '01-' + expiry
          expiry = reversefunction(expiry)
          let CpU = Number(data[i].SRATE)
          CpU = data[i]['CGST'] ? CpU + Number(CalGST(CpU, data[i]['CGST'])) + Number(CalGST(CpU, data[i]['SGST'])) : CpU
          CpU = CpU - Number(Disc(CpU, data[i].DIS))
          CpU = Number(CpU).toFixed(2)
          let ITEMID = await searchmedAuto(data[i]['ITEM NAME'])
          console.log(ITEMID)

          MedicineentriesObj = {
            type: '',
            Itemid: '',
            Itemname: data[i]['ITEM NAME'],
            batchno: data[i].BATCH,
            expirydate: expiry,
            manufacturingDate: manufdate,
            MRP: data[i].MRP,
            Rate: data[i].SRATE,
            Qty: data[i].QTY,
            freeQty: data[i]['F.QTY'],
            Discount: '',
            tradeDiscount: data[i].DIS,
            sgstper: data[i]['SGST'],
            sgst: CalGST(data[i].SRATE, data[i]['SGST']),
            cgstper: data[i]['CGST'],
            cgst: CalGST(data[i].SRATE, data[i]['CGST']),
            igstper: CalGST(data[i].SRATE, data[i]['IGST']),
            igst: data[i].IGST,
            costperunit: CpU,
            totalamount: CpU * data[i].QTY.toFixed(2)
          }
          e.push(MedicineentriesObj)
          console.log(e)
        }
      }
    }
    if (vendorid == 4 || vendorid == 3) {
      if (Exceldata && Exceldata.length != 0) {
        const Excelfile = XLSX.read(Exceldata, { 'type': 'buffer' });
        const ExcelSheet = Excelfile.SheetNames[0]
        const Sheet = Excelfile.Sheets[ExcelSheet]
        const data = XLSX.utils.sheet_to_json(Sheet)
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          let expiry = '20' + data[i].EXPYEAR
          expiry = expiry + (data[i].EXPMONTH < 10 ? '-' + '0' + data[i].EXPMONTH : '-' + data[i].EXPMONTH)
          expiry = expiry + (data[i].EXPDAY < 10 ? '-' + '0' + data[i].EXPDAY : data[i].EXPDAY)
          let CpU = Number(data[i].SRATE)
          CpU = data[i]['CGST'] ? CpU + Number(CalGST(CpU, data[i]['CGST'])) + Number(CalGST(CpU, data[i]['SGST'])) : CpU
          CpU = CpU - Number(Disc(CpU, data[i].DIS))
          CpU = Number(CpU).toFixed(2)
          // let mfddate = data[i].INVYEAR
          // mfddate = mfddate + (data[i].INVMONTH < 10 ? '-' + '0' + data[i].INVMONTH : '-' + data[i].INVMONTH)
          // mfddate = mfddate + (data[i].INVDAY < 10 ?  ('-' + '0' + data[i].INVDAY) :'-'+ data[i].INVDAY)
          // console.log(mfddate)
          MedicineentriesObj = {
            type: '',
            Itemid: '',
            Itemname: data[i]['ITEM NAME'],
            batchno: data[i].BATCH,
            expirydate: expiry,
            manufacturingDate: '',
            MRP: data[i].MRP,
            Rate: data[i].SRATE,
            Qty: data[i].QTY,
            freeQty: data[i]['F.QTY'],
            Discount: '',
            tradeDiscount: data[i].DIS,
            sgstper: data[i]['SGST'],
            sgst: CalGST(data[i].SRATE, data[i]['SGST']),
            cgstper: data[i]['CGST'],
            cgst: CalGST(data[i].SRATE, data[i]['CGST']),
            igstper: CalGST(data[i].SRATE, data[i]['IGST']),
            igst: data[i].IGST,
            costperunit: CpU,
            totalamount: (CpU * data[i].QTY).toFixed(2)
          }
          e.push(MedicineentriesObj)
        }
      }
    }
    if (MedicineentriesArr == undefined || MedicineentriesArr.length == 0) {
      setMedicineentriesArr(e)
    } else {
      setMedicineentriesArr(prevState => [...prevState, e])
    }
  }
  const ToggleNewMedicine = () => {
    if (NewMed == 'block') {
      setNewMed('none')
    }
    if (NewMed == 'none') {
      setNewMed('block')
    }
  }
  // console.log(vendorid, vendorsearch, vendorcode, IsConsumable)
  console.log(MedicineentriesArr)
  return (

    <div className="container-fluid p-0 m-0" style={{ zIndex: '2' }}>
      <div className="container-fluid bg-seashell border border-2 border-top-0 border-start-0 border-end-0 ">
        <div className="row p-0 m-0 p-2">
          <div className="col-1">
            <button type="button" className="btn-close closebtn m-auto mt-2" onClick={props.toggle_npef} aria-label="Close" ></button>
          </div>
          <div className="col-8 col-md-7 col-lg-8 col-xl-8">
            <h5 className="text-center mt-2"> New Purchase Entry </h5>
          </div>
          <div className="col-auto">
            {
              load ? (
                <div className="col-6 py-2 pb-2 m-auto text-center" >
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button disabled={MedicineentriesArr == undefined || MedicineentriesArr && MedicineentriesArr.length == 0 ? true : false} className="button button-charcoal" onClick={() => { confirmmessage(MedicineentriesArr, vendorname) }}>Save All</button>
              )
            }
          </div>
          <div className="col-auto">
            <button className='button button-burntumber' onClick={ClearFields}>Clear All</button>
          </div>
        </div>
      </div>
      <div className="container-fluid p-0 m-0 entrydetails bg-pearl" style={{ Height: '90vh' }}>
        <div className="row p-0 m-0">
          <div className={`col-${vendorid ? '8' : '12'} p-0 m-0`}>

            <div className="row p-0 m-0 align-items-center">
              <div className="col-auto">
                <div className="row p-0 m-0">
                  <div className="col-auto">
                    <input type="checkbox" className="form-check-input" checked={channel == 1 ? true : false} value='1' onClick={(e) => { setchannel(e.target.value) }} />
                  </div>
                  <div className="col-auto">
                    <span className="ms-0">Pharmacy</span>
                  </div>
                </div>
              </div>
              <div className="col-auto">
                <div className="row">
                  <div className="col-auto">
                    <input type="checkbox" className="form-check-input" checked={channel == 2 ? true : false} value='2' onClick={(e) => { setchannel(e.target.value) }} />
                  </div>
                  <div className="col-auto">
                    <span className="ms-0">Clinic</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8 p-0 m-0">
              <div className="row p-0 m-0 gx-2 gy-1">
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Select PO</h6>
                  <input className="form-control ms-2 rounded-1" placeholder="Enter PO" value={po ? po : ''} onChange={(e) => { setpo(e.target.value) }} style={{ zIndex: '5' }} />
                </div>
                <div className="col-5">
                  <h6 className="p-0 m-0 ms-3 fw-bold">Select Vendor</h6>
                  <input className="form-control ms-2 rounded-1" placeholder='Search Vendors' value={vendorname ? vendorname : ''} onChange={(e) => { searchvendors(e.target.value); setvendorname(e.target.value); setvendorid(); setvendorcode() }} />
                  <div ref={vendorsref} className='position-absolute ms-2 rounded-2 bg-pearl col-2' style={{ zIndex: '5' }} >
                    {
                      vendorsearch ? (
                        loadvendors ? (
                          <div className='rounded-2 p-1 bg-pearl mt-1 border shadow' style={{ width: 'fit-content' }}>
                            Searching Please wait....
                            <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                              <span className="sr-only"></span>
                            </div>
                          </div>
                        ) : (
                          vendorsearch.length == 0 ? (
                            <div className="bg-burntumber text-light rounded-2 p-2">Oops! Not Avaliable</div>
                          ) : (
                            <div className='bg-pearl border shadow rounded-2 p-1' style={{ zIndex: '40', width: 'fit-content' }}>
                              {
                                vendorsearch.map((data, i) => (
                                  <div style={{ cursor: 'pointer' }} className={`p-0 p-1 d-${vendorsearch == undefined || vendorsearch.length > 0 ? '' : 'none'}  bg-${((i % 2) == 0) ? 'pearl' : 'lightblue'} fs-6 `} name={data.id} onClick={(e) => { setvendorname(data.entity_name); setvendorid(data.id); setvendorcode(data.state_code); filterclinic(); vendorsref.current.style.display = 'none'; }}>{data.entity_name}</div>
                                ))
                              }
                            </div>
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
                  <button className="button button-charcoal m-0 p-0 py-1 px-4" onClick={ToggleNewMedicine}> <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" style={{ width: "1.5rem" }} /> Medicine </button>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-5">
                      <input ref={Tableref} className='form-control w-100 p-0 m-0 px-2 py-1 rounded-2 bg-pearl' onChange={SubmitExcel} type='file' />
                    </div>
                    <div className="col-5 text-end">
                      <button className='button button-lightyellow p-0 m-0 px-3 py-1' onClick={ConvertExcel}>Submit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" p-0 m-0 scroll scroll-y" style={{ maxHeight: '50vh', Height: '50vh' }}>
              <table className="table m-0 datatable bg-pearl text-start position-relative">
                <thead className=' bg-pearl position-sticky top-0' style={{ color: 'gray', fontWeight: '600' }}>
                  <tr>
                    <th>Edit</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    {/* <th>Manuf. Date</th> */}
                    <th>batch No.</th>
                    <th>Expiry Date</th>
                    <th>MRP</th>
                    <th>Rate</th>
                    <th>Total Disc</th>
                    <th>Qty.</th>
                    <th>Cost</th>
                    <th>Amount</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                {
                  MedicineentriesArr ? (
                    <tbody style={{ Height: '48vh', maxHeight: '48vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                      {
                        MedicineentriesArr.map((item, _key) => (
                          <tr key={_key} className={`bg-${_key % 2 == 0 ? 'lightred50' : 'pearl'}`}>
                            <td><input type='checkbox' checked={_key == tableindex ? true : false} onClick={() => { indexing(_key) }} className='bg-seashell' /></td>
                            <td>{item.Itemid}</td>
                            <td>{item.Itemname}</td>
                            {/* <td>{reversefunction(item.manufacturingDate)}</td> */}
                            <td>{item.batchno}</td>
                            <td>{reversefunction(item.expirydate)}</td>
                            <td>{item.MRP}</td>
                            <td>{item.Rate}</td>
                            <td>{Number(item.Discount) + Number(item.tradeDiscount)}</td>
                            <td>{item.Qty}</td>
                            <td>{item.costperunit}</td>
                            <td>{item.totalamount}</td>
                            <td ><button onClick={() => { DeleteMedicine(item.Itemid); }} className='btn btn-sm button-burntumber'>Delete</button></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  ) : (
                    MedicineentriesArr && MedicineentriesArr.length == 0 ? (
                      <tbody className="position-relative bg-pearl text-center" style={{ height: '48vh', maxHeight: '48vh', color: 'var(--charcoal)', fontWeight: '600' }}>
                        <tr >
                          <td className="position-absolute start-0 end-0 top-0">No items Added</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="position-relative bg-pearl text-center" style={{ height: '48vh', maxHeight: '48vh', color: 'var(--charcoal)', fontWeight: '600' }}>
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
          <div className={`col-4 m-0 p-0 scroll scroll-y border border-1 medicineinfosection d-${vendorid ? 'block' : 'none'} bg-seashell ps-2`} id='medicineinfosection' style={{ maxHeight: '81vh', Height: '81vh' }}>
            <h5 className="mt-2">Add Items</h5>
            <div className="col-12">
              <input type='checkbox' checked={IsConsumable == 0 ? false : true} className='form-check-input' onChange={() => { IsConsumable == 0 ? setIsConsumable(1) : setIsConsumable(0) }} /> <label>Is Consumable</label>
              <div className=" col-10 col-md-11">
                <div className='position-relative'>
                  <label>Search Items </label>
                  <input className='form-control bg-seashell' placeholder='Items' value={itemname ? itemname : ''} onChange={(e) => { searchmeds(e.target.value); setitemname(e.target.value); setitemtype() }} />
                  <div ref={medicinesref} className='position-absolute rounded-4 col-12' style={{ zIndex: '2' }}  >
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
                            <div className="bg-burntumber text-light rounded-2 p-1 text-wrap">Oops! Not Avaliable</div>
                          ) : (
                            <div className={`mt-1 rounded-4 bg-pearl shadow px-1 pb-2 d-${itemsearch && itemsearch.length > 1 ? 'block' : 'none'}`}>
                              <p className={`p-0 m-0 bg-pearl fw-bold text-charcoal75 rounded-4 ps-2 `} style={{ fontSize: '0.8rem' }}>{itemsearch.length} Search Results</p>
                              {
                                itemsearch.map((data, i) => (
                                  <div style={{ cursor: 'pointer' }} className={`p-0 ps-1 text-wrap  bg-${((i % 2) == 0) ? '' : 'lightyellow'}`} name={data.id} onClick={(e) => { setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); setitemtype(data.vaccines_id ? 'v' : 'm'); medicinesref.current.style.display = 'none'; }}>{data.display_name ? data.display_name : data.name}</div>
                                ))
                              }
                            </div>
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
      <section className={`position-absolute top-0 start-0 end-0 d-${NewMed}`}>
        <NewMedicine ToggleNewMedicine={ToggleNewMedicine} />
      </section>
    </div>
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
  const [channel, setchannel] = useState(1)
  const [fromdate, setfromdate] = useState()
  const [todate, settodate] = useState()
  const [Loading, setLoading] = useState(false)
  const [purchasereturnarr, setpurchasereturnarr] = useState([])
  const [purchasereturnarrExcel, setpurchasereturnarrExcel] = useState([])
  const [index, setindex] = useState()
  const [nref, setnref] = useState("none");
  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()
  function GetPages() {
    try {
      axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 25) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }
  function GETPurchaseReturns(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true)
      try {
        axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          setpurchasereturnarr(response.data.data.purchase_return)
          setpagecount(response.data.data.total_count)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e.message)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.data.message)
        setLoading(false)
      }
    } else {
      setLoading(true)
      try {
        axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=25&offset=${Data.selected * 25}&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
          setpurchasereturnarr(response.data.data.purchase_return)
          setpagecount(response.data.data.total_count)
          setLoading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e.message)
          setLoading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.data.message)
        setLoading(false)
      }
    }
  }
  function GETPurchaseReturnsForExcel() {
    setLoading(true)
    try {
      axios.get(`${url}/purchase/return?clinic_id=${ClinicID}&channel=${channel}&limit=${pagecount}&offset=0&from_date=${fromdate ? fromdate : currentDate}&to_date=${todate ? todate : fromdate ? fromdate : currentDate}`).then((response) => {
        setpurchasereturnarrExcel(response.data.data.purchase_return)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.data.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    GetPages()
  }, [channel, fromdate, todate])

  useEffect(() => {
    GETPurchaseReturns()
    GETPurchaseReturnsForExcel()
  }, [pagecount])

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
  return (
    <>
      <button className="button addpurchase button-charcoal position-absolute" onClick={toggle_nref}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Return</button>
      <div className="row p-0 m-0 justify-content-lg-between justify-content-md-evenly justify-content-left text-center">
        <div className="col-lg-2 col-md-2 col-4 text-center p-0 m-0 order-lg-0 order-md-0 order-sm-0 order-0 ms-lg-0 ms-md-0 ms-sm-0 ms-1 ">
          <button type='button' className="btn p-0 m-0 heading text-charcoal fw-bolder  " style={{ width: 'fit-content' }}>{pagecount}  {pagecount > 0 ? 'Purchase Returns' : 'Purchase Return'} </button>
        </div>
        <div className="col-lg-8 col-md-7 col-sm-7 col-11 ms-lg-0 ms-md-0 ms-sm-0 ms-3 align-self-center p-0 m-0 order-lg-1 order-md-1 order-sm-1 order-2 mt-lg-0 mt-md-0 mt-1  ">
          <div className="row p-0 m-0 border-burntumber fw-bolder rounded-2 text-center justify-content-center ">
            <div className="col-4">
              <select className='p-0 m-0 border-0 text-burntumber bg-pearl fw-bolder' value={channel ? channel : ''} onChange={(e) => { setchannel(e.target.value) }}>
                <option className='border-0 text-burntumber fw-bolder' value='1'>Pharmacy</option>
                <option className='border-0 text-burntumber fw-bolder' value='2'>Consumables</option>
              </select>
            </div>
            <div className="col-4 text-burntumber fw-bolder bg-pearl ">
              <input type='date' className='p-0 m-0 border-0 bg-pearl text-burntumber fw-bolder ' value={fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { setfromdate(e.target.value) }} />
            </div>
            <div className="col-4 text-burntumber fw-bolder bg-pearl rounded-2 ">
              <input type='date' className='p-0 m-0 border-0 bg-pearl text-burntumber fw-bolder ' value={todate ? todate : fromdate ? fromdate : currentDate ? currentDate : ''} onChange={(e) => { settodate(e.target.value) }} />
            </div>
          </div>
        </div>
        <div className="col-2 export col-md-2 col-lg-2 align-self-center order-lg-2 order-md-2 order-sm-0 order-1 ">
          <ExportPurchaseReturn purchasereturnarr={purchasereturnarrExcel} fromdate={reversefunction(fromdate)} todate={reversefunction(todate)} />
        </div>
      </div>
      <div className='scroll scroll-y overflow-scroll p-0 m-0' style={{ minHeight: '57vh', height: '57vh' }}>
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
              <body className=' text-center' style={{ minHeight: '57vh' }}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div className="d-flex align-items-center">
                    <strong className='fs-5'>Getting Details please be Patient ...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
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
                          <button className="btn" onClick={() => { setindex(i); toggle_pridw() }}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></button></td>
                        <td className='p-0 m-0 text-charcoal fw-bold'><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                        <td className={` position-absolute d-${i == index ? pridw : 'none'} border border-1 start-0 end-0 bg-seashell p-0 m-0`} style={{ Height: '90vh', top: '-7.15rem', zIndex: '2' }} >
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
      <div className="container-fluid mt-2 d-flex justify-content-center">
        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'. . .'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GETPurchaseReturns}
          containerClassName={'pagination'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active'}
        />
      </div>

      <section className={`newreturnentrysection position-absolute bg-seashell border border-1 start-0 end-0  d-${nref}`}  >
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
  function TotalTaxRate(cgst, sgst, igst, qty) {
    if (cgst && sgst && igst !== null || undefined) {
      let e = Number(Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
      e = e.toFixed(2)
      return e
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
      <div className="container-fluid bg-seashell p-0 m-0 position-relative">
        <h5 className='text-center text-charcoal mt-3'>{props.itembillid} Purchase Return Item Details</h5>
        <button type="button" className="btn-close closebtn position-absolute end-0 me-2 " onClick={props.toggle_pridw} aria-label="Close"></button>
        <div className="col-2 d-none">
          <div className=' position-relative searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
            <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
            <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{ width: '2rem', right: '0', left: '0', top: '0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
          </div>
        </div>

      </div>
      <div className='d-flex justify-content-center p-0 m-0 mt-3 mb-1'>
        {
          Items.map((data, i) => (

            <button className={`button border-charcoal rounded-0 button-${i == index ? 'charcoal' : 'seashell'}`} onClick={() => { setindex(i) }}>{data}</button>

          ))
        }

      </div>

      <div className="d-flex justify-content-end me-5 ">
        <input type='checkbox' className='' value={Taxon ? Taxon : ''} onChange={() => { Taxon == true ? setTaxon(false) : setTaxon(true) }} /><label>Show Tax Details</label>
      </div>

      <div className={`scroll bg-seashell scroll-y d-${medicine}`} style={{ minHeight: '70vh', maxHeight: '70vh' }}>

        <table className="table datatable text-center bg-seashell">
          <thead>
            <tr>
              <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>MRP</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Rate</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Qty.</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
              <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className='border p-0 m-0 px-1'>Total Tax</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Cost</th>
              <th rowspan='2' className='border p-0 m-0 px-1'>Total</th>

            </tr>
            <tr>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
              <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
              <th scope='col' className={`border p-0 m-0 px-1`}>Total</th>
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
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.discount ? item.discount : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.trade_discount ? item.trade_discount : 'N/A'}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST_rate ? Number(item.SGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.SGST ? Number(item.SGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST_rate ? Number(item.CGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.CGST ? Number(item.CGST) * Number(item.qty) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST_rate ? Number(item.IGST_rate) : ''}</td>
                      <td className={`border p-0 m-0 align-middle d-${Taxon == true ? '' : 'none'}`}>{item.IGST ? Number(item.IGST) * Number(item.qty) : ''}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxPercent(item.CGST_rate, item.SGST_rate, item.IGST_rate)}</td>
                      <td className='border p-0 m-0 align-middle'>{TotalTaxRate(item.CGST, item.SGST, item.IGST, item.qty)}</td>
                      <td className='border p-0 m-0 align-middle'>{item.cost ? item.cost : 'N/A'}</td>
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>
                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                  <p className=' text-charcoal fw-bold text-center'>No Medicines Found</p>
                </div>

              </body>
            )


          }
        </table>
      </div>
      <div className={`scroll bg-seashell scroll-y d-${vaccine}`} style={{ minHeight: '70vh', maxHeight: '70vh' }}>

        <table className="table datatable table-responsive text-center bg-seashell"><thead>
          <tr>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item ID</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Item Name</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Batch No.</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Expiry Date</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>MRP</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Rate</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Disc%</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Trade Disc%</th>
            <th colspan={Taxon == true ? '8' : '2'} scope='col-group' className={`border p-0 m-0 px-1`}>Total Tax</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Cost</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Qty</th>
            <th rowspan='2' className='border p-0 m-0 px-1'>Total</th>
          </tr>
          <tr>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>CGST</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>SGST </th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST%</th>
            <th scope='col' className={`border p-0 m-0 px-1 d-${Taxon == true ? '' : 'none'}`}>IGST </th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total%</th>
            <th scope='col' className={`border p-0 m-0 px-1`}>Total</th>
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
                      <td className='border p-0 m-0 align-middle'>{item.qty ? item.qty : 'N/A'}</td>
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
                      <td className='border p-0 m-0 align-middle'>{item.total_amount ? item.total_amount : 'N/A'}</td>

                    </tr>
                  ))
                }

              </tbody>

            ) : (
              <body className='text-center p-0 m-0 border border-1 '>
                <div className='position-absolute border-0 start-0 end-0 mx-3 p-2'>
                  <p className=' text-center fw-bold'>No Vaccines Found</p>
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
  const [load, setload] = useState()

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
    setload(true)
    try {
      await axios.post(`${url}/purchase/return/save`, Data).then((response) => {
        props.GETPurchaseReturns()
        setMedicineentriesArr()
        setvendorname()
        setvendorid()
        setitemname()
        setload(false)
        props.toggle_nref()
        if (response.data.status == true) {
          Notiflix.Notify.success(response.data.message)
        } else {
          Notiflix.Notify.warning(response.data.message)
        }
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setload(false)
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
    <div className="newpurchaseentryform p-0 m-0">
      <div className=" p-0 m-0">
        <div className="container-fluid p-0 m-0 bg-seashell position-relative  ">
          <h5 className="text-center mt-3" style={{ color: "var(--charcoal)" }} >New Purchase Return Entry</h5>
          <button type="button" className="btn-close position-absolute end-0 closebtn me-2" onClick={props.toggle_nref} aria-label="Close" ></button>
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
      <div className='col-12 position-absolute start-0 end-0 bottom-0 rounded-bottom text-center bg-pearl align-items-center border border-1 py-3'>
        <div className="row p-0 m-0">
          <div className="col-auto">
            <div className="row">
              <div className="col-auto">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Order Total </p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{Grand()}</h4>
              </div>
              <div className="col-auto">
                <p className='text-charcoal75 p-0 m-0 fw-bolder card-title text-start ms-3'> Total Items</p>
                <h4 className='text-charcoal  p-0 m-0 fw-bolder card-header text-start ps-3'>{MedicineentriesArr ? MedicineentriesArr.length : 0}</h4>
              </div>
            </div>
          </div>
          <div className="col-4 mx-auto align-self-center text-end">
            {
              load ? (
                <div className="col-6 py-2 pb-2 m-auto text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button className='button button-charcoal px-5' onClick={confirmmessage}>Save Entry</button>
              )

            }
          </div>
        </div>
      </div>
    </div>
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
      <section className='stocksection pt-1'>
        <div className="container-fluid">
          <div className="row gx-3">
            <div className='row m-0 p-0'>
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
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid pt-3'>
          <div className="">
            {_selectedmenu(menuindex)}
          </div>
        </div>
      </section>
    </>
  )
}
function Stockvaccinesection() {
  const url = useContext(URL)
  const Todaydate = useContext(TodayDate)
  const [pagecount, setpagecount] = useState()
  const [pages, setpages] = useState()
  const [vaccineslist, setvaccineslist] = useState([])
  const [vaccinearr, setvaccinearr] = useState([])
  const [load, setload] = useState()
  const [searchname, setsearchname] = useState('')
  const [index, setindex] = useState()
  const [detailsform, setdetailsform] = useState('none')
  function GetPages() {
    try {
      axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count_vaccines)
        setpages(Math.round(response.data.data.total_count_vaccines / 10) + 1)
        setload(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setload(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setload(false)
    }
  }
  const GetVaccines = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true)
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`).then((response) => {
          console.log(response.data.data)
          setvaccineslist(response.data.data.vaccines)
          setload(false)
        }).catch(function error(e) {
          Notiflix.Notify.failure(e.message)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    } else {
      setload(true)
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=${Data.selected * 10}`).then((response) => {
          console.log(response.data.data)
          setvaccineslist(response.data.data.vaccines)

          setload(false)
        }).catch(function error(e) {
          Notiflix.Notify.failure(e.message)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    }

  }
  // const GetVaccines = async () => {
  //   setload(true)
  //   try {
  //     axios.get(`${url}/stock/list?search=${searchname}&limit=${pagecount}&offset=0`).then((response) => {
  //       console.log(response.data.data)
  //       setvaccineslist(response.data.data.vaccines)

  //       setload(false)
  //     }).catch(function error(e) {
  //       Notiflix.Notify.failure(e.message)
  //       setload(false)
  //     })
  //   } catch (e) {
  //     Notiflix.Notify.failure(e.message)
  //     setload(false)
  //   }


  // }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  const Get_Detailed_Data = async () => {
    setvaccinearr([])
    for (let i = 0; i < vaccineslist.length; i++) {
      let totalcurrentstockarr = []
      if (vaccineslist[i].stock_info.length == 0) {
        let vaccineobj = {
          id: vaccineslist[i].id,
          name: vaccineslist[i].name,
          manufacturer: vaccineslist[i].manufacturer,
          max_stock_count: vaccineslist[i].max_stock_count,
          alert_stock_count: vaccineslist[i].alert_stock_count,
          min_stock_count: vaccineslist[i].min_stock_count,
        }
        console.log(vaccineobj)
        if (vaccinearr == undefined && vaccinearr.length == 0) {
          setvaccinearr(vaccineobj)
        } else {
          setvaccinearr(prevState => [...prevState, vaccineobj])
        }

      } else {
        for (let j = 0; j < vaccineslist[i].stock_info.length; j++) {
          totalcurrentstockarr.push(vaccineslist[i].stock_info[j].current_stock)
          let ExpireDays = Get_Diff(vaccineslist[i].stock_info[j].expiry_date)
          let vaccineobj = {
            id: vaccineslist[i].id,
            name: vaccineslist[i].name,
            manufacturer: vaccineslist[i].manufacturer,
            max_stock_count: vaccineslist[i].max_stock_count,
            alert_stock_count: vaccineslist[i].alert_stock_count,
            min_stock_count: vaccineslist[i].min_stock_count,
            CGST: vaccineslist[i].stock_info[j].CGST,
            CGST_rate: vaccineslist[i].stock_info[j].CGST_rate,
            IGST: vaccineslist[i].stock_info[j].IGST,
            IGST_rate: vaccineslist[i].stock_info[j].IGST_rate,
            SGST: vaccineslist[i].stock_info[j].SGST,
            SGST_rate: vaccineslist[i].stock_info[j].SGST_rate,
            batch_no: vaccineslist[i].stock_info[j].batch_no,
            channel: vaccineslist[i].stock_info[j].channel,
            cost: vaccineslist[i].stock_info[j].cost,
            current_stock: vaccineslist[i].stock_info[j].current_stock,
            discount: vaccineslist[i].stock_info[j].discount,
            expiry_date: vaccineslist[i].stock_info[j].expiry_date,
            free_qty: vaccineslist[i].stock_info[j].free_qty,
            Batch_stock_id: vaccineslist[i].stock_info[j].id,
            mfd_date: vaccineslist[i].stock_info[j].mfd_date,
            mrp: vaccineslist[i].stock_info[j].mrp,
            purchase_entry_id: vaccineslist[i].stock_info[j].purchase_entry_id,
            qty: vaccineslist[i].stock_info[j].qty,
            rate: vaccineslist[i].stock_info[j].rate,
            trade_discount: vaccineslist[i].stock_info[j].trade_discount,
            total_amount: vaccineslist[i].stock_info[j].total_amount,
            totalstock: totalcurrentstockarr,
            Days_to_expire: ExpireDays

          }
          if (vaccinearr == undefined && vaccinearr.length == 0) {
            setvaccinearr(vaccineobj)
          } else {
            setvaccinearr(prevState => [...prevState, vaccineobj])
          }
        }
      }


    }
  }
  // const Do_Pagination = (Data) => {
  //   let limit = 10;
  //   let arr = []
  //   let previous = 0
  //   let next = limit
  //   if (Data == undefined || Data.selected == undefined) {
  //     for (var i = 0; i < limit; i++) {
  //       arr.push(vaccinearr[i]);
  //     }
  //   } else {
  //     console.log(Data.selected)
  //     Data.selected = Number(Data.selected)
  //     previous = ((Data.selected + 1) * limit)
  //     next = (Data.selected + 2 * limit)
  //     for (var i = previous; i < next; i++) {
  //       arr.push(vaccinearr[i]);
  //     }
  //     console.log(arr)
  //   }

  // }

  const CalculateTStock = (totalarr) => {
    if (totalarr !== undefined) {
      let total = 0
      totalarr.map((item) => (
        total += Number(item)
      ))
      return total
    }

  }

  const GetStatus = (totalstockarr, alertstockcount) => {
    if (totalstockarr !== undefined) {
      let total = 0
      totalstockarr.map((item) => (
        total += Number(item)
      ))

      if (total <= alertstockcount) {
        return 1
      } else {
        return 0
      }
    }

  }

  const toggle_detailsform = () => {
    if (detailsform == 'none') {
      setdetailsform('block')
    }
    if (detailsform === 'block') {
      setdetailsform('none')
      setindex()
    }
  }
  const reversefunction2 = (date) => {
    if (date) {
      let newdate = []
      let DATE = ''
      date = date.split("-").reverse()
      newdate.push(date[1])
      newdate.push(date[0])
      newdate.push(date[2])
      DATE = newdate[0] + '/' + newdate[1] + '/' + newdate[2]
      return DATE
    }

  }
  const Get_Diff = (expiry) => {
    // let currentdate = reversefunction(Todaydate).replaceAll('-', '/')
    let expirydate = reversefunction2(expiry)
    var date1 = new Date()
    var date2 = new Date(expirydate)
    const diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(Number(diffTime) / (1000 * 60 * 60 * 24));
    diffDays = (Number(diffDays) / 30).toFixed(1)
    return diffDays
  }

  useEffect(() => {
    GetPages()
    GetVaccines()
    Get_Detailed_Data()
  }, [pagecount, searchname])
  // Do_Pagination()
  useEffect(() => {
    Get_Detailed_Data()

  }, [vaccineslist])
  // vaccinearr.sort(function (a, b) { return a.Days_to_expire - b.Days_to_expire })
  console.log(vaccinearr)
  return (
    <div className='p-0 m-0 vaccinestockinfo'>
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className='position-absolute searchbutton' >
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Vaccine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn searchbtn p-0 m-0 bg-transparent border-0 position-absolute"><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <div className='heading text-start text-charcoal p-lg-2 p-md-2 p-2 ms-lg-5 ms-md-3 ms-1 fw-bold'>Vaccine Stock Info</div>
      <div className='scroll scroll-y'>
        <table className="table datatable text-start" >
          <thead className='position-sticky top-0 bg-pearl'>
            <tr className='text-start'>
              <th className='text-charcoal75 fw-bold'>No.</th>
              <th className='text-charcoal75 fw-bold'>ID</th>
              <th className='text-charcoal75 fw-bold'>Vaccine Name</th>
              <th className='text-charcoal75 fw-bold'>Batch No.</th>
              <th className='text-charcoal75 fw-bold'>Expiry Date</th>
              <th className='text-charcoal75 fw-bold'>MRP</th>
              <th className='text-charcoal75 fw-bold'>Cost/Unit</th>
              <th className='text-charcoal75 fw-bold'>B.Stock</th>
              <th className='text-charcoal75 fw-bold'>T.Stock</th>
              <th className='text-charcoal75 fw-bold text-center'>Expired in</th>
              <th className='text-charcoal75 fw-bold text-center'>Stock Status</th>
              <th className='text-charcoal75 fw-bold text-center'></th>
              <th className='text-charcoal75 fw-bold text-center'>more info</th>
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
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
              </tr>
            ) : (
              vaccinearr == undefined || vaccinearr.length == 0 ? (
                <tbody className='text-center' >
                  <tr>
                    <td className='position-absolute text-charcoal fw-bolder start-0 end-0'>No Vaccines Found</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className=''>
                  {/*  */}
                  {
                    vaccinearr.map((data, i) => (
                      <tr className={`text-start align-middle`}>
                        <td className=' text-charcoal fw-bold'>{i + 1}</td>
                        <td className=' text-charcoal fw-bold'>v{data.Batch_stock_id}</td>
                        <td className=' text-charcoal fw-bold'>{data.name && data.name !== null ? data.name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.batch_no}</td>
                        <td className=' text-charcoal fw-bold'>{reversefunction(data.expiry_date)}</td>
                        <td className=' text-charcoal fw-bold'>{data.mrp}</td>
                        <td className=' text-charcoal fw-bold'>{data.cost}</td>
                        <td className=' text-charcoal fw-bold'>{data.current_stock}</td>
                        <td className=' text-charcoal fw-bold'>{CalculateTStock(data.totalstock)}</td>
                        <td className={`text-${data.Days_to_expire <= 2 ? 'burntumber' : 'charcoal'} fw-bold text-center`}>{data.Days_to_expire} Months</td>
                        <td className=' text-charcoal fw-bold text-center'>
                          {
                            GetStatus(data.totalstock, data.alert_stock_count) == 1 ? (
                              <img src={process.env.PUBLIC_URL + 'images/exclamation.png'} style={{ 'width': '1.5rem' }} />
                            ) : (<></>)
                          }
                        </td>
                        <td className='p-0 m-0 text-charcoal fw-bold align-items-center text-center '>
                          <div className='vr rounded-2 align-self-center' style={{ padding: '0.8px' }}></div>
                        </td>
                        <td className={` bg-${index == i ? 'lightyellow' : ''} p-0 m-0 text-charcoal fw-bold text-center`}>
                          <button className='btn p-0 m-0' onClick={() => { setindex(i); toggle_detailsform() }}>
                            <img src={process.env.PUBLIC_URL + 'images/info.png'} style={{ 'width': '1.5rem' }} />
                          </button>
                        </td>
                        {
                          index == i ? (
                            <td className={`stockdetailsfrom bg-white border border-1 col-lg-11 rounded-4 shadow p-0 col-md-12 col-sm-11 col-10 col-xl-6 d-${index == i ? detailsform : 'none'} position-absolute start-0 end-0 top-0`}>
                              <VaccinesectionItemDetails toggle_detailsform={toggle_detailsform} data={vaccinearr[i]} />
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
      <div className="container-fluid d-flex justify-content-center mt-2">
        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'. . .'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GetVaccines}
          containerClassName={'pagination'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active'}
        />
      </div>
    </div>
  )
}
function Stockmedicinesection() {
  const url = useContext(URL)
  const [pagecount, setpagecount] = useState()
  const [pages, setpages] = useState()
  const [medicineslist, setmedicineslist] = useState([])
  const [medicinearr, setmedicinearr] = useState([])
  const [load, setload] = useState()
  const [searchname, setsearchname] = useState('')
  const [index, setindex] = useState()
  const [detailsform, setdetailsform] = useState('none')

  function GetPages() {
    try {
      axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count_medicines)
        setpages(Math.round(response.data.data.total_count_medicines / 10) + 1)
        setload(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setload(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setload(false)
    }
  }
  const GetMedicines = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true)
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=0`).then((response) => {
          setmedicineslist(response.data.data.medicines)
          setload(false)
        }).catch(function error(e) {
          Notiflix.Notify.failure(e.message)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    } else {
      setload(true)
      try {
        axios.get(`${url}/stock/list?search=${searchname}&limit=10&offset=${Data.selected * 10}`).then((response) => {
          setmedicineslist(response.data.data.medicines)
          setload(false)
        }).catch(function error(e) {
          Notiflix.Notify.failure(e.message)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    }

  }
  const Get_Detailed_Data = async () => {
    setmedicinearr([])
    for (let i = 0; i < medicineslist.length; i++) {
      let totalcurrentstockarr = []
      if (medicineslist[i].stock_info.length == 0) {
        let medicineobj = {
          id: medicineslist[i].id ? medicineslist[i].id : '',
          name: medicineslist[i].name ? medicineslist[i].name : '',
          manufacturer: medicineslist[i].manufacturer ? medicineslist[i].manufacturer : '',
          max_stock_count: medicineslist[i].max_stock_count ? medicineslist[i].max_stock_count : '',
          alert_stock_count: medicineslist[i].alert_stock_count ? medicineslist[i].alert_stock_count : '',
          min_stock_count: medicineslist[i].min_stock_count ? medicineslist[i].min_stock_count : '',
        }
        console.log(medicineobj)
        if (medicinearr == undefined && medicinearr.length == 0) {
          setmedicinearr(medicineobj)
        } else {
          setmedicinearr(prevState => [...prevState, medicineobj])
        }

      } else {
        for (let j = 0; j < medicineslist[i].stock_info.length; j++) {
          let ExpireDays = ''
          if (medicineslist[i].stock_info[j].current_stock) {
            totalcurrentstockarr.push(medicineslist[i].stock_info[j].current_stock)
          } else {
            totalcurrentstockarr = []
          }
          ExpireDays = Get_Diff(medicineslist[i].stock_info[j].expiry_date)

          let medicineobj = {
            id: medicineslist[i].id ? medicineslist[i].id : '',
            name: medicineslist[i].name ? medicineslist[i].name : '',
            manufacturer: medicineslist[i].manufacturer ? medicineslist[i].manufacturer : '',
            max_stock_count: medicineslist[i].max_stock_count ? medicineslist[i].max_stock_count : '',
            alert_stock_count: medicineslist[i].alert_stock_count ? medicineslist[i].alert_stock_count : '',
            min_stock_count: medicineslist[i].min_stock_count ? medicineslist[i].min_stock_count : '',
            CGST: medicineslist[i].stock_info[j].CGST ? medicineslist[i].stock_info[j].CGST : '',
            CGST_rate: medicineslist[i].stock_info[j].CGST_rate ? medicineslist[i].stock_info[j].CGST_rate : '',
            IGST: medicineslist[i].stock_info[j].IGST ? medicineslist[i].stock_info[j].IGST : '',
            IGST_rate: medicineslist[i].stock_info[j].IGST_rate ? medicineslist[i].stock_info[j].IGST_rate : '',
            SGST: medicineslist[i].stock_info[j].SGST ? medicineslist[i].stock_info[j].SGST : '',
            SGST_rate: medicineslist[i].stock_info[j].SGST_rate ? medicineslist[i].stock_info[j].SGST_rate : '',
            batch_no: medicineslist[i].stock_info[j].batch_no ? medicineslist[i].stock_info[j].batch_no : '',
            channel: medicineslist[i].stock_info[j].channel ? medicineslist[i].stock_info[j].channel : '',
            cost: medicineslist[i].stock_info[j].cost ? medicineslist[i].stock_info[j].cost : '',
            current_stock: medicineslist[i].stock_info[j].current_stock ? medicineslist[i].stock_info[j].current_stock : '',
            discount: medicineslist[i].stock_info[j].discount ? medicineslist[i].stock_info[j].discount : '',
            expiry_date: medicineslist[i].stock_info[j].expiry_date ? medicineslist[i].stock_info[j].expiry_date : '',
            free_qty: medicineslist[i].stock_info[j].free_qty ? medicineslist[i].stock_info[j].free_qty : '',
            Batch_stock_id: medicineslist[i].stock_info[j].id ? medicineslist[i].stock_info[j].id : '',
            mfd_date: medicineslist[i].stock_info[j].mfd_date ? medicineslist[i].stock_info[j].mfd_date : '',
            mrp: medicineslist[i].stock_info[j].mrp ? medicineslist[i].stock_info[j].mrp : '',
            purchase_entry_id: medicineslist[i].stock_info[j].purchase_entry_id ? medicineslist[i].stock_info[j].purchase_entry_id : '',
            qty: medicineslist[i].stock_info[j].qty ? medicineslist[i].stock_info[j].qty : '',
            rate: medicineslist[i].stock_info[j].rate ? medicineslist[i].stock_info[j].rate : '',
            trade_discount: medicineslist[i].stock_info[j].trade_discount ? medicineslist[i].stock_info[j].trade_discount : '',
            total_amount: medicineslist[i].stock_info[j].total_amount ? medicineslist[i].stock_info[j].total_amount : '',
            totalstock: totalcurrentstockarr ? totalcurrentstockarr : '',
            Days_to_expire: ExpireDays ? ExpireDays : ''

          }
          console.log(medicineobj)
          if (medicinearr == undefined && medicinearr.length == 0) {
            setmedicinearr(medicineobj)
          } else {
            setmedicinearr(prevState => [...prevState, medicineobj])
          }
        }
      }
    }
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  const reversefunction2 = (date) => {
    if (date) {
      let newdate = []
      let DATE = ''
      date = date.split("-").reverse()
      newdate.push(date[1])
      newdate.push(date[0])
      newdate.push(date[2])
      DATE = newdate[0] + '/' + newdate[1] + '/' + newdate[2]
      return DATE
    }

  }
  const Get_Diff = (expiry) => {
    // let currentdate = reversefunction(Todaydate).replaceAll('-', '/')
    let expirydate = reversefunction2(expiry)
    var date1 = new Date()
    var date2 = new Date(expirydate)
    const diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(Number(diffTime) / (1000 * 60 * 60 * 24));
    diffDays = (Number(diffDays) / 30).toFixed(1)
    return diffDays
  }
  const GetStatus = (totalstockarr, alertstockcount) => {
    if (totalstockarr && alertstockcount) {
      let total = 0
      totalstockarr.map((item) => (
        total += Number(item)
      ))

      if (total <= alertstockcount) {
        return 1
      } else {
        return 0
      }
    }

  }
  const CalculateTStock = (totalarr) => {
    let total = 0
    totalarr.map((item) => (
      total += Number(item)
    ))
    return total
  }
  useEffect(() => {
    GetPages()
    GetMedicines()
    Get_Detailed_Data()
  }, [pagecount, searchname])

  useEffect(() => {
    Get_Detailed_Data()
  }, [medicineslist])



  const toggle_detailsform = () => {
    if (detailsform == 'none') {
      setdetailsform('block')
    }
    if (detailsform === 'block') {
      setdetailsform('none')
      setindex()
    }
  }
  console.log(medicineslist, medicinearr)
  return (
    <div className='p-0 m-0 vaccinestockinfo'>
      {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
      <div className='position-absolute searchbutton' style={{ top: '0.25rem', right: '1rem' }}>
        <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Medicine Name" onChange={(e) => { setsearchname(e.target.value); }} />
        <button className="btn searchbtn p-0 m-0 bg-transparent border-0 position-absolute" ><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
      </div>
      <div className='heading text-start ms-lg-5 ms-md-3 ms-1 text-charcoal fw-bold p-2'>Medicine Stock Info</div>
      <div className='scroll scroll-y p-0 m-0' style={{ 'height': '57vh', minHeight: '57vh', maxHeight: '57vh' }}>
        <table className="table datatable text-start" >
          <thead className='position-sticky top-0 bg-pearl'>
            <tr>
              <th className='text-charcoal75 fw-bold'>No.</th>
              <th className='text-charcoal75 fw-bold'>ID</th>
              <th className='text-charcoal75 fw-bold'>Medicine Name</th>
              <th className='text-charcoal75 fw-bold'>Batch No.</th>
              <th className='text-charcoal75 fw-bold'>Expiry Date</th>
              <th className='text-charcoal75 fw-bold'>MRP</th>
              <th className='text-charcoal75 fw-bold'>Cost/Unit</th>
              <th className='text-charcoal75 fw-bold'>B.Stock</th>
              <th className='text-charcoal75 fw-bold'>T.Stock</th>
              <th className='text-charcoal75 fw-bold text-center'>Expired in</th>
              <th className='text-charcoal75 fw-bold text-center'>Stock Status</th>
              <th className='text-charcoal75 fw-bold text-center'></th>
              <th className='text-charcoal75 fw-bold text-center'>more info</th>
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
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
                {/* <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td> */}
                <td className='placeholder-glow text-center'><div className='placeholder col-12 p-0 m-0 w-100 px-1'>Loading..</div></td>
              </tr>
            ) : (
              medicinearr == undefined || medicinearr.length == 0 ? (
                <tbody className='' >
                  <tr>
                    <td className='position-absolute text-charcoal fw-bolder start-0 end-0'>No Medicines Found</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className=''>
                  {
                    medicinearr.map((data, i) => (
                      <tr className={`text-start align-middle`}>
                        <td className=' text-charcoal fw-bold'>{i + 1}</td>
                        <td className=' text-charcoal fw-bold'>m{data.Batch_stock_id}</td>
                        <td className=' text-charcoal fw-bold'>{data.name && data.name !== null ? data.name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.batch_no}</td>
                        <td className=' text-charcoal fw-bold'>{reversefunction(data.expiry_date)}</td>
                        <td className=' text-charcoal fw-bold'>{data.mrp}</td>
                        <td className=' text-charcoal fw-bold'>{data.cost}</td>
                        <td className=' text-charcoal fw-bold'>{data.current_stock}</td>
                        <td className=' text-charcoal fw-bold'>{data.totalstock ? CalculateTStock(data.totalstock) : ''}</td>
                        <td className={`text-${data.Days_to_expire ? data.Days_to_expire : '' <= 2 ? 'burntumber' : 'charcoal'} fw-bold text-center`}>{data.Days_to_expire ? data.Days_to_expire : ''} Months</td>
                        <td className=' text-charcoal fw-bold text-center'>
                          {
                            GetStatus(data.totalstock, data.alert_stock_count) == 1 ? (
                              <img src={process.env.PUBLIC_URL + 'images/exclamation.png'} style={{ 'width': '1.5rem' }} />
                            ) : (<></>)
                          }
                        </td>
                        <td className='p-0 m-0 text-charcoal fw-bold align-items-center text-center '>
                          <div className='vr rounded-2 align-self-center' style={{ padding: '0.8px' }}></div>
                        </td>
                        <td className={` bg-${index == i ? 'lightyellow' : ''} p-0 m-0 text-charcoal fw-bold text-center`}>
                          <button className='btn p-0 m-0' onClick={() => { setindex(i); toggle_detailsform() }}>
                            <img src={process.env.PUBLIC_URL + 'images/info.png'} style={{ 'width': '1.5rem' }} />
                          </button>
                        </td>
                        {
                          index == i ? (
                            <td className={`stockdetailsfrom bg-white border border-1 col-lg-11 rounded-4 shadow p-0 col-md-11 col-sm-11 col-10 col-xl-6 d-${index == i ? detailsform : 'none'} position-absolute start-0 end-0 top-0`}>
                              <MedicinesectionItemDetails toggle_detailsform={toggle_detailsform} data={medicinearr[i]} />
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
      <div className="container-fluid mt-2 d-flex justify-content-center">
        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'.'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={GetMedicines}
          containerClassName={'pagination scroll align-self-center align-items-center'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'d-flex mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active '}
        />
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
    <div className=' p-0 m-0 position-relative bg-seashell rounded-4'>
      <h6 className='text-center text-charcoal fw-bold pt-2'>{props.data.name}</h6>
      <hr className='p-0 m-0' />
      <button className='btn-close position-absolute end-0 top-0 p-1 m-1' onClick={props.toggle_detailsform}></button>

      <div className='p-0 m-0 scroll py-4'>
        <table className='table text-center scroll'>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>MRP</th>
              <th>Disc%</th>
              <th>Rate</th>
              <th className='bg-seashell'>CGST</th>
              <th className='bg-seashell'>CGST%</th>
              <th className='bg-seashell'>SGST</th>
              <th className='bg-seashell'>SGST%</th>
              <th className='bg-seashell'>IGST</th>
              <th className='bg-seashell'>IGST%</th>
              <th>Cost</th>

              <th>Total Amt.</th>
            </tr>
          </thead>
          <tbody>

            <tr className='p-0 m-0 px-1'>
              <td className='p-0 m-0 px-1'>{props.data.channel == 1 ? 'Pharmacy' : 'Clinic'}</td>
              <td className='p-0 m-0 px-1'>{props.data.expiry_date ? reversefunction(props.data.expiry_date) : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.qty ? props.data.qty : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.mrp ? props.data.mrp : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.discount && props.data.trade_discount ? Number(props.data.discount) + Number(props.data.trade_discount) : props.data.discount ? props.data.discount : props.data.trade_discount}</td>
              <td className='p-0 m-0 px-1'>{props.data.rate ? props.data.rate : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.CGST ? props.data.CGST : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.CGST ? props.data.CGST_rate : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.SGST ? props.data.SGST : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.SGST_rate ? props.data.SGST_rate : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.IGST ? props.data.IGST : ''}</td>
              <td className='p-0 m-0 px-1 bg-seashell'>{props.data.IGST_rate ? props.data.IGST_rate : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.cost ? props.data.cost : ''}</td>

              <td className='p-0 m-0 px-1'>{props.data.total_amount ? props.data.total_amount : ''}</td>

            </tr>



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
  console.log(props.data)
  return (
    <div className=' p-0 m-0 position-relative bg-seashell rounded-4'>
      <h6 className='text-center text-charcoal fw-bold pt-2'>{props.data.name}</h6>
      <hr className='p-0 m-0' />
      <button className='btn-close position-absolute end-0 top-0 p-1 m-1' onClick={props.toggle_detailsform}></button>
      <p className='bg-pearl m-0 p-0 border rounded-2 p-2 ms-3 mt-2 align-middle' style={{ width: 'fit-content' }}>
        <span className='text-charocal fw-bold p-0 m-0'>Total</span><span className='vr mx-2'></span><span className='text-charocal fw-bold p-0 m-0'>  {props.data.total_amount ? props.data.total_amount : ''}</span>
      </p>
      <div className='p-0 m-0 scroll'>
        <table className='table text-center scroll'>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Manuf.</th>
              <th>Expiry</th>
              <th>MRP</th>
              <th>Disc%</th>
              <th>Rate</th>
              <th>CGST%</th>
              <th>CGST</th>
              <th>SGST%</th>
              <th>SGST</th>
              <th>IGST%</th>
              <th>IGST</th>
              <th>Cost</th>
              <th>Qty</th>
              <th>Total Amt.</th>

            </tr>
          </thead>
          <tbody>
            <tr className='p-0 m-0 px-1'>
              <td className='p-0 m-0 px-1'>{props.data.channel == 1 ? 'Pharmacy' : 'Clinic'}</td>
              <td className='p-0 m-0 px-1'>{props.data.mfd_date ? reversefunction(props.data.mfd_date) : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.expiry_date ? reversefunction(props.data.expiry_date) : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.mrp ? props.data.mrp : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.discount && props.data.trade_discount ? Number(props.data.discount) + Number(props.data.trade_discount) : props.data.discount ? props.data.discount : props.data.trade_discount}</td>
              <td className='p-0 m-0 px-1'>{props.data.rate ? props.data.rate : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.CGST ? props.data.CGST : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.CGST ? props.data.CGST_rate : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.SGST ? props.data.SGST : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.SGST_rate ? props.data.SGST_rate : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.IGST ? props.data.IGST : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.IGST_rate ? props.data.IGST_rate : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.cost ? props.data.cost : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.qty ? props.data.qty : ''}</td>
              <td className='p-0 m-0 px-1'>{props.data.total_amount ? props.data.total_amount : ''}</td>

            </tr>


          </tbody>
        </table>
      </div>
    </div>

  )
}
//-------------------------------------------------------------------------Lists---------------------------------------------------------
function Listsection() {
  const permission = useContext(Permissions)
  let menu = [
    {
      option: "Vaccines",
      display: permission.vaccine_view
    }, {
      option: "Medicines",
      display: permission.medicine_view
    }];

  const [menuindex, setmenuindex] = useState(0);
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <div className=""><VaccineList /></div>
    }
    if (_menu === 1) {
      return <div className=""><MedicineList /></div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return (
    <>
      <section className='stocksection pt-1'>
        <div className="container-fluid">
          <div className="row gx-3">
            <div className='row m-0 p-0'>
              {
                menu.map((e, i) => {
                  return (
                    <div className="col-auto">
                      <button className={`btn btn-sm px-4 rounded-5 text-${i === menuindex ? "light" : "dark"} bg-${i === menuindex ? "charcoal" : "seashell"}`} onClick={(a) => setmenuindex(i)} >{e.option}</button>
                    </div>
                  )
                }
                )
              }
            </div>

          </div>
        </div>
      </section>
      <section className="tablesrender position-relative">
        <div className='container-fluid mt-lg-3 mt-md-3 mt-sm-2 mt-1'>
          <div className="">
            {_selectedmenu(menuindex)}
          </div>
        </div>
      </section>
    </>
  )
}
function VaccineList() {

}
function MedicineList() {
  const url = useContext(URL)
  const permission = useContext(Permissions)
  const [pagecount, setpagecount] = useState()
  const [pages, setpages] = useState()
  const [medicines, setmedicines] = useState([])
  const [load, setload] = useState(false)
  const [index, setindex] = useState()
  const [NewMed, setNewMed] = useState('none')
  const [UptMed, setUptMed] = useState('none')


  function GetPages() {
    try {
      axios.get(`${url}/medicine/list?limit=20&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 20) + 1)
        setload(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e)
        setload(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setload(false)
    }
  }
  const medcinelist = async (Data) => {
    if (Data == undefined || Data.selected == undefined) {
      setload(true)
      try {
        await axios.get(`${url}/medicine/list?limit=20&offset=0`).then((response) => {
          console.log(response.data.data)
          setmedicines(response.data.data.medicine)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    } else {
      setload(true)
      try {
        await axios.get(`${url}/medicine/list?limit=20&offset=${Data.selected * 20}`).then((response) => {
          console.log(response.data.data)
          setmedicines(response.data.data.medicine)
          setload(false)
        })
      } catch (e) {
        Notiflix.Notify.failure(e.message)
        setload(false)
      }
    }
  }
  useEffect(() => {
    GetPages()
    medcinelist()
  }, [pagecount])
  const ToggleNewMedicine = () => {
    if (NewMed == 'block') {
      setNewMed('none')
    }
    if (NewMed == 'none') {
      setNewMed('block')
    }
  }
  const ToggleUpdateMedicine = () => {
    if (UptMed == 'none') {
      setUptMed('block')
    }
    if (UptMed == 'block') {
      setUptMed('none')
      setindex()
    }
  }
  const DeleteMedicine = async (medid) => {
    try {
      await axios.post(`${url}/medicine/delete`, {
        id: medid
      }).then((response) => {
        Notiflix.Notify.success(response.data.message)
        console.log(response.data)
        medcinelist()
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
    }

  }
  const confirmmessage = (name, medid) => {
    customconfirm()
    Notiflix.Confirm.show(
      `Add Charges and Payments`,
      `Do you surely want to delete Medicine ${name}`,
      'Yes',
      'No',
      () => {
        DeleteMedicine(medid)
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  return (
    <div className='position-relative'>
      <div className='heading text-start ms-lg-5 ms-md-3 ms-sm-3 ms-1 text-charcoal fw-bold p-2'>Medicines List</div>
      <div className={` p-0 m-0 align-self-center ms-1 position-absolute top-0 end-0 d-${permission.medicine_add == 1 ? '' : 'none'} `}>
        <button className="button button-charcoal m-0 p-0 py-1 px-4" onClick={ToggleNewMedicine}> <img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt="displaying_image" style={{ width: "1.5rem" }} /> Medicine </button>
      </div>
      <div className='scroll scroll-y p-0 m-0 overflow-scroll' style={{ 'height': '57vh', minHeight: '57vh', maxHeight: '57vh' }}  >
        <table className="table datatable text-start" >
          <thead className='position-sticky top-0 bg-pearl'>
            <tr>
              <th rowSpan='2' className={`p-0 m-0 px-1 text-charcoal75 fw-bold d-${permission.medicine_edit == 1 ? '' : 'none'}`}>Update</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Display Name</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'> Name</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Salt Name</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>HSN Code</th>
              <th rowSpan='2' className='p-0 m-0 px-1 text-charcoal75 fw-bold'>Manufacturer</th>
              <th rowSpan='2' className={`p-0 m-0 px-1 text-charcoal75 fw-bold d-${permission.medicine_delete == 1 ? '' : 'none'}`}>Delete</th>
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
              medicines == undefined || medicines.length == 0 ? (
                <tbody className='' >
                  <tr>
                    <td className='position-absolute text-charcoal fw-bolder start-0 end-0'>No Medicines Found</td>
                  </tr>
                </tbody>
              ) : (
                <tbody className=''>
                  {
                    medicines.map((data, i) => (
                      <tr className={` bg-${i % 2 == 0 ? 'seashell' : 'pearl'} align-middle text-start`}>
                        <td className={`py-0 bg-${index === i ? 'lightyellow' : ''} d-${permission.medicine_edit == 1 ? '' : 'none'}`}>
                          <button className="btn m-0 p-0" key={i} onClick={(e) => { ToggleUpdateMedicine(); setindex(i) }}>
                            <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid" style={{ width: "1.5rem" }} key={i} />
                          </button>
                        </td>
                        <td className=' text-charcoal fw-bold'>{data.display_name && data.display_name !== null ? data.display_name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.name && data.name !== null ? data.name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.salt_name && data.salt_name !== null ? data.salt_name : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.hsn_code && data.hsn_code !== null ? data.hsn_code : ''}</td>
                        <td className=' text-charcoal fw-bold'>{data.manufacturer && data.manufacturer !== null ? data.manufacturer : ''}</td>
                        <td className={`d-${permission.medicine_delete == 1 ? '' : 'none'}`}><button className='btn p-0 m-0' onClick={() => { confirmmessage(data.name, data.id) }}><img src={process.env.PUBLIC_URL + '/images/delete.png'} style={{ width: '1.5rem' }} /></button></td>
                        {
                          index == i ? (
                            <td className={` text-start  d-${index == i ? UptMed : 'none'} border position-absolute start-0 end-0 top-0 bg-seashell`} style={{ padding: 0, marginTop: '-8.15rem', zIndex: '2' }}>
                              <UpdateMedicine ToggleUpdateMedicine={ToggleUpdateMedicine} data={medicines[i]} />
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
      <section className={`position-absolute border-1 shadow start-0 bg-seashell rounded-2 end-0 d-${NewMed}`} style={{ top: '-8.15rem', zIndex: '2' }}>
        <NewMedicine ToggleNewMedicine={ToggleNewMedicine} />
      </section>
      <div className="container-fluid d-flex justify-content-center mt-2">
        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'.'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={medcinelist}
          containerClassName={'pagination scroll align-self-center align-items-center'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-2 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'d-flex mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active '}
        />
      </div>

    </div>
  )
}
export { Stocksection };
export { Listsection }
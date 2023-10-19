import { URL, TodayDate, DoctorsList, Clinic, Permissions } from '../../index';
import { customconfirm } from '../features/notiflix/customconfirm';
import React, { useState, useRef, useContext, useEffect, useMemo } from 'react'
import Notiflix from 'notiflix'
import axios from 'axios'


const AddConsumables = (props) => {
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
    const [Grandtotal2, setGrandtotal2] = useState()
    const [loadsearch, setloadsearch] = useState()
    const [ce, setce] = useState('none')
    const [nursenotes, setnursenotes] = useState(props.appointmentdata.nursing_notes ? props.appointmentdata.nursing_notes : '')
    const [deleteload, setdeleteload] = useState(false)
    const [loadnotes, setloadnotes] = useState(false)
    const [i, seti] = useState()

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }

    }
  
    let obj={
         display_name:'',
         CGST:'',
         CGST_rate:'',
         IGST:'',
         IGST_rate:'',
         SGST:'',
         SGST_rate:'',
         batch_no:'',
         channel:'',
         cost:'',
         current_stock:'',
         discount:"",
         expiry_date : "",
         free_qty:'',
         id:'',
         is_consumable:'',
         medicine_id:'',
         mfd_date:'',
         mrp:'',
         qty:'',
         rate:'',
         total_amount:''

    }


    const searchmeds = async (search) => {
    return new Promise(async(resolve,reject)=>{
        try {
            setitemid()
            setproducts()
            let medicines = []
            setloadsearch(true)
            await axios.get(`${url}/stock/list?search=${search}&location_id=${clinicID}`).then((response) => {
                medicines = response.data.data.medicines ? response.data.data.medicines : []

                if (itemname != undefined && itemname.length > 0) {
                    medicinesref.current.style.display = 'block';
                } else {
                    medicinesref.current.style.display = 'none';
                }
            //  filter(medicines) 
            resolve(medicines)
            })
        } catch (e) {
            Notiflix.Notify.warning(e.message)
            reject(e)
        } finally{
            setloadsearch(false)
        }
    })
}
    async function filter(medicines){
        return new Promise((resolve, reject) => {
            let arr = []
            try{
                for(let i=0;i<medicines.length;i++){
                    for(let j=0;j<medicines[i].stock_info.length;j++){
                        if(medicines[i].stock_info[j].is_consumable == 1){
                            obj={
                                display_name:medicines[i].display_name,
                                CGST:medicines[i].stock_info[j].CGST,
                                CGST_rate:medicines[i].stock_info[j].CGST_rate,
                                IGST:medicines[i].stock_info[j].IGST,
                                IGST_rate:medicines[i].stock_info[j].IGST_rate,
                                SGST:medicines[i].stock_info[j].SGST,
                                SGST_rate:medicines[i].stock_info[j].SGST_rate,
                                batch_no:medicines[i].stock_info[j].batch_no,
                                channel:medicines[i].stock_info[j].channel,
                                cost:medicines[i].stock_info[j].cost,
                                current_stock:medicines[i].stock_info[j].current_stock,
                                discount:medicines[i].stock_info[j].discount,
                                expiry_date : medicines[i].stock_info[j].expiry_date,
                                free_qty:medicines[i].stock_info[j].free_qty,
                                id:medicines[i].stock_info[j].id,
                                is_consumable:medicines[i].stock_info[j].is_consumable,
                                medicine_id:medicines[i].id,
                                mfd_date:medicines[i].stock_info[j].mfd_date,
                                mrp:medicines[i].stock_info[j].mrp,
                                qty:medicines[i].stock_info[j].qty,
                                rate:medicines[i].stock_info[j].rate,
                                total_amount:medicines[i].stock_info[j].total_amount
                           }
                            arr.push(obj)
                        }
                    }
                }
                resolve(arr)
            }catch(e){
                Notiflix.Notify.failure(e.message)
                reject(e)
            }finally{
                setitemsearch(arr)
        
            }
        })
    }
    async function main(search) {
        try {
          const data = await searchmeds(search);
            filter(data).then((manipulatedData)=>{
                setitemsearch(manipulatedData);
            }) 
        } catch (e) {
            Notiflix.Notify.failure(e.message)
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
        setGrandtotal(ttl.toFixed(2))
    }
    function CalGrandttl2() {
        let ttl = 0
        props.existedconsumables.map((data) => (
            ttl += Number(data.total_amount)
        ))
        setGrandtotal2(ttl.toFixed(2))
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
    useEffect(() => {
        CalGrandttl2()
    }, [props.existedconsumables])


    function AddProducts(data) {
        let ProductDetails = {
            productid: data.id,
            type: 'm',
            product: data.display_name ? data.display_name : '',
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
    async function SubmitConsumabaleEntry() {
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
            pro_id: productids,
            qty: proquantity,
            discount: Discount,
            disc_mrp: discountonmrp,
            main_mrp: mrp,
            gst: GST,
            total_amount: Totalamount,
            appointment_id: props.appointmentid,
        }
        setload(true)
        try {
            await axios.post(`${url}/save/consumable`, Data).then((response) => {
                setload(false)
                if (response.data.status == true) {
                    NurseNotes()
                    Notiflix.Notify.success(response.data.message)
                    props.Appointmentlist()
                    setSelectedProducts([])
                } else {
                    Notiflix.Notify.warning(response.data.message)
                }
            }).catch(function error(e) {
                Notiflix.Notify.failure(e.message)
                setload(false)
            })
        } catch (e) {
            Notiflix.Notify.failure(e.message)
            setload(false)
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
                SubmitConsumabaleEntry()
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
            `Save Sale Entry`,
            `Do you surely want to save the following Note`,
            'Yes',
            'No',
            () => {
                NurseNotes()
            },
            () => {
                return 0
            },
            {
            },
        );
    }
    const toggle_consumables_existed = () => {
        if (ce === 'none') {
            setce('block')
        }
        if (ce === 'block') {
        }
    }
    const NurseNotes = async () => {
        try {
            setloadnotes(true)
            await axios.post(`${url}/save/nursing/notes`, {
                appointment_id: props.appointmentid,
                notes: nursenotes
            }).then((response) => {
                Notiflix.Notify.success(response.data.message)
                props.Appointmentlist()
                setloadnotes(false)
            })
        } catch (e) {
            setloadnotes(false)
            Notiflix.Notify.warning(e.data.message)
        }
    }
    const RemoveConsumable = async (ID) => {
        setdeleteload(true)
        try {
            await axios.post(`${url}/remove/consumable`, {
                id: ID
            }).then((response) => {
                setdeleteload(false)
                props.Appointmentlist()
                Notiflix.Notify.success(response.data.message)
            })
        } catch (e) {
            setdeleteload(false)
            Notiflix.Notify.warning(e.data.message)
        }
    }

    return (
        <div className="container-fluid bg-seashell rounded-2 px-0 position-relative mx-auto col-lg-11 col-md-11 col-sm-11 col-11 col-xl-9" style-={{ height: '70vh' }}>
            <div className='position-relative mb-3 text-center shadow-sm'>
                <h5 className='text-start text-charcoal text-center fw-bold py-2 '>{props.patientname} Consumables</h5>
                <button className='btn btn-close position-absolute p-1 m-0 end-0 top-0 me-2 pt-4' disabled={load ? true : false} onClick={props.toggleConsumables}></button>
            </div>

            <div className={`container-fluid text-start p-0 m-0 mt-3`}>
                <div className="col-12 justify-content-center">
                    <div className="row p-0 m-0 my-2 justify-content-start">
                        <div className="col-4 position-relative">
                            <input className='form-control bg-seashell fw-bold p-2 border-charcoal' disabled={loadsearch} placeholder='Search by Name'
                                value={itemname ? itemname : ''}
                                onChange={(e)=>{
                                    setitemname(e.target.value)
                                    main(e.target.value)
                                }}
                                 />
                            <div className="position-absolute mt-1 bg-raffia">
                                <div className="position-relative " style={{ width: '30vh' }}>
                                    <div ref={medicinesref} className='position-absolute scroll scroll-y rounded-1 ' style={{ Width: 'max-content', zIndex: '1', maxHeight: '40vh' }} >
                                        {
                                            itemsearch ? (
                                                loadsearch ? (
                                                    <div className='rounded-1 p-1 bg-pearl'>
                                                        Searching Please wait....
                                                        <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                                                            <span className="sr-only"> </span> </div>
                                                    </div>
                                                ) : (
                                                    loadsearch == false && itemsearch.length == 0 ? (
                                                        <div className="bg-burntumber text-light rounded-1 p-1">Oops! Not Avaliable</div>
                                                    ) : (
                                                        <div className={`rounded-1 border border-1 bg-pearl p-1 d-${itemsearch && itemsearch.length > 0 ? 'block' : 'none'}`}>
                                                            <p className={`text-start m-1 fw-bold text-charcoal75 ms-1`} style={{ fontSize: '0.8rem' }}>{itemsearch.length} Search Results</p>
                                                            {
                                                                itemsearch.map((data, i) => (
            <div style={{ cursor: 'pointer', Width: '10rem' }} className={`bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} p-1 py-3 fw-bold border-bottom text-charcoal `} 
            onClick={(e) => { setproducts(data); AddProducts(data); setitemname(); setitemid();medicinesref.current.style.display='none'}}>
                    {data.display_name ? data.display_name : data.display_name} | <span className='text-burntumber mx-2'>{data.batch_no?data.batch_no:''}</span>|<span className='ms-2'>{data.current_stock?data.current_stock+' stocks avaliable':''}</span></div>
                                                                ))
                                                            }
                                                        </div>
                                                    )
                                                )
                                            ) : (<div className='bg-seashell'></div>)
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-auto text-burntumber text-center fw-bold align-self-center'> OR </div>
                        <div className="col-4 ">
                        <input className='form-control bg-seashell border border-1 rounded-2 text-charcoal p-2 fw-bold border-charcoal' value={itemid ? itemid : ''} placeholder='Search by ID' 
                        onChange={(e) => { searchmedbyId(e.target.value); setitemid(e.target.value); medbyidref.current.style.display = 'block' }} />
                            <div ref={medbyidref} className='position-absolute rounded-1 mt-1' style={{ Width: 'max-content', zIndex: '2' }} >
                                {
                                    itembyid ? (
                                        loadbyId ? (
                                            <div className='rounded-1 p-1 bg-pearl'>
                                                Searching Please wait....
                                                <div className="spinner-border my-auto" style={{ width: "1rem", height: "1rem" }} role="status" >
                                                    <span className="sr-only"> </span> </div>
                                            </div>
                                        ) : (
                                            loadbyId == false && itembyid.length == 0 ? (
                                                <div className="bg-burntumber text-light rounded-1 p-1">Oops! Not Avaliable</div>
                                            ) : (
                                                itembyid.map((data, i) => (
                                                    <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`p-0 p-1 rounded-pill shadow bg-${((i % 2) == 0) ? 'pearl' : 'seashell'}`}
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
                    <div className="d-flex justify-content-between">
                    </div>
                    <div className='scroll scroll-y' style={{ height: '40vh' }}>
                        <table className='table'>
                            <thead className=' bg-seashell position-sticky top-0'>
                                <tr className={``}>
                                    <th className=''>Item ID</th>
                                    <th className=''>Item Name</th>
                                    <th className=''>BatchNo.</th>
                                    <th className=''>Expiry Date</th>
                                    <th className=''>Avl.Stock</th>
                                    <th className=''>Qty To Sale</th>
                                    <th className=''>Discount %</th>
                                    <th className=''>MRP</th>
                                    <th className=''>Cost</th>
                                    <th className=''>GST Rate</th>
                                    <th className=''>Selling Cost/Unit</th>
                                    <th className=''>Total Amount</th>
                                    <th className=''>Delete</th>
                                </tr>
                            </thead>
                            {
                                SelectedProducts && SelectedProducts.length !== 0 ? (
                                    <tbody className='p-0 m-0 bg-pearl'>
                                        {
                                            SelectedProducts.map((data) => (
                                                <tr className={`align-middle bg-${Number(data.disccost) < Number(data.cost) ? 'lightred50' : ''}`}>
                                                    <td>{data.type}{data.productid}</td>
                                                    <td>{data.product}</td>
                                                    <td>{data.batch}</td>
                                                    <td>{reversefunction(data.expiry)}</td>
                                                    <td>{data.quantity}</td>

                                                    <td>
                                                        <input className='border border-1 rounded-1 w-50 py-1 p-0 text-center bg-seashell'
                                                            value={data.qtytoSale ? data.qtytoSale : ''}
                                                            onChange={(e) => {
                                                                e.target.value <= data.quantity ? data.qtytoSale = e.target.value : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available");
                                                                data.totalamt = CalTotalAmount(data.qtytoSale, data.disccost);
                                                                setSelectedProducts(prevState => [...prevState])
                                                            }} /> </td>

                                                    <td>
                                                        <input className='border border-1 rounded-1 w-50 py-1 p-0 text-center bg-seashell'
                                                            value={data.discount ? data.discount : ''}
                                                            onChange={(e) => {
                                                                data.discount = e.target.value;
                                                                data.disccost = CalSellingCost(data.mainmrp, e.target.value);
                                                                data.totalamt = CalTotalAmount(data.qtytoSale, Number(data.disccost), Number(data.cost))
                                                                setSelectedProducts(prevState => [...prevState]);
                                                            }} /> </td>
                                                    <td>₹{data.mainmrp}</td>
                                                    <td>₹{data.cost}</td>
                                                    <td>{data.gst + '%'}</td>
                                                    <td>₹{data.disccost}</td>
                                                    <td>₹{data.totalamt}</td>
                                                    <td><img src={process.env.PUBLIC_URL + 'images/delete.png'} className='img-fluid' onClick={() => { DeleteProduct(data.batch) }} /></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                ) : (
                                    props.existedconsumables && props.existedconsumables.length == 0?(
                                        <tbody className='p-0 m-0 bg-seashell'>
                                        <tr className='p-0 m-0 text-center'>
                                            <td className='position-absolute text-charcoal75 fw-bold start-0 end-0'>No Consumabels Added</td>
                                        </tr>


                                    </tbody>
                                    ):(<></>)

                                )
                            }

                            {
                                props.existedconsumables && props.existedconsumables.length == 0 ? (
                                    <></>
                                ) : (
                                    <tbody className='position-relative bg-seashell'>
                                        {
                                            props.existedconsumables.map((data, key) => (
                                                <tr className={`align-middle bg-${Number(data.disccost) < Number(data.cost) ? 'lightred50' : ''}`}>
                                                    <td>m{data.medicies_stocks_id}</td>
                                                    <td>{data.medicine.display_name}</td>
                                                    <td>{data.medicine_stocks.batch_no}</td>
                                                    <td>{reversefunction(data.medicine_stocks.expiry_date)}</td>
                                                    <td></td>
                                                    <td>{data.qty}</td>
                                                    <td className='text-start p-0 m-0 ps-4'>{data.discount} </td>
                                                    <td>₹{data.main_mrp}</td>
                                                    <td>₹{data.medicine_stocks.cost}</td>
                                                    <td>{Number(data.CGST_rate) + Number(data.SGST_rate) + Number(data.IGST_rate) + "%"}</td>
                                                    <td>₹{data.disc_mrp}</td>
                                                    <td>₹{data.total_amount}</td>
                                                    <td>
                                                        {
                                                            deleteload && i == key ? (
                                                                <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                                                            ) : (
                                                                <img src={process.env.PUBLIC_URL + 'images/delete.png'} className='img-fluid' onClick={() => { seti(key); RemoveConsumable(data.id) }} />
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
                <div className="container" style={{ height: '30vh', paddingBottom: '10vh' }}>
                    <h6 className='fw-bold p-0 m-0 ps-0 ms-0 my-2'>Nurse notes</h6>
                    {
                        loadnotes ? (
                            <div className="col-6 py-2 pb-2 me-3 m-auto text-start">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <textarea className='col-12 form-control w-100' value={nursenotes ? nursenotes : ''} onChange={(e) => setnursenotes(e.target.value)} style={{ width: '95vh', height: '10vh' }}></textarea>

                        )
                    }
                </div>

            </div>
            <div className='col-12 position-absolute start-0 end-0 bottom-0 py-3 border border-1 text-start bg-pearl align-items-center rounded-bottom'>
                <div className="row p-0 m-0 align-items-center justify-content-between">
                    <div className="col-6 col-md-4">
                        <div className="row ">
                            <div className="col-5 ms-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start'> Order Total </p>
                                {
                                    SelectedProducts && SelectedProducts.length != 0 ? (
                                        <>
                                            <p className='text-charcoal fw-bolder card-header text-start ms-2'>₹{Grandtotal2}</p>
                                            <p className='text-success fw-bolder card-header text-start'>+₹{Grandtotal}</p>
                                        </>

                                    ) : (<></>)
                                }
                                <hr className='p-0 m-0 py-1 mt-1 ps-3' />
                                <h6 className='text-charcoal fw-bolder card-header text-start ms-2'>₹{(Number(Grandtotal) + Number(Grandtotal2)).toFixed(2)}</h6>
                            </div>
                            {/* <div className="col-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start ms-3'> Discount %</p>
                                <h4 className='text-charcoal  fw-bolder card-header text-start ps-3'>{CaltotalDiscount(SelectedProducts)}</h4>
                            </div> */}
                            <div className="col-5 ms-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start'> Total Items</p>

                                {
                                    SelectedProducts && SelectedProducts.length != 0 ? (
                                        <>
                                            <p className='text-charcoal fw-bolder card-header text-start ms-2'>{props.existedconsumables && props.existedconsumables.length ? props.existedconsumables.length : 0}</p>
                                            <p className='text-success fw-bolder card-header text-start'>+{SelectedProducts && SelectedProducts.length ? SelectedProducts.length : 0}</p>
                                        </>
                                    ) : (<></>)
                                }
                                <hr className='p-0 m-0 py-1 mt-1' />
                                <h6 className='text-charcoal  fw-bolder card-header text-start ms-2'>{props.existedconsumables && props.existedconsumables.length || SelectedProducts && SelectedProducts.length ? SelectedProducts.length + props.existedconsumables.length : 0}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-8">
                        <div className="row p-0 m-0 justify-content-end ">
                            <div className="col-auto p-0 m-0 align-self-center">
                                {
                                    loadnotes ? (
                                        <div className="col-6 py-2 pb-2 me-3 m-auto text-start">
                                            <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className='button button-seashell px-5 me-2' onClick={() => { confirmmessage2() }}>Save Notes</button>
                                    )
                                }
                            </div>
                            <div className="col-auto p-0 m-0 align-self-center">
                                {
                                    load ? (
                                        <div className="col-6 py-2 pb-2 me-3 m-auto text-start">
                                            <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className='button button-charcoal px-5 me-2' onClick={() => { confirmmessage() }}>Save All</button>
                                    )
                                }
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </div >
    )
}
export { AddConsumables }
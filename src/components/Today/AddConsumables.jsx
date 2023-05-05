import { URL, TodayDate, DoctorsList, Clinic, Permissions } from '../../index';
import { customconfirm } from '../features/notiflix/customconfirm';
import React, { useState, useRef, useContext, useEffect } from 'react'
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
    const [loadsearch, setloadsearch] = useState()
    const [ce, setce] = useState('none')
    const [nursenotes, setnursenotes] = useState('')
    const [deleteload, setdeleteload] = useState(false)


    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
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
                } else {
                    Notiflix.Notify.warning(response.data.message)
                }
            }).catch(function error(e) {
                console.log(e)
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
    const toggle_consumables_existed = () => {
        if (ce === 'none') {
            setce('block')
        }
        if (ce === 'block') {
            setce('none')
        }
    }
    const NurseNotes = async () => {
        try {
            await axios.post(`${url}/save/nursing/notes`, {
                appointment_id: props.appointmentid,
                notes: nursenotes
            }).then((response) => {
                Notiflix.Notify.success(response.data.message)
                props.Appointmentlist()
            })
        } catch (e) {
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
        <div className="container-fluid p-0 m-0">
            <div className='position-relative mb-3'>
                <h5 className='text-start text-charcoal fw-bold '>{props.patientname} Consumables</h5>
                <button className='btn btn-close position-absolute p-1 m-0 end-0 top-0 me-2' disabled={load ? true : false} onClick={props.toggleConsumables}></button>
            </div>
            <button className='button-sm border-0 mx-1 position-relative float-end p-0 mt-2 me-5' onClick={toggle_consumables_existed} >
                <span className=' fw-bold'>Consumables</span>
                <img src={process.env.PUBLIC_URL + 'images/cart.png'} />
                <span class={` position-absolute top-0 text-pearl start-100 translate-middle badge fw-normal px-auto rounded-circle bg-burntumber border-burntumber`} style={{ zIndex: '2' }}>
                    {props.existedconsumables.length}
                </span>
            </button>
            <div className={`d-${ce} position-absolute start-0 end-0 top-0 bg-seashell`} style={{ zIndex: '6', height: '60vh' }}>
                <h5 className='text-start text-charcoal fw-bold p-2'>{props.patientname} Consumables</h5>
                <img src={process.env.PUBLIC_URL + 'images/leftarrow.png'} className='ms-2 mb-2' onClick={toggle_consumables_existed} />
                <h6 className='text-start text-charcoal fw-bold p-1 ps-2 pb-0 '>Consumables Added </h6>
                <div className="scroll">
                    <table className='table fw-bold p-0 m-0'>
                        <thead className='p-0 m-0 top-0 bg-seashell'>
                            <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>MRP</th>
                                <th>Disc %</th>
                                <th>Cost</th>
                                <th>Total Amount</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        {
                            props.existedconsumables && props.existedconsumables.length !== 0 ? (
                                <tbody className='p-0 m-0 bg-pearl'>
                                    {
                                        props.existedconsumables.length !== 0 ? (
                                            props.existedconsumables.map((data) => (
                                                <tr className={`align-middle bg-${Number(data.disccost) < Number(data.cost) ? 'lightred50' : ''}`}>
                                                    <td>m{data.medicies_stocks_id}</td>
                                                    <td>{data.medicine.display_name}</td>
                                                    <td>₹{data.main_mrp}</td>
                                                    <td className='text-center p-0 m-0'>{data.discount} </td>
                                                    <td>₹{data.disc_mrp}</td>
                                                    <td>₹{data.total_amount}</td>
                                                    <td>
                                                        {
                                                            deleteload ? (
                                                                <div className="text-charcoal spinner-border spinner-border-sm me-2 " role="status" aria-hidden="true" ></div>
                                                            ) : (
                                                                <img src={process.env.PUBLIC_URL + 'images/delete.png'} onClick={() => { RemoveConsumable(data.id) }} />
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (<tbody>
                                            <tr>
                                                No consumables Found
                                            </tr>
                                        </tbody>)

                                    }
                                </tbody>
                            ) : (
                                <tbody className='position-relative'>
                                    <tr className='p-0 m-0 text-center'>
                                        <td className='position-absolute text-charcoal75 fw-bold start-0 end-0'>No Consumabels Added</td>
                                    </tr>
                                </tbody>
                            )
                        }
                    </table>
                </div>
                <div className="container-fluid fw-bold mt-3 ">
                    <h6 className='fw-bold'>Nursing Notes</h6>
                    <p className='d-inline-block w-100 text-wrap bg-pearl p-2 rounded-2 ' style={{ minHeight: '10vh' }}>
                        {props.appointmentdata.nursing_notes}
                    </p>
                </div>

            </div>

            <div className={`container-fluid text-start p-0 m-0 mt-3 d-${ce === 'block' ? 'none' : 'block'}`}>
                <div className="col-12 justify-content-center">
                    <h6 className='text-charcoal fw-bolder text-start ms-1'>Search Consumables</h6>
                    <hr className='p-0 m-0' />
                    {/* <div className="col-12">
                <button className='button button-seashell text-burntumber border-burntumber '>Scan to Add Product</button>
              </div>
              <h4 className='my-2'>OR</h4> */}
                    <div className="row my-2 justify-content-center">


                        <div className="col-4 position-relative">
                            <input className='form-control bg-seashell' placeholder='Search Product by Name'
                                value={itemname ? itemname : ''}
                                onChange={(e) => {
                                    searchmeds(e.target.value);
                                    setitemname(e.target.value);
                                    setitemid();
                                    setproducts();
                                    stockref.current.style.display = 'none'
                                }} />
                            <div ref={medicinesref} className='position-absolute rounded-1 mt-1' style={{ Width: 'max-content', zIndex: '1' }} >
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
                                                            <div style={{ cursor: 'pointer', Width: 'max-content' }} className={`bg-${((i % 2) == 0) ? 'pearl' : 'seashell'} p-1 py-2 fw-bold border-bottom text-charcoal `} onClick={(e) => { setproducts(data); setitemname(data.display_name ? data.display_name : data.name); setitemid(data.id); stockref.current.style.display = 'block' }}>{data.display_name ? data.display_name : data.name}</div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        )
                                    ) : (<div className='bg-seashell'></div>)
                                }
                            </div>
                            <div ref={stockref} className={`position-absolute bg-pearl scroll scroll-y align-self-center rounded-1 border border-1 p-1 d-${products && products.stock_info && products.stock_info.length > 0 ? 'block' : 'none'}`} style={{ marginLeft: '14vh', marginTop: '2rem', zIndex: '2', 'width': '13rem', 'height': '10rem' }}>
                                <p className={`text-start m-1 fw-bold text-charcoal75`} style={{ fontSize: '0.8rem' }}>{products && products.stock_info !== undefined ? products.stock_info.length : ''} Batch Stocks</p>
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
                                                    <h6 className='text-start m-0 p-0 fw-bold'>{itemname}</h6>
                                                    <p className='p-0 m-0 px-1'>BatchNo. - <span className='fw-bold'>{data.batch_no && data.batch_no !== null ? data.batch_no : ''}</span></p>
                                                    <p className='p-0 m-0 px-1'>Stock - <span className='fw-bold'>{data.current_stock && data.current_stock ? data.current_stock : ''}</span></p>
                                                    <p className='p-0 m-0 px-1'>Expiry Date - <span className='fw-bold'>{data.expiry_date ? reversefunction(data.expiry_date) : ''}</span></p>
                                                </div>
                                            ))

                                        ) : (<div>Not available</div>)


                                    )

                                }
                            </div>
                            <div></div>
                        </div>
                        <div className='col-1 text-burntumber text-center fw-bold align-self-center'>
                            OR
                        </div>
                        <div className="col-4 ">
                            <input className='form-control bg-seashell border border-1 rounded-1' value={itemid ? itemid : ''} placeholder='Search Product by ID' onChange={(e) => { searchmedbyId(e.target.value); setitemid(e.target.value); medbyidref.current.style.display = 'block' }} />
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
                        <h6 className='text-charcoal fw-bolder text-start ms-1'>Add Consumables</h6>

                    </div>
                    <div className='scroll scroll-y' style={{ height: '35vh' }}>
                        <table className='table p-0 m-0'>
                            <thead className='p-0 m-0 position-sticky top-0 bg-seashell'>
                                <tr className={``}>
                                    <th className='' rowSpan='2'>Item ID</th>
                                    <th className='' rowSpan='2'>Item Name</th>
                                    <th className='' rowSpan='2'>BatchNo.</th>
                                    <th className='' rowSpan='2'>Expiry Date</th>
                                    <th className='' rowSpan='2'>Avl.Stock</th>
                                    <th className=' text-center' rowSpan='2'>Qty To Sale</th>
                                    <th className=' text-center' rowSpan='2'>Discount %</th>
                                    <th className='' colSpan='4' scope='col-group'>Costing</th>
                                    <th className='' rowSpan='2'>Total Amount</th>
                                    <th className='' rowSpan='2'>Delete</th>
                                </tr>
                                <tr className='p-0 m-0'>
                                    <th className='' scope='col'>MRP</th>
                                    <th className='' scope='col'>Cost</th>
                                    <th className='' scope='col'>GST Rate</th>
                                    <th className='' scope='col'>Selling Cost/Unit</th>
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

                                                    <td className='text-center'><input className='border border-1 rounded-1 w-25 text-center bg-seashell'
                                                        value={data.qtytoSale ? data.qtytoSale : ''}
                                                        onChange={(e) => {
                                                            e.target.value <= data.quantity ? data.qtytoSale = e.target.value : Notiflix.Notify.failure("Quantity Cannot be Greater then Current Stock Available");
                                                            data.totalamt = CalTotalAmount(data.qtytoSale, data.disccost)
                                                            setSelectedProducts(prevState => [...prevState])
                                                        }} /> </td>

                                                    <td className='text-center p-0 m-0' style={{ Width: '0rem' }}>
                                                        <input className='border border-1 rounded-1 w-25 text-center bg-seashell'
                                                            value={data.discount ? data.discount : ''}
                                                            onChange={(e) => {
                                                                data.discount = e.target.value;
                                                                data.disccost = CalSellingCost(data.mainmrp, e.target.value);
                                                                data.totalamt = CalTotalAmount(data.qtytoSale, Number(data.disccost), Number(data.cost))
                                                                setSelectedProducts(prevState => [...prevState]);
                                                            }} /> </td>
                                                    <td>{data.mainmrp}</td>
                                                    <td>{data.cost}</td>
                                                    <td>{data.gst + '%'}</td>
                                                    <td>{data.disccost}</td>
                                                    <td>{data.totalamt}</td>
                                                    <td><img src={process.env.PUBLIC_URL + 'images/delete.png'} onClick={() => { DeleteProduct(data.batch) }} /></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                ) : (
                                    <tbody className='position-relative'>
                                        <tr className='p-0 m-0 text-center'>
                                            <td className='position-absolute text-charcoal75 fw-bold start-0 end-0'>No Consumabels Added</td>
                                        </tr>
                                    </tbody>
                                )
                            }
                        </table>
                    </div>
                </div>
                <div className="container p-0 m-0 mb-5 pb-5">
                    <h6 className='fw-bold p-0 m-0 ps-0 ms-0 my-2'>Nurse notes</h6>
                    <textarea className='col-12 form-control w-100' value={nursenotes ? nursenotes : ''} onChange={(e) => setnursenotes(e.target.value)} style={{ width: '95vh', height: '10vh' }}></textarea>
                </div>

            </div>
            <div className='col-12 position-absolute start-0 end-0 bottom-0 py-3 border border-1 text-start bg-pearl align-items-center rounded-bottom'>
                <div className="row p-0 m-0">
                    <div className="col-6">
                        <div className="row">
                            <div className="col-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start ms-3'> Order Total </p>
                                <h4 className='text-charcoal  fw-bolder card-header text-start ps-3'>{Grandtotal}</h4>
                            </div>
                            <div className="col-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start ms-3'> Discount %</p>
                                <h4 className='text-charcoal  fw-bolder card-header text-start ps-3'>{CaltotalDiscount(SelectedProducts)}</h4>
                            </div>
                            <div className="col-3">
                                <p className='text-charcoal75 fw-bolder card-title text-start ms-3'> Total Items</p>
                                <h4 className='text-charcoal  fw-bolder card-header text-start ps-3'>{SelectedProducts.length}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 align-self-center text-center">
                        {
                            load ? (
                                <div className="col-6 py-2 pb-2 m-auto text-start">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <button className='button button-charcoal px-5' onClick={() => { confirmmessage() }}>Save</button>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>

    )
}
export { AddConsumables }
import { useState} from "react";
import '../../css/bootstrap.css';
import {Purchaseentryarray,Purchaseorderarray,Pharmacystocktable,Stockvaccinearray,Stockmedicinearray,POitemdetailsarray,PEitemdetailsarray} from './apiarrays';

// ---------------------------------------------------------------purchase------------------------------------------------------------------
function Purchasesection(props){
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
return(
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

function Purchaseordersection(){
  let cartselect = ["Pharmacy", "Clinic"];
  const [cartselectindex, setcartselectindex] = useState(0);
  const [displayviewcart,setdisplayviewcart] = useState("none");
  const [displayitemdetails,setdisplayitemdetails] = useState("none");
  const _displayviewcart = ()=>{
    if(displayviewcart ==="none"){
      setdisplayviewcart("block");
    }
    if(displayviewcart ==="block"){
      setdisplayviewcart("none");
    }
  }
  const _displayitemdetails = ()=>{
    if(displayitemdetails ==="none"){
      setdisplayitemdetails("block");
    }
    if(displayitemdetails ==="block"){
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
            {<Pharmacystocktable/>}
        </tbody>
        </table>
      }
      if (cardindex === 1) {
        return <div className="">{cardindex}</div>
      }
      return <div className='fs-2'>Nothing Selected</div>
  
    }
    return(
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
              cartselect.map((e,i)=>{
                return(
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
            <select className="form-control bg-pearl"style={{color:'gray'}}>
              <option selected disabled defaultValue='Select Vendor' className="Selectvendor" style={{color:'gray'}}>Select Vendor</option>
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
        {<POitemdetailsarray/>}
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
        {<Purchaseorderarray itemdetails={_displayitemdetails}/>}
        </tbody>
    </table>
    </>
    )
}
function Purchaseentrysection(props){
    return(
        <>
        <button className="button addentrypurchase button-charcoal position-absolute" onClick={props.function}><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Entry Purchase</button>
         <h3 className='ps-3'>Purchase Entry List</h3>
        <table className="table datatable text-center">
        <thead>
          <tr>
            <th>PE ID</th>
            <th>PO ID</th>
            <th>Channel</th>
            <th>Invoice No.</th>
            <th>Bill Date</th>
            <th>Bill Total</th>
            <th>Vendor</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {<Purchaseentryarray function2 = {props.function2}/>}
        </tbody>
      </table>
      </> 
    )
}

function POitemdetailssection(){
  return(
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
            {<POitemdetailsarray/>}
        </tbody>
        </table>
  )
}
function PEitemdetailssection(props){
  return(<>
    <div className="container-fluid p-0 m-0">
    <div className="container-fluid bg-seashell border border-2 border-top-0 border-start-0 border-end-0 ">
    <div className="row p-2">
    <div className="col-1">
    <button type="button" className="btn-close closebtn m-auto" onClick={props.func} aria-label="Close"></button>
    </div>
    <div className="col-9">
    <h6 className='text-center'style={{color:'var(--charcoal)', fontWeight:'600'}}>New Purchase Entry</h6>
    </div>
    <div className="col-2">
    <div className=' position-relative searchbutton' style={{top: '0.25rem',right: '1rem'}}>
    <input type="text" className=" form-control d-inline PEsearch bg-seashell" placeholder="Search PE" />
    <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{width:'2rem',right:'0' ,left:'0',top:'0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
    </div>
    </div>
    </div>
    </div>
    </div>
    <table className="table datatable text-center"><thead>
            <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Batch No.</th>
            <th>Expiry Date</th>  
            <th>MRP</th>
            <th>Rate</th>
            <th>Disc</th>
            <th>Trade Disc</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cost</th>
            <th>Total</th>
            <th>Print QR</th>
          </tr>
        </thead>
        <tbody>
            {<PEitemdetailsarray/>}
        </tbody>
        </table>
        </>
  )
}

export{Purchasesection};
export{Purchaseordersection};
export{Purchaseentrysection};
export{POitemdetailssection};
export{PEitemdetailssection};

//-------------------------------------------------------------------------Stock Info---------------------------------------------------------

function Stocksection(){
  let menu = ["Vaccines","Medicines"];
  const [menuindex, setmenuindex] = useState(0);
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <div className=""><Stockvaccinesection/></div>
    }
    if (_menu === 1) {
      return <div className=""><Stockmedicinesection/></div>
    }
    return <div className='fs-2'>Nothing Selected</div>

  }
  return(
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
function Stockvaccinesection(){
  return(
    <>
    {/* <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button> */}
    <div className='position-absolute searchbutton' style={{top: '0.25rem',right: '1rem'}}>
                <input type="text" className=" form-control d-inline vaccinesearch bg-pearl" placeholder="Vaccine Name" />
                <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{width:'2rem',right:'0',left:'0',top:'0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
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
        {<Stockvaccinearray/>}
    </tbody>
  </table>
  </> 
  )
}
function Stockmedicinesection(){
  return(
    <>
    <button className="button exportstock button-charcoal position-absolute"><img src={process.env.PUBLIC_URL + "/images/addiconwhite.png"} alt='displaying_image' className="img-fluid" style={{ width: `1.5rem` }} />Export Stock</button>
    <div className='position-absolute searchbutton' style={{top: '0.25rem',right: '1rem'}}>
                <input type="text" className=" form-control d-inline medicinesearch bg-pearl" placeholder="Medicine Name" />
                <button className="btn p-0 m-0 bg-transparent border-0 position-absolute" style={{width:'2rem',right:'0',left:'0',top:'0.25rem' }}><img src={process.env.PUBLIC_URL + "/images/search.png"} alt="displaying_image" className="img-fluid p-0 m-0" /></button>
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
        {<Stockmedicinearray/>}
    </tbody>
  </table>
  </> 
  )
}
export{Stocksection};




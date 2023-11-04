import React from 'react'

const Generated_bill = (props) => {
    return (
      <div className="container p-0 m-0 mb-3 bg-seashell" style={{height:'70vh'}}>
        <button className='btn-close position-absolute top-0 end-0 mt-2 me-2' onClick={()=>props.toggle_Scannedbill()}></button>
        <h5 className='fw-bold text-center shadow-sm pt-2 pb-1'>Generated Bill</h5>
        {
            props.bill &&  props.bill.length >0 ?(
        <div>
         <iframe src={props.bill} width="100%" style={{height:'60vh'}}> </iframe> 
        </div>
            ):(
              <h4 className='text-center mt-5 pt-5 fw-bold text-charcoal50'>No Generated bill found</h4>
            )
        }
  
  </div>
    )
}

export {Generated_bill}
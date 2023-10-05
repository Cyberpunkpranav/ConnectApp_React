import React from 'react'

const Prescription = (props) => {
console.log(props.prescriptions);
  return (
    <div className="container p-0 m-0 mb-3 bg-seashell" style={{height:'80vh'}}>
      <button className='btn-close position-absolute top-0 end-0 mt-2 me-2' onClick={()=>props.toggle_ScannedPres()}></button>
      <h5 className='fw-bold text-center shadow-sm pt-2 pb-1'>Scanned Prescription</h5>
      {
          props.prescriptions &&  props.prescriptions.length >0 ?(
      <div>
       <iframe src={props.prescriptions} width="100%" style={{height:'70vh'}}> </iframe> 
      </div>
          ):(
            <h4 className='text-center mt-5 pt-5 fw-bold text-charcoal50'>No Scanned Prescriptions</h4>
          )
      }

</div>
  )
}

export {Prescription}
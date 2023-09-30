import React from 'react'

const Prescription = (props) => {
  return (
    <div className="container p-0 m-0 mb-3 bg-seashell">
      <button className='btn-close position-absolute top-0 end-0 mt-2 me-2' onClick={()=>props.toggle_ScannedPres()}></button>
      <h5 className='fw-bold text-center shadow-sm pt-2 pb-1'>Scanned Prescription</h5>
      {
        props.load ? (
          <div className="col-6 py-2 pb-2 m-auto text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        ):(
          props.prescriptions &&  props.prescriptions.length >0 ?(
            <div className='scroll scroll-y' style={{height:'70vh'}}>
            {
              props.prescriptions && props.prescriptions.map((Data,i)=>(
                <div className="col mt-4 rounded-2 ms-4" key={i}><img src={`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/scanned_documents/${Data.file}`} className="img-fluid shadow" style={{width:'48vh',height:'auto'}}/></div>
              ))
            }
      </div>
          ):(
            <h4 className='text-center mt-5 pt-5 fw-bold text-charcoal50'>No Scanned Prescriptions</h4>
          )

        )
      }

</div>
  )
}

export {Prescription}
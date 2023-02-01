import React from 'react'

const WelcomeLoader = () => {
  return (<>
        <div className='container  text-center' style={{marginTop:'2rem',width:'100vh'}}>
          <div className="p-0 m-0">
          <video autoPlay loop muted style={{width:'100vh',height:'50vh'}}>
  <source src={process.env.PUBLIC_URL + "/images/Closertocare.mp4"} type="video/mp4" />
  </video>
          </div>


          </div>
      </>
  )
}

export  {WelcomeLoader}

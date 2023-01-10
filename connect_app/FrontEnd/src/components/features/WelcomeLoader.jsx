import React from 'react'

const WelcomeLoader = () => {
  return (<>
        <div className='container  text-center' style={{marginTop:'2rem'}}>
          <div className="p-0 m-0">
          <video width="1000" height="500" autoPlay loop muted>
  <source src={process.env.PUBLIC_URL + "/images/Closertocare.mp4"} type="video/mp4" />
  </video>
          </div>


          </div>
      </>
  )
}

export  {WelcomeLoader}

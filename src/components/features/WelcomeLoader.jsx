import React from 'react'

const WelcomeLoader = () => {
  return (<>
    <div className='container-fluid  text-center' style={{ marginTop: '2rem', width: '100%' }}>

      <video autoPlay loop muted style={{ width: '60vh', height: '50vh' }}>
        <source src={process.env.PUBLIC_URL + "/images/Closertocare.mp4"} type="video/mp4" playsinline />
      </video>


    </div>
  </>
  )
}

export { WelcomeLoader }

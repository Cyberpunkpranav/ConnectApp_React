import React, {useRef,useCallback, useState} from "react";
import {ReactCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import '../../css/bootstrap.css'
import Webcam from 'react-webcam'
const videoConstraints = {
    width: 600,
    height: 800,
    facingMode: "user"
  };
  
  const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const galleryref = useRef(null);
    const[imgroll,setimgroll]=useState('none')
    const [imagearr,setimagearr] = useState([])
    const capture = useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if(imagearr.length>0){
            setimagearr(imageSrc)
        }else{
            setimagearr((prevState)=>[...prevState,imageSrc])
        }
      },
      [webcamRef]
    );
    console.log(imagearr)
    const toggleGallery = ()=>{
        if(imgroll=='block'){
            setimgroll('none')
        }
        if(imgroll == 'none'){
            setimgroll('block')
        }
    }
    console.log(imgroll)
    const [crop, setCrop] = useState()
      
  
    return (
      <>
      <div className="position-relative">
      <Webcam
          audio={false}
          height={800}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={600}
          videoConstraints={videoConstraints}
        />
      <img className="img-fluid position-absolute start-0 end-0 mx-auto bottom-0 mb-5" onClick={()=>{capture()}} style={{width:'4rem'}} src={process.env.PUBLIC_URL + '/images/camera_click.png'}/>
 
        <div className="position-absolute bottom-0 justify-content-center " >
        <button className="border-0 cameraroll bg-transparent p-0 m-0 "onClick={()=>{toggleGallery()}}>
            {
                imgroll=='none'?(
                    <img src={process.env.PUBLIC_URL+'/images/up.png'} className="img-fluid bg-seashell px-2 py-1 rounded-top mb-1"/>
                ):(
                    <img src={process.env.PUBLIC_URL+'/images/bottom.png'} className="img-fluid bg-seashell px-2 py-1 rounded-top mb-1"/>
                )
            }
          </button>
        <div className={`container cameraroll scroll bg-charcoal25 d-${imgroll}`}style={{flexDirection:'horizontal',minHeight:'fit-content'}}> 
            {
                imagearr.map((data)=>(
                    <img src={data} className="img-fluid" style={{width:'5rem'}}/>
                ))
            }
            </div>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img src={imagearr[0]} />
      </ReactCrop>
        </div>
      </div>
    
      </>
    );
  }
  export default WebcamCapture
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
    const closeCamera = ()=>{
      let stream = webcamRef.current.video.srcObject;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      webcamRef.current.video.srcObject = null;
    }
    console.log(imgroll)
    const [crop, setCrop] = useState()
      
  
    return (
      <>

    
      </>
    );
  }
  export default WebcamCapture
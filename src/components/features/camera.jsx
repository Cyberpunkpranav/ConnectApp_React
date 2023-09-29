import React, {useRef,useCallback, useState,useEffect,useContext} from "react";
import {URL} from '../../index'
import Notiflix from "notiflix";
import {ReactCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import '../../css/bootstrap.css'
import Webcam from 'react-webcam'
import axios from "axios";

  
  const Camera = (props) => {
    const url = useContext(URL);
    const [imagestate,setimagestate]=useState('')
    const[ImageData,setImageData]=useState()
    const webcamRef = useRef(null);
    const imgRef = useRef(null);
    const[imgroll,setimgroll]=useState('none')
    const [editor,seteditor] =useState('none')
    const [imagearr,setimagearr] = useState([])
    const [editindex, seteditindex] = useState(0)
    const [image,setimage]=useState()
    const [flip,setflip] =useState('environment')
    const width = window.innerWidth;
    const height = window.innerHeight;
    const videoConstraints = {
      width:width,
      height: height,
      facingMode: flip
    };
    const capture = useCallback(  
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if(imagearr.length>0){
            setimagearr(imageSrc)
            Notiflix.Notify.info('Photo Captured')
            toggleGallery()
        }else{
            setimagearr((prevState)=>[...prevState,imageSrc])
            Notiflix.Notify.info('Photo Captured')
            toggleGallery()
        }
      },
      [webcamRef]
    );
    
    const toggleGallery = ()=>{
        if(imgroll=='block'){
            setimgroll('none')
          
        }
        if(imgroll == 'none'){
    
            setimgroll('block')
        }
    }
    
    const toggleedit=()=>{
    if(editor=='none'){
      seteditor('')
    }
    if(editor==''){
      seteditor('none')
    }
    }
    const [src, setSrc] = useState(null);
    // const[croppedimg,setcroppedimg]=useState()
    const [crop, setCrop] = useState({   unit: '%',
    x: 25,
    y: 25,
    width: 100,
    height:100 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imageRef = useRef(null);
    
    const onSelectFile = (e) => {
      setSrc(imagearr[editindex])
    };
    const createImageRef = (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageRef.current = img;
      };
    };
    useEffect(() => {
      if (src) {
        createImageRef(src);
      }
    }, [src]);
    const getCroppedImgAsJPEG = (image, crop) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
    
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      const jpegImageDataUri = canvas.toDataURL('image/jpeg');
      return jpegImageDataUri;
    };

    const makeClientCrop = async (crop) => {
      if ( imageRef.current && crop.width && crop.height) {
        toggleedit()
        setCompletedCrop()
        const croppedImage = await getCroppedImgAsJPEG(imageRef.current,crop)
        setimage(croppedImage)
        setimagestate('block')
      }
    }

    const appointmentId=localStorage.getItem('appointmentid');


  function Close_window() {
    window.close()
  }
  

  function dataURItoFile(dataURI) {
    const splitDataURI = dataURI.split(',');
    const mime = splitDataURI[0].match(/:(.*?);/)[1];
    const byteString = atob(splitDataURI[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: mime });
    const file = new File([blob], 'like.jpeg', { type: mime });
    return file;
  }
  const handleFileUpload = async () => {
    const file =  dataURItoFile(image);
    const formData = new FormData();
    formData.append('image', file,'prescription.jpeg');
    formData.append('appointment_id', appointmentId);

    axios
      .post(`${url}/save/document`, formData, {headers: {
        'Content-Type': 'multipart/form-data', 
      }})
      .then((response) => {
        console.log('File uploaded successfully:', response.data);
        if(response.data.status==true){
          Notiflix.Notify.success('Prescription Uploaded Successfully')
          setTimeout(Close_window, 2000);
        }
      })
      .catch((error) => {
        // Handle errors
        console.error('Error uploading file:', error);
      });
  }





    return (
      <>

          <div className={`p-0 m-0 position-absolute top-0 start-0 ebd-0 mx-auto`} style={{zIndex:'10'}} >
              <div className="col-12 p-0 m-0">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored={false} videoConstraints={videoConstraints} />
              </div>
              <div className={`col-12 bg-charcoal d-${imagestate =='block'?'none':'block'}`}>
                <div className="row p-0 m-0 justify-content-between align-items-center position-relative">
                  <div className="col-3">
                  <button className="border-0 justify-content-start cameraroll button button-pearl p-0 m-0 "onClick={()=>{toggleGallery()}}>
            {
                imgroll=='none'?(   
                    <img src={process.env.PUBLIC_URL+'/images/gallery.png'} className="img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1" style={{width:'2rem'}}/>
                ):(
                    <img src={process.env.PUBLIC_URL+'/images/bottom.png'} className="img-fluid bg-seashell px-2 py-1 rounded-top mb-1"/>
                )
            }
          </button>
            <div className={`container position-absolute cameraroll scroll bg-charcoal25 ms-2 d-${imgroll}`}style={{flexDirection:'horizontal',minHeight:'fit-content',zIndex:'10',top:'-5rem'}}> 
            {
                imagearr? imagearr.map((data,i)=>(
                    <img src={data} className="img-fluid" onClick={()=>{toggleedit();seteditindex(i);onSelectFile()}} style={{width:'5rem'}}/>

                )):''
            }
            </div>
            </div>
                  <div className="col-6 align-items-center d-flex justify-content-center">
                  <img className="img-fluid bg-lightyellow rounded-2" onClick={()=>{capture()}} style={{width:'4rem'}} src={process.env.PUBLIC_URL + '/images/camera_click.png'}/>
                  </div>
                  <div className="col-3 d-flex justify-content-center">
                  <button className="button button-pearl border-0 cameraroll p-0 m-0" onClick={()=>{flip=='user'?setflip('environment'):setflip('user')}}><img src={process.env.PUBLIC_URL+'/images/flip.png'} className="img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1" style={{width:'1.8rem'}}/></button>
                  </div>
                </div>
              </div>
      {/* cropper */}
      {
        webcamRef.current ? (
          <div className={`d-${editor} container position-absolute top-0 start-0 mx-auto end-0 bg-charcoal shadow-sm`} style={{zIndex:'15',height:100,width:width}}>
          <button className="position-absolute end-0 bg-seashell50 p-2 btn-close" style={{zIndex:'18'}} onClick={()=>{toggleedit()}}></button>
        <div className="mt-0 position-absolute start-0 end-0 mx-auto">
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} >
            <img src={src} className="img-fluid" style={{width:`${webcamRef.current.video.videoWidth}px`,height:`${webcamRef.current.video.videoHeight}px`}}/>
          </ReactCrop>
      </div>    
      {/* height:`${webcamRef.current.video.videoHeight}px`, */}
      </div>
        ):(
          <></>
        )
      }

      {/* cropper */}
  </div>
        {completedCrop && (
        <div className="position-absolute top-0 mt-4 ms-2" style={{zIndex:'15'}}>
          <button className="button button-charcoal text-light border border-light" onClick={() => makeClientCrop(completedCrop)}>Save</button>
        </div>
      )}
      {
      image ?(
        <div className={`position-absolute top-0 start-0 mx-auto end-0 bg-charcoal d-${imagestate}`} style={{height:height,width:width,zIndex:'20'}} >
          <button className="btn-close position-absolute bg-seashell50 mt-3 me-3 p-2 top-0 end-0"onClick={()=>{setimagestate('none')}}></button>
          <div className="position-relative d-flex mt-5 justify-content-center">
          <img src={image} className="img-fluid" style={{width:crop.width,height:crop.height}}/>  
          </div>
          <button className=" mx-auto d-flex justify-content-center button button-pearl" onClick={(e)=>{handleFileUpload(e)}}>Save Prescription</button>
          {/* <input type='file' onChange={handleChange}/> */}
        </div>
      ):(<></>)
      } 
      </>
    );
  }
  export default Camera
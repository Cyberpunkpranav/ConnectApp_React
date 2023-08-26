import { useContext, useEffect, useState } from "react"
import axios from "axios";
import { URL, TodayDate, DoctorsList, Clinic, Permissions } from "../../../index";
import { customconfirm } from "../../features/notiflix/customconfirm";
import Notiflix from "notiflix";
const UpdateVaccine = (props)=>{
    const url = useContext(URL)
    const [vaccinename,setvaccinename]=useState('')
    const [hsn,sethsn]=useState('')
    const[manufacturer,setmanufacturer]=useState('')
    const[saltname,setsaltname]=useState('')
    const [load,setload] =useState(false)
    const CurrentData = ()=>{
        setvaccinename(props.data.name)
        sethsn(props.data.hsn_code)
        setmanufacturer(props.data.manufacturer)
        setsaltname(props.data.salt_name)
    }
    useEffect(()=>{
        CurrentData()
    },[])
    const confirmmessage = () => {
        customconfirm();
        Notiflix.Confirm.show(
          `Add Charges and Payments`,
          `Do you surely want to update ${props.data.name}`,
          "Yes",
          "No",
          () => {
            UpdateVaccine();
          },
          () => {
            return 0;
          },
          {}
        );
      }
      
      const UpdateVaccine =async()=>{
        try{
            setload(true)
            await axios.post(`${url}/update/vaccine/brand`,{
                name:vaccinename,
                hsn_code:hsn,
                manufacturer:manufacturer,
                salt_name:saltname,
                vaccine_brand_id:props.data.id,
            }).then((response)=>{
                props.vaccinelist()
                props.ToggleUpdateVaccine()
                Notiflix.Notify.success(response.data.message)

            })
        }catch(e){
            Notiflix.Notify.failure(e.message)
        }
      }
    return(
        <section style={{minHeight:'100%'}}>
            <h5 className="text-center text-charocal fw-bold pt-2 shadow-sm pb-2">Update {vaccinename?vaccinename:''}</h5>
            <button type="button" className="btn-close closebtn m-auto mt-2 position-absolute top-0 end-0 me-2 mt-2" onClick={props.ToggleUpdateVaccine} aria-label="Close" ></button>
            <div className="row p-0 m-0 justify-content-center mt-4">
                <div className="col-5">
                    <div className="col-auto">
                        <label htmlFor="" className="fw-bold text-charcoal75 ms-1" >Name</label>
                    </div>
                    <div className="col-auto">
                    <input type="text" className="form-control bg-seashell fw-bold" value={vaccinename?vaccinename:''} onChange={(e)=>{setvaccinename(e.target.value)}} placeholder="Vaccine name"/>
                    </div>
                </div>
                <div className="col-1"></div>
                <div className="col-5">
                    <div className="col-auto">
                    <label htmlFor="" className="fw-bold text-charcoal75 ms-1">HSN Code</label>
                    </div>
                    <div className="col-auto">
                    <input type="text" className="form-control bg-seashell fw-bold" value={hsn?hsn:''} onChange={(e)=>{sethsn(e.target.value)}} placeholder="hsn code"/>
                    </div>
                </div>
            </div>
            <div className="row p-0 m-0 justify-content-center mt-4">
                <div className="col-5">
                <div className="col-auto">
                <label htmlFor="" className="fw-bold text-charcoal75 ms-1">Manufacturer</label>
                </div>
                <div className="col-auto">
                <input type="text" className="form-control bg-seashell fw-bold"  value={manufacturer?manufacturer:''} onChange={(e)=>{setmanufacturer(e.target.value)}} placeholder="manufacturer"/>
                </div>
                </div>
                <div className="col-1"></div>
                <div className="col-5">
                <div className="col-auto">
                <label htmlFor="" className="fw-bold text-charcoal75 ms-1">Salt Name</label>
                </div>
                <div className="col-auto">
                <input type="text" className="form-control bg-seashell fw-bold" value={saltname?saltname:''} onChange={(e)=>{setsaltname(e.target.value)}} placeholder="salt name"/>
                </div>
                </div>
            </div>
            <div className="container-fluid position-absolute bottom-0 bg-pearl py-3 px-2">
            <div className="row p-0 m-0 ">
            <div className="col-9">
            </div>
            <div className="col-auto">
                {
                    load ? (
                        <div class="spinner-border" role="status" style={{ width: "1.5rem", height: "1.5rem" }}> 
                          <span class="visually-hidden">Loading...</span>
                        </div>
                    ):(
                        <button className="button button-charcoal" onClick={()=>{confirmmessage()}}>Update Vaccine</button>

                    )
                }
            </div>

          </div>
            </div>

        </section>
    )
}
export {UpdateVaccine}
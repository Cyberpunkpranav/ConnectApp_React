import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { URL } from '../../index'
import Notiflix from 'notiflix'
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { customconfirm } from '../features/notiflix/customconfirm'
import '../../css/bootstrap.css'
import '../../css/dashboard.css'

const AddAddress = (props) => {
    const url = useContext(URL)
    const [address, setaddress] = useState()
    const [pincode, setpincode] = useState()
    const [place, setplace] = useState()
    const [location, setlocation] = useState()
    const [placeid, setplaceid] = useState()
    const [data, setData] = useState("")
    const [state, setstate] = useState()
    const [country, setcountry] = useState()

    // useEffect(() => {

    //     if (data !== undefined && data.value != undefined && data.value.place_id !== undefined) {
    //         setpincode()
    //         setplaceid()
    //         // initialize the map
    //         const map = new window.google.maps.Map({
    //             zoom: 14
    //         });
    //         // initialize the PlacesService object with your API key and map
    //         const placesService = new window.google.maps.places.PlacesService(map);

    //         // send a getDetails request for the place using its Place ID
    //         placesService.getDetails({
    //             placeId: data.value.place_id
    //         }, (placeResult, status) => {
    //             if (status === 'OK') {
    //                 // find the address component with type "postal_code"
    //                 const postalCodeComponent = placeResult.address_components.find(component => {
    //                     return component.types.includes('postal_code');
    //                 });

    //                 if (postalCodeComponent) {
    //                     const postalCode = postalCodeComponent.short_name;
    //                     setpincode(postalCode);
    //                 } else {
    //                     Notiflix.Notify.warning('Postal code not found for this place.');
    //                 }
    //             } else {
    //                 Notiflix.Notify.failure(`Failed to get place details: ${status}`);
    //             }
    //         });
    //     } 

    //     data === "" ? setData("") : setData(data);
    //     setplace(data && data.label != undefined ? data.label : '')
    // }, [data]);
    useEffect(()=>{
        setplace(data && data.label != undefined ? data.label : '')
        setplaceid(data && data.value !=undefined && data.value.place_id !=undefined ?data.value.place_id:'')
        GetPostal_code()
    },[data])

    const GetPostal_code = async()=>{
        setpincode('')
        await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeid}&key=AIzaSyC4wk5k8E6jKkpJClZlXZ8oavuPyi0AMVE`).then((response)=>{
                if(response){
                    let data = response.data.result !=undefined ? response.data.result.address_components:[]
                for(let i=0;i<data.length;i++){
                        if(data[i].types.includes('postal_code')){
                            setpincode(data[i].short_name?data[i].short_name:'')
                        }
                }
            }

        })
                                       }
       useEffect(()=>{
        GetPostal_code()
       },[placeid])
       
    const Add_Address = async () => {
        await axios.post(`${url}/add/patient/address`, {
            patient_id: props.patientid,
            full_name: props.searchinput,
            address_line_1: address,
            address_line_2: '',
            zip_code: pincode,
            country: country,
            state: state,
            city: place,
        }).then((response) => {
            if (response.data.status == true) {
                Notiflix.Notify.success(response.data.message)
                props.setpatientdata(response.data.data)
                clear()
            }
            
        })
    }

    const confirmmessage = (e) => {
        customconfirm();
        Notiflix.Confirm.show(
            `Add New Address`,
            `Do you surely want to add a new address of ${props.searchinput}`,
            "Yes",
            "No",
            () => {
                Add_Address()
            },
            () => {
                return 0;
            },
            {}
        );
    };
    const confirmmessage2 = (e) => {
        customconfirm();
        Notiflix.Confirm.show(
            `Update Address`,
            `Do you surely want to Update the following Address?`,
            "Yes",
            "No",
            () => {
                Update_Address()
            },
            () => {
                return 0;
            },
            {}
        );
    };
    const clear = () => {
        setcountry()
        setstate()
        setData()
        setplaceid()
        setplace()
        setpincode()
        setaddress()
    }
    const fill_data = () => {
        if (props.data != undefined) {
            setaddress(props.data.address_line1 != undefined ? props.data.address_line1 : '')
            setpincode(props.data.zip_code != undefined ? props.data.zip_code : '')
            setlocation(props.data.city != undefined ? props.data.city : '')
            setstate(props.data.state != undefined ? props.data.state : '')
            setcountry(props.data.country != undefined ? props.data.country : '')
        }
    }

    const Update_Address = async () => {
        await axios.post(`${url}/update/patient/address`, {
            address_id: props.data.id,
            patient_id: props.data.patient_id,
            full_name: props.searchinput,
            address_line_1: address,
            address_line_2: '',
            zip_code: pincode,
            country: country,
            state: state,
            city: place,
        }).then((response) => {
            if (response.data.status == true) {
                Notiflix.Notify.success(response.data.message)
                props.Toggle_Address()
                clear()
            }
            
        })
    }
    
    useEffect(() => {
        fill_data()
    }, [])
    return (
        <div className='text-center px-2 py-1'>
            <div className="text-start">
                <h5 className='fw-bold text-charcoal py-2 ms-2'>{props.data != undefined ? 'Update Address' : 'Add New Address'}</h5>
                <div className="btn-close position-absolute end-0 top-0 mt-2 me-2" onClick={props.Toggle_Address}></div>
                <div className="col-auto mx-2 pb-2 m-auto">
                    <label htmlFor="inputAddress" className=" fw-bold text-charcoal75 ">Add Address</label>
                    <input type="text" className="form-control " id="inputAddress" value={address ? address : ''} placeholder="Address" onChange={(e) => { setaddress(e.target.value) }} required />
                </div>
                <div className="row p-0 m-0 py-2">
                    <div className={`col-12 d-${props.data != undefined ? 'block' : 'none'} my-2`}>
                        <label className=" fw-bold text-charcoal75">Selected Location:<span className='text-charcoal ps-1'>{location ? location : <i>Not selected</i>}</span></label>
                    </div>
                    <div className="col-6 m-auto">
                        <label htmlFor="inputAddress" className=" fw-bold text-charcoal75">{props.data != undefined ? 'Select another Location' : 'Select Location'}</label>
                        <GooglePlacesAutocomplete
                            apiKey='AIzaSyC4wk5k8E6jKkpJClZlXZ8oavuPyi0AMVE'
                            selectProps={{
                                defaultInputValue: location ? location : data,
                                onChange: setData,
                                placeholder: "Select Location",
                            }}
                            onLoadFailed={(error) => {
                                Notiflix.Notify.warning(error);
                            }}
                        />
                    </div>
                    <div className="col-6 m-auto">
                        <label htmlFor="inputpincode" className=" fw-bold text-charcoal75">Pin Code</label>
                        <input type="text" className="form-control " id="inputpincode" value={pincode ? pincode : ''} placeholder="pincode" onChange={(e) => { setpincode(e.target.value) }} required />
                    </div>
                    <div className="col-6 m-auto">
                        <label htmlFor="inputpincode" className=" fw-bold text-charcoal75">State</label>
                        <input type="text" className="form-control" id="inputpincode" value={state ? state : ''} placeholder="state" onChange={(e) => { setstate(e.target.value) }} required />
                    </div>
                    <div className="col-6 m-auto">
                        <label htmlFor="inputpincode" className=" fw-bold text-charcoal75">Country</label>
                        <input type="text" className="form-control" id="inputpincode" value={country ? country : ''} placeholder="country" onChange={(e) => { setcountry(e.target.value) }} required />
                    </div>

                </div>
            </div>
            <div className="button button-charcoal my-2 " onClick={() => { props.data ? confirmmessage2() : confirmmessage() }}>Save</div>
        </div>
    )
}

export { AddAddress }
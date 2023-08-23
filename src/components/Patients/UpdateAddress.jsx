import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { URL } from '../../index'
import { customconfirm } from '../features/notiflix/customconfirm'
import { AddAddress } from './AddAddress'
// import {useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import Notiflix from 'notiflix';
import '../../css/patient.css';

const UpdateAddress = (props) => {
    const url = useContext(URL)
    const [address, setaddress] = useState()
    const [pincode, setpincode] = useState()
    const [place, setplace] = useState()
    const [placeid, setplaceid] = useState()
    const [data, setData] = useState("")
    const [state, setstate] = useState()
    const [country, setcountry] = useState()
    const [index, setindex] = useState()

    // useEffect(() => {``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

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
        setplace(data.label)
    },[data])

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
    }

    const clear = () => {
        setcountry(props.data.country)
        setstate(props.data.state)
        setData()
        setplaceid()
        setplace()
        setpincode()
        setaddress()
    }
    const [addresspage, setaddresspage] = useState('none')
    const Toggle_Address = () => {
        if (addresspage == 'block') {
            setaddresspage('none')
            setindex()
        }
        if (addresspage == 'none') {
            setaddresspage('block')
        }
    }

    return (
        <div className=''>
            <h5 className='fw-bold text-charcoal py-2 ms-3'>Update Address of {props.data.full_name}</h5>
            <div className="btn-close position-absolute top-0 end-0 mt-2 me-2" onClick={props.CloseUpdateAddress}></div>
            <div className="container text-start p-0 m-0">
                {
                    props.data.address.length ==0  ?(<p className='text-burntumber ms-3 fw-bold'> Please add an address to make changes</p>):(
                        props.data.address.map((data, i) => (
                            <div className="container-fluid position-relative">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <div className="button p-0 m-0" onClick={() => { setindex(i); Toggle_Address() }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} className='img-fluid' style={{width:'1.5rem'}} alt="" /></div>
                                    </div>
                                    <div className="col-8">
                                        <button className='button button-pearl d-block my-2'>
                                            <div className="text-charcoal text-start">{data.address_line1 ? data.address_line1 + ',' : ''}{' '}{data.address_line2 ? data.address_line2 + ',' : ''}{' '}{data.city ? data.city + ',' : ''}{' '}{data.state ? data.state + ',' : ''}{' '}{data.country ? data.country : ''}</div>
                                        </button>
                                    </div>
                                    <div className="col-2 text-end">
                                        <div className="button p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/minus.png"} className='img-fluid' style={{width:'1.5rem'}} alt="" /></div>
                                    </div>
                                </div>
                                <section className={`d-${index == i ? addresspage : 'none'} position-absolute top-0 mx-auto bg-seashell shadow-sm border border-1`} style={{ zIndex: '4' }}>
                                    {
                                        index == i ? (
                                            <AddAddress data={data} setindex={setindex} Toggle_Address={Toggle_Address} />
                                        ) : (<></>)
                                    }
                                </section>
                            </div>
                        ))
                    )
                    
                }
            </div >

        </div>
    )
}

export { UpdateAddress }
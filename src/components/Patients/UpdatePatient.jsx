import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { URL } from '../../index'
import { customconfirm } from '../features/notiflix/customconfirm'
// import {useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import Notiflix from 'notiflix';
import '../../css/patient.css';
const UpdatePatient = (props) => {
    const url = useContext(URL);
    let adminid = localStorage.getItem('id')
    const [fullname, setfullname] = useState()
    const [countrycode, setcountrycode] = useState()
    const [phonenumber, setphonenumber] = useState()
    const [address, setaddress] = useState()
    const [DOB, setDOB] = useState()
    const [gender, setgender] = useState()
    const [email, setemail] = useState()
    const [pincode, setpincode] = useState()
    const [place, setplace] = useState()
    const [main, setmain] = useState()
    const [relation, setrelation] = useState()
    const [linkid, setlinkid] = useState()
    const [lat, setlat] = useState()
    const [lng, setlng] = useState()

    const [mainaccount, setmainaccount] = useState([])
    const [display, setdisplay] = useState("none")
    const [accountinput, setaccountinput] = useState()
    const [displaymainaccount, setdisplaymainaccount] = useState('none')
    const ismainref = useRef()

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function currentvalue() {
        setgender(props.data.gender)
        if (props.data.address[0] && props.data.address[0].address_line2) {
            setaddress(props.data.address[0].address_line1 + props.data.address[0].address_line2)
        } else if (props.data.address[0] && props.data.address[0].address_line1) {
            setaddress(props.data.address[0].address_line1)
        } else {
            setaddress('')
        }
        props.phonecountrycode ? setcountrycode(props.phonecountrycode) : setcountrycode()
        props.PhoneNo ? setphonenumber(props.PhoneNo) : setphonenumber()
        props.full_name ? setfullname(props.full_name) : setfullname('')
        props.dob ? setDOB(props.dob) : setDOB()
        props.pincode ? setpincode(props.pincode) : setpincode()
        props.email ? setemail(props.email) : setemail('')
        props.location ? setplace(props.location) : setplace()
        props.main ? setmain(props.main) : setmain()
        props.latitude ? setlat(props.latitude) : setlat()
        props.longitude ? setlng(props.longitude) : setlng()
        if (props.parent === null) {
            ismainref.current.value = '1'
            setmain('1')
        } else {
            ismainref.current.value = '2'
            setmain('2')
            setdisplay('block')
            setrelation(props.relation)
        }

        if (props.data.parent) {
            if (props.data.parent.full_name || props.data.parent.email) {
                setaccountinput(props.data.parent.full_name + " | " + props.data.parent.id + " | " + props.data.parent.email)
            }
        }

    }
    useEffect(() => {
        currentvalue()
    }, [props.patient_id])


    const d = (e) => {
        if (e.target.value == 1) {
            setdisplay('none')
        }
        if (e.target.value == 2) {
            setdisplay('flex')
        }
    }

    const get_value = (e) => {
        e.preventDefault()
        setaccountinput(e.target.value)
        setlinkid(e.target.name)
        setdisplaymainaccount('none')
    }

    const searchmainaccount = (e) => {
        setaccountinput(e.target.value)
        axios.get(`${url}/patient/list?search=${accountinput}&limit=5&offset=0`).then((response) => {
            setmainaccount(response.data.data.patient_list)
            console.log(response.data.data.patients_list)
        })
        if (accountinput && accountinput.length > 1) {
            setdisplaymainaccount('block');
            setlinkid()
        } else {
            setdisplaymainaccount('none');
        }

    }

    // console.log(props.patientid, fullname, countrycode, phonenumber, DOB, gender, props.gender, email, address, pincode, props.location, place, main, adminid, props.linkid, props.relation)
    async function UpdatePatient() {
        console.log(props.patientid, fullname, countrycode, phonenumber, DOB, gender, email, address, pincode, props.location, place, main, adminid, props.linkid, props.relation)
        try {
            if (fullname && countrycode && phonenumber && DOB && email && address && pincode && main && adminid) {
                await axios.post(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/update/patient`, {
                    patient_id: props.patientid,
                    full_name: fullname,
                    phone_country_code: countrycode,
                    phone_number: phonenumber,
                    dob: DOB,
                    gender: gender,
                    email: email,
                    address: address,
                    pin_code: pincode,
                    location: props.location ? props.location : place,
                    is_main: main,
                    latitude: props.latitude ? props.latitude : lat,
                    longitude: props.longitude ? props.longitude : lat,
                    relation: main == 2 ? props.relation ? props.relation : relation : '',
                    link_id: main == 2 ? props.linkid ? props.linkid : linkid : '',
                    admin_id: adminid
                }).then((response) => {
                    Notiflix.Notify.success(response.data.message);
                    props.getAllPatients(0)
                    props.CloseUpdatePatient()
                })
            } else {
                Notiflix.Notify.warning('Please Fill all Detais');
            }
        } catch (e) {
            alert(e)
        }

    }
    const confirmmessage = () => {
        customconfirm()
        Notiflix.Confirm.show(
            `Update Patient Details`,
            `Do you surely want to update ${props.data.full_name}'s Details`,
            'Yes',
            'No',
            () => {
                UpdatePatient()
            },
            () => {
                return 0
            },
            {
            },
        );
    }

    const [data, setData] = useState("");
    useEffect(() => {

        if (data.value !== undefined && data.value.place_id !== undefined) {
            setpincode()
            console.log(data.value.place_id)
            // initialize the map
            const map = new window.google.maps.Map({
                center: { lat: lat, lng: lng },
                zoom: 14
            });
            // initialize the PlacesService object with your API key and map
            const placesService = new window.google.maps.places.PlacesService(map);

            // send a getDetails request for the place using its Place ID
            placesService.getDetails({
                placeId: data.value.place_id
            }, (placeResult, status) => {
                if (status === 'OK') {
                    console.log(placeResult)
                    // find the address component with type "postal_code"
                    const postalCodeComponent = placeResult.address_components.find(component => {
                        return component.types.includes('postal_code');
                    });

                    if (postalCodeComponent) {
                        const postalCode = postalCodeComponent.short_name;
                        setpincode(postalCode);
                    } else {
                        Notiflix.Notify.warning('Postal code not found for this place.');
                    }
                } else {
                    Notiflix.Notify.failure(`Failed to get place details: ${status}`);
                }
            });
        } else {
            console.log(data)
        }

        data === "" ? setData("") : setData(data);
        setplace(data.label)
    }, [data]);

    if (place) {
        geocodeByAddress(place).then(results => getLatLng(results[0])).then(({ lat, lng }) => { setlat(lat); setlng(lng) });
    }
    console.log(props.data)
    return (
        <>
            <h5 className="text-center mt-2 position-relative">Update Patient Details </h5>
            <button type="button" className="btn-close closebtn position-absolute" aria-label="Close" onClick={props.CloseUpdatePatient} ></button>
            <hr className='p-0 m-0' />
            <div className="col-12">
                <div className="form-group col-10 m-auto py-3">
                    <label htmlFor="inputEmail4" className="mb-2">Enter Number</label>
                    <div className="row m-0 p-0 justify-content-center">
                        <div className="col-4">
                            <select name="countryCode" className="form-control" value={countrycode ? countrycode : ''} onChange={(e) => { setcountrycode(e.target.value) }}>
                                <option defaultValue='Country Code' >Country Code</option>
                                <option data-countryCode="DZ" value="213">Algeria (+213)</option>
                                <option data-countryCode="AD" value="376">Andorra (+376)</option>
                                <option data-countryCode="AO" value="244">Angola (+244)</option>
                                <option data-countryCode="AI" value="1264">Anguilla (+1264)</option>
                                <option data-countryCode="AG" value="1268">Antigua &amp; Barbuda (+1268)</option>
                                <option data-countryCode="AR" value="54">Argentina (+54)</option>
                                <option data-countryCode="AM" value="374">Armenia (+374)</option>
                                <option data-countryCode="AW" value="297">Aruba (+297)</option>
                                <option data-countryCode="AU" value="61">Australia (+61)</option>
                                <option data-countryCode="AT" value="43">Austria (+43)</option>
                                <option data-countryCode="AZ" value="994">Azerbaijan (+994)</option>
                                <option data-countryCode="BS" value="1242">Bahamas (+1242)</option>
                                <option data-countryCode="BH" value="973">Bahrain (+973)</option>
                                <option data-countryCode="BD" value="880">Bangladesh (+880)</option>
                                <option data-countryCode="BB" value="1246">Barbados (+1246)</option>
                                <option data-countryCode="BY" value="375">Belarus (+375)</option>
                                <option data-countryCode="BE" value="32">Belgium (+32)</option>
                                <option data-countryCode="BZ" value="501">Belize (+501)</option>
                                <option data-countryCode="BJ" value="229">Benin (+229)</option>
                                <option data-countryCode="BM" value="1441">Bermuda (+1441)</option>
                                <option data-countryCode="BT" value="975">Bhutan (+975)</option>
                                <option data-countryCode="BO" value="591">Bolivia (+591)</option>
                                <option data-countryCode="BA" value="387">Bosnia Herzegovina (+387)</option>
                                <option data-countryCode="BW" value="267">Botswana (+267)</option>
                                <option data-countryCode="BR" value="55">Brazil (+55)</option>
                                <option data-countryCode="BN" value="673">Brunei (+673)</option>
                                <option data-countryCode="BG" value="359">Bulgaria (+359)</option>
                                <option data-countryCode="BF" value="226">Burkina Faso (+226)</option>
                                <option data-countryCode="BI" value="257">Burundi (+257)</option>
                                <option data-countryCode="KH" value="855">Cambodia (+855)</option>
                                <option data-countryCode="CM" value="237">Cameroon (+237)</option>
                                <option data-countryCode="CA" value="1">Canada (+1)</option>
                                <option data-countryCode="CV" value="238">Cape Verde Islands (+238)</option>
                                <option data-countryCode="KY" value="1345">Cayman Islands (+1345)</option>
                                <option data-countryCode="CF" value="236">Central African Republic (+236)</option>
                                <option data-countryCode="CL" value="56">Chile (+56)</option>
                                <option data-countryCode="CN" value="86">China (+86)</option>
                                <option data-countryCode="CO" value="57">Colombia (+57)</option>
                                <option data-countryCode="KM" value="269">Comoros (+269)</option>
                                <option data-countryCode="CG" value="242">Congo (+242)</option>
                                <option data-countryCode="CK" value="682">Cook Islands (+682)</option>
                                <option data-countryCode="CR" value="506">Costa Rica (+506)</option>
                                <option data-countryCode="HR" value="385">Croatia (+385)</option>
                                <option data-countryCode="CU" value="53">Cuba (+53)</option>
                                <option data-countryCode="CY" value="90392">Cyprus North (+90392)</option>
                                <option data-countryCode="CY" value="357">Cyprus South (+357)</option>
                                <option data-countryCode="CZ" value="42">Czech Republic (+42)</option>
                                <option data-countryCode="DK" value="45">Denmark (+45)</option>
                                <option data-countryCode="DJ" value="253">Djibouti (+253)</option>
                                <option data-countryCode="DM" value="1809">Dominica (+1809)</option>
                                <option data-countryCode="DO" value="1809">Dominican Republic (+1809)</option>
                                <option data-countryCode="EC" value="593">Ecuador (+593)</option>
                                <option data-countryCode="EG" value="20">Egypt (+20)</option>
                                <option data-countryCode="SV" value="503">El Salvador (+503)</option>
                                <option data-countryCode="GQ" value="240">Equatorial Guinea (+240)</option>
                                <option data-countryCode="ER" value="291">Eritrea (+291)</option>
                                <option data-countryCode="EE" value="372">Estonia (+372)</option>
                                <option data-countryCode="ET" value="251">Ethiopia (+251)</option>
                                <option data-countryCode="FK" value="500">Falkland Islands (+500)</option>
                                <option data-countryCode="FO" value="298">Faroe Islands (+298)</option>
                                <option data-countryCode="FJ" value="679">Fiji (+679)</option>
                                <option data-countryCode="FI" value="358">Finland (+358)</option>
                                <option data-countryCode="FR" value="33">France (+33)</option>
                                <option data-countryCode="GF" value="594">French Guiana (+594)</option>
                                <option data-countryCode="PF" value="689">French Polynesia (+689)</option>
                                <option data-countryCode="GA" value="241">Gabon (+241)</option>
                                <option data-countryCode="GM" value="220">Gambia (+220)</option>
                                <option data-countryCode="GE" value="7880">Georgia (+7880)</option>
                                <option data-countryCode="DE" value="49">Germany (+49)</option>
                                <option data-countryCode="GH" value="233">Ghana (+233)</option>
                                <option data-countryCode="GI" value="350">Gibraltar (+350)</option>
                                <option data-countryCode="GR" value="30">Greece (+30)</option>
                                <option data-countryCode="GL" value="299">Greenland (+299)</option>
                                <option data-countryCode="GD" value="1473">Grenada (+1473)</option>
                                <option data-countryCode="GP" value="590">Guadeloupe (+590)</option>
                                <option data-countryCode="GU" value="671">Guam (+671)</option>
                                <option data-countryCode="GT" value="502">Guatemala (+502)</option>
                                <option data-countryCode="GN" value="224">Guinea (+224)</option>
                                <option data-countryCode="GW" value="245">Guinea - Bissau (+245)</option>
                                <option data-countryCode="GY" value="592">Guyana (+592)</option>
                                <option data-countryCode="HT" value="509">Haiti (+509)</option>
                                <option data-countryCode="HN" value="504">Honduras (+504)</option>
                                <option data-countryCode="HK" value="852">Hong Kong (+852)</option>
                                <option data-countryCode="HU" value="36">Hungary (+36)</option>
                                <option data-countryCode="IS" value="354">Iceland (+354)</option>
                                <option data-countryCode="IN" value="91">India (+91)</option>
                                <option data-countryCode="ID" value="62">Indonesia (+62)</option>
                                <option data-countryCode="IR" value="98">Iran (+98)</option>
                                <option data-countryCode="IQ" value="964">Iraq (+964)</option>
                                <option data-countryCode="IE" value="353">Ireland (+353)</option>
                                <option data-countryCode="IL" value="972">Israel (+972)</option>
                                <option data-countryCode="IT" value="39">Italy (+39)</option>
                                <option data-countryCode="JM" value="1876">Jamaica (+1876)</option>
                                <option data-countryCode="JP" value="81">Japan (+81)</option>
                                <option data-countryCode="JO" value="962">Jordan (+962)</option>
                                <option data-countryCode="KZ" value="7">Kazakhstan (+7)</option>
                                <option data-countryCode="KE" value="254">Kenya (+254)</option>
                                <option data-countryCode="KI" value="686">Kiribati (+686)</option>
                                <option data-countryCode="KP" value="850">Korea North (+850)</option>
                                <option data-countryCode="KR" value="82">Korea South (+82)</option>
                                <option data-countryCode="KW" value="965">Kuwait (+965)</option>
                                <option data-countryCode="KG" value="996">Kyrgyzstan (+996)</option>
                                <option data-countryCode="LA" value="856">Laos (+856)</option>
                                <option data-countryCode="LV" value="371">Latvia (+371)</option>
                                <option data-countryCode="LB" value="961">Lebanon (+961)</option>
                                <option data-countryCode="LS" value="266">Lesotho (+266)</option>
                                <option data-countryCode="LR" value="231">Liberia (+231)</option>
                                <option data-countryCode="LY" value="218">Libya (+218)</option>
                                <option data-countryCode="LI" value="417">Liechtenstein (+417)</option>
                                <option data-countryCode="LT" value="370">Lithuania (+370)</option>
                                <option data-countryCode="LU" value="352">Luxembourg (+352)</option>
                                <option data-countryCode="MO" value="853">Macao (+853)</option>
                                <option data-countryCode="MK" value="389">Macedonia (+389)</option>
                                <option data-countryCode="MG" value="261">Madagascar (+261)</option>
                                <option data-countryCode="MW" value="265">Malawi (+265)</option>
                                <option data-countryCode="MY" value="60">Malaysia (+60)</option>
                                <option data-countryCode="MV" value="960">Maldives (+960)</option>
                                <option data-countryCode="ML" value="223">Mali (+223)</option>
                                <option data-countryCode="MT" value="356">Malta (+356)</option>
                                <option data-countryCode="MH" value="692">Marshall Islands (+692)</option>
                                <option data-countryCode="MQ" value="596">Martinique (+596)</option>
                                <option data-countryCode="MR" value="222">Mauritania (+222)</option>
                                <option data-countryCode="YT" value="269">Mayotte (+269)</option>
                                <option data-countryCode="MX" value="52">Mexico (+52)</option>
                                <option data-countryCode="FM" value="691">Micronesia (+691)</option>
                                <option data-countryCode="MD" value="373">Moldova (+373)</option>
                                <option data-countryCode="MC" value="377">Monaco (+377)</option>
                                <option data-countryCode="MN" value="976">Mongolia (+976)</option>
                                <option data-countryCode="MS" value="1664">Montserrat (+1664)</option>
                                <option data-countryCode="MA" value="212">Morocco (+212)</option>
                                <option data-countryCode="MZ" value="258">Mozambique (+258)</option>
                                <option data-countryCode="MN" value="95">Myanmar (+95)</option>
                                <option data-countryCode="NA" value="264">Namibia (+264)</option>
                                <option data-countryCode="NR" value="674">Nauru (+674)</option>
                                <option data-countryCode="NP" value="977">Nepal (+977)</option>
                                <option data-countryCode="NL" value="31">Netherlands (+31)</option>
                                <option data-countryCode="NC" value="687">New Caledonia (+687)</option>
                                <option data-countryCode="NZ" value="64">New Zealand (+64)</option>
                                <option data-countryCode="NI" value="505">Nicaragua (+505)</option>
                                <option data-countryCode="NE" value="227">Niger (+227)</option>
                                <option data-countryCode="NG" value="234">Nigeria (+234)</option>
                                <option data-countryCode="NU" value="683">Niue (+683)</option>
                                <option data-countryCode="NF" value="672">Norfolk Islands (+672)</option>
                                <option data-countryCode="NP" value="670">Northern Marianas (+670)</option>
                                <option data-countryCode="NO" value="47">Norway (+47)</option>
                                <option data-countryCode="OM" value="968">Oman (+968)</option>
                                <option data-countryCode="PW" value="680">Palau (+680)</option>
                                <option data-countryCode="PA" value="507">Panama (+507)</option>
                                <option data-countryCode="PG" value="675">Papua New Guinea (+675)</option>
                                <option data-countryCode="PY" value="595">Paraguay (+595)</option>
                                <option data-countryCode="PE" value="51">Peru (+51)</option>
                                <option data-countryCode="PH" value="63">Philippines (+63)</option>
                                <option data-countryCode="PL" value="48">Poland (+48)</option>
                                <option data-countryCode="PT" value="351">Portugal (+351)</option>
                                <option data-countryCode="PR" value="1787">Puerto Rico (+1787)</option>
                                <option data-countryCode="QA" value="974">Qatar (+974)</option>
                                <option data-countryCode="RE" value="262">Reunion (+262)</option>
                                <option data-countryCode="RO" value="40">Romania (+40)</option>
                                <option data-countryCode="RU" value="7">Russia (+7)</option>
                                <option data-countryCode="RW" value="250">Rwanda (+250)</option>
                                <option data-countryCode="SM" value="378">San Marino (+378)</option>
                                <option data-countryCode="ST" value="239">Sao Tome &amp; Principe (+239)</option>
                                <option data-countryCode="SA" value="966">Saudi Arabia (+966)</option>
                                <option data-countryCode="SN" value="221">Senegal (+221)</option>
                                <option data-countryCode="CS" value="381">Serbia (+381)</option>
                                <option data-countryCode="SC" value="248">Seychelles (+248)</option>
                                <option data-countryCode="SL" value="232">Sierra Leone (+232)</option>
                                <option data-countryCode="SG" value="65">Singapore (+65)</option>
                                <option data-countryCode="SK" value="421">Slovak Republic (+421)</option>
                                <option data-countryCode="SI" value="386">Slovenia (+386)</option>
                                <option data-countryCode="SB" value="677">Solomon Islands (+677)</option>
                                <option data-countryCode="SO" value="252">Somalia (+252)</option>
                                <option data-countryCode="ZA" value="27">South Africa (+27)</option>
                                <option data-countryCode="ES" value="34">Spain (+34)</option>
                                <option data-countryCode="LK" value="94">Sri Lanka (+94)</option>
                                <option data-countryCode="SH" value="290">St. Helena (+290)</option>
                                <option data-countryCode="KN" value="1869">St. Kitts (+1869)</option>
                                <option data-countryCode="SC" value="1758">St. Lucia (+1758)</option>
                                <option data-countryCode="SD" value="249">Sudan (+249)</option>
                                <option data-countryCode="SR" value="597">Suriname (+597)</option>
                                <option data-countryCode="SZ" value="268">Swaziland (+268)</option>
                                <option data-countryCode="SE" value="46">Sweden (+46)</option>
                                <option data-countryCode="CH" value="41">Switzerland (+41)</option>
                                <option data-countryCode="SI" value="963">Syria (+963)</option>
                                <option data-countryCode="TW" value="886">Taiwan (+886)</option>
                                <option data-countryCode="TJ" value="7">Tajikstan (+7)</option>
                                <option data-countryCode="TH" value="66">Thailand (+66)</option>
                                <option data-countryCode="TG" value="228">Togo (+228)</option>
                                <option data-countryCode="TO" value="676">Tonga (+676)</option>
                                <option data-countryCode="TT" value="1868">Trinidad &amp; Tobago (+1868)</option>
                                <option data-countryCode="TN" value="216">Tunisia (+216)</option>
                                <option data-countryCode="TR" value="90">Turkey (+90)</option>
                                <option data-countryCode="TM" value="7">Turkmenistan (+7)</option>
                                <option data-countryCode="TM" value="993">Turkmenistan (+993)</option>
                                <option data-countryCode="TC" value="1649">Turks &amp; Caicos Islands (+1649)</option>
                                <option data-countryCode="TV" value="688">Tuvalu (+688)</option>
                                <option data-countryCode="UG" value="256">Uganda (+256)</option>
                                <option data-countryCode="GB" value="44">UK (+44)</option>
                                <option data-countryCode="UA" value="380">Ukraine (+380)</option>
                                <option data-countryCode="AE" value="971">United Arab Emirates (+971)</option>
                                <option data-countryCode="UY" value="598">Uruguay (+598)</option>
                                <option data-countryCode="US" value="1">USA (+1)</option>
                                <option data-countryCode="UZ" value="7">Uzbekistan (+7)</option>
                                <option data-countryCode="VU" value="678">Vanuatu (+678)</option>
                                <option data-countryCode="VA" value="379">Vatican City (+379)</option>
                                <option data-countryCode="VE" value="58">Venezuela (+58)</option>
                                <option data-countryCode="VN" value="84">Vietnam (+84)</option>
                                <option data-countryCode="VG" value="84">Virgin Islands - British (+1284)</option>
                                <option data-countryCode="VI" value="84">Virgin Islands - US (+1340)</option>
                                <option data-countryCode="WF" value="681">Wallis &amp; Futuna (+681)</option>
                                <option data-countryCode="YE" value="969">Yemen (North)(+969)</option>
                                <option data-countryCode="YE" value="967">Yemen (South)(+967)</option>
                                <option data-countryCode="ZM" value="260">Zambia (+260)</option>
                                <option data-countryCode="ZW" value="263">Zimbabwe (+263)</option>
                            </select>
                        </div>
                        <div className="col-8">
                            <input className="form-control patientnumber m-auto" id="inputEmail4" value={phonenumber ? phonenumber : ''} onChange={(e) => { setphonenumber(e.target.value) }} placeholder="Phone Number" required />
                        </div>
                    </div>

                    <label htmlFor="inputEmail4" className="pt-3 mb-2"> Enter Name </label>
                    <input type="text" maxLength="50" className="form-control m-auto patientname" value={fullname ? fullname : ''} onChange={(e) => { setfullname(e.target.value) }} placeholder="Enter FirstName and LastName" required />
                </div>
                <hr />
                <div className="col-10 m-auto">
                    <p className="m-0 mb-2">Gender</p>
                    <div class="btn-group " role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" onClick={(e) => { setgender(e.target.value) }} className={`btn-check border-${gender == 'Male' || gender == 'male' ? 'burntumber' : ''} bg-${gender == 'Male' || gender == 'male' ? 'burntumber' : 'seashell'} text-${gender == 'Male' || gender == 'male' ? 'light' : 'charcoal'}`} value='Male' name="btnradio" id="btnradio1" autocomplete="off" />
                        <label className={`button rounded-0 shadow-0 border-${gender == 'Male' || gender == 'male' ? 'burntumber' : ''} bg-${gender == 'Male' || gender == 'male' ? 'burntumber' : 'seashell'} text-${gender == 'Male' || gender == 'male' ? 'light' : 'charcoal'}`} for="btnradio1">Male</label>

                        <input type="radio" onClick={(e) => { setgender(e.target.value) }} className={`btn-check border-${gender == 'Female' || gender == 'female' ? 'burntumber' : ''} bg-${gender == 'Female' || gender == 'female' ? 'burntumber' : 'seashell'} text-${gender == 'Female' || gender == 'female' ? 'light' : 'charcoal'}`} value='Female' name="btnradio" id="btnradio2" autocomplete="off" />
                        <label className={`button rounded-0 shadow-0 border-${gender == 'Female' || gender == 'female' ? 'burntumber' : ''} bg-${gender == 'Female' || gender == 'female' ? 'burntumber' : 'seashell'} text-${gender == 'Female' || gender == 'female' ? 'light' : 'charcoal'}`} for="btnradio2">Female</label>

                        <input type="radio" onClick={(e) => { setgender(e.target.value) }} className={`btn-check border-${gender == 'Others' || gender == 'others' ? '' : 'burntumber'} bg-${gender == 'Others' || gender == 'others' ? '' : 'burntumber'} text-${gender == 'Others' || gender == 'others' ? 'light' : 'charcoal'}`} value='Others' name="btnradio" id="btnradio3" autocomplete="off" />
                        <label className={`button rounded-0 shadow-0 border-${gender == 'Others' || gender == 'others' ? 'burntumber' : ''} bg-${gender == 'Others' || gender == 'others' ? 'burntumber' : 'seashell'} text-${gender == 'Others' || gender == 'others' ? 'light' : 'charcoal'}`} for="btnradio3">Others</label>
                    </div>
                </div>
                <hr />
                <div className="row p-0 m-0">
                    <div className="col-md-5 m-auto">
                        <label htmlFor="date" className=""> Enter Birth Date </label>
                        <input type="date" id="date" className="form-control" value={DOB ? DOB : ''} onChange={(e) => { setDOB(e.target.value) }} required />
                    </div>
                    <div className="col-md-5 m-auto">
                        <label htmlFor="inputAddress" className=""> Add Email </label>
                        <input type="text" className="form-control" id="inputAddress" value={email ? email : ''} placeholder="Email ID" onChange={(e) => { setemail(e.target.value) }} required />
                    </div>
                </div>
                <hr />
                <div className="col-10 pb-2 m-auto">
                    <label htmlFor="inputAddress" className="mb-2">Add Address</label>
                    <input type="text" className="form-control" id="inputAddress" value={address ? address : ''} placeholder="Location" onChange={(e) => { setaddress(e.target.value) }} required />
                </div>
                <div className="row p-0 m-0 py-2">
                    <div className="col-5 m-auto">
                        <label htmlFor="inputAddress" className="">Select Location</label>
                        <GooglePlacesAutocomplete
                            apiKey='AIzaSyC4wk5k8E6jKkpJClZlXZ8oavuPyi0AMVE'
                            selectProps={{
                                defaultInputValue: props.location ? props.location : data,
                                onChange: setData,
                                placeholder: "Select Location",
                            }}
                            onLoadFailed={(error) => {
                                console.log(error);
                            }}
                        />
                    </div>
                    <div className="col-5 m-auto">
                        <label htmlFor="inputpincode" className="">Pin Code</label>
                        <input type="number" className="form-control" id="inputpincode" value={pincode ? pincode : ''} placeholder="pincode" onChange={(e) => { setpincode(e.target.value) }} required />
                    </div>

                </div>
                <hr />
                <div className="row p-0 m-0">
                    <div className="col-11 m-auto">
                        <label htmlFor="date" className="">Is Main Account</label>
                        <select className='form-control' ref={ismainref} onChange={(e) => { setmain(e.target.value); d(e); }}>
                            <option value='1'>Yes</option>
                            <option value='2'>No</option>
                        </select>
                    </div>
                    <div className={`conatiner m-0 p-0 d-${display}`}>
                        <div className='col-md-5 m-auto'>
                            <label htmlFor="inputrelation" className="">Select Relation</label>
                            <select className='form-control' value={relation ? relation : ''} onChange={(e) => { setrelation(e.target.value) }}>
                                <option>Select Relation</option>
                                <option value='Son'>Son</option>
                                <option value='Daughter'>Daughter</option>
                                <option value='Father'>Father</option>
                                <option value='Mother'>Mother</option>
                                <option value='Husband'>Husband</option>
                                <option value='Wife'>Wife</option>
                                <option value='Brother'>Brother</option>
                                <option value='Sister'>Sister</option>
                                <option value='Grand Father'>Grand Father</option>
                                <option value='Grand Mother'>Grand Mother</option>
                                <option value='Grand Child'>Grand Child</option>
                            </select>
                        </div>
                        <div className="col-md-5 py-2 m-auto">
                            <label htmlFor="inputAddress" className=""> Select Main Account </label>
                            <input type="text" className="form-control position-relative" id="inputAddress" placeholder="Email ID" value={accountinput ? accountinput : ''} onChange={searchmainaccount} />
                            <div className={` d-${displaymainaccount} start-0 end-0 m-0 p-0 position-absolute searchinput`}>
                                {
                                    mainaccount.map((data) => (
                                        <button className='col-12 fs-6 m-0 p-0 text-end border-0 bg-pearl text-charcoal border border-1 shadow' name={data.id} value={data.full_name} onClick={get_value}>{data.full_name} | {data.id} | ({data.email ? data.email : 'email not found'})</button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-6 py-2 pb-2 m-auto text-center">
                    <button className="btn button-charcoal" onClick={confirmmessage} > Save Changes </button>
                </div>
                <div className="col-6 pb-2 m-auto text-center">
                    <button className="btn button-pearl " onClick={currentvalue}>Set Previous</button>
                </div>
            </div>

        </>

    )
}

export { UpdatePatient }
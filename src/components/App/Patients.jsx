import { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import ReactPaginate from 'react-paginate';
import { URL, TodayDate, DoctorsList, Doctorapi, Permissions, Secretkey } from '../../index'
import Notiflix from 'notiflix';
import { customconfirm } from "../features/notiflix/customconfirm"
import { UpdatePatient } from '../Patients/UpdatePatient'
import { UpdateAddress } from '../Patients/UpdateAddress'
import { AddAddress } from '../Patients/AddAddress'
//css
import '../../css/patient.css'
function Patients() {
  const url = useContext(URL)
  const permission = useContext(Permissions)
  const adminid = localStorage.getItem('id')
  const [PatientsList, setPatientsList] = useState([])
  const [pages, setpages] = useState()
  const [pagecount, setpagecount] = useState()
  const [tabindex, settabindex] = useState(0)
  const [Loading, setLoading] = useState(false)
  const [patientsearch, setpatientsearch] = useState()

  function GetPages() {
    try {
      axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=0`).then((response) => {
        setpagecount(response.data.data.total_count)
        setpages(Math.round(response.data.data.total_count / 10) + 1)
        setLoading(false)
      }).catch((e) => {
        Notiflix.Notify.warning(e.message)
        setLoading(false)
      })
    } catch (e) {
      Notiflix.Notify.warning(e.message)
      setLoading(false)
    }
  }
  async function getAllPatients(Data) {
    if (Data == undefined || Data.selected == undefined) {
      setLoading(true)
      setPatientsList()
      await axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=0`).then((response) => {
        setPatientsList(response.data.data.patients_list)
      })
      setLoading(false)
    } else {
      setLoading(true)
      setPatientsList()
      await axios.get(`${url}/patient/list?search=${patientsearch ? patientsearch : ''}&limit=10&offset=${Data.selected * 10}`).then((response) => {
        setPatientsList(response.data.data.patients_list)
      })
      setLoading(false)
    }


  }
  useEffect(() => {
    GetPages()
    getAllPatients()
  }, [pagecount, patientsearch])


  async function DeletePatient(patientid) {
    if (adminid && patientid) {
      try {
        await axios.post(`${url}/delete/patient`, {
          id: patientid,
          admin_id: adminid

        }).then((response) => {
          Notiflix.Notify.success(response.data.message)
          getAllPatients()
        })
      } catch (e) {
        alert(e)
      }
    }
  }
  function confirmmessage(name, patientid) {
    customconfirm()
    Notiflix.Confirm.show(
      `Delete Patient`,
      `Do you surely want to Delete Patient ${name} `,
      'Yes',
      'No',
      () => {
        DeletePatient(patientid)
      },
      () => {
        return 0
      },
      {
      },
    );
  }
  const reversefunction = (date) => {
    if (date) {
      date = date.split("-").reverse().join("-")
      return date
    }

  }
  const [updateaddress, setupdateaddress] = useState('none')
  const [updatepatient, setupdatepatient] = useState('none')
  const [addresspage, setaddresspage] = useState('none')
  const [form, setform] = useState();
  const [form2, setform2] = useState();
  const [form3, setform3] = useState();

  const OpenUpdatePatient = (i) => {
    if (updatepatient === 'none') {
      setupdatepatient('block')
      setform(i)
    }
  }
  const CloseUpdatePatient = () => {
    if (updatepatient === 'block') {
      setupdatepatient('none')
      setform()
    }
  }
  const OpenUpdateAddress = (i) => {
    if (updateaddress == 'none') {
      setupdateaddress('block')
      setform2(i)
    }
  }
  const CloseUpdateAddress = () => {
    if (updateaddress == 'block') {
      setupdateaddress('none')
      setform2()
    }
  }
  const Toggle_Address = (i)=>{
    if(addresspage == 'block'){
      setaddresspage('none')
      setform3()
    }
    if(addresspage == 'none'){
      setaddresspage('block')
      setform3(i)
    }
  }
  return (
    <section className="patientsection text-center position-relative">
      <div className="conatainer searchbar">
        <input className=" form-control m-auto mt-2" placeholder="Search Patient By Name or Number" onChange={(e) => { setpatientsearch(e.target.value); getAllPatients(); }} onBlur={getAllPatients} />
      </div>
      <div className="container-fluid p-0 m-0 scroll scroll-y " style={{ minHeight: '30rem' }}>
        <table className="table text-start fw-bold" >
          <thead className="text-charcoal75">
            <tr>
              <th className={`d-${permission.patient_edit == 1 ? '' : 'none'}`}>Update</th>
              <th>Patient Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Pincode</th>
              <th>Phone Number</th>
              <th>Is Main Account</th>
              <th className={`d-${permission.patient_delete == 1 ? '' : 'none'}`}>Delete</th>
              {/* <th>More</th> */}
            </tr>
          </thead>

          {
            Loading ? (
              <tbody className=' text-center' style={{ minHeight: '30vh' }}>
                <tr className='position-absolute border-0 start-0 end-0 px-5'>
                  <div class="d-flex align-items-center spinner">
                    <strong className=''>Getting Details please be Patient ...</strong>
                    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </tr>
              </tbody>
            ) : (
              PatientsList !=undefined && PatientsList.length == 0 ? (
                <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '30vh' }}>
                  <tr className=''>
                    <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Patients found</td>
                  </tr>
                </tbody>

              ) : (
                <tbody>
                  {
                    PatientsList !=undefined && PatientsList.map((data, i) => (
                      <tr className="align-middle">
                        <td className={`d-${permission.patient_edit == 1 ? '' : 'none'}`}>
                          <button className="button p-0 m-0 bg-transparent border-0 fw-bold dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" className="img-fluid"/>
                          </button>
                          <ul className="dropdown-menu shadow-sm p-2 scroll" style={{ '-webkit-appearance': 'none', 'appearance': 'none', width: 'max-content', height: '40vh' }}>
                            <li className="dropdown-item fw-bold d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { Toggle_Address(i); }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" />Add Address</li>
                            <li className="dropdown-item fw-bold d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { settabindex(i); OpenUpdatePatient(i) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image"/> Update Patient</li>
                            <li className="dropdown-item fw-bold d-flex border-1 border-bottom p-0 m-0 align-items-center" onClick={() => { OpenUpdateAddress(i) }}><img className='m-2 img-fluid' src={process.env.PUBLIC_URL + "/images/confirmed.png"} alt="displaying_image" />Update Address</li>
                          </ul>
                          { 
                            form == i ? (
                              <>
                              <div className="backdrop"></div>
                              <section id={i} className={`updatepatientform text-start position-absolute d-${tabindex == i ? updatepatient : 'none'} col-md-8 col-10 col-lg-6 bg-seashell top-0 rounded-2 shadow-sm border`}>
                                <UpdatePatient index={i} getAllPatients={getAllPatients} CloseUpdatePatient={CloseUpdatePatient} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : 'N/A'} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                              </section>
                              </>
                            ) : (<></>)
                          }
                          {
                            form2 == i ? (
                              <>
                              <div className="backdrop"></div>
                              <section className={`updatepatientform col-12 text-start position-absolute d-${form2 == i ? updateaddress : 'none'} bg-seashell top-0 rounded-1 shadow-sm border`} style={{ width: '100vh' }}>
                                <UpdateAddress i={i} data={data} CloseUpdateAddress={CloseUpdateAddress} getAllPatients={getAllPatients} />
                              </section>
                              </>
                            ) : (<></>)
                          }
                          {
                            form3 == i ?(
                              <>
                              <div className="backdrop"></div>
                              <section className={` col-12 text-start position-absolute d-${form3 == i ? addresspage : 'none'} bg-seashell mx-auto start-0 end-0 top-0 rounded-1 shadow-sm border`} style={{ width: '60vh' ,height:'50vh'}}>
                                <AddAddress Toggle_Address={Toggle_Address} patientid={data.id} searchinput={data.full_name ? data.full_name : ''} getAllPatients={getAllPatients} form3={form3}/>
                              </section>
                              </>
                            ):(<></>)
                          }

                        </td>
                        <td>{data.full_name ? data.full_name : 'N/A'}{ data.is_profile_verified ==1 ? <img src={process.env.PUBLIC_URL + 'images/verified.png'} style={{scale:'0.8'}}/>:'' }</td>
                        <td>{data.gender ? data.gender : 'N/A'}</td>
                        <td>{data.dob ? reversefunction(data.dob) : 'N/A'}</td>
                        <td>{data.email ? data.email : 'N/A'}</td>
                        <td>{data.pin_code ? data.pin_code : 'N/A'}</td>
                        <td>{data.phone_number ? data.phone_number : 'N/A'}</td>
                        <td>{data.parent ? ' No' : 'Yes'}</td>
                        <td className={`d-${permission.patient_delete == 1 ? '' : 'none'}`}>
                          <button className="btn p-0 m-0" onClick={(e) => { confirmmessage(data.full_name, data.id); }}><img src={process.env.PUBLIC_URL + "/images/delete.png"} alt="displaying_image" className="img-fluid" /></button></td>
                      </tr>

                    ))
                  }
                </tbody>
              ))
          }

        </table>
      </div>

      <div className="container-fluid mt-2 d-flex justify-content-center">

        < ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'.'}
          pageCount={pages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={2}
          onPageChange={getAllPatients}
          containerClassName={'pagination scroll align-self-center align-items-center'}
          pageClassName={'page-item text-charcoal'}
          pageLinkClassName={'page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1'}
          previousClassName={'btn button-charcoal-outline me-2'}
          previousLinkClassName={'text-decoration-none text-charcoal'}
          nextClassName={'btn button-charcoal-outline ms-2'}
          nextLinkClassName={'text-decoration-none text-charcoal'}
          breakClassName={'mx-2 text-charcoal fw-bold fs-4'}
          breakLinkClassName={'text-decoration-none text-charcoal'}
          activeClassName={'active'}
        />
      </div>

    </section>
  )



}
export default Patients
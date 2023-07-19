import axios from "axios"
import ReactPaginate from 'react-paginate';
import Notiflix from 'notiflix';
import { useState, useEffect, useContext, useRef } from "react"
import { UpdateDoctor } from "../Doctors/UpdateDoctor"
import { URL } from '../../index'
//css
import '../../css/Doctors.css'

function Doctors() {
    const url = useContext(URL)
    const clinicID = localStorage.getItem('ClinicId')
    const imagepath = 'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/assets/doctor/'
    const [Doctorssearch, setDoctorssearch] = useState()
    const [Doctorslist, setDoctorslist] = useState([])
    const [pages, setpages] = useState()
    const [pagecount, setpagecount] = useState()
    const [tabindex, settabindex] = useState()
    const [form, setform] = useState()
    const [pageloading, setpageloading] = useState(false)
    const [updatedoctor, setupdatedoctor] = useState('none')

    function GetPages() {
      try {
        axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=0`).then((response) => {
          setpagecount(response.data.data.total_count)
          setpages(Math.round(response.data.data.total_count / 10) + 1)
          setpageloading(false)
        }).catch((e) => {
          Notiflix.Notify.warning(e.message)
          setpageloading(false)
        })
      } catch (e) {
        Notiflix.Notify.warning(e.message)
        setpageloading(false)
      }
    }
    
    async function getAllDoctors(Data) {
      if (Data == undefined || Data.selected == undefined) {
        setpageloading(true)
        setDoctorslist()
        await axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=0`).then((response) => {
          setDoctorslist(response.data.data.doctor_list)
          console.log(response)
        })
        setpageloading(false)
      } else {
        setpageloading(true)
        setDoctorslist()
        await axios.get(`${url}/doctor/list?clinic_id=${clinicID}&search=${Doctorssearch ? Doctorssearch : ''}&limit=10&offset=${Data.selected * 10}`).then((response) => {
          setDoctorslist(response.data.data.doctor_list)
        })
        setpageloading(false)
      }
  
    }
  
    useEffect(() => {
      GetPages()
      getAllDoctors()
    }, [pagecount, Doctorssearch])
  
    function OpenUpdateDoctor(i) {
      if (updatedoctor === 'none') {
        setupdatedoctor('block')
        setform(i)
      }
    }
    function CloseUpdateDoctor() {
      if (updatedoctor === 'block') {
        setupdatedoctor('none')
      }
    }
  
    return (
      <section className="Doctorspage text-center position-relative">
        <div className="conatainer searchbar">
          <input className="form-control m-auto mt-2" placeholder="Search Doctor" onChange={(e) => { setDoctorssearch(e.target.value) }} />
        </div>
        <div className="container-fluid p-0 m-0 scroll scroll-y" style={{ minHeight: '30rem' }}>
          <table className="table text-start fw-bold" >
            <thead className="text-charcoal75">
              <tr>
                <th>Update</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Degree</th>
                <th>Mobile No.</th>
                <th>Email Id</th>
                <th>Procedures</th>
                {/* <th>More</th> */}
              </tr>
            </thead>
  
            {
              pageloading ? (
                <tbody className=' text-center' style={{ minHeight: '30vh' }}>
                  <tr className='position-absolute border-0 start-0 end-0 px-5'>
                    <div class="d-flex align-items-center">
                      <strong className=''>Getting Details please be Patient ...</strong>
                      <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                  </tr>
  
                </tbody>
              ) : (
                Doctorslist && Doctorslist.length == 0 ? (
                  <tbody className='text-center position-relative p-0 m-0 ' style={{ minHeight: '30vh' }}>
                    <tr className=''>
                      <td className='fw-bolder text-charcoal text-center position-absolute border-0 start-0 end-0 mx-3 p-2 border-0'>No Doctors found</td>
                    </tr>
                  </tbody>
  
                ) : (
                  <tbody style={{ minHeight: '32vh' }}>
                    {
                      Doctorslist && Doctorslist.map((data, i) => (
                        <tr className="align-middle">
                          <td><button className="btn p-0 m-0" onClick={(e) => { settabindex(i); OpenUpdateDoctor(i) }}><img src={process.env.PUBLIC_URL + "/images/confirmed.png"} style={{ width: "1.5rem" }} /></button>
                            {form == i ? (
                              <section id={i} className={`scroll scroll-y position-absolute d-${tabindex == i ? updatedoctor : 'none'} bg-seashell rounded shadow top-0 bottom-2 `} style={{ marginLeft: '22.5rem', width: '40rem', height: '35rem' }}>
                                <UpdateDoctor index={i} CloseUpdateDoctor={CloseUpdateDoctor} patientid={data.id} data={data} phonecountrycode={data.phone_country_code ? data.phone_country_code : ''} PhoneNo={data.phone_number ? Number(data.phone_number) : ''} dob={data.dob ? data.dob : ''} gender={data.gender ? data.gender : ''} full_name={data.full_name ? data.full_name : ''} email={data.email ? data.email : ''} pincode={data.pin_code ? data.pin_code : ''} location={data.location ? data.location : ''} parent={data.parent} linkid={data.link_id ? data.link_id : ''} relation={data.relation} latitude={data.latitude} longitude={data.longitude} />
                              </section>
                            ) : (<></>)
                            }
  
                          </td>
                          <td className="pe-5">{data.image ? <img className="img-fluid rounded-5" style={{ width: '2rem' }} src={imagepath + data.image} /> : 'Image not found'}{' '}{data.doctor_name ? data.doctor_name : ''}</td>
                          <td>{data.speciality.name}</td>
                          <td>{data.degree_suffix ? data.degree_suffix : ''}</td>
                          <td>{data.phone_number ? data.phone_number : ''}</td>
                          <td>{data.email}</td>
                          <td className="text-center"><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/info.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
                          {/* <td><button className="btn p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td> */}
                        </tr>
                      ))
                    }
                  </tbody>
                )
              )
            }
  
          </table>
        </div>
  
        <div className="d-flex text-center justify-content-center mt-3">
  
          < ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'. . .'}
            pageCount={pages}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={getAllDoctors}
            containerClassName={'pagination'}
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
  export default Doctors
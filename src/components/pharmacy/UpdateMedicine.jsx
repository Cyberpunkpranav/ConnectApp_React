import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import Notiflix from 'notiflix'
import { URL } from '../../index'
import { customconfirm } from '../features/notiflix/customconfirm';
import '../../css/bootstrap.css'

const UpdateMedicine = (props) => {
  const url = useContext(URL)
  const [displayname, setdisplayname] = useState()
  const [name, setname] = useState()
  const [saltname, setsaltname] = useState()
  const [manufacturer, setmanufacturer] = useState()
  const [strength, setstrength] = useState()
  const [unit, setunit] = useState()
  const [pack, setpack] = useState()
  const [packtype, setpacktype] = useState()
  const [mfid, setmfid] = useState()
  const [schedule, setschedule] = useState()
  const [hsn, sethsn] = useState()
  const [rack, setrack] = useState()
  const [maxsc, setmaxsc] = useState()
  const [minsc, setminsc] = useState()
  const [altsc, setaltsc] = useState()
  const [img, setimg] = useState('')
  const data = props.data
  const FillDetails = async () => {
    setdisplayname(data.display_name)
    setname(data.name)
    setsaltname(data.salt_name)
    setmanufacturer(data.manufacturer)
    setstrength(data.strength)
    setunit(data.medicine_unit)
    setpack(data.packaging)
    setpacktype(data.packaging_type_id)
    setmfid(data.medicine_form_id)
    setschedule(data.schedule)
    sethsn(data.hsn_code)
    setrack(data.rack_number)
    setmaxsc(data.max_stock_count)
    setminsc(data.min_stock_count)
    setaltsc(data.alert_stock_count)
    setimg(data.image)

  }
  useEffect(() => {
    FillDetails()
  }, [])
  const handleimage = async (e) => {
    console.log(e.target.files)
    if (e.target.files.length !== 0) {
      setimg(e.target.files)
    }

  }
  const UpdateMedicine = async () => {
    const Data = {
      medicine_id:data.id,
      display_name: displayname,
      name: name,
      salt_name: saltname,
      manufacturer: manufacturer,
      strength: strength,
      medicine_unit: Number(unit),
      packaging: pack,
      packaging_type_id: Number(packtype),
      medicine_form_id: Number(mfid),
      schedule: schedule,
      hsn_code: hsn,
      rack_number: rack,
      max_stock_count: Number(maxsc),
      min_stock_count: Number(minsc),
      alert_stock_count: Number(altsc),
      image:img ?  {
        name:img[0].name,
        size:img[0].size,
        type:img[0].type,
        webkitRelativePath:img[0].webkitRelativePath,
        lastModifiedDate:img[0].lastModifiedDate,
        lastModified:img[0].lastModified

      } :''
    }
    console.log(props.data)
console.log(props.data.id)
    try {
      await axios.post(`${url}/medicine/update`, Data).then((response) => {
        console.log(response)
        Notiflix.Notify.success(response.data.message)
      })
    } catch (e) {
      Notiflix.Notify.failure(e.message)
    }

  }
  function confirmmessage() {
    customconfirm()
    Notiflix.Confirm.show(
      `Save Purchase Entry`,
      `Do you surely want to Update ${data.display_name} Details`,
      'Yes',
      'No',
      () => {
        UpdateMedicine()
      },
      () => {
        return 0
      },
      {
      },
    );
  }

  if (img !== null) {
    console.log(img[0])
  }
  return (
    <div className='position-relative bg-seashell p-0 m-0'>
      <h5 className='p-0 m-0 text-center py-2 border-bottom'>Update Medicine</h5>
      <button className='btn btn-close position-absolute end-0 top-0 mt-1 me-1' onClick={props.ToggleNewMedicine}></button>
      <div className='scroll scroll-y' style={{ height: '78vh' }}>
        <div className="row p-0 m-0">
          <div className="row p-0 m-0 justify-content-end">
            <p className='text-charcoal fw-bold p-0 m-0 py-2 text-center'>Basic Details</p>
            <div className="col-5">
              <p className='p-0 m-0'>Display Name</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={displayname ? displayname : ''} onChange={(e) => { setdisplayname(e.target.value) }} />
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Name</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={name ? name : ''} onChange={(e) => { setname(e.target.value) }} />
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Salt Name</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={saltname ? saltname : ''} onChange={(e) => { setsaltname(e.target.value) }} />
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Manufacturer</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={manufacturer ? manufacturer : ''} onChange={(e) => { setmanufacturer(e.target.value) }} />
            </div>
          </div>

        </div>
        <div className="row p-0 m-0">
          <div className="row p-0 m-0 justify-content-end mt-3">
            <p className='text-charcoal fw-bold p-0 m-0 py-2 text-center'>Other Details  </p>
            <div className="col-5">
              <p className='p-0 m-0'>Strength</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={strength ? strength : ''} onChange={(e) => { setstrength(e.target.value) }} />
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Medicine Unit</p>
              <select className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={unit ? unit : ''} onChange={(e) => { setunit(e.target.value) }}>
                <option>Select Unit</option>
                <option value='1'>mg</option>
                <option value='2'>ml</option>
                <option value='3'>mcg</option>
                <option value='4'>g</option>
                <option value='5'>%</option>
              </select>
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Packaging</p>
              <input className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={pack ? pack : ''} onChange={(e) => { setpack(e.target.value) }} />
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Packaging Type</p>
              <select className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={packtype ? packtype : ''} onChange={(e) => { setpacktype(e.target.value) }}>
                <option>Select Packaging Type</option>
                <option value='1'>Strip</option>
                <option value='2'>Tube</option>
                <option value='3'>Bottle</option>
                <option value='4'>Syringe</option>
              </select>
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Medicine Form</p>
              <select className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={mfid ? mfid : ''} onChange={(e) => { setmfid(e.target.value) }}>
                <option>Select Medicine form</option>
                <option value="1" >tablet</option>
                <option value="2" >capsule</option>
                <option value="3" >liquid</option>
                <option value="4">topical</option>
                <option value="5" >cream</option>
                <option value="6" >device</option>
                <option value="7" >drop</option>
                <option value="8" >foam</option>
                <option value="9" >gel</option>
                <option value="10" >inhaler</option>
                <option value="11" >injection</option>
                <option value="12" >lotion</option>
                <option value="13" >ointment</option>
                <option value="14" >patch</option>
                <option value="15" >powder</option>
                <option value="16" >spray</option>
              </select>
            </div>
            <div className="col-5">
              <p className='p-0 m-0'>Schedule</p>
              <select className='form-control w-75 bg-seashell p-0 m-0 px-2 py-1' value={schedule ? schedule : ''} onChange={(e) => { setschedule(e.target.value) }} >
                <option>Select Schedule</option>
                <option value="G">G</option>
                <option value="H" >H</option>
                <option value="X" >X</option>
                <option value="J" >J</option>
                <option value="A" >A</option>
                <option value="B" >B</option>
                <option value="C" >C</option>
                <option value="D" >D</option>
                <option value="E" >E</option>
                <option value="F" >F</option>
                <option value="K" >K</option>
                <option value="M" >M</option>
                <option value="N" >N</option>
                <option value="O" >O</option>
                <option value="P" >P</option>
                <option value="Q" >Q</option>
                <option value="R" >R</option>
                <option value="S" >S</option>
                <option value="T" >T</option>
                <option value="U" >U</option>
                <option value="V" >V</option>
                <option value="Y">Y</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row p-0 m-0 justify-content-center mt-3">
          <p className='text-charcoal fw-bold p-0 m-0 py-2 text-center'>Choose Medicine Photo</p>
          <div className="col-4 ms-5">
            <input type='file' className='form-control bg-seashell p-0 m-0 px-2 py-1' onChange={(e) => { handleimage(e) }} />
          </div>
        </div>
        <div className="row p-0 m-0 justify-content-end mt-3 mb-3">
          <p className='text-charcoal fw-bold p-0 m-0 py-2 text-center'>HSN Code and Count</p>
          <div className="col-12">
            <p className='p-0 m-0'>HSN Code</p>
            <input className='form-control bg-seashell p-0 m-0 px-2 py-1' value={hsn ? hsn : ''} onChange={(e) => { sethsn(e.target.value) }} />
          </div>
          <div className="col-3">
            <p className='p-0 m-0'>Rack Number</p>
            <input className='form-control bg-seashell p-0 m-0 px-2 py-1' value={rack ? rack : ''} onChange={(e) => { setrack(e.target.value) }} />
          </div>
          <div className="col-3">
            <p className='p-0 m-0'>Max. Stock Count</p>
            <input className='form-control bg-seashell p-0 m-0 px-2 py-1' value={maxsc ? maxsc : ''} onChange={(e) => { setmaxsc(e.target.value) }} />
          </div>
          <div className="col-3">
            <p className='p-0 m-0'>Min. Stock Count</p>
            <input className='form-control bg-seashell p-0 m-0 px-2 py-1' value={minsc ? minsc : ''} onChange={(e) => { setminsc(e.target.value) }} />
          </div>
          <div className="col-3">
            <p className='p-0 m-0'>Alert Stock Count </p>
            <input className='form-control bg-seashell p-0 m-0 px-2 py-1' value={altsc ? altsc : ''} onChange={(e) => { setaltsc(e.target.value) }} />
          </div>
        </div>
      </div>
      <div className='bg-pearl border p-3 align-items-center '>
        <div className="row p-0 m-0 text-center justify-content-between align-items-center align-self-center">

          <div className="col-6">
            <button className='button button-charcoal ' onClick={confirmmessage}>Update</button>
          </div>
          <div className="col-6">
            <button className='button button-seashell' onClick={FillDetails}>Set Previous</button>


          </div>
        </div>
      </div>
    </div>
  )
}
export { UpdateMedicine }
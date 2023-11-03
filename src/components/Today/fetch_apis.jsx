import axios from "axios"
import Notiflix from "notiflix"

const url = 'https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect'
const adminid = localStorage.getItem('id')
const ClinicId = localStorage.getItem("ClinicId");

export const Get_Document=async(appointment_id)=>{  
    let data
    try{
     await axios.get(`${url}/all/document?appointment_id=${appointment_id}`).then((response)=>{
        data = response.data.data
      }).catch((e)=>{
        Notiflix.Notify.failure(e.message)
      })
    }catch(e){
      Notiflix.Notify.failure(e.message)
    }
    return data 
  }
  export const UpadteStatus=async(appointmentId,status,adminId)=>{
    let res;
    try {
      Notiflix.Loading.circle('Upadating Appointment Status', {
        backgroundColor: 'rgb(242, 242, 242,0.5)',
        svgColor: '#96351E',
        messageColor: '#96351E',
        messageFontSize: '1.5rem'
      })
      await axios.post(`${url}/appointment/change/status`, {
        appointment_id: appointmentId,
        status: status,
        admin_id: adminId
      }).then((response) => {
        Notiflix.Loading.remove()
        res = response
      }).catch((e)=>{
        Notiflix.Loading.remove()
        Notiflix.Notify.failure(e.message)
      })
    } catch (e) {
      Notiflix.Loading.remove()
      Notiflix.Notify.failure(e.message)
    }
}
export const appointment_status = async()=>{
  let data ;
  try {
      await axios.get(`${url}/DSR/appointments?admin_id=${adminid}&clinic_id=${ClinicId}`).then((response)=>{
        data = response.data.data.all_appointments_status
      }).catch((e)=>{
        Notiflix.Notify.failure(e.message)
      })
  } catch (error) {
    Notiflix.Notify.failure(error.message)
  }
  return data
}

export const AllAppointments=async(clinic_id,from_date,to_date)=>{
  let res;
  await axios.get(`${url}/appointment/list?clinic_id=${clinic_id}&from_date=${from_date}&to_date=${to_date}`).then((response) => {
    res = response.data.data
  })
  return res
}
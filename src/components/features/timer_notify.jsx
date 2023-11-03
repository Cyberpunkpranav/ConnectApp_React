import {useContext} from 'react'
import { Doctorapi,TodayDate } from '../../index.jsx';

const Doctor_data = ()=>{
  const Doctors = useContext(Doctorapi)
  const Todaydate = useContext(TodayDate)
  const clinic_id = localStorage.getItem('ClinicId')
  return [Doctors,Todaydate,clinic_id]
}

export const timer_notify = (docid)=>{
  let doclogouts = []
  const [doctor_data,todayDate,clinic_id]  = Doctor_data()
  let docobj = {
    doc_id :  '',
    doc_name:'',
    todaylogs:[],
    last_logout:''
  }
  let result = []
 if(docid !=undefined){
  for(let i=0;i<doctor_data.length;i++){
    if(docid == doctor_data[i].id){
    let logins = []
      for(let j=0;j<doctor_data[i].login_history.length;j++){
          if(doctor_data[i].login_history[j].date == todayDate && clinic_id == doctor_data[i].login_history[j].clinic_id ){
            logins.push(doctor_data[i].login_history[j])
          }
      }
      if(logins.length>0){
      doclogouts.push(
        docobj = {
          doc_id:doctor_data[i].id,
          doc_name:doctor_data[i].doctor_name,
          todaylogs:logins,
          last_logout:logins[logins.length-1].logout_time !=null ?0:1
        }
      )
    }
  }
  }
}
for(let i=0;i<doclogouts.length;i++){
    result.push(doclogouts[i].last_logout) 
}
return result
}

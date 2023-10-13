import React ,{useState,useContext} from 'react'
import { Doctorapi,TodayDate } from '../../index.jsx';
import Notiflix from 'notiflix';
import axios from 'axios';
let doctor_data = ''
 function fetch_Doc_data() {
    let ClinicId = localStorage.getItem("ClinicId");
    try {
       axios.get(`https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect/doctor/list?clinic_id=${ClinicId}&limit=100&offset=0`).then(function (response) {
        if(doctor_data.length==0){
            doctor_data = response.data.data.doctor_list
        }
      });
    } catch (e) {
      Notiflix.Report.failure(
        `${e.message}`,
        "Please Check your Internet Connection and retry",
        "Retry",
        () => {
          window.location.reload();
        }
      );
    }
    return doctor_data
  }

  const timeout_notification = () => {
    let sent = 0
    if(doctor_data.length==0){
        doctor_data = fetch_Doc_data()
    }

    const d = new Date();
  const date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
  const monthcount = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const yearcount = d.getFullYear();
  var APIDate = `${yearcount}-${monthcount}-${date}`;
  var todayDate = APIDate

    let DocTimeouts = []
    let reminder = ''
    let docobj = {
      doc_id :  '',
      doc_name:'',
      end_time:'',
    }
      function getCurrentTime12HrFormat() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        // Convert hours to 12-hour format
        hours = hours % 12 || 12;
      
        // Pad single-digit minutes with a leading zero
        const formattedMinutes = String(minutes).padStart(2, '0');
      
        // Create the formatted time string
        const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;
      
        return formattedTime;
      }
      function tConvert(time) {
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        if (time.length > 1) {
          time = time.slice(1);
          time[3] = +time[0] < 12 ? ' AM' : ' PM';
          time[0] = +time[0] % 12 || 12;
        } 
        return time.join('');
      }
    const currentTime12Hr = getCurrentTime12HrFormat()
    if(doctor_data !=undefined){
    for(let i=0;i<doctor_data.length;i++){
      let Endtime = ''
        for(let j=0;j<doctor_data[i].month_timeslots.length;j++){
            if(doctor_data[i].month_timeslots[j].date == todayDate){
              Endtime = doctor_data[i].month_timeslots[j].time_from 
            }
        }
        DocTimeouts.push(
          docobj = {
            doc_id:doctor_data[i].id,
            doc_name:doctor_data[i].doctor_name,
            end_time:Endtime,
          }
        )
    }
    }
    if(DocTimeouts !=undefined){    
    for(let i=0;i<DocTimeouts.length;i++){
      if(DocTimeouts[i].end_time){
        let endtime = tConvert(DocTimeouts[i].end_time)
        if(String(currentTime12Hr) == String(endtime)){
          reminder = `Dr. ${DocTimeouts[i].doc_name} timeslots ends on ${endtime} `
          if(sent == 0){
            Notiflix.Report.info(
                `Doctor Time Slots`,
                `Dr. ${DocTimeouts[i].doc_name} timeslots ends after ${endtime}`,
                "Confirm",
                () => {
                  return 0
                }
              )
          }
          sent =1
       }
      }
    }     
  }
  return (<></>)
  }
  export{timeout_notification}


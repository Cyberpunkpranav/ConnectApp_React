import React from 'react'
import '../../../css/bootstrap.css'
import Notiflix from 'notiflix'

const customloading = () => {
  return (
    Notiflix.Loading.init({
      className: 'notiflix-loading',
      zindex: 4000,
      backgroundColor: 'transparent',
      rtl: false,
      fontFamily: 'Quicksand',
      cssAnimation: true,
      cssAnimationDuration: 400,
      clickToClose: false,
      customSvgUrl: null,
      customSvgCode: null,
      svgSize: '80px',
      svgColor: '#f2f2f2',
      messageID: 'NotiflixLoadingMessage',
      messageFontSize: '15px',
      messageMaxLength: 34,
      messageColor: '#f2f2f2',
    })
  )
}

export { customloading }
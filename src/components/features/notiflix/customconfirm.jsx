import '../../../css/bootstrap.css'
import Notiflix from 'notiflix'
const customconfirm = () => {
  return (
    Notiflix.Confirm.init({
      className: 'notiflix-confirm',
      width: '30rem',
      zindex: 4003,
      position: 'top',
      distance: '0rem',
      backgroundColor: '#f2f2f2',
      borderRadius: '20px',
      backOverlay: true,
      backOverlayColor: 'rgba(0,0,0,0.5)',
      rtl: false,
      fontFamily: 'Urbanist',
      cssAnimation: true,
      cssAnimationDuration: 300,
      cssAnimationStyle: 'fade',
      plainText: true,
      titleColor: '#222023',
      titleFontSize: '1.5rem',
      titleMaxLength: 34,
      messageColor: '#222023',
      messageFontSize: '1.2rem',
      messageMaxLength: 110,
      buttonsFontSize: '1rem',
      buttonsMaxLength: 34,
      okButtonColor: '#f8f8f8',
      okButtonBackground: '#222023',
      cancelButtonColor: '#222023',
      cancelButtonBackground: '#ffffff',
    })
  )
}

export { customconfirm }


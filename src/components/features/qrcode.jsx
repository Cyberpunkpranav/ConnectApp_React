import React from 'react'
import QRCode from "react-qr-code";
const QRcode = (props) => {
  return (
    <div style={{ height: "auto", maxWidth: 64, width: "100%" }}>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={props.id}
        viewBox={`0 0 256 256`} 
      />
    </div>
  )
}

export { QRcode }
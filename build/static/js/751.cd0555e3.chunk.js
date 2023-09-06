"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[751],{751:function(e,t,a){a.r(t);var s=a(1413),c=a(9439),n=a(9867),o=a(606),l=a(6626),r=a(7992),i=a.n(r),d=a(7548),h=a.n(d),m=a(5517),x=(a(4012),a(9045),a(9371),a(4594),a(2834));t.default=function(){var e=(0,n.useContext)(l.q2),t=((0,n.useContext)(l.Pl),(0,n.useContext)(l.U8)),a=(localStorage.getItem("id"),(0,n.useContext)(l.Jx)),r=(0,n.useRef)(),d=(0,n.useState)(),u=(0,c.Z)(d,2),f=u[0],p=u[1],b=(0,n.useState)(),g=(0,c.Z)(b,2),N=g[0],v=g[1],j=(0,n.useState)(),w=(0,c.Z)(j,2),y=w[0],C=w[1],k=(0,n.useState)(!1),_=(0,c.Z)(k,2),S=_[0],Z=_[1],L=(0,n.useState)([]),q=(0,c.Z)(L,2),F=q[0],R=q[1],O=(0,n.useState)(),P=(0,c.Z)(O,2),B=(P[0],P[1],(0,n.useState)([])),D=(0,c.Z)(B,2),H=D[0],z=D[1],E=(0,n.useState)(),I=(0,c.Z)(E,2),M=(I[0],I[1],(0,n.useState)()),Q=(0,c.Z)(M,2),V=Q[0],A=Q[1],T=function(e){if(e)return e=e.split("-").reverse().join("-")};function U(e){if(void 0==e||void 0==e.selected){Z(!0);try{o.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(f,"&limit=10&offset=0&from_date=").concat(N||t,"&to_date=").concat(y||(N||t))).then((function(e){R(e.data.data.medicine),Z(!1)})).catch((function(e){i().Notify.warning(e.message),Z(!1)}))}catch(c){i().Notify.warning(c.message),Z(!1)}}else{Z(!0);try{o.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(f,"&limit=10&offset=").concat(10*e.selected,"&from_date=").concat(N||t,"&to_date=").concat(y||(N||t))).then((function(e){var t=[],a=[],c=[],n=Object.keys(e.data.data.medicine).map((function(t){return(0,s.Z)({medicine_id:t},e.data.data.medicine[t])}));t.push(n);var o=Object.keys(e.data.data.vaccine).map((function(t){return(0,s.Z)({vaccine_id:t},e.data.data.vaccine[t])}));a.push(o),c.push(t),c.push(a),c=c.flat(),R(c.flat()),Z(!1)})).catch((function(e){i().Notify.warning(e),Z(!1)}))}catch(c){i().Notify.warning(c.message),Z(!1)}}}(0,n.useEffect)((function(){!function(){Z(!0);try{o.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(f,"&from_date=").concat(N||t,"&to_date=").concat(y||N||t)).then((function(e){A(e.data.data.count),z(Math.round(e.data.data.count/10)+1),Z(!1)})).catch((function(e){i().Notify.warning(e.message),Z(!1)}))}catch(e){i().Notify.warning(e.message),Z(!1)}}()}),[f,N,y]),(0,n.useEffect)((function(){U()}),[V]);var G=Object.keys(F).map((function(e){return(0,s.Z)({id:e},F[e])}));return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("h2",{className:" ms-3 text-charcoal fw-bolder mt-4",style:{width:"fit-content"},children:[" ",V," ",V>1?"Stock Reports":"Stock Report"," ","  "]}),(0,x.jsxs)("div",{className:"row p-0 m-0 text-center ms-2 mt-2",children:[(0,x.jsx)("div",{className:"col-auto text-charcoal text-center fw-bolder bg-seashell rounded-2 ",children:(0,x.jsxs)("select",{className:"fw-bold form-control bg-seashell text-burntumber text-center border-0",onChange:function(e){p(e.target.value)},children:[(0,x.jsxs)("option",{value:"Choose Location",children:["Choose Location ",(0,x.jsx)("div",{className:"mt-3 bg-seashell border-0"})," "]}),e.map((function(e){return(0,x.jsx)("option",{value:e.id,children:e.title})}))]})}),(0,x.jsx)("div",{className:"col-auto ms-1 bg-seashell rounded-2",children:(0,x.jsxs)("div",{className:"row p-0 m-0 align-items-center align-self-center",children:[(0,x.jsx)("div",{className:"col-auto p-0 m-0 text-charcoal text-center fw-bolder bg-seashell ",children:(0,x.jsx)("input",{type:"date",placeholder:"fromdate",className:"form-control border-0 bg-seashell text-charcoal text-center fw-bolder ",value:N||(t||""),onChange:function(e){v(e.target.value)}})}),(0,x.jsx)("div",{className:"col-auto p-0 m-0",children:"-"}),(0,x.jsx)("div",{className:"col-auto p-0 m-0  text-charcoal text-center fw-bolder bgseashell",children:(0,x.jsx)("input",{type:"date",className:" form-control border-0 bg-seashell text-charcoal text-center fw-bolder",value:y||(N||(t||"")),onChange:function(e){C(e.target.value)}})})]})}),(0,x.jsx)("div",{className:"col-auto p-0 m-0 export align-self-center text-center ms-xl-4 ",children:(0,x.jsx)(m.DownloadTableExcel,{filename:"".concat(T(N)+" to "+T(y)," StockReports"),sheet:"StockReports",currentTableRef:r.current,children:(0,x.jsx)("button",{className:"button button-seashell text-start fw-bold",children:" Export"})})})]}),(0,x.jsx)("div",{className:"scroll scroll-y p-0 m-0 mt-2",style:{minHeight:"40vh",height:"58vh",maxHeight:"70vh"},children:(0,x.jsxs)("table",{className:"table text-start table-responsive",ref:r,children:[(0,x.jsx)("thead",{className:" p-0 m-0 position-sticky top-0 bg-pearl",children:(0,x.jsxs)("tr",{className:" ",children:[(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Item ID "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Item Name "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Opening Qty "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Opening Value "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Purchase Qty "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Purchase Value "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Sale Qty "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Sale Value "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Closing Qty "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Closing Value "})]})}),S?(0,x.jsx)("tbody",{className:"text-center",style:{minHeight:"55vh",height:"55vh"},children:(0,x.jsx)("tr",{className:"position-absolute border-0 start-0 end-0 px-5",children:(0,x.jsxs)("div",{class:"d-flex align-items-center spinner",children:[(0,x.jsx)("strong",{className:"",style:{fontSize:"1rem"},children:"Getting Details please be Patient ..."}),(0,x.jsx)("div",{className:"spinner-border ms-auto",role:"status","aria-hidden":"true"})]})})}):F&&0!=F.length?(0,x.jsx)("tbody",{children:G.map((function(e,t){return(0,x.jsxs)("tr",{className:" bg-".concat(t%2==0?"seashell":"pearl"," align-middle"),children:[(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.id?e.id:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.item_name?e.item_name:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.opening_qty?e.opening_qty:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:["\u20b9",void 0!=e.opening_value?Number(e.opening_value).toFixed(2):""]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.purchase_qty?e.purchase_qty:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:["\u20b9",void 0!=e.purchase_value?Number(e.purchase_value).toFixed(2):""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.sale_qty?e.sale_qty:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:["\u20b9",void 0!=e.sale_value?Number(e.sale_value).toFixed(2):""]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.closing_qty?e.closing_qty:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:["\u20b9",void 0!=e.closing_value?Number(e.closing_value).toFixed(2):""]})]},t)}))}):(0,x.jsx)("tbody",{className:"text-center p-0 m-0",style:{minHeight:"55vh",maxHeight:"55vh"},children:(0,x.jsx)("div",{className:"position-absolute border-0 start-0 end-0 mx-3 p-2",children:(0,x.jsx)("strong",{className:"text-charcoal fw-bolder text-center",children:" No Stock Reports "})})})]})}),(0,x.jsx)("div",{className:"container-fluid mt-2 d-flex justify-content-center",children:(0,x.jsx)(h(),{previousLabel:"Previous",nextLabel:"Next",breakLabel:".",pageCount:H,marginPagesDisplayed:3,pageRangeDisplayed:2,onPageChange:U,containerClassName:"pagination scroll align-self-center align-items-center",pageClassName:"page-item text-charcoal",pageLinkClassName:"page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1",previousClassName:"btn button-charcoal-outline me-2",previousLinkClassName:"text-decoration-none text-charcoal",nextClassName:"btn button-charcoal-outline ms-2",nextLinkClassName:"text-decoration-none text-charcoal",breakClassName:"d-flex mx-2 text-charcoal fw-bold fs-4",breakLinkClassName:"text-decoration-none text-charcoal",activeClassName:"active "})})]})}},4012:function(e,t,a){a.d(t,{H:function(){return n}});a(9045);var s=a(7992),c=a.n(s),n=function(){return c().Confirm.init({className:"notiflix-confirm",width:"30rem",zindex:4003,position:"top",distance:"0rem",backgroundColor:"#f2f2f2",borderRadius:"20px",backOverlay:!0,backOverlayColor:"rgba(0,0,0,0.5)",rtl:!1,fontFamily:"Urbanist",cssAnimation:!0,cssAnimationDuration:300,cssAnimationStyle:"fade",plainText:!0,titleColor:"#222023",titleFontSize:"1.5rem",titleMaxLength:34,messageColor:"#222023",messageFontSize:"1.2rem",messageMaxLength:110,buttonsFontSize:"1rem",buttonsMaxLength:34,okButtonColor:"#f8f8f8",okButtonBackground:"#222023",cancelButtonColor:"#222023",cancelButtonBackground:"#ffffff"})}},9045:function(){}}]);
//# sourceMappingURL=751.cd0555e3.chunk.js.map
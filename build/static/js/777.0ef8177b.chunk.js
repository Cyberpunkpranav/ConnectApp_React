"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[777],{5777:function(e,t,a){a.r(t);var n=a(1413),o=a(9439),c=a(9867),s=a(606),l=a(6626),r=a(7992),i=a.n(r),d=a(7548),m=a.n(d),h=a(5517),x=(a(4012),a(9045),a(9371),a(4594),a(2834));t.default=function(){(0,c.useContext)(l.Pl);var e=(0,c.useContext)(l.U8),t=(0,c.useContext)(l.q2),a=(localStorage.getItem("id"),(0,c.useContext)(l.Jx)),r=(0,c.useRef)(),d=(0,c.useState)(),u=(0,o.Z)(d,2),f=(u[0],u[1],(0,c.useState)()),b=(0,o.Z)(f,2),p=b[0],g=b[1],N=(0,c.useState)(),j=(0,o.Z)(N,2),v=j[0],w=j[1],y=(0,c.useState)(),k=(0,o.Z)(y,2),C=k[0],S=k[1],_=(0,c.useState)(!1),Z=(0,o.Z)(_,2),L=Z[0],B=Z[1],D=(0,c.useState)([]),H=(0,o.Z)(D,2),q=H[0],z=H[1],F=(0,c.useState)(),P=(0,o.Z)(F,2),R=(P[0],P[1],(0,c.useState)([])),T=(0,o.Z)(R,2),V=T[0],E=T[1],I=(0,c.useState)(),M=(0,o.Z)(I,2),A=(M[0],M[1],(0,c.useState)()),O=(0,o.Z)(A,2),U=O[0],G=O[1],J=function(e){if(e)return e=e.split("-").reverse().join("-")};function Q(t){if(void 0==t||void 0==t.selected){B(!0);try{s.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(p,"&limit=10&offset=0&from_date=").concat(v||e,"&to_date=").concat(C||(v||e))).then((function(e){z(e.data.data.medicine),B(!1)})).catch((function(e){i().Notify.warning(e.message),B(!1)}))}catch(n){i().Notify.warning(n.message),B(!1)}}else{B(!0);try{s.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(p,"&limit=25&offset=").concat(10*t.selected,"&from_date=").concat(v||e,"&to_date=").concat(C||(v||e))).then((function(e){z(e.data.data.medicine),B(!1)})).catch((function(e){i().Notify.warning(e),B(!1)}))}catch(n){i().Notify.warning(n.message),B(!1)}}}(0,c.useEffect)((function(){!function(){B(!0);try{s.Z.get("".concat(a,"/reports/stock/report?location_id=").concat(p,"&from_date=").concat(v||e,"&to_date=").concat(C||v||e)).then((function(e){G(e.data.data.count),E(Math.round(e.data.data.count/10)+1),B(!1)})).catch((function(e){i().Notify.warning(e.message),B(!1)}))}catch(t){i().Notify.warning(t.message),B(!1)}}()}),[p,v,C]),(0,c.useEffect)((function(){Q()}),[U]);var K=Object.keys(q).map((function(e){return(0,n.Z)({id:e},q[e])}));return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsxs)("h2",{className:" ms-3 text-charcoal fw-bolder mt-2",style:{width:"fit-content"},children:[" ",U," ",U>1?"Stock Valuations":"Stock Valution"," ","  "]}),(0,x.jsxs)("div",{className:"row p-0 m-0 ms-2 mt-2",children:[(0,x.jsx)("div",{className:"col-auto p-0 m-0 text-burntumber text-center fw-bolder bg-seashell me-2 align-self-center rounded-2 ",children:(0,x.jsxs)("select",{className:"fw-bold button button-seashell text-burntumber border-0 text-center",onChange:function(e){g(e.target.value)},children:[(0,x.jsx)("option",{value:"Choose Location",children:"Choose Location"}),t.map((function(e){return(0,x.jsx)("option",{value:e.id,children:e.title})}))]})}),(0,x.jsx)("div",{className:"col-auto bg-seashell rounded-2",children:(0,x.jsxs)("div",{className:"row p-0 m-0 align-items-center align-self-center",children:[(0,x.jsx)("div",{className:"col-auto p-0 m-0 text-burntumber text-center fw-bolder bg-pearl  rounded-1 ",children:(0,x.jsx)("input",{type:"date",placeholder:"fromdate",className:"form-control border-0 bg-seashell text-charcoal text-center fw-bolder ",value:v||(e||""),onChange:function(e){w(e.target.value)}})}),(0,x.jsx)("div",{className:"col-auto p-0 m-0",children:"-"}),(0,x.jsx)("div",{className:"col-auto p-0 m-0  text-burntumber text-center fw-bolder bg-pearl rounded-1",children:(0,x.jsx)("input",{type:"date",className:" form-control border-0 bg-seashell text-charcoal text-center fw-bolder",value:C||(v||(e||"")),onChange:function(e){S(e.target.value)}})})]})}),(0,x.jsx)("div",{className:"col-auto p-0 m-0 export ms-xl-4",children:(0,x.jsx)(h.DownloadTableExcel,{filename:"".concat(J(v)+" to "+J(C)," StockValuation"),sheet:"StockValuation",currentTableRef:r.current,children:(0,x.jsx)("button",{className:"button button-seashell fw-bold",children:" Export"})})})]}),(0,x.jsx)("div",{className:"scroll scroll-y p-0 m-0 mt-2",style:{minHeight:"40vh",height:"58vh",maxHeight:"70vh"},children:(0,x.jsxs)("table",{className:"table text-start table-responsive",ref:r,children:[(0,x.jsx)("thead",{className:" p-0 m-0 position-sticky top-0 bg-pearl",children:(0,x.jsxs)("tr",{className:" ",children:[(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Item ID "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Item Name "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Stock Type "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Batch "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Stock Qty "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Rate "}),(0,x.jsx)("th",{className:"text-charcoal75 fw-bolder p-0 m-0 px-1",children:" Total "})]})}),L?(0,x.jsx)("tbody",{className:"text-center",style:{minHeight:"55vh",height:"55vh"},children:(0,x.jsx)("tr",{className:"position-absolute border-0 start-0 end-0 px-5",children:(0,x.jsxs)("div",{class:"d-flex align-items-center spinner",children:[(0,x.jsx)("strong",{className:"",style:{fontSize:"1rem"},children:"Getting Details please be Patient ..."}),(0,x.jsx)("div",{className:"spinner-border ms-auto",role:"status","aria-hidden":"true"})]})})}):q&&0!=q.length?(0,x.jsx)("tbody",{children:K.map((function(e,t){return(0,x.jsxs)("tr",{className:" bg-".concat(t%2==0?"seashell":"pearl"," align-middle"),children:[(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.id?e.id:""," "]}),(0,x.jsx)("td",{className:"text-charcoal fw-bold",children:void 0!=e.item_name?e.item_name:""}),(0,x.jsx)("td",{className:"text-charcoal fw-bold",children:" "}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.batch?e.batch:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.closing_qty?e.closing_qty:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.rate?e.rate:""," "]}),(0,x.jsxs)("td",{className:"text-charcoal fw-bold",children:[void 0!=e.rate&&void 0!=e.closing_qty?Number(e.rate)*Number(e.closing_qty):""," "]})]},t)}))}):(0,x.jsx)("tbody",{className:"text-center p-0 m-0",style:{minHeight:"55vh",maxHeight:"55vh"},children:(0,x.jsx)("div",{className:"position-absolute border-0 start-0 end-0 mx-3 p-2",children:(0,x.jsx)("strong",{className:"text-charcoal fw-bolder text-center",children:" No Stock Valuations "})})})]})}),(0,x.jsx)("div",{className:"container-fluid mt-2 d-flex justify-content-center",children:(0,x.jsx)(m(),{previousLabel:"Previous",nextLabel:"Next",breakLabel:".",pageCount:V,marginPagesDisplayed:3,pageRangeDisplayed:2,onPageChange:Q,containerClassName:"pagination scroll align-self-center align-items-center",pageClassName:"page-item text-charcoal",pageLinkClassName:"page-link text-decoration-none text-charcoal border-charcoal rounded-1 mx-1",previousClassName:"btn button-charcoal-outline me-2",previousLinkClassName:"text-decoration-none text-charcoal",nextClassName:"btn button-charcoal-outline ms-2",nextLinkClassName:"text-decoration-none text-charcoal",breakClassName:"d-flex mx-2 text-charcoal fw-bold fs-4",breakLinkClassName:"text-decoration-none text-charcoal",activeClassName:"active "})})]})}},4012:function(e,t,a){a.d(t,{H:function(){return c}});a(9045);var n=a(7992),o=a.n(n),c=function(){return o().Confirm.init({className:"notiflix-confirm",width:"30rem",zindex:4003,position:"top",distance:"0rem",backgroundColor:"#f2f2f2",borderRadius:"20px",backOverlay:!0,backOverlayColor:"rgba(0,0,0,0.5)",rtl:!1,fontFamily:"Urbanist",cssAnimation:!0,cssAnimationDuration:300,cssAnimationStyle:"fade",plainText:!0,titleColor:"#222023",titleFontSize:"1.5rem",titleMaxLength:34,messageColor:"#222023",messageFontSize:"1.2rem",messageMaxLength:110,buttonsFontSize:"1rem",buttonsMaxLength:34,okButtonColor:"#f8f8f8",okButtonBackground:"#222023",cancelButtonColor:"#222023",cancelButtonBackground:"#ffffff"})}},9045:function(){}}]);
//# sourceMappingURL=777.0ef8177b.chunk.js.map
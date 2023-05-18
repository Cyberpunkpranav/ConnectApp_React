"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[238],{8238:function(e,t,n){var a=n(9439),s=n(9867),l=(n(9371),n(9045),n(5270),n(2834));t.Z=function(e){var t=(0,s.useState)("none"),n=(0,a.Z)(t,2),i=(n[0],n[1],(0,s.useState)(0)),c=(0,a.Z)(i,2),o=c[0],r=c[1],d=(0,s.useState)(0),m=(0,a.Z)(d,2),p=m[0],u=m[1];return(0,s.useEffect)((function(){!function(){var t=e.appointmentData;if(null!=t.payment_method)for(var n=Object.values(JSON.parse(t.payment_method_details)),a=0,s=0;s<n.length;s++){var l=parseFloat(n[s]);r(a+=l)}}(),function(){var t=[],n=0;if(e.appointmentData.pending_payments&&null!=e.appointmentData.pending_payments)for(var a=0;a<e.appointmentData.pending_payments.length;a++)1==e.appointmentData.pending_payments[a].is_paid&&t.push(null!==e.appointmentData.pending_payments[a].paid_amount?e.appointmentData.pending_payments[a].paid_amount:0);t.forEach((function(e){n+=Number(e)})),u(n)}()}),[]),null!=o?o+p==e.appointmentData.total_amount?(0,l.jsxs)("div",{className:"text-white bg-lightgreen px-2 fw-normal rounded-2",style:{letterSpacing:"1px"},children:["Paid \u20b9",Number(o)+Number(p)]}):(0,l.jsxs)("div",{className:"text-burntumber bg-lightred px-2 fw-normal rounded-2",style:{letterSpacing:"1px"},children:["Pending \u20b9",(Number(e.appointmentData.total_amount)-(Number(o)+Number(p))).toFixed(1)," "]}):(0,l.jsx)("button",{className:"btn button-seashell p-0 m-0",type:"button",disabled:!0,children:(0,l.jsx)("span",{className:"spinner-grow spinner-grow-sm",role:"status","aria-hidden":"true"})})}},5270:function(e,t,n){n.d(t,{H:function(){return u}});var a=n(4165),s=n(3433),l=n(5861),i=n(9439),c=n(606),o=n(9867),r=n(811),d=n(7992),m=n.n(d),p=(n(9371),n(2834)),u=function(e){var t=(0,o.useContext)(r.Jx),n=localStorage.getItem("id"),d=(0,o.useState)(void 0==e.paymentsi?0:1),u=(0,i.Z)(d,2),h=u[0],x=u[1],f=(0,o.useState)([]),j=(0,i.Z)(f,2),N=j[0],y=j[1],g=(0,o.useState)([]),v=(0,i.Z)(g,2),b=v[0],_=v[1],w=(0,o.useState)([]),P=(0,i.Z)(w,2),Z=P[0],C=P[1],A=(0,o.useState)(!1),S=(0,i.Z)(A,2),k=S[0],D=S[1],J=(0,o.useState)(""),O=(0,i.Z)(J,2),R=O[0],z=O[1],F=(0,o.useState)(),T=(0,i.Z)(F,2),W=T[0],M=T[1],E=(0,o.useState)(!1),L=(0,i.Z)(E,2),H=L[0],I=L[1],q={paymentmethod:"",amount:0},B={paymentmethod:"",amount:0};function G(){return K.apply(this,arguments)}function K(){return(K=(0,l.Z)((0,a.Z)().mark((function n(){return(0,a.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:D(!0),c.Z.post("".concat(t,"/advance/balance"),{patient_id:e.patientid}).then((function(e){M(e.data.data),D(!1)}));case 2:case"end":return n.stop()}}),n)})))).apply(this,arguments)}function Q(){return Q=(0,l.Z)((0,a.Z)().mark((function s(){var i,o,r,d,p,u;return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:for(u=function(){return(u=(0,l.Z)((0,a.Z)().mark((function n(){return(0,a.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return D(!0),n.next=3,c.Z.post("".concat(t,"/save/advance"),d).then((function(t){console.log(t),e.Appointmentlist(),C([]),z(""),G(),m().Notify.success(t.data.message),D(!1)}));case 3:case"end":return n.stop()}}),n)})))).apply(this,arguments)},p=function(){return u.apply(this,arguments)},i=[],o=[],r=0;r<Z.length;r++)o.push(Z[r].paymentmethod),i.push(Z[r].amount);d={patient_id:e.patientid,admin_id:Number(n),description:R,payment_method:o,payment_method_main:o,payment_method_details:i},p();case 7:case"end":return s.stop()}}),s)}))),Q.apply(this,arguments)}function U(){return(U=(0,l.Z)((0,a.Z)().mark((function t(){var n,s,l;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(n=[],s=0;s<e.appointmentdata.length;s++)if(e.appointmentid==e.appointmentdata[s].id)for(l=0;l<e.appointmentdata[s].pending_payments.length;l++)n.push(e.appointmentdata[s].pending_payments[l]);y(n);case 3:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function V(){return V=(0,l.Z)((0,a.Z)().mark((function s(){var i,o,r,d,p,u,h,f,j;return(0,a.Z)().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:for(j=function(){return(j=(0,l.Z)((0,a.Z)().mark((function n(){return(0,a.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return I(!0),n.next=3,c.Z.post("".concat(t,"/appointment/save/pending/charges"),h).then((function(t){e.Appointmentlist(),m().Notify.success(t.data.message),e.setsingleload(0),x(1),I(!1)}));case 3:case"end":return n.stop()}}),n)})))).apply(this,arguments)},f=function(){return j.apply(this,arguments)},i=[],o=[],r="",d=0;d<e.appointmentdata.length;d++)for(p=0;p<e.appointmentdata[d].pending_payments.length;p++)e.appointmentid==e.appointmentdata[d].id&&0==e.appointmentdata[d].pending_payments[p].is_paid&&(r=e.appointmentdata[d].pending_payments[p].id);for(u=0;u<b.length;u++)console.log(b[u]),i.push(b[u].paymentmethod),o.push(Number(b[u].amount));h={payment_method:i,payment_method_main:i,payment_method_details:o,admin_id:Number(n),pending_id:r},f();case 9:case"end":return s.stop()}}),s)}))),V.apply(this,arguments)}(0,o.useEffect)((function(){G()}),[]),(0,o.useEffect)((function(){!function(){U.apply(this,arguments)}()}),[]);var X=function(e){if(e&&null!=e)return e=e.split("-").reverse().join("-")};return console.log(Z),(0,p.jsxs)("div",{className:" text-start p-0 m-0",children:[(0,p.jsxs)("h5",{className:"text-start fw-bold",children:[e.patientname," Payments Section"]}),(0,p.jsx)("button",{className:"btn-close position-absolute end-0 p-2 top-0",onClick:e.ClosePaymentsForm}),(0,p.jsx)("div",{className:"d-flex justify-content-start p-0 m-0 gx-2 mt-3",children:["Advance payments","Pending Payments"].map((function(e,t){return(0,p.jsx)("button",{className:"button button-".concat(t===h?"charcoal":"seashell"," rounded-1 me-1 border-charcoal rounded-0"),onClick:function(){x(t)},children:e})}))}),(0,p.jsxs)("div",{className:"container-fluid p-0 m-0  d-".concat(0===h?"block":"none"),children:[(0,p.jsxs)("h6",{className:"text-charcoal75 fw-bolder mt-2 mb-1",children:["Advance Payments from ",e.patientname]}),k||e.isLoading?(0,p.jsx)("div",{className:"col-6 py-2 pb-2 m-auto ",children:(0,p.jsx)("div",{class:"spinner-border spinner-border-sm",role:"status",children:(0,p.jsx)("span",{class:"visually-hidden",children:"Loading..."})})}):W&&0!==W.advnace_total?(0,p.jsxs)("table",{className:"bg-pearl table rounded-1",children:[(0,p.jsxs)("thead",{className:"",children:[(0,p.jsx)("th",{className:"ps-2",children:"Description"}),(0,p.jsx)("th",{className:"ps-2",children:"Amount"})]}),(0,p.jsx)("tbody",{className:"align-middle",children:(0,p.jsxs)("tr",{children:[(0,p.jsx)("td",{}),(0,p.jsx)("td",{children:W.advnace_total})]})})]}):(0,p.jsx)("div",{className:"bg-lightyellow fw-bolder rounded-1 p-2 m-1 mt-2 text-center",children:"No Advance Payments Found"}),(0,p.jsx)("hr",{}),(0,p.jsx)("h6",{className:"text-charcoal75 fw-bolder mb-2 mt-3",children:"Add Advance Payment"}),(0,p.jsxs)("div",{className:"row p-0 m-0 align-items-center",children:[(0,p.jsx)("div",{className:"col-3 ps-0",children:(0,p.jsx)("p",{className:"text-charcoal p-0 m-0 fw-bold",children:"Description"})}),(0,p.jsx)("div",{className:"col-9",children:(0,p.jsx)("input",{type:"text",className:"form-control p-0 m-0 p-1 bg-seashell mx-auto",value:R||"",onChange:function(e){return z(e.target.value)}})})]}),(0,p.jsxs)("div",{className:"row p-0 m-0 align-items-center",children:[(0,p.jsx)("div",{className:"col-auto p-0 m-0",children:(0,p.jsx)("p",{className:"text-charcoal fw-bold mt-3",children:"Add Payment Method"})}),(0,p.jsx)("div",{className:"col-auto p-0 m-0",children:(0,p.jsx)("button",{className:"btn py-0",onClick:function(){return C((function(e){return[].concat((0,s.Z)(e),[q])}))},children:(0,p.jsx)("img",{src:"/images/add.png",className:"img-fluid",style:{width:"2rem"}})})})]}),Z.map((function(e,t){return(0,p.jsxs)("div",{className:"row p-0 m-0 mt-2 justify-content-around",children:[(0,p.jsx)("div",{className:"col-5 p-0 m-0 ",children:(0,p.jsxs)("select",{className:"form-control bg-seashell py-1",value:e.paymentmethod,onChange:function(t){e.paymentmethod=t.target.value,C((function(e){return(0,s.Z)(e)}))},children:[(0,p.jsx)("option",{className:"text-charcoal75 fw-bolder",children:"Payment Method"}),(0,p.jsx)("option",{value:"Cash",children:"Cash"}),(0,p.jsx)("option",{value:"Card",children:"Card"}),(0,p.jsx)("option",{value:"Paytm",children:"Paytm"}),(0,p.jsx)("option",{value:"Phonepe",children:"Phone Pe"}),(0,p.jsx)("option",{value:"Wire-Transfer",children:"Wire Transfer"}),(0,p.jsx)("option",{value:"Razorpay",children:"Razorpay"}),(0,p.jsx)("option",{value:"Points",children:"Points"}),(0,p.jsx)("option",{value:"Adjust-Advance",children:"Adjust-Advance Cash"})]})}),(0,p.jsx)("div",{className:"col-4 p-0 m-0 ms-1",children:(0,p.jsx)("input",{className:"form-control bg-seashell py-1",value:e.amount,onChange:function(t){e.amount=t.target.value,C((function(e){return(0,s.Z)(e)}))}})}),(0,p.jsx)("div",{className:"col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 ",children:(0,p.jsx)("button",{className:"btn p-0 m-0",onClick:function(){!function(e){Z.splice(e,e)}(t),C((function(e){return(0,s.Z)(e)}))},children:(0,p.jsx)("img",{src:"/images/delete.png",className:"img-fluid",style:{width:"1.5rem"}})})})]})})),(0,p.jsx)("div",{className:"container text-center",children:(0,p.jsx)("button",{className:"button  button-charcoal rounded-1 mt-3 mb-2",disabled:!R,onClick:function(){return Q.apply(this,arguments)},children:"Save"})})]}),(0,p.jsx)("div",{className:"container-fluid p-0 m-0 d-".concat(1===h?"block":"none"," "),children:N&&null!=N&&0!=N.length?H?(0,p.jsx)("div",{className:"col-6 py-2 pb-2 m-auto ",children:(0,p.jsx)("div",{class:"spinner-border",role:"status",children:(0,p.jsx)("span",{class:"visually-hidden",children:"Loading..."})})}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("h6",{className:"fw-bolder text-charcoal75 mt-2",children:"Previous paid payments"}),(0,p.jsx)("div",{className:"p-0 m-0 scroll scroll-y rounded-1",children:(0,p.jsxs)("table",{className:" p-0 m-0 border-0 bg-pearl p-2 ",children:[(0,p.jsxs)("thead",{className:"p-0 m-0",children:[(0,p.jsxs)("tr",{children:[(0,p.jsx)("th",{className:"p-0 m-0 px-1",rowspan:"2",children:"Amount Paid"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1",rowspan:"2",children:"Pending Date"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1",rowspan:"2",children:"Paid Date"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 border-bottom",colspan:"7",scope:"colgroup",children:"Payment Method"})]}),(0,p.jsxs)("tr",{children:[(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Cash"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Card"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Paytm"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Phonepe"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Razorpay"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Wire-Transfer"}),(0,p.jsx)("th",{className:"p-0 m-0 px-1 bg-pearl",scope:"col",children:"Points"})]})]}),(0,p.jsx)("tbody",{children:N.map((function(e){return(0,p.jsxs)("tr",{className:"d-".concat(1==e.is_paid?"":"none"),children:[(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.paid_amount}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:X(e.pending_date)}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:X(e.paid_date)}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Cash:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Card:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Paytm:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Phonepe:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Razorpay:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details)["Wire-Transfer"]:"N/A"}),(0,p.jsx)("td",{className:"p-0 m-0 px-1",children:e.payment_method_details&&null!=e.payment_method_details?JSON.parse(e.payment_method_details).Points:"N/A"})]})}))})]})}),N.map((function(e){return(0,p.jsxs)("div",{className:"d-".concat(0==e.is_paid?"block":"none"," "),children:[(0,p.jsxs)("div",{className:"row p-0 m-0 align-items-center mt-2 justify-content-center",children:[(0,p.jsx)("div",{className:"col-auto",children:(0,p.jsxs)("span",{className:"text-burntumber fw-bolder",children:["Pending Amount: ",e.pending_amount]})}),(0,p.jsx)("div",{className:"col-auto",children:(0,p.jsx)("button",{className:"btn p-0",onClick:function(){return _((function(e){return[].concat((0,s.Z)(e),[B])}))},children:(0,p.jsx)("img",{src:"/images/add.png",className:"img-fluid",style:{width:"2rem"}})})})]}),b.map((function(e,t){return(0,p.jsxs)("div",{className:"",children:[(0,p.jsx)("label",{className:"text-charcoal fw-bold mt-3",children:"Select Payment Method to Pay Remaining pendings"}),(0,p.jsxs)("div",{className:"row p-0 m-0 justify-content-start",children:[(0,p.jsx)("div",{className:"col-5 col-lg-5 col-md-5 col-sm-5 p-0 m-0 ",children:(0,p.jsxs)("select",{className:"form-control bg-seashell py-1",value:e.paymentmethod,onChange:function(t){e.paymentmethod=t.target.value,_((function(e){return(0,s.Z)(e)}))},children:[(0,p.jsx)("option",{className:"text-charcoal75 fw-bolder",children:"Payment Method"}),(0,p.jsx)("option",{value:"Cash",children:"Cash"}),(0,p.jsx)("option",{value:"Card",children:"Card"}),(0,p.jsx)("option",{value:"Paytm",children:"Paytm"}),(0,p.jsx)("option",{value:"Phonepe",children:"Phone Pe"}),(0,p.jsx)("option",{value:"Wire-Transfer",children:"Wire Transfer"}),(0,p.jsx)("option",{value:"Razorpay",children:"Razorpay"}),(0,p.jsx)("option",{value:"Points",children:"Points"}),(0,p.jsx)("option",{value:"Adjust-Advance",children:"Adjust-Advance Cash"})]})}),(0,p.jsx)("div",{className:"col-5 col-lg-5 col-md-5 col-sm-1 p-0 m-0 ms-1",children:(0,p.jsx)("input",{className:"form-control bg-seashell py-1",value:e.amount,onChange:function(t){e.amount=t.target.value,_((function(e){return(0,s.Z)(e)}))}})}),(0,p.jsx)("div",{className:"col-1 col-lg-1 col-md-1 col-sm-1 m-0 p-0 ms-2 ",children:(0,p.jsx)("button",{className:"btn btn-sm p-0 m-0",onClick:function(){!function(e){b.splice(e,e)}(t),_((function(e){return(0,s.Z)(e)}))},children:(0,p.jsx)("img",{src:"/images/delete.png",className:"img-fluid",style:{width:"1.5rem"}})})})]})]})}))]})})),(0,p.jsx)("div",{className:"container text-center",children:(0,p.jsx)("button",{className:"button button-charcoal mt-lg-4 mt-md-3 mt-1 mb-2",onClick:function(){return V.apply(this,arguments)},children:"Save"})})]}):void 0!==e.paymentsi?(0,p.jsx)("div",{className:"rounded-1 bg-lightgreen text-white fw-bolder p-2 my-4",children:"Please see or update the bill first"}):(0,p.jsx)("div",{className:"rounded-1 bg-lightgreen text-white fw-bolder p-2 my-4",children:"No Pending Payments Found"})})]})}}}]);
//# sourceMappingURL=238.58a3b2b4.chunk.js.map
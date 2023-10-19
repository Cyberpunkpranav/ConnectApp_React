"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[609],{6309:function(t,e,n){n.d(e,{Ow:function(){return m},cV:function(){return d},dX:function(){return p}});var a=n(4165),i=n(5861),o=n(606),r=n(7992),c=n.n(r),s="https://aartas-qaapp-as.azurewebsites.net/aartas_uat/public/api/connect",u=localStorage.getItem("id"),l=localStorage.getItem("ClinicId"),d=function(){var t=(0,i.Z)((0,a.Z)().mark((function t(e){var n;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.Z.get("".concat(s,"/all/document?appointment_id=").concat(e)).then((function(t){n=t.data.data})).catch((function(t){c().Notify.failure(t.message)}));case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),c().Notify.failure(t.t0.message);case 8:return t.abrupt("return",n);case 9:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(e){return t.apply(this,arguments)}}(),p=function(){var t=(0,i.Z)((0,a.Z)().mark((function t(e,n,i){return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,c().Loading.circle("Upadating Appointment Status",{backgroundColor:"rgb(242, 242, 242,0.5)",svgColor:"#96351E",messageColor:"#96351E",messageFontSize:"1.5rem"}),t.next=4,o.Z.post("".concat(s,"/appointment/change/status"),{appointment_id:e,status:n,admin_id:i}).then((function(t){c().Loading.remove(),t})).catch((function(t){c().Loading.remove(),c().Notify.failure(t.message)}));case 4:t.next=10;break;case 6:t.prev=6,t.t0=t.catch(0),c().Loading.remove(),c().Notify.failure(t.t0.message);case 10:case"end":return t.stop()}}),t,null,[[0,6]])})));return function(e,n,a){return t.apply(this,arguments)}}(),m=function(){var t=(0,i.Z)((0,a.Z)().mark((function t(){var e;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.Z.get("".concat(s,"/DSR/appointments?admin_id=").concat(u,"&clinic_id=").concat(l)).then((function(t){e=t.data.data.all_appointments_status})).catch((function(t){c().Notify.failure(t.message)}));case 3:t.next=8;break;case 5:t.prev=5,t.t0=t.catch(0),c().Notify.failure(t.t0.message);case 8:return t.abrupt("return",e);case 9:case"end":return t.stop()}}),t,null,[[0,5]])})));return function(){return t.apply(this,arguments)}}()},9689:function(t,e,n){n.r(e);var a=n(4165),i=n(5861),o=n(3433),r=n(9439),c=n(9867),s=n(6626),u=n(7992),l=n.n(u),d=n(1230),p=(n(5144),n(9045),n(465)),m=n.n(p),h=n(606),f=n(6309),g=n(2834);e.default=function(t){var e=(0,c.useContext)(s.Jx),n=(0,c.useState)(""),u=(0,r.Z)(n,2),p=u[0],x=u[1],b=(0,c.useState)(),v=(0,r.Z)(b,2),w=(v[0],v[1],(0,c.useRef)(null)),y=((0,c.useRef)(null),(0,c.useState)("none")),j=(0,r.Z)(y,2),N=j[0],Z=j[1],k=(0,c.useState)("none"),C=(0,r.Z)(k,2),S=C[0],I=C[1],_=(0,c.useState)([]),z=(0,r.Z)(_,2),F=z[0],L=z[1],E=(0,c.useState)(0),R=(0,r.Z)(E,2),A=R[0],D=R[1],H=(0,c.useState)(),P=(0,r.Z)(H,2),U=P[0],W=P[1],B=(0,c.useState)("user"),O=(0,r.Z)(B,2),T=O[0],V=O[1],q=(0,c.useState)(!1),J=(0,r.Z)(q,2),M=J[0],X=J[1],G=window.innerWidth,K=window.innerHeight,Q={width:G,height:K,facingMode:T},Y=(0,c.useCallback)((function(){var t=w.current.getScreenshot();F.length>0?(L(t),l().Notify.info("Photo Captured"),$()):(L((function(e){return[].concat((0,o.Z)(e),[t])})),l().Notify.info("Photo Captured"),$())}),[w]),$=function(){"block"==N&&Z("none"),"none"==N&&Z("block")},tt=function(){"none"==S&&I(""),""==S&&I("none")},et=(0,c.useState)(null),nt=(0,r.Z)(et,2),at=nt[0],it=nt[1],ot=(0,c.useState)({unit:"%",x:25,y:25,width:100,height:100}),rt=(0,r.Z)(ot,2),ct=rt[0],st=rt[1],ut=(0,c.useState)(null),lt=(0,r.Z)(ut,2),dt=lt[0],pt=lt[1],mt=(0,c.useRef)(null);(0,c.useEffect)((function(){at&&function(t){var e=new Image;e.src=t,e.onload=function(){mt.current=e}}(at)}),[at]);var ht=function(t,e){var n=document.createElement("canvas"),a=t.naturalWidth/t.width,i=t.naturalHeight/t.height;return n.width=e.width,n.height=e.height,n.getContext("2d").drawImage(t,e.x*a,e.y*i,e.width*a,e.height*i,0,0,e.width,e.height),n.toDataURL("image/jpeg")},ft=function(){var t=(0,i.Z)((0,a.Z)().mark((function t(e){var n;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(mt.current&&e.width&&e.height)){t.next=8;break}return tt(),pt(),t.next=5,ht(mt.current,e);case 5:n=t.sent,W(n),x("block");case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),gt=localStorage.getItem("appointmentid");function xt(){window.close()}function bt(t){for(var e=t.split(","),n=e[0].match(/:(.*?);/)[1],a=atob(e[1]),i=new ArrayBuffer(a.length),o=new Uint8Array(i),r=0;r<a.length;r++)o[r]=a.charCodeAt(r);var c=new Blob([o],{type:n});return new File([c],"like.jpeg",{type:n})}var vt=function(){var t=(0,i.Z)((0,a.Z)().mark((function t(){var n,i;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=bt(U),(i=new FormData).append("image",n,"prescription.jpeg"),i.append("appointment_id",gt),X(!0),h.Z.post("".concat(e,"/save/document"),i,{headers:{"Content-Type":"multipart/form-data"}}).then((function(t){1==t.data.status&&(l().Notify.success("Prescription Uploaded Successfully"),setTimeout(xt,2e3),(0,f.cV)(gt),X(!1))})).catch((function(t){l().Notify.failure("Error uploading file:"),X(!1)}));case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsxs)("div",{className:"p-0 m-0 position-absolute top-0 start-0 ebd-0 mx-auto",style:{zIndex:"10"},children:[(0,g.jsx)("div",{className:"d-".concat(""==S?"none":"block"," col-12 p-0 m-0"),children:(0,g.jsx)(m(),{audio:!1,ref:w,screenshotFormat:"image/jpeg",mirrored:!1,videoConstraints:Q})}),(0,g.jsx)("div",{className:"col-12 bg-charcoal d-".concat("block"==p?"none":"block"),children:(0,g.jsxs)("div",{className:"row p-0 m-0 justify-content-between align-items-center position-relative",children:[(0,g.jsxs)("div",{className:"col-3",children:[(0,g.jsx)("button",{className:"border-0 justify-content-start cameraroll button button-pearl p-0 m-0 ",onClick:function(){$()},children:"none"==N?(0,g.jsx)("img",{src:"/images/gallery.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"2rem"}}):(0,g.jsx)("img",{src:"/images/bottom.png",className:"img-fluid bg-seashell px-2 py-1 rounded-top mb-1"})}),(0,g.jsx)("div",{className:"container position-absolute cameraroll scroll bg-charcoal25 ms-2 d-".concat(N),style:{flexDirection:"horizontal",minHeight:"fit-content",zIndex:"10",top:"-10rem"},children:F?F.map((function(t,e){return(0,g.jsx)("img",{src:t,className:"img-fluid",onClick:function(){tt(),D(e),it(F[A])},style:{width:"5rem"}})})):""})]}),(0,g.jsx)("div",{className:"col-6 align-items-center d-flex justify-content-center",children:(0,g.jsx)("img",{className:"img-fluid bg-lightyellow rounded-2",onClick:function(){Y()},style:{width:"4rem"},src:"/images/camera_click.png"})}),(0,g.jsx)("div",{className:"col-3 d-flex justify-content-center",children:(0,g.jsx)("button",{className:"button button-pearl border-0 cameraroll p-0 m-0",onClick:function(){V("user"==T?"environment":"user")},children:(0,g.jsx)("img",{src:"/images/flip.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"1.8rem"}})})})]})}),w.current?(0,g.jsxs)("div",{className:"d-".concat(S," position-absolute p-0 m-0 top-0 bg-pearl shadow-sm"),style:{zIndex:"15",height:K,width:G},children:[(0,g.jsx)("button",{className:"position-absolute end-0 bg-seashell50 p-2 mt-3 btn-close",style:{zIndex:"18"},onClick:function(){tt()}}),(0,g.jsx)("div",{className:"p-0 m-0 position-absolute start-0 end-0 mx-auto",children:(0,g.jsx)(d.cO,{crop:ct,onChange:function(t){return st(t)},onComplete:function(t){return pt(t)},children:(0,g.jsx)("img",{src:at,className:"img-fluid",style:{width:"".concat(w.current.video.videoWidth,"px"),height:"".concat(w.current.video.videoHeight,"px")}})})})]}):(0,g.jsx)(g.Fragment,{})]}),dt&&(0,g.jsx)("div",{className:"position-absolute top-0 mt-4 ms-2",style:{zIndex:"15"},children:(0,g.jsx)("button",{className:"button button-charcoal text-light border border-light",onClick:function(){return ft(dt)},children:"Save"})}),U?(0,g.jsxs)("div",{className:"position-absolute top-0 start-0 mx-auto end-0 bg-charcoal d-".concat(p),style:{height:K,width:G,zIndex:"20"},children:[(0,g.jsx)("button",{className:"btn-close position-absolute bg-seashell50 mt-3 me-3 p-2 top-0 end-0",onClick:function(){x("none")}}),(0,g.jsx)("div",{className:"position-relative d-flex mt-5 justify-content-center",children:(0,g.jsx)("img",{src:U,className:"img-fluid",style:{width:ct.width,height:ct.height}})}),M?(0,g.jsx)("div",{className:"col-6 py-2 pb-2 m-auto text-center",children:(0,g.jsx)("div",{class:"spinner-border",role:"status",children:(0,g.jsx)("span",{class:"visually-hidden",children:"Loading..."})})}):(0,g.jsx)("button",{className:" mx-auto d-flex justify-content-center button button-pearl",onClick:function(t){vt(t)},children:"Save Prescription"})]}):(0,g.jsx)(g.Fragment,{})]})}},9045:function(){}}]);
//# sourceMappingURL=609.ae7eeafb.chunk.js.map
"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[609],{9689:function(e,t,n){n.r(t);var o=n(4165),i=n(5861),s=n(3433),a=n(9439),c=n(9867),r=n(6626),l=n(7992),u=n.n(l),d=n(1230),m=(n(5144),n(9045),n(465)),h=n.n(m),p=n(606),f=n(2834);t.default=function(e){var t=(0,c.useContext)(r.Jx),n=(0,c.useState)(""),l=(0,a.Z)(n,2),m=l[0],g=l[1],x=(0,c.useState)(),b=(0,a.Z)(x,2),j=(b[0],b[1],(0,c.useRef)(null)),v=((0,c.useRef)(null),(0,c.useState)("none")),w=(0,a.Z)(v,2),y=w[0],N=w[1],k=(0,c.useState)("none"),C=(0,a.Z)(k,2),Z=C[0],S=C[1],I=(0,c.useState)([]),z=(0,a.Z)(I,2),F=z[0],H=z[1],P=(0,c.useState)(0),R=(0,a.Z)(P,2),_=R[0],A=R[1],D=(0,c.useState)(),E=(0,a.Z)(D,2),U=E[0],W=E[1],B=(0,c.useState)("environment"),T=(0,a.Z)(B,2),J=T[0],L=T[1],M=window.innerWidth,O=window.innerHeight,q={width:M,height:O,facingMode:J},G=(0,c.useCallback)((function(){var e=j.current.getScreenshot();F.length>0?(H(e),u().Notify.info("Photo Captured"),K()):(H((function(t){return[].concat((0,s.Z)(t),[e])})),u().Notify.info("Photo Captured"),K())}),[j]),K=function(){"block"==y&&N("none"),"none"==y&&N("block")},Q=function(){"none"==Z&&S(""),""==Z&&S("none")},V=(0,c.useState)(null),X=(0,a.Z)(V,2),Y=X[0],$=X[1],ee=(0,c.useState)({unit:"%",x:25,y:25,width:100,height:100}),te=(0,a.Z)(ee,2),ne=te[0],oe=te[1],ie=(0,c.useState)(null),se=(0,a.Z)(ie,2),ae=se[0],ce=se[1],re=(0,c.useRef)(null);(0,c.useEffect)((function(){Y&&function(e){var t=new Image;t.src=e,t.onload=function(){re.current=t}}(Y)}),[Y]);var le=function(e,t){var n=document.createElement("canvas"),o=e.naturalWidth/e.width,i=e.naturalHeight/e.height;return n.width=t.width,n.height=t.height,n.getContext("2d").drawImage(e,t.x*o,t.y*i,t.width*o,t.height*i,0,0,t.width,t.height),n.toDataURL("image/jpeg")},ue=function(){var e=(0,i.Z)((0,o.Z)().mark((function e(t){var n;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(re.current&&t.width&&t.height)){e.next=8;break}return Q(),ce(),e.next=5,le(re.current,t);case 5:n=e.sent,W(n),g("block");case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),de=localStorage.getItem("appointmentid");function me(){window.close()}function he(e){for(var t=e.split(","),n=t[0].match(/:(.*?);/)[1],o=atob(t[1]),i=new ArrayBuffer(o.length),s=new Uint8Array(i),a=0;a<o.length;a++)s[a]=o.charCodeAt(a);var c=new Blob([s],{type:n});return new File([c],"like.jpeg",{type:n})}var pe=function(){var e=(0,i.Z)((0,o.Z)().mark((function e(){var n,i;return(0,o.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=he(U),(i=new FormData).append("image",n,"prescription.jpeg"),i.append("appointment_id",de),p.Z.post("".concat(t,"/save/document"),i,{headers:{"Content-Type":"multipart/form-data"}}).then((function(e){console.log("File uploaded successfully:",e.data),1==e.data.status&&(u().Notify.success("Prescription Uploaded Successfully"),setTimeout(me,2e3))})).catch((function(e){console.error("Error uploading file:",e)}));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return console.log(Z),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)("div",{className:"p-0 m-0 position-absolute top-0 start-0 ebd-0 mx-auto",style:{zIndex:"10"},children:[(0,f.jsx)("div",{className:"d-".concat(""==Z?"none":"block"," col-12 p-0 m-0"),children:(0,f.jsx)(h(),{audio:!1,ref:j,screenshotFormat:"image/jpeg",mirrored:!1,videoConstraints:q})}),(0,f.jsx)("div",{className:"col-12 bg-charcoal d-".concat("block"==m?"none":"block"),children:(0,f.jsxs)("div",{className:"row p-0 m-0 justify-content-between align-items-center position-relative",children:[(0,f.jsxs)("div",{className:"col-3",children:[(0,f.jsx)("button",{className:"border-0 justify-content-start cameraroll button button-pearl p-0 m-0 ",onClick:function(){K()},children:"none"==y?(0,f.jsx)("img",{src:"/images/gallery.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"2rem"}}):(0,f.jsx)("img",{src:"/images/bottom.png",className:"img-fluid bg-seashell px-2 py-1 rounded-top mb-1"})}),(0,f.jsx)("div",{className:"container position-absolute cameraroll scroll bg-charcoal25 ms-2 d-".concat(y),style:{flexDirection:"horizontal",minHeight:"fit-content",zIndex:"10",top:"-10rem"},children:F?F.map((function(e,t){return(0,f.jsx)("img",{src:e,className:"img-fluid",onClick:function(){Q(),A(t),$(F[_])},style:{width:"5rem"}})})):""})]}),(0,f.jsx)("div",{className:"col-6 align-items-center d-flex justify-content-center",children:(0,f.jsx)("img",{className:"img-fluid bg-lightyellow rounded-2",onClick:function(){G()},style:{width:"4rem"},src:"/images/camera_click.png"})}),(0,f.jsx)("div",{className:"col-3 d-flex justify-content-center",children:(0,f.jsx)("button",{className:"button button-pearl border-0 cameraroll p-0 m-0",onClick:function(){L("user"==J?"environment":"user")},children:(0,f.jsx)("img",{src:"/images/flip.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"1.8rem"}})})})]})}),j.current?(0,f.jsxs)("div",{className:"d-".concat(Z," position-absolute p-0 m-0 top-0 bg-pearl shadow-sm"),style:{zIndex:"15",height:O,width:M},children:[(0,f.jsx)("button",{className:"position-absolute end-0 bg-seashell50 p-2 mt-3 btn-close",style:{zIndex:"18"},onClick:function(){Q()}}),(0,f.jsx)("div",{className:"p-0 m-0 position-absolute start-0 end-0 mx-auto",children:(0,f.jsx)(d.cO,{crop:ne,onChange:function(e){return oe(e)},onComplete:function(e){return ce(e)},children:(0,f.jsx)("img",{src:Y,className:"img-fluid",style:{width:"".concat(j.current.video.videoWidth,"px"),height:"".concat(j.current.video.videoHeight,"px")}})})})]}):(0,f.jsx)(f.Fragment,{})]}),ae&&(0,f.jsx)("div",{className:"position-absolute top-0 mt-4 ms-2",style:{zIndex:"15"},children:(0,f.jsx)("button",{className:"button button-charcoal text-light border border-light",onClick:function(){return ue(ae)},children:"Save"})}),U?(0,f.jsxs)("div",{className:"position-absolute top-0 start-0 mx-auto end-0 bg-charcoal d-".concat(m),style:{height:O,width:M,zIndex:"20"},children:[(0,f.jsx)("button",{className:"btn-close position-absolute bg-seashell50 mt-3 me-3 p-2 top-0 end-0",onClick:function(){g("none")}}),(0,f.jsx)("div",{className:"position-relative d-flex mt-5 justify-content-center",children:(0,f.jsx)("img",{src:U,className:"img-fluid",style:{width:ne.width,height:ne.height}})}),(0,f.jsx)("button",{className:" mx-auto d-flex justify-content-center button button-pearl",onClick:function(e){pe(e)},children:"Save Prescription"})]}):(0,f.jsx)(f.Fragment,{})]})}},9045:function(){}}]);
//# sourceMappingURL=609.e59eadcd.chunk.js.map
"use strict";(self.webpackChunkconnect_app=self.webpackChunkconnect_app||[]).push([[609],{9689:function(e,t,n){n.r(t);var i=n(4165),s=n(5861),o=n(3433),c=n(9439),a=n(9867),r=n(7992),l=n.n(r),u=n(1230),d=(n(5144),n(9045),n(465)),h=n.n(d),m=n(2834);t.default=function(e){var t=(0,a.useState)(""),n=(0,c.Z)(t,2),r=n[0],d=n[1],g=(0,a.useRef)(null),p=((0,a.useRef)(null),(0,a.useState)("none")),f=(0,c.Z)(p,2),x=f[0],b=f[1],j=(0,a.useState)("none"),w=(0,c.Z)(j,2),v=w[0],y=w[1],N=(0,a.useState)([]),k=(0,c.Z)(N,2),C=k[0],Z=k[1],S=(0,a.useState)(0),I=(0,c.Z)(S,2),z=I[0],R=I[1],F=(0,a.useState)(),L=(0,c.Z)(F,2),U=L[0],H=L[1],O=(0,a.useState)("environment"),P=(0,c.Z)(O,2),W=P[0],_=P[1],E=window.innerWidth,B=window.innerHeight,D={width:E,height:B,facingMode:W},M=(0,a.useCallback)((function(){var e=g.current.getScreenshot();C.length>0?(Z(e),l().Notify.info("Photo Captured"),q()):(Z((function(t){return[].concat((0,o.Z)(t),[e])})),l().Notify.info("Photo Captured"),q())}),[g]),q=function(){"block"==x&&b("none"),"none"==x&&b("block")},A=function(){"none"==v&&y(""),""==v&&y("none")},G=(0,a.useState)(null),J=(0,c.Z)(G,2),K=J[0],Q=J[1],T=(0,a.useState)({unit:"%",x:25,y:25,width:100,height:100}),V=(0,c.Z)(T,2),X=V[0],Y=V[1],$=(0,a.useState)(null),ee=(0,c.Z)($,2),te=ee[0],ne=ee[1],ie=(0,a.useRef)(null);(0,a.useEffect)((function(){K&&function(e){var t=new Image;t.src=e,t.onload=function(){ie.current=t}}(K)}),[K]);var se=function(e,t,n){var i=document.createElement("canvas"),s=e.naturalWidth/e.width,o=e.naturalHeight/e.height;return i.width=t.width,i.height=t.height,i.getContext("2d").drawImage(e,t.x*s,t.y*o,t.width*s,t.height*o,0,0,t.width,t.height),new Promise((function(e,t){i.toBlob((function(t){if(t){t.name=n,window.URL.revokeObjectURL(K);var i=window.URL.createObjectURL(t);e(i)}else console.error("Canvas is empty")}),"image/jpeg")}))},oe=function(){var e=(0,s.Z)((0,i.Z)().mark((function e(t){var n;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(ie.current&&t.width&&t.height)){e.next=8;break}return A(),ne(),e.next=5,se(ie.current,t,"prescription.jpeg");case 5:n=e.sent,H(n),d("block");case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)("div",{className:" p-0 position-absolute top-0 start-0",style:{zIndex:"10"},children:[(0,m.jsx)("div",{className:"col-12",children:(0,m.jsx)(h(),{audio:!1,ref:g,screenshotFormat:"image/jpeg",mirrored:!1,videoConstraints:D})}),(0,m.jsx)("div",{className:"col-12 bg-charcoal",children:(0,m.jsxs)("div",{className:"row p-0 m-0 justify-content-between align-items-center position-relative",children:[(0,m.jsxs)("div",{className:"col-3",children:[(0,m.jsx)("button",{className:"border-0 justify-content-start cameraroll button button-pearl p-0 m-0 ",onClick:function(){q()},children:"none"==x?(0,m.jsx)("img",{src:"/images/gallery.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"2rem"}}):(0,m.jsx)("img",{src:"/images/bottom.png",className:"img-fluid bg-seashell px-2 py-1 rounded-top mb-1"})}),(0,m.jsx)("div",{className:"container position-absolute cameraroll scroll bg-charcoal25 ms-2 d-".concat(x),style:{flexDirection:"horizontal",minHeight:"fit-content",zIndex:"10",top:"-5rem"},children:C?C.map((function(e,t){return(0,m.jsx)("img",{src:e,className:"img-fluid",onClick:function(){A(),R(t),Q(C[z])},style:{width:"5rem"}})})):""})]}),(0,m.jsx)("div",{className:"col-6 align-items-center d-flex justify-content-center",children:(0,m.jsx)("img",{className:"img-fluid bg-lightyellow rounded-2",onClick:function(){M()},style:{width:"4rem"},src:"/images/camera_click.png"})}),(0,m.jsx)("div",{className:"col-3 d-flex justify-content-center",children:(0,m.jsx)("button",{className:"button button-pearl border-0 cameraroll p-0 m-0",onClick:function(){_("user"==W?"environment":"user")},children:(0,m.jsx)("img",{src:"/images/flip.png",className:"img-fluid bg-charcoal75 px-2 py-1 rounded-top mb-1",style:{width:"1.8rem"}})})})]})}),g.current?(0,m.jsxs)("div",{className:"d-".concat(v," container position-absolute top-0 bg-pearl shadow-sm"),style:{zIndex:"15",height:B,width:E},children:[(0,m.jsx)("button",{className:"position-absolute end-0 bg-seashell50 p-2 btn-close",style:{zIndex:"18"},onClick:function(){A()}}),(0,m.jsx)("div",{className:"mt-0 position-absolute start-0 end-0 mx-auto",children:(0,m.jsx)(u.cO,{crop:X,onChange:function(e){return Y(e)},onComplete:function(e){return ne(e)},children:(0,m.jsx)("img",{src:K,className:"img-fluid",style:{width:"".concat(g.current.video.videoWidth,"px")}})})})]}):(0,m.jsx)(m.Fragment,{})]}),te&&(0,m.jsx)("div",{className:"position-absolute top-0 mt-4 ms-2",style:{zIndex:"15"},children:(0,m.jsx)("button",{className:"button button-charcoal text-light border border-light",onClick:function(){return oe(te)},children:"Save"})}),U?(0,m.jsx)("div",{className:"position-absolute top-0 start-0 mx-auto end-0 bg-lightyellow d-".concat(r),style:{height:B,width:E,zIndex:"20"},children:(0,m.jsxs)("div",{className:"position-relative justify-content-center",children:[(0,m.jsx)("button",{className:"btn-close position-absolute top-0 end-0",onClick:function(){d("none")}}),(0,m.jsx)("img",{src:U,className:"img-fluid",style:{width:X.width,height:X.height}})]})}):(0,m.jsx)(m.Fragment,{})]})}},9045:function(){}}]);
//# sourceMappingURL=609.b90e79cd.chunk.js.map
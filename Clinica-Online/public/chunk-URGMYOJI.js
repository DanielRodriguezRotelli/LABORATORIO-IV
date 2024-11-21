import{c as K,d as v,f as h,g as W,h as y}from"./chunk-XAZLOLJU.js";import{B as M,C as P,Da as V,E as k,Ea as H,Fa as q,H as R,O as E,Ra as U,S as F,V as p,Va as B,W as l,Wa as G,ab as Q,b as I,c as _,da as c,fa as a,fb as X,ga as d,gb as Z,ia as A,ib as Y,nb as J,o as O,pa as u,q as N,qa as b,ra as g,u as D,v as z,w as j,xa as f,ya as T,za as L}from"./chunk-XL3YBMFF.js";import{a as w,b as S}from"./chunk-SIAVTO45.js";var ee=["overlay"],te=["*"];function ne(t,s){t&1&&g(0,"div")}function ie(t,s){if(t&1&&(u(0,"div"),c(1,ne,1,0,"div",6),b()),t&2){let e=f(2);A(e.spinner.class),d("color",e.spinner.color),p(),a("ngForOf",e.spinner.divArray)}}function se(t,s){if(t&1&&(g(0,"div",7),B(1,"safeHtml")),t&2){let e=f(2);a("innerHTML",G(1,1,e.template),F)}}function re(t,s){if(t&1&&(u(0,"div",2,0),c(2,ie,2,5,"div",3)(3,se,2,3,"div",4),u(4,"div",5),L(5),b()()),t&2){let e=f();d("background-color",e.spinner.bdColor)("z-index",e.spinner.zIndex)("position",e.spinner.fullScreen?"fixed":"absolute"),a("@.disabled",e.disableAnimation)("@fadeIn","in"),p(2),a("ngIf",!e.template),p(),a("ngIf",e.template),p(),d("z-index",e.spinner.zIndex)}}var ae={"ball-8bits":16,"ball-atom":4,"ball-beat":3,"ball-circus":5,"ball-climbing-dot":4,"ball-clip-rotate":1,"ball-clip-rotate-multiple":2,"ball-clip-rotate-pulse":2,"ball-elastic-dots":5,"ball-fall":3,"ball-fussion":4,"ball-grid-beat":9,"ball-grid-pulse":9,"ball-newton-cradle":4,"ball-pulse":3,"ball-pulse-rise":5,"ball-pulse-sync":3,"ball-rotate":1,"ball-running-dots":5,"ball-scale":1,"ball-scale-multiple":3,"ball-scale-pulse":2,"ball-scale-ripple":1,"ball-scale-ripple-multiple":3,"ball-spin":8,"ball-spin-clockwise":8,"ball-spin-clockwise-fade":8,"ball-spin-clockwise-fade-rotating":8,"ball-spin-fade":8,"ball-spin-fade-rotating":8,"ball-spin-rotate":2,"ball-square-clockwise-spin":8,"ball-square-spin":8,"ball-triangle-path":3,"ball-zig-zag":2,"ball-zig-zag-deflect":2,cog:1,"cube-transition":2,fire:3,"line-scale":5,"line-scale-party":5,"line-scale-pulse-out":5,"line-scale-pulse-out-rapid":5,"line-spin-clockwise-fade":8,"line-spin-clockwise-fade-rotating":8,"line-spin-fade":8,"line-spin-fade-rotating":8,pacman:6,"square-jelly-box":2,"square-loader":1,"square-spin":1,timer:1,"triangle-skew-spin":1},C={BD_COLOR:"rgba(51,51,51,0.8)",SPINNER_COLOR:"#fff",Z_INDEX:99999},x="primary",o=class t{constructor(s){Object.assign(this,s)}static create(s){return!s?.template&&!s?.type&&console.warn(`[ngx-spinner]: Property "type" is missed. Please, provide animation type to <ngx-spinner> component
        and ensure css is added to angular.json file`),new t(s)}},oe=(()=>{class t{constructor(){this.spinnerObservable=new _(null)}getSpinner(e){return this.spinnerObservable.asObservable().pipe(O(n=>n&&n.name===e))}show(e=x,n){return new Promise((i,r)=>{setTimeout(()=>{n&&Object.keys(n).length?(n.name=e,this.spinnerObservable.next(new o(S(w({},n),{show:!0}))),i(!0)):(this.spinnerObservable.next(new o({name:e,show:!0})),i(!0))},10)})}hide(e=x,n=10){return new Promise((i,r)=>{setTimeout(()=>{this.spinnerObservable.next(new o({name:e,show:!1})),i(!0)},n)})}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275prov=D({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})(),$=new j("NGX_SPINNER_CONFIG"),le=(()=>{class t{constructor(e){this._sanitizer=e}transform(e){if(e)return this._sanitizer.bypassSecurityTrustHtml(e)}static{this.\u0275fac=function(n){return new(n||t)(l(J,16))}}static{this.\u0275pipe=k({name:"safeHtml",type:t,pure:!0,standalone:!0})}}return t})(),Oe=(()=>{class t{constructor(e,n,i,r){this.spinnerService=e,this.changeDetector=n,this.elementRef=i,this.globalConfig=r,this.disableAnimation=!1,this.spinner=new o,this.ngUnsubscribe=new I,this.setDefaultOptions=()=>{let{type:m}=this.globalConfig??{};this.spinner=o.create({name:this.name,bdColor:this.bdColor,size:this.size,color:this.color,type:this.type??m,fullScreen:this.fullScreen,divArray:this.divArray,divCount:this.divCount,show:this.show,zIndex:this.zIndex,template:this.template,showSpinner:this.showSpinner})},this.bdColor=C.BD_COLOR,this.zIndex=C.Z_INDEX,this.color=C.SPINNER_COLOR,this.size="large",this.fullScreen=!0,this.name=x,this.template=null,this.showSpinner=!1,this.divArray=[],this.divCount=0,this.show=!1}initObservable(){this.spinnerService.getSpinner(this.name).pipe(N(this.ngUnsubscribe)).subscribe(e=>{this.setDefaultOptions(),Object.assign(this.spinner,e),e.show&&this.onInputChange(),this.changeDetector.detectChanges()})}ngOnInit(){this.setDefaultOptions(),this.initObservable()}isSpinnerZone(e){return e===this.elementRef.nativeElement.parentElement?!0:e.parentNode&&this.isSpinnerZone(e.parentNode)}ngOnChanges(e){for(let n in e)if(n){let i=e[n];if(i.isFirstChange())return;typeof i.currentValue<"u"&&i.currentValue!==i.previousValue&&i.currentValue!==""&&(this.spinner[n]=i.currentValue,n==="showSpinner"&&(i.currentValue?this.spinnerService.show(this.spinner.name,this.spinner):this.spinnerService.hide(this.spinner.name)),n==="name"&&this.initObservable())}}getClass(e,n){this.spinner.divCount=ae[e],this.spinner.divArray=Array(this.spinner.divCount).fill(0).map((r,m)=>m);let i="";switch(n.toLowerCase()){case"small":i="la-sm";break;case"medium":i="la-2x";break;case"large":i="la-3x";break;default:break}return"la-"+e+" "+i}onInputChange(){this.spinner.class=this.getClass(this.spinner.type,this.spinner.size)}ngOnDestroy(){this.ngUnsubscribe.next(),this.ngUnsubscribe.complete()}static{this.\u0275fac=function(n){return new(n||t)(l(oe),l(Q),l(E),l($,8))}}static{this.\u0275cmp=M({type:t,selectors:[["ngx-spinner"]],viewQuery:function(n,i){if(n&1&&V(ee,5),n&2){let r;H(r=q())&&(i.spinnerDOM=r.first)}},inputs:{bdColor:"bdColor",size:"size",color:"color",type:"type",fullScreen:"fullScreen",name:"name",zIndex:"zIndex",template:"template",showSpinner:"showSpinner",disableAnimation:"disableAnimation"},standalone:!0,features:[R,U],ngContentSelectors:te,decls:1,vars:1,consts:[["overlay",""],["class","ngx-spinner-overlay",3,"background-color","z-index","position",4,"ngIf"],[1,"ngx-spinner-overlay"],[3,"class","color",4,"ngIf"],[3,"innerHTML",4,"ngIf"],[1,"loading-text"],[4,"ngFor","ngForOf"],[3,"innerHTML"]],template:function(n,i){n&1&&(T(),c(0,re,6,12,"div",1)),n&2&&a("ngIf",i.spinner.show)},dependencies:[le,Z,X],styles:[".ngx-spinner-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%}.ngx-spinner-overlay[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:not(.loading-text){top:50%;left:50%;margin:0;position:absolute;transform:translate(-50%,-50%)}.loading-text[_ngcontent-%COMP%]{position:absolute;top:60%;left:50%;transform:translate(-50%,-60%)}"],data:{animation:[K("fadeIn",[W("in",h({opacity:1})),y(":enter",[h({opacity:0}),v(300)]),y(":leave",v(200,h({opacity:0})))])]},changeDetection:0})}}return t})(),Ne=(()=>{class t{static forRoot(e){return{ngModule:t,providers:[{provide:$,useValue:e}]}}static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=P({type:t})}static{this.\u0275inj=z({imports:[Y]})}}return t})();export{oe as a,Oe as b,Ne as c};

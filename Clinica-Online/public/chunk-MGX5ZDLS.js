import{B as j,C as p,O as R,P as g,Q as C,W as u,aa as m,b as l,c as E,ea as M,jb as A,k as w,o as x,u as v,v as f,w as a,x as r}from"./chunk-XL3YBMFF.js";var D=new a("recaptcha-language"),O=new a("recaptcha-base-url"),B=new a("recaptcha-nonce-tag"),k=new a("recaptcha-settings"),I=new a("recaptcha-v3-site-key"),T=new a("recaptcha-loader-options");function L(t,h,i,{url:e,lang:n,nonce:s}={}){window.ng2recaptchaloaded=()=>{i(grecaptcha)};let o=document.createElement("script");o.innerHTML="";let{url:c,nonce:d}=h(new URL(e||"https://www.google.com/recaptcha/api.js"));c.searchParams.set("render",t==="explicit"?t:t.key),c.searchParams.set("onload","ng2recaptchaloaded"),c.searchParams.set("trustedtypes","true"),n&&c.searchParams.set("hl",n),o.src=c.href;let y=d||s;y&&o.setAttribute("nonce",y),o.async=!0,o.defer=!0,document.head.appendChild(o)}function N({v3SiteKey:t,onBeforeLoad:h,onLoaded:i}){let e=t?{key:t}:"explicit";S.loadScript(e,h,i)}var S={loadScript:L,newLoadScript:N};function z(t){return t.asObservable().pipe(x(h=>h!==null))}var b=(()=>{class t{static{this.ready=null}constructor(i,e,n,s,o,c){this.platformId=i,this.language=e,this.baseUrl=n,this.nonce=s,this.v3SiteKey=o,this.options=c;let d=this.init();this.ready=d?z(d):w()}init(){if(t.ready)return t.ready;if(!A(this.platformId))return;let i=new E(null);return t.ready=i,S.newLoadScript({v3SiteKey:this.v3SiteKey,onBeforeLoad:e=>{if(this.options?.onBeforeLoad)return this.options.onBeforeLoad(e);let n=new URL(this.baseUrl??e);return this.language&&n.searchParams.set("hl",this.language),{url:n,nonce:this.nonce}},onLoaded:e=>{let n=e;this.options?.onLoaded&&(n=this.options.onLoaded(e)),i.next(n)}}),i}static{this.\u0275fac=function(e){return new(e||t)(r(C),r(D,8),r(O,8),r(B,8),r(I,8),r(T,8))}}static{this.\u0275prov=v({token:t,factory:t.\u0275fac})}}return t})(),P=0,oe=(()=>{class t{constructor(i,e,n,s){this.elementRef=i,this.loader=e,this.zone=n,this.id=`ngrecaptcha-${P++}`,this.errorMode="default",this.resolved=new g,this.error=new g,this.errored=new g,s&&(this.siteKey=s.siteKey,this.theme=s.theme,this.type=s.type,this.size=s.size,this.badge=s.badge)}ngAfterViewInit(){this.subscription=this.loader.ready.subscribe(i=>{i!=null&&i.render instanceof Function&&(this.grecaptcha=i,this.renderRecaptcha())})}ngOnDestroy(){this.grecaptchaReset(),this.subscription&&this.subscription.unsubscribe()}execute(){this.size==="invisible"&&(this.widget!=null?this.grecaptcha.execute(this.widget):this.executeRequested=!0)}reset(){this.widget!=null&&(this.grecaptcha.getResponse(this.widget)&&this.resolved.emit(null),this.grecaptchaReset())}get __unsafe_widgetValue(){return this.widget!=null?this.grecaptcha.getResponse(this.widget):null}expired(){this.resolved.emit(null)}onError(i){this.error.emit(i),this.errored.emit(i)}captchaResponseCallback(i){this.resolved.emit(i)}grecaptchaReset(){this.widget!=null&&this.zone.runOutsideAngular(()=>this.grecaptcha.reset(this.widget))}renderRecaptcha(){let i={badge:this.badge,callback:e=>{this.zone.run(()=>this.captchaResponseCallback(e))},"expired-callback":()=>{this.zone.run(()=>this.expired())},sitekey:this.siteKey,size:this.size,tabindex:this.tabIndex,theme:this.theme,type:this.type};this.errorMode==="handled"&&(i["error-callback"]=(...e)=>{this.zone.run(()=>this.onError(e))}),this.widget=this.grecaptcha.render(this.elementRef.nativeElement,i),this.executeRequested===!0&&(this.executeRequested=!1,this.execute())}static{this.\u0275fac=function(e){return new(e||t)(u(R),u(b),u(m),u(k,8))}}static{this.\u0275cmp=j({type:t,selectors:[["re-captcha"]],hostVars:1,hostBindings:function(e,n){e&2&&M("id",n.id)},inputs:{id:"id",siteKey:"siteKey",theme:"theme",type:"type",size:"size",tabIndex:"tabIndex",badge:"badge",errorMode:"errorMode"},outputs:{resolved:"resolved",error:"error",errored:"errored"},exportAs:["reCaptcha"],decls:0,vars:0,template:function(e,n){},encapsulation:2})}}return t})(),F=(()=>{class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275mod=p({type:t})}static{this.\u0275inj=f({})}}return t})(),ce=(()=>{class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275mod=p({type:t})}static{this.\u0275inj=f({providers:[b],imports:[F]})}}return t})(),H=(()=>{class t{constructor(i,e,n){this.recaptchaLoader=e,this.zone=i,this.siteKey=n,this.init()}get onExecute(){return this.onExecuteSubject||(this.onExecuteSubject=new l,this.onExecuteObservable=this.onExecuteSubject.asObservable()),this.onExecuteObservable}get onExecuteError(){return this.onExecuteErrorSubject||(this.onExecuteErrorSubject=new l,this.onExecuteErrorObservable=this.onExecuteErrorSubject.asObservable()),this.onExecuteErrorObservable}execute(i){let e=new l;return this.grecaptcha?this.executeActionWithSubject(i,e):(this.actionBacklog||(this.actionBacklog=[]),this.actionBacklog.push([i,e])),e.asObservable()}executeActionWithSubject(i,e){let n=s=>{this.zone.run(()=>{e.error(s),this.onExecuteErrorSubject&&this.onExecuteErrorSubject.next({action:i,error:s})})};this.zone.runOutsideAngular(()=>{try{this.grecaptcha.execute(this.siteKey,{action:i}).then(s=>{this.zone.run(()=>{e.next(s),e.complete(),this.onExecuteSubject&&this.onExecuteSubject.next({action:i,token:s})})},n)}catch(s){n(s)}})}init(){this.recaptchaLoader.ready.subscribe(i=>{this.grecaptcha=i,this.actionBacklog&&this.actionBacklog.length>0&&(this.actionBacklog.forEach(([e,n])=>this.executeActionWithSubject(e,n)),this.actionBacklog=void 0)})}static{this.\u0275fac=function(e){return new(e||t)(r(m),r(b),r(I))}}static{this.\u0275prov=v({token:t,factory:t.\u0275fac})}}return t})(),ae=(()=>{class t{static{this.\u0275fac=function(e){return new(e||t)}}static{this.\u0275mod=p({type:t})}static{this.\u0275inj=f({providers:[H,b]})}}return t})();export{I as a,oe as b,ce as c,ae as d};

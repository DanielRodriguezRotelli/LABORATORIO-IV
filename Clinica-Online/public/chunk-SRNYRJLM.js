import{N as l,P as o,R as n,T as t,U as p,V as h}from"./chunk-IWNF2QU4.js";import{c,u as r,x as d}from"./chunk-XL3YBMFF.js";var m=(()=>{class a{constructor(e){this.firestore=e,this.coleccionEspecialidades=[],this.especialidades=[],this.countEspecialidades=0,this.guardarEspecialidadSubject=new c(!1),this.obtenerEspecialidadesSubject=new c(!1)}ngOnDestroy(){this.sub.unsubscribe()}guardarEspecialidad(e){let i=t(this.firestore,"especialidades");n(i,{nombre:e.nombre}).then(()=>{console.log("Especialidad guardada con \xE9xito"),this.guardarEspecialidadSubject.next(!0)}).catch(s=>{console.error("Error al guardar la especialidad: ",s),this.guardarEspecialidadSubject.next(!1)})}obtenerEspecialidades(){let e=t(this.firestore,"especialidades"),i=o(e,{idField:"id"});this.sub=i.subscribe(s=>{this.coleccionEspecialidades=s,this.countEspecialidades=this.coleccionEspecialidades.length,this.obtenerEspecialidadesSubject.next(!0)})}eliminarEspecialidad(e){let i=h(this.firestore,`especialidades/${e}`);p(i).then(()=>{console.log("Especialidad eliminada con \xE9xito")}).catch(s=>{console.error("Error al eliminar la especialidad: ",s)})}getEspecialidades(){let e=t(this.firestore,"especialidades");return o(e,{idField:"id"})}static{this.\u0275fac=function(i){return new(i||a)(d(l))}}static{this.\u0275prov=r({token:a,factory:a.\u0275fac,providedIn:"root"})}}return a})();export{m as a};
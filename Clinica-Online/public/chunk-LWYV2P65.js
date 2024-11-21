import{A as F,C as j,D as P,E as B,F as h,G as y,H as L,I as v,J as R,K as w,L as q,M as z,N as b,P as m,R as O,T as l,U as T,V as E,W as $,X as g,_ as S,aa as A,ba as C,c as x,t as D,v as U,y as p,z as k}from"./chunk-IWNF2QU4.js";import{c as n,pb as I,u,x as s}from"./chunk-XL3YBMFF.js";import{a as d}from"./chunk-SIAVTO45.js";var N=(()=>{class o{constructor(e){this.firestore=e,this.coleccionAdministradores=[],this.administradores=[],this.countAdministradores=0,this.guardarAdministradorSubject=new n(!1),this.obtenerAdministradoresSubject=new n(!1)}ngOnDestroy(){this.sub.unsubscribe()}guardarAdministrador(e){let t=l(this.firestore,"administradores");O(t,{nombre:e.nombre,apellido:e.apellido,edad:e.edad,dni:e.dni,mail:e.mail}).then(()=>{console.log("Administrador guardado con \xE9xito"),this.guardarAdministradorSubject.next(!0)}).catch(i=>{console.error("Error al guardar el administrador: ",i),this.guardarAdministradorSubject.next(!1)})}obtenerAdministradorPorId(e){let t=E(this.firestore,`administradores/${e}`);return $(t).then(i=>i.exists()?d({id:i.id},i.data()):(console.log("No existe el documento"),null)).catch(i=>(console.error("Error al obtener el administrador por ID: ",i),null))}obtenerAdministradorPorEmail(e){let t=l(this.firestore,"administradores"),i=S(t,A("mail","==",e));return g(i).then(r=>{if(r.empty)return console.log("No existe el documento"),null;{let a=r.docs[0];return d({id:a.id},a.data())}}).catch(r=>(console.error("Error al obtener el administrador por email: ",r),null))}obtenerAdministradores(){let e=l(this.firestore,"administradores"),t=m(e,{idField:"id"});this.sub=t.subscribe(i=>{this.coleccionAdministradores=i,this.countAdministradores=this.coleccionAdministradores.length,this.obtenerAdministradoresSubject.next(!0)})}eliminarAdministrador(e){let t=E(this.firestore,`administradores/${e}`);T(t).then(()=>{console.log("Administrador eliminado con \xE9xito")}).catch(i=>{console.error("Error al eliminar el administrador: ",i)})}esAdmin(e){return new Promise((t,i)=>{let r=S(l(this.firestore,"administradores"),A("mail","==",e));g(r).then(a=>{let f=!1;a.forEach(c=>{f=!0}),t(f)}).catch(a=>{i(a)})})}getAdminByMail(e){let t=S(l(this.firestore,"administradores"),A("mail","==",e));return g(t)}getAdministradores(){let e=l(this.firestore,"administradores");return m(e,{idField:"id"})}static{this.\u0275fac=function(t){return new(t||o)(s(b))}}static{this.\u0275prov=u({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();var M=(()=>{class o{constructor(e){this.firestore=e,this.coleccionPacientes=[],this.pacientes=[],this.countPacientes=0,this.guardarPacienteSubject=new n(!1),this.obtenerPacientesSubject=new n(!1)}ngOnDestroy(){this.sub.unsubscribe()}guardarPaciente(e){let t=h(this.firestore,"pacientes");z(t,{mail:e.mail,dni:e.dni,nombre:e.nombre,apellido:e.apellido,edad:e.edad,obraSocial:e.obraSocial,urlImagen1:e.urlImagen1,urlImagen2:e.urlImagen2}).then(()=>{console.log("Paciente guardado con \xE9xito"),this.guardarPacienteSubject.next(!0)}).catch(i=>{console.error("Error al guardar el paciente: ",i),this.guardarPacienteSubject.next(!1)})}obtenerPacientePorId(e){let t=y(this.firestore,`pacientes/${e}`);return R(t).then(i=>i.exists()?d({id:i.id},i.data()):(console.log("No existe el documento"),null)).catch(i=>(console.error("Error al obtener el paciente por ID: ",i),null))}obtenerPacientePorEmail(e){let t=h(this.firestore,"pacientes"),i=L(t,v("mail","==",e));return w(i).then(r=>{if(r.empty)return console.log("No existe el documento"),null;{let a=r.docs[0];return d({id:a.id},a.data())}}).catch(r=>(console.error("Error al obtener el paciente por email: ",r),null))}obtenerPacientes(){let e=h(this.firestore,"pacientes"),t=m(e,{idField:"id"});this.sub=t.subscribe(i=>{this.coleccionPacientes=i,this.countPacientes=this.coleccionPacientes.length,this.obtenerPacientesSubject.next(!0)})}eliminarPaciente(e){let t=y(this.firestore,`pacientes/${e}`);q(t).then(()=>{console.log("Paciente eliminado con \xE9xito")}).catch(i=>{console.error("Error al eliminar el paciente: ",i)})}getPacienteByMail(e){let t=L(h(this.firestore,"pacientes"),v("mail","==",e));return w(t)}getPacientes(){let e=h(this.firestore,"pacientes");return m(e,{idField:"id"})}static{this.\u0275fac=function(t){return new(t||o)(s(b))}}static{this.\u0275prov=u({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();var ne=(()=>{class o{constructor(e,t,i,r,a){this.auth=e,this.administradoresService=t,this.pacientesService=i,this.especialistasService=r,this.router=a,this.loggedUser="",this.errorRegistro=!1,this.mensajeErrorRegister="",this.errorLogin=!1,this.mensajeErrorLogin="",this.isLoggedIn=!1,this.firebaseInicializado=!1,this.tipoUsuario="",this.swal=new B(this.router),this.userLoadedSubject=new n(!1),this.userLoaded$=this.userLoadedSubject.asObservable(),this.auth.authStateReady().then(()=>{this.firebaseInicializado=!0});let f={apiKey:"AIzaSyDKKWiR7ncgFSsklLqFUBxLyAyw8UfKxX0",authDomain:"clinicaonline-a296c.firebaseapp.com"};this.secondaryApp=D(f,"Secondary"),F(this.auth,c=>{c&&c.emailVerified&&(console.log("Usuario autenticado encontrado:",c),c.email?(console.log("usuario Email: "+c.email),this.loadUserData(c.email)):(this.usuarioLogeado=null,this.userLoadedSubject.next(!0)))})}loadUserData(e){Promise.all([this.administradoresService.getAdminByMail(e),this.pacientesService.getPacienteByMail(e),this.especialistasService.getEspecialistaByMail(e)]).then(([t,i,r])=>{t.docs.length>0?(this.usuarioLogeado=t.docs[0].data(),this.usuarioLogeado.id=t.docs[0].id,console.log("usuario Admin: "+this.usuarioLogeado),this.tipoUsuario="administrador"):i.docs.length>0?(this.usuarioLogeado=i.docs[0].data(),this.usuarioLogeado.id=i.docs[0].id,console.log("usuario Paciente:"+this.usuarioLogeado),this.tipoUsuario="paciente"):r.docs.length>0&&(this.usuarioLogeado=r.docs[0].data(),this.usuarioLogeado.id=r.docs[0].id,console.log("usuario Especialista : "+this.usuarioLogeado),this.tipoUsuario="especialista"),this.userLoadedSubject.next(!0)})}esperarCargarUsuario(){return new Promise(e=>{let t=setTimeout(()=>{console.warn("Timeout al esperar carga de usuario"),e()},5e3);if(this.userLoadedSubject.getValue()){clearTimeout(t),e();return}let i=this.userLoadedSubject.subscribe(r=>{r&&(clearTimeout(t),e(),i.unsubscribe())})})}authStateReady(){return this.auth.authStateReady()}registerSinLogin(e,t){let i=k(this.secondaryApp);return i.currentUser?P(i).catch(()=>{}).then(()=>p(i,e,t)).catch(r=>{throw r}):p(i,e,t)}register(e,t){return p(this.auth,e,t)}logIn(e,t){return this.especialistasService.obtenerEspecialistaPorEmail(e).then(i=>{if(i){if(console.log(i),i.estado==="aprobado")return j(this.auth,e,t);throw new x("especialista-no-aprobado","El especialista no ha sido aprobado por un administrador.")}else return j(this.auth,e,t)}).then(i=>{this.firebaseInicializado=!0,this.usuarioLogeado=i.user;let r=i.user.email;return r&&this.loadUserData(r),i}).catch(i=>{throw i})}LogOut(){P(this.auth).then(()=>{this.tipoUsuario="",this.usuarioLogeado=null})}traducirErrorCode(e){let t;switch(e){case"auth/email-already-in-use":t="el email ya est\xE1 en uso";break;case"auth/weak-password":t="la contrase\xF1a debe tener m\xE1s de 6 caracteres";break;case"auth/invalid-email":t="el email es inv\xE1lido";break;case"auth/invalid-credential":t="el usuario no existe o la contrase\xF1a es incorrecta";break;case"auth/missing-password":t="la contrase\xF1a no puede estar vac\xEDa";break;case"auth/missing-email":t="el email no puede estar vac\xEDo";break;case"especialista-no-aprobado":t="El especialista no ha sido aprobado por un administrador";break;default:t="ocurri\xF3 un error inesperado";break}return t}static{this.\u0275fac=function(t){return new(t||o)(s(U),s(N),s(M),s(C),s(I))}}static{this.\u0275prov=u({token:o,factory:o.\u0275fac,providedIn:"root"})}}return o})();export{N as a,M as b,ne as c};

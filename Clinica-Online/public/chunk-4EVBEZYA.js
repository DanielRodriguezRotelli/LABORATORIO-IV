var c=class{constructor(){}getFechaActual(){let e=new Date,t=String(e.getDate()).padStart(2,"0"),a=String(e.getMonth()+1).padStart(2,"0");return`${e.getFullYear()}-${a}-${t}`}getDia(e){let[t,a,r]=e.split("-").map(Number),o=new Date(t,a-1,r),n=new Intl.DateTimeFormat("es-ES",{weekday:"long"}).format(o);return n=n.charAt(0).toUpperCase()+n.slice(1),n}getProximosDias(e){let t=[],a=new Date;for(let r=1;r<e+1;r++){let o=new Date(a);o.setDate(a.getDate()+r);let n=o.getFullYear(),s=("0"+o.getDate()).slice(-2),i=("0"+(o.getMonth()+1)).slice(-2);t.push(`${n}-${i}-${s}`)}return t}minutosAHora(e){let t=Math.floor(e/60),a=e%60,r=String(t).padStart(2,"0"),o=String(a).padStart(2,"0");return`${r}:${o}`}getHoraActual(){let e=new Date,t=e.getHours(),a=e.getMinutes(),r=t>=12?"pm":"am";t=t%12,t=t||12;let o=a<10?"0"+a:a;return t+":"+o+" "+r}horaAMinutos(e){let t=/^(\d{1,2}):(\d{2})$/;if(!e.match(t))return 0;let[r,o]=e.split(" "),[n,s]=r.split(":").map(Number);return typeof n=="number"&&!isNaN(n)&&typeof s=="number"&&!isNaN(s)?n*60+s:0}fechaADate(e){let[t,a]=e.split("/").map(Number);return new Date(new Date().getFullYear(),a-1,t)}};export{c as a};
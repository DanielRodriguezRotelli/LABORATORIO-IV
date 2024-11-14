import { EnvironmentProviders, Injector } from "@angular/core";

export class Tiempo {

    constructor() { }

    public getFechaActual()
    {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        return `${año}-${mes}-${dia}`;
    }

    public getDia(fechaFormateada: string)
    {
        let [anio, mes, dia] = fechaFormateada.split('-').map(Number);
        //let anio = new Date().getFullYear();
        let fecha = new Date(anio, mes - 1, dia);

        let nombreDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(fecha);

        nombreDia = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

        return nombreDia;
    }

    public getProximosDias(cantidad: number)
    {
        const proximosDias: string[] = [];
        const hoy = new Date();

        for (let i = 1; i < cantidad + 1; i++)
        {
            const dia = new Date(hoy);
            dia.setDate(hoy.getDate() + i);

            const anoStr = (dia.getFullYear());
            const diaStr = ('0' + dia.getDate()).slice(-2);
            const mesStr = ('0' + (dia.getMonth() + 1)).slice(-2);

            proximosDias.push(`${anoStr}-${mesStr}-${diaStr}`);
        }

        return proximosDias;
    }

    public minutosAHora(minutos: number)
    {
        let hora = Math.floor(minutos / 60);
        let minutosRestantes = minutos % 60;

        // Aseguramos que siempre haya dos dígitos para la hora y los minutos
        let horaFormateada = String(hora).padStart(2, '0');
        let minutosFormateados = String(minutosRestantes).padStart(2, '0');

        return `${horaFormateada}:${minutosFormateados}`;
    }

    public getHoraActual()
    {
        const ahora = new Date();
        let horas = ahora.getHours();
        const minutos = ahora.getMinutes();
        const ampm = horas >= 12 ? 'pm' : 'am';

        horas = horas % 12;
        horas = horas ? horas : 12;
        const minutosStr = minutos < 10 ? '0' + minutos : minutos;

        const horaActual = horas + ':' + minutosStr + ' ' + ampm;
        return horaActual;
    }

    public horaAMinutos(hora: string): number
    {
        const regex = /^(\d{1,2}):(\d{2})$/;
        const match = hora.match(regex);

        if (!match)
        {
            return 0;
        }
        let [time, ampm] = hora.split(' ');

        let [hora24, minutos] = time.split(':').map(Number);
        if (typeof hora24 === 'number' && !isNaN(hora24) && typeof minutos === 'number' && !isNaN(minutos)) {
            
            return (hora24 * 60) + minutos; // Convierte a minutos desde medianoche
        }
        return 0; // Devuelve 0 si hubo algún error en la conversión
    }

    public fechaADate(fecha: string): Date
    {
        const [dia, mes] = fecha.split('/').map(Number);
        return new Date(new Date().getFullYear(), mes - 1, dia);
    }
}
export declare function provideTiempo(fn: (injector: Injector) => Tiempo, ...deps: any[]): EnvironmentProviders;
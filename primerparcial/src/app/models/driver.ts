export class Driver {
    dni?: number;
    nombre?: string;
    edad?: number;
    numeroLicencia?: number;
    pais?: string;
    licenciaProfesional?: boolean;
  
    constructor(
      dni?: number,
      nombre?: string,
      edad?: number,
      numeroLicencia?: number,
      pais?: string,
      licenciaProfesional?: boolean
    ) {
      this.dni = dni;
      this.nombre = nombre;
      this.edad = edad;
      this.numeroLicencia = numeroLicencia;
      this.pais = pais;
      this.licenciaProfesional = licenciaProfesional;
    }
  }
export interface Users {
    uid: string;          // Identificador único
    nombre: string;       // Nombre completo
    correo: string;       // Correo electrónico
    tipo: string;//'alumno' | 'maestro' | 'admin'; // Tipo de usuario
    contraseña: string;   // Contraseña
    fecha: string;//Date;
    img: string;
}
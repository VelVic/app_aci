export interface Integrators {
    id: string;            // Identificador único
    nombre: string;        // Título del proyecto
    descripcion: string;   // Breve descripción del proyecto
    categoria: string;     // Categoría o área temática (e.g., "Ingeniería", "Ciencias Sociales")
    fechaCreacion: string;//Date;   // Fecha de creación del proyecto
    estado: string;//'progreso' | 'finalizado' | 'cancelado'; // Estado actual del proyecto
    responsables: string; 
    idUsuario: string,// Nombres de los alumnos responsables del proyecto
    img: string;           // Imagen del proyecto
  }
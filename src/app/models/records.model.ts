export interface Records {
  id: string;          // Identificador único del registro
  usuarioId: string;   // ID del usuario que realizó la acción
  proyectoId: string;  // ID del proyecto afectado
  accion: string;//'creación' | 'actualización' | 'eliminación'; // Acción realizada
  fecha: string;//Date;         // Fecha y hora de la acción
  detalles?: string;   // Detalles adicionales de la acción (opcional)
}
export interface Grupo{
    id: string;
    nombre: string,
    miembros: User[]; // Cambiado a un array de User
}

export interface User {
  id: string;
  apellido: string;
  nombre: string;
  email: string;
  contraseña: string;
  fechaCreacion: Date | null; // Puedes ajustar el tipo según tus necesidades
}
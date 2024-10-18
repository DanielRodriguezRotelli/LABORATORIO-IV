export type TYPE_ROLE = "empleado" | "admin"

export interface UserInterface {
  email: string;
  password: string;
  role: TYPE_ROLE;
}
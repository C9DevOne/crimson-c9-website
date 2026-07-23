import type { Access, FieldAccess } from "payload";
import type { User } from "../payload-types";

const checkAdmin = (user: User | null | undefined) => Boolean(user && user.role === "admin");
const checkAdminOrEditor = (user: User | null | undefined) =>
  Boolean(user && (user.role === "admin" || user.role === "editor"));

export const isAdmin: Access = ({ req: { user } }) => checkAdmin(user);
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => checkAdmin(user);

export const isAdminOrEditor: Access = ({ req: { user } }) => checkAdminOrEditor(user);
export const isAdminOrEditorFieldLevel: FieldAccess = ({ req: { user } }) =>
  checkAdminOrEditor(user);

export const isAnyUser: Access = ({ req: { user } }) => {
  return Boolean(user);
};

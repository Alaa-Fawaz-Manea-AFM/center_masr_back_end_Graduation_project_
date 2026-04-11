import { IfAppError, roleSet } from "../utils/index.js";

const validateRole = (role) =>
  IfAppError(roleSet.has(role), `Invalid role: ${role}`, 403);

export default validateRole;

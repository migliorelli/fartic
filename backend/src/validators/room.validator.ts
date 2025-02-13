export function validateCreateRoom(room: any) {
  if (typeof room !== "object") return false;
  return true;
}

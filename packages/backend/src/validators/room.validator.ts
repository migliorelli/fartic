import { isEmpty } from "@/utils/util";

export function validateCreateRoom(room: any) {
  if (
    typeof room !== "object" ||
    isEmpty(room.theme) ||
    isEmpty(room.targetPontuation) ||
    isEmpty(room.playerLimit)
  )
    return false;
  return true;
}

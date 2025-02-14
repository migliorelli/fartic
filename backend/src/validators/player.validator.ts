import { isEmpty } from "@/utils/util";

export function validateCreatePlayer(player: any) {
  if (
    typeof player !== "object" ||
    isEmpty(player.socketId) ||
    isEmpty(player.username)
  )
    return false;

  return true;
}

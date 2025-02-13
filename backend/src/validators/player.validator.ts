export function validateCreatePlayer(player: any) {
  if (typeof player !== "object" || !player.socketId || !player.username)
    return false;

  return true;
}

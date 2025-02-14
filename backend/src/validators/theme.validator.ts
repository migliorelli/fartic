import { isArray, isEmpty } from "@/utils/util";

export function validateCreateTheme(theme: any) {
  if (
    typeof theme !== "object" ||
    isEmpty(theme.name) ||
    (!isEmpty(theme.words) && !isArray(theme.words))
  )
    return false;

  return true;
}

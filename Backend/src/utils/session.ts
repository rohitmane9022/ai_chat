import { v4 as uuid } from "uuid";

export function getSessionId(existing?: string) {
  return existing || uuid();
}

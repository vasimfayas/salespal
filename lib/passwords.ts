import { randomInt } from "node:crypto";

/** Letters and digits that can't be misread (no 0/O, 1/l/I). */
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** A random first password for a new login, shown once to whoever creates it (never a shared default). */
export function newTempPassword(length = 12) {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}

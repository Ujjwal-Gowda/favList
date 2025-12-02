import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const userAtom = atomWithStorage<User | null>("user", null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);

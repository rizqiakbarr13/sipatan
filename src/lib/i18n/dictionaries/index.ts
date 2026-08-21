import id from "./id";
import en from "./en";
import type { Locale } from "../config";

export const dictionaries = { id, en } satisfies Record<Locale, unknown>;

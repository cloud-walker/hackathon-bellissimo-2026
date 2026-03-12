import { Credentials, Translator } from "@translated/lara";

function initLaraClient() {
  const id = process.env.LARA_ACCESS_KEY_ID;
  const secret = process.env.LARA_ACCESS_KEY_SECRET;

  if (!id || !secret) {
    throw new Error("Missing LARA_ACCESS_KEY_ID or LARA_ACCESS_KEY_SECRET in environment variables.");
  }

  const credentials = new Credentials(id, secret);
  return new Translator(credentials);
}

export const lara = initLaraClient();

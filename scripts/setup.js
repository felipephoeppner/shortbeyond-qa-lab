import { copyFile, constants } from "node:fs/promises";
try {
  await copyFile(new URL("../.env.example", import.meta.url), new URL("../.env", import.meta.url), constants.COPYFILE_EXCL);
  console.log(".env criado com as configurações locais do laboratório.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log(".env já existe; configurações preservadas.");
}

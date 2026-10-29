import { test, expect } from "../../../support/fixtures/index.js";
import { getUserWithLink } from "../../../support/factories/user.js";

test.describe("POST /api/links", () => {
  let user, token;
  test.beforeEach(async ({ auth }) => {
    user = getUserWithLink();
    expect((await auth.createUser(user)).status()).toBe(201);
    token = await auth.getToken(user);
  });

  test("Encurta um link | 201", async ({ links }) => {
    const response = await links.createLink(user.link, token);
    expect(response.status()).toBe(201);
    const { data, message } = await response.json();
    expect(data).toMatchObject(user.link);
    expect(data.id).toBeTruthy();
    expect(data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
    expect(message).toBe("Link criado com sucesso");
  });

  for (const [field, value, message] of [
    ["original_url", "", "O campo 'OriginalURL' é obrigatório"],
    ["title", "", "O campo 'Title' é obrigatório"],
    ["original_url", "url-invalida", "O campo 'OriginalURL' deve ser uma URL válida"],
  ]) {
    test(`Rejeita ${field} ${value ? "inválido" : "vazio"} | 400`, async ({ links }) => {
      const response = await links.createLink({ ...user.link, [field]: value }, token);
      expect(response.status()).toBe(400);
      expect((await response.json()).message).toBe(message);
    });
  }
});

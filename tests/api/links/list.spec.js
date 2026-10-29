import { test, expect } from "../../../support/fixtures/index.js";
import { getUserWithLinks } from "../../../support/factories/user.js";

test.describe("GET /api/links", () => {
  test("Lista os links do usuário sem depender da ordenação", async ({ auth, links }) => {
    const user = getUserWithLinks();
    expect((await auth.createUser(user)).status()).toBe(201);
    const token = await auth.getToken(user);
    for (const link of user.links) expect((await links.createLink(link, token)).status()).toBe(201);
    const response = await links.getLinks(token);
    expect(response.status()).toBe(200);
    const { message, count, data } = await response.json();
    expect(message).toBe("Links Encurtados");
    expect(count).toBe(user.links.length);
    expect(data).toHaveLength(user.links.length);
    expect(data).toEqual(expect.arrayContaining(user.links.map(link => expect.objectContaining(link))));
    for (const link of data) {
      expect(link.id).toBeTruthy();
      expect(link.short_code).toMatch(/^[a-zA-Z0-9]{5}$/);
    }
  });

  test("Retorna lista vazia para um novo usuário", async ({ auth, links }) => {
    const user = getUserWithLinks(0);
    expect((await auth.createUser(user)).status()).toBe(201);
    const token = await auth.getToken(user);
    const response = await links.getLinks(token);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ message: "Links Encurtados", count: 0, data: [] });
  });
});

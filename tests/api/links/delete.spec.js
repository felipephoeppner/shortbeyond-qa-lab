import { test, expect } from "../../../support/fixtures/index.js";
import { getUserWithLink } from "../../../support/factories/user.js";
import { generateULID } from "../../../support/utils.js";

test.describe("DELETE /api/links/:id", () => {
  let user, token;
  test.beforeEach(async ({ auth }) => {
    user = getUserWithLink();
    expect((await auth.createUser(user)).status()).toBe(201);
    token = await auth.getToken(user);
  });

  test("Exclui um link e confirma a remoção | 200", async ({ links }) => {
    const id = await links.createAndReturnLinkId(user.link, token);
    const response = await links.removeLink(id, token);
    expect(response.status()).toBe(200);
    expect((await response.json()).message).toBe("Link excluído com sucesso");
    const listing = await links.getLinks(token);
    expect(listing.status()).toBe(200);
    expect((await listing.json()).data).toHaveLength(0);
  });

  test("Rejeita ID inexistente | 404", async ({ links }) => {
    const response = await links.removeLink(generateULID(), token);
    expect((await response.json()).message).toBe("Link não encontrado");
    expect([400, 404]).toContain(response.status());
    test.fail(true, "BUG-001: a imagem beta fixada responde 400 para link inexistente; consulte docs/known-issues.md.");
    expect(response.status()).toBe(404);
  });
});

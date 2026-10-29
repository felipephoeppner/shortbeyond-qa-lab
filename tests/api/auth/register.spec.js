import { test, expect } from "../../../support/fixtures/index.js";
import { getUser } from "../../../support/factories/user.js";

test.describe("POST /api/auth/register", () => {
  test("Cadastra usuário e omite a senha | 201", async ({ auth }) => {
    const user = getUser();
    const response = await auth.createUser(user);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe("Usuário cadastrado com sucesso!");
    expect(body.user).toMatchObject({ name: user.name, email: user.email });
    expect(body.user.id).toBeTruthy();
    expect(body.user).not.toHaveProperty("password");
  });

  test("Rejeita e-mail duplicado | 400", async ({ auth }) => {
    const user = getUser();
    expect((await auth.createUser(user)).status()).toBe(201);
    const response = await auth.createUser(user);
    expect(response.status()).toBe(400);
    expect((await response.json()).message).toBe("Este e-mail já está em uso. Por favor, tente outro.");
  });

  for (const [field, value, message] of [
    ["email", "invalido#example.test", "O campo 'Email' deve ser um email válido"],
    ["name", "", "O campo 'Name' é obrigatório"],
    ["password", "", "O campo 'Password' é obrigatório"],
    ["email", "", "O campo 'Email' é obrigatório"],
  ]) {
    test(`Rejeita ${field} ${value ? "inválido" : "vazio"} | 400`, async ({ auth }) => {
      const response = await auth.createUser({ ...getUser(), [field]: value });
      expect(response.status()).toBe(400);
      expect((await response.json()).message).toBe(message);
    });
  }
});

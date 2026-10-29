import { test, expect } from "../../../support/fixtures/index.js";
import { getUser } from "../../../support/factories/user.js";

test.describe("POST /api/auth/login", () => {
  test("Autentica usuário cadastrado | 200", async ({ auth }) => {
    const user = getUser();
    expect((await auth.createUser(user)).status()).toBe(201);
    const response = await auth.login(user);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe("Login realizado com sucesso");
    expect(body.data.token).toBeTruthy();
    expect(body.data.user).toMatchObject({ name: user.name, email: user.email });
    expect(body.data.user.id).toBeTruthy();
    expect(body.data.user).not.toHaveProperty("password");
  });

  test("Rejeita senha incorreta | 401", async ({ auth }) => {
    const user = getUser();
    expect((await auth.createUser(user)).status()).toBe(201);
    const response = await auth.login({ ...user, password: "senha-incorreta" });
    expect(response.status()).toBe(401);
    expect((await response.json()).message).toBe("Credenciais inválidas");
  });

  test("Rejeita usuário não cadastrado | 401", async ({ auth }) => {
    const response = await auth.login(getUser());
    expect(response.status()).toBe(401);
    expect((await response.json()).message).toBe("Credenciais inválidas");
  });

  for (const [field, message] of [
    ["email", "O campo 'Email' é obrigatório"],
    ["password", "O campo 'Password' é obrigatório"],
  ]) {
    test(`Rejeita ${field} ausente | 400`, async ({ auth }) => {
      const user = getUser();
      delete user[field];
      const response = await auth.login(user);
      expect(response.status()).toBe(400);
      expect((await response.json()).message).toBe(message);
    });
  }
});

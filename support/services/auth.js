export const authService = request => ({
  createUser: user => request.post("/api/auth/register", { data: user }),
  login: user => request.post("/api/auth/login", {
    data: { email: user.email, password: user.password },
  }),
  async getToken(user) {
    const response = await this.login(user);
    if (response.status() !== 200) throw new Error(`Login falhou: HTTP ${response.status()}`);
    const body = await response.json();
    if (!body.data?.token) throw new Error("Login sem token.");
    return body.data.token;
  },
});

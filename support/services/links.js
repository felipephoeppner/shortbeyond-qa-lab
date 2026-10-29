export const linksService = request => ({
  createLink: (link, token) => request.post("/api/links", {
    headers: { Authorization: `Bearer ${token}` }, data: link,
  }),
  getLinks: token => request.get("/api/links", {
    headers: { Authorization: `Bearer ${token}` },
  }),
  removeLink: (id, token) => request.delete(`/api/links/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }),
  async createAndReturnLinkId(link, token) {
    const response = await this.createLink(link, token);
    if (response.status() !== 201) throw new Error(`Criação de link falhou: HTTP ${response.status()}`);
    const body = await response.json();
    return body.data.id;
  },
});

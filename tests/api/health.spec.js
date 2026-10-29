import { test, expect } from "@playwright/test";
test("API está saudável | 200", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ service: "shortbeyond-api", status: "healthy" });
});

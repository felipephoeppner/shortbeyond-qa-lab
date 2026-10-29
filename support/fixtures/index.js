import { test as baseTest, expect } from "@playwright/test";
import { authService } from "../services/auth.js";
import { linksService } from "../services/links.js";
import { deleteUsersByEmail } from "../database.js";

const test = baseTest.extend({
  // Cada teste registra suas próprias contas. A limpeza não afeta outros testes.
  auth: async ({ request }, use) => {
    const service = authService(request);
    const emails = new Set();
    const createUser = service.createUser;
    service.createUser = async user => {
      const response = await createUser(user);
      if (response.status() === 201) emails.add(user.email);
      return response;
    };
    try { await use(service); }
    finally { await deleteUsersByEmail([...emails]); }
  },
  links: async ({ request }, use) => { await use(linksService(request)); },
});
export { test, expect };

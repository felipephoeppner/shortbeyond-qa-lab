import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

export function getUser() {
  return {
    name: faker.person.fullName(),
    email: `api-${randomUUID()}@qa.example.test`,
    password: "senha123",
  };
}
export function getUserWithLink() {
  return { ...getUser(), link: { original_url: "https://example.com/", title: faker.music.songName() } };
}
export function getUserWithLinks(count = 5) {
  return {
    ...getUser(),
    links: Array.from({ length: count }, (_, i) => ({
      original_url: `https://example.com/item/${randomUUID()}`,
      title: `Link de teste ${i + 1}`,
    })),
  };
}

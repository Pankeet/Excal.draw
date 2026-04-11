import request from "supertest";
import app from "../index.js";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@repo/db-local/config/prisma-config.js", () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
      },
      room: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
      chat: {
        findMany: vi.fn(),
      },
    },
  };
});


vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));


import { prisma } from "@repo/db-local/config/prisma-config.js";
import bcrypt from "bcrypt";

describe("Auth API", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail signup with invalid data", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      email: "bad-email",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBe("Invalid Semantics");
  });

  it("should create user with valid data", async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue("hashedpassword");
    (prisma.user.create as any).mockResolvedValue({});

    const res = await request(app).post("/api/v1/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
  });

  it("should fail signin with wrong credentials", async () => {
    (prisma.user.findMany as any).mockResolvedValue([
      {
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
      },
    ]);

    (bcrypt.compare as any).mockResolvedValue(false);

    const res = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "wrong",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid Credentials !");
  });

  it("should let the user signin with correct credentials", async () => {
    (prisma.user.findMany as any).mockResolvedValue([
      {
        id: 1,
        email: "test@test.com",
        password: "hashedpassword",
      },
    ]);

    (bcrypt.compare as any).mockResolvedValue(true);

    const res = await request(app).post("/api/v1/signin").send({
      username: "testuser",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
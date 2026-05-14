import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("localStorage", localStorageMock);

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal("sessionStorage", sessionStorageMock);

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
const locationMock = {
  href: "http://localhost/",
  pathname: "/",
  search: "",
  hash: "",
};
vi.stubGlobal("location", locationMock);
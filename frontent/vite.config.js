/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows using global test APIs like 'describe', 'it', etc.
    environment: "jsdom", // For DOM testing environment
    setupFiles: "./src/setupTests.js", // Optional setup file for configuration
  },
});

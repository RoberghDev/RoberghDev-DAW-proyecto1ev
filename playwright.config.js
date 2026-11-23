import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // LA PORTADA (WEBGL POR SOFTWARE EN HEADLESS) ES LENTA CON VARIOS WORKERS EN PARALELO.
  // Con 6 portadas a la vez la máquina se satura (también con la versión original), así que se
  // limitan los workers y se amplía el tiempo por prueba.
  timeout: 60_000,
  workers: 3,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});

import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

// --- Only run HTTPS/cert logic in local development ---
let httpsConfig = false;

if (process.env.NODE_ENV !== 'production') {
    try {
        const baseFolder =
            env.APPDATA && env.APPDATA !== ''
                ? `${env.APPDATA}/ASP.NET/https`
                : `${env.HOME}/.aspnet/https`;

        const certificateName = 'ovor.client';
        const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
        const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }

        if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
            const result = child_process.spawnSync('dotnet', [
                'dev-certs',
                'https',
                '--export-path',
                certFilePath,
                '--format',
                'Pem',
                '--no-password',
            ], { stdio: 'inherit' });

            if (result.status !== 0) {
                console.warn('⚠️ Could not create local certificate. Falling back to HTTP.');
            }
        }

        if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
            httpsConfig = {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            };
        }
    } catch {
        console.warn('⚠️ Skipping HTTPS certificate setup.');
    }
}

// Target backend (used in proxy)
const target =
    env.ASPNETCORE_HTTPS_PORT
        ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
        : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7272';

// --- Vite configuration ---
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false,
            },
            '^/api': {
                target,
                secure: false,
                changeOrigin: true,
            },
        },
        port: parseInt(env.DEV_SERVER_PORT || '57483'),
        https: httpsConfig, // ✅ only used locally, false on Render
    },
});

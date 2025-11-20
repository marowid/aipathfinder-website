import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcsspresetenv from "postcss-preset-env";
import Checker from "vite-plugin-checker";
import path from "path";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";
import TurboConsole from "unplugin-turbo-console/vite";
import { qrcode } from "vite-plugin-qrcode";
import fg from "fast-glob";
import sassDts from "vite-plugin-sass-dts";
const ROOT = path.join(__dirname, "src");

const htmlFiles = Object.fromEntries(
    fg.sync("./**/*.html", { cwd: ROOT }).map(file => [
        file.replace(/\.html$/, ""),
        path.resolve(ROOT, file),
    ])
);

export default defineConfig(({ mode }) => {
    const isProd = mode === "production";

    return {
        base: "",
        root: ROOT,
        server: {
            port: 5173,
            strictPort: false,
        },
        plugins: [
            TurboConsole(),
            sassDts(),

            ...(isProd ? [compression({ algorithm: "brotliCompress" }), compression({ algorithm: "gzip" })] : [qrcode(), Checker({ typescript: true })]),

            eslint({
                fix: false,
                cache: true,
                include: ["src/scripts/**/*.{ts}"],
                overrideConfigFile: ".eslintrc",
            }),

            stylelint({
                fix: false,
                cache: true,
                include: ["src/styles/**/*.{scss}"],
                lintDirtyOnly: true,
            }),
        ],
        resolve: {
            extensions: [".ts", ".js", ".mjs", ".mts", ".jsx", ".tsx", ".json"],
            alias: {
                "@forwards": path.resolve(__dirname, "src/styles/forwards"),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                },
            },
            postcss: {
                plugins: isProd ? [autoprefixer, cssnano, postcsspresetenv] : [autoprefixer],
            },
        },
        build: {
            manifest: false,
            sourcemap: isProd,
            cssCodeSplit: true,
            treeshake: true,
            minify: "terser",
            outDir: path.join(ROOT, "dist"),
            rollupOptions: {
                input: {
                    maincss: path.join(ROOT, "/styles/main.scss"),
                    critical: path.join(ROOT, "styles/critical.scss"),
                    script: path.join(ROOT, "/scripts/main.ts"),

                    ...htmlFiles,
                },
                output: {
                    entryFileNames: `[name]-[hash].js`,
                    chunkFileNames: `[name]-[hash].js`,
                },
            },
        },
        optimizeDeps: {
            include: ["gsap", "lenis", "swiper"],
        },
    };
});

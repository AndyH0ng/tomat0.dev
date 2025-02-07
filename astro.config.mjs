// @ts-check
import { defineConfig } from "astro/config";
import { resolve } from "path";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import pagefind from "vite-plugin-pagefind";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { BASE, SITE } from "./src/config.json";

import customEmbeds from 'astro-custom-embeds';

import { transformerMetaHighlight, transformerNotationHighlight } from '@shikijs/transformers'

import LinkCardEmbed from './src/embeds/link-card/embed'
import YoutubeEmbed from './src/embeds/youtube/embed'

import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        $components: resolve("./src/components"),
        $layouts: resolve("./src/layouts"),
        $pages: resolve("./src/pages"),
        $assets: resolve("./src/assets"),
        $content: resolve("./src/content"),
      },
    },
    ssr: {
      noExternal: [BASE + "/pagefind/pagefind.js"],
    },
    plugins: [pagefind()],
    build: {
      rollupOptions: {
        external: [BASE + "/pagefind/pagefind.js"],
      },
    },
  },
  integrations: [customEmbeds({
    embeds: [
      YoutubeEmbed,
      LinkCardEmbed,
      
    ]
  }), robotsTxt({
    transform(content) {
      return `
#DaumWebMasterTool:311b820ef1c898f8af9076710bd7b460a6e9992ea10d2e6a9ae9342ee957aa52:VaT0r9PaGto+8OktnYR0MQ==\`
User-agent: *
Allow: /

Sitemap: https://tomat0.pages.dev/sitemap-index.xml
      `
    }
  }), mdx(), sitemap(), tailwind(), svelte()],

  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://shiki.style/themes
      // Alternatively, provide multiple themes
      // See note below for using dual light/dark themes
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      transformers: [transformerMetaHighlight(), transformerNotationHighlight()],
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },

  prefetch: {
    prefetchAll: true,
  },
  site: SITE,
  base: BASE,
  output: "static",

  experimental: {
    contentLayer: true,
  },
});
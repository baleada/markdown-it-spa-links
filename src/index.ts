import type MarkdownIt from 'markdown-it'
import { toLinkOpenRule, toLinkCloseRule } from './rules'
import { createLinkMetadata } from './extracted'

export type Options = {
  spa?: 'inertia' | 'next' | 'react' | 'nuxt' | 'vue',
  base?: string,
}

const defaultOptions: Options = {
  spa: 'vue',
  base: '',
}

export const createMarkdownItSpaLinks: (options: Options) => MarkdownIt.PluginSimple = options => md => {
  const { spa, base } = { ...defaultOptions, ...options },
        linkMetadata = createLinkMetadata(spa)

  // Adapted from https://github.com/crookedneighbor/markdown-it-link-attributes
  const render = md.renderer.rules.link_open || defaultRender

  md.renderer.rules.link_open = toLinkOpenRule({ md, linkMetadata, base, render })
  md.renderer.rules.link_close = toLinkCloseRule({ md, linkMetadata, base, render })
}

function defaultRender (tokens, index, options, env, self) {
  return self.renderToken(tokens, index, options)
}

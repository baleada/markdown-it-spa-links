import { getLinkOpenRule, getLinkCloseRule } from './ruleGetters.js'
import spaLinks from './rulesBySpa.js'

function markdownItSpaLinks (md, { spa, base }) {
  const validSpas = spaLinks.map(({ name }) => name)

  if (!validSpas.includes(spa)) {
    throw new Error('invalid SPA name')
  }

  const spaLink = spaLinks.find(({ name }) => name === spa)

  // Adapted from https://github.com/crookedneighbor/markdown-it-link-attributes
  const render = md.renderer.rules.link_open || defaultRender

  md.renderer.rules.link_open = getLinkOpenRule({ md, spaLink, base, render })
  md.renderer.rules.link_close = getLinkCloseRule({ md, spaLink, base, render })
}

function defaultRender (tokens, index, options, env, self) {
  return self.renderToken(tokens, index, options)
}

export default markdownItSpaLinks

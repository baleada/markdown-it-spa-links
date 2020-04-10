import { getLinkOpenRule, getLinkCloseRule } from './ruleGetters'
import spaLinks from './rulesBySpa'

function markdownItSpaLinks (md, { spa, base }) {
  const validSpas = spaLinks.map(({ name }) => name)

  if (!validSpas.includes(spa)) {
    throw new Error('invalid SPA name')
  }

  const spaLink = spaLinks.find(({ name }) => name === spa)

  // Adapted from https://github.com/crookedneighbor/markdown-it-link-attributes
  const defaultRender = md.renderer.rules.link_open || this.defaultRender

  md.renderer.rules.link_open = getLinkOpenRule({ md, spaLink, base, defaultRender })
  md.renderer.rules.link_close = getLinkCloseRule({ md, spaLink, base, defaultRender })
}

markdownItSpaLinks.defaultRender = function (tokens, index, options, env, self) {
  return self.renderToken(tokens, index, options)
}

export default markdownItSpaLinks
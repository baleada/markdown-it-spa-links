import { findAttr } from './util/index.js'

export function getLinkOpenRule ({ md, spaLink, base, render }) {
  return function (tokens, index, options, env, self) {
    const href = findAttr({ token: tokens[index], attr: 'href' })[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    if (isInternal) {
      spaLink.link_open({ tokens, token: tokens[index], base, index })      
    }

    return spaLink.customRendersOpen && isInternal
      ? spaLink.customRenderOpen({ tokens, index, options, env, self })
      : render(tokens, index, options, env, self)
  }
}

export function getLinkCloseRule ({ md, spaLink, base, render }) {
  return function (tokens, index, options, env, self) {
    const linkOpenToken = getLinkOpenToken({ tokens, index }),
          hrefAttr = findAttr({ token: linkOpenToken, attr: spaLink.hrefAlias }) || findAttr({ token: linkOpenToken, attr: 'href' }),
          href = hrefAttr[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    if (isInternal) {
      spaLink.link_close({ tokens, token: tokens[index], index })
    }

    return spaLink.customRendersClose && isInternal
      ? spaLink.customRenderClose(render(tokens, index, options, env, self))
      : render(tokens, index, options, env, self)
  }
}

// Util
function getLinkOpenToken ({ tokens, index }) {
  return tokens
    .slice(0, index)
    .reverse()
    .find(({ type }) => type === 'link_open')
}

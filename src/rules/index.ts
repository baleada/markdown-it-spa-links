import MarkdownIt from 'markdown-it'
import type { RenderRule } from 'markdown-it/lib/renderer'
import type Token from 'markdown-it/lib/token'
import type { LinkMetadata } from '../extracted'
import { toAttr } from '../extracted'

export function toLinkOpenRule (
  { md, linkMetadata, base, render }: {
    md: MarkdownIt,
    linkMetadata: LinkMetadata,
    base: string,
    render: RenderRule
  }
): RenderRule {
  return function (tokens, index, options, env, self) {
    const href = toAttr({ token: tokens[index], name: 'href' })[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    if (isInternal) {
      linkMetadata.mutateLinkOpen({ tokens, token: tokens[index], base, index })      
    }

    return linkMetadata.customRendersOpen && isInternal
      ? linkMetadata.customRenderOpen({ tokens, index, options, env, self })
      : render(tokens, index, options, env, self)
  }
}

export function toLinkCloseRule (
  { md, linkMetadata, base, render }: {
    md: MarkdownIt,
    linkMetadata: LinkMetadata,
    base: string,
    render: RenderRule
  }
): RenderRule {
  return function (tokens, index, options, env, self) {
    const linkOpenToken = toLinkOpenToken({ tokens, index }),
          hrefAttr = toAttr({ token: linkOpenToken, name: linkMetadata.hrefAlias }) || toAttr({ token: linkOpenToken, name: 'href' }),
          href = hrefAttr[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    if (isInternal) {
      linkMetadata.mutateLinkClose({ tokens, token: tokens[index], index })
    }

    return linkMetadata.customRendersClose && isInternal
      ? linkMetadata.customRenderClose(render(tokens, index, options, env, self))
      : render(tokens, index, options, env, self)
  }
}

function toLinkOpenToken ({ tokens, index }: { tokens: Token[], index: number }): Token {
  return tokens
    .slice(0, index)
    .reverse()
    .find(({ type }) => type === 'link_open')
}

import type Token from 'markdown-it/lib/token'
import type { RenderRule } from 'markdown-it/lib/renderer'
import { toAttr } from '.'

export type LinkMetadata = {
  mutateLinkOpen?: (
    { tokens, token, base, index }: {
      tokens: Token[],
      token: Token,
      base: string,
      index: number
    }
  ) => void,
  mutateLinkClose?: (
    { tokens, token, index }: {
      tokens: Token[],
      token: Token,
      index: number
    }
  ) => void,
  hrefAlias?: string,
  customRendersOpen?: boolean,
  customRenderOpen?: (
    { tokens, index, options, env, self }: {
      tokens: Parameters<RenderRule>[0],
      index: Parameters<RenderRule>[1],
      options: Parameters<RenderRule>[2],
      env: Parameters<RenderRule>[3],
      self: Parameters<RenderRule>[4]
    }
  ) => string,
  customRendersClose?: boolean,
  customRenderClose?: (rendered: string) => string,
}

export function createLinkMetadata (spa): LinkMetadata {
  switch (spa) {
    case 'inertia':
      return {
        mutateLinkOpen: ({ token, base }) => {
          mutateTag({ token, to: 'inertia-link' })
          mutateUrl({ token, attr: 'href', base })
        },
        hrefAlias: 'href',
        mutateLinkClose: ({ token }) => {
          mutateTag({ token, to: 'inertia-link' })
        },
      }
    case 'next':
      return {
        mutateLinkOpen: ({ tokens, token, index, base }) => {
          mutateTag({ token, to: 'Link' })
          mutateUrl({ token, attr: 'href', base })
        },
        customRendersOpen: true,
        customRenderOpen: ({ tokens, index, options, env, self }) => {
          const token = tokens[index],
                validLinkAttrs = [
                  'href',
                  'as',
                  'passHref',
                  'prefetch',
                  'replace',
                  'scroll',
                  'shallow',
                ],
                linkAttrs = token.attrs.filter(([attr]) => validLinkAttrs.includes(attr)),
                link = linkAttrs.reduce((link, [attr, value]) => `${link} ${attr}="${value}"`, '<Link') + '>',
                aAttrs = token.attrs.filter(([attr]) => !validLinkAttrs.includes(attr)),
                a = aAttrs.reduce((a, [attr, value]) => `${a} ${attr}="${value}"`, '<a') + '>'

          return `${link}${a}`
        },
        hrefAlias: 'href',
        mutateLinkClose: ({ tokens, token, index }) => {
          mutateTag({ token, to: 'Link' })
        },
        customRendersClose: true,
        customRenderClose: rendered => `</a>${rendered}`,
      }
    case 'react':
      return {
        mutateLinkOpen: ({ token, base }) => {
          mutateTag({ token, to: 'Link' })
          mutateUrl({ token, attr: 'href', base })
          mutateAttr({ token, from: 'href', to: 'to' })
        },
        hrefAlias: 'to',
        mutateLinkClose: ({ token }) => {
          mutateTag({ token, to: 'Link' })
        },
      }
    case 'nuxt':
      return {
        mutateLinkOpen: ({ token, base }) => {
          mutateTag({ token, to: 'NuxtLink' })
          mutateUrl({ token, attr: 'href', base })
          mutateAttr({ token, from: 'href', to: 'to' })
        },
        hrefAlias: 'to',
        mutateLinkClose: ({ token }) => {
          mutateTag({ token, to: 'NuxtLink' })
        },
      }
    case 'vue':
    return {
      mutateLinkOpen: ({ token, base }) => {
        mutateTag({ token, to: 'RouterLink' })
        mutateUrl({ token, attr: 'href', base })
        mutateAttr({ token, from: 'href', to: 'to' })
      },
      hrefAlias: 'to',
      mutateLinkClose: ({ token }) => {
        mutateTag({ token, to: 'RouterLink' })
      }
    }
  }
}

function mutateTag ({ token, to }: { token: Token, to: string }) {
  token.tag = to
}

function mutateAttr({ token, from, to }: { token: Token, from: string, to: string }) {
  toAttr({ token, name: from })[0] = to
}

function mutateUrl ({ token, attr: a, base }: { token: Token, attr: string, base: string }) {
  const attr = toAttr({ token, name: a }),
        baseRegExp = new RegExp(`^${base}`)

  attr[1] = attr[1].replace(baseRegExp, '')
}

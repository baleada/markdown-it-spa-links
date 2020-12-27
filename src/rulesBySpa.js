import { findAttr } from './util/index.js'

export default [
  {
    name: 'inertia',
    link_open: ({ token, base }) => {
      mutateTag({ token, to: 'inertia-link' })
      mutateUrl({ token, attr: 'href', base })
    },
    hrefAlias: 'href',
    link_close: ({ token }) => {
      mutateTag({ token, to: 'inertia-link' })
    },
  },
  {
    name: 'next',
    link_open: ({ tokens, token, index, base }) => {
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
    link_close: ({ tokens, token, index }) => {
      mutateTag({ token, to: 'Link' })
    },
    customRendersClose: true,
    customRenderClose: rendered => `</a>${rendered}`,
  },
  {
    name: 'react',
    link_open: ({ token, base }) => {
      mutateTag({ token, to: 'Link' })
      mutateUrl({ token, attr: 'href', base })
      mutateAttr({ token, from: 'href', to: 'to' })
    },
    hrefAlias: 'to',
    link_close: ({ token }) => {
      mutateTag({ token, to: 'Link' })
    },
  },
  {
    name: 'nuxt',
    link_open: ({ token, base }) => {
      mutateTag({ token, to: 'NuxtLink' })
      mutateUrl({ token, attr: 'href', base })
      mutateAttr({ token, from: 'href', to: 'to' })
    },
    hrefAlias: 'to',
    link_close: ({ token }) => {
      mutateTag({ token, to: 'NuxtLink' })
    },
  },
  {
    name: 'vue',
    link_open: ({ token, base }) => {
      mutateTag({ token, to: 'RouterLink' })
      mutateUrl({ token, attr: 'href', base })
      mutateAttr({ token, from: 'href', to: 'to' })
    },
    hrefAlias: 'to',
    link_close: ({ token }) => {
      mutateTag({ token, to: 'RouterLink' })
    },
  },
]

// Util
function mutateTag ({ token, to }) {
  token.tag = to
}

function mutateAttr({ token, from, to }) {
  findAttr({ token, attr: from })[0] = to
}

function mutateUrl ({ token, attr: a, base }) {
  const attr = findAttr({ token, attr: a }),
        baseRegExp = new RegExp(`^${base}`)

  attr[1] = attr[1].replace(baseRegExp, '')
}

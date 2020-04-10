import { findAttr } from './util'

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
    mutatesRenderedOpen: true,
    mutateRenderedOpen: rendered => `${rendered}<a>`,
    hrefAlias: 'href',
    link_close: ({ tokens, token, index }) => {
      mutateTag({ token, to: 'Link' })
    },
    mutatesRenderedClose: true,
    mutateRenderedClose: rendered => `</a>${rendered}`,
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
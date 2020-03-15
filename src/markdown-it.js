const spaLinks = [
  {
    name: 'inertia',
    link_open: href => `<inertia-link href="${href}">`,
    link_close: () => `</inertia-link>`,
  },
  {
    name: 'next',
    link_open: href => `<Link href="${href}"><a>`,
    link_close: () => `</a></Link>`,
  },
  {
    name: 'nuxt',
    link_open: href => `<NuxtLink to="${href}">`,
    link_close: () => `</NuxtLink>`,
  },
  {
    name: 'react',
    link_open: href => `<Link to="${href}">`,
    link_close: () => `</Link>`,
  },
  {
    name: 'vue',
    link_open: href => `<RouterLink to="${href}">`,
    link_close: () => `</RouterLink>`,
  },
]

export default function(md, { spa, base }) {
  const validSpas = spaLinks.map(({ name }) => name)

  if (!validSpas.includes(spa)) {
    throw new Error('invalid SPA name')
  }

  const spaLink = spaLinks.find(({ name }) => name === spa)

  md.renderer.rules.link_open = renderLinkOpen({ md, spaLink, base })
  md.renderer.rules.link_close = renderLinkClose({ md, spaLink, base })
}

function renderLinkOpen ({ md, spaLink, base }) {
  return (tokens, index) => {
    const href = tokens[index].attrs.find(([ name ]) => name === 'href')[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    return isInternal
      ? spaLink.link_open(href)
      : `<a href="${href}">`
  }
}

function renderLinkClose ({ md, spaLink, base }) {
  return (tokens, index) => {
    const linkOpenToken = getLinkOpenToken(tokens, index),
          href = linkOpenToken.attrs.find(([ name ]) => name === 'href')[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href)

    return isInternal
      ? spaLink.link_close()
      : `</a>`
  }
}

function getLinkOpenToken (tokens, index) {
  return tokens
    .slice(0, index)
    .reverse()
    .find(({ type }) => type === 'link_open')
}

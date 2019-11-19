const spaLinks = [
  {
    name: 'nuxt',
    link_open: href => `<NuxtLink to="${href}">`,
    link_close: () => `</NuxtLink>`,
  },
  {
    name: 'vue',
    link_open: href => `<RouterLink to="${href}">`,
    link_close: () => `</RouterLink>`,
  },
  {
    name: 'next',
    link_open: href => `<Link href="${href}"><a>`,
    link_close: () => `</a></Link>`,
  },
  {
    name: 'sapper',
    link_open: href => `<a href="${href}">`,
    link_close: () => `</a>`,
  },
]

export default function(md, spa) {
  md.renderer.rules.link_open = renderLinkOpen(md, spa)
  md.renderer.rules.link_close = renderLinkClose(md, spa)
}

function renderLinkOpen (md, spa) {
  return (tokens, index) => {
    const href = tokens[index].attrs.find(([ name ]) => name === 'href')[1],
          isRoute = /^\//.test(href),
          spaLink = spaLinks.find(link => link.name === spa)

    return (spaLink && isRoute)
      ? spaLink.link_open(href)
      : `<a href="${href}">`
  }
}

function renderLinkClose (md, spa) {
  return (tokens, index) => {
    const linkOpenToken = getLinkOpenToken(tokens, index),
          href = linkOpenToken.attrs.find(([ name ]) => name === 'href')[1],
          isRoute = /^\//.test(href),
          spaLink = spaLinks.find(link => link.name === spa)

    return (spaLink && isRoute)
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

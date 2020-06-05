function findAttr({
  token,
  attr
}) {
  return token.attrs.find(({
    0: a
  }) => a === attr);
}

function getLinkOpenRule({
  md,
  spaLink,
  base,
  defaultRender
}) {
  return function (tokens, index, options, env, self) {
    const href = findAttr({
      token: tokens[index],
      attr: 'href'
    })[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href);

    if (isInternal) {
      spaLink.link_open({
        tokens,
        token: tokens[index],
        base,
        index
      });
    }

    return spaLink.mutatesRenderedOpen && isInternal ? spaLink.mutateRenderedOpen(defaultRender(tokens, index, options, env, self)) : defaultRender(tokens, index, options, env, self);
  };
}
function getLinkCloseRule({
  md,
  spaLink,
  base,
  defaultRender
}) {
  return function (tokens, index, options, env, self) {
    const linkOpenToken = getLinkOpenToken({
      tokens,
      index
    }),
          hrefAttr = findAttr({
      token: linkOpenToken,
      attr: spaLink.hrefAlias
    }) || findAttr({
      token: linkOpenToken,
      attr: 'href'
    }),
          href = hrefAttr[1],
          baseRegExp = base ? new RegExp(`^${base}`) : /$.+^/,
          isInternal = /^\//.test(href) || baseRegExp.test(href);

    if (isInternal) {
      spaLink.link_close({
        tokens,
        token: tokens[index],
        index
      });
    }

    return spaLink.mutatesRenderedClose && isInternal ? spaLink.mutateRenderedClose(defaultRender(tokens, index, options, env, self)) : defaultRender(tokens, index, options, env, self);
  };
} // Util

function getLinkOpenToken({
  tokens,
  index
}) {
  return tokens.slice(0, index).reverse().find(({
    type
  }) => type === 'link_open');
}

var spaLinks = [{
  name: 'inertia',
  link_open: ({
    token,
    base
  }) => {
    mutateTag({
      token,
      to: 'inertia-link'
    });
    mutateUrl({
      token,
      attr: 'href',
      base
    });
  },
  hrefAlias: 'href',
  link_close: ({
    token
  }) => {
    mutateTag({
      token,
      to: 'inertia-link'
    });
  }
}, {
  name: 'next',
  link_open: ({
    tokens,
    token,
    index,
    base
  }) => {
    mutateTag({
      token,
      to: 'Link'
    });
    mutateUrl({
      token,
      attr: 'href',
      base
    });
  },
  mutatesRenderedOpen: true,
  mutateRenderedOpen: rendered => `${rendered}<a>`,
  hrefAlias: 'href',
  link_close: ({
    tokens,
    token,
    index
  }) => {
    mutateTag({
      token,
      to: 'Link'
    });
  },
  mutatesRenderedClose: true,
  mutateRenderedClose: rendered => `</a>${rendered}`
}, {
  name: 'react',
  link_open: ({
    token,
    base
  }) => {
    mutateTag({
      token,
      to: 'Link'
    });
    mutateUrl({
      token,
      attr: 'href',
      base
    });
    mutateAttr({
      token,
      from: 'href',
      to: 'to'
    });
  },
  hrefAlias: 'to',
  link_close: ({
    token
  }) => {
    mutateTag({
      token,
      to: 'Link'
    });
  }
}, {
  name: 'nuxt',
  link_open: ({
    token,
    base
  }) => {
    mutateTag({
      token,
      to: 'NuxtLink'
    });
    mutateUrl({
      token,
      attr: 'href',
      base
    });
    mutateAttr({
      token,
      from: 'href',
      to: 'to'
    });
  },
  hrefAlias: 'to',
  link_close: ({
    token
  }) => {
    mutateTag({
      token,
      to: 'NuxtLink'
    });
  }
}, {
  name: 'vue',
  link_open: ({
    token,
    base
  }) => {
    mutateTag({
      token,
      to: 'RouterLink'
    });
    mutateUrl({
      token,
      attr: 'href',
      base
    });
    mutateAttr({
      token,
      from: 'href',
      to: 'to'
    });
  },
  hrefAlias: 'to',
  link_close: ({
    token
  }) => {
    mutateTag({
      token,
      to: 'RouterLink'
    });
  }
}]; // Util

function mutateTag({
  token,
  to
}) {
  token.tag = to;
}

function mutateAttr({
  token,
  from,
  to
}) {
  findAttr({
    token,
    attr: from
  })[0] = to;
}

function mutateUrl({
  token,
  attr: a,
  base
}) {
  const attr = findAttr({
    token,
    attr: a
  }),
        baseRegExp = new RegExp(`^${base}`);
  attr[1] = attr[1].replace(baseRegExp, '');
}

function markdownItSpaLinks(md, {
  spa,
  base
}) {
  const validSpas = spaLinks.map(({
    name
  }) => name);

  if (!validSpas.includes(spa)) {
    throw new Error('invalid SPA name');
  }

  const spaLink = spaLinks.find(({
    name
  }) => name === spa); // Adapted from https://github.com/crookedneighbor/markdown-it-link-attributes

  const defaultRender = md.renderer.rules.link_open || this.defaultRender;
  md.renderer.rules.link_open = getLinkOpenRule({
    md,
    spaLink,
    base,
    defaultRender
  });
  md.renderer.rules.link_close = getLinkCloseRule({
    md,
    spaLink,
    base,
    defaultRender
  });
}

markdownItSpaLinks.defaultRender = function (tokens, index, options, env, self) {
  return self.renderToken(tokens, index, options);
};

export default markdownItSpaLinks;

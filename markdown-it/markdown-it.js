import insertable from '@baleada/logic/factories/insertable';

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
  md.renderer.rules.link_open = renderLinkOpen({
    md,
    spaLink,
    base,
    defaultRender
  });
  md.renderer.rules.link_close = renderLinkClose({
    md,
    spaLink,
    base,
    defaultRender
  });
}

markdownItSpaLinks.defaultRender = function (tokens, index, options, env, self) {
  return self.renderToken(tokens, index, options);
};

const spaLinks = [{
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
}, // React
{
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
    const t = {
      type: 'html_inline',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 1,
      children: null,
      content: '<a>',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    };
    addToken({
      tokens,
      token: t,
      index: index + 1
    });
  },
  tokensAddedByOpen: 1,
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
    const t = {
      "type": "html_inline",
      "tag": "",
      "attrs": null,
      "map": null,
      "nesting": 0,
      "level": 1,
      "children": null,
      "content": "</a>",
      "markup": "",
      "info": "",
      "meta": null,
      "block": false,
      "hidden": false
    };
    console.log('close');
    addToken({
      tokens,
      token: t,
      index: index - 1
    });
  },
  tokensAddedByClose: 1
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
}, // Vue
{
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
}];

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

function findAttr({
  token,
  attr
}) {
  return token.attrs.find(({
    0: a
  }) => a === attr);
}

function addToken({
  tokens,
  token,
  index
}) {
  const withNewToken = insertable(tokens).insert({
    item: token,
    index
  });
  tokens.splice(0, tokens.length, ...withNewToken); // Mutate tokens in place
}

function renderLinkOpen({
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

    return defaultRender(tokens, index, options, env, self);
  };
}

function renderLinkClose({
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

    return defaultRender(tokens, index, options, env, self);
  };
}

function getLinkOpenToken({
  tokens,
  index
}) {
  return tokens.slice(0, index).reverse().find(({
    type
  }) => type === 'link_open');
}

export default markdownItSpaLinks;

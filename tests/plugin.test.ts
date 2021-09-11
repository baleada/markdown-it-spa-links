import { suite as createSuite } from 'uvu'
import * as assert from 'uvu/assert'
import { createMarkdownItSpaLinks } from '../src'
import MarkdownIt from 'markdown-it'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'

const suite = createSuite('plugin'),
      internal = '[internal](/internal)',
      external = '[external](https://example.com)'

suite.before.each(context => {
  context.md = new MarkdownIt({ html: true })
})

suite('plugin(md, { spa: <any> }) renders anchor for external links', context => {
  const vue = new MarkdownIt(),
        nuxt = new MarkdownIt(),
        next = new MarkdownIt({ html: true }),
        react = new MarkdownIt(),
        inertia = new MarkdownIt()

  vue.use(createMarkdownItSpaLinks({ spa: 'vue' }))
  nuxt.use(createMarkdownItSpaLinks({ spa: 'nuxt' }))
  next.use(createMarkdownItSpaLinks({ spa: 'next' }))
  react.use(createMarkdownItSpaLinks({ spa: 'react' }))
  inertia.use(createMarkdownItSpaLinks({ spa: 'inertia' }))

  const vueMarkup = vue.render(external),
        nuxtMarkup = nuxt.render(external),
        nextMarkup = next.render(external),
        reactMarkup = react.render(external),
        inertiaMarkup = inertia.render(external),
        result = [
          vueMarkup,
          nuxtMarkup,
          nextMarkup,
          reactMarkup,
          inertiaMarkup,
        ].every(markup => markup === '<p><a href="https://example.com">external</a></p>\n')

  assert.ok(result)
})

suite('plugin(md, { spa: <any>, base }) detects and replaces base url', context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'nuxt', base: 'https://base.com' }))
  const withBaseUrl = '[internal](https://base.com/internal)',
        markup = context.md.render(withBaseUrl)
  assert.is(markup, '<p><NuxtLink to="/internal">internal</NuxtLink></p>\n')
})

suite(`plugin(md, { spa: 'nuxt' }) renders NuxtLink for internal links`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'nuxt' }))
  const markup = context.md.render(internal)
  assert.is(markup, '<p><NuxtLink to="/internal">internal</NuxtLink></p>\n')
})

suite(`plugin(md, { spa: 'vue' }) renders RouterLink for internal links`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'vue' }))
  const markup = context.md.render(internal)
  assert.is(markup, '<p><RouterLink to="/internal">internal</RouterLink></p>\n')
})

suite(`plugin(md, { spa: 'next' }) renders Link > a for internal links`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'next' }))
  const markup = context.md.render(internal)
  assert.is(markup, '<p><Link href="/internal"><a>internal</a></Link></p>\n')
})

suite(`plugin(md, { spa: 'react' }) renders Link for internal links`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'react' }))
  const markup = context.md.render(internal)
  assert.is(markup, '<p><Link to="/internal">internal</Link></p>\n')
})

suite(`plugin(md, { spa: 'inertia' }) renders InertiaLink for internal links`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'inertia' }))
  const markup = context.md.render(internal)
  assert.is(markup, '<p><inertia-link href="/internal">internal</inertia-link></p>\n')
})

const otherPluginStub: [
  typeof MarkdownItLinkAttributes,
  MarkdownItLinkAttributes.Config
] = [
  MarkdownItLinkAttributes,
  { attrs: { rel: 'noopener' } }
]

suite('other plugin works (sanity check before next suite)', context => {
  context.md.use(...otherPluginStub)
  const markup = context.md.render(internal)
  assert.is(markup, '<p><a href="/internal" rel="noopener">internal</a></p>\n')
})

suite('plugin(md, { spa: <any except next> }) merges with other plugins that mutate link tokens', context => {
  const vue = new MarkdownIt(),
        nuxt = new MarkdownIt(),
        // next = new MarkdownIt({ html: true }),
        react = new MarkdownIt(),
        inertia = new MarkdownIt()

  vue.use(createMarkdownItSpaLinks({ spa: 'vue' }))
  vue.use(...otherPluginStub)

  nuxt.use(createMarkdownItSpaLinks({ spa: 'nuxt' }))
  nuxt.use(...otherPluginStub)

  // next.use(createMarkdownItSpaLinks({ spa: 'next' }))
  // next.use(...otherPluginStub)

  react.use(createMarkdownItSpaLinks({ spa: 'react' }))
  react.use(...otherPluginStub)

  inertia.use(createMarkdownItSpaLinks({ spa: 'inertia' }))
  inertia.use(...otherPluginStub)


  const vueMarkup = vue.render(external),
        nuxtMarkup = nuxt.render(external),
        // nextMarkup = next.render(external),
        reactMarkup = react.render(external),
        inertiaMarkup = inertia.render(external),
        result = [
          vueMarkup,
          nuxtMarkup,
          // nextMarkup,
          reactMarkup,
          inertiaMarkup,
        ].every(markup => markup.includes('rel="noopener"'))

  assert.ok(result)
})

suite(`plugin(md, { spa: 'next' }) merges with other plugins that mutate link tokens as long as SPA Links is first in the use chain`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'next' }))
  context.md.use(...otherPluginStub)
  const markup = context.md.render(internal)
  // TODO: Link should get href and supported props, <a> should get everything else
  assert.is(markup, '<p><Link href="/internal"><a rel="noopener">internal</a></Link></p>\n')
})

suite(`plugin(md, { spa: 'next' }) moves invalid Link attributes to the <a> tag`, context => {
  context.md.use(createMarkdownItSpaLinks({ spa: 'next' }))
  context.md.use(...otherPluginStub)
  const markup = context.md.render(internal)
  // TODO: Link should get href and supported props, <a> should get everything else
  assert.is(markup, '<p><Link href="/internal"><a rel="noopener">internal</a></Link></p>\n')
})

suite.run()

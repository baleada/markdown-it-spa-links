import test from 'ava'
import MarkdownIt from 'markdown-it'
import plugin from '../src'

const internal = '[internal](/internal)',
      external = '[external](https://example.com)'

test.beforeEach(t => {
  t.context.md = new MarkdownIt()
})

test('plugin(md, [invalid]) throws an error', t => {
  const invalid = () => t.context.md.use(plugin, { spa: 'poopy' })
  t.throws(invalid)
})

test('plugin(md, { spa: [any] }) renders anchor for external links', t => {
  const vue = new MarkdownIt(),
        nuxt = new MarkdownIt(),
        next = new MarkdownIt(),
        react = new MarkdownIt(),
        inertia = new MarkdownIt()

  vue.use(plugin, { spa: 'vue' })
  nuxt.use(plugin, { spa: 'nuxt' })
  next.use(plugin, { spa: 'next' })
  react.use(plugin, { spa: 'react' })
  inertia.use(plugin, { spa: 'inertia' })

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

  t.assert(result)
})

test('plugin(md, { spa: [any], base }) detects base url', t => {
  t.context.md.use(plugin, { spa: 'nuxt', base: 'https://base.com' })
  const withBaseUrl = '[internal](https://base.com/internal)',
        markup = t.context.md.render(withBaseUrl)
  t.is(markup, '<p><NuxtLink to="https://base.com/internal">internal</NuxtLink></p>\n')
})

test(`plugin(md, { spa: 'nuxt' }) renders NuxtLink for internal links`, t => {
  t.context.md.use(plugin, { spa: 'nuxt' })
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><NuxtLink to="/internal">internal</NuxtLink></p>\n')
})

test(`plugin(md, { spa: 'vue' }) renders RouterLink for internal links`, t => {
  t.context.md.use(plugin, { spa: 'vue' })
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><RouterLink to="/internal">internal</RouterLink></p>\n')
})

test(`plugin(md, { spa: 'next' }) renders Link > a for internal links`, t => {
  t.context.md.use(plugin, { spa: 'next' })
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><Link href="/internal"><a>internal</a></Link></p>\n')
})

test(`plugin(md, { spa: 'react' }) renders Link for internal links`, t => {
  t.context.md.use(plugin, { spa: 'react' })
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><Link to="/internal">internal</Link></p>\n')
})

test(`plugin(md, { spa: 'inertia' }) renders InertiaLink for internal links`, t => {
  t.context.md.use(plugin, { spa: 'inertia' })
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><inertia-link href="/internal">internal</inertia-link></p>\n')
})

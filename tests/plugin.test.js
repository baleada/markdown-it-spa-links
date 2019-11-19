import test from 'ava'
import MarkdownIt from 'markdown-it'
import plugin from '../src'

const internal = '[internal](/internal)',
      external = '[external](https://example.com)'

test.beforeEach(t => {
  t.context.md = new MarkdownIt()
})

test('plugin(md, [invalid]) throws an error', t => {
  const invalid = () => t.context.md.use(plugin, 'poopy')
  t.throws(invalid)
})

test('plugin(md, [any]) renders anchor for external links', t => {
  const vue = new MarkdownIt(),
        nuxt = new MarkdownIt(),
        next = new MarkdownIt(),
        sapper = new MarkdownIt()

  vue.use(plugin, 'vue')
  nuxt.use(plugin, 'nuxt')
  next.use(plugin, 'next')
  sapper.use(plugin, 'sapper')

  const vueMarkup = vue.render(external),
        nuxtMarkup = nuxt.render(external),
        nextMarkup = next.render(external),
        sapperMarkup = sapper.render(external),
        result = [
          vueMarkup,
          nuxtMarkup,
          nextMarkup,
          sapperMarkup,
        ].every(markup => markup === '<p><a href="https://example.com">external</a></p>\n')

  t.assert(result)
})

test(`plugin(md, 'nuxt') renders NuxtLink for internal links`, t => {
  t.context.md.use(plugin, 'nuxt')
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><NuxtLink to="/internal">internal</NuxtLink></p>\n')
})

test(`plugin(md, 'vue') renders RouterLink for internal links`, t => {
  t.context.md.use(plugin, 'vue')
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><RouterLink to="/internal">internal</RouterLink></p>\n')
})

test(`plugin(md, 'next') renders Link > a for internal links`, t => {
  t.context.md.use(plugin, 'next')
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><Link href="/internal"><a>internal</a></Link></p>\n')
})

test(`plugin(md, 'sapper') renders anchor for internal links`, t => {
  t.context.md.use(plugin, 'sapper')
  const markup = t.context.md.render(internal)
  t.is(markup, '<p><a href="/internal">internal</a></p>\n')
})

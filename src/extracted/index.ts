import type Token from 'markdown-it/lib/token'

export function toAttr ({ token, name }: { token: Token; name: string }): [string, string] {
  return token.attrs.find(({ 0: n }) => n === name)
}

export { createLinkMetadata } from './createLinkMetadata'
export type { LinkMetadata } from './createLinkMetadata'

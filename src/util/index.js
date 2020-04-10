export function findAttr ({ token, attr }) {
  return token.attrs.find(({ 0: a }) => a === attr)
}
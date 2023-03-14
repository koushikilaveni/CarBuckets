/**
 * Converts Number to comma delimited string ie. 10,000
 * @param { Number } number number to delimit
 */
export const delimit = number => new Intl.NumberFormat().format(number)

export function exists(thing) {
  const IS_UNDEFINED = typeof thing === 'undefined'
  const IS_NULL = thing === null
  if (IS_UNDEFINED || IS_NULL) return false

  const TYPE = typeof thing
  const IS_OBJECT = TYPE === 'object'
  const IS_STRING = TYPE === 'string'
  const IS_NUMBER = TYPE === 'number'
  const IS_ARRAY = Array.isArray(thing)

  if (IS_STRING || IS_ARRAY) return thing.length > 0
  if (IS_NUMBER) return String(thing).length > 0
  if (IS_OBJECT) return Object.keys(thing).length > 0

  return true
}

export function errorHandler(e) {
  console.dir(e)
}

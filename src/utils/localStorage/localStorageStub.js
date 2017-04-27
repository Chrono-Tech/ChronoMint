let store = {
  items: {},
  length: 0
}

function getItem (key) {
  return key in store.items ? store.items[key] : null
}

function setItem (key, value) {
  if (!(key in store.items)) {
    store.length++
  }
  store.items[key] = value
  return true
}

function removeItem (key) {
  if (key in store.items) {
    store.length--
    return delete store.items[key]
  }
  return false
}

function clear () {
  store.items = {}
  store.length = 0
  return true
}

const stub = {
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  clear: clear,
  get length () {
    return store.length
  }
}

export default stub

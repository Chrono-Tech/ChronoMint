import stub from './localStorageStub'

const ls = window ? window.localStorage : stub

function accessor (key, value) {
  return arguments.length === 1 ? get(key) : set(key, value)
}

function get (key) {
  return JSON.parse(ls.getItem(key))
}

function set (key, value) {
  try {
    ls.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

function remove (key) {
  return ls.removeItem(key)
}

function clear () {
  return ls.clear()
}

function getLength () {
  return ls.length
}

accessor.set = set
accessor.get = get
accessor.remove = remove
accessor.clear = clear
accessor.getLength = getLength

export default accessor

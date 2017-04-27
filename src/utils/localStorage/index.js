function accessor (key, value) {
  return arguments.length === 1 ? get(key) : set(key, value)
}

function get (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function set (key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

function remove (key) {
  return window.localStorage.removeItem(key)
}

function clear () {
  return window.localStorage.clear()
}

function getLength () {
  return window.localStorage.length
}

accessor.set = set
accessor.get = get
accessor.remove = remove
accessor.clear = clear
accessor.getLength = getLength

export default accessor

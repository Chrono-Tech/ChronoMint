function trim (name: string, maxLength: ?number) {
  console.log(name.length)
  return maxLength && name.length > maxLength ? `${name.slice(0, maxLength)}...` : name
}

export default trim

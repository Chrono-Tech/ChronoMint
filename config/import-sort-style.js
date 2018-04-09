/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/* eslint-disable */

function isComponent(imported) {
  return /^components\//g.test(imported.moduleName)
}

function isPage(imported) {
  return /^pages\//g.test(imported.moduleName)
}

function isDao(imported) {
  return /^dao\//g.test(imported.moduleName)
}

function isModels(imported) {
  return /^models\//g.test(imported.moduleName)
}

function isNetwork(imported) {
  return /^network\//g.test(imported.moduleName)
}

function isRedux(imported) {
  return /^redux\//g.test(imported.moduleName)
}

function isUtils(imported) {
  return /^utils\//g.test(imported.moduleName)
}

function isStyle(imported) {
  return /\.(?:css|less|scss)$/g.test(imported.moduleName)
}

function style(styleApi) {
  const {
    and,
    hasNoMember,
    hasMember,
    isAbsoluteModule,
    isRelativeModule,
    member,
    not,
    naturally,
    unicode
  } = styleApi

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: false },

    // import something "foo"
    { match: and(hasMember, isAbsoluteModule, not(isDao), not(isModels), not(isNetwork), not(isRedux), not(isComponent), not(isPage), not(isUtils)), sort: member(unicode) },
    { separator: false },

    // DAO > Models > Actions > Components > Utils  > Other > Styles

    // import something "dao/"
    { match: and(hasMember, isAbsoluteModule, isDao), sort: member(naturally) },
    { separator: false },

    // import something "models/"
    { match: and(hasMember, isAbsoluteModule, isModels), sort: member(naturally) },
    { separator: false },

    // import something "network/"
    { match: and(hasMember, isAbsoluteModule, isNetwork), sort: member(naturally) },
    { separator: false },

    // import something "redux/"
    { match: and(hasMember, isAbsoluteModule, isRedux), sort: member(naturally) },
    { separator: false },

    // import something "pages/"
    { match: and(hasMember, isAbsoluteModule, isPage), sort: member(naturally) },
    { separator: false },

    // import something "components/"
    { match: and(hasMember, isAbsoluteModule, isComponent), sort: member(naturally) },
    { separator: false },

    // import something "utils/"
    { match: and(hasMember, isAbsoluteModule, isUtils), sort: member(naturally) },
    { separator: false },

    // import something "./foo"
    { match: and(hasMember, isRelativeModule, not(isStyle)), sort: member(naturally) },
    { separator: true },

    // import "./foo.css"
    { match: and(isStyle, isRelativeModule) },
    { separator: true }

  ]
}

Object.defineProperty(exports, '__esModule', { value: true })

exports.default = style

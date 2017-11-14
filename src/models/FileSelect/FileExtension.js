// for decode types
// @see https://technet.microsoft.com/en-us/library/ee309278(office.12).aspx
// @see https://developer.mozilla.org/ru/docs/Web/HTTP/Basics_of_HTTP/MIME_types/%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9_%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA_%D1%82%D0%B8%D0%BF%D0%BE%D0%B2_MIME
// @see https://www.sitepoint.com/mime-types-complete-list/

export const DOC_MIME_TYPE = [
  'application/msword', // doc
  // 'application/msword', //dot
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', //dotx
  // 'application/vnd.ms-word.document.macroEnabled.12', //docm
  // 'application/vnd.ms-word.template.macroEnabled.12' //dotm
  'OpenDocument text document	application/vnd.oasis.opendocument.text', // .odt
  'application/rtf', // .rtf
  'text/plain',
  'text/*',
]

export const XLS_MIME_TYPE = [
  'application/vnd.ms-excel', // xls
  'application/vnd.ms-excel', // xlt
  // 'application/vnd.ms-excel', //xla
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', //.xltx
  'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
  'application/vnd.ms-excel.template.macroEnabled.12', // .xltm
  // 'application/vnd.ms-excel.addin.macroEnabled.12', //.xlam
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12', // .xlsb
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
]

export const PPT_MIME_TYPE = [
  'application/vnd.ms-powerpoint', // .ppt
  // 'application/vnd.ms-powerpoint', //.pot
  'application/vnd.ms-powerpoint', // .pps
  // 'application/vnd.ms-powerpoint', //.ppa
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // 'application/vnd.openxmlformats-officedocument.presentationml.template', //.potx
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow', // .ppsx
  // 'application/vnd.ms-powerpoint.addin.macroEnabled.12', //.ppam
  // 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', //.pptm
  // 'application/vnd.ms-powerpoint.template.macroEnabled.12', //.potm
  // 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12', //.ppsm,
  'application/vnd.oasis.opendocument.presentation', // .odp
  'application/vnd.oasis.opendocument.text', // odt
  // 'application/vnd.oasis.opendocument.text-template', // ott
  // 'application/vnd.oasis.opendocument.text-web', // oth
  // 'application/vnd.oasis.opendocument.text-master', // odm
  'application/vnd.oasis.opendocument.graphics', // odg
  // 'application/vnd.oasis.opendocument.graphics-template', // otg
  'application/vnd.oasis.opendocument.presentation', // odp
  // 'application/vnd.oasis.opendocument.presentation-template', // otp
  'application/vnd.oasis.opendocument.spreadsheet', // ods
  // 'application/vnd.oasis.opendocument.spreadsheet-template', // ots
  'application/vnd.oasis.opendocument.chart', // odc
  // 'application/vnd.oasis.opendocument.formula', // odf
  // 'application/vnd.oasis.opendocument.database', // odb
  'application/vnd.oasis.opendocument.image', // odi
]

export const PDF_MIME_TYPE = [
  'application/pdf',
]

export const IMAGE_MIME_TYPE = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
]

const SVG_MIME_TYPE = [
  'image/svg+xml',
]

// presets
export const ACCEPT_DOCS = [].concat(DOC_MIME_TYPE, XLS_MIME_TYPE, PPT_MIME_TYPE, PDF_MIME_TYPE, [
  '.doc',
  '.docx',
  '.odt',
  '.rtf',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.pps',
  '.ppsx',
])
export const ACCEPT_IMAGES = [].concat(IMAGE_MIME_TYPE, SVG_MIME_TYPE, [
  'image/*',
])
export const ACCEPT_ALL = ACCEPT_DOCS.concat(ACCEPT_IMAGES, [
  '*/*',
])

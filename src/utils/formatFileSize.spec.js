import formatFileSize from './formatFileSize'

describe('File size formatter', () => {
  it('check formatter work', () => {
    expect(formatFileSize(0)).toEqual('0 Bytes')
    expect(formatFileSize(NaN)).toEqual('0 Bytes')
    expect(formatFileSize(null)).toEqual('0 Bytes')
    expect(formatFileSize(undefined)).toEqual('0 Bytes')
    expect(formatFileSize('')).toEqual('0 Bytes')
    expect(formatFileSize(1024)).toEqual('1 KB')
    expect(formatFileSize(1048576)).toEqual('1 MB')
    expect(formatFileSize(1073741824)).toEqual('1 GB')
  })
})

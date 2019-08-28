// (1)
'use strict'
// (2)
const { BaseService } = require('..')

// (3)
module.exports = class Example extends BaseService {
  // (4)
  static get category() {
    return 'build'
  }

  // (5)
  static get route() {
    return {
      base: 'example',
      pattern: ':text',
    }
  }

  // (6)
  async handle({ text }) {
    return {
      label: 'example',
      message: text,
      color: 'blue',
    }
  }
}

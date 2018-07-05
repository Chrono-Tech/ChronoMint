import PropTypes from 'prop-types'
import { filterArrayByIndexMask } from 'src/utils'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

export default class SkillModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get code () {
    return Math.pow(2, this.index)
  }

  static valueOf (index) {
    return SKILLS_LIST[index]
  }

  static arrayValueOfMask (mask) {
    return filterArrayByIndexMask(SKILLS_LIST, mask)
  }

  static writeArrayToMask (array: SkillModel[]): Number {
    return array.reduce((mask, element) => (mask | element.code), 0)
  }
}

export const SKILLS_LIST = [
  new SkillModel({
    index: 0,
    name: 'Skill 1',
  }),
  new SkillModel({
    index: 1,
    name: 'Skill 2',
  }),
  new SkillModel({
    index: 2,
    name: 'Skill 3',
  }),
]

export const SKILL_ANY_MASK = Math.pow(2, SKILLS_LIST.length + 1) - 1

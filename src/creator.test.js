import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

describe('CreatorApp component', function() {

  beforeEach(() => {
    jest.resetModules()

    global.Materia = {
      CreatorCore: {
        start: jest.fn(),
      }
    }

    Enzyme.configure({ adapter: new Adapter() })
  })

  test('CreatorApp calls CreatorCore start', () => {
    const CreatorApp = require('./creator').default
    const props = {}

    expect(global.Materia.CreatorCore.start).toHaveBeenCalledTimes(1)
  })

  test('CreatorApp renders base code', () => {
    const CreatorApp = require('./creator').default
    const props = {}

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('CreatorApp renders branch code', () => {
    const CreatorApp = require('./creator').default
    const props = {
      init: true,
    }

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('CreatorApp renders branch code', () => {
    const CreatorApp = require('./creator').default
    const props = {
      init: true,
    }

		const tree = renderer.create(<CreatorApp {... props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('CreatorApp calls showIntro', () => {
    const CreatorApp = require('./creator').default
    const props = {
      init: false,
    }

    const component = shallow(<CreatorApp {... props}/>)
    component.instance().showIntro()
    expect(state.showIntro).toBeTruthy()
  })


})

import { createLocalVue, shallowMount } from '@vue/test-utils'

import TagTreeDetailPage from '@/pages/tag-tree/_id'
const localVue = createLocalVue()

describe('TagTreeDetailPage', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(TagTreeDetailPage, { localVue })
  })
  const treeObject = {
    tag_name: 'parent',
    tree_level: 0,
    children: [
      {
        tag_name: 'child1',
        tree_level: 1,
        children: [],
      },
      {
        tag_name: 'child2',
        tree_level: 1,
        children: [
          {
            tag_name: 'grandchild1',
            tree_level: 2,
            children: [],
          },
          {
            tag_name: 'grandchild2',
            tree_level: 2,
            children: [],
          },
          {
            tag_name: 'grandchild3',
            tree_level: 2,
            children: [],
          },
        ],
      },
      {
        tag_name: 'child3',
        tree_level: 1,
        children: [],
      },
      {
        tag_name: 'child4',
        tree_level: 1,
        children: [],
      },
    ],
  }
  const treeText = `parent
\tchild1
\tchild2
\t\tgrandchild1
\t\tgrandchild2
\t\tgrandchild3
\tchild3
\tchild4`
  test('convertTree2String', () => {
    expect(wrapper.vm.convertTree2String(treeObject)).toStrictEqual(treeText)
  })

  test('convertString2Tree', () => {
    expect(wrapper.vm.convertString2Tree(treeText)).toStrictEqual(treeObject)
  })

  const treeTextTooDeepChild = `parent
\t\tchild1
\t\tchild2`
  test('convertString2Tree failed parse', () => {
    expect(() => {
      wrapper.vm.convertString2Tree(treeTextTooDeepChild)
    }).toThrow('["1: Error: Failed to parse","2: Error: Failed to parse"]')
  })

  test('pushChildDeeply normal', () => {
    const parent = {
      tag_name: 'parent',
      children: [
        {
          children: [],
        },
      ],
    }
    const grandChild = {
      tag_name: 'grand child',
    }
    wrapper.vm.pushChildDeeply(grandChild, parent, 2)
    expect(parent).toStrictEqual({
      tag_name: 'parent',
      children: [
        {
          children: [
            {
              tag_name: 'grand child',
            },
          ],
        },
      ],
    })
  })

  test('pushChildDeeply too deep', () => {
    const parent = {
      tag_name: 'parent',
      children: [
        {
          children: [],
        },
      ],
    }
    const grandChild = {
      tag_name: 'grand child',
    }
    expect(() => {
      wrapper.vm.pushChildDeeply(grandChild, parent, 3)
    }).toThrow('Failed to parse')
  })
})

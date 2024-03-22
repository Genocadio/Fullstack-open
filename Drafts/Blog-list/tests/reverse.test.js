const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Canonical string reduction',
        author: '<NAME>',
        url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
        likes: 10,
        __v: 0
      }, {
        _id: '5a422aa71b54a676234d17fa',
        title: 'Canonical string reduction',
        author: '<NAME>',
        url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
        likes: 5,
        __v: 0
      }
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 15)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: '<NAME>',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: '<NAME>',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
      likes: 5,
      __v: 0
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: '<NAME>',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
      likes: 10,
      __v: 0
    })
  })
  test('returns null if the list is empty', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  }
  )
})

describe('most likes', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Canonical string reduction',
      author: '<NAME>',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: '<NAME>',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD831.html',
      likes: 5,
      __v: 0
    }
  ]

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: '<NAME>',
      likes: 15
    })
  })
  test('returns the total number of likes author has recieved', () => {
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result.likes, 15)
  }
  )
})

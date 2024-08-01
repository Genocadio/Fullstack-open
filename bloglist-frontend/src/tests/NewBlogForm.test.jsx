import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from '../components/NewBlogForm'

test('form calls handleNewBlog with correct details when a new blog is created', async () => {
  const mockHandleNewBlog = vi.fn()
  render(<NewBlogForm handleNewBlog={mockHandleNewBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByPlaceholderText('Enter title')
  const authorInput = screen.getByPlaceholderText('Enter author')
  const urlInput = screen.getByPlaceholderText('Enter URL')
  const createButton = screen.getByText('Create Blog')

  await user.type(titleInput, 'Testing React Forms')
  await user.type(authorInput, 'Jane Doe')
  await user.type(urlInput, 'http://example.com')
  await user.click(createButton)

  expect(mockHandleNewBlog).toHaveBeenCalledTimes(1)
  expect(mockHandleNewBlog).toHaveBeenCalledWith({
    title: 'Testing React Forms',
    author: 'Jane Doe',
    url: 'http://example.com',
    likes: 0,
  })
})

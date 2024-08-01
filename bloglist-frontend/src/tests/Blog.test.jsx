import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import userEvent from '@testing-library/user-event'

const blog = {
    title: 'Testing React components',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'johndoe',
      id: '1234567890',
    },
  }

test('renders title and author, but not URL or likes by default', () => {
   
    render(<Blog blog={blog}  onUpdate={() => {}} onDelete={() => {}} />)

    expect(screen.getByText('Testing React components John Doe')).toBeInTheDocument()
    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText('5 likes')).toBeNull()
  })

  test('renders URL and number of likes when the view button is clicked', async () => {

  
    render(<Blog blog={blog} onUpdate={() => {}} onDelete={() => {}} />)
  
    // Initially, the URL and number of likes should not be visible
    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText('5 likes')).toBeNull()
  
    // Simulate clicking the button to show details
    const button = screen.getByText('View')
    await userEvent.click(button)
  
    // After clicking the button, the URL and number of likes should be visible
    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText('5 likes')).toBeInTheDocument()
  })

  test('calls the like button event handler twice when clicked twice', async () => {
  
    const mockHandler = vi.fn()
  
    render(<Blog blog={blog} onUpdate={mockHandler} onDelete={() => {}} />)
  
    // Simulate clicking the button to show details
    const viewButton = screen.getByText('View')
    await userEvent.click(viewButton)
  
    // Simulate clicking the like button twice
    const likeButton = screen.getByText('Like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)
  
    // Check if the like button event handler was called twice
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
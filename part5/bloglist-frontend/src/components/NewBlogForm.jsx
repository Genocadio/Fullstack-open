import { useState } from 'react'

const NewBlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
      likes: Number(likes) || 0, // Ensure likes is a number, defaulting to 0
    }

    handleNewBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author"
            required
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
        </div>
        <button type="submit" className="create-button">Create Blog</button>
      </form>
    </div>
  )
}

export default NewBlogForm

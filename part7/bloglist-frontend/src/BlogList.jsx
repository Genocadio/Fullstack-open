import { useSelector } from 'react-redux'
import Blog from './components/Blog'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeBlogs } from './redux/blogsReducer'

const BlogList = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs || []) // Corrected logical OR
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch, user])

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList

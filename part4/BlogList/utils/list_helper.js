const dummy  =(blogs) => {
    return 1
}



const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    let maxLikes = -1
    let favorite = null

    for (const blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            favorite = blog;
        }
    }
    delete favorite._id
    delete favorite.url
    delete favorite.__v
    return favorite
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
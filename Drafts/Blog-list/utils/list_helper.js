const dummy = (blogs) => {
    return 1;
}


const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    let maxLikes = -1;
    let favorite = null;

    for (const blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes;
            favorite = blog;
        }
    }

    return favorite;
};

const totalLikes = (blogs) => {
    let total = 0;
    for (const blog of blogs) {
        total += blog.likes;
    }
    return total;
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }
    const likesByAuthor = {};
    for (const blog of blogs) {
        const author = blog.author;
        const likes = blog.likes;
        if (likesByAuthor[author]) {
            likesByAuthor[author] += likes;
        } else {
            likesByAuthor[author] = likes;
        }
    }
    let maxLikes = -1;
    let mostLikedAuthor = null;
    for (const author in likesByAuthor) {
        if (likesByAuthor[author] > maxLikes) {
            maxLikes = likesByAuthor[author];
            mostLikedAuthor = author;
        }
    }
    return {
        author: mostLikedAuthor,
        likes: maxLikes
    };
};
module.exports = {
    dummy,
    favoriteBlog,
    totalLikes,
    mostLikes
};
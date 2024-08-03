const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
        data: {
            username: 'gyves',
            name: 'geno yves',
            password: 'pass'
        }
    })
    await request.post('http://localhost:3001/api/users', {
        data: {
            username: 'yves',
            name: 'cadio yves',
            password: 'pass'
        }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'gyves')
      await page.fill('input[name="password"]', 'pass')
      await page.click('text=login')
      await page.waitForSelector('div', { text: 'geno yves logged in' })
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.fill('input[name="username"]', 'gyves')
      await page.fill('input[name="password"]', 'wrong')
      await page.click('text=login')
      await page.waitForSelector('div', { text: 'wrong username or password' })
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('gyves')
      await page.getByTestId('password').fill('pass')
      await page.getByRole('button', { name: 'login'}).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog'}).click()
      await page.fill('input[placeholder="Enter title"]', 'Test Blog Title');
      await page.fill('input[placeholder="Enter author"]', 'Test Author');
      await page.fill('input[placeholder="Enter URL"]', 'http://testurl.com')
      await page.click('button.create-button');
      await page.waitForSelector('div.blog-title-author');
      await expect(page.locator('div.blog-title-author')).toContainText('Test Blog Title');
      await expect(page.locator('div.blog-title-author')).toContainText('Test Author');
    })
    
    test('a blog can be liked', async ({ page }) => {

        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Test Blog Title');
        await page.fill('input[placeholder="Enter author"]', 'Test Author');
        await page.fill('input[placeholder="Enter URL"]', 'http://testurl.com');
        await page.click('button.create-button');
        await page.waitForSelector('div.blog-title-author');
        const blogLocator = page.locator('div.blog-title-author', { hasText: 'Test Blog Title Test Author' });
        await blogLocator.locator('button', { hasText: 'View' }).click();
        const likeButton = page.locator('[data-testid="likebutton"]');
        await expect(likeButton).toBeVisible();
        await likeButton.click()
        const likeCountLocator = page.locator('#likes-count');
        await expect(likeCountLocator).toHaveText(/1 likes/); 
    });
    
    test('a user can delete their blog', async ({ page }) => {
        
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Test Blog Title');
        await page.fill('input[placeholder="Enter author"]', 'Test Author');
        await page.fill('input[placeholder="Enter URL"]', 'http://testurl.com');
        await page.click('button.create-button');

        const viewButton = page.locator('div.blog-title-author').locator('button', { hasText: 'View' });
        await expect(viewButton).toBeVisible();
        await viewButton.click();

        page.on('dialog', async dialog => {
          expect(dialog.message()).toBe('Remove blog Test Blog Title by Test Author?');
          await dialog.accept(); 
        });

        const deleteButton = page.locator('button', { hasText: 'remove' });
        await deleteButton.click();

        const blogTitleLocator = page.locator('div.blog-title-author').locator('span').nth(0);
        await expect(blogTitleLocator).not.toBeVisible();
    });
      
    test('only the user who created the blog can see the delete button', async ({ page }) => {

        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Blog by User 1');
        await page.fill('input[placeholder="Enter author"]', 'User 1');
        await page.fill('input[placeholder="Enter URL"]', 'http://testurl1.com');
        await page.click('button.create-button');

        await page.click('button', { text: 'Logout' });

        await page.fill('input[name="username"]', 'yves');
        await page.fill('input[name="password"]', 'pass');
        await page.click('button[type="submit"]');

        const viewButton = page.locator('div.blog-title-author').locator('button', { hasText: 'View' });
        await expect(viewButton).toBeVisible();
        await viewButton.click() 
        const deleteButton = page.getByRole('button', { name: 'Delete' });
        await expect(deleteButton).not.toBeVisible();

    });
    
    async function likeBlogMultipleTimes(page, blogTitle, times = 3) {
  
        await page.waitForSelector('div.blog-title-author');
        const blogLocator = page.locator('div.blog-title-author', { hasText: blogTitle });
        await blogLocator.locator('button', { hasText: 'View' }).click();
        const likeButton = page.locator('[data-testid="likebutton"]');
        await expect(likeButton).toBeVisible();
        for (let i = 0; i < times; i++) {
          await likeButton.click();
          await page.waitForTimeout(1000);
        }
    }

    test('blogs are ordered by likes in descending order and delete button is visible only to owner', async ({ page }) => {

        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Blog with 10 Likes');
        await page.fill('input[placeholder="Enter author"]', 'Author 1');
        await page.fill('input[placeholder="Enter URL"]', 'http://example.com/blog1');
        await page.click('button.create-button');
      
 
        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Blog with 50 Likes');
        await page.fill('input[placeholder="Enter author"]', 'Author 2');
        await page.fill('input[placeholder="Enter URL"]', 'http://example.com/blog2');
        await page.click('button.create-button');
      

        await page.getByRole('button', { name: 'create new blog' }).click();
        await page.fill('input[placeholder="Enter title"]', 'Blog with 30 Likes');
        await page.fill('input[placeholder="Enter author"]', 'Author 3');
        await page.fill('input[placeholder="Enter URL"]', 'http://example.com/blog3');
        await page.click('button.create-button');
      

        await page.reload();
        await likeBlogMultipleTimes(page, 'Blog with 10 Likes', 2);
        await page.reload();
        await likeBlogMultipleTimes(page, 'Blog with 50 Likes', 1);
        await page.reload();

        await page.waitForSelector('div.blog-title-author');
    
 
        const blogs = page.locator('div.blog-title-author');
        const blogLikes = [];
    
        for (let i = 0; i < await blogs.count(); i++) {
            const blogTitle = await blogs.nth(i).innerText();
            const viewButton = blogs.nth(i).locator('button', { hasText: 'View' });
            

            await viewButton.click();
            await page.waitForSelector('p[data-testid="likes"]');
            const likeCountText = await page.locator('#likes-count').innerText();
            const likeCount = parseInt(likeCountText.split(' ')[0]);
            blogLikes.push({ title: blogTitle, likes: likeCount });
            await page.locator('button', { hasText: 'Hide' }).click();
        }
        const sortedBlogs = [...blogLikes].sort((a, b) => b.likes - a.likes);

        for (let i = 0; i < blogLikes.length; i++) {
            const blogTitle = await blogs.nth(i).innerText();
            expect(blogTitle).toBe(sortedBlogs[i].title);
        }
      
      });
  })


})
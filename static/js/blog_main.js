// <!-- copy -->
const ajax = (request) => {
    /*
    request 是一个 object，有如下属性
        method，请求的方法，string
        url，请求的路径，string
        data，请求发送的数据，如果是 GET 方法则没有这个值，string
        callback，响应回调，function
    */
    let r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const log = console.log.bind(console)

const templateBlog = (blog) => {
    let id = blog.id
    let title = blog.title
    let author = blog.author
    let d = new Date(blog.created_time * 1000)
    let time = d.toLocaleString()
    let t = `
        <div class="gua-blog-cell">
            <div class="">
                <a class="blog-title" href="/blog/${id}" data-id="${id}" target="_blank">
                    ${title}
                </a>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="blog-comments">
                <div class="new-comment">
                    <input class="comment-blog-id" type=hidden value="${id}">
                    <input class="comment-author" value="">
                    <input class="comment-content" value="">
                    <button class="comment-add">添加评论</button>
                </div>
            </div>
        </div>
    `
    return t
}

const insertBlogAll = (blogs) => {
    let html = ''
    for (let i = 0; i < blogs.length; i++) {
        let b = blogs[i]
        let t = templateBlog(b)
        html += t
    }
    // 把数据写入 .gua-blogs 中，直接用覆盖式写入
    let div = document.querySelector('.gua-blogs')
    div.innerHTML = html
}

const blogAll = () => {
    let request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: (response) => {
            let blogs = JSON.parse(response)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

const blogNew = (form) => {
    // 传给后端的数据只能传字符串
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/blog/add',
        contentType: 'application/json',
        data: data,
        callback: (response) => {
            let r = JSON.parse(response)
            // 应该把数据插入到 .gua-blogs 后面
            // appendBlog(r)
        }
    }
    ajax(request)
}

const commentNew = (form, callback) => {
    let data = JSON.stringify(form)
    let request = {
        method: 'POST',
        url: '/api/comment/add',
        contentType: 'application/json',
        data: data,
        callback: (response) => {
            let r = JSON.parse(response)
            callback(r)
        }
    }
    ajax(request)
}

const actionCommentAdd = (event) => {
    let self = event.target
    let form = self.closest('.new-comment')
    let blogId = form.querySelector('.comment-blog-id').value
    let author = form.querySelector('.comment-author').value
    let content = form.querySelector('.comment-content').value
    let data = {
        blog_id: blogId,
        author: author,
        content: content,
    }
    commentNew(data, (comment) => {
        log('new comment', comment)
    })
}

const e = (selector) => document.querySelector(selector)

const bindEvents = () => {
    // 绑定发表新博客事件
    let button = e('#id-button-submit')
    button.addEventListener('click', (event) => {
        // 得到用户填写的数据
        let form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
            mima: e('#id-input-mima').value,
        }
        // 用这个数据调用 blogNew 来创建一篇新博客
        blogNew(form)
    })

    document.body.addEventListener('click', (event) => {
        let self = event.target
        if (self.classList.contains('comment-add')) {
            log('comment')
            actionCommentAdd(event)
        }
    })
}

const __main = () => {
    // 载入博客列表
    blogAll()
    // 绑定事件
    bindEvents()
}

__main()

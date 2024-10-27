const fs = require('fs')

const commentFilePath = 'db/comment.json'

// 这是一个用来存储 comment 数据的对象
class ModelComment {
    constructor(form) {
        // || 是一种新的写法，在 js 圈子里太过流行，所以记住即可
        // a = b || c 意思是如果 b 会转成 false（比如 undefined, null），就把 c 赋值给 a
        this.author = form.author || ''
        this.content = form.content || ''
        this.blog_id = Number(form.blog_id) || 0
        // 生成一个 unix 时间，unix 时间是什么，上课会说
        this.created_time = Math.floor(new Date() / 1000)
    }
}

const loadData = () => {
    // 确保文件有内容，这里就不用处理文件不存在或者内容错误的情况了
    // 注意，一般都是这样不处理的
    let content = fs.readFileSync(commentFilePath, 'utf8')
    let data = JSON.parse(content)
    return data
}

const b = {
    data: loadData(),
}

b.all = function() {
    return this.data
}

b.new = function(form) {
    let m = new ModelComment(form)
    // console.log('new blog', form, m)
    // 设置新数据的 id
    let d = this.data[this.data.length - 1]
    if (d === undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把数据加入 this.data 数组
    this.data.push(m)
    // 把最新数据保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

b.save = function() {
    let s = JSON.stringify(this.data, null, 2)
    fs.writeFile(commentFilePath, s, (error) => {
        if (error !== null) {
            console.log('error', error)
        } else {
            console.log('保存成功')
        }
    })
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了（具体看使用方法）
module.exports = b

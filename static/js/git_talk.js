
const gitalk = new Gitalk({
clientID: 'Ov23liOr9Rgxvs5o9Zta',
clientSecret: '69397c6367606b8dbeff892243cde3a0e585f60c',
repo: 'blog',      // The repository of store comments,
owner: 'ykanade',
admin: ['ykanade'],
id: location.pathname,      // Ensure uniqueness and length less than 50
distractionFreeMode: false  // Facebook-like distraction free mode
})

gitalk.render('gitalk-container')


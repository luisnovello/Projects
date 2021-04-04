const BASE_URL = `https://strangers-things.herokuapp.com/api/2101-LSU-RM-WEB-PT`;
const API_TOKEN = `Bearer ${localStorage.getItem("apiToken")}`;
const postUser =  localStorage.getItem("username")
let myUserID = '';
let editPostData = '';
let messagePostId = '';

const fetchPosts = async () =>{
    try {
        const response = await fetch(`${BASE_URL}/posts`)
        const urlData = await response.json()
        const {
            data
        } = urlData
        const {
            posts
        } = data
        return posts
    } catch (error) {
        console.log(error)
    }
}

const fetchMyMessages = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${API_TOKEN}`
            },
          })
          const data = await response.json()
          const posts = await data.data
          const messages = posts.messages
          messages.forEach(post => {
              const messageUser = post.fromUser._id
              const eachMessage = renderMessages(post)
              if (messageUser !== myUserID){
                $('#received-messages').append(eachMessage)
              }else {
                $('#sent-messages').append(eachMessage)
              }
            })
    }
    catch (error) {
        console.log(error)
    }
}

const myPost = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_TOKEN}`
          },
        })
        const urlData = await response.json()
        const {
            data
        } = urlData
        const {
            posts
        } = data
        posts.forEach(post => {
            if (post.active === true) {
                const eachPost = renderPost(post)
                $('#users-posts-view').prepend(eachPost)
            }
        })
        addClickListeners()
        addEditListener()
        }
    catch (error) {

    }
}

const createNewPost = async (post) => {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${API_TOKEN}`
        },
        body: JSON.stringify({
            post
        })
    })
    const postSuccess = await response.json()
    const {
        data
    } = postSuccess
    location.reload()
}


const renderPost = (post) => {
    let postHtml = `
    <div class="post-card">
        <div class="post-head">
            <h3 class="post-title">${post.title}</h3>
        </div>
        <div class="post-body">
            <p class="post-location">Location ${post.location}</p>
            <p class="post-description">${post.description}</p>
            ${post.author.username ? `<p class="post-author">by -${post.author.username}</p>` : `<p class="post-author">by -${postUser}</p>`}
            <p class="post-price">Price: ${post.price}</p>
            <p class="post-deliver">Will Deliver: ${post.willDeliver}</p>
        </div>
        <div class="post-footer">
            ${postUser && post.author === myUserID ? '' : `<button class="message">Message</button>`}
            ${post.author._id === myUserID ? `<button class="delete">Delete</button>` : ""}
            ${post.author._id === myUserID ? `<button class="edit">Edit</button>` : ""}
            ${post.author === myUserID ? `<button class="delete">Delete</button>` : ""}
            ${post.author === myUserID ? `<button class="edit">Edit</button>` : ""}
        </div>
    </div>
    `
    postHtml = $(postHtml).data('post', post)
    return postHtml
}

const renderMessages = (post) => {
    const postTitle = post.post.title
    const messageSender = post.fromUser.username
    const messageContent = post.content

    let messageHtml = `
    <div class="message-card">
        <div class="message-title">Post Title: ${postTitle}</div>
        <div class="message-content">
            <div class="message-sender">Sender: ${messageSender}</div>
            <div>Message: ${messageContent}</div>
        </div>

    </div>
    `
    return messageHtml
}



const submitEditForm = async () => {
    const editTitle = $('#edit-post-title').val()
    const editDesc = $('#edit-post-description').val()
    const editPrice = $('#edit-post-price').val()
    const editLocal = $('#edit-post-location').val()
    const editwillDeliver = $("input[name='will-deliver']:checked").val()
    const postId = editPostData._id

    const post = {
        title: editTitle ? editTitle : editPostData.title,
        description: editDesc ? editDesc : editPostData.description,
        price: editPrice ? editPrice : editPostData.price,
        location: editLocal ? editLocal : editPostData.location,
        willDeliver: editwillDeliver ? editwillDeliver : editPostData.willDeliver,
    }

    try{
        const response = await fetch(`${BASE_URL}/posts/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${API_TOKEN}`
            },
            body: JSON.stringify({
                post
            })
        })
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

async function registerUser ( registerUsername, registerPassword ) {
    const registerUrl = `${BASE_URL}/users/register`
    const userinfo = {
        user: {
            username: registerUsername,
            password: registerPassword
    },
    }

    try{
        const response = await fetch(`${registerUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userinfo),
            })
        const { data, success } = await response.json()
        console.log(data)
        console.log(success)
        registerDiv(data , success)
        return success
    }catch (error) {
        console.log(error)
    }
}

const registerDiv = (data, success) => {
    try {
        if (success) {
            successReg = `
                <div id="success-reg">
                    <div id="success-message">${data.message}, Please login to continue</div>
                    <button id="okay">Okay</div>
                </div>
            `
            $('body').append(successReg)
        }
    } catch (error) {
        console.log(error)
    }
    $('#okay').on('click', function () {
        location.reload()
    })
}

async function loginUser ( loginUsername, loginPassword ) {
    const loginUrl = `${BASE_URL}/users/login`
    const userinfo = {
        user: {
            username: loginUsername,
            password: loginPassword
    },
    }
    try{
        const response = await fetch(`${loginUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(userinfo),
            })
        const { data, success } = await response.json()
        if (success){
            localStorage.setItem('apiToken', data.token)
            localStorage.setItem('username', loginUsername)
        }
        location.reload()
        return success
    }catch (error) {
        console.log(error)
    }
}

const renderAllPost = async () => {
    const posts = await fetchPosts();
    posts.forEach(post => {
        if (post.active === true) {
            const postAuthor = post.author.username
            postAuthor === postUser ? myUserID = post.author._id : ''
            const eachPost = renderPost(post)
            $('#all-post-view').prepend(eachPost)
        }
    addClickListeners()
    })
}

function addClickListeners() {
    $(".delete").on("click", async function () {
        const postParent = $(this).closest('.post-card')
        const postParentData = postParent.data('post')
        console.log(postParentData)
        const postId = postParentData._id

        try{
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${API_TOKEN}`
                }
            })
            const result = response.json()
            location.reload()
        } catch (error) {
            console.log(error)
        }
    })

    $(".edit").on("click", function () {
        editPostData = $(this).closest('.post-card').data('post')
        $('#edit-posts').removeClass("no-display")
    })

    $('.message').on('click', function () {
         messagePostId = $(this).closest('.post-card').data('post')
        $('#create-message').removeClass("no-display")
    })

    $('#edit-post-form').on('submit', async function (event) {
        event.preventDefault()
        submitEditForm()
    })
}

$('#new-post-form').on('submit', async (event) => {
    event.preventDefault()
    const newTitle = $('#new-post-title').val()
    const newDesc = $('#new-post-description').val()
    const newPrice = $('#new-post-price').val()
    const newLocal = $('#new-post-location').val()
    const willDeliver = $("input[name='will-deliver']:checked").val()

    const post = {
        title: newTitle,
        description: newDesc,
        price: newPrice,
        location: newLocal,
        willDeliver: willDeliver,
    }
    
    try {
        await createNewPost(post)
    }
    catch(error) {
        console.log(error)
    }

})

$('#create-message-form').on('submit', async function (event) {
    event.preventDefault()
    const messageText = $('#message-text').val()

    const message = {
        content: messageText
    }

    try{
        const response = await fetch(`${BASE_URL}/posts/${messagePostId._id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${API_TOKEN}`
            },
            body: JSON.stringify({
                message
            })
        })
        result = await response.json()
        console.log(result)
        console.log(result.success)
        }
    catch(error) {
        console.log(error)
    }
})

const buttonRenders = () => {
    if (postUser) {
        $('#login-button').addClass('no-display')
        $('#register-button').addClass('no-display')
        $('#users-messages-button').html(`${postUser}'s Messages`)
        $('#users-messages-button').removeClass('no-display')
        $('#users-posts-button').html(`${postUser}'s Post`)
        $('#users-posts-button').removeClass('no-display')
        $('#log-out-button').removeClass('no-display')
        $('#all-posts-button').removeClass('no-display')
        $('#new-post-button').removeClass('no-display')
    }
}

$('#login-button').on('click', function(event) {
    event.preventDefault()
    $('#login').removeClass('no-display')
    $('#register-user').addClass('no-display')
})

$('#register-button').on('click', function(event) {
    event.preventDefault()
    $('#register-user').removeClass('no-display')
    $('#login').addClass('no-display')
})

$('.close-window').on('click', () => {
    $('#login').addClass('no-display')
    $('#register-user').addClass('no-display')
    $('#edit-posts').addClass('no-display')
    $('#new-post-modal').addClass('no-display')
    $('#create-message').addClass('no-display')
})

$('#register-user-form').on('submit', async (event) => {
    event.preventDefault()
    const registerUsername = $('#reg-username').val()
    const registerPassword = $('#reg-password').val()
    await registerUser( registerUsername, registerPassword)
})

$('#login-form').on('submit', async (event) => {
    event.preventDefault()
    const loginUsername = $('#login-username').val()
    const loginPassword = $('#login-password').val()
    await loginUser( loginUsername, loginPassword)
    buttonRenders()
    $
})

$('#log-out-button').on('click', function () {
    localStorage.clear()
    location.reload()
})

$('#new-post-button').on('click', function() {
    $('#new-post-modal').removeClass('no-display')
})

$('#all-posts-button').on('click', async () => {
    $('#all-post-view').removeClass('no-display')
    $('#all-post-view').addClass('all-post-style')
    $('#users-posts-view').addClass('no-display')
    $('#users-posts-view').removeClass('users-posts-style')
    $('#user-messages-view').addClass('no-display')
    $('#user-messages-view').removeClass('user-messages-style')
})

$('#users-messages-button').on('click', async function () {
    $('#user-messages-view').removeClass('no-display')
    $('#user-messages-view').addClass('user-messages-style')
    $('#all-post-view').addClass('no-display')
    $('#all-post-view').removeClass('all-post-style')
    $('#users-posts-view').addClass('no-display')
    $('#users-posts-view').removeClass('users-posts-style')
})

$('#users-posts-button').on('click', async function () {
    $('#users-posts-view').removeClass('no-display')
    $('#users-posts-view').addClass('users-posts-style')
    $('#all-post-view').addClass('no-display')
    $('#all-post-view').removeClass('all-post-style')
    $('#user-messages-view').addClass('no-display')
    $('#user-messages-view').removeClass('user-messages-style')
})

async function startup () {
    if (postUser) {
        await renderAllPost()
        await fetchMyMessages()
        await myPost()
    } else {
        await renderAllPost()
    }
    buttonRenders()
}

startup()

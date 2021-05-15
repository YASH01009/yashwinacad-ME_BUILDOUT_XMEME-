var backend_url = 'https://yashwin-xmeme.herokuapp.com/memes'
var imgbb_api_url = 'https://api.imgbb.com/1/upload?key=3c7d3a285c732876a7e3a1b0c4f71542'

window.addEventListener('load', () => {
    postWithURL()
    getMemes()
})

// function to validate image url
function imageExists(url, callback) {
    var img = new Image()
    img.onload = () => callback(true)
    img.onerror = () => callback(false)
    img.src = url;
}

// function to support POST /memes API
function postMemes() {
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    let name = document.querySelector('#x3-name').value
    let url = document.querySelector('#x3-url').value
    let caption = document.querySelector('#x3-caption').value
    var x = (name == '') || (url == '') || (caption == '')
    // if none of the fiels are empty
    if(x == false) {
        imageExists(url, (exists) => {
            // if the url refers to valid image
            if(exists) {
                var raw = JSON.stringify({"name":name,"url":url,"caption":caption});
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                }
                var statusOk
                fetch(backend_url, requestOptions)
                .then(response => {
                    statusOk = response.ok
                    return response.text()
                })
                .then(result => {
                    console.log(result)
                    if(statusOk) {    
                        let meme_id = JSON.parse(result).id
                        alert(`Meme is posted with id #${meme_id}`)
                    } else 
                        alert(result)
                    getMemes()
                    postWithURL()
                })
                .catch(error => {
                    console.log('error', error)
                    alert(error)
                })
            } else
                alert('Please enter a valid url.')
        })
    } else 
        alert('Please fill in all details.')
}

// function to get url of an image and post the meme
function postMemesbyImg() {
    let fileInput = document.querySelector('#x3-by-img-url')
    let name = document.querySelector('#x3-by-img-name').value
    let caption = document.querySelector('#x3-by-img-caption').value
    let x = (name == '') || (caption == '') || (fileInput.value == '')
    if(x == false) {
        var formdata = new FormData()
        formdata.append("image", fileInput.files[0])
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        }
        fetch(imgbb_api_url, requestOptions)
        .then(response => response.text())
        .then(result => {
            var myHeaders = new Headers()
            myHeaders.append("Content-Type", "application/json")
            var raw = JSON.stringify({"name":name,"url":JSON.parse(result).data.display_url,"caption":caption})
            var irequestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }
            var statusOk
            fetch(backend_url, irequestOptions)
            .then(iresponse => {
                statusOk = iresponse.ok
                return iresponse.text()
            })
            .then(iresult => {
                console.log(iresult)
                if(statusOk) {    
                    let meme_id = JSON.parse(iresult).id
                    alert(`Meme is posted with id #${meme_id}`)
                } else 
                    alert(iresult)
                getMemes()
                postWithImg()
            })
            .catch(ierror => {
                console.log('error', ierror)
                alert(ierror)
            })
        })
        .catch(error => {
            console.log('error', error)
            alert(error)
        })
    } else 
        alert('Please fill in all details.')
}

// function to support GET /memes API
function getMemes() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    fetch(backend_url, requestOptions)
    .then(response => response.text())
    .then(result => {
        var x = document.querySelector('#portfolio')
        x.innerHTML = ''
        const display = (res) => {
            x.innerHTML += `<div class="w3-light-grey w3-padding-large w3-padding-32 w3-margin-top">
                               <h4 class="w3-left">Posted by: ${res.name}</h4>
                               <img id="x3-img-${res.id}" src="${res.url}" alt="XMeme" class="w3-image w3-margin-top" width="900" height="500">
                               <p class="w3-right">Meme id: #${res.id}<p>
                               <p id="x3-caption-${res.id}">${res.caption}</p>
                               <div type="button" class='w3-bar-item w3-button w3-dark-grey' onclick='displayEditMenu(${res.id})'>Edit Meme</div>
                               <div id='x3-edit-${res.id}'></div>
                           </div>`
        }
        JSON.parse(result).forEach(display)
    })
    .catch(error => {
        console.log('error', error)
        alert(error)
    })
}

// function to display from for editing a meme
function displayEditMenu(id) {
    var x = document.getElementById(`x3-edit-${id}`)
    x.innerHTML =  `<form id='x3-edit-form-${id}'>
                        <div class="w3-section">
                            <label>URL</label>
                            <input id="x3-edit-url-${id}" class="w3-input w3-border" type="text" required name="url">
                        </div>
                        <div class="w3-section">
                            <label>Caption</label>
                            <input id="x3-edit-caption-${id}" class="w3-input w3-border" type="text" required name="caption">
                        </div>
                        <button onclick='editMemes(${id})' class="w3-button w3-block w3-dark-grey" type="button">Edit Meme</button>
                    </form><br>`
}

// function to support /memes/<id> PATCH API
function editMemes(id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let url = document.querySelector(`#x3-edit-url-${id}`).value
    let caption = document.querySelector(`#x3-edit-caption-${id}`).value
    if(url == '')
        url = document.querySelector(`#x3-img-${id}`).getAttribute('src')
    if(caption == '')
        caption = document.querySelector(`#x3-caption-${id}`).textContent
    imageExists(url, (exists) =>  {
        if(exists) {
            var raw = JSON.stringify({"url":url,"caption":caption})
            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }
            var statusOk
            fetch(`${backend_url}/${id}`, requestOptions)
            .then(response => {
                statusOk = response.ok
                return response.text()
            })
            .then(result => {
                console.log(result)
                if(statusOk) {
                    let meme_id = JSON.parse(result).id
                    alert(`Meme with id #${meme_id} is edited`)
                } else 
                    alert(result)
                getMemes()
            })
            .catch(error => {
                console.log('error', error)
                alert(error)
            })
        } else 
           alert('Please enter a valid url.')
    })
    document.querySelector(`x3-edit-form-${id}`).getElementsByClassName.display = none
}

// function to support GET /memes/<id> API
function getSpecificMeme() {
    let x = document.querySelector('#x3-specific-id').value
    if(x == '') {
        console.log('Please fill all details.')
        alert('Please fill all details.')
    } else {
        let isNumeric = k => !Number.isNaN(k) 
        if(isNumeric(x)) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            }
            var statusOk
            fetch(`${backend_url}/${x}`, requestOptions)
            .then(response => {
                statusOk = response.ok
                return response.text()
            })
            .then(result => {
                if(statusOk) {
                    let res = JSON.parse(result)
                    document.querySelector('#x3-specific-meme').innerHTML = 
                        `<div class="w3-light-grey w3-padding-large w3-padding-32">
                            <h4 class="w3-left">Posted by: ${res.name}</h4>
                            <img src="${res.url}" alt="XMeme" class="w3-image w3-margin-top" width="400" height="500">
                            <p class="w3-left">${res.caption}</p>
                        </div>`
                } else
                    alert('The image with requested id does not exist.')
            })
            .catch(error => {
                console.log('error', error)
                alert(error)
            })
        }
    }
}

// function to display form to post using image url
function postWithURL() {
    document.querySelector('#x3-form').innerHTML = 
    `<div class="w3-section">
         <label>Name</label>
     <input id="x3-name" class="w3-input w3-border" type="text" required name="Name">
     </div>
     <div class="w3-section">
         <label>URL</label>
         <input id="x3-url" class="w3-input w3-border" type="text" required name="url">
     </div>
     <div class="w3-section">
         <label>Caption</label>
         <input id="x3-caption" class="w3-input w3-border" required name="caption">
     </div>
     <button onclick='postMemes()' class="w3-button w3-block w3-dark-grey" type="button">Send</button>`
}

// function to display form to post using image
function postWithImg() {
    document.querySelector('#x3-form').innerHTML = 
    `<div class="w3-section">
         <label>Name</label>
     <input id="x3-by-img-name" class="w3-input w3-border" type="text" required name="Name">
     </div>
     <div class="w3-section">
         <label>Upload Image</label>
         <input id="x3-by-img-url" class="w3-input w3-border" type="file" accept="image/*" required name="url">
     </div>
     <div class="w3-section">
         <label>Caption</label>
         <input id="x3-by-img-caption" class="w3-input w3-border" required name="caption">
     </div>
     <button onclick='postMemesbyImg()' class="w3-button w3-block w3-dark-grey" type="button">Send</button>`
}

let quotesList = document.querySelector("#quote-list")
let newQuoteForm = document.getElementById('new-quote-form')

fetch("http://localhost:3000/quotes?_embed=likes")
    .then(r => r.json())
    .then((quotesArray) => {
        quotesArray.forEach((quoteObj) =>{
            turnQuoteIntoHTML(quoteObj);
        })
    })

newQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let author = e.target["author"].value
    let quoteContent = e.target["quote"].value

        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                author: author,
                quote: quoteContent
            })
        })
            .then(r => r.json())
            .then((newQuote) => {
                
                newQuote.likes = []
                turnQuoteIntoHTML(newQuote);
            })
        
    })


    function turnQuoteIntoHTML(quoteObj){
        
        
        let outerElement = document.createElement("li")
        outerElement.className = "quote-card"
        //FILL THE OUTERMOST ELEMENT USING INNER HTML
        outerElement.innerHTML = `<blockquote class="blockquote">
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}{</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`
        
      quotesList.append(outerElement)

      
      let deleteButton = outerElement.querySelector(".btn-danger")
      let likeButton = outerElement.querySelector(".btn-success") 
      let likeSpan = outerElement.querySelector("span") 
      

      deleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes${quoteObj.id}`, {
            method: "DELETE"
        }) 
            .then(r => r.json())
            .then((response) => {
            outerElement.remove()
            })
      })

      likeButton.addEventListener("click", () => {

        fetch("http://localhost:3000/likes", {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                quoteId:quoteObj.id
            })
        })
            .then(r => r.json())
            .then((newLike) => {
                quoteObj.likes.push(newLike)
                likeSpan.innerText = quoteObj.likes.length
            })
      })
    }

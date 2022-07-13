class Book{
    constructor(title,author,isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}
// UI................................................................................
class UI{

    static dispalyBooks(){
        const books = store.getBook()
        books.forEach(function(book){
            UI.addBookToList(book)
        });

    }

    static addBookToList(book){

        const list = document.querySelector("#book-list")
        const row = document.createElement("tr")
        row.innerHTML=`
           <td>${book.title}</td>
           <td>${book.author}</td>
           <td>${book.isbn}</td>
           <td><a href='#' class = 'btn btn-danger btn-sm delete'>X</a></td>
        `
        list.appendChild(row)
    }

    static clearAllFields(){
        document.querySelector("#title").value = ""
        document.querySelector("#author").value = ""
        document.querySelector("#isbn").value = ""
    }

    static alertMessage(message,classes){
        const div = document.createElement("div")
        div.className =`alert alert-${classes}`
        div.appendChild(document.createTextNode(message)) 
        const form = document.querySelector("#book-form") 
        const container = document.querySelector(".container")
        container.insertBefore(div,form)
        setTimeout(function(){
            document.querySelector(".alert").remove()
        },3000)
    }

    static deleteBook(el){
        if(el.classList.contains("delete")){
            if(confirm("Are you sure to delete?")){
                el.parentElement.parentElement.remove()
                store.removeBook(e.target.parentElement.previousElementSibling.textContent)
            }
        }
    }

}// End of  UI.............................................................

// storage work...............................................................
class store{
    // Check if same isbn exist...................
    static checkISBN(isbn){
        let a =0
        const books = store.getBook()
        books.forEach((book,index)=>{
             if(book.isbn == isbn){
                UI.alertMessage("Aleardy exist ISBN.","primary")
                a =1
            }
        })
        return a
}
// get books from the storage......................
    static getBook(){
        let books
        if(localStorage.getItem("books") === null){
            books=[]
            
        }else{
            books= JSON.parse(localStorage.getItem("books"))
        }
        return books
    }
//Add book to storage....................
    static addBook(book){
        const books = store.getBook()
        books.push(book)
        localStorage.setItem("books",JSON.stringify(books))
    }
// Remove book from the storage...............
    static removeBook(isbn){
        const books = store.getBook()
        books.forEach((book,index)=>{
            if(book.isbn == isbn){
                books.splice(index,1)
            }
        localStorage.setItem("books",JSON.stringify(books))
        })
    }
}// end of store..................

//event listner....................................................
document.querySelector("#book-form").addEventListener("submit", function(e){
    e.preventDefault()
    const title = document.querySelector("#title").value
    const author = document.querySelector("#author").value
    const isbn = document.querySelector("#isbn").value
    let result = isbn.trim()
    if(title == ''|| author == '' || isbn == ''){
        UI.alertMessage("Please fill all the fields","danger")
    }else{
        const book = new Book(title,author,result)
        if(store.checkISBN(book.isbn) == 0){
            UI.addBookToList(book)
            UI.clearAllFields()
            UI.alertMessage("Book Added Successfully!!!","success")
            store.addBook(book)
        }
    }
})

// Delete book..............................................................
document.querySelector("#book-list").addEventListener("click", function(e){
    UI.deleteBook(e.target)
    
})

// Get books from local storage each time the page load.................................................
document.addEventListener("DOMContentLoaded",UI.dispalyBooks)
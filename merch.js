// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { get, set, update, ref, getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7IaUJ-Zqa_ooOq4fI02uuOJJyZ_in5q0",
  authDomain: "stagefright-8aa66.firebaseapp.com",
  projectId: "stagefright-8aa66",
  storageBucket: "stagefright-8aa66.firebasestorage.app",
  messagingSenderId: "507487855236",
  appId: "1:507487855236:web:31f9b5392f14a6883118d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const cart_button = document.getElementById("cart_button")
const cart_div = document.getElementById("cart")
const clear_button = document.getElementById("clear_button")
const order_button = document.getElementById("order_button")

function display_cart(){
    cart_div.textContent = ""
    if(localStorage["cart"] != undefined){
        let cart = JSON.parse(localStorage["cart"])
        let keys = Object.keys(cart)
        let values = Object.values(cart)
        let total = 0.0
        cart_div.textContent = ""
        for(let i = 0; i < keys.length; i++){
            let quantity = values[i]["quantity"]
            let price = values[i]["quantity"]*values[i]["price"]
            let line_div = document.createElement("div")
            line_div.classList.add("cart_line")
            let quantity_input = document.createElement("input")
            quantity_input.style.width = "50px"
            quantity_input.style.textAlign = "center"
            quantity_input.type = "number"
            quantity_input.min = 0
            quantity_input.value = values[i]["quantity"]
            quantity_input.addEventListener("change", function(){
                if(quantity_input.value == 0){
                    delete cart[keys[i]]
                } else {
                    cart[keys[i]]["quantity"] = quantity + (quantity_input.value - quantity)
                }
                localStorage["cart"] = JSON.stringify(cart)
                display_cart()
            })
            line_div.appendChild(quantity_input)
            let line_text = document.createElement("div")
            line_text.textContent = values[i]["item_name"] + "...............$" + String(price.toFixed(2))
            line_div.appendChild(line_text)
            cart_div.appendChild(line_div)
            total += price
        }
        let total_div = document.createElement("div")
        total_div.textContent = "Total: $" + total.toFixed(2)
        total_div.id = "total_label"
        cart_div.appendChild(total_div)
    } else {
        cart_div.textContent = "Your cart is empty!"
    }
}

window.addEventListener("load", function(){
    let col = 1
    get(ref(db, "products/merch")).then(function(snapshot){
        let products_data = snapshot.val()
        let keys = Object.keys(products_data)
        let values = Object.values(products_data)
        for(let i = 0; i < keys.length; i++){
            let product_listing = document.createElement("div")
            product_listing.classList.add("card")
            product_listing.id = keys[i]
            product_listing.style.marginBottom = "20px"
            let product_image = document.createElement("img")
            product_image.classList.add("card-img-top")
            if(values[i]["image"] != undefined){
                product_image.src = values[i]["image"]
            } 
            product_image.alt = values[i]["item_name"]
            product_listing.appendChild(product_image)
            let product_listing_content = document.createElement("div") 
            product_listing_content.classList.add("card-body")
            product_listing.appendChild(product_listing_content)
            let product_name = document.createElement("h5")
            product_name.classList.add("card-title")
            product_name.textContent = values[i]["item_name"]
            product_listing_content.appendChild(product_name)
            let product_price = document.createElement("p")
            product_price.classList.add("card-text")
            product_price.textContent = "$" + values[i]["price"]
            product_listing_content.appendChild(product_price)
            let product_buy_button = document.createElement("button")
            product_buy_button.classList.add("btn-success")
            product_buy_button.classList.add("btn")
            product_buy_button.textContent = "Add to cart"
            product_listing_content.appendChild(product_buy_button)
            product_buy_button.addEventListener("click", function(){
                let cart = {}
                if(localStorage["cart"] != undefined){
                    cart = JSON.parse(localStorage["cart"])
                }
                if(cart[keys[i]] != undefined){
                    cart[keys[i]]["quantity"] += 1
                } else {
                    cart[keys[i]] = {
                        "item_name" : values[i]["item_name"],
                        "price": values[i]["price"],
                        "quantity": 1
                    }
                }
                localStorage["cart"] = JSON.stringify(cart)
                console.log(cart)
            })
            document.getElementById("col"+col).appendChild(product_listing)
            if(col == 3){
                col = 1
            } else {
                col += 1
            }
        }
    }).catch(function(err){alert("Error: " + err)})
})

cart_button.addEventListener("click", function(){
    display_cart()
})

order_button.addEventListener("click", function(e){
    e.preventDefault()
    send_email("Order", "You've ordered... something")
})

clear_button.addEventListener("click", function(){
    if(localStorage["cart"] != undefined){
        localStorage.removeItem("cart")
    }
    display_cart()
})

/* SmtpJS.com - v3.0.0 */
var Email = {
    send: function (a) {
        return new Promise(function (resolve, reject) {
            a.nocache = Math.floor(1e6 * Math.random() + 1);
            a.Action = "Send";
            var json = JSON.stringify(a);
            Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", json, function (response) {
                resolve(response);
            });
        });
    },
    ajaxPost: function (url, data, callback) {
        var request = Email.createCORSRequest("POST", url);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onload = function () {
            var response = request.responseText;
            if (callback != null) callback(response);
        };
        request.send(data);
    },
    ajax: function (url, callback) {
        var request = Email.createCORSRequest("GET", url);
        request.onload = function () {
            var response = request.responseText;
            if (callback != null) callback(response);
        };
        request.send();
    },
    createCORSRequest: function (method, url) {
        var request = new XMLHttpRequest();
        if ("withCredentials" in request) {
            request.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            request = new XDomainRequest();
            request.open(method, url);
        } else {
            request = null;
        }
        return request;
    }
};

function send_email(subject, message){
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "stagefrightbandinbox@gmail.com",
        Password : "C52E2686F30B4CD492367B323A7216F01BD5",
        To : "stagefrightbandinbox@gmail.com",
        From : "stagefrightbandinbox@gmail.com",
        Subject : subject,
        Body : message,
        Port: 587
    }).then(
        message => alert(message)
    );
}


// Adding Items
const id_input = document.getElementById("id_input")
const name_input = document.getElementById("name_input")
const price_input = document.getElementById("price_input")
const quantity_input = document.getElementById("quantity_input")
const submit_button = document.getElementById("add_product_button")

submit_button.addEventListener("click", function(){
    let id = id_input.value
    let name = name_input.value
    let price = price_input.value
    let quantity = quantity_input.value

    if(id == ""){
        id = "0000"
    }

    set(ref(db, "products/merch/"+id), {
        item_name: name,
        price: price,
        quantity: quantity
    }).then(function(){
        alert("Product Successfully Added!")
    }).catch(function(err){
        alert(err)
    })
})
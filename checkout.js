// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { get, update, ref, getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
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

const product_name = document.getElementById("product_name")
const product_price = document.getElementById("product_price")
const product_quantity = document.getElementById("product_quantity")
const personalinfo_section = document.getElementById("personal_information")
const address_section = document.getElementById("billing_address")
const order_button = document.getElementById("order_button")

let product_id = null
let product_data = null
let product_type = null

function display_product(product_info){
    product_name.textContent = "Product Name: " + product_info["item_name"]
    product_price.textContent = "Product Price: " + product_info["price"]
    product_quantity.textContent = "Product Quantity: " + product_info["quantity"] 
}

window.addEventListener("load", function(){
    if(sessionStorage["product_to_buy"] != undefined){
        product_id = "0001"
        //let product_id = sessionStorage["product_to_buy"]
        get(ref(db, "products/tickets/" + product_id)).then(function(snapshot){
            product_data = snapshot.val()
            if(product_data == null){
                get(ref(db, "products/merch/" + product_id)).then(function(snapshot){
                    product_data = snapshot.val()
                    if(product_data == null){
                        console.log("Product Not Found.")
                    } else {
                        product_type = "merch"
                        address_section.style.display = "block"
                        display_product(product_data)
                    }
                }).catch(function(err){alert("Error: " + err)})
            } else {
                product_type = "tickets"
                display_product(product_data)
            }
        }).catch(function(err){alert("Error: " + err)})
    } else {
        //location.href = "index.html"
    }
})

order_button.addEventListener("click", function(e){
    e.preventDefault()
    get(ref(db, "products/"+product_type+"/"+product_id)).then(function(snapshot){
        let live_product_quantity = snapshot.val()["quantity"]
        if(live_product_quantity > 0){
            update(ref(db, "products/"+product_type+"/"+product_id), {
                quantity: live_product_quantity - 1
            }).then(function(){
                alert("Order successfully placed! Check your inbox for a confirmation email.")
                location.reload()
            }).catch(function(err){alert("Error: " + err)})
        } else {
            alert("This item is now sold out. Sorry!")
            location.href = "index.html"
        }
    }).catch(function(err){alert("Error: " + err)})
})
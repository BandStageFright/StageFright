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

let products_data = null
let cart = {}

const cart_button = document.getElementById("cart_button")
const order_button = document.getElementById("order_button")

window.addEventListener("load", function(){
    get(ref(db, "products/merch")).then(function(snapshot){
        products_data = snapshot.val()
        let keys = Object.keys(products_data)
        let values = Object.values(products_data)
        for(let i = 0; i < keys.length; i++){
            let product_listing = document.createElement("button")
            product_listing.id = keys[i]
            product_listing.textContent = values[i]["item_name"]
            product_listing.addEventListener("click", function(){
                if(cart[keys[i]] != undefined){
                    cart[keys[i]]["quantity"] += 1
                } else {
                    cart[keys[i]] = {
                        "product_name" : values[i]["item_name"],
                        "quantity": 1
                    }
                }
                console.log(cart)
            })
            document.body.appendChild(product_listing)
        }
    }).catch(function(err){alert("Error: " + err)})
})

order_button.addEventListener("click", function(e){
    e.preventDefault()
    get(ref(db, "products/merch/"+product_id)).then(function(snapshot){
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
            location.href = "merch.html"
        }
    }).catch(function(err){alert("Error: " + err)})
})
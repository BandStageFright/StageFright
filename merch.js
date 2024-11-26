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

    send_email("Order", "You've ordered... something")
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

/*
TODO:
-> Configure appscript trigger to go every minute
-> Setup checkout system with cart and stuff
-> Make sure subject line follows the format: 'Order-email'
-> More shop stuff
*/

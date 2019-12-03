var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var offer_to_respond =  document.getElementById("offer to respond");
var button = document.getElementById("button");
var button_acc = document.getElementById("button_acc");
var button_rej = document.getElementById("button_rej");


var make_offer = document.getElementById("make offer");
var waiting = document.getElementById("waiting");
var respond_offer = document.getElementById("respond offer");
waiting.style.display = "none"
var index = -1
var round = 1;
var offer = -404;

function show(layout){
    waiting.style.display = "none"
    make_offer.style.display = "none"
    respond_offer.style.display = "none"

    if(layout == "waiting"){
        waiting.style.display = "block"
    }
    if(layout == "make offer"){
        make_offer.style.display = "block"
    }
    if(layout == "respond offer"){
        respond_offer.style.display = "block"
    }
}


var ID = undefined;
var users = undefined;
var offers = undefined;

show("make offer")

function display_text(slider_value){
    return 'You get ' + slider_value + "% - They get " + (100 - slider_value) + "%";
}

output.innerHTML = display_text(slider.value); // Display the default slider value


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = display_text(this.value)
}

button.onclick = function() {
    var slider = document.getElementById("myRange");
    publishOffer(slider.value, ID);
}


function send_offer_response(value){
    offer.v.status = value;
    firebase.database().ref('/offers/' + offer.k).set(offer.v);
    show("waiting")
}


button_acc.onclick = function() {
    send_offer_response("accepted")
}

button_rej.onclick = function() {
    send_offer_response("rejected")
}


function publishOffer(offer, id) {
    firebase.database().ref('offers/'+id).set({
        offer: offer,
        status: "no-reponse"
    })
    console.log('sent offer:' + offer);
    show("respond offer")
    get_offer()
}

function make_id(){
    return firebase.database().ref('users/').push({
        user:'IAMUSER'
    }).then(function(x){
        console.log(x.key)
        ID = x.key
    });
}

make_id()

function get_offer() {
    firebase.database().ref('/offers/').once('value').then(function(snapshot) {
        console.log(snapshot.val());   
        offers = snapshot.val()
        index = Object.keys(offers).indexOf(ID)
        keys = Object.keys(offers);
        values  = Object.values(offers);
        let offer_index = (index + round - 2 + keys.length) % keys.length 
        offer = {k: keys[offer_index], v: values[offer_index]}
        offer_to_respond.innerHTML = display_text(100-offer.v.offer)
    })
}

function get_users(){
    firebase.database().ref('users/').once('value').then(function(x){
        console.log(x.val())
        users = x.val()
        index = Object.keys(users).indexOf(ID)
    });
}


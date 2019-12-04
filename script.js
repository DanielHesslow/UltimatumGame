var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var offer_to_respond =  document.getElementById("offer to respond");
var button = document.getElementById("button");
var button_acc = document.getElementById("button_acc");
var button_rej = document.getElementById("button_rej");
var button_next = document.getElementById("button_next");
var button_reset = document.getElementById("button_reset");

var admin_div = document.getElementById("admin");
//var admin_div = document.getElementById("admin");
var respondents = document.getElementById("respondents");

var make_offer = document.getElementById("make offer");
var waiting = document.getElementById("waiting");
var wait_text = document.getElementById("waiting");
var respond_offer = document.getElementById("respond offer");
waiting.style.display = "none"
var index = -1
var round = 0;
var offer = -404;


get_round()

var timer = null;
function show(layout){
    waiting.style.display = "none"
    make_offer.style.display = "none"
    respond_offer.style.display = "none"
    admin_div.style.display = "none"
    if(timer != null) clearInterval(timer)

    if(layout == "waiting"){
        waiting.style.display = "block"
        wait_text.innerHTML = "Waiting...."
        timer=setInterval(get_round_and_response, 1000);
    }
    if(layout == "make offer"){
        slider.value = 50
        output.innerHTML = display_text(slider.value)
        make_offer.style.display = "block"
        timer=setInterval(get_round, 1000);
    }
    if(layout == "respond offer"){
        respond_offer.style.display = "block"
        timer=setInterval(get_round, 1000);
        get_offer()
    }
    if(layout == "admin")
    {
        admin_div.style.display = "block"
        timer=setInterval(get_num_offer, 1000);
    }
}

function get_response(){
    firebase.database().ref('/offers/'+ real_round()+ "/" + ID).once('value').then(function(snapshot) {
        status = snapshot.val().status
        if(status !== 'no-response'){
            wait_text.innerHTML = "Your offer was: " + status + "!"
        }
        else{
            wait_text.innerHTML = "Waiting...."
        }
    })
}


function get_round_and_response(){
    get_round()
    get_response()
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
    firebase.database().ref('/offers/'+ real_round()+ "/" + offer.k).set(offer.v);
    show("waiting")
}


button_acc.onclick = function() {
    send_offer_response("accepted")
}

button_rej.onclick = function() {
    send_offer_response("rejected")
}

button_next.onclick = function() {
    round += 1;
    firebase.database().ref('round').set(round);
}

function set_round(r)
{   
    round = r
    firebase.database().ref('round').set(round);
}

button_reset.onclick = function()
{
    firebase.database().ref('offers/').remove();
    firebase.database().ref('users').remove();
    round = 0;
    firebase.database().ref('round').set(round);
}

function publishOffer(offer, id) {
    firebase.database().ref('offers/'+ real_round() + "/" +id).set({
        offer: offer,
        status: "no-response"
    })
    console.log('sent offer:' + offer);
    show("waiting")
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


function real_round()
{
    return ~~(round /2);
}


function get_offer() {
    firebase.database().ref('/offers/'+ real_round()+ "/").once('value').then(function(snapshot) {
        console.log(snapshot.val());   
        offers = snapshot.val()
        index = Object.keys(offers).indexOf(ID)
        keys = Object.keys(offers);
        values  = Object.values(offers);
        let offer_index = (index + real_round() - 1 + keys.length) % keys.length 
        offer = {k: keys[offer_index], v: values[offer_index]}
        offer_to_respond.innerHTML = display_text(100-offer.v.offer)
    })
}

function get_num_offer() {
    firebase.database().ref('/offers/' + real_round()+ "/").once('value').then(function(snapshot) {
        offers = snapshot.val()
        if(offers != null)
        {
            index = Object.keys(offers).indexOf(ID)
            keys = Object.keys(offers);
            values  = Object.values(offers);
            if(round % 2 == 0)
            {
                respondents.innerHTML = "Number of responses:" + keys.length
            }
            else{
                var count = values.filter((obj) => obj.status !== "no-response").length;
                respondents.innerHTML = "Number of responses:" + count
            }


        }
        else{
            respondents.innerHTML = "Number of responses:" + 0
        }
    })


}

function get_round(){
    firebase.database().ref('round').once('value').then(function(snapshot) {
        if(snapshot.val() != round){
            round = snapshot.val()
            if(round % 2 == 0){
                show("make offer")
            }
            else {
                show("respond offer")
            }
        }
    })
}

function get_users(){
    firebase.database().ref('users/').once('value').then(function(x){
        console.log(x.val())
        users = x.val()
        index = Object.keys(users).indexOf(ID)
    });
}


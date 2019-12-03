var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var button = document.getElementById("button");
var ID = undefined;

function display_text(slider_value){
    return 'Keep ' + slider_value + "% - Give " + (100 - slider_value) + "%";
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

function publishOffer(offer, id) {
    firebase.database().ref('offers/'+id).set({
        offer
    })
    console.log('sent offer:' + offer);
}

function make_id(){
    firebase.database().ref('users/').push({
        user:'IAMUSER'
    }).then(function(x){
        console.log(x.key)
        ID = x.key
    });
}

make_id()

function get_offers() {
    firebase.database().ref('/offers/-1').once('value').then(function(snapshot) {
        console.log(snapshot.val());   
    })
}

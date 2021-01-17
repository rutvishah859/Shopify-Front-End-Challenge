var numNominated = 0; //tracks the num of nominations made (when the nominations exceed 5 the user is no longer allowed to make anymore selections)
var disabled = false; //boolean value that stoes wheather or not the nomination buttons have been disabled 
var nomPrinted = false; //boolean used to check if  "Nominations" has already been printed  

function searchMovie(){
    var movie = document.getElementById("movieSearch").value; 
    var results = document.getElementById("results");
    var nominations = document.getElementById("nominations");

    results.innerHTML = ""; //each time the user makes a request reset the request box

    //request to get the info about the movie searched by the user from the API 
    var request = new Request('http://www.omdbapi.com/?s=' + movie + '&apikey=fceeaa45');

    var searchResults = document.createElement('h3');
    searchResults.innerHTML = "Results for \"" + movie + "\"";
    results.appendChild(searchResults);
    
    //only print nominations once
    if(!nomPrinted){
        var nomText = document.createElement('h3');
        nomText.innerHTML = "Nomination";
        nominations.appendChild(nomText);
        nomPrinted = true;
    }

    fetch(request).then((response) => {
        return response.json();
      }).then(function(data){
        for (var i = 0; i < data.Search.length; i++){
            //only print the movies (exclude the search results that are TV shows and etc.)
            if (data.Search[i].Type == 'movie'){
                checkNominated(); //each time the user makes a search check if any of the searched movies are in the nomination list, if so then disable the button
                //create an unordered list element
                var movieList = document.createElement('li'); 
                //create a button which will nominate the moive 
                var nominateButton = document.createElement('button');
                nominateButton.innerHTML = "Nominate";
                nominateButton.name = "nominate";
                nominateButton.className = "nominate";
                nominateButton.value = data.Search[i].imdbID; 

                movieList.textContent = data.Search[i].Title + " (" + data.Search[i].Year + ") ";
                movieList.appendChild(nominateButton);
                results.appendChild(movieList);

                //when the nominate button is clicked add that moive into the nominations
                nominateButton.addEventListener('click', function(e){ 
                    //the the num of nominations exceed 5 then disbale all the nomination buttons
                    if (numNominated >= 5){
                        disableAll();
                        disabled = true;
                    }
                    else{
                        numNominated++; //when a nomination is added add 1 to numNominated
                        //create an unordered list
                        var nominationList = document.createElement('li');
                        var removeButton = document.createElement('button');
                        removeButton.innerHTML = " Remove";
                        removeButton.name = "remove";
                        removeButton.className = "remove";
                        removeButton.value = e.target.value;

                        var index; //hold the movie index (data.Search[index])
                        //Note: e.target.value gives the value of the button that was clicked
                        for (var a = 0; a < data.Search.length; a++){
                            if (data.Search[a].imdbID == e.target.value){
                                index = a;
                            }
                        }
                        nominationList.textContent = data.Search[index].Title + " (" + data.Search[index].Year + ") ";
                        nominationList.appendChild(removeButton);
                        nominations.appendChild(nominationList); //append the movie into the nomination list
                        e.target.disabled = true; //disable the button when the moive has been selected to nominated

                        //the remove button removes the nominated moive 
                        removeButton.addEventListener('click', function(e){
                            numNominated--;
                            //if all of the buttons are disabled (there are already 5 nominations) then enable all the buttons again so that the user can make new nominations
                            if (disabled){
                                enableAll();
                                disabled = false;
                            }
                            nominationList.remove(nominationList.childNodes); //removes both the movie title and remove button associated with the moive
                            var nominateBtns = document.getElementsByName("nominate");

                            //if the movie has been removed from the nominations list, then make the nominate button clickable
                            for (var a = 0; a < nominateBtns.length; a++){
                                if (nominateBtns[a].value == e.target.value && nominateBtns[a].disabled == true){
                                    nominateBtns[a].disabled = false;
                                }
                            }     
                        });
                    }  
                });                
            }  
        }
      });
}

//when the user makes 5 nominations then disable all the nomination buttons so that the user can't make any more nominations
function disableAll(){
    var nominations = document.getElementsByName('nominate');
    for (var i = 0; i < nominations.length; i++){
        nominations[i].disabled = true; 
    }
    alert("You have made 5 nominations, you cannot make anymore!");
}

//when the buttons have been disabled, but the user removes a nomination from the nomination list re-enable the buttons
function enableAll(){
    var nominations = document.getElementsByName("nominate");

    for(var i = 0; i < nominations.length; i++){
        nominations[i].disabled = false;
    }
    checkNominated();
}
 
//check if the button has been nominated or not
function checkNominated(){
    var nominations = document.getElementsByName("nominate");
    var removeBtns = document.getElementsByName('remove');

    for (var i = 0; i < removeBtns.length; i++){
        for (var a = 0; a < nominations.length; a++){
            if (nominations[a].value == removeBtns[i].value){
                nominations[a].disabled = true;
                continue;
            }
        }
    }
}

//whenever the user changes the mode of the page (dark/light mode swtich) this function will instigate/halt the darkMode style qualities
function changeMode(){
    var mode = document.getElementById("switch").checked; //true = dark mode, false = light mode
    document.body.classList.toggle("darkMode"); 
    var contentNodes = document.getElementById("content").childNodes;

    if (mode){
        document.getElementsByTagName('b')[0].innerHTML = "Light Mode:";
        for (var i = 0; i < contentNodes.length; i++){
            if (contentNodes[i].nodeName.toLocaleLowerCase() == 'div'){
                contentNodes[i].style.color = "white";
                contentNodes[i].style.backgroundColor = "#333";
                document.getElementById("movieSearch").style.backgroundColor = "#DCDCDC";
            }
        }
    }
    else{
        document.getElementsByTagName('b')[0].innerHTML = "Dark Mode:";
        for (var i = 0; i < contentNodes.length; i++){
            if (contentNodes[i].nodeName.toLocaleLowerCase() == 'div'){
                contentNodes[i].style.color = "black";
                contentNodes[i].style.backgroundColor = "white";
                document.getElementById("movieSearch").style.backgroundColor = "white";
            }
        }
    }
}

//the default font sizes in px
var textFactor = 16; 
var titleFactor = 32;
//the max font size in px
var textMax = 26;
var titleMax = 42;
//the min font size in px
var textMin = 10;
var titleMin = 22;

//this function increments the font size on the page by 2px
function incrementFontSize(){
    //while the font size is still less than the max font sizes the font size on the page can stil be incremented
    if (textFactor <= textMax && titleMax <= titleMax){
        //if the user redudes the font size which makes it come back into the range then the increment button will ne enabled again
        if (document.getElementById("decrement").disabled) {document.getElementById("decrement").disabled = false;}
        
        textFactor += 2;
        titleFactor += 2;

        document.getElementById("movieSearch").style.fontSize = textFactor + "px";
        var nominateBtns = document.getElementsByClassName("nominate");
        for (var i = 0; i < nominateBtns.length; i++){
            nominateBtns[i].style.fontSize = textFactor + "px";
        }
        var removeBtns = document.getElementsByClassName("remove");
        for (var i = 0; i < removeBtns.length; i++){
            removeBtns[i].style.fontSize = textFactor + "px";
        }

        var contentNodes = document.getElementById("content").childNodes;
        for (var i = 0; i < contentNodes.length; i++){
            if (contentNodes[i].nodeName.toLocaleLowerCase() == 'div'){
                contentNodes[i].style.fontSize = textFactor + "px";
            }
            else if (contentNodes[i].nodeName.toLocaleLowerCase() == 'h1'){
                contentNodes[i].style.fontSize = titleFactor + "px";
            }
        } 
    }
    else { //when the max font size is hit disable the increment button 
        document.getElementById("increment").disabled = true;
    }
    
}

//this function decrements the font size on the page by 2px 
function decrementFontSize(){
    //while the font size is still more than the min the font size can still be decremented
    if (textFactor >= textMin && titleMax >= titleMin){
        //when the font size comes back into range the increment button will be reenabled
        if (document.getElementById("increment").disabled) {document.getElementById("increment").disabled = false;}
        
        textFactor -= 2;
        titleFactor -= 2;

        document.getElementById("movieSearch").style.fontSize = textFactor + "px";
        var nominateBtns = document.getElementsByClassName("nominate");
        for (var i = 0; i < nominateBtns.length; i++){
            nominateBtns[i].style.fontSize = textFactor + "px";
        }
        var removeBtns = document.getElementsByClassName("remove");
        for (var i = 0; i < removeBtns.length; i++){
            removeBtns[i].style.fontSize = textFactor + "px";
        }

        var contentNodes = document.getElementById("content").childNodes;
        for (var i = 0; i < contentNodes.length; i++){
            if (contentNodes[i].nodeName.toLocaleLowerCase() == 'div'){
                contentNodes[i].style.fontSize = textFactor + "px";
            }
            else if (contentNodes[i].nodeName.toLocaleLowerCase() == 'h1'){
                contentNodes[i].style.fontSize = titleFactor + "px";
            }
        }
    }
    else{ //when the font size hits its min disable the decrement button
        document.getElementById("decrement").disabled = true;
    }
    
}
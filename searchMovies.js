var numNominated = 0; //tracks the num of nominations made (when the nominations exceed 5 the user is no longer allowed to make anymore selections)
var disabled = false; //boolean value that stoes wheather or not the nomination buttons have been disabled 

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

    fetch(request).then((response) => {
        return response.json();
      }).then(function(data){
        for (var i = 0; i < data.Search.length; i++){
            //only print the movies (exclude the search results that are TV shows and etc.)
            if (data.Search[i].Type == 'movie'){
                //create an unordered list element
                var movieList = document.createElement('li'); 
                //create a button which will nominate the moive 
                var nominateButton = document.createElement('button');
                nominateButton.innerHTML = "Nominate";
                nominateButton.name = "nominate";
                nominateButton.value = data.Search[i].imdbID; 

                movieList.textContent = data.Search[i].Title + " (" + data.Search[i].Year + ") ";
                movieList.appendChild(nominateButton);
                results.appendChild(movieList);

                //when the nominate button is clicked add that moive into the nominations
                nominateButton.addEventListener('click', function(e){
                    if(numNominated < 1){
                        var nomText = document.createElement('h3');
                        nomText.innerHTML = "Nomination";
                        nominations.appendChild(nomText);
                    } 
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
                        removeButton.innerHTML = "Remove";
                        removeButton.name = "remove";
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
    var removeBtns = document.getElementsByName('remove');

    for(var i = 0; i < nominations.length; i++){
        nominations[i].disabled = false;
    }
    for (var i = 0; i < removeBtns.length; i++){
        for (var a = 0; a < nominations.length; a++){
            if (nominations[a].value == removeBtns[i].value){
                nominations[a].disabled = true;
                continue;
            }
        }
    }
}
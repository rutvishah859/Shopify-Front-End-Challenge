function searchMovie(){
    var movie = document.getElementById("movieSearch").value; 
    var results = document.getElementById("results");
    results.innerHTML = ""; //each time the user makes a request reset the request box

    //request to get the info about the movie searched by the user from the API 
    var request = new Request('http://www.omdbapi.com/?s=' + movie + '&apikey=fceeaa45');

    var searchResults = document.createElement('h3');
    searchResults.innerHTML = "Results for \"" + movie + "\"";
    results.appendChild(searchResults);

    fetch(request).then((response) => {
        return response.json();
      }).then(function(data){
        console.log(data);
        for (var i = 0; i < data.Search.length; i++){
            //only print the movies (exclude the search results that are TV shows and etc.)
            if (data.Search[i].Type == 'movie'){
                //create an unordered list element
                var movieList = document.createElement('li'); 
                //create a button which will nominate the moive 
                var nominateButton = document.createElement('button');
                nominateButton.innerHTML = "Nominate";
                nominateButton.value = data.Search[i].imdbID; 

                //when the nominate button is clicked add that moive into the nominations
                nominateButton.addEventListener('click', function(e){ 
                    var nominations = document.getElementById("nominations");
                    //create an unordered list
                    var nominationList = document.createElement('li');

                    var index; //hold the movie index (data.Search[index])
                    //Note: e.target.value gives the value of the button that was clicked
                    for (var a = 0; a < data.Search.length; a++){
                        if (data.Search[a].imdbID == e.target.value){
                            index = a;
                        }
                    }
                    nominationList.textContent = data.Search[index].Title + " (" + data.Search[index].Year + ") ";
                    nominations.appendChild(nominationList); //append the movie into the nomination list
                    e.target.disabled = true; //disable the button when the moive has been selected to nominated
                });

                movieList.textContent = data.Search[i].Title + " (" + data.Search[i].Year + ") ";
                movieList.appendChild(nominateButton);
                results.appendChild(movieList);
            }  
        }
      });
}
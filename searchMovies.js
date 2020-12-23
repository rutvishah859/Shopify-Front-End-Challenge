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
                var li = document.createElement('li'); 
                li.textContent = data.Search[i].Title + " (" + data.Search[i].Year + ")";
                results.appendChild(li);
            }  
        }
      });

    //console.log(movie);
    //results.innerHTML = movie;
}
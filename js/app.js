(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  let form = document.getElementsByTagName("form")[0];
  let but = document.getElementsByTagName("button")[0];
  let search = document.getElementsByTagName("input")[0];

  but.setAttribute('required', true);
  form.addEventListener("submit",function(e){
    e.preventDefault();
    getdata(search.value);
  });

  function moviesReset(database){
    while(database.length > 0){
      database.pop()
    }
    return database;
  }

  function getdata(title){
    let url = `http://www.omdbapi.com/?s=${title}&y=&plot=short&r=json`;
    return fetch(url).then(function(response){
      return response.json();
    })
    .then(function(movie){
      moviesReset(movies);
      let array = [];
      movie.Search.forEach(function(element){
        let obj = {
          id: element.imdbID,
          poster: element.Poster,
          title: element.Title,
          year: element.Year
        };

        let id =element.imdbID;
        let plotPromise = fetch(`http://www.omdbapi.com/?i=${id}&plot=full&r=json`);
        plotPromise.then(function(response2){
          array.push(response2.json());
          return Promise.all(array);
        }).then(function(arrayObject){
          arrayObject.forEach(function(object){
            obj.plot = object.Plot;
          })
        })
        movies.push(obj);
      })
      console.log(movies);
    })
    .then(function(){
      renderMovies();
    });
  }

  //  renderMovies();//This is where I invoke the functions
  // ADD YOUR CODE HERE
})();

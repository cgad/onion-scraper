// grab the articles as a JSON
$.getJSON("/articles", function(data) {
    // for each article
    data.forEach(function(article) {

        // bootstrap card
        // $("#articles").append(
        //     '<div class="card"><div class="card-body"><h5 class="card-title">' + article.title + '</h5><h6 class="card-subtitle mb-2 text-muted"><a target=_blank href="' + article.link + '">Open Article in New Tab</a></h6><p class="card-text">' + article.summary + '</p><a href="#" class="card-link notes" data-id="' + article._id + '">Article Notes</a><a href="#" class="card-link new" data-id="' + article._id + '">New Note</a></div></div>'
        // );

        $("#articles").append("<div class='article' data-id='" + article._id + "'><h5 class='title'>" + article.title + "</h5><h6 class='link'><a target=_blank href='" + article.link + "'>" + article.link + "</a></h6><p class='summary'>" + article.summary + "</p></div>");
    });
});

// on click of "p" tag
$(document).on("click", ".article", function() {
    // show modal
    // $(".modal").modal("show");

    // empty the notes from the note div
    $("#notes").empty();

    // save Id
    var thisId = $(this).attr("data-id");

    // ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        // the title of the article
        $("#notes").append("<h6>" + data.title + "</h6>");
        // an input to enter a new note title
        $("#notes").append("<input id='titleinput' name='title' placeholder='Note title'>");
        // a textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body' placeholder='I think that...'></textarea>");
        // a button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // if there's a note in the article (specify that title and body are not empty strings since resetting those values to "" on click of clear note button)
        if (data.note.title != "" && data.note.body != "") {
            // place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            // place the body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
            // add clear note button with id of article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='clearnote'>Clear Note</button>");
        };
    });
});

// when you click the savenote button
$(document).on("click", "#savenote", function() {
    // hide modal
    // $(".modal").modal("hide");

    // grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // run a POST request to change the note using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // value taken from title input
        title: $("#titleinput").val(),
        // value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    .then(function(data) {
        // log the response
        console.log(data);
        // empty the notes section
        $("#notes").empty();
    });

    // remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#clearnote", function() {
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // run a POST request to clear the note's values
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // set value to empty string
          title: "",
          // set value to empty string
          body: ""
        }
      })
      .then(function(data) {
          // log the response
          console.log(data);
          // empty the notes section
          $("#notes").empty();
      });
})
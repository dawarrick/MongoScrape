// Grab the articles as a json
/*
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});*/

//first time in, scrape and display
function scrapeandload() {
  //going to 
  console.log('initialize 1')
  $.ajax({
    method: "GET",
    url: "/scrape"
  });
  // With that done, load the articles
  /*   .then(function (data) {
       document.location = '/';
            $.ajax({
              method: "GET",
              url: "/articles"
            })
            .then(function() {
            console.log('initialize 2')
            });*/
}



function trythis(thisID) {
  $.ajax({
    method: "GET",
    url: "/articles/" + thisID
  })
    // With that done, add the note information to the page
    .then(function (data) {
      refreshNotes(data);
    });
};

//this will recreate the notes for a single article.
function refreshNotes(data) {
  //console.log("data " + JSON.stringify(data));


  // Now make an ajax call for the Article
  /*    $.ajax({
        method: "GET",
        url: "/articles/" + articleID
      })*/

  // With that done, add the note information to the page
  //.then(function (data) {
  var articleId = data._id;
  //show the headings
  $("#hrow" + articleId).removeClass("d-none");

  var section = "#brow" + articleId;
  $("section").empty();
  /*  $(section).append("<div class='col-lg-3'>" + "</div>");
    $(section).append("<div class='col-lg-3 notesheader'>" + "Note Title</div>");
    $(section).append("<div class='col-lg-5 notesheader'>" + "Note</div>");*/
  // $("#ntitle" + data.note._id).removeClass("d-none");

  //        $(".contentWrap").each(function (i, element) {

  //console.log("section " + section)

  var newRow = "";
  data.note.forEach(function (ea) {
    //console.log("noteid " + ea._id)
    //console.log("title " + ea.title)

    newRow = "<div class='row noterow' data-id=" + ea._id + ">";
    newRow += "<div class='col-lg-3'></div>";
    newRow += "<div class='col-lg-3 notecol'>" + ea.title + "</div>";
    newRow += "<div class='col-lg-5 notecol'>" + ea.body + "</div>";
    newRow += "<div class='col-lg-1'>";
    newRow += "<form action='/deletenote/" + ea._id + "' method='post'>";
    newRow += "<button type='submit'  class='btn btn-danger deletebtn'>X</button>";
    newRow += "</form>";
    newRow += "</div>"
    $(section).append(newRow);
    console.log("newrow " + newRow)


    // The title of the article
    /*       $("#notes").append("<h2>" + data.title + "</h2>");
           // An input to enter a new title
           $("#notes").append("<input id='titleinput' name='title' >");
           // A textarea to add a new note body
           $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
           // A button to submit a new note, with the id of the article saved to it
           $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");*/

    // If there's a note in the article
    /*        if (data.note) {
              // Place the title of the note in the title input
              $("#titleinput").val(data.note.title);
              // Place the body of the note in the body textarea
              $("#bodyinput").val(data.note.body);
            }*/
  });
  //add the add form
  /*   <form action="/articles/{{this.id}}" method="post">
       <div class="row noterow">
         <div class="col-lg-3"></div>
         <div class="col-lg-3 notediv">
           <input type="text" class="d-none notecol" name="title"
             id="ntitle{{this.id}}" placeholder="Title" required>
                                                     </div>
           <div class="col-lg-5 notediv" id="body{{this.id}}">
             <textarea type="text" class="d-none notecol" name="body"
               id="nbody{{this.id}}" placeholder="Write Note Here"
               required></textarea>
           </div>
         </div>
         <div class="row noterow">
           <div class="col-lg-12" style="float:right;">
             <button type="submit" class="btn btn-primary d-none notesave"
               id="nsave{{this.id}}">Save</button>
           </div>
         </div>
                                             </form-->*/

  /*add the add form
  
  newRow = "<div class='row noterow'>";
  newRow += "<form action='/articles/'" + articleId + "' method='post'>";
  newRow += "<div class='row noterow'>";
  newRow += "<div class='col-lg-3'></div>";
  newRow += "<div class='col-lg-3 notediv'>";
  newRow += "<input type='text' class='notecol' name='title' id='ntitle" + articleId + "' placeholder='Title' required> </div>";
  newRow += "<div class='col-lg-5 notediv' id='body" + articleId + "'> ";
  newRow += "<textarea type='text' class='notecol' name='body' id='nbody" + articleId + "' placeholder='Write Note Here' required>";
  newRow += "</textarea> </div>"
  newRow += "</div> <div class='row noterow'> <div class='col-lg-12' style='float:right;'>";
  newRow += "<button type='submit' class='btn btn-primary notesave' id='nsave" + articleId + "'>Save</button> </div> </div> </form> </div>";
  console.log(newRow);
  $(section).append(newRow);


  newRow = "<div id='adddiv'" + articleId + "class='col-lg-12'></div>";
  newRow += "<button type='button' class='btn btn-sm btn-primary addnote'";
  newRow += " id='addbtn'" + articleId + " data-id=" + articleId + ">Add Note</button>";
  $(section).append(newRow);*/
};
$(document).ready(function () {

  //Closes modal on Cancel button click
  $("#modalClose").on("click", function () {
    $("#addModal").hide();
  });


  // Whenever someone clicks a p tag
  $("body").off().on("click", ".notesbtn", function () {

    event.preventDefault();

    // Save the id from the p tag
    var articleId = $(this).attr("data-id");
    //alert('clicked notes '+articleId)
    console.log("open " + $(this).attr("open"));

    //if notes are not open, open and populate, otherwise close
    if ($(this).attr("open") === undefined) {
      $(this).attr("open", "yes");
      console.log("open " + $(this).attr("open"));
      trythis(articleId);
    }
    else {
      $(this).removeAttr("open");
      console.log("open " + $(this).attr("open"));
      // Empty the notes from the note section
      $("#hrow" + articleId).addClass("d-none");
      $("#adddiv" + articleId).empty();
      // $("#adddiv" + articleId).remove();
      $("#brow" + articleId).empty();
    }
  });
  // When you click the savenote button
  $(document).off().on("click", "#savenote", function () {
    //event.preventDefault();
    // Grab the id associated with the article from the submit button
    //  thisId = $(#savenote).attr("article-id");
    var thisId = $("#savenote").attr("articleID");
    alert('saving ' + thisId)

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
        $("#notes").empty();
      });
  });



  //$("body").off().on('click', '.addnote', function (event) {
  $(document).on("click", ".addnote", function () {
    /*   var noteID = $(this).attr("data-id");
       //console.log(`note id ${noteID} title ${title} body ${body}`)
       $("#aform" + noteID).removeClass("d-none");
       $("#ntitle" + noteID).removeClass("d-none");
       $("#nbody" + noteID).removeClass("d-none");
       $("#nsave" + noteID).removeClass("d-none");
       // $("#addbtn" + noteID).addClass("d-none");*/

    //display modal for adding note
    $("#savenote").attr("articleID", $(this).attr("data-id"));

    $("#addModal").show();
  });


  /*
  //make sure they want to delete the selected note.
  $("body").off().on('click', '.deleteButton', function (event) {
    event.preventDefault();
   
    //get the database key for the row
    var noteID = $(this).attr("data-id");
    $("#submit-delete").attr("noteID", noteID);
    // Confirm modal to pop up
    $("#confirmModal").show();
  });*/

  //Closes modal on Cancel button click
  $("#modalClose").on("click", function () {
    $("#addModal").hide();
  });

});

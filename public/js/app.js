// Grab the articles as a json

function getNotes(thisID) {
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

  var articleId = data._id;
  //show the headings and add button
  $("#hrow" + articleId).removeClass("d-none");
  $("#addbtn" + articleId).removeClass("d-none");

  var section = "#brow" + articleId;
  //first remove what is currently displayed
  $("tbody.brow" + articleId).children().remove();

  //add in the notes
  var newRow = "";
  data.note.forEach(function (ea) {
    newRow = "<div class='row noterow' data-id=" + ea._id + ">";
    newRow += "<div class='col-lg-3 style='max-width:25%;'></div>";
    newRow += "<div class='col-lg-3 notecol'>" + ea.title + "</div>";
    newRow += "<div class='col-lg-5 notecol'>" + ea.body + "</div>";
    newRow += "<div class='col-lg-1'>";
    newRow += "<button class='btn btn-danger deletebtn' data-id=" + ea._id + " article-id=" + articleId + ">X</button>";
    newRow += "</div>"
    $(section).append(newRow);
  });

};

//format the scraped date
function formatDate(data) {
  if (data === data.trim()) {
    return data.substr(2, 19);
  }
  else {
    return data.trim();
  }
}


$(document).ready(function () {

  //Closes modal on Cancel button click
  $("#modalClose").on("click", function () {
    $("#addModal").hide();
  });


  // Whenever someone clicks a notes button tag
  $("body").off().on("click", ".notesbtn", function () {

    event.preventDefault();

    // Save the id from the notes button
    var articleId = $(this).attr("data-id");
    //if notes are not open, open and populate, otherwise close
    if ($(this).attr("open") === undefined) {
      $(this).attr("open", "yes");

      getNotes(articleId);
    }
    else {
      $(this).removeAttr("open");
      // Hide the notes section.  
      $("#hrow" + articleId).addClass("d-none");
      $("#addbtn" + articleId).addClass("d-none");
      //Empty the notes from the note section
      $("#brow" + articleId).empty();
    }
  });

  // When you click the delete note button
  $("tbody").off().on("click", ".deletebtn", function () {
    event.preventDefault();
    var noteId = $(this).attr("data-id");
    var articleId = $(this).attr("article-id");

    // Run a POST request to delete the note
    $.ajax({
      method: "POST",
      url: "/deletenote/" + noteId
    })
      // With that done
      .then(function (dbArticle) {
        //repopulate
        getNotes(articleId);
      });
  });

  // When you click the submit button on add
  $('#addModal').off().on('submit', function (event) {
    event.preventDefault();

    var thisId = $("#savenote").attr("articleID");
 
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
      .then(function () {
        $("#addModal").hide();
        // Remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
        //repopulate notes
        getNotes(thisId);
      });
  });


  $(document).on("click", ".addnote", function () {
    var noteID = $(this).attr("data-id");
    $("#addbtn" + noteID).addClass("d-none");

    //display modal for adding note
    $("#savenote").attr("articleID", $(this).attr("data-id"));

    $("#addModal").show();
  });


  //Closes modal on Cancel button click
  $("#modalClose").on("click", function () {
    $("#addModal").hide();
  });


  //format the date field
  $(".dateformat").each(function () {
    var data = $(this).text();
    var reformatted = formatDate(data);
    $(this).text(reformatted);
  });


});


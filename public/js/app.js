// Grab the articles as a json

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

  var articleId = data._id;
  console.log("refresh id " + articleId)
  //show the headings
  $("#hrow" + articleId).removeClass("d-none");
  $("#addbtn" + articleId).removeClass("d-none");

  var section = "#brow" + articleId;
  $("section").empty();
  $(".noterow").remove();

  var newRow = "";
  data.note.forEach(function (ea) {
    newRow = "<div class='row noterow' data-id=" + ea._id + ">";
    newRow += "<div class='col-lg-3 style='max-width:25%;'></div>";
    newRow += "<div class='col-lg-3 notecol'>" + ea.title + "</div>";
    newRow += "<div class='col-lg-5 notecol'>" + ea.body + "</div>";
    newRow += "<div class='col-lg-1'>";
    newRow += "<button class='btn btn-danger deletebtn' data-id=" + ea._id + " article-id=" + articleId +">X</button>";
    newRow += "</div>"
    $(section).append(newRow);
    console.log("newrow " + newRow)
  });

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
    //if notes are not open, open and populate, otherwise close
    if ($(this).attr("open") === undefined) {
      $(this).attr("open", "yes");

      trythis(articleId);
    }
    else {
      $(this).removeAttr("open");
       // Empty the notes from the note section
      $("#hrow" + articleId).addClass("d-none");
      $("#addbtn" + articleId).addClass("d-none");
      $("#adddiv" + articleId).empty();
      $("#brow" + articleId).empty();
    }
  });

  // When you click the delete note button
  $("tbody").off().on("click", ".deletebtn", function () {
  event.preventDefault();
    var noteId = $(this).attr("data-id");
    var articleId = $(this).attr("article-id");
    console.log('deleting '+noteId)

    // Run a POST request to delete the note
    $.ajax({
      method: "POST",
      url: "/deletenote/" + noteId
    })
      // With that done
      .then(function (dbArticle) {
        //repopulate
        trythis(articleId);
      });
  });

  // When you click the savenote button
  $(document).off().on("click", "#savenote", function () {
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
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
        trythis(thisId);
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

});

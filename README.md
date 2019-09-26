# MongoScrape 

### Developed by Deb Warrick https://Deb.Warrick.com

**MongoScrape** was developed as a homework assignment for the University of Richmond Web Development Bootcamp (May - October 2019 cohort).

Deployed at - https://serene-gorge-28258.herokuapp.com

Github repository - https://github.com/dawarrick/MongoScrape.git


**How it works**

* Upon system load, it will scrape and display headline information from the University of Richmond news website (https://news.richmond.edu/releases/index.html).  An example of the data is in the content.html file in Github
* The articles will be displayed from most recent to oldest based on the date it was pulled into the app, so the newly scraped are at the top. 
* It will display the title/headline that is a hyperlink to the article, a summary, and a thumbnail picture.  If the thumbnail is not available, it will display the UR logo.
* The date the article was scraped from the site will be displayed so you know what is new.
* The data is stored in a MongoDB database that is comprised of two tables, articles and notes.  Notes are associated with articles.
* The data will be added to the database, but it will not allow duplicates based on title.
* By pushing the notes button (clicking on the paragraph was not intuitive so I went with a button), the user will see any notes associated with the article.  
* Clicking on the Add Note button will bring up a modal for entry.
* Clicking on the note corresponding red X will delete the note.  I opted not to ask them for confirmation, since these are just notes.
* If the notes are open, clicking on the Notes button again will close the associated notes.
* After add or delete, the notes section will be updated and the screen display left in the same place.


## Technology Stack
* Node.js - JavaScript runtime engine.
* Express - Web application framework.
* Express-Handlebars - templating tool to handle the display of the table data
* Bootstrap, JQuery, CSS - HTML framework
* MongoDB - database for the storage of customer and vehicle data.
* Mongoose - ORM to handle communication with the database.
* Cheerio - for scraping the selected website.
* Morgan - used for logging the commands.  Helpful for debugging.
* mLab - MongoDB remote database connection through Heroku
* Heroku - deployment environment.

# Thanks for visiting, and please check out my app!

# MongoScrape 

### Developed by Deb Warrick https://Deb.Warrick.com

**MongoScrape** was developed as a homework assignment for the University of Richmond Web Development Bootcamp (May - October 2019 cohort).

Github repository - https://github.com/dawarrick/MongoScrape.git

Deployed at - ????
If you wish to see the data before it's scraped to see what gets added, you should call ?????/articles instead of the default route.


**How it works**

* Upon system load, it will scrape and display headline information from the University of Richmond news website (https://news.richmond.edu/releases/index.html).
* The articles will be displayed from most recent to oldest based on when it was pulled into the app, so the newly scraped are at the top.
* It will display the title/headline that is a hyperlink to the article, a summary, and a thumbnail picture.  If the thumbnail is not available, it will display the UofR logo.
* The data is stored in a MongoDB database that is comprised of two tables, articles and notes, which are associated.
* The data will be added to the database, but it will not allow duplicates based on title.
* It allows users to make comments associated with the headlines for all to see.  They can also delete comments.


## Technology Stack
* Node.js - JavaScript runtime engine.
* Express - Web application framework.
* Express-Handlebars - templating tool to handle the display of the table data
* Bootstrap, JQuery, CSS - HTML framework
* MongoDB - database for the storage of customer and vehicle data.
* Mongoose - ORM to handle communication with the database.
* Cheerio - for scraping the selected website.
* Heroku - deployment environment.

# Thanks for visiting, and please check out my app!

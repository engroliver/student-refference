# Heritage Bank
The live demo to the website can be accessed [here](https://nanometre.github.io/historic-site-finder-tgc-proj1/#).


## Project Summary

### Project Context

The Heritage Bank is a mobile-responsive web application with an interactive map that allows users to explore the various heritage sites scattered across Singapore. The information of the heritage sites are currently retrieved from Data.gov.sg.

### Target Audience

The target audiences are the locals and tourists. The characteristics (e.g. age, occupation, educational level, IT literacy level) of the target audiences cover a wide spectrum, hence, the web application has to be easy to use and intuitive to achieve its goal. 

### Organisational Goals

The web application aims to promote greater awareness of Singapore's history by providing a means for users to discover heritage sites in Singapore easily.

### User Goals

The users of the web application want to know more about the history of Singapore and the various place of significance in history. The web application allows the users to achieve this goal by providing the location of the heritage sites on a map and a short description of the heritage sites.

### Justification for the App

To discover heritage sites, users would currently have to do an internet search which return countless articles on the various heritage sites in Singapore. The articles are wordy and it can take the users some effort to find the location of the heritage sites. The web application provides a convenient way to discover these heritage sites on an interactive map and to provide other useful features to aid users to plan a visit if they would like to.


## UI/UX

### Strategy

**Organisation**
* Objective: To promote greater awareness of the history of Singapore.

**User**
* Objective: To discover heritage sites in Singapore.

* Needs: An easy way to know more about heritage sites in Singapore and where to find them.

* Demographic: The characteristics (e.g. age, occupation, educational level and IT literacy level) of the users cover a wide spectrum. Any user that is interested in knowing more about the history of Singapore is a target audience

* Pain point: Information that are currently available online are wordy and location of the heritage sites can take some effort to find.

**User Stories**
1. As a local or tourist interested in visiting Singapore's historic sites, I want to be able to easily search for them in a given area so that I can make an impromptu visit or plan a day visit.
2. As someone who is planning a visit , I want to know what is the weather forecast so that I can know whether to bring an umbrella or visit on another day.

### Scope
**Functional Specifications**
**Content requirements**
**Non-functional requirements**
### Structure
### Skeleton
### Surface
**Colours**
**Font Choice**
**Icons in place of markers**


## Features
**Value Added to Target Audience**
The app will also allow users to check the 2h and 24h weather forecast, making it easy for users to plan a spontaneous or day trip on Singapore's history.

### Limitations and future implementations
1. Search function is limited to searching by name of the location provided by the data sources. The search terms have to be exact (e.g. does not accounts for spelling mistakes).

2. Some images URL provided by the data sources does not exist and would redirect the browser to another website. To check if the image URL exists, a promise is used on each image URL. When there is a bunch of image URLs to check, the operation will take awhile to complete as the promise will wait for the response of one image URL before moving to the next. Hence, slowing down certain functions of the application.


## Testing

### Test Cases

### Testing for Mobile Responsiveness
 * Testing was done using chrome developer tool across iPhone X, Galaxy S5, iPad, iPad Pro, 13-inch MacBook Air


## Technologies Used
1. HTML 
    - To create the basic structure of the web application.

2. CSS 
    - To style and present the HTML elements on the web application.

3. JavaScript
    - To create interactive HTML elements on the web application.

4. [Bootstrap v5.1](https://getbootstrap.com/docs/5.1/getting-started/introduction/) 
    - To include bootstrap style/presentation and interactive bootstrap components on the web application. 

5. [Leaflet](https://leafletjs.com/) and [Markercluster](https://github.com/Leaflet/Leaflet.markercluster) 
    - To create an interactive map on the web application.

6. [Axios](https://github.com/axios/axios)
    - To retrieve data from geoJSON files and APIs.

7. [Fontawesome](https://fontawesome.com/icons)
    - To input icons for the web application.

8. [Google Fonts](https://fonts.google.com/)
    - To select font families for the web application.


## Deployment
The web application is hosted on [GitHub Pages](https://pages.github.com/)

**Steps to deploy web application on GitHub Pages**
1. On GitHub, navigate to the site's repository.
2. Under the repository name click on Settings.
3. Under "GitHub Pages" section, use the None or Branch drop-down menu and select a publishing source. For this web application, select **main**.
4. Optionally, use the drop-down menu to select a folder for the publishing source.
5. Click Save.


## Credits
1. Data.gov.sg
    - Data sources (geoJSON files and APIs) are obtained from [data.gov.sg](https://data.gov.sg/).

2. Flaticon
    - Other icons and custom map markers are obtained from [Flaticon](https://www.flaticon.com/). The icons and markers are made by Vectorslab, Freepik and Pixel perfect. 

3. CSS bounce animation
    - Code for the bounce animation is taken and adapted from [here](https://css-tricks.com/making-css-animations-feel-natural/).

4. Regular expression syntax for coordinates 
    - The regular expressions for matching coordinates (latitude and longitude) are taken from [here](https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates).
# Historic Sites Finder
Live link to the deployed website: 

## Data Sources
1. Singapore Historic Sites 
    - https://data.gov.sg/dataset/historic-sites
2. Singapore Museums 
    - https://data.gov.sg/dataset/museums
3. Singapore Monuments 
    - https://data.gov.sg/dataset/monuments
4. Singapore Weather API 
    - https://api.data.gov.sg/v1/environment/2-hour-weather-forecast 
    - https://api.data.gov.sg/v1/environment/24-hour-weather-forecast

## Target Audience and Pain Points
1. As a local or tourist interested in visiting Singapore's historic sites, I want to be able to easily search for them in a given area so that I can make an impromptu visit or plan a day visit.
2. As someone who is planning a visit , I want to know what is the weather forecast so that I can know whether to bring an umbrella or visit on another day.
 
## Value Added to Target Audience
The Historic Sites Finder app aims to provide the location and information on all the historic sites and museums in Singapore on a map. The app will also allow users to check the 2h and 24h weather forecast, making it easy for users to plan a spontaneous or day trip on Singapore's history.

## UI/UX

## Features
### Limitations of Application
1. Search function is limited to searching by name of the location provided by the data sources. The search terms have to be exact (e.g. does not accounts for spelling mistakes).
2. Some images URL provided by the data sources does not exist and would redirect the broswer to another website. To check if the image URL exists, a promise is used on each image URL. When there is a bunch of image URLs to check, the operation will take awhile to complete as the promise will wait for the response of one image URL before moving to the next. Hence, slowing down certain functions of the application.

## User Stories

## Technologies Used
1. HTML, CSS, Javascript
2. Bootstrap
3. Leaflet and Markercluster
4. Fontawesome and Google Fonts

## Test Cases

## Deployment

## Credits
1. Data sources from www.data.gov.sg
2. Icons made by Vectorslab, Freepik and Pixel perfect from www.flaticon.com
3. CSS bounce animation from https://css-tricks.com/making-css-animations-feel-natural/
4. Regular expression syntax for coordinates from https://stackoverflow.com/questions/3518504/regular-expression-for-matching-latitude-longitude-coordinates
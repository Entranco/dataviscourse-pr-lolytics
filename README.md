# LOLytics
Welcome to LOLytics, a League of Legends Worlds data visualization.

## Links
Project website: https://entranco.github.io/dataviscourse-pr-lolytics/

Project video: 

## File Layout
- data: The data folder holds all of our data. This includes all of the worlds data in csv form and a folder including all champion icons.
- js: The js folder stores all of our .js files. This includes the following:
    - d3-waffle.js: A waffle chart library we are using. This can be found at https://github.com/jbkunst/d3-waffle
    - bar.js: A bar chart implementation, as seen in the top left of the website. This bar chart visualizes champion data over time and it is connected to the data selected in the table.
    - table.js: A table implementation, as seen on the right side of the website. This table allows for easy searching of the data restricted to one year. It also interacts with both the bar and the waffle charts.
    - waffle.js: A waffle chart implementation, as seen on the bottom left of the website. This waffle chart presents a part of a whole representation of the data, restricted to one year. It is connected to the data selected in the table.
- docs:
    - LOLytics Proposal: Our initial proposal document.
    - LOLytics Milestone Process Book: The process book we submitted for our project milestone.
    - LOLytics Process Book: Our fully completed process book.
    - Feedback Exercise: The information we recorded during our feedback exercise in class.
- other:
    - index.html: The base website HTML. Manipulated using d3 to create our visualization.
    - styles.css: The CSS styling file of our website.

## How to Open
- From dataviscourse-pr-lolytics/ run the following command: python3 -m http.server
- Open http://localhost:8000/
- Select web.html
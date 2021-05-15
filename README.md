# XMeme - Project at Crio.do Stage-2B

## The project implements the following features
* The users can get the latest 100 memes using, GET request on **/memes** endpoint
* The users can post the meme using, POST request on **/memes** endpoint
* The users can get a meme of specific id using, GET request on **/memes/{id}** endpoint
* The users can also update memes by changing the caption and the url using, PATCH request on **/memes/{id}** endpoint
* The users can also directly upload the image using the frontend to post the meme

## Description about the files in the project repository
1. xmeme-backend
    1. This folder contains all the files that are required for the backend
    1. Backend is publicly deployed on https://yashwin-xmeme.herokuapp.com
    1. This component uses postgresql for the database support
1. xmeme-frontend
    1. This folder contains all the files that are required for the frontend
    1. Frontend is publicly deployed on https://yashwin-xmeme.netlify.app/
    1. This component interacts with the backend to provide the service
    1. Another feature that posts a meme taking **directly the image** is also supported. This feature is implemented using imgbb API service. This service gives the url of an image after making the image publicly available on the returned url. And with this url, we use our backend service to post the meme
1. xmeme-swagger
    1. This folder contains all the files that are required for the swagger-documentation
    1. Curl commands are directly sent bypassing the frontend to acces the service using swagger
    1. Appropriate documentation and proper explanation for the error codes are provided to use the API
1. install.sh
    1. This has the command to install the nodejs software
    1. Running this script setsup the required software
1. server_run.sh
    1. This contains commands to run the server
    1. Backend runs on the port 8081
    1. Swagger runs on the port 8082 (As running it on 8080 has many issues with priviliges)
    1. Running this file starts the servers on the specified port numbers
1. sleep.sh
    1. This contains the commands to pause the execution
    1. Running this file takes the thread to sleep for specified time
1. test_server.sh
    1. This file contains the commands to run the three previous scripts
    1. Running this script setsup all the requirements and tests the server
    
## Requirements that have been satisfied as given in the Task Board

| Requirements | Status |
| --------------------------------------------------------------------------------------------------------------- | :-----: |
| The backend shall be capable of receiving the posted meme inputs from the frontend and store them in a database | **Yes** |
| The backend shall be capable of fetching the list of memes from the database and send them to the frontend     | **Yes** |
| The interaction between the frontend and backend shall be based on a REST API with support for the below 3 endpoints  | **Yes** |
| Endpoint to send a meme to the backend | **Yes** |
| Endpoint to fetch the latest 100 memes created from the backend | **Yes** |
| Endpoint to specify a particular id (identifying the meme) to fetch a single Meme | **Yes** |
| The database shall be designed to store and retrieve the meme content | **Yes** |
| The Frontend shall have a form at the top which can be used by users to post memes with these fields - Name of the meme creator, Caption for the meme and URL of the meme image. It shall send these inputs to the backend | **Yes** |
| The Frontend shall list the latest 100 memes posted, either in the lower section of the page (below the form) or on a separate page. It shall fetch these details from the backend | **Yes** |
| Both the Frontend and Backend shall be deployed publicly | **Yes** |
| Endpoint to update the caption or url for an existing meme at the backend | **Yes** |
| **Quality:** Code is well commented, Proper HTTP codes, Modular Code | **Yes** |
| **Creativity:** Users can directly upload the images without a public url | **Yes** |
| Document your existing APIs using Swagger | **Yes** |
| Create a Dockerized solution for your server; the dockerfile should be added to the root folder of your project | **No** |

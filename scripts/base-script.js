const key = "AIzaSyAjEOgW04oU_xDdfVujbubZECaqgJX5GtM";
const url = "https://www.googleapis.com/youtube/v3/search";
const maxResults = 5;
const part = "snippet";

var vidosFromSearchingData = [];
var nextPageToken = "";
var parentContainer = document.getElementsByClassName("row")[0];
var moreVideosButton = document.getElementsByClassName("more-videos-btn")[0];



document.getElementById("searchButton")
.addEventListener('click', function(){
    loadFiveVideos();
});


var loadFiveVideos = function(nextPageToken, needNewFiveVideos) {
    var queryText = document.getElementById("searchInput").value;

    if(vidosFromSearchingData.length > 0 && !needNewFiveVideos) {
        vidosFromSearchingData = [];
        nextPageToken = "";
        while(parentContainer.firstChild){
            parentContainer.removeChild(parentContainer.firstChild);
        }
    }

    var _url = new URL(url),
        params = {
            part: part,
            maxResults: maxResults,
            q: queryText,
            key: key
        }
    if(nextPageToken) {
        params["pageToken"] = nextPageToken;
    }
    Object.keys(params).forEach(key =>
        _url.searchParams.append(key, params[key]));

    fetch(_url,
    {
        method: 'get'
    })
    .then((response) => response.json())
    .then((res) => {
        var results = JSON.parse(JSON.stringify(res));
        console.log(results);
        collectVideosForGallery(results);
    });
}


var spliceCounter = 0;

function collectVideosForGallery(results){

    nextPageToken = results.nextPageToken;

    for (var index = 0; index < results.items.length; index++) {
        const element = results.items[index];
        
        var video = {
            id: index,
            videoTitle: element.snippet.title,
            videoDescription: element.snippet.description,
            videoPreviewPicUrl: element.snippet.thumbnails.medium.url
        };

        vidosFromSearchingData.push(video); 
    }

    if(spliceCounter !== 0) {
        vidosFromSearchingData.splice(0, spliceCounter)
    }

    spliceCounter = 5;

    createVideoGallery(vidosFromSearchingData);
}

function createVideoGallery(videos)
{
    videos.forEach(video => {
        var videoDiv = document.createElement("div");
        videoDiv.className = "col-md-4";

        var titleElement = document.createElement("h2");
        titleElement.className = "video-title";
        titleElement.innerText = video.videoTitle;

        var videoElement = document.createElement("video");
        videoElement.width = 300;
        videoElement.height = 200;
        videoElement.controls = true;
        videoElement.preload = "auto";
        videoElement.poster = video.videoPreviewPicUrl;

        var descriptionElement = document.createElement("p");
        descriptionElement.className = "video-description";
        descriptionElement.innerText = video.videoDescription;

        videoDiv.appendChild(titleElement);
        videoDiv.appendChild(videoElement);
        videoDiv.appendChild(descriptionElement);
        parentContainer.appendChild(videoDiv);
    });
}


function loadMoreVideos() {

    var videoGalleryRowCount = parentContainer.childElementCount;

    if(videoGalleryRowCount >= 10) {
        moreVideosButton.style.display = "none";
    }

    loadFiveVideos(nextPageToken, true);
}
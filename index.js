let inputMsg = document.querySelector('.inputMsg');
let btn = document.getElementById('btn');
let searchTweet = document.querySelector('.searchText');
let ul = document.querySelector('.collection');
let errMsg = document.querySelector('.errMsg');
let msg = document.querySelector('.msg');

let allTweets = getTweetFromLocalStorage();

btn.addEventListener('click', e => {
    // e.preventDefault();
    if (e.keyCode == 13) {
    e.preventDefault();
    }
    let id;
    let tweetMsg = inputMsg.value;
    if (allTweets.length === 0) {
        id = 0;
    } else {
        id = allTweets[allTweets.length - 1].id + 1;
    }
    if (!tweetMsg) {
        errMsg.innerHTML = "Empty Tweet Can't Be Submitted";
    } else {
        errMsg.innerHTML = '';
        let tweetObj = {
            id,
            tweetMsg,
            date: `${new Date().toDateString()} : ${new Date().toLocaleTimeString()}`
        };
        allTweets.push(tweetObj);
        saveTweetToLocalStorage(tweetObj);
        ul.innerHTML = '';
        getTweets(allTweets);
        inputMsg.value = '';
    }
});

ul.addEventListener('click', e => { 
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        let id = parseInt(e.target.parentElement.id);
        let result = allTweets.filter(tweet => {
            return tweet.id !== id;
        });
        allTweets = result;
        deleteTweetFromLocalStorage(id);
    }
});

searchTweet.addEventListener('keyup', e => { 
    let tweetText = e.target.value.toLowerCase();
    let tweetLength = 0;
    document.querySelectorAll('.tweet-items').forEach(tweetItem => { 
        listTweetMsg = tweetItem.firstElementChild.innerText.toLowerCase();
        if (listTweetMsg.indexOf(tweetText) === -1) {
            tweetItem.style.display = 'none';
        } else {
            tweetItem.style.display = 'block';
            ++tweetLength;
        }
    });
    if (tweetLength > 0) {
        msg.innerHTML = '';
    } else {
        msg.innerHTML = 'No Match Found!';
    }
});

function deleteTweetFromLocalStorage(id) {
    let tweets = JSON.parse(localStorage.getItem('tweets'));
    let result = tweets.filter(tweetItem => { 
        return tweetItem.id !== id;
    });
    localStorage.setItem('tweets', JSON.stringify(result));
    if (result.length === 0) {
        location.reload();
    }
}

function getTweets(tweet) {
    if (allTweets.length > 0) {
        msg.innerHTML = '';
        let li;
        tweet.forEach(tweetItem => { 
            let { id, tweetMsg, date } = tweetItem;
            li = document.createElement('li');
            li.className = 'list-group-item tweet-items';
            li.id = id;
            li.innerHTML = `
                ${id+1}. <strong>${tweetMsg}</strong> By <em>Annonymus </em> at ${date} 
                <button type="button" class="btn btn-danger delete-btn" id="btn">Delete</button>
            `;
            ul.appendChild(li);
        });
    }
    else {
        msg.innerHTML = 'No Tweets Available';
    }
}
getTweets(allTweets);

function getTweetFromLocalStorage() {
    let tweets = '';
    if (localStorage.getItem('tweets') === null) {
        tweets = [];
    } else {
        tweets = JSON.parse(localStorage.getItem('tweets'));
    }
    return tweets;
}

function saveTweetToLocalStorage(tweet) {
    let tweets = '';
    if (localStorage.getItem('tweets') === null) {
        tweets = [];
        tweets.push(tweet);
        localStorage.setItem('tweets', JSON.stringify(tweets));
    } else {
        tweets = JSON.parse(localStorage.getItem('tweets'));
        tweets.push(tweet);
        localStorage.setItem('tweets', JSON.stringify(tweets));
    }
}
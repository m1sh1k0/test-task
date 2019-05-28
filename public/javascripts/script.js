
document.addEventListener('DOMContentLoaded', function() {
    var checkSession = function(cb) {
        fetch('/isLoggedIn', {
            method: 'GET',
            mode: 'cors'
        })
            .then(function(response) {
                if (response.status !== 200) {
                    document.write('<a href="/login">Click here to login</a>');
                    return;
                }
                return response.json();
            })
            .then(function(data) {
                cb();
            })
            .catch(function(error) {
                console.log(error);
            });
    };

    function getCountyList() {
        fetch('/countries', {
            method: 'GET',
            mode: 'cors'
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                data.forEach(function(item) {
                    var listItem = document.createElement('li');
                    var text = document.createElement('span');
                    var img = document.createElement('img');
                    img.src = item.flag;
                    img.className = "flag";
                    text.textContent = item.name;
                    listItem.appendChild(img);
                    listItem.appendChild(text);
                    document.getElementById('list').appendChild(listItem);
                });
                console.log(data);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    checkSession(function() {
        getCountyList();
    });

});
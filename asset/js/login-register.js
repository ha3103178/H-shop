
var loginApi = "http://localhost:3000/users"

function getUser(callback) {
    fetch(loginApi)
        .then(function(responsive) {
            return responsive.json();
        })
}
var imgUrl = '';
window.fbAsyncInit = function() {
  FB.init({
    appId: '851549238270521',
    xfbml: true,
    version: 'v2.3'
  });

  function onLogin(response) {
    if (response.status == 'connected') {
      FB.api(
        "/me/picture?width=400&height=400",
        function (response) {
          if (response && !response.error) {
            imgUrl = response.data.url;
            document.getElementById('profile-pic').src = imgUrl;
            document.getElementById('filename').value = imgUrl;
            $('#instructions, #fb-welcome, #submitbtn').show();
          }
        }
      );
      FB.api('/me?fields=first_name', function(data) {
        var welcomeBlock = document.getElementById('fb-welcome');
        welcomeBlock.innerHTML = 'Hi, ' + data.first_name + '.';
      });
    }
  }

  FB.getLoginStatus(function(response) {
    if (response.status == 'connected') {
      onLogin(response);
    } else {
      // Otherwise, show Login dialog first.
      FB.login(function(response) {
        onLogin(response);
      }, {scope: 'user_photos'});
    }
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

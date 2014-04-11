$(function() {

// Scroll to the form, if the correct hash is detected.
if (location.hash.match(/^#add-yourself/)) {
    $(window).scrollTop($('#add-yourself').offset().top);
}

if (location.hash !== '#preview28') {
    return;
}

$('#grid').show();

$.ajax({
    url: '//reset-the-net-form-backend.herokuapp.com/users',
    success: function(res) {
        var participantsHtml = '';
        res.forEach(function(user) {
            var html = '<div id="user-' + user._id + '" class="slide">' +
                '<meta name="user_id" content="' + user._id + '">' +
                '<a target="_top" href="' + user.url + '">' +
                '<img src="' + (user.image || '//fightforthefuture.github.io/reset-the-net-form/images/happycat.jpg') + '">' +
                '</a>' +
                '<p>' +
                '<strong>' + user.name + '</strong> <span>' + user.description + '</span>' +
                '</p>' +
                '</div>';

            participantsHtml += html;
        });
        $('#grid .participants').html(participantsHtml);
    }
});



});

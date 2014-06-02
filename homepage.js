$(function() {

// Scroll to the form, if the correct hash is detected.
if (location.hash.match(/^#add-yourself/)) {
    $(window).scrollTop($('#add-yourself').offset().top);
}

// Here are some variables we'll want to see persist.
var participants = [];
var currentParticipantIndex = 0;

// Show the Grids. Otherwise, being under development, it's hidden by default.
$('#participants').show();

// This is our HTML template method.
function createParticipantElement(user) {
    var html = '<div id="user-' + user._id + '" class="slide">' +
        '<meta name="user_id" content="' + user._id + '">' +
        '<a target="_top">' +
        '<img src="">' +
        '</a>' +
        '<p>' +
        '<strong>' + user.name + '</strong> <span>' + user.description + '</span>' +
        '</p>' +
        '</div>';

    var $el = $(html);
    $el.find('a').attr('href', user.url);
    $el.find('img').attr('src', (user.image || '//fightforthefuture.github.io/reset-the-net-form/images/happycat.jpg'));
    $el.find('strong').text(user.name);
    $el.find('span').text(user.description);

    return $el;
}

function showNextGroupOfParticipants() {
    // Define how many participants will form a group.
    var groupSize = 4;

    // Get the next group of participants.
    var slice = participants.slice(currentParticipantIndex, currentParticipantIndex + groupSize);
    
    // Increment our participant index.
    currentParticipantIndex += groupSize;

    // Create new HTML.
    var $group = $('<span>');
    slice.forEach(function(user) {
        $group.append(createParticipantElement(user));
    });

    // Animate the group.
    $group.css({
        opacity: 0
    }).animate({
        opacity: 1
    }, 432);

    // Append new HTML.
    $('#participants .participants').append($group);

    // Hide the view more button, if we've seen everything.
    if (currentParticipantIndex >= participants.length) {
        $('#view-more-participants').remove();
    }
}

// Fetch the participants.
$.ajax({
    url: '//reset-the-net-form-backend.herokuapp.com/users',
    success: function(res) {
        // Show the View More button.
        $('#view-more-participants').show();

        // Save the participants.
        participants = res;

        // Show the next couple of groups.
        showNextGroupOfParticipants();
        showNextGroupOfParticipants();
    }
});

// When the View More button is clicked, oblige.
$('#view-more-participants').on('click', showNextGroupOfParticipants);






// Show Problems section, if debug flag is present.
if (location.hash === '#preview-problems') {
    $('#problems').show();
}

if (location.hash === '#preview-organizations') {
    // Choose a random organization.
    var organizations = [
    {
        // American Civil Liberties Union
        "disclaimer": "<a href='http://aclu.org' target='_blank'>ACLU</a> will contact you about future campaigns. <a href=https://www.aclu.org/american-civil-liberties-union-privacy-statement' target='_blank'>Privacy policy</a>",
        "tag": "reset-the-net-aclu",
        "weight": 5
    },
    {
        // OpenMedia
        "disclaimer": "<a href=http://openmedia.org' target='_blank'>OpenMedia</a> will contact you about future campaigns. <a href='https://openmedia.ca/privacy' target='_blank'>Privacy policy</a>",
        "tag": "reset-the-net-openmedia",
        "weight": 5
    },
    {
        // Demand Progress
        "disclaimer": "<a href='http://demandprogress.org/' target='_blank'>Demand Progress</a> will contact you about future campaigns. <a href='http://www.demandprogress.org/privacy/' target='_blank'>Privacy policy</a>",
        "tag": "reset-the-net-demand-progress",
        "weight": 5
    },
    {
        // Fight for the Future
        "disclaimer": "<a href='http://www.fightforthefuture.org/'>Fight for the Future</a> and <a href='http://www.thecenterforrights.org/'>Center for Rights</a> will contact you about future campaigns. <a href='http://www.fightforthefuture.org/privacy/'>Privacy Policy</a>",
        "tag": "reset-the-net",
        "weight": 10
    },
    {
        // Free Press
        "disclaimer": "<a href='http://www.freepress.net/' target='_blank'>Free Press</a> will contact you about future campaigns. <a href='https://www.freepress.net/privacy-copyright' target='_blank'>Privacy policy</a>",
        "tag": "reset-the-net-freepress",
        "weight": 5
    }
    ];

    function getScore(weight) {
        return (100 + weight) * Math.random();
    }

    function getOrganization() {
        return organizations.sort(function(a, b) {
            return getScore(b.weight) - getScore(a.weight);
        })[0];
    }

    var organization = getOrganization();
    $('input[name=tag]').val(organization.tag);
    $('.disclaimer p').html(organization.disclaimer);
}

});

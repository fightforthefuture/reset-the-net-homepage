(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 14 + 'px'
        }, 750);
        return this;
    }
})(jQuery);


$(function() {
    var prev; //keep track of previous selected link
    var isVisible= function(el){
        el = $(el);
        
        if(!el || el.length === 0){
            return false
        };

        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        
        var elemTop = el.offset().top;
        var elemBottom = elemTop + el.height();
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
    }
        
    $(window).scroll(function(){
        $('.navigation .navinn a').each(function(index, el){
            el = $(el);
            if(isVisible(el.attr('href'))){
                if(prev){
                    prev.removeClass('active');
                }
                el.addClass('active');
                prev = el;
                
                //break early to keep highlight on the first/highest visible element
                //remove this you want the link for the lowest/last visible element to be set instead
                return false; 
            }
        });
    });
    
    //trigger the scroll handler to highlight on page load
    $(window).scroll();

    $('.nav-item').click(function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        $(target).goTo();
    })


if (["#splash-screen", "#privacy-pack"].indexOf(window.location.hash) > -1) {
    $("#splash-screen").goTo();
};


// Heroic video should video.
$('.actions').on('click', function(e) {
    if (e.target !== this) {
        return;
    }

    playVideo();
});
function playVideo() {
    var mobile = navigator.userAgent.match(/(mobile|android)/i);
    if (mobile) {
        window.open('https://www.youtube.com/watch?v=qKk8MHFLNNE&feature=youtu.be');
    } else {
        var $el = $('#big-video');
        if ($el.data('instantiated')) {
            return;
        }
        $el.attr('height', $el.attr('x-height'));
        $el.attr('src', $el.attr('x-src'));
        $el.show();

        $(window).on('resize', function() {
            // Determine size of video.
            var height = +$('.actions').css('padding-top').replace(/px/, '');
            var width = +$('.action').css('width').replace(/px/, '') +($('.actions > .container').css('padding-right').replace(/px/, '') * 2);

            // Determine margin-left of video.
            $('body').css('overflow', 'hidden');
            var realWindowWidth = $(window).width();
            $('body').css('overflow', 'auto');
            
            var marginLeft = +($(window).width() - width) / 2;
            if (realWindowWidth <= 460) {
                marginLeft += 20;
            }

            // Update.
            $el.css({
                'height': height + 'px',
                'margin-left': marginLeft + 'px',
                'width': width + 'px'
            });
        }).trigger('resize');

        // Update cursor.
        $('section.actions').css('cursor', 'default');

        $el.data('instantiated', true);
    }
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

        // Show the next several groups.
        showNextGroupOfParticipants();
        showNextGroupOfParticipants();
        showNextGroupOfParticipants();
        showNextGroupOfParticipants();

        // Catch partial hashes.
        if (location.hash.match(/^#add-yourself/)) {
            $('#add-yourself').goTo();
        }
        if (location.hash.match(/^#splash-screen/)) {
            $('#splash-screen').goTo();
        }
    }
});

// When the View More button is clicked, oblige.
$('#view-more-participants').on('click', function(){showNextGroupOfParticipants();showNextGroupOfParticipants();});





/*
Organization Rotation
*/

// Weights TBD.
var organizations = [
{
    // American Civil Liberties Union
    "disclaimer": "<a href='http://aclu.org' target='_blank'>ACLU</a> will contact you about future campaigns. <a href='https://www.aclu.org/american-civil-liberties-union-privacy-statement' target='_blank'>Privacy policy</a>",
    "tag": "reset-the-net-aclu",
    "weight": 2
},
{
    // OpenMedia
    "disclaimer": "<a href='http://openmedia.org' target='_blank'>OpenMedia</a> will contact you about future campaigns. <a href='https://openmedia.ca/privacy' target='_blank'>Privacy policy</a>",
    "tag": "reset-the-net-openmedia",
    "weight": 0
},
{
    // Demand Progress
    "disclaimer": "<a href='http://demandprogress.org/' target='_blank'>Demand Progress</a> will contact you about future campaigns. <a href='http://www.demandprogress.org/privacy/' target='_blank'>Privacy policy</a>",
    "tag": "reset-the-net-demand-progress",
    "weight": 0
},
{
    // Fight for the Future
    "disclaimer": "<a href='http://www.fightforthefuture.org/'>Fight for the Future</a> and <a href='http://www.thecenterforrights.org/'>Center for Rights</a> will contact you about future campaigns. <a href='http://www.fightforthefuture.org/privacy/'>Privacy Policy</a>",
    "tag": "reset-the-net",
    "weight": 98
},
{
    // Free Press
    "disclaimer": "<a href='http://www.freepress.net/' target='_blank'>Free Press</a> will contact you about future campaigns. <a href='https://www.freepress.net/privacy-copyright' target='_blank'>Privacy policy</a>",
    "tag": "reset-the-net-freepress",
    "weight": 0
}
];

function getScore(weight) {
    return weight * Math.random();
}

function getOrganization() {
    return organizations.sort(function(a, b) {
        return getScore(b.weight) - getScore(a.weight);
    })[0];
}

var organization = getOrganization();
$('input[name=tag]').val(organization.tag);
$('.disclaimer p').html(organization.disclaimer);



// Show Problems section, if debug flag is present.
if (location.hash === '#preview-problems') {
    $('#problems').show();
}



});

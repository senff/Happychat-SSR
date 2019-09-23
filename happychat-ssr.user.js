// ==UserScript==
// @name         Happychat WooCommerce SSR
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to copy SSR or open in popup
// @author       Senff
// @require      https://code.jquery.com/jquery-1.12.4.js
// @match        https://hud.happychat.io/*
// @updateURL    https://github.com/senff/Happychat-SSR/raw/master/happychat-ssr.user.js
// @grant        none
// ==/UserScript==

var $ = window.jQuery;

// === Detect messages and mark them as SSR ===================================================
function idSSR() {
    $('.ReactVirtualized__Grid__innerScrollContainer .chat__message__from-user .chat__message__text').each(function(message) {
        var $thisMessage = $(this);
        var $thisHTML = $thisMessage.html();
        var thisSSRid = Math.floor(Math.random()*90000) + 10000;
        if ( (!$thisMessage.hasClass('SSR-tagged')) && (($thisHTML.indexOf('### WordPress Environment ###') !== -1) || ($thisHTML.indexOf('WordPress environment') !== -1)) && (($thisHTML.indexOf('### Server Environment ###') !== -1) || ($thisHTML.indexOf('Server environment') !== -1))) {
            $thisMessage.addClass('SSR-tagged').attr('data-ssr',thisSSRid).wrapInner('<div id="ssr-contents-'+thisSSRid+'"></div>');
            $thisMessage.append('<a href="#" class="open-SSR" data-ssr="'+thisSSRid+'" style="font-size: 16px;">Open SSR in popup</a>');
            $thisMessage.append('<a href="#" class="copy-SSR" id="copy-'+thisSSRid+'" data-ssr="'+thisSSRid+'" style="font-size: 16px;">Copy SSR to clipboard</a>');
        }
    });
}

// === WORKING ON THIS, UNDER CONSTRUCTION, GEOCITIES/ANGELFIRE/AOL =====================================
// function sidebarButtons () {
    //var lastSSR;
    //$('.ReactVirtualized__Grid__innerScrollContainer .SSR-tagged').each(function(message) {
    //    lastSSR = $(this).attr('data-ssr');
    //});

    //if (!$('.user-data-panel__admin-buttons .copy-SSR').length) {
    //    $('.user-data-panel__admin-buttons .copy-SSR,.user-data-panel__admin-buttons .open-SSR').remove();
    //    $('.user-data-panel__admin-buttons').append('<br><a href="#" class="user-data-panel__button button open-SSR" data-ssr="'+lastSSR+'">Open latest SSR</a>');
    //    $('.user-data-panel__admin-buttons').append('<a href="#" class="user-data-panel__button button copy-SSR" id="copy-'+lastSSR+'" data-ssr="'+lastSSR+'">Copy latest SSR to clipboard</a>');
    //}
//}


// === Execute function on load ===================================================
$("body").on('DOMSubtreeModified', ".ReactVirtualized__Grid__innerScrollContainer", function() {
    idSSR();
    addStyles();
});


// === Open the SSR in a popup window  ===================================================
$("body").on('click','.open-SSR', function () {
    $('.ssr-popup').remove();
    var SSRid = $(this).attr('data-ssr');
    var SSRcontents = $('#ssr-contents-'+SSRid).html();
    $('body').append('<div class="ssr-overlay ssr-popup-close"></div>');
    $('body').append('<div class="ssr-popup" id="'+$(this).attr('data-ssr')+'-popup">'+SSRcontents+'</div>');
    $('body').append('<a href="#" class="ssr-popup-close">CLOSE</a>');
    $('body').append('<a href="#" data-ssr="'+SSRid+'" class="ssr-popup-copy copy-SSR">Copy SSR to clipboard</a>');
});


// === Copy the SSR to the clipboard ===================================================
$("body").on('click','.copy-SSR', function () {
    var SSRid = $(this).attr('data-ssr');
    copyToClipboard(document.getElementById('ssr-contents-'+SSRid));
    $(this).html('COPIED!');
    setTimeout(function(){$('.copy-SSR').text('Copy SSR to clipboard')}, 3000);
});


// === Close the SSR popup ===================================================
$("body").on('click','.ssr-popup-close', function () {
    $('.ssr-overlay,.ssr-popup,.ssr-popup-close,.ssr-popup-copy').remove();
});


// === Helper function: copy to clipboard ===================================================
function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function addStyles() {
    // Styles that are specific to this script
    var styles = "<style type='text/css' class='ssr-styles'>.ssr-tagged {position:relative;}.chat__message.chat__message__from-user .chat__message__text a.copy-SSR,.chat__message.chat__message__from-user .chat__message__text a.open-SSR,a.ssr-popup-close,a.ssr-popup-copy {display: block;background:#14acdd;color: #ffffff;padding: 10px 20px;width: auto;float: left;border-radius: 5px;margin: 10px 10px 10px 0;text-decoration: none;text-shadow: -1px -1px 0 #0077bb;cursor:pointer;}.chat__message.chat__message__from-user .chat__message__text a.copy-SSR,.chat__message.chat__message__from-user .chat__message__text a.open-SSR{position: absolute; bottom: 4px; left:17px;}.chat__message.chat__message__from-user .chat__message__text a.copy-SSR {left: 220px;}.chat__message.chat__message__from-user .chat__message__text a.copy-SSR:active,.chat__message.chat__message__from-user .chat__message__text a.open-SSR:active {margin: 11px 9px 9px 1px;}.ssr-overlay {position: fixed;width: 100vw;height: 100vh;background:rgba(0,0,0,0.5);z-index: 98;left: 0;top:0;}.ssr-popup {position: fixed;left: 50px;top: 50px;border: solid 1px #000000;width: calc(100vw - 100px);height: calc(100vh - 100px);background: rgba(255,255,255,0.9);z-index: 99;padding: 15px;overflow: auto;word-wrap: break-word;hyphens: auto;white-space: pre-wrap;font-size: 16px;}a.ssr-popup-close,a.ssr-popup-copy {position: fixed;z-index: 100;right: 80px;top:60px;}a.ssr-popup-copy {top: 110px;}.ssr-popup .chat__message__meta {display: none;}</style>";
    // Attach styles to <head>
    if (!$('.ssr-styles').length) {
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

window.setInterval(function(){
  idSSR();
}, 2500);

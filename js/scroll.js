/**
 * JavaScript Scroll library
 * @version 0.1
 * @autor Alexey Raspopov
 * @description ...
 */
(function (global, document, HTMLElement) {
    'use strict';
    var isTouch = window.hasOwnProperty('ontouchstart'), events;
    if (isTouch) {
        events = {start: 'touchstart', move: 'touchmove', end: 'touchend'};  
    } else {
        events = {start: 'mousedown', move: 'mousemove', end: 'mouseup'};
    }
    function getElement(selector) {
        var element;
        if (typeof selector === 'string') {
            if (/[\*\.\#\>\+\:\s\[\]\(\)]/.test(selector)) {
                element = document.querySelector(selector);
            } else {
                element = document.getElementById(selector) || document.getElementsByTagName(selector)[0];
            }
        } else if (selector instanceof HTMLElement) {
            element = selector;
        }
        return element;
    }
    function Scroll(element, options) {
        var option, style;
        this.element = getElement(element);
        this.options = {
            hScrollbar: false,
            vScrollbar: false,
            fadeScrollbars: true,
            checkDOMChanges: true,
            bounce: false,
            snap: false,
            momentum: false,
            onScrollEnd: function () {}
        };
        if (!this.element || (options && !(options instanceof Object))) {
            throw new TypeError('Arguments are not valid');
        }
        for (option in options) {
            if (options.hasOwnProperty(option)) {
                this.options[option] = options[option];
            }
        }
        this.onScrollEnd = this.options.onScrollEnd;
        delete this.options.onScrollEnd;
        style = this.element.style;
        style.webkitTransitionProperty = '-webkit-transform';
        style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.25, 1)';
        style.webkitTransitionDuration = '0';
        style.webkitTransform = 'translate(0px, 0px)';
        [events.start, events.move, events.end].forEach(function (eventName) {
            this.element.addEventListener(eventName, this, false);
        }, this);
        if (this.options.checkDOMChanges) {
            this.element.addEventListener('DOMSubtreeModified', this, false);
        }
        window.addEventListener('resize', this, false);
        this.isScroll = false;
        this.isEnable = true;
    }
    Scroll.prototype.handleEvent = function (event) {
        var type = event.type;
        if (isTouch) {
            event = event.changedTouches[0];
        }
        switch (type) {
        case events.start:
            if (this.isEnable) {
                this.startEvent(event);
            }
            break;
        case events.move:
            if (this.isScroll) {
                this.moveEvent(event);
            }
            break;
        case events.end:
            this.endEvent(event);
            break;
        case 'DOMSubtreeModified':
        case 'resize':
            this.refresh();
            break;
        }
    };
    Scroll.prototype.startEvent = function (event) {
        
    };
    Scroll.prototype.moveEvent = function (event) {
        
    };
    Scroll.prototype.endEvent = function (event) {
        
    };
    Scroll.prototype.refresh = function () {
        
    };
    global.Scroll = Scroll;
})(window, document, HTMLElement);
/**
 * JavaScript Scroll library
 * @version 0.1
 * @autor Alexey Raspopov
 * @description ...
 */
(function (global, document, HTMLElement, HTMLInputElement) {
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
        this.setTranslate(0, 0);
        [events.start, events.move, events.end].forEach(function (eventName) {
            this.element.addEventListener(eventName, this, false);
        }, this);
        if (this.options.checkDOMChanges) {
            this.element.addEventListener('DOMSubtreeModified', this, false);
        }
        window.addEventListener('resize', this, false);
        this.isScroll = false;
        this.isEnable = true;
        this.refresh();
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
        event.stopPropagation();
        if (!(event.target instanceof HTMLInputElement)) {
            event.preventDefault();
        }
        this.isScroll = true;
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.startTranslate = this.getTranslate();
    };
    Scroll.prototype.moveEvent = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    Scroll.prototype.endEvent = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.isScroll = false;
    };
    Scroll.prototype.getTranslate = function () {
        var translate = /translate\(([\-0-9]+)px,\s([\-0-9]+)px\)/.exec(this.element.style.webkitTransform);
        if (translate) {
            return translate.slice(1).map(function (coord) {
                return parseInt(coord, 10);
            });
        }
        return [0, 0];
    };
    Scroll.prototype.setTranslate = function (x, y) {
        this.element.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)';
    };
    Scroll.prototype.refresh = function () {
        var parent = this.element.parentNode;
        this.scrollWidth = parent.clientWidth;
        this.scrollHeight = parent.clientHeight;
        this.scrollerWidth = this.element.offsetWidth;
        this.scrollerHeight = this.element.offsetHeight;
        this.canScrollX = this.scrollerWidth > this.scrollWidth;
        this.canScrollY = this.scrollerHeight > this.scrollHeight;
        this.maxScrollX = this.scrollWidth - this.scrollerWidth;
        this.maxScrollY = this.scrollHeight - this.scrollerHeight;
    };
    global.Scroll = Scroll;
})(window, document, HTMLElement, HTMLInputElement);
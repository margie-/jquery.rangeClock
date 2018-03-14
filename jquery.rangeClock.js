/* Created by margie on 2018/3/10.
 rangeClock.js
 v1.0
 以时钟形式展示已占用时段，支持多个间隔时段
 */
;(function ($) {
    'use strict';

    var rangeClockCanvas = function (elem, options) {
        this.$calendar = elem;
        this.defaults = {
            width: 122,   // 宽
            height: 122, // 高
            radius: 61, // 表盘半径
            arcArgs: {
                times: [{s: 3, e: 6}], // 起止时间，可以为多个如[{s: 3, e: 6},{s: 3, e: 6}]
                color: '#e9e9e9' // 扇形颜色
            },
            hourColor: '#000',  // 时钟刻度
            minuteColor: '#a6a6a6',  // 分钟刻度颜色
            faceDotColor: '#6ec8c8',  // 中间点颜色
            dotBgColor: '#bee7e7' // 中间点背景颜色
        };
        this.opts = $.extend(true, {}, this.defaults, options);
        this.ctx = this.$calendar[0].getContext('2d');
    };

    rangeClockCanvas.prototype = {
        // 获取屏幕ratio
        getPixelRatio: function () {
            var _ctx = this.ctx,
                backingStore = _ctx.backingStorePixelRatio ||
                    _ctx.webkitBackingStorePixelRatio ||
                    _ctx.mozBackingStorePixelRatio ||
                    _ctx.msBackingStorePixelRatio ||
                    _ctx.oBackingStorePixelRatio ||
                    _ctx.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        },

        //绘制扇形/圆形方法
        drawSector: function (offsetX, offsetY, radius, color, sAngle, eAngle) {
            var _ctx = this.ctx;
            _ctx.fillStyle = color;
            _ctx.save();
            _ctx.beginPath();
            _ctx.moveTo(offsetX, offsetY);
            _ctx.arc(offsetX, offsetY, radius, sAngle * Math.PI / 180, eAngle * Math.PI / 180, false);
            _ctx.closePath();
            _ctx.restore();
            _ctx.fill();
        },

        // 绘制刻度方法 type 2种值 hour , minute
        drawDial: function (offsetX, offsetY, radius, width, length, color, type) {
            var _ctx = this.ctx, stepLen, step;
            switch (type) {
                case 'hour':  //绘制表盘时钟刻度
                    step = 12;
                    stepLen = 360 / step;
                    break;
                case 'minute':  //绘制表盘分钟刻度
                    step = 60;
                    stepLen = 360 / step;
                    break;
            }
            for (var i = 0; i < step; i++) {
                _ctx.save();
                _ctx.beginPath();
                _ctx.translate(offsetX, offsetY);
                _ctx.rotate(i * stepLen * Math.PI / 180);
                _ctx.strokeStyle = color;
                _ctx.lineWidth = width;
                _ctx.moveTo(0, -radius);
                _ctx.lineTo(0, -radius + length);
                _ctx.stroke();
                _ctx.closePath();
                _ctx.restore();
            }
        },

        // 初始化画布
        renderDom: function () {
            var ratio = this.getPixelRatio(),
                _canvas = this.$calendar;

            // 设置画布宽高解决高清屏下绘制模糊问题
            _canvas.attr('width', this.opts.width * ratio);
            _canvas.attr('height', this.opts.height * ratio);
            _canvas.css({'width': this.opts.width, 'height': this.opts.height});
            this.ctx.scale(ratio, ratio);
        },

        // 绘制表
        initalCanvas: function () {
            var _options = this.opts,
                x = _options.width / 2,
                y = _options.height / 2,
                _arc = _options.arcArgs,
                _times = _arc.times;
            this.renderDom();

            //绘制时段
            for (var i = 0; i < _times.length; i++) {
                var sAngel = _times[i].s * 30 - 90, eAngel = _times[i].e * 30 - 90;   // 时间转换成角度值，3点为0度
                this.drawSector(x, y, _options.radius - 9, _arc.color, sAngel, eAngel);
            }

            // 绘制表盘
            this.drawDial(x, y, _options.radius, 2, 8, _options.minuteColor, 'minute');
            this.drawDial(x, y, _options.radius, 3, 15, _options.hourColor, 'hour');
            this.drawSector(x, y, 4, _options.dotBgColor, 0, 360);
            this.drawSector(x, y, 2, _options.faceDotColor, 0, 360);

        },
        constructor: rangeClockCanvas
    };

    $.fn.extend({
        rangeClock: function (options) {
            var _canvas = new rangeClockCanvas(this, options);
            _canvas.initalCanvas();
            return this.each(function () {

            });
        }
    });

})(jQuery);

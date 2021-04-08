"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var resultFreq = document.querySelector('.value--freq');
var resultTime = document.querySelector('.value--time');
var resultCycleCount = document.querySelector('.value--count');
var resultCoord = document.querySelector('.value--coord');
var reqAnimation = document.querySelectorAll('.req-show');
var canvas = document.querySelector('#model');
var ctx = canvas.getContext('2d');
var h = canvas.height;
var w = canvas.width;
ctx.translate(w / 2, 0);

var SpringPendulum = /*#__PURE__*/function () {
  function SpringPendulum(canvasCtx) {
    _classCallCheck(this, SpringPendulum);

    this._drawing = false;
    this._mass = 0.5; // Масса груза 0.5-1 d0.1

    this._k = 5; // Жесткость пружины 5-9 d1

    this._x = 10; // Первоначальное отклонение 0-20 d2

    this.distanceFromSupport = 30; // расстояние от подвеса

    this.heightSupport = 10; // расстояние от верхв до подвеса

    this.scale = 7;
    this.t = 0;
    this.dt = 1 / 120;
    this.canvas = canvasCtx;
    this.calculateFreq();
    this.calculateCargoDiameter();
    this.draw();
  }

  _createClass(SpringPendulum, [{
    key: "drawing",
    get: function get() {
      return this._drawing;
    },
    set: function set(value) {
      this._drawing = value;
      disabledSettings();

      if (value) {
        this.timeStart = null;
        this.t = 0;
        reqAnimation.forEach(function (el) {
          el.classList.remove('hide');
        });
        cancelAnimationFrame(this.animFreme);
        this.draw();
      } else {
        reqAnimation.forEach(function (el) {
          el.classList.add('hide');
        });
      }
    }
  }, {
    key: "mass",
    get: function get() {
      return this._mass;
    },
    set: function set(value) {
      this._mass = +value;
      this.t = 0;
      this.calculateFreq();
      this.calculateCargoDiameter();
      this.draw();
    }
  }, {
    key: "k",
    get: function get() {
      return this._k;
    },
    set: function set(value) {
      this._k = +value;
      this.t = 0;
      this.calculateFreq();
      this.draw();
    }
  }, {
    key: "x",
    get: function get() {
      return this._x;
    },
    set: function set(value) {
      this._x = +value;
      this.t = 0;
      this.draw();
    }
  }, {
    key: "calculateFreq",
    value: function calculateFreq() {
      this.freq = Math.sqrt(this.k / this.mass);
      resultFreq.textContent = this.freq.toFixed(2);
    }
  }, {
    key: "calculateCargoDiameter",
    value: function calculateCargoDiameter() {
      this.cargoDiameter = Math.cbrt(this.mass) * 20;
    }
  }, {
    key: "calculatePos",
    value: function calculatePos() {
      var coord = this.x * Math.pow(Math.cos(this.freq * this.t), 2);
      resultCoord.textContent = coord.toFixed(1);
      this.posCenterCargo = coord * this.scale + this.distanceFromSupport + this.heightSupport;
    }
  }, {
    key: "drawCargo",
    value: function drawCargo() {
      this.canvas.beginPath();
      this.canvas.arc(0, this.posCenterCargo, this.cargoDiameter / 2, 0, 2 * Math.PI);
      this.canvas.stroke();
    }
  }, {
    key: "drawSupport",
    value: function drawSupport() {
      this.canvas.beginPath();
      this.canvas.moveTo(-20, this.heightSupport);
      this.canvas.lineTo(20, this.heightSupport);
      this.canvas.stroke();
    }
  }, {
    key: "drawSpring",
    value: function drawSpring() {
      var distanceToTurn = this.heightSupport + this.distanceFromSupport * 0.2; // расстояние до изгиба пружины

      var diameterSpring = 5;
      var lengthCargoMount = 5;
      var turnCount = 8;
      var turnHeight = (this.posCenterCargo - this.cargoDiameter / 2 - lengthCargoMount - distanceToTurn) / (turnCount + 1);
      this.canvas.beginPath();
      this.canvas.moveTo(0, this.heightSupport);
      this.canvas.lineTo(0, distanceToTurn);

      for (var i = 0; i < turnCount; i++) {
        distanceToTurn += turnHeight;
        this.canvas.lineTo(diameterSpring * (i % 2 ? 1 : -1), distanceToTurn);
      }

      this.canvas.lineTo(0, this.posCenterCargo - this.cargoDiameter / 2 - lengthCargoMount);
      this.canvas.lineTo(0, this.posCenterCargo - this.cargoDiameter / 2);
      this.canvas.stroke();
    }
  }, {
    key: "calculateTime",
    value: function calculateTime(time) {
      if (!this.timeStart) this.timeStart = time;
      this.timeFromStart = (time - this.timeStart) / 1000;
      resultTime.textContent = this.timeFromStart.toFixed(1);
    }
  }, {
    key: "calculateCycleCnt",
    value: function calculateCycleCnt() {
      resultCycleCount.textContent = Math.floor(this.timeFromStart / (2 * Math.PI / this.freq));
    }
  }, {
    key: "draw",
    value: function draw() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.canvas.clearRect(-w / 2, 0, w, h);
      this.calculateTime(time);
      this.calculateCycleCnt();
      this.calculatePos();
      this.drawSupport();
      this.drawSpring();
      this.drawCargo();

      if (this.drawing) {
        this.t += this.dt;
        this.animFreme = requestAnimationFrame(this.draw.bind(this));
      }
    }
  }]);

  return SpringPendulum;
}();

var pendulum = new SpringPendulum(ctx);
var animationView = document.querySelector('.main__view-model');
animationView.addEventListener('click', function (e) {
  if (e.target.closest('.button--start')) {
    document.querySelector('.button--start').classList.add('hide');
    document.querySelector('.button--stop').classList.remove('hide');
    pendulum.drawing = true;
  }

  if (e.target.closest('.button--stop')) {
    document.querySelector('.button--stop').classList.add('hide');
    document.querySelector('.button--start').classList.remove('hide');
    pendulum.drawing = false;
  }
});
var massSetting = document.querySelector('#mass');
var hardSetting = document.querySelector('#hard');
var deltaSetting = document.querySelector('#delta');
massSetting.value = pendulum.mass;
hardSetting.value = pendulum.k;
deltaSetting.value = pendulum.x;
massSetting.addEventListener('change', function (e) {
  pendulum.mass = e.target.value;
});
hardSetting.addEventListener('change', function (e) {
  pendulum.k = e.target.value;
});
deltaSetting.addEventListener('change', function (e) {
  pendulum.x = e.target.value;
});

function disabledSettings() {
  massSetting.toggleAttribute('disabled');
  hardSetting.toggleAttribute('disabled');
  deltaSetting.toggleAttribute('disabled');
}
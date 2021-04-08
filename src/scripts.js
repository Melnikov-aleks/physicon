const resultFreq = document.querySelector('.value--freq');
const resultTime = document.querySelector('.value--time');
const resultCycleCount = document.querySelector('.value--count');
const resultCoord = document.querySelector('.value--coord');

const reqAnimation = document.querySelectorAll('.req-show');

const canvas = document.querySelector('#model');
const ctx = canvas.getContext('2d');

const h = canvas.height;
const w = canvas.width;
ctx.translate(w / 2, 0);

class SpringPendulum {
  constructor(canvasCtx) {
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

  get drawing() {
    return this._drawing;
  }
  set drawing(value) {
    this._drawing = value;
    disabledSettings();
    if (value) {
      this.timeStart = null;
      this.t = 0;
      reqAnimation.forEach((el) => {
        el.classList.remove('hide');
      });
      cancelAnimationFrame(this.animFreme);
      this.draw();
    } else {
      reqAnimation.forEach((el) => {
        el.classList.add('hide');
      });
    }
  }

  get mass() {
    return this._mass;
  }
  set mass(value) {
    this._mass = +value;
    this.t = 0;
    this.calculateFreq();
    this.calculateCargoDiameter();
    this.draw();
  }

  get k() {
    return this._k;
  }
  set k(value) {
    this._k = +value;
    this.t = 0;
    this.calculateFreq();
    this.draw();
  }

  get x() {
    return this._x;
  }
  set x(value) {
    this._x = +value;
    this.t = 0;
    this.draw();
  }

  calculateFreq() {
    this.freq = Math.sqrt(this.k / this.mass);
    resultFreq.textContent = this.freq.toFixed(2);
  }

  calculateCargoDiameter() {
    this.cargoDiameter = Math.cbrt(this.mass) * 20;
  }

  calculatePos() {
    const coord = this.x * Math.pow(Math.cos(this.freq * this.t), 2);
    resultCoord.textContent = coord.toFixed(1);
    this.posCenterCargo =
      coord * this.scale + this.distanceFromSupport + this.heightSupport;
  }

  drawCargo() {
    this.canvas.beginPath();
    this.canvas.arc(0, this.posCenterCargo, this.cargoDiameter / 2, 0, 2 * Math.PI);
    this.canvas.stroke();
  }

  drawSupport() {
    this.canvas.beginPath();
    this.canvas.moveTo(-20, this.heightSupport);
    this.canvas.lineTo(20, this.heightSupport);
    this.canvas.stroke();
  }

  drawSpring() {
    let distanceToTurn = this.heightSupport + this.distanceFromSupport * 0.2; // расстояние до изгиба пружины
    const diameterSpring = 5;
    const lengthCargoMount = 5;
    const turnCount = 8;
    const turnHeight =
      (this.posCenterCargo - this.cargoDiameter / 2 - lengthCargoMount - distanceToTurn) /
      (turnCount + 1);
    this.canvas.beginPath();
    this.canvas.moveTo(0, this.heightSupport);
    this.canvas.lineTo(0, distanceToTurn);
    for (let i = 0; i < turnCount; i++) {
      distanceToTurn += turnHeight;
      this.canvas.lineTo(diameterSpring * (i % 2 ? 1 : -1), distanceToTurn);
    }
    this.canvas.lineTo(
      0,
      this.posCenterCargo - this.cargoDiameter / 2 - lengthCargoMount
    );
    this.canvas.lineTo(0, this.posCenterCargo - this.cargoDiameter / 2);
    this.canvas.stroke();
  }

  calculateTime(time) {
    if (!this.timeStart) this.timeStart = time;
    this.timeFromStart = (time - this.timeStart) / 1000;
    resultTime.textContent = this.timeFromStart.toFixed(1);
  }

  calculateCycleCnt() {
    resultCycleCount.textContent = Math.floor(
      this.timeFromStart / ((2 * Math.PI) / this.freq)
    );
  }

  draw(time = 0) {
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
}

const pendulum = new SpringPendulum(ctx);

const animationView = document.querySelector('.main__view-model');

animationView.addEventListener('click', (e) => {
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

const massSetting = document.querySelector('#mass');
const hardSetting = document.querySelector('#hard');
const deltaSetting = document.querySelector('#delta');

massSetting.value = pendulum.mass;
hardSetting.value = pendulum.k;
deltaSetting.value = pendulum.x;

massSetting.addEventListener('change', (e) => {
  pendulum.mass = e.target.value;
});
hardSetting.addEventListener('change', (e) => {
  pendulum.k = e.target.value;
});
deltaSetting.addEventListener('change', (e) => {
  pendulum.x = e.target.value;
});

function disabledSettings() {
  massSetting.toggleAttribute('disabled');
  hardSetting.toggleAttribute('disabled');
  deltaSetting.toggleAttribute('disabled');
}

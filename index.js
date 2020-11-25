var fs = require("fs");
const Gpio = require('pigpio').Gpio;
const fan = new Gpio(18, { mode: Gpio.OUTPUT });
const io = require('@pm2/io')

const Temperature = io.metric({
  name: 'Temperature',
  type: 'histogram',
  measurement: 'mean'
});

const Speed = io.metric({
  name: 'Speed',
  type: 'histogram',
  measurement: 'mean'
});

setInterval(() => {
  let temp = Math.round((fs.readFileSync('../../../../sys/class/thermal/thermal_zone0/temp').toString()) / 1000)
  Temperature.set(temp);

  if (temp < 45) {
    fan.pwmWrite(50)
    Speed.set((50 / 255) * 100)
  } else if (temp > 70) {
    fan.pwmWrite(255)
    Speed.set((255 / 255) * 100)
  } else {
    let step = 3.2
    let speed = Math.round((100) + ((temp - 45) * step))
    fan.pwmWrite(speed)
    Speed.set((speed / 255) * 100)
  }
}, 10000);


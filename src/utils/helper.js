// 生成当前时间
function getTime () {
  return new Date().getTime();
}

export const ajax = (url, payload) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand > 0.6) {
        resolve(`${url} > ${getTime()} - [${payload}] # random number is ${rand.toFixed(4)}`);
      } else {
        reject(new Error(`${url} > ${getTime()} - [${payload}] # failed, please retry`));
      }
    }, 500)
  })
}

export const isType = (obj, type) => Object.prototype.toString.call(obj) === `[object ${type}]`;
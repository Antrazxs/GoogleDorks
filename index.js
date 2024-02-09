const utils = require("utils");
const fs = require("fs");
const colors = require("colors");
const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.setMaxListeners(0);
const axios = require("axios");
const throttledQueue = require("throttled-queue");
let throttle = throttledQueue(15, 1000);
let dork = "teste";
let total = 0;
let indice = 0;
const geral = 0;
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}
let l = 0;
let u = 0;
let b = 0;
let i = 0;
let inject = 0;
let ni = 0;
let regex =
  /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
async function google(dork, ip, port) {
  try {
    let url = `http://www.google.com/search?num=100&q=${dork}`;

    const reqGoogle = await axios.get(url, {
      proxy: {
        host: ip,
        port: port,
      },
    });
    indice++;
    let arrayGoogle = reqGoogle.data.split("url?q=");
    arrayGoogle.shift();
    arrayGoogle.pop();
    arrayGoogle.pop();
    for (HTML of arrayGoogle) {
      let URL = HTML.split(";")[0];
      let link = decodeURIComponent(URL).replace("&amp", "");
      if (regex.test(link)) {
        l++;
        if (
          link.indexOf("youtube") < 0 &&
          link.indexOf("winkipedia") < 0 &&
          link.indexOf("google") < 0 &&
          link.indexOf("stackoverflow") < 0 &&
          link.indexOf("microsoft") < 0 &&
          link.indexOf("facebook") < 0
        ) {
          u++;
          if (link.indexOf("=") > 0 && link.indexOf("?") > 0) {
            inject++;
            console.log(`[PARAMS INJECTABLE] => ${link}`.green);
            if (link.indexOf("&") > 0) {
              let link_filtred = link.split("&")[0];
              fs.appendFile(
                `./key/ResultValid_FILTRED.txt`,
                `${link_filtred}` + "\n",
                () => {}
              );
            } else {
              fs.appendFile(
                `./key/ResultValid.txt`,
                `${link}` + "\n",
                () => {}
              );
            }
          } else {
            ni++;
            console.log(`[N/PARAMS INJECTABLE] => ${link}`.yellow);
            fs.appendFile(`./key/NaoInjetavel.txt`, `${link}` + "\n", () => {});
          }
        } else {
          b++;
          console.log(`[BLACKLIST] => `.yellow + `${link}`.red);
          fs.appendFile(`./key/Blacklist.txt`, `${link}` + "\n", () => {});
        }
        fs.appendFile(`./key/Result.txt`, `${link}` + "\n", () => {});
      } else {
        i++;
        console.log("[URL INVALIDA] => ".yellow + link);
      }
    }
    total++;
    const notify =
      " [EXTRACTED: " +
      `${arrayGoogle.length}`.yellow +
      " |" +
      ` VALID: ${u}`.green +
      "] BALANCE: " +
      `INJETABLE: [${inject}]`.green +
      " |" +
      ` N\/INJETABLE: ${ni}`.red +
      " |" +
      ` BLACKLIST: ${b} `.red +
      " |" +
      ` INVALID: ${i}`.red +
      ` [DORKs:${total}|${lista.length}]`.yellow +
      ` DORK: ${dork} `;
    console.log();
    console.log(notify);
    console.log();
  } catch (e) {
    console.log("ERRO CONEXAO ENCERADA! :/".yellow);
    fs.appendFile(`./key/ERROS.txt`, `${dork}` + "\n", () => {});
  }
}
let min = 200;
let max = 700;
let pmin = 700;
let pmax = 2000;
console.log();
const lista = fs.readFileSync("./dorks.txt", { encoding: "utf-8" }).split("\n");
const proxy = fs.readFileSync("./proxy.txt", { encoding: "utf-8" }).split("\n");
async function checker() {
  console.log(`GOOGLE DORK INICIADO AGUARDE....`.green);
  await delay(2000);
  let stop = 0;
  for (ips of proxy) {
    for (dork of lista) {
      google(dork, ips, "3128");
      await delay(300);
    }
  }
}
checker();

import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
import cookieParser from "cookie-parser";
import axios from "axios";
import router from "./routes/admin.routes.js";
import connectDB from "./config/db.js";
import User from "./Models/User.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const token = "6189804167:AAHCfrqwkSfqFOoaTdav7eBweP5_EaaANcM";

const bot = new TelegramBot(token, { polling: true });

let name;
let time, quantity, type, amount;

//time , currency , quantity
app.put("/api", function (req, res) {
  time = req.body.time ? req.body.time : null;
  amount =
    req.body.price == "Rupees"
      ? 82
      : req.body.price == "Euros"
      ? 0.94
      : req.body.price == "Pounds"
      ? 0.838
      : null;
  type =
    req.body.price == "Rupees"
      ? "Rupees"
      : req.body.price == "Euros"
      ? "Euros"
      : req.body.price == "Pounds"
      ? "Pounds"
      : null;

  quantity = req.body.quantity ? req.body.quantity : null;
  console.log(amount, time, quantity);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome Shreyas. Please provide your details to register yourself to recieve updates on Iphone Prices."
  );
});

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Congratulations " +
      name +
      "You are now a Subscribed member. Do you want to get the latest Iphone Prices ? Please type Yes/No"
  );
});

bot.onText(/\/Yes/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, name + " Your Iphone Prices are being fetched...");
  const prices = [];

  setInterval(
    async () => {
      const options = {
        method: "GET",
        url: "https://bestbuy-product-data.p.rapidapi.com/bestbuy/",
        params: { page: "1", keyword: "iphone" },
        headers: {
          "X-RapidAPI-Key":
            "4604a35cb9msh29a77d203ad9788p1064b8jsna7e6e642c483",
          "X-RapidAPI-Host": "bestbuy-product-data.p.rapidapi.com",
        },
      };

      // const options = {
      //   method: "GET",
      //   url: "https://bestbuy-product-data-api.p.rapidapi.com/bestbuy/",
      //   params: { page: "1", keyword: "iphone" },
      //   headers: {
      //     "X-RapidAPI-Key":
      //       "4604a35cb9msh29a77d203ad9788p1064b8jsna7e6e642c483",
      //     "X-RapidAPI-Host": "bestbuy-product-data-api.p.rapidapi.com",
      //   },
      // };

      await axios
        .request(options)
        .then(function (response) {
          try {
            let len = quantity ? quantity : response.data.length;

            for (var i = 0; i < len; i++) {
              prices.push({
                Title: response.data[i].title,
                Color: response.data[i].color,
                price: response.data[i].price,
                Rating: response.data[i].rating,
              });
            }
            let type_123 = type ? type : " ";
            for (let i = 0; i < len; i++) {
              let converted_price;
              if (amount) {
                converted_price = parseInt(prices[i].price.substring(1), 10);
                converted_price = amount
                  ? converted_price * amount
                  : converted_price;
              } else {
                converted_price = prices[i].price;
              }
              bot.sendMessage(
                chatId,
                "Iphone Name - " +
                  prices[i].Title +
                  "\n" +
                  "Color - " +
                  prices[i].Color +
                  "\n" +
                  "Price - " +
                  converted_price +
                  " " +
                  type_123 +
                  "\n" +
                  "Reviews - " +
                  prices[i].Rating
              );
            }
          } catch (err) {
            console.log(err);
          }
          console.log(prices.length);
        })
        .catch(function (error) {
          console.error(error);
          bot.sendMessage(
            chatId,
            "You have exceeded the maximum requests per minute. Please wait for a while and try again"
          );
        });
    },
    time ? time : 5
  );
});

bot.onText(/\/No/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Okay. You can get prices of Iphone when you need.");
});

bot.onText(/\/details/, async (msg) => {
  const chatId = msg.chat.id;
  const details = msg.text.split(" ");
  console.log(details);
  let second;
  let number;
  let emailid, activity_status123, position;
  for (var i = 0; i < details.length; i++) {
    if (i == 1) {
      name = details[i];
    } else if (i == 2) {
      second = details[i];
    } else if (i == 3) {
      number = details[i];
    } else if (i == 4) {
      emailid = details[i];
    } else if (i == 5) {
      activity_status123 = parseInt(details[i]);
    } else if (i == 6) {
      position = details[i];
    }
  }
  let x = Number(number);
  console.log(name, second, x, emailid);
  const user = await User.create({
    firstName: name,
    lastName: second,
    phoneNumber: x,
    email: emailid,
    activity_status:activity_status123,
    position:position
  });
  console.log(user);
  bot.sendMessage(
    chatId,
    "That's Great " +
      name +
      " .Now please type /subscribe command to get subscribed !"
  );
});

app.get("/", (req, res, next) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Catalyst's API health check :: GOOD",
    timestamp: Date.now(),
  });
});

app.use("/api/admin", router);
export default app;

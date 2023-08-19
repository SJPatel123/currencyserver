import Express from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = Express();

app.use(Express.json());
app.use(bodyParser.json());
app.use(cors());

import axios from 'axios';
import bodyParser from 'body-parser';

const api_key = process.env.CURR_API_KEY;
const get_curr_url = process.env.GET_CURR_URL;
const convert_curr_url = process.env.CONVERT_CURR_URL;
const rpd_api_host = process.env.RPD_API_HOST;
// console.log(apiKey);

app.get("/get-currencies", bodyParser.json(), async (req, res) => {
  const options_currencies = {
    method: 'GET',
    url: `${get_curr_url}`,
    headers: {
      'X-RapidAPI-Key': `${api_key}`,
      'X-RapidAPI-Host': `${rpd_api_host}`
    }
  };
  
  var objectArr = [];
  
  try {
    const response_cuurencies = await axios.request(options_currencies);
    const resultObj = response_cuurencies.data;
    const res_keys_obj = resultObj['result'];
    const res_keys = Object.keys(res_keys_obj);
    const res_values = Object.values(res_keys_obj);
  
    res_keys.map((key_item, index) => {
      const obj = {
        value: key_item,
        label: key_item+': '+res_values[index]
      }
      objectArr.push(obj);
    });
    res.send(objectArr);
    const key = (objectArr[0].label).split(':')[0];
    // console.log(key);
  } catch (error) {
    console.error(error);
  }
});

app.get('/convert-currency', async (req, res) => {
  const { selectedOptionFromCountry, selectedOptionToCountry, amount } = req.query;

  // console.log("Country-1: ",selectedOptionFromCountry['value']);
  // console.log("Country-2: ",selectedOptionToCountry['value']);
  // console.log("Amount: ",amount);

  const options_convert_currency = {
    method: 'GET',
    url: `${convert_curr_url}`,
    params: {
      from: selectedOptionFromCountry['value'],
      to: selectedOptionToCountry['value'],
      amount: amount
    },
    headers: {
      'X-RapidAPI-Key': `${api_key}`,
      'X-RapidAPI-Host': `${rpd_api_host}`
    }
  };
  
  try {
    const response = await axios.request(options_convert_currency);
    const res_data = response.data;
    const amount = `${res_data['result']} ${selectedOptionToCountry['value']}`;
    res.json(amount);
    console.log(amount);
  } catch (error) {
    console.error(error);
  }
});

const port = 3001; // Change this to the desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

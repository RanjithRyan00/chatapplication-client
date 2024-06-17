import { useState } from "react";
import axios from "axios";

const useTranslate = () => {
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState(null);

  const translate = async (text, fromLang , toLang) => {
    try {
      const options = {
        method: "POST",
        url: "https://rapid-translate-multi-traduction.p.rapidapi.com/t",
        headers: {
		'x-rapidapi-key': '062b7d0c16msha8af22b9fb2e623p14283cjsne7e10dea050c',
		'x-rapidapi-host': 'rapid-translate-multi-traduction.p.rapidapi.com',
		'Content-Type': 'application/json'
	},
        data: {
          from: fromLang ? fromLang : "en" ,
          to: toLang ? toLang : "ta",
          q: text,
        },
      };
      const response = await axios.request(options);
      console.log("Response from the Server:", response.data[0]);
      setTranslatedText(response.data[0]);
      return response.data[0];
    } catch (err) {
      setError(err);
    }
  };

  return { translatedText, error, translate };
};

export default useTranslate;

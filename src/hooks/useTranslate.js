import { useState } from "react";
import axios from "axios";

const useTranslate = () => {
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState(null);

  const translate = async (text, fromLang = "en", toLang = "ta") => {
    try {
      const options = {
        method: "POST",
        url: "https://rapid-translate-multi-traduction.p.rapidapi.com/t",
        headers: {
          "x-rapidapi-key":
            "6119bad592msh840927163e31241p1f90d7jsn877086212290",
          "x-rapidapi-host": "rapid-translate-multi-traduction.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          from: fromLang,
          to: toLang,
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

import { useState, useEffect } from "react";
import axios from "axios";

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(`https://restcountries.com/v3.1/name/${name}`)
        .then((response) => {
          setCountry({ data: response.data[0], found: true });
        })
        .catch(() => {
          setCountry({ found: false });
        });
    }
  }, [name]);

  return country;
};

export default useCountry;

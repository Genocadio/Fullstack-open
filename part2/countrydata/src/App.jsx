/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import countries from './services/countries.js';
import { getWeather, getCityKey } from './services/weather';

//component to display weather data

const Printweather = ({ weatherData }) => {
  console.log('weatherData:', weatherData); // Log the 'weatherData' variable
  if (!weatherData) {
    return <div>No weather data available</div>;
  }
  const { Headline, DailyForecasts } = weatherData;
  if (!Headline || !DailyForecasts || DailyForecasts.length === 0) {
    return <div>No weather data available</div>;
  }
  const { Text, Category, MobileLink, Link } = Headline;
  const forecast = DailyForecasts[0];
  const { Date, Temperature, Day, Night } = forecast;
  return (
    <div>
      <h2>{Text}</h2>
      <p>Category: {Category}</p>
      <p>Date: {Date}</p>
      <p>Temperature: {Temperature.Minimum.Value}°{Temperature.Minimum.Unit} - {Temperature.Maximum.Value}°{Temperature.Maximum.Unit}</p>
      <p>Day: {Day.IconPhrase}</p>
      <p>Night: {Night.IconPhrase}</p>
      <p>Precipitation: {Night.HasPrecipitation ? `Yes (${Night.PrecipitationType}, ${Night.PrecipitationIntensity})` : 'No'}</p>
      <p>Sources: {forecast.Sources.join(', ')}</p>
      <p>Links: <a href={MobileLink} target="_blank" rel="noopener noreferrer">Mobile Link</a>, <a href={Link} target="_blank" rel="noopener noreferrer">Link</a></p>
    </div>
  );
};

const Weather = ({cityData }) => {

  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    console.log('key: ' + cityData)
    getWeather(cityData)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [cityData.key]);
 // Log the 'data' variable

  return (
    <Printweather weatherData={data} />
  )
      }

const CityKey = ({ city }) => {

  const [cdata, setcData] = useState(null);

  useEffect(() => {
    getCityKey(city)
      .then((res) => {
        setcData(res.data[0].Key);
      })
      .catch(error => {
        console.error(error);
      });
  }, [city]);

  console.log('data:', cdata); // Log the 'data' variable
  return (
    <div className="weather">
      {cdata && <Weather cityData={cdata} />}
      {!cdata && <div>No data</div>}
    </div>
  )
};



//main app component
const App = () => {
  const [countriesList, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filtermsg, setFiltermsg] = useState('');
  const [country, setCountry] = useState({});

  //effect hook to fetch country data from API  
  useEffect(() => {
    countries
    .getAll()
    .then(countries => {
      console.log(countries)
      setCountries(countries)})
    .catch(error => {
      console.error(error);
    });
  }, []);



  //Function to handle show button press
  const handleShow = (country) => {
    setCountry(country);
    setFilteredCountries([])
  };

  //Function to handle search box entry
  const handleChange = (event) => {
    const { value } = event.target;
    console.log(value);
    const filtered = countriesList.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()));
    if (value === '') {
      setFiltermsg('');
      setFilteredCountries([]);
    } else if (filtered.length === 1) {
      const country = filtered[0];
      setFilteredCountries([country]);
      setCountry(country);
      setFiltermsg('');
    } else if (filtered.length <= 10) {
      setFilteredCountries(filtered);
      setFiltermsg('');
      setCountry({});
    } else {
      setFilteredCountries([]);
      setFiltermsg('Too many matches, specify another filter');
      setCountry({});
    }
  }

  // function to show message regarding search results
  const filterMsg = (message) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  // component to dicplay country data
  const Countryinfo = ({ country }) => {
    if (country === null) {
      return null
    }
  
    return (
      <div>
        {Object.keys(country).length > 0 && (
          <>
            <h1>{country.name.common}</h1>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>

            <h2>languages</h2>
            <ul>
              {Object.values(country.languages).map(language => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt="flag" width="200" height="100" />
            <CityKey city={country.capital} />
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <form>
        <div>
        find countries <input type="text" onChange={handleChange} />
        </div>
      </form>
      {filterMsg(filtermsg)}
        <ul>
          {filteredCountries.map(country => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShow(country)}>show</button>
            </li>
          ))}
        </ul>
      <Countryinfo country={country} />
      
    </div>
  )
}

export default App;
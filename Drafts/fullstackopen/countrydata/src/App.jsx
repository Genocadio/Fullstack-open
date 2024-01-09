/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import countries from './services/countries';

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
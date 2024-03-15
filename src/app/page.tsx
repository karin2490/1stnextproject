
"use client";
import Image from "next/image";
import styles from '../styles/page.module.scss';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [query, setQuery] = useState('');
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validInput, setValidInput] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = event.target.value;
    if (/^[a-zA-ZñÑ\s]+$/.test(inputValue) || inputValue === '') {
      setQuery(inputValue);
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setCountryInfo(null); 
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${query}`);
      if (response.data.length === 0) {
        setError('No countries found. Please try again with a different search term.');
      } else {
        setCountryInfo(response.data[0]);
      }
    } catch (error) {
      setError('An error occurred while fetching data. Please try again with a different search term.');
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className={styles.contenedor}>
      <h1>Countries</h1>
      <p>In the next field enter the country name to search.</p>
      <h2>Search Page</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" 
        value={query} 
        onChange={handleChange} 
        placeholder="Search..."
        className={`${styles.input} ${validInput ? '' : styles.invalid}`} 
        />
        <button type="submit" className={styles.button}>Search</button>
      </form>
      {!validInput && <p className={styles.error}>Please enter only letters and spaces.</p>}
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {countryInfo && (
        <div>
          <h2>{countryInfo.name.common}</h2>
          <p>Capital: {countryInfo.capital}</p>
          <p>Population: {countryInfo.population}</p>          
            <Image  src={countryInfo.flags.svg} alt={`Flag of ${countryInfo.name.common}`} width={450} height={300}  />                
        </div>
      )}
    </div>
  );
}

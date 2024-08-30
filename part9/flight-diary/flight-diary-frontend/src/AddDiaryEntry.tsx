import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { DiaryEntry } from './App';
import { Weather, Visibility } from './types';

interface AddDiaryEntryProps {
  addDiary: (newDiary: DiaryEntry) => void;
}

const AddDiaryEntry: React.FC<AddDiaryEntryProps> = ({ addDiary }) => {
  const [newEntry, setNewEntry] = useState<Omit<DiaryEntry, 'id'>>({
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Great,
    comment: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewEntry({
      ...newEntry,
      [name]: value,
    });
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewEntry({
      ...newEntry,
      [name]: value as Weather | Visibility,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<DiaryEntry>('http://localhost:3000/api/diaries', newEntry);
      addDiary(response.data);
      setStatus('Diary entry added successfully!');
      setError(null);
      setNewEntry({ date: '', weather: Weather.Sunny, visibility: Visibility.Great, comment: '' });
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(`Failed to add diary entry: ${err.response.data}`);
      } else {
        setError('An unexpected error occurred.');
      }
      setStatus(null);
    }
  };

  return (
    <div>
      <h2>Add a New Diary Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={newEntry.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Weather:</label>
          <div>
            <label>
              <input type="radio" name="weather" value={Weather.Sunny} checked={newEntry.weather === Weather.Sunny} onChange={handleRadioChange} />
              Sunny
            </label>
            <label>
              <input type="radio" name="weather" value={Weather.Rainy} checked={newEntry.weather === Weather.Rainy} onChange={handleRadioChange} />
              Rainy
            </label>
            <label>
              <input type="radio" name="weather" value={Weather.Cloudy} checked={newEntry.weather === Weather.Cloudy} onChange={handleRadioChange} />
              Cloudy
            </label>
            <label>
              <input type="radio" name="weather" value={Weather.Stormy} checked={newEntry.weather === Weather.Stormy} onChange={handleRadioChange} />
              Stormy
            </label>
            <label>
              <input type="radio" name="weather" value={Weather.Windy} checked={newEntry.weather === Weather.Windy} onChange={handleRadioChange} />
              Windy
            </label>
          </div>
        </div>
        <div>
          <label>Visibility:</label>
          <div>
            <label>
              <input type="radio" name="visibility" value={Visibility.Great} checked={newEntry.visibility === Visibility.Great} onChange={handleRadioChange} />
              Great
            </label>
            <label>
              <input type="radio" name="visibility" value={Visibility.Good} checked={newEntry.visibility === Visibility.Good} onChange={handleRadioChange} />
              Good
            </label>
            <label>
              <input type="radio" name="visibility" value={Visibility.Ok} checked={newEntry.visibility === Visibility.Ok} onChange={handleRadioChange} />
              Ok
            </label>
            <label>
              <input type="radio" name="visibility" value={Visibility.Poor} checked={newEntry.visibility === Visibility.Poor} onChange={handleRadioChange} />
              Poor
            </label>
          </div>
        </div>
        <div>
          <label>Comment:</label>
          <input type="text" name="comment" value={newEntry.comment} onChange={handleChange} required />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      {status && <p>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddDiaryEntry;

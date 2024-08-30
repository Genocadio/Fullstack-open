import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DiaryEntry } from './App';

interface DiaryListProps {
  diaries: DiaryEntry[];
  setDiaries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
}

const DiaryList: React.FC<DiaryListProps> = ({ diaries, setDiaries }) => {
  const [status, setStatus] = useState<string>('Fetching diary entries...');

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await axios.get<DiaryEntry[]>('http://localhost:3000/api/diaries');
        console.log('Diaries fetched:', response.data); 
        setDiaries(response.data);
        setStatus('Diaries fetched successfully!');
      } catch (err) {
        console.error('Error fetching diary entries:', err); 
        setStatus('Failed to fetch diaries.');
      }
    };

    fetchDiaries();
  }, [setDiaries]);

  return (
    <div>
      <h1>Diary Entries</h1>
      {status !== 'Diaries fetched successfully!' ? (
        <p>{status}</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li key={diary.id}>
              <strong>Date:</strong> {diary.date} <br />
              <strong>Visibility:</strong> {diary.visibility} <br />
              <strong>Weather:</strong> {diary.weather} <br />
              <strong>Comment:</strong> {diary.comment} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiaryList;

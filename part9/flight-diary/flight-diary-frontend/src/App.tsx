import React, { useState } from 'react';
import DiaryList from './DiaryList';
import AddDiaryEntry from './AddDiaryEntry';



export interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

const App: React.FC = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const addDiary = (newDiary: DiaryEntry) => {
    setDiaries([...diaries, newDiary]);
  };

  return (
    <div className="App">
      <AddDiaryEntry addDiary={addDiary} />
      <DiaryList diaries={diaries} setDiaries={setDiaries} />
    </div>
  );
};

export default App;

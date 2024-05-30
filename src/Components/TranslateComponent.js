import React, { useState } from 'react';
import useTranslate from '../hooks/useTranslate';

const TranslateComponent = () => {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('ta'); // Default to Telugu
  const { translatedText, error, translate } = useTranslate();

  const handleTranslate = () => {
    translate(inputText, 'en', targetLang);
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="hi">Hindi</option>
        <option value="kn">Kannada</option>
        <option value="ml">Malayalam</option>
        {/* Add more languages as needed */}
      </select>
      <button onClick={handleTranslate}>Translate</button>
      {translatedText && <p>Translated Text: {translatedText}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default TranslateComponent;

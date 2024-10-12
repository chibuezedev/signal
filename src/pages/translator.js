import React from 'react';
import Sidebar from '../components/sidebar';
import Translator from '../components/translator';

const TranslatorMain = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Translator />
      </div>
    </div>
  );
};

export default TranslatorMain;
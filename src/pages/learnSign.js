import React from 'react';
import Sidebar from '../components/sidebar';
import LearnSign from '../components/learnSign';

const TranslatorMain = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <LearnSign />
      </div>
    </div>
  );
};

export default TranslatorMain;
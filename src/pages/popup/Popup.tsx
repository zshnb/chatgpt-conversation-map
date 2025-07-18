import React from 'react';

export default function Popup() {
  const navigateToChatGPT = () => {
    chrome.tabs.create({ url: 'https://chatgpt.com/' });
  };

  return (
    <div className="p-4 w-full text-center">
      <h1 className="text-lg font-bold mb-2">ChatGPT Outline Map</h1>
      <p className="text-sm mb-4">
        This extension helps you navigate long conversations by creating a clickable outline of the discussion.
      </p>
      <button
        onClick={navigateToChatGPT}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to ChatGPT
      </button>
    </div>
  );
}
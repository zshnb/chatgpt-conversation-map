import React from 'react';

export default function Popup() {
  const navigateToChatGPT = () => {
    chrome.tabs.create({ url: 'https://chatgpt.com/' });
  };

  return (
    <div className="p-4 w-full text-center">
      <h1 className="text-lg font-bold mb-2">{chrome.i18n.getMessage('popupTitle')}</h1>
      <p className="text-sm mb-4">
        {chrome.i18n.getMessage('popupDescription')}
      </p>
      <button
        onClick={navigateToChatGPT}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {chrome.i18n.getMessage('popupNavigateButton')}
      </button>
    </div>
  );
}
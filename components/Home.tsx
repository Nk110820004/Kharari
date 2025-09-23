import React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-6 text-center">
      <h1 className="text-2xl font-bold text-white">{t('welcome')}</h1>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        {t('start')}
      </button>
    </div>
  );
};

export default Home;

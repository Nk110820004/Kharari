import React from 'react';
import i18n from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const Button: React.FC<{ code: 'en' | 'hi' | 'ta' | 'ml'; label: string }> = ({ code, label }) => (
    <button
      onClick={() => i18n.changeLanguage(code)}
      className="px-2 py-1 text-xs md:text-sm text-neutral-300 hover:text-blue-400 transition-colors"
      aria-label={`Switch language to ${label}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center space-x-2">
      <Button code="en" label="English" />
      <Button code="hi" label="हिन्दी" />
      <Button code="ta" label="தமிழ்" />
      <Button code="ml" label="മലയാളം" />
    </div>
  );
};

export default LanguageSwitcher;

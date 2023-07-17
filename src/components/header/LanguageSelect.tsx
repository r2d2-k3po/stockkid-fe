import React, {ChangeEvent, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

export default function LanguageSelect() {
  const {i18n} = useTranslation();

  const handleChangeLanguage = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      e.stopPropagation();
      localStorage.setItem('i18nLanguage', e.target.value);
      i18n.changeLanguage(e.target.value);
    },
    [i18n]
  );

  return (
    <select
      className="w-25 select select-ghost select-sm"
      onChange={handleChangeLanguage}
      value={i18n.language}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
}

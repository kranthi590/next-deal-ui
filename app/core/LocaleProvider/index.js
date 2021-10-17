import React, {useEffect} from 'react';
import {ConfigProvider} from 'antd';
import {IntlProvider} from "react-intl";
import {useSelector} from "react-redux";
import AppLocale from "../../../lngProvider";

const LocaleProvider = (props) => {
  const locale = useSelector(({settings}) => settings.locale);
  const isDirectionRTL = useSelector(({settings}) => settings.isDirectionRTL);
  const currentAppLocale = AppLocale[locale.locale];

  useEffect(() => {
    if (locale)
      document.documentElement.lang = locale.locale;
  }, [locale]);

  useEffect(() => {
    if (isDirectionRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.setAttribute('data-direction', 'rtl')
    } else {
      document.documentElement.classList.remove('rtl');
      document.documentElement.setAttribute('data-direction', 'ltr')
    }
  }, [isDirectionRTL]);
  function getLanguage(locale)
  {
    const dash_index = locale.indexOf('-')
    if (dash_index >= 0)
    {
      return locale.substring(0, dash_index)
    }
    return locale
  }
  return (
    <ConfigProvider locale={currentAppLocale.antd} direction={isDirectionRTL ? 'rtl' : 'ltr'}>
      <IntlProvider
          locale={getLanguage(currentAppLocale.locale)}
          defaultLocale={process.env.NEXT_PUBLIC_DEFAULT_LOCALE_LANG}
          onError={() => null}
        messages={currentAppLocale.messages}>{props.children}</IntlProvider>
    </ConfigProvider>
  )
}

export default LocaleProvider;

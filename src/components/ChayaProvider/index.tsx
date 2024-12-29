'use client';
import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
import Color from 'color';

import ChayaContext, { IconWrapperType, LinkWrapper } from '../../contexts/ChayaContext';
import { Theme } from '../../types/theme';
import { RGBAtoRGB } from '../../utils/color';
import { IconProps, Icons } from '../Icon';

import { getTheme } from './themes';

const ThemeScript = memo(
  ({ theme,
    isDarkTheme,
    nonce,
  }: {
    theme: Theme;
    isDarkTheme: boolean;
    nonce?: string
  }) => {
    const generateCSS = () => {
      const cssProperties = [];
      Object.entries(theme).forEach(([key, value]) => {
        cssProperties.push(`--${key}: ${value};`);
      });

      const primaryColor = Color(theme.primary);

      cssProperties.push(`--primary50: ${primaryColor.alpha(0.5).toString()};`);
      cssProperties.push(`--primary10: ${primaryColor.alpha(0.1).toString()};`);

      cssProperties.push(`--primary-bright: ${primaryColor.lighten(0.8).saturate(0.8).toString()};`);

      cssProperties.push(`--primary-minimal: ${Color(RGBAtoRGB(
        primaryColor.fade(isDarkTheme ? 0.3 : 0.9),
        isDarkTheme ? 5 : 255,
      )).toString()};`);

      const secondaryColor = Color(theme.secondary);
      cssProperties.push(`--secondary50: ${secondaryColor.alpha(0.5).toString()};`);
      cssProperties.push(`--secondary10: ${secondaryColor.alpha(0.1).toString()};`);
      cssProperties.push(`--secondary-bright: ${secondaryColor.lighten(0.8).saturate(0.8).toString()};`);
      cssProperties.push(`--secondary-minimal: ${Color(RGBAtoRGB(
        secondaryColor.fade(isDarkTheme ? 0.3 : 0.9),
        isDarkTheme ? 5 : 255,
      )).toString()};`);

      const background = Color(theme.background);
      cssProperties.push(`--contrast: ${background.negate().toString()};`);
      cssProperties.push(`--contrast50: ${background.negate().alpha(0.5).toString()};`);

      [0.1, 0.2, 0.3].forEach((n) => {
        cssProperties.push(`--background-lighten-${n * 10}: ${background.lighten(n).toString()};`);
        cssProperties.push(`--background-darken-${n * 10}: ${background.darken(n).toString()};`);
      });

      return cssProperties.join('\n');
    };

    const getScriptSrc = () => {
      const css = generateCSS();
      return `
        var style = document.getElementById('theme-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'theme-style';
          style.nonce = '${nonce}';
          document.head.appendChild(style);
        }
        style.innerHTML = \`:root { ${css} }\`;

        if (${isDarkTheme}) {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }
      `;
    };

    useEffect(() => {
      const script = document.getElementById('theme-script');

      if (script) {
        const css = generateCSS();
        var style = document.getElementById('theme-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'theme-style';
          style.nonce = `'${nonce}'`;
          document.head.appendChild(style);
        }
        style.innerHTML = `:root { ${css} }`;

        if (isDarkTheme) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }
    }, [theme]);

    return (
      <script
        id="theme-script"
        nonce={nonce ? `'${nonce}'` : undefined}
        dangerouslySetInnerHTML={{
          __html: `!function(){${getScriptSrc()}}();`,
        }}
      />
    );
  },
  (prevProps, nextProps) => prevProps.theme === nextProps.theme,
);

const defaultIconWrapper = (icon: Icons, props?: IconProps) => (
  <i {...props} className={`ri-${icon}-line ri-${icon} ${props?.className}`} />
);

const defaultLinkWrapper = (link: string, component: ReactElement) => component;

export type ChayaProviderType = {
  children: ReactNode,
  linkWrapper?: LinkWrapper,
  iconWrapper?: IconWrapperType,
  theme?: Theme,
  isDarkTheme?: boolean,
  nonce?: string,
};

const ChayaProvider = ({
  children,
  theme,
  linkWrapper = defaultLinkWrapper,
  iconWrapper = defaultIconWrapper,
  isDarkTheme: _dark = false,
  nonce,
}: ChayaProviderType) => {

  const isDarkTheme = theme ? useMemo(() => Color(theme?.background).isDark(), [theme]) : _dark;

  const currentTheme = theme ? theme : getTheme('DEFAULT', _dark);

  return (
    <ChayaContext.Provider
      value={{
        linkWrapper,
        iconWrapper,
        theme: currentTheme,
        isDarkTheme,
      }}
    >
      <ThemeScript theme={currentTheme} isDarkTheme={isDarkTheme} nonce={nonce} />
      {children}
    </ChayaContext.Provider>
  );
};

export default ChayaProvider;
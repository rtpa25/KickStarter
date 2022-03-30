/** @format */

import { AppProps } from 'next/app';
import 'semantic-ui-css/semantic.min.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;

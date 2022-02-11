import '../styles/globals.scss';
import { StoreProvider } from '../utils/Store';
import Layout from '../components/layout';
import { useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StoreProvider>
      <PayPalScriptProvider deferLoading={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PayPalScriptProvider>
    </StoreProvider>
  );
}

export default MyApp;

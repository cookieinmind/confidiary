import Head from 'next/head';
import '../styles/globals.css';
import ModalContextProvider from '../context/ModalContextProvider';
import JournalContextProvider from '../context/JournalContextProvider';
import AuthContextProvider from '../context/AuthContextProvider';

//return <Component {...pageProps} />
function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <>
        <Head>
          <title>Confidiary</title>
        </Head>
        <AuthContextProvider>
          <ModalContextProvider>
            <JournalContextProvider>
              {Component.getLayout(<Component {...pageProps} />)}
            </JournalContextProvider>
          </ModalContextProvider>
        </AuthContextProvider>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Confidiary</title>
        </Head>
        <AuthContextProvider>
          <ModalContextProvider>
            <JournalContextProvider>
              <Component {...pageProps} />
            </JournalContextProvider>
          </ModalContextProvider>
        </AuthContextProvider>
      </>
    );
  }
}

export default MyApp;

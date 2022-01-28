import '../styles/globals.css';
import Head from 'next/head';
import ModalContextProvider from '../context/ModalContextProvider';

//return <Component {...pageProps} />
function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <>
        <Head>
          <title>Sinner Journal</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <ModalContextProvider>
          {Component.getLayout(<Component {...pageProps} />)}
        </ModalContextProvider>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Sinner Journal</title>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </Head>
        <ModalContextProvider>
          <Component {...pageProps} />
        </ModalContextProvider>
      </>
    );
  }
}

export default MyApp;

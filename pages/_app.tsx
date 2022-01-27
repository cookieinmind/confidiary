import '../styles/globals.css';
import Head from 'next/head';

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
        {Component.getLayout(<Component {...pageProps} />)}
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
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;

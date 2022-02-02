import '../styles/globals.css';
import ModalContextProvider from '../context/ModalContextProvider';
import JournalContextProvider from '../context/JournalContextProvider';

//return <Component {...pageProps} />
function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <>
        <ModalContextProvider>
          <JournalContextProvider>
            {Component.getLayout(<Component {...pageProps} />)}
          </JournalContextProvider>
        </ModalContextProvider>
      </>
    );
  } else {
    return (
      <>
        <ModalContextProvider>
          <JournalContextProvider>
            <Component {...pageProps} />
          </JournalContextProvider>
        </ModalContextProvider>
      </>
    );
  }
}

export default MyApp;

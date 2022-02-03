import '../styles/globals.css';
import ModalContextProvider from '../context/ModalContextProvider';
import JournalContextProvider from '../context/JournalContextProvider';
import AuthContextProvider from '../context/AuthContextProvider';

//return <Component {...pageProps} />
function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <>
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

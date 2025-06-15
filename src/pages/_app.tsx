// ==============================================================================
// FILE: pages/_app.tsx
// DESC: This is the main entry point for your application. It wraps every page
//       with the global CSS styles.
// ==============================================================================
import type { AppProps } from 'next/app';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="uz">
      <Head />
      <link rel="shortcut icon" href="/favicon.svg" />
      <link
        rel="alternate"
        media="only screen and (max-width: 640px)"
        href="https://www.tilim.uz/"
      ></link>
      <link rel="canonical" href="https://www.tilim.uz/"></link>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

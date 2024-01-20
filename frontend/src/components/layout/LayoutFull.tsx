import { ReactNode } from "react";
import Head from "next/head";
import Header from "../appBar/AppBar";
import Navbar from "../navbar/Navbar";

type LayoutProps = {
  title: string;
  children: ReactNode;
};

const LayoutFull = (props: LayoutProps): ReactNode => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Navbar />
      <main>{props.children}</main>
    </>
  );
};

export default LayoutFull;

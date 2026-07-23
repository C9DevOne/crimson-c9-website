import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";
import configPromise from "@payload-config";
import { Metadata } from "next";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams });

const PayloadPage = ({ params, searchParams }: Args) =>
  RootPage({
    config: configPromise,
    importMap,
    params,
    searchParams,
  });

export default PayloadPage;

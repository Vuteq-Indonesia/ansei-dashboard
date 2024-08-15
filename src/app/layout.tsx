import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import React from "react";
import {ConfigProvider} from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vuteq Inspection System",
  description: "Vuteq Inspection System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ConfigProvider
      theme={{
          token: {
              colorTextHeading: 'black',
              colorText: 'black',
              colorPrimaryText: 'black',
          },
          components: {
              Card: {
                  colorBgContainer: '#1B1A55',
                  colorTextBase: 'white'
              },
          }
      }}
      >
          <AntdRegistry>{children}</AntdRegistry>
      </ConfigProvider>
      </body>
    </html>
  );
}

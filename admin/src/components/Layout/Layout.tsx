import * as React from 'react';
import { Layout } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';

// eslint-disable-next-line react/display-name
export default ({ children }: { children: React.ReactNode }) => (
    <Layout appBar={AppBar} menu={Menu}>
        {children}
    </Layout>
);
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Website/Header';
import Footer from './Website/Footer';

const WebsiteLayout = () => {
    return (
        <div className="overflow-x-hidden min-h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default WebsiteLayout;

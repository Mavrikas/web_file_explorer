'use client';

import MainView from '@/screens/mainView';
import StoreProvider from './StoreProvider';

export default function Home() {
    return (
        <StoreProvider>
            <MainView />
        </StoreProvider>
    );
}

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolanaMobileWalletAdapter, createDefaultAuthorizationResultCache } from '@solana-mobile/wallet-adapter-mobile';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletProvider = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => "https://api.devnet.solana.com", []);

    const wallets = useMemo(
        () => {
            const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent) || !!window.Capacitor;

            if (isMobile) {
                const mobileAdapter = new SolanaMobileWalletAdapter({
                    appIdentity: {
                        name: 'Backgammon Solana',
                        uri: 'https://backgammon-usxq.onrender.com',
                        icon: 'favicon.ico'
                    },
                    authorizationResultCache: createDefaultAuthorizationResultCache(),
                    cluster: network,
                });

                return [
                    mobileAdapter,
                    new SolflareWalletAdapter(),
                    new PhantomWalletAdapter(),
                ];
            }

            // Desktop: Pure extension support
            return [
                new PhantomWalletAdapter(),
                new SolflareWalletAdapter(),
            ];
        },
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect={false}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
};

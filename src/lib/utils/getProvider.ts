
export const getProvider = () => {

    if ('phantom' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyWindow: any = window;
        const provider = anyWindow.phantom?.solana ?? null;
        if (provider?.isPhantom) {
            return provider;
        }
    }

};
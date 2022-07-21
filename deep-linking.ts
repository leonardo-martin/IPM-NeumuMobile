const config = {
    screens: {
        SignUp: 'signup/:type',
        SignIn: 'signin',
        AccountVerification: 'email-verification/:token?'
    },
};

export const linking = {
    prefixes: ['teleneumuapp://', 'teleneumuappdev://'] as string[],
    config: {
        ...config
    },
};
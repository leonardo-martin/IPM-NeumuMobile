const config = {
    screens: {
        SignUp: 'signup/:type',
        SignIn: 'signin',
        AccountVerification: 'verification/:type?'
    },
};

export const linking = {
    prefixes: [
        'teleneumuapp://',
        'teleneumuappdev://'
    ],
    config,
};
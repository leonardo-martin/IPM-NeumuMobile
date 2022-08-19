const config = {
    screens: {
        SignUp: 'signup/:type',
        SignIn: 'signin',
        AccountVerification: 'verification/:type?',
        AtosDevTest: 'atosdevtest'
    },
};

export const linking = {
    prefixes: [
        'teleneumuapp://',
        'teleneumuappdev://'
    ],
    config,
};
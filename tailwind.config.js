module.exports = {
    content: ['./src/**/*.{vue,js,ts}'],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#eab308",
                    "secondary": "#854d0e",
                    "accent": "#fdba74",
                    "neutral": "#713f12",
                    "base-100": "#fee1d6",
                    "info": "#a5f3fc",
                    "success": "#6ee7b7",
                    "warning": "#fdba74",
                    "error": "#fca5a5",
                },
            },
        ],
    },
    plugins: [require('daisyui')],
};
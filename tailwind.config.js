/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            height: {
                'customh1': 'calc(100vh - 326px)',
                'customh2': 'calc(100vh - 95px)',
                'customh3': 'calc(100vh - 142px)',
                'customh4': 'calc(100vh - 380px)',
                'customh5': 'calc(100vh - 91px)',
                'customh6': 'calc(100vh - 131px)',
                'customh7': 'calc(100vh - 157px)',
                'customh8': 'calc(100vh - 176px)',
                'customh9': 'calc(100vh - 245px)',
                'customh10': 'calc(100vh - 151px)',
                'customh11': 'calc(100vh - 460px)',
                'customh12': 'calc(100vh - 353px)',
                'customh13': 'calc(100vh - 315px)',
                'customh14': 'calc(100% - 20px)',
                'customh15': 'calc(100vh - 135px)',
                'customh15': 'calc(100vh - 135px)',
                'customh15': 'calc(100vh - 155px)',
                'customh16': 'calc(100vh - 524px)',
                'customh17': 'calc(100vh - 200px)',
            },
            colors: {
                'customTextColor': '#2B333B'
            },
            rotate: {
                '270': '270deg',
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            height:{
                'customh1' : 'calc(100vh - 326px)',
                'customh2' : 'calc(100vh - 95px)',
                'customh3' : 'calc(100vh - 142px)',
                'customh4' : 'calc(100vh - 380px)',
                'customh5' : 'calc(100vh - 91px)',
                'customh6' : 'calc(100vh - 151px)',
                'customh7' : 'calc(100vh - 157px)',
            }
        },
    },
    plugins: [],
}

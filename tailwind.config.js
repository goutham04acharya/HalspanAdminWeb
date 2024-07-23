/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            height:{
                'customh1' : 'calc(100vh - 326px)',
                'customh2' : 'calc(100vh - 95px)',
            }
        },
    },
    plugins: [],
}

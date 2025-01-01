// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default ({
//   plugins: [react()],
// })

// defineConfig


import react from '@vitejs/plugin-react';

export default {
  plugins: [
    react({
      fastRefresh: false, // Отключить Fast Refresh
    }),
  ],
};
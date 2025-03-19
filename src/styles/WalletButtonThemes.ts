export const walletButtonThemes = {
  default: {
    button: `
      bg-gradient-to-r from-purple-500 to-blue-500 
      hover:from-purple-600 hover:to-blue-600
      text-white font-bold py-2 px-6 rounded-full
    `,
    connected: `
      bg-gradient-to-r from-green-500 to-emerald-500 
      hover:from-green-600 hover:to-emerald-600
    `,
  },
  minimal: {
    button: `
      bg-gray-800 hover:bg-gray-700
      text-white font-medium py-2 px-4 rounded-lg
    `,
    connected: `
      bg-gray-700 hover:bg-gray-600
    `,
  },
  glass: {
    button: `
      backdrop-filter backdrop-blur-lg
      bg-white bg-opacity-10
      hover:bg-opacity-20
      text-white font-medium py-2 px-6 rounded-full
      border border-white border-opacity-20
    `,
    connected: `
      bg-green-500 bg-opacity-10
      hover:bg-opacity-20
      border-green-500 border-opacity-20
    `,
  },
  // Add more themes as needed
};

export default {
  env: {
    development: {
      presets: [
        "@babel/preset-react"
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            absoluteRunetime: true,
          }
        ],
        [
          "@babel/plugin-proposal-class-properties", 
          {
            loose: true
          }
        ],
        "@babel/plugin-syntax-dynamic-import"
      ]
    },
    production: {
      plugins: [
        "transform-runtime"
      ]
    }
  }
}

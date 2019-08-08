module.exports = {
  env: {
    development: {
      presets: [
        [
          "@babel/preset-env",
          {
            "modules": false  
          }
        ],
        "@babel/preset-react"
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            // sourceType: 'unambiguous'
            // absoluteRunetime: true,
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

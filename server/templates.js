exports.renderLayout = function renderLayout({me}) {
  return `<html>
    <head>
      <title>Express-Passport-React</title>
      <link href="/public/styles.css"/>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.me = ${JSON.stringify(me, null, 2)}
      </script>
      <script src="/public/bundle.js"></script>
    </body>
  </html>`
}

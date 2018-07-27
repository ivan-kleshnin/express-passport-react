exports.renderLayout = function renderLayout({me}) {
  return `<html>
    <head>
      <title>Express-Passport-React</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" 
                             integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" 
                             crossorigin="anonymous"/>
      <link rel="icon" href="/public/favicon.ico" type="image/x-icon"/>
      <link rel="stylesheet" href="/public/styles.css"/>
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

(function track (id) {
  // add data
  window.dataLayer = window.dataLayer || []
  function gtag () { dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', 'UA-603607-17')

  // insert tag
  var ga = document.createElement('script')
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + id
  ga.type = 'text/javascript'
  ga.async = true
  var script = document.getElementsByTagName('script')[0]
  script.parentNode.insertBefore(ga, script)

}('UA-603607-17'))

(function () {
  function track (id) {
    document.write('<script id="ga" async src="https://www.googletagmanager.com/gtag/js?id=' + id + '"></script>\n')
    window.dataLayer = [
      ['js', new Date()],
      ['config', id]
    ]
  }

  track('UA-603607-17')
}())

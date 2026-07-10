export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.info('PageExtras extension installed')
  })
})

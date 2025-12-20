function randomMinutes(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function setupLeaveRejoin(bot) {
  bot.once('spawn', () => {
    const stayMinutes = randomMinutes(3, 15)
    console.log(`[AFK] Scheduled leave in ${stayMinutes} minutes`)

    setTimeout(() => {
      console.log('[AFK] Leaving server (timer)')
      bot.quit()
    }, stayMinutes * 60 * 1000)
  })
}

module.exports = setupLeaveRejoin

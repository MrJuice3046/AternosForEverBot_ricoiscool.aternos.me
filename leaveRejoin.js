function randomMs(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

function setupLeaveRejoin(bot) {
  bot.once('spawn', () => {
    // 45 seconds → 10 minutes
    const stayTime = randomMs(45_000, 10 * 60 * 1000)
    console.log(`[AFK] Will leave in ${(stayTime / 1000).toFixed(0)} seconds`)

    let jumping = true

    // Jump loop
    function jumpLoop() {
      if (!jumping || !bot.entity) return

      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)

      // Next jump: 20 sec → 5 min
      const nextJump = randomMs(20_000, 5 * 60 * 1000)
      setTimeout(jumpLoop, nextJump)
    }

    // Start jumping
    jumpLoop()

    // Leave server
    setTimeout(() => {
      console.log('[AFK] Leaving server (timer)')
      jumping = false
      bot.quit()
    }, stayTime)
  })
}

module.exports = setupLeaveRejoin

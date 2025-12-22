function randomMs(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

function setupLeaveRejoin(bot) {
  let leaveTimer = null
  let jumpTimer = null
  let jumpOffTimer = null
  let stopped = false

  function cleanup() {
    stopped = true
    if (leaveTimer) clearTimeout(leaveTimer)
    if (jumpTimer) clearTimeout(jumpTimer)
    if (jumpOffTimer) clearTimeout(jumpOffTimer)
    leaveTimer = jumpTimer = jumpOffTimer = null
  }

  function scheduleNextJump() {
    if (stopped || !bot.entity) return

    // jump quickly
    bot.setControlState('jump', true)
    jumpOffTimer = setTimeout(() => {
      bot.setControlState('jump', false)
    }, 400)

    // next jump 20s -> 5m
    const nextJump = randomMs(20_000, 5 * 60 * 1000)
    jumpTimer = setTimeout(scheduleNextJump, nextJump)
  }

  bot.once('spawn', () => {
    cleanup() // safety: clear anything old

    stopped = false

    // stay connected 45s -> 10m
    const stayTime = randomMs(45_000, 10 * 60 * 1000)
    console.log(`[AFK] Will leave in ${Math.round(stayTime / 1000)} seconds`)

    scheduleNextJump()

    leaveTimer = setTimeout(() => {
      if (stopped) return
      console.log('[AFK] Leaving server (timer)')
      cleanup()
      bot.quit()
    }, stayTime)
  })

  // IMPORTANT: stop timers when connection ends
  bot.on('end', cleanup)
  bot.on('kicked', cleanup)
  bot.on('error', cleanup)

  // optional: allow manual cleanup if you want
  return cleanup
}

module.exports = setupLeaveRejoin

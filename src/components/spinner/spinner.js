import dynamics from "dynamics.js";
var spinner = document.querySelector('.spinner')
var background = document.querySelector('.background')
var line = document.querySelector('.line')
var tick = document.querySelector('.tick')
var arrows = document.querySelectorAll('.arrow')

export function start() {
    var spinner = document.getElementById("spinner")
  // Show the spinner
  dynamics.animate(spinner, {
    opacity: 1
  }, {
    duration: 250,
    complete: animateLine
  })

  // Fake the syncing success after 2.5s for this demo
  dynamics.setTimeout(animateSuccess, 2600)
}

// This rotate the background (circle+arrows) indefinitely
export function rotate() {
  dynamics.animate(background, {
    rotateZ: 180,
    rotateC: 60
  }, {
    type: dynamics.linear,
    duration: 500,
    complete: function() {
      dynamics.css(background, { rotateZ: 0 })
      rotate()
    }
  })
}

// Animate the line
function animateLine() {
  dynamics.animate(line, {
    strokeDasharray: "40, 117"
  }, {
    type: dynamics.easeInOut,
    duration: 400,
    friction: 700,
    complete: function() {
      dynamics.animate(line, {
        strokeDasharray: "120, 37"
      }, {
        type: dynamics.easeInOut,
        duration: 800,
        complete: animateLine
      })
    }
  })
}

// Animate the success state
function animateSuccess() {
  // First, we animate the line to form a whole circle
  dynamics.animate(line, {
    strokeDasharray: "157, 0",
  }, {
    type: dynamics.easeIn,
    duration: 500,
    friction: 200,
    complete: function() {
      // Then we change the line color and make it a full circle
      // by increasing the strokeWidth
      dynamics.animate(line, {
        strokeWidth: 100,
        stroke: "#0AB000"
      }, {
        friction: 200,
        duration: 300
      })

      // // We hide the arrows
      dynamics.animate(arrows, {
        fill: "#0AB000",
        translate: 5.5,
        scale: 0.5
      }, {
        friction: 200,
        duration: 300
      })

      // Animate the tick icon
      dynamics.animate(tick, {
        opacity: 1,
        rotateZ: 0,
        rotateC: 60
      }, {
        type: dynamics.spring,
        friction: 300,
        duration: 1000,
        delay: 300
      })

      // Restart the whole animation for this demo
      dynamics.setTimeout(restart, 1500)
    }
  })
}

// Restart the whole animation
export function restart() {
  dynamics.animate(spinner, {
    opacity: 0
  }, {
    duration: 250,
    complete: function() {
      // Reset css properties to originals
      dynamics.css(tick, {
        opacity: 0,
        rotateZ: -45,
        rotateC: 60
      })
      dynamics.css(line, {
        strokeDasharray: "120, 37",
        stroke: "#0083FF",
        strokeWidth: 10
      })
      dynamics.css(arrows, {
        opacity: 1,
        fill: "#0083FF",
        scale: 1
      })

      // Start!
      dynamics.setTimeout(start, 500)
    }
  })
}

// Start!
// start()
// rotate()
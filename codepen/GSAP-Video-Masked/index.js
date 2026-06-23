gsap.registerPlugin(ScrollTrigger);

gsap.set(
  [
    "#high-dynamic-range-video-content h2:nth-child(1)",
    "#high-dynamic-range-video-content h2:nth-child(2)",
    "#high-dynamic-range-video-content h2:nth-child(3)",
    "#high-dynamic-range-video-content h2:nth-child(4)"
  ],
  {
    opacity: 0,
    y: -50
  }
);

let bg = document.querySelector("#high-dynamic-range-video-text-mask");
let html5Video = document.querySelector("#high-dynamic-range-video");
let scrollValue;
html5Video.pause();

const HDR = gsap
  .timeline({
    scrollTrigger: {
      trigger: "#high-dynamic-range",
      // start: "bottom center+=100px",
      toggleActions: "play none reverse reverse",
      scrub: 5,
      markers: true,
      pin: true,
      end: "+=10000px",
      onUpdate: ({ progress, direction, isActive }) => {
        console.log(progress, direction, isActive);
      }
    }
  })
  .to("#high-dynamic-range-video-text-mask", {
    backgroundSize: "1500vw",
    opacity: 0,
    duration: 3,
    autoRound: false,
    ease: Power1.ease0ut,
    onComplete: () => {
      html5Video.play();
      console.log("done - playing video");
    }
  })
  .to("#high-dynamic-range-video-content h2:nth-child(1)", {
    opacity: 1,
    duration: 5,
    y: 0
  })
  .to("#high-dynamic-range-video-content h2:nth-child(1)", {
    opacity: 0,
    duration: 5,
    y: 50
  })
  .to("#high-dynamic-range-video-content h2:nth-child(2)", {
    opacity: 1,
    duration: 5,
    y: 0
  })
  .to("#high-dynamic-range-video-content h2:nth-child(2)", {
    opacity: 0,
    duration: 5,
    y: 50
  })
  .to("#high-dynamic-range-video-content h2:nth-child(3)", {
    opacity: 1,
    duration: 5,
    y: 0
  })
  .to("#high-dynamic-range-video-content h2:nth-child(3)", {
    opacity: 0,
    duration: 5,
    y: 50
  })
  .to("#high-dynamic-range-video-content h2:nth-child(4)", {
    opacity: 1,
    duration: 5,
    y: 0
  })
  .to("#high-dynamic-range-video-content h2:nth-child(4)", {
    opacity: 0,
    duration: 5,
    y: 50
  });

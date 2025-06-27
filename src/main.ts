import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "gsap/all";
import TopCanvas from "./utils/TopCanvas";
import type { Group } from "three";
import IntroductCanvas from "./utils/IntroductCanvas";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

initVh();
window.addEventListener("resize", handleResize);

ScrollSmoother.create({
  smooth: 2,
  smoothTouch: 1,
});

const loadingEl = document.querySelector(".loading") as HTMLElement;
const loadingBg = document.querySelector(".loading__bg") as HTMLElement;

let axeGltf: Group | undefined;
let loadingFinished = false;

const topCanvas = new TopCanvas([1, 1, 5], "top__canvas", 45, 10, false, 0xdddddd);

function isTouchDevice(): boolean {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.userAgent.toLowerCase().includes("android") ||
    navigator.userAgent.toLowerCase().includes("iphone") ||
    navigator.userAgent.toLowerCase().includes("ipad")
  );
}
function isSmallScreen(): boolean {
  return window.innerWidth <= 768;
}

function initVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}
function handleResize() {
  initVh();
  ScrollTrigger.refresh();
}

// topCanvasの読込中
topCanvas.onAnimate = () => {
  if (loadingFinished) return;
  loadingBg.style.height = `${topCanvas.progress}%`;
};
// TopCanvasの読み込み完了後
topCanvas.init().then(() => {
  loadingFinished = true;
  gsap.to(loadingEl, { opacity: 0, onComplete: () => loadingEl.remove() });

  // gltfをグローバルに登録
  axeGltf = topCanvas.gltf;

  InitTopAnimation();

  setTimeout(() => {
    setIntroductAnimation();
  }, 1000);
});

function InitTopAnimation() {
  if (!topCanvas.gltf) throw new Error("gltfが読み込まれていません");

  const greySplit = SplitText.create(".top__title--grey", { type: "lines, chars, words" });
  const mainSplit = SplitText.create(".top__title--main", { type: "lines, chars, words" });
  gsap.set(mainSplit.chars, { opacity: 0 });

  // ページ訪問アニメーション
  gsap.from(greySplit.lines, { scale: 0.9, opacity: 0, stagger: 0.2, delay: 0.5, duration: 0.4 });

  const topTextAnim = gsap
    .timeline()
    .to(mainSplit.chars, { opacity: 1, stagger: 0.1 })
    .to(greySplit.chars, { opacity: 0, stagger: 0.1 }, 0)
    .addLabel("lettersComplete")
    .to(".top__title-wrapper", { scale: 1.3, autoAlpha: 0, duration: 3 })
    .addLabel("lettersFadeOut")
    .to(".top__next", { width: window.innerWidth, borderRadius: 0, duration: 5 }, "lettersFadeOut-=1.4")
    .addLabel("bgBegger")
    .to(".top__canvas", { opacity: 1, duration: 4 }, "lettersFadeOut-=0.4")
    .addLabel("canvasFadeIn")
    .from(topCanvas.gltf.position, { y: -1, duration: 5 }, "<");

  ScrollTrigger.create({
    trigger: ".top",
    start: "top top",
    end: isTouchDevice() ? "+=3000" : "+=4000",
    pin: true,
    // anticipatePin: 1,
    scrub: true,
    animation: topTextAnim,
  });
}

function setIntroductAnimation() {
  if (!axeGltf) throw new Error("gltfが読み込まれていません");
  const clonedGltf = axeGltf.clone(true);
  new IntroductCanvas(clonedGltf, [1, 0, 3], "introduction__canvas", 45, 10, true);

  // 黒タイトル大文字
  const split = SplitText.create(".introduction__sub-title", { type: "chars" });
  gsap.set(split.chars, { yPercent: 100 });
  const titleAnimation = gsap.fromTo(
    split.chars,
    {
      yPercent: 100,
    },
    {
      yPercent: 0,
      stagger: 0.05,
      paused: true,
    }
  );

  ScrollTrigger.create({
    trigger: ".introduction",
    start: "top 30%",
    onEnter: () => {
      titleAnimation.play();
    },
    onLeaveBack: () => {
      titleAnimation.timeScale(2).reverse();
    },
  });

  // ピン留め用&アニメーション用
  gsap.set(".introduction__bg-circle", { scale: 0 });
  gsap.set(".introduction__intro-p:nth-child(1)", { opacity: 0, y: -20 });
  gsap.set(".introduction__intro-p:nth-child(2)", { opacity: 0, y: 20 });
  gsap.set(".feature__article--one .feature__article__inner:nth-child(1) .feature__title-inner", { yPercent: 130 });
  gsap.set(".feature__article--one .feature__article__inner:nth-child(2) .feature__title-inner", { yPercent: 130 });
  gsap.set(".feature__article--two .feature__article__inner:nth-child(1) .feature__title-inner", { yPercent: 130 });
  gsap.set(".feature__article--two .feature__article__inner:nth-child(2) .feature__title-inner", { yPercent: 130 });
  gsap.set(".feature__article--one .feature__article__inner:nth-child(1) .feature__text-inner", { yPercent: 130 });
  gsap.set(".feature__article--one .feature__article__inner:nth-child(2) .feature__text-inner", { yPercent: 130 });
  gsap.set(".feature__article--two .feature__article__inner:nth-child(1) .feature__text-inner", { yPercent: 130 });
  gsap.set(".feature__article--two .feature__article__inner:nth-child(2) .feature__text-inner", { yPercent: 130 });
  gsap.set(".feature__deco__circle", { opacity: 0 });
  gsap.set(".feature__article--one .feature__deco__line", { scaleX: 0, transformOrigin: "right" });
  gsap.set(".feature__article--two .feature__deco__line", { scaleX: 0, transformOrigin: isSmallScreen() ? "right" : "left" });

  const featureTitleLeft = gsap.fromTo(
    ".feature__article--one .feature__article__inner:nth-child(1) .feature__title-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTitleLeft2 = gsap.fromTo(
    ".feature__article--one .feature__article__inner:nth-child(2) .feature__title-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTitleRight = gsap.fromTo(
    ".feature__article--two .feature__article__inner:nth-child(1) .feature__title-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTitleRight2 = gsap.fromTo(
    ".feature__article--two .feature__article__inner:nth-child(2) .feature__title-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTextLeft = gsap.fromTo(
    ".feature__article--one .feature__article__inner:nth-child(1) .feature__text-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTextLeft2 = gsap.fromTo(
    ".feature__article--one .feature__article__inner:nth-child(2) .feature__text-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTextRight = gsap.fromTo(
    ".feature__article--two .feature__article__inner:nth-child(1) .feature__text-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const featureTextRight2 = gsap.fromTo(
    ".feature__article--two .feature__article__inner:nth-child(2) .feature__text-inner",
    { yPercent: 130 },
    { yPercent: 0, paused: true, overwrite: true }
  );
  const circleOpacity = gsap.fromTo(".feature__deco__circle", { opacity: 0 }, { opacity: 1, paused: true, overwrite: true });

  const p1Anim = gsap.fromTo(
    ".introduction__intro-p:nth-child(1)",
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.5, paused: true, overwrite: true }
  );
  const p2Anim = gsap.fromTo(
    ".introduction__intro-p:nth-child(2)",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, paused: true, overwrite: true }
  );
  const timeline = gsap
    .timeline()
    .to(".introduction__sub-title", { xPercent: -110, duration: 3 }, 0)
    .addLabel("titleFlow1")
    .to(".introduction__intro", { opacity: 0, duration: 0.5 }, "titleFlow1-=2")
    .to(".introduction__bg-circle", { scale: 1, duration: 2 }, "titleFlow1-=1.7")
    .addLabel("circleExpanded")
    .to(".introduction__main-title", { xPercent: -100, x: -window.innerWidth, duration: 6 }, "circleExpanded-=1.5")
    .addLabel("titleFlow2")
    .to(".introduction__intro", { y: 1, duration: 9.5 });

  const introCanvas = document.querySelector(".introduction__canvas") as HTMLElement;
  let circleActive = false;
  let over40 = false;
  let over50 = false;
  let over60 = false;
  let over80 = false;

  const parentEl = document.querySelector(".introduction") as HTMLElement;

  ScrollTrigger.create({
    trigger: ".introduction",
    start: "top top",
    end: "+=5000",
    pin: true,
    anticipatePin: 1,
    scrub: true,
    animation: timeline,

    onEnter: () => {
      p1Anim.play();
      p2Anim.play();
    },
    onLeaveBack: () => {
      p1Anim.reverse();
      p2Anim.reverse();
    },
    onLeave: () => {
      parentEl.classList.add("end");
    },
    onEnterBack: () => {
      parentEl.classList.remove("end");
    },
    onUpdate: ({ progress }) => {
      // circleActive
      if (isSmallScreen()) {
        if (!circleActive && progress >= 0.2) {
          circleActive = true;
          introCanvas.classList.add("active");
        }
        if (circleActive && progress < 0.2) {
          circleActive = false;
          introCanvas.classList.remove("active");
        }
      }
      // featureの上の棒と丸
      if (!over40 && progress > 0.4) {
        over40 = true;
        circleOpacity.play();
      }
      if (over40 && progress <= 0.4) {
        over40 = false;
        circleOpacity.reverse();
        gsap.set(".feature__article--one .feature__deco__line", { scaleX: 0 });
        gsap.set(".feature__article--two .feature__deco__line", { scaleX: 0 });
        featureTextLeft.reverse();
        featureTitleLeft.reverse();
        featureTextRight.reverse();
        featureTitleRight.reverse();
      }
      if (!over50 && progress > 0.4) {
        gsap.set(".feature__article--one .feature__deco__line", { scaleX: `${(progress - 0.4) * 1000}%` });
        gsap.set(".feature__article--two .feature__deco__line", { scaleX: `${(progress - 0.4) * 1000}%` });
      }
      // feature1が出てくる
      if (!over50 && progress > 0.5) {
        over50 = true;
        featureTitleLeft.play();
        featureTitleRight.play();
        featureTextLeft.play();
        featureTextRight.play();
      }
      if (over50 && progress <= 0.5) {
        over50 = false;
        featureTitleLeft.reverse();
        featureTitleRight.reverse();
        featureTextLeft.reverse();
        featureTextRight.reverse();
      }
      // feature1が下がり、feature2が出てくる
      if (!over60 && progress > 0.6) {
        over60 = true;
        featureTitleLeft.reverse().then(() => featureTitleLeft2.play());
        featureTextLeft.reverse().then(() => featureTextLeft2.play());
      }
      if (over60 && progress <= 0.6) {
        over60 = false;
        featureTitleLeft2.reverse().then(() => featureTitleLeft.play());
        featureTextLeft2.reverse().then(() => featureTextLeft.play());
      }
      if (!over80 && progress > 0.8) {
        over80 = true;
        featureTitleRight.reverse().then(() => featureTitleRight2.play());
        featureTextRight.reverse().then(() => featureTextRight2.play());
      }
      if (over80 && progress <= 0.8) {
        over80 = false;
        featureTitleRight2.reverse().then(() => featureTitleRight.play());
        featureTextRight2.reverse().then(() => featureTextRight.play());
      }
    },
  });

  // 斧の回転用 & 黒タイトル出現
  ScrollTrigger.create({
    trigger: ".introduction",
    start: "top bottom",
    end: `+=${5000 + window.innerHeight * 2}`,
    scrub: true,
    animation: gsap.to(clonedGltf.rotation, { y: -Math.PI * 10, ease: "none" }),
  });
}

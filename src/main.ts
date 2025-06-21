import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "gsap/all";
import TopCanvas from "./utils/TopCanvas";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1,
  effects: true,
});

/**
 * Loading
 */
const loadingEl = document.querySelector(".loading") as HTMLElement;
const loadingBg = document.querySelector(".loading__bg") as HTMLElement;

/**
 * TOP CANVAS
 */
let loadingFinished = false;

const topCanvas = new TopCanvas([1, 1, 5], "top__canvas", 45, 10, false, 0xdddddd);
topCanvas.onAnimate = () => {
  if (loadingFinished) return;
  loadingBg.style.height = `${topCanvas.progress}%`;
};

topCanvas.init().then(() => {
  loadingFinished = true;
  loadingEl.remove();
  InitTopAnimation();
});

/**
 * TOP テキストアニメーション
 */
function InitTopAnimation() {
  if (!topCanvas.gltf) throw new Error("gltfが読み込まれていません");

  const topGreySplit = SplitText.create(".top__title--grey", { type: "lines, chars" });
  const topMainSplit = SplitText.create(".top__title--main", { type: "lines, chars" });
  gsap.set(topMainSplit.chars, { opacity: 0 });

  // ページ訪問アニメーション
  gsap.from(topGreySplit.lines, { scale: 0.9, opacity: 0, stagger: 0.2, delay: 0.5, duration: 0.4 });

  const topTextAnim = gsap.timeline();
  topTextAnim
    .to(topMainSplit.chars, {
      opacity: 1,
      stagger: 0.1,
    })
    .to(
      topGreySplit.chars,
      {
        opacity: 0,
        stagger: 0.1,
      },
      0
    )
    .addLabel("lettersComplete")
    .to(".top__title-wrapper", { scale: 1.3, opacity: 0, duration: 3 })
    .addLabel("lettersFadeOut")
    .to(".top__next", { width: window.innerWidth, duration: 5 }, "-=0.2")
    .addLabel("bgBegger")
    .to(".top__canvas", { opacity: 1, duration: 5 }, "-=4.5")
    .addLabel("canvasFadeIn")
    .from(topCanvas.gltf?.position, { y: -1, duration: 10 }, "<");
  console.log(topCanvas.gltf);

  ScrollTrigger.create({
    trigger: ".top",
    end: "+=4000",
    pin: true,
    scrub: true,
    animation: topTextAnim,
  });
}

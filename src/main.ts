import gsap from "gsap";
import Scrollbar from "smooth-scrollbar";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="main">
      <div class="heading">
        <h4 class="heading-text">Scroll</h4>
        <svg class="scroll-down">
          <use xlink:href="/icons.svg#ic-chevron-small-down"></use>
        </svg>
      </div>
      <section class="content"></section>
    </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

// const PADDING = 8;
// const ITEM_SIZE = 182.4 - PADDING;

const select = (elem: string) => document.querySelector(elem) as HTMLElement;
// const selectAll = (elem: string): HTMLElement[] =>
//   Array.from(document.querySelectorAll(elem));
// const create = (elem: string): HTMLElement => document.createElement(elem);

window.addEventListener("load", () => {
  const content = select(".content");
  const heading = select(".heading");

  const verticalScrollbar = Scrollbar.init(content, {
    damping: 0.03,
    delegateTo: document,
  });
  verticalScrollbar.setPosition(0, 0);
  verticalScrollbar.track.yAxis.element.remove();
  verticalScrollbar.track.xAxis.element.remove();
  verticalScrollbar.addListener(({ offset }) => {
    if (offset.y > 50) {
      gsap.to(heading, { opacity: 0 });
    } else {
      gsap.to(heading, { opacity: 1 });
    }
  });
});

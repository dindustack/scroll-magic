import gsap from "gsap";
import Scrollbar from "smooth-scrollbar";
import { data } from "./data";
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

const PADDING = 8;
const ITEM_SIZE = 182.4 - PADDING;

const select = (elem: string) => document.querySelector(elem) as HTMLElement;
const selectAll = (elem: string): HTMLElement[] =>
  Array.from(document.querySelectorAll(elem));
const create = (elem: string): HTMLElement => document.createElement(elem);

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
    const itemFull = selectAll(".item-full");

    if (offset.y > 50) {
      gsap.to(heading, { opacity: 0 });
    } else {
      gsap.to(heading, { opacity: 1 });
    }

    gsap.to(itemFull, { y: -offset.y, duration: 0 });
  });

  window.addEventListener("resize", () => setPositionCalculations());

  const setPositionCalculations = () => {
    const containerFull = select(".item-container-full");
    const containerTransparent = select(".item-container-transparent");
    const scrollContent = select(".scroll-content");

    const scrollContentHeight = data.length * (ITEM_SIZE + PADDING);
    const multiplyTime = window.innerHeight / (ITEM_SIZE + PADDING) - 2.5;

    gsap.set(scrollContent, {
      blockSize: scrollContentHeight + ITEM_SIZE * multiplyTime + ITEM_SIZE,
    });
    gsap.set(containerFull, { top: ITEM_SIZE * multiplyTime });
    gsap.set(containerTransparent, { y: ITEM_SIZE * multiplyTime });
  };

  const generateList = () => {
    const scrollContent = select(".scroll-content");
    const picture = create("div");
    const containerFull = create("div");
    const containerTransparent = create("div");

    gsap.set(picture, { className: "picture" });
    gsap.set(containerFull, { className: "item-container-full" });
    gsap.set(containerTransparent, { className: "item-container-transparent" });

    content.appendChild(containerFull);
    scrollContent.insertAdjacentElement("beforeend", containerTransparent);

    data.forEach((item, index) => {
      const image = create("img");
      gsap.set(image, {
        className: "img-select",
        attr: { src: item.imgSrc, "data-id": item.id },
        zIndex: index + 1,
      });

      picture.appendChild(image);
      containerFull.appendChild(createItem(item, false));
      containerTransparent.appendChild(createItem(item, true));
    });

    content.appendChild(picture);
  };

  const createItem = (
    item: { title: string; id: number },
    isTransparent = false
  ) => {
    const itemList = item.title.split(" ");

    const itemContainer = create("div");
    const title = create("div");

    gsap.set(itemContainer, {
      className: `item ${isTransparent ? "item-transparent" : "item-full"}`,
      attr: { "data-id": item.id },
    });

    gsap.set(title, {
      className: `title ${isTransparent ? "title-transparent" : "title-full"}`,
      textContent: itemList[itemList.length - 1],
    });

    itemContainer.appendChild(title);

    return itemContainer;
  };

  const initObserver = () => {
    const pictureList = selectAll(".img-select");

    let options = {
      root: verticalScrollbar.containerEl,
      rootMargin: `${ITEM_SIZE}px 0px -${ITEM_SIZE}px 0px`,
      threshold: 0.4,
    };

    let observer = new IntersectionObserver((entries, _) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry, pictureList, "in");
        } else {
          animate(entry, pictureList, "out");
        }
      });
    }, options);

    verticalScrollbar.containerEl
      .querySelectorAll(".item-transparent")
      .forEach((item) => observer.observe(item));
  };

  const animate = (entry: any, pictureList: any, direction: string) => {
    const target = pictureList[entry.target.dataset.id - 1];

    gsap.to(target, {
      translateY: direction === "in" ? 0 : 500,
      scale: direction === "in" ? 1 : 1.5,
      duration: 0.5,
    });
  };

  generateList();
  setPositionCalculations();
  initObserver();
});

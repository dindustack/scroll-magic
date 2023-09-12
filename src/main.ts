import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="main">
      <div class="heading">
        <h4 class="heading-text">Scroll</h4>
        <svg class="scroll-down">
          <use xlink:href="/icons.svg#ic-chevron-small-down"></use>
        </svg>
      </div>
    </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

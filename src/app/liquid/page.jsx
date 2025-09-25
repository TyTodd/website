"use client";

import { useEffect } from "react";
import { Pane } from "tweakpane";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default function LiquidGlassEffect() {
  useEffect(() => {
    // --- CONFIG -------------------------------------------------------------
    const base = {
      icons: false,
      scale: -180,
      radius: 16,
      border: 0.07,
      lightness: 50,
      displace: 0,
      blend: "difference",
      x: "R",
      y: "B",
      alpha: 0.93,
      blur: 11,
      r: 0,
      g: 10,
      b: 20,
      saturation: 1,
    };

    const presets = {
      dock: {
        ...base,
        width: 336,
        height: 96,
        displace: 0.2,
        icons: true,
        frost: 0.05,
      },
      pill: {
        ...base,
        width: 200,
        height: 80,
        displace: 0,
        frost: 0,
        radius: 40,
      },
      bubble: {
        ...base,
        radius: 70,
        width: 140,
        height: 140,
        displace: 0,
        frost: 0,
      },
      free: {
        ...base,
        width: 140,
        height: 280,
        radius: 80,
        border: 0.15,
        alpha: 0.74,
        lightness: 60,
        blur: 10,
        displace: 0,
        scale: -300,
      },
    };

    const config = {
      ...presets.dock,
      theme: "system",
      debug: false,
      top: false,
      preset: "dock",
    };

    // --- HELPERS -----------------------------------------------------------
    const debugPen = document.querySelector(".displacement-debug");

    const buildDisplacementImage = () => {
      if (!debugPen) return;
      const border =
        Math.min(config.width, config.height) * (config.border * 0.5);
      const kids = `
        <svg class="displacement-image" viewBox="0 0 ${config.width} ${
        config.height
      }" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" fill="black"></rect>
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" rx="${config.radius}" fill="url(#red)" />
          <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" rx="${config.radius}" fill="url(#blue)" style="mix-blend-mode: ${
        config.blend
      }" />
          <rect x="${border}" y="${
        Math.min(config.width, config.height) * (config.border * 0.5)
      }" width="${config.width - border * 2}" height="${
        config.height - border * 2
      }" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${
        config.alpha
      }" style="filter:blur(${config.blur}px)" />
        </svg>
        <div class="label">
          <span>displacement image</span>
          <svg viewBox="0 0 97 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M74.568 0.553803C74.0753 0.881909 73.6295 1.4678 73.3713 2.12401C73.1367 2.70991 72.3858 4.67856 71.6584 6.50658C70.9544 8.35803 69.4526 11.8031 68.3498 14.1936C66.1441 19.0214 65.839 20.2167 66.543 21.576C67.4581 23.3337 69.4527 23.9196 71.3064 22.9821C72.4797 22.3728 74.8965 19.5839 76.9615 16.4435C78.8387 13.5843 78.8387 13.6077 78.1113 18.3418C77.3369 23.4275 76.4687 26.2866 74.5915 30.0364C73.254 32.7316 71.8461 34.6299 69.218 37.3485C65.9563 40.6999 62.2254 42.9732 57.4385 44.4965C53.8718 45.6449 52.3935 45.8324 47.2546 45.8324C43.3594 45.8324 42.1158 45.7386 39.9805 45.2933C32.2604 43.7466 25.3382 40.9577 19.4015 36.9735C15.0839 34.0909 12.5028 31.7004 9.80427 27.9975C6.80073 23.9196 4.36038 17.2403 3.72682 11.475C3.37485 8.1471 3.1402 7.32683 2.43624 7.13934C0.770217 6.71749 0.183578 7.77211 0.0193217 11.5219C-0.26226 18.5996 2.55356 27.1304 7.17619 33.1066C13.8403 41.7545 25.432 48.4103 38.901 51.2696C41.6465 51.8555 42.2566 51.9023 47.4893 51.9023C52.3935 51.9023 53.426 51.832 55.5144 51.3867C62.2723 49.9337 68.5375 46.6292 72.949 42.1998C76.0464 39.1296 78.1113 36.2939 79.8946 32.7081C82.1942 28.0912 83.5317 23.3103 84.2591 17.17C84.3999 15.8576 84.6111 14.7795 84.7284 14.7795C84.8223 14.7795 85.4559 15.1311 86.1364 15.5763C88.037 16.7716 90.3835 17.8965 93.5748 19.0918C96.813 20.3339 97.3996 20.287 96.4141 18.9512C94.9123 16.9122 90.055 11.5219 87.1219 8.63926C84.0949 5.66288 83.8368 5.33477 83.5552 4.1864C83.3909 3.48332 83.0155 2.68649 82.6401 2.31151C82.0065 1.6553 80.4109 1.04595 79.9885 1.30375C79.8712 1.37406 79.2845 1.11626 78.6744 0.717845C77.2431 -0.172727 75.7413 -0.243024 74.568 0.553803Z" fill="currentColor"></path>
          </svg>
        </div>
      `;

      debugPen.innerHTML = kids;

      const svgEl = debugPen.querySelector(".displacement-image");
      if (!svgEl) return;
      const serialized = new XMLSerializer().serializeToString(svgEl);
      const encoded = encodeURIComponent(serialized);
      const dataUri = `data:image/svg+xml,${encoded}`;

      gsap.set("feImage", { attr: { href: dataUri } });
      gsap.set("feDisplacementMap", {
        attr: {
          xChannelSelector: config.x,
          yChannelSelector: config.y,
        },
      });
    };

    const update = () => {
      buildDisplacementImage();
      gsap.set(document.documentElement, {
        "--width": config.width,
        "--height": config.height,
        "--radius": config.radius,
        "--frost": config.frost,
        "--output-blur": config.displace,
        "--saturation": config.saturation,
      });
      gsap.set("feDisplacementMap", { attr: { scale: config.scale } });
      gsap.set("#redchannel", { attr: { scale: config.scale + config.r } });
      gsap.set("#greenchannel", { attr: { scale: config.scale + config.g } });
      gsap.set("#bluechannel", { attr: { scale: config.scale + config.b } });
      gsap.set("feGaussianBlur", { attr: { stdDeviation: config.displace } });

      document.documentElement.dataset.icons = String(config.icons);
      document.documentElement.dataset.mode = String(config.preset);
      document.documentElement.dataset.top = String(config.top);
      document.documentElement.dataset.debug = String(config.debug);
      document.documentElement.dataset.theme = String(config.theme);
    };

    const sync = (event) => {
      const shouldTransition =
        document.startViewTransition &&
        (event?.target?.controller?.view?.labelElement?.innerText === "theme" ||
          event?.target?.controller?.view?.labelElement?.innerText === "top");

      if (!shouldTransition) return update();
      document.startViewTransition(() => update());
    };

    // --- TWEAKPANE ---------------------------------------------------------
    const ctrl = new Pane({ title: "config", expanded: true });

    ctrl.addBinding(config, "debug");
    ctrl.addBinding(config, "top");
    ctrl
      .addBinding(config, "preset", {
        label: "mode",
        options: { dock: "dock", pill: "pill", bubble: "bubble", free: "free" },
      })
      .on("change", () => {
        document.documentElement.dataset.mode = String(config.preset);
        settings.expanded = config.preset === "free";
        settings.disabled = config.preset !== "free";
        if (config.preset !== "free") {
          const values = presets[config.preset];
          document.documentElement.dataset.icons = String(values.icons);
          const morph = gsap.timeline({ onUpdate: () => ctrl.refresh() });
          for (const [key, value] of Object.entries(values)) {
            morph.to(config, { [key]: value }, 0);
          }
        }
      });

    ctrl.addBinding(config, "theme", {
      label: "theme",
      options: { system: "system", light: "light", dark: "dark" },
    });

    const settings = ctrl.addFolder({
      title: "settings",
      disabled: true,
      expanded: false,
    });

    settings.addBinding(config, "frost", {
      label: "frost",
      min: 0,
      max: 1,
      step: 0.01,
    });
    settings.addBinding(config, "saturation", { min: 0, max: 2, step: 0.1 });
    settings.addBinding(config, "icons");
    settings.addBinding(config, "width", {
      min: 80,
      max: 500,
      step: 1,
      label: "width (px)",
    });
    settings.addBinding(config, "height", {
      min: 35,
      max: 500,
      step: 1,
      label: "height (px)",
    });
    settings.addBinding(config, "radius", {
      min: 0,
      max: 500,
      step: 1,
      label: "radius (px)",
    });
    settings.addBinding(config, "border", {
      min: 0,
      max: 1,
      step: 0.01,
      label: "border",
    });
    settings.addBinding(config, "alpha", {
      min: 0,
      max: 1,
      step: 0.01,
      label: "alpha",
    });
    settings.addBinding(config, "lightness", {
      min: 0,
      max: 100,
      step: 1,
      label: "lightness",
    });
    settings.addBinding(config, "blur", {
      min: 0,
      max: 20,
      step: 1,
      label: "input blur",
    });
    settings.addBinding(config, "displace", {
      min: 0,
      max: 12,
      step: 0.1,
      label: "output blur",
    });
    settings.addBinding(config, "x", {
      label: "channel x",
      options: { r: "R", g: "G", b: "B" },
    });
    settings.addBinding(config, "y", {
      label: "channel y",
      options: { r: "R", g: "G", b: "B" },
    });
    settings.addBinding(config, "blend", {
      options: {
        normal: "normal",
        multiply: "multiply",
        screen: "screen",
        overlay: "overlay",
        darken: "darken",
        lighten: "lighten",
        "color-dodge": "color-dodge",
        "color-burn": "color-burn",
        "hard-light": "hard-light",
        "soft-light": "soft-light",
        difference: "difference",
        exclusion: "exclusion",
        hue: "hue",
        saturation: "saturation",
        color: "color",
        luminosity: "luminosity",
        "plus-darker": "plus-darker",
        "plus-lighter": "plus-lighter",
      },
      label: "blend",
    });

    settings.addBinding(config, "scale", {
      min: -1000,
      max: 1000,
      step: 1,
      label: "scale",
    });

    const abb = settings.addFolder({ title: "chromatic" });
    abb.addBinding(config, "r", { min: -100, max: 100, step: 1, label: "red" });
    abb.addBinding(config, "g", {
      min: -100,
      max: 100,
      step: 1,
      label: "green",
    });
    abb.addBinding(config, "b", {
      min: -100,
      max: 100,
      step: 1,
      label: "blue",
    });

    document.documentElement.style.setProperty("--size", config.size);
    Draggable.create(".effect", { type: "x,y" });

    ctrl.on("change", sync);
    update();

    // Align the .effect on load
    const placeholder = document.querySelector(".dock-placeholder");
    if (placeholder) {
      const { top, left } = placeholder.getBoundingClientRect();
      gsap.set(".effect", {
        top: top > window.innerHeight ? window.innerHeight * 0.5 : top,
        left,
        opacity: 1,
      });
    }

    return () => {
      // Cleanup tweakpane and draggable
      try {
        ctrl.dispose();
      } catch {}
      const d = Draggable.get(".effect");
      if (d) d.kill();
    };
  }, []);

  return (
    <div>
      {/* UI ----------------------------------------------------------------*/}
      <header>
        <h1 className="fluid">
          glass
          <br />
          displacement
        </h1>
        <p className="fluid">
          it&apos;s not perfect, but neither is the platform.
          <br />
          we love it anyway.
        </p>
      </header>

      <div className="effect">
        <div className="nav-wrap">
          <nav>
            <img
              src="https://assets.codepen.io/605876/finder.png"
              alt="Finder"
            />
            <img
              src="https://assets.codepen.io/605876/launch-control.png"
              alt="Launch Control"
            />
            <img
              src="https://assets.codepen.io/605876/safari.png"
              alt="Safari"
            />
            <img
              src="https://assets.codepen.io/605876/calendar.png"
              alt="Calendar"
            />
          </nav>
        </div>
        <svg className="filter" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="filter" colorInterpolationFilters="sRGB">
              <feImage x="0" y="0" width="100%" height="100%" result="map" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="redchannel"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispRed"
              />
              <feColorMatrix
                in="dispRed"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="red"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="greenchannel"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispGreen"
              />
              <feColorMatrix
                in="dispGreen"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="green"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="map"
                id="bluechannel"
                xChannelSelector="R"
                yChannelSelector="G"
                result="dispBlue"
              />
              <feColorMatrix
                in="dispBlue"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="blue"
              />

              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              <feGaussianBlur in="output" stdDeviation="0.7" />
            </filter>
          </defs>
        </svg>
        <div className="displacement-debug" />
      </div>

      <main>
        <section className="placeholder">
          <div className="dock-placeholder" />
          <span className="arrow arrow--debug">
            <span>drag, scroll, configure</span>
            {/* (arrow SVG omitted for brevity) */}
          </span>
        </section>

        <section>
          <p className="fluid">
            How do you create backdrop displacement with HTML and CSS? SVG. The
            idea is that you need a displacement map that distorts the input
            image. In this case, the backdrop of our element (whatever is
            underneath).
          </p>
        </section>

        <section>
          <div className="apps">
            {[
              ["https://assets.codepen.io/605876/beeper.png", "Beeper"],
              ["https://assets.codepen.io/605876/cursor.png", "Cursor"],
              [
                "https://assets.codepen.io/605876/screenstudio.png",
                "Screen Studio",
              ],
              ["https://assets.codepen.io/605876/raycast.png", "Raycast"],
              ["https://assets.codepen.io/605876/photos.png", "Photos"],
              ["https://assets.codepen.io/605876/signal.png", "Signal"],
              ["https://assets.codepen.io/605876/spotify.png", "Spotify"],
              ["https://assets.codepen.io/605876/brave.png", "Brave"],
            ].map(([src, label]) => (
              <div className="app" key={label}>
                <img src={src} alt={label} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="emojis fluid">
          {"🧑‍🍳 🤓 🤪 🙄 🤠 🥸".split(" ").map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </section>

        <section>
          <p className="fluid">
            Glass adjusts for different surfaces and use cases.
            <br />
            Try different modes or freestyle it in "free" mode.
          </p>
        </section>

        <section className="images">
          {[
            "https://fastly.picsum.photos/id/841/300/300.jpg?hmac=59ZNBwU1FjRrwpU3J7NDerfr_DHq-JPYXqnyumDt17U",
            "https://fastly.picsum.photos/id/517/300/300.jpg?hmac=xDY76wxtwOZ5mEJYjf_i69VkVQibAYi036aADsWbaLs",
            "https://fastly.picsum.photos/id/204/300/300.jpg?hmac=nMn3k2irZFRlOEdAxFaKapzdO5cuwF8eQv5HbhP9Lyw",
            "https://fastly.picsum.photos/id/906/300/300.jpg?hmac=UJKxYXpNPOY5aqp_mipycmJFPgr8bd3RxcZChdDu0-c",
            "https://fastly.picsum.photos/id/546/300/300.jpg?hmac=f8E2wXr3kthnt3BT6h17Y5Baf_0aJUdPIV7GqBVgxzY",
          ].map((src, i) => (
            <img key={i} src={src} alt="" />
          ))}
        </section>

        <section>
          <p className="fluid">
            That&apos;s it. Go forth and play with SVG filters.
            <br />
            But maybe do it in Safari and Firefox first.
          </p>
        </section>
      </main>

      <footer>┬┴┬┴┤•ᴥ•ʔ jhey &copy; 2025 ├┬┴┬┴</footer>

      <a
        aria-label="Follow Jhey"
        className="bear-link"
        href="https://twitter.com/intent/follow?screen_name=jh3yy"
        target="_blank"
        rel="noreferrer noopener"
      >
        <svg
          className="w-9"
          viewBox="0 0 969 955"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="161.191"
            cy="320.191"
            r="133.191"
            stroke="currentColor"
            strokeWidth="20"
          ></circle>
          <circle
            cx="806.809"
            cy="320.191"
            r="133.191"
            stroke="currentColor"
            strokeWidth="20"
          ></circle>
          <circle
            cx="695.019"
            cy="587.733"
            r="31.4016"
            fill="currentColor"
          ></circle>
          <circle
            cx="272.981"
            cy="587.733"
            r="31.4016"
            fill="currentColor"
          ></circle>
          <path
            d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z"
            fill="currentColor"
          ></path>
          <rect
            x="310.42"
            y="448.31"
            width="343.468"
            height="51.4986"
            fill="#FF1E1E"
          ></rect>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>

      {/* STYLES --------------------------------------------------------------*/}
      <style jsx global>{`
        @import url("https://unpkg.com/normalize.css") layer(normalize);
        @import url("https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap");

        @layer normalize, base, demo;

        @layer demo {
          :root {
            --content-width: 720px;
            scrollbar-color: canvasText #0000;
          }
          section p {
            line-height: 1.5;
          }
          .emojis {
            --font-level: 4;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          .arrow {
            display: inline-block;
            opacity: 0.8;
            position: absolute;
            font-size: 0.875rem;
            font-family: "Gloria Hallelujah", cursive;
            transition: opacity 0.26s ease-out;
          }
          .arrow.arrow--debug {
            top: 140px;
            left: 30%;
            translate: -100% 0;
            width: 80px;
          }
          .arrow.arrow--debug span {
            display: inline-block;
            rotate: -24deg;
            translate: 0 100%;
          }
          .arrow.arrow--debug svg {
            rotate: 20deg;
            translate: 80% -80%;
            rotate: -25deg;
            left: 0%;
            width: 100%;
          }
          .filter {
            width: 100%;
            height: 100%;
            pointer-events: none;
            position: absolute;
            inset: 0;
          }
          :is(header, main) {
            width: var(--content-width);
            max-width: calc(100vw - 2rem);
            margin: 0 auto;
          }
          section {
            margin-block: 4rem;
          }
          .images {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .images img {
            width: 300px;
          }
          footer {
            padding: 1rem;
            text-align: center;
            font-size: 0.875rem;
            opacity: 0.7;
          }
          header {
            margin-block: 4rem;
          }
          header p {
            --font-level: 2;
            text-wrap: balance;
            color: color-mix(in oklch, canvasText, canvas 35%);
          }
          main {
            flex: 1;
          }
          main img {
            border-radius: 12px;
          }
          .apps {
            display: grid;
            grid-template-columns: repeat(4, 80px);
            gap: 1rem;
          }
          .app {
            width: 80px;
            font-size: 0.875rem;
            font-weight: 300;
          }
          .app span {
            display: block;
            text-align: center;
            white-space: nowrap;
          }
          .app img {
            width: 100%;
          }
          .nav-wrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: inherit;
          }
          [data-icons="true"] .effect nav {
            opacity: 1;
          }
          [data-mode="dock"] .effect {
            backdrop-filter: url(#filter) brightness(1.1) saturate(1.5);
          }
          .effect nav {
            width: 100%;
            height: 100%;
            flex-wrap: wrap;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem;
            opacity: 0;
            overflow: hidden;
            border-radius: inherit;
            transition: opacity 0.26s ease-out;
          }
          .effect nav img {
            width: 80px;
            aspect-ratio: 1;
          }
          .effect {
            opacity: 0;
            transition: opacity 0.26s ease-out;
            height: calc(var(--height) * 1px);
            width: calc(var(--width) * 1px);
            border-radius: calc(var(--radius) * 1px);
            position: fixed;
            z-index: 999999;
            background: light-dark(
              hsl(0 0% 100% / var(--frost, 0)),
              hsl(0 0% 0% / var(--frost, 0))
            );
            backdrop-filter: url(#filter) saturate(var(--saturation, 1));
            box-shadow: 0 0 2px 1px
                light-dark(
                  color-mix(in oklch, canvasText, #0000 85%),
                  color-mix(in oklch, canvasText, #0000 65%)
                )
                inset,
              0 0 10px 4px
                light-dark(
                  color-mix(in oklch, canvasText, #0000 90%),
                  color-mix(in oklch, canvasText, #0000 85%)
                )
                inset,
              0px 4px 16px rgba(17, 17, 26, 0.05),
              0px 8px 24px rgba(17, 17, 26, 0.05),
              0px 16px 56px rgba(17, 17, 26, 0.05),
              0px 4px 16px rgba(17, 17, 26, 0.05) inset,
              0px 8px 24px rgba(17, 17, 26, 0.05) inset,
              0px 16px 56px rgba(17, 17, 26, 0.05) inset;
          }
          .effect * {
            pointer-events: none;
          }
          .placeholder {
            width: 336px;
            height: 96px;
            max-width: 100%;
            position: relative;
            margin-bottom: 200px;
          }
          .dock-placeholder {
            width: 336px;
            height: 96px;
            border-radius: 16px;
            position: absolute;
            top: 50%;
            left: 50%;
            translate: -50% -50%;
          }
          [data-debug="true"] .displacement-debug {
            translate: 0 calc(100% + 1rem);
            scale: 1;
            opacity: 1;
          }
          .displacement-debug {
            pointer-events: none;
            height: 100%;
            width: 100%;
            position: absolute;
            inset: 0;
            translate: 0 calc(200% + 1rem);
            scale: 0.8;
            opacity: 0;
            transition-property: translate, opacity, scale;
            transition-duration: 0.26s;
            transition-timing-function: ease-out;
            z-index: -1;
          }
          .displacement-debug .label {
            position: absolute;
            left: 50%;
            top: calc(100% + 0.2lh);
          }
          .displacement-debug .label span {
            display: inline-block;
            font-size: 0.875rem;
            font-family: "Gloria Hallelujah", cursive;
            padding: 0.5rem 0.75rem;
            background: color-mix(in oklch, canvas, #0000 25%);
            backdrop-filter: blur(4px);
            border-radius: 6px;
            white-space: nowrap;
          }
          .displacement-debug .label svg {
            position: absolute;
            filter: drop-shadow(0 2px 10px canvas);
            right: 100%;
            rotate: 40deg;
            translate: 25% 60%;
            scale: -1 1;
            width: 40px;
          }
          .displacement-debug .displacement-image {
            height: 100%;
            width: 100%;
            pointer-events: none;
            border-radius: calc(var(--radius) * 1px);
          }
          h1 {
            --font-level: 6;
            line-height: 0.9;
            margin: 0;
            margin-bottom: 0.25lh;
          }
        }

        @layer base {
          :root {
            --font-size-min: 16;
            --font-size-max: 20;
            --font-ratio-min: 1.2;
            --font-ratio-max: 1.33;
            --font-width-min: 375;
            --font-width-max: 1500;
          }
          html {
            color-scheme: light dark;
          }
          [data-theme="light"] {
            color-scheme: light only;
          }
          [data-theme="dark"] {
            color-scheme: dark only;
          }
          :where(.fluid) {
            --fluid-min: calc(
              var(--font-size-min) *
                pow(var(--font-ratio-min), var(--font-level, 0))
            );
            --fluid-max: calc(
              var(--font-size-max) *
                pow(var(--font-ratio-max), var(--font-level, 0))
            );
            --fluid-preferred: calc(
              (var(--fluid-max) - var(--fluid-min)) /
                (var(--font-width-max) - var(--font-width-min))
            );
            --fluid-type: clamp(
              (var(--fluid-min) / 16) * 1rem,
              ((var(--fluid-min) / 16) * 1rem) -
                (((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) +
                (var(--fluid-preferred) * var(--variable-unit, 100vi)),
              (var(--fluid-max) / 16) * 1rem
            );
            font-size: var(--fluid-type);
          }
          *,
          *:after,
          *:before {
            box-sizing: border-box;
          }
          body {
            background: light-dark(#fff, #000);
            overflow-x: hidden;
            min-height: 100vh;
            font-family: "SF Pro Text", "SF Pro Icons", "AOS Icons",
              "Helvetica Neue", Helvetica, Arial, sans-serif, system-ui;
          }
          body::before {
            --size: 45px;
            --line: color-mix(in hsl, canvasText, transparent 80%);
            content: "";
            height: 100vh;
            width: 100vw;
            position: fixed;
            background: linear-gradient(
                  90deg,
                  var(--line) 1px,
                  transparent 1px var(--size)
                )
                calc(var(--size) * 0.36) 50% / var(--size) var(--size),
              linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0%
                calc(var(--size) * 0.32) / var(--size) var(--size);
            mask: linear-gradient(-20deg, transparent 50%, white);
            top: 0;
            transform-style: flat;
            pointer-events: none;
            z-index: -1;
          }
          .bear-link {
            color: canvasText;
            position: fixed;
            top: 1rem;
            left: 1rem;
            width: 48px;
            aspect-ratio: 1;
            display: grid;
            place-items: center;
            opacity: 0.8;
          }
          :where(.x-link, .bear-link):is(:hover, :focus-visible) {
            opacity: 1;
          }
          .bear-link svg {
            width: 75%;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        }

        [data-top="true"] div.tp-dfwv {
          top: 8px;
        }
        div.tp-dfwv {
          position: fixed;
          width: 280px;
          bottom: 8px;
          top: unset;
          view-transition-name: pane;
        }
      `}</style>
    </div>
  );
}

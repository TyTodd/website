import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Card from "@/components/Card";
import type { ReactElement } from "react";
import Featured from "@/components/Featured";

/**
 * Render the home page with intro, social links, and project cards.
 *
 * Params:
 * - none: This function takes no parameters.
 *
 * Returns:
 * - ReactElement: The home page markup.
 */
export default function Home(): ReactElement {
  return (
    <div>
      <h1>Hi I'm Tyrin</h1>
      <Image
        src="/headshot.jpg"
        alt="Tyrin"
        width={400}
        height={400}
        style={{ display: "block", margin: 0 }}
      />
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          padding: 0,
          margin: 0,
          alignItems: "center",
        }}
      >
        <li>
          <a
            href="https://www.linkedin.com/in/tyrin-ian-todd/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={20} />
          </a>
        </li>
        <li style={{ margin: "0 8px" }}>|</li>
        <li>
          <a
            href="https://github.com/TyTodd"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={20} />
          </a>
        </li>
        <li style={{ margin: "0 8px" }}>|</li>
        <li>
          <a
            href="https://x.com/ty_todd1"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter size={20} />
          </a>
        </li>
      </ul>
      <h2 style={{ marginTop: 16 }}>About me</h2>
      <p style={{ marginTop: 8 }}>
        I’m Tyrin-Ian Todd, a maker, engineer, and entrepreneur driven by a
        passion for building systems that expand the boundaries of intelligence
        and creativity. At MIT, where I studied Course 6-4 (AI & Decision
        Making), I’ve worked on projects ranging from autonomous machines to AI
        models. I founded Modaic 🐙, a platform for packaging and sharing
        self-improving AI agents, where I’m exploring how intelligence can be
        designed, scaled, and remixed like code. Beyond the projects, I’m
        chasing the thrill of building things that feel impossible, until
        they’re suddenly real.
      </p>

      <style>{`
        .projectsGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) {
          .projectsGrid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      <h2 style={{ marginTop: 16 }}>My Favorite Projects</h2>
      <Featured
        routes={[
          "/posts/2s007",
          "/posts/dimension",
          "/posts/present_pastell",
          "/posts/rss",
        ]}
      />
    </div>
  );
}

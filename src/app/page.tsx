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
        Hey I&apos;m Tyrin. Welcome to my realm. Little bit about me. I studied
        AI+CS at MIT (course 6-4 for fellow beavers) and left the MEng program to
        build Modaic 🐙 the verification and alignment layer for AI decisions.
        This website is my virtual tech journal, a log of all my past endeavors
        in robotics, video games, web design, and AI. I also recently picked up
        some blog writing. Enjoy
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

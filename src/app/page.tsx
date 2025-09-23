import Image from "next/image";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Card from "@/components/Card";
import type { ReactElement } from "react";

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
      <Image src="/headshot.jpg" alt="Tyrin" width={400} height={400} style={{ display: "block", margin: 0 }} />
      <ul style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, alignItems: "center" }}>
        <li>
          <a href="https://www.linkedin.com/in/tyrin-ian-todd/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={20} />
          </a>
        </li>
        <li style={{ margin: "0 8px" }}>|</li>
        <li>
          <a href="https://github.com/TyTodd" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <FaGithub size={20} />
          </a>
        </li>
        <li style={{ margin: "0 8px" }}>|</li>
        <li>
          <a href="https://x.com/ty_todd1" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FaXTwitter size={20} />
          </a>
        </li>
      </ul>
      <h2 style={{ marginTop: 16 }}>About me</h2>
      <p style={{ marginTop: 8 }}>
        I’m a software engineer focused on building clean, accessible web experiences with
        Next.js and TypeScript. I enjoy working across the stack and shipping thoughtful UX.
      </p>

      <style>{`
        .projectsGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) {
          .projectsGrid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      <div className="projectsGrid" style={{ maxWidth: 900, margin: "16px auto 0" }}>
        <Card
          title="Project One"
          imageSrc="/window.svg"
          imageAlt="Project One preview"
          href="https://github.com/TyTodd"
        >
          <p style={{ margin: 0 }}>A cool project showcasing something impressive.</p>
        </Card>
        <Card
          title="Project Two"
          imageSrc="/globe.svg"
          imageAlt="Project Two preview"
          href="https://x.com/ty_todd1"
        >
          <p style={{ margin: 0 }}>Another project with neat features and design.</p>
        </Card>
      </div>



    </div>
  );
}

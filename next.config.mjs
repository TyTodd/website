import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  latex: {
    renderer: "katex",
    options: {
      strict: false,
    },
  },
  // ... Add Nextra-specific options here
});

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
  turbopack: {
    root: "/Users/tytodd/Desktop/Projects/website",
  },
  async redirects() {
    return [
      {
        source: "/tags/:tag",
        destination: "/posts?tags=:tag",
        permanent: true,
      },
    ];
  },
});

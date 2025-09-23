import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  latex: true,
  // ... Add Nextra-specific options here
});

// Export the final Next.js config with Nextra included
export default withNextra({
  // ... Add regular Next.js options here
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

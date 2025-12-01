import app from "../../../";

export default function () {
  app.get("/affiliate/api/public/affiliates/slug/:slug", async (c) => {
    const { slug } = c.req.param();

    const creators = process.env.CREATORS;
    const creatorList = creators
      ?.split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    for (const affiliate of creatorList ?? []) {
      if (slug.toLowerCase() === affiliate.toLowerCase()) {
        return c.json({
          id: affiliate,
          slug: affiliate,
          displayName: affiliate,
          status: "ACTIVE",
          verified: false,
        });
      }
    }

    return c.json([], 404);
  });
}

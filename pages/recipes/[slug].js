import { createClient } from 'contentful';

export default function RecipeDetails() {
  return <div>Recipe Details</div>;
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: 'recipe',
  });

  const paths = res.items.map((item) => {
    return { params: { slug: item.fields.slug } };
  });

  // If we get to a path that is not in the paths list, we will show 404 page rather than a fall back page.
  return {
    paths,
    fallback: false,
  };
};

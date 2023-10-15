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

// You will get the param (from getStaticPaths call) from context object
// export async function getStaticProps(context) {
export async function getStaticProps({ params }) {
  // Get only one item where the item's fields.slug === params.slug value
  // It will always return in an array, even though we know for this there will be only one items matches the params.slug
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params.slug,
  });

  return {
    props: {
      recipe: items[0],
    },
  };
}

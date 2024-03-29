import { createClient } from 'contentful';
import RecipeCard from '../components/RecipeCard';

export default function Recipes({ recipes }) {
  console.log('recipes=', recipes);

  return (
    <div className='recipe-list'>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 60px;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  // In contentful, we actually name it 'Recipe'
  const res = await client.getEntries({ content_type: 'recipe' });

  return {
    props: {
      recipes: res.items,
    },
    revalidate: 1, // 1 seconds. Incremental static regeneration only work for existing page. Any new page added into contentful will be work for the [slug] link.
  };
}

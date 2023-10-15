import {createClient} from 'contentful';
import RecipeCard from '../components/RecipeCard';

export default function Recipes({recipes}) {
  console.log(recipes);

  return (
    <div className="recipe-list">
      {recipes.map(recipe => <RecipeCard key={recipe.sys.id} recipe={recipe} /> )}
    </div>
  )
}

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  // In contentful, we actually name it 'Recipe'
  const res = await  client.getEntries({content_type: 'recipe'})

  return {
    props: {
      recipes: res.items
    }
  }
}

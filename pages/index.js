import {createClient} from 'contentful';

export default function Recipes() {
  return (
    <div className="recipe-list">
      Recipe List
    </div>
  )
}

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });
}

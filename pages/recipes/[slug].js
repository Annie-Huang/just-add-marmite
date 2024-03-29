import { createClient } from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Skeleton from '../../components/Skeleton';

export default function RecipeDetails({ recipe }) {
  console.log('recipe=', recipe);

  if (!recipe) return <Skeleton />;

  const {
    featuredImage,
    title,
    cookingTime,
    ingredients,
    method,
  } = recipe.fields;

  return (
    <div>
      <div className='banner'>
        <Image
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>

      <div className='info'>
        <p>Take about {cookingTime} mins to cook.</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>

      <div className='method'>
        <h3>Methods:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ', ';
        }
        .info span:last-child::after {
          content: '.';
        }
      `}</style>
    </div>
  );
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

  // If we get to a path that is not in the paths list, with fallback: false, we will show 404 page rather than a fall back page.
  // If fallback: true. It will allow next.js to load any new added page in contentful while return a fall back version of the component.
  //   Once I have the data, I will inject the data into the component so user can see it. The way to get the new data is to rerun the getStaticProps method.
  return {
    paths,
    fallback: true,
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

  // In case user enter rubbish data into the url
  // Try http://localhost:3000/recipes/fewafewa
  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // meaning next time it fetch, it may have the data already.
      },
    };
  }

  return {
    props: {
      recipe: items[0],
    },
    revalidate: 1, // 1 seconds
  };
}

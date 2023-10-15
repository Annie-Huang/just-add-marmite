export const RecipeCard = ({ recipe }) => {
  const { title, slug, cookingTime, thumbnail } = recipe.fields;

  return (
    <div className='card'>
      <div className='featured'>{recipe.fields.title}</div>
    </div>
  );
};

export default RecipeCard;

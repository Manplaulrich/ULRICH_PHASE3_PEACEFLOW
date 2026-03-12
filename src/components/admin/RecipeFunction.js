

// src/supabase/recipeFunctions.js
import { supabase } from '../../lib/supabase';

export const createRecipeSupabase = async ({ name, output, materials, userId }) => {
  try {
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert([{ name, output, user_id: userId }])
      .select()
      .single();

    if (recipeError) throw recipeError;

    const recipeId = recipeData.id;

    const materialRows = materials.map((mat) => ({
      recipe_id: recipeId,
      material_id: mat.material_id,
      quantity: mat.quantity,
      unit: mat.unit,
    }));

    const { error: materialsError } = await supabase
      .from('recipe_materials')
      .insert(materialRows);

    if (materialsError) throw materialsError;

    return recipeData;
  } catch (error) {
    console.error('Create Recipe Error:', error.message);
    return null;
  }
};

export const updateRecipeSupabase = async ({ recipeId, name, output, materials }) => {
  try {
    const { error: recipeError } = await supabase
      .from('recipes')
      .update({ name, output })
      .eq('id', recipeId);
    if (recipeError) throw recipeError;

    const { error: deleteError } = await supabase
      .from('recipe_materials')
      .delete()
      .eq('recipe_id', recipeId);
    if (deleteError) throw deleteError;

    const materialRows = materials.map((mat) => ({
      recipe_id: recipeId,
      material_id: mat.material_id,
      quantity: mat.quantity,
      unit: mat.unit,
    }));

    const { error: materialsError } = await supabase
      .from('recipe_materials')
      .insert(materialRows);
    if (materialsError) throw materialsError;

    return true;
  } catch (error) {
    console.error('Update Recipe Error:', error.message);
    return false;
  }
};

export const deleteRecipeSupabase = async (recipeId) => {
  try {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);
    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Delete Recipe Error:', error.message);
    return false;
  }
};
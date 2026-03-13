
import { useState,useEffect} from "react";
 import { RawMaterialContext } from "./RawMaterialContext";
 import {supabase} from "../../lib/supabase"
export  function AppProvider({children}) {
    // const [material, setMaterial]=useState([
    //     { item:'flour', quantity:10, unit:"kg", minStock:2 ,status:"inStock"},
    //     { item:'sugar', quantity:5, unit:"kg", minStock:5 ,status:" LowStock"},
    //     { item:'salt', quantity:3, unit:"kg", minStock:2 ,status:"inStock"},
    //     { item:'butter', quantity:3, unit:"kg", minStock:5 ,status:"LowStock"}

      
    // ])
     const [material, setMaterial]=useState([])
    
     
   useEffect(()=>{
    async function fetchMaterials(){
        const {data, error}=await supabase 
        .from("materials")
        .select("*")
         .order("id", { ascending: false })
        if(error){
          alert(error.message)
        }else{
          setMaterial(data)
        }
     }
      fetchMaterials()
    },[])

    // const [recipe, setRecipe]=useState([
    //    {
    //     name:"Bread",
    //     output:1,
    //     user:[
    //        "ulrich"
    //     ],
    //     materials:[
    //       {items:"flour",quant:1, units:"kg"},
    //       {items:"salt",quant:0.5, units:"g"},
    //       {items:"butter",quant:0.6, units:"g"}
    //     ]
    //    },
    //   {
    //     name:"cake",
    //     output:1,
    //     user:[
    //        "ulrich"
    //     ],
    //     materials:[
    //       {items:"flour",quant:2, units:"kg"},
    //       {items:"salt",quant:0.5, units:"g"},
    //       {items:"butter",quant:0.8, units:"g"}
    //     ]
    //    }
       
    // ])
     const [recipe, setRecipe]=useState([])
       const [loading, setLoading] = useState(true);


                         const fetchRecipes = async () => {
    try {
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipesError) throw recipesError;

      // Fetch materials for each recipe
      const recipesWithMaterials = await Promise.all(
        recipesData.map(async (recipe) => {
          const { data: materialsData, error: materialsError } = await supabase
            .from('recipe_materials')
            .select('*')
            .eq('recipe_id', recipe.id);

          if (materialsError) throw materialsError;

          return {
            ...recipe,
            materials: materialsData.map(m => ({
              items: m.items,
              quant: m.quant,
              units: m.units
            }))
          };
        })
      );

      setRecipe(recipesWithMaterials);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new recipe
  const createRecipe = async (recipeData) => {
    try {
      // Insert recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            name: recipeData.name,
            output: recipeData.output
          }
        ])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert materials
      const materialsToInsert = recipeData.materials.map(m => ({
        recipe_id: recipe.id,
        items: m.items,
        quant: m.quant,
        units: m.units
      }));

      const { error: materialsError } = await supabase
        .from('recipe_materials')
        .insert(materialsToInsert);

      if (materialsError) throw materialsError;

      // Refresh recipes
      await fetchRecipes();
      return { success: true, data: recipe };
    } catch (error) {
      console.error('Error creating recipe:', error);
      return { success: false, error: error.message };
    }
  };

  // Update recipe
  const updateRecipe = async (id, recipeData) => {
    try {
      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          name: recipeData.name,
          output: recipeData.output,
          updated_at: new Date()
        })
        .eq('id', id);

      if (recipeError) throw recipeError;

      // Delete old materials
      const { error: deleteError } = await supabase
        .from('recipe_materials')
        .delete()
        .eq('recipe_id', id);

      if (deleteError) throw deleteError;

      // Insert new materials
      const materialsToInsert = recipeData.materials.map(m => ({
        recipe_id: id,
        items: m.items,
        quant: m.quant,
        units: m.units
      }));

      const { error: materialsError } = await supabase
        .from('recipe_materials')
        .insert(materialsToInsert);

      if (materialsError) throw materialsError;

      // Refresh recipes
      await fetchRecipes();
      return { success: true };
    } catch (error) {
      console.error('Error updating recipe:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete recipe
  const deleteRecipe = async (id) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh recipes
      await fetchRecipes();
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return { success: false, error: error.message };
    }
  };

  // Fetch materials (assuming you have a materials table)
  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*');

      if (error) throw error;
      setMaterial(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchMaterials();
  }, []);


const [productionHistory,setProductionHistory]=useState([])

  return (
    <>
       <RawMaterialContext.Provider value={{material, setMaterial,recipe,setRecipe,productionHistory,setProductionHistory,loading,createRecipe,updateRecipe,deleteRecipe,fetchRecipes}}>
           {children}
       </RawMaterialContext.Provider>
    </>
  )
}


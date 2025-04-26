import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsScreen() {
  const { mealId } = useLocalSearchParams(); // Get params using Expo Router
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => {
        setRecipe(response.data.meals[0]);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch recipe details');
        setLoading(false);
      });
  }, [mealId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff6347" style={styles.center} />;
  }

  if (!recipe) {
    return <Text style={styles.center}>No recipe found</Text>;
  }

  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((item, index) => (
        <Text key={index} style={styles.item}>• {item}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', paddingHorizontal: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#ff6347', paddingHorizontal: 20, marginTop: 15, marginBottom: 5 },
  item: { fontSize: 16, color: '#333', paddingHorizontal: 20, marginBottom: 5 },
  instructions: { fontSize: 16, color: '#333', paddingHorizontal: 20, lineHeight: 24, marginBottom: 20 },
});
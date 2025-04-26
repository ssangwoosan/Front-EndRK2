import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use Expo Router's navigation

  useEffect(() => {
    axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then(response => {
        setRecipes(response.data.meals || []);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch recipes');
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push({ pathname: '/details', params: { mealId: item.idMeal } })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
      <Text style={styles.itemTitle}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipe Explorer</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff6347" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item.idMeal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  item: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
});
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, ChevronRight, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { exercises } from '@/data/exercises';
import { Exercise } from '@/types';

export default function ExercisesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['Всі', 'Сила', 'Кардіо', 'Гнучкість', 'Баланс'];

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    const filtered = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(text.toLowerCase()) ||
                          exercise.muscle.toLowerCase().includes(text.toLowerCase()) ||
                          exercise.equipment.toLowerCase().includes(text.toLowerCase());
      
      const matchesCategory = selectedCategory === null || 
                            selectedCategory === 'Всі' || 
                            exercise.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredExercises(filtered);
  };

  const handleCategorySelect = (category: string) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    
    const filtered = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = newCategory === null || 
                            newCategory === 'Всі' || 
                            exercise.category === newCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredExercises(filtered);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity style={styles.exerciseItem}>
      <Image source={{ uri: item.image }} style={styles.exerciseImage} />
      <View style={styles.exerciseDetails}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          {item.isFavorite && <Star color={Colors.dark.primary} fill={Colors.dark.primary} size={18} />}
        </View>
        <Text style={styles.exerciseMuscle}>{item.muscle}</Text>
        <View style={styles.exerciseTags}>
          <View style={styles.exerciseTag}>
            <Text style={styles.exerciseTagText}>{item.difficulty}</Text>
          </View>
          <View style={styles.exerciseTag}>
            <Text style={styles.exerciseTagText}>{item.equipment}</Text>
          </View>
        </View>
      </View>
      <ChevronRight color={Colors.dark.textSecondary} size={20} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Вправи</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color={Colors.dark.primary} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={Colors.dark.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Пошук вправ..."
            placeholderTextColor={Colors.dark.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.exercisesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Вправ не знайдено</Text>
            <Text style={styles.emptySubText}>Спробуйте змінити параметри пошуку</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    borderRadius: Layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: Layout.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.dark.card,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.dark.primary,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.text,
  },
  selectedCategoryText: {
    color: '#000000',
  },
  exercisesList: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 100,
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 90,
    height: '100%',
  },
  exerciseDetails: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 4,
    flex: 1,
  },
  exerciseMuscle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  exerciseTags: {
    flexDirection: 'row',
  },
  exerciseTag: {
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.radius.sm,
    marginRight: 8,
  },
  exerciseTagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.dark.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  emptySubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
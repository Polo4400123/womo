import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Search, Filter, ChevronRight, Star, PieChart } from 'lucide-react-native';
import { meals } from '@/data/meals';
import { Meal } from '@/types';

export default function NutritionScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>(meals);
  
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => meal.category === category);
      setFilteredMeals(filtered);
    }
  };

  const renderNutritionSummary = () => {
    // Calculate total nutrition for the day
    const totalCalories = 1850;
    const totalProtein = 140;
    const totalCarbs = 180;
    const totalFats = 55;
    
    // Calculate percentages for the chart
    const proteinPercent = (totalProtein * 4 / totalCalories) * 100;
    const carbsPercent = (totalCarbs * 4 / totalCalories) * 100;
    const fatsPercent = (totalFats * 9 / totalCalories) * 100;

    return (
      <View style={styles.summaryCard}>
        <View style={styles.macrosHeader}>
          <Text style={styles.macrosTitle}>Today's Nutrition</Text>
          <PieChart color={Colors.dark.primary} size={20} />
        </View>
        
        <View style={styles.calorieCounter}>
          <Text style={styles.calorieValue}>{totalCalories}</Text>
          <Text style={styles.calorieLabel}>calories</Text>
        </View>
        
        <View style={styles.macrosBar}>
          <View style={[styles.macroProtein, { flex: proteinPercent / 100 }]} />
          <View style={[styles.macroCarbs, { flex: carbsPercent / 100 }]} />
          <View style={[styles.macroFats, { flex: fatsPercent / 100 }]} />
        </View>
        
        <View style={styles.macrosLegend}>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: Colors.dark.primary }]} />
            <Text style={styles.macroText}>{totalProtein}g protein</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: Colors.dark.accent }]} />
            <Text style={styles.macroText}>{totalCarbs}g carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIndicator, { backgroundColor: Colors.dark.warning }]} />
            <Text style={styles.macroText}>{totalFats}g fats</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity style={styles.mealItem}>
      <Image source={{ uri: item.image }} style={styles.mealImage} />
      <View style={styles.mealDetails}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.name}</Text>
          {item.isFavorite && <Star color={Colors.dark.primary} fill={Colors.dark.primary} size={18} />}
        </View>
        <Text style={styles.mealCategory}>{item.category}</Text>
        <View style={styles.mealMacros}>
          <Text style={styles.mealMacroText}>{item.calories} kcal</Text>
          <Text style={styles.mealMacroSeparator}>•</Text>
          <Text style={styles.mealMacroText}>{item.protein}g protein</Text>
        </View>
      </View>
      <ChevronRight color={Colors.dark.textSecondary} size={20} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.dark.primary} size={20} />
          </TouchableOpacity>
        </View>

        {renderNutritionSummary()}

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

        <View style={styles.mealsContainer}>
          <FlatList
            data={filteredMeals}
            keyExtractor={(item) => item.id}
            renderItem={renderMealItem}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No meals found</Text>
                <Text style={styles.emptySubText}>Try selecting a different category</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
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
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  macrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  macrosTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
  },
  calorieCounter: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  calorieValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    color: Colors.dark.primary,
  },
  calorieLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  macrosBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  macroProtein: {
    backgroundColor: Colors.dark.primary,
  },
  macroCarbs: {
    backgroundColor: Colors.dark.accent,
  },
  macroFats: {
    backgroundColor: Colors.dark.warning,
  },
  macrosLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  macroText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.dark.textSecondary,
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
  mealsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 100,
  },
  mealItem: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  mealImage: {
    width: 90,
    height: 90,
  },
  mealDetails: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 4,
    flex: 1,
  },
  mealCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealMacroText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.dark.primary,
  },
  mealMacroSeparator: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginHorizontal: 6,
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
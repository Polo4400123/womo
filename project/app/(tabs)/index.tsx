import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Trophy, Activity, TrendingUp, Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { exercises } from '@/data/exercises';
import { meals } from '@/data/meals';
import { progressData, userProfile } from '@/data/user';
import { Exercise, Meal } from '@/types';

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('');
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const latestProgress = progressData[progressData.length - 1];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Доброго ранку');
    else if (hour < 18) setGreeting('Доброго дня');
    else setGreeting('Доброго вечора');
    
    setFavoriteExercises(exercises.filter(exercise => exercise.isFavorite));
    setFavoriteMeals(meals.filter(meal => meal.isFavorite));
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {userProfile.name}</Text>
        <Text style={styles.subTitle}>Досягаймо ваших фітнес-цілей разом!</Text>
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={[Colors.dark.primary, Colors.dark.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{latestProgress.weight} кг</Text>
            <Text style={styles.statLabel}>Поточна вага</Text>
          </View>
          <Activity color="#121212" size={30} />
        </LinearGradient>
        
        <LinearGradient
          colors={['#262626', '#191919']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCard}
        >
          <View style={styles.statContent}>
            <Text style={styles.statSecondaryValue}>{latestProgress.workouts}</Text>
            <Text style={styles.statSecondaryLabel}>Тренувань за тиждень</Text>
          </View>
          <Trophy color={Colors.dark.primary} size={28} />
        </LinearGradient>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Тенденція прогресу</Text>
        <TrendingUp color={Colors.dark.primary} size={20} />
      </View>

      <View style={styles.progressGraph}>
        <View style={styles.graphLabels}>
          {progressData.map((data, index) => (
            <Text key={index} style={styles.graphLabel}>
              {new Date(data.date).toLocaleDateString('uk-UA', { month: 'short', day: 'numeric' })}
            </Text>
          ))}
        </View>
        <View style={styles.graphContainer}>
          <View style={styles.graphLine} />
          {progressData.map((data, index) => {
            const position = index / (progressData.length - 1) * 100;
            const weightPercent = (data.weight - 70) / 15 * 100;
            return (
              <View 
                key={index} 
                style={[
                  styles.graphDot, 
                  { 
                    left: `${position}%`, 
                    bottom: `${weightPercent}%`,
                    backgroundColor: Colors.dark.primary 
                  }
                ]} 
              />
            );
          })}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Улюблені вправи</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Дивитись усі</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.exercisesContainer}
      >
        {favoriteExercises.map(exercise => (
          <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
            <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Star color={Colors.dark.primary} fill={Colors.dark.primary} size={16} />
              </View>
              <Text style={styles.exerciseDetail}>{exercise.muscle} • {exercise.difficulty}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Улюблені страви</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Дивитись усі</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mealsContainer}
      >
        {favoriteMeals.map(meal => (
          <TouchableOpacity key={meal.id} style={styles.mealCard}>
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Star color={Colors.dark.primary} fill={Colors.dark.primary} size={16} />
              </View>
              <Text style={styles.mealDetail}>{meal.calories} ккал • {meal.protein}г білку</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  subTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000000',
  },
  statSecondaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  statSecondaryLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.primary,
  },
  progressGraph: {
    height: 200,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    paddingBottom: 24,
  },
  graphContainer: {
    flex: 1,
    position: 'relative',
  },
  graphLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '50%',
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  graphDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.primary,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  graphLabel: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  exercisesContainer: {
    paddingHorizontal: Layout.spacing.lg,
  },
  exerciseCard: {
    width: 180,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    marginRight: Layout.spacing.md,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 120,
  },
  exerciseInfo: {
    padding: Layout.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.dark.text,
    flex: 1,
  },
  exerciseDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  mealsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  mealCard: {
    width: 200,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    marginRight: Layout.spacing.md,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 130,
  },
  mealInfo: {
    padding: Layout.spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.dark.text,
    flex: 1,
  },
  mealDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  spacer: {
    height: 100,
  },
});
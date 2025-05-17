import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Settings, ChevronRight, Activity, Calendar, Award, History, Lock, Info as InfoIcon, LogOut } from 'lucide-react-native';
import { userProfile } from '@/data/user';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkoutSession = {
  id: string;
  date: string;
  duration: string;
  type: string;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[];
};

type TotalLoadData = {
  date: string;
  totalLoad: number;
};

export default function ProfileScreen() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [totalLoadData, setTotalLoadData] = useState<TotalLoadData[]>([]);
  
  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('@workouts');
      if (savedWorkouts) {
        const workouts = JSON.parse(savedWorkouts);
        setWorkoutSessions(workouts);
        calculateTotalLoad(workouts);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const calculateTotalLoad = (workouts: WorkoutSession[]) => {
    const loadData = workouts.map(workout => {
      // Calculate total load for each workout using the formula
      const totalLoad = workout.exercises.reduce((sum, exercise) => {
        // Total_Load = Sets × Reps × Weight for each exercise
        return sum + (exercise.sets * exercise.reps * exercise.weight);
      }, 0);
      
      return {
        date: workout.date,
        totalLoad
      };
    });

    // Sort by date
    loadData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTotalLoadData(loadData);
  };

  const getMaxTotalLoad = () => {
    if (totalLoadData.length === 0) return 1000; // Default max for empty data
    const max = Math.max(...totalLoadData.map(data => data.totalLoad));
    return max === 0 ? 1000 : max; // Use 1000 as default if all values are 0
  };

  const renderLoadGraph = () => {
    const maxLoad = getMaxTotalLoad();
    const graphHeight = 200;

    if (totalLoadData.length === 0) {
      return (
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Прогрес навантаження</Text>
          <View style={styles.emptyGraph}>
            <Text style={styles.emptyGraphText}>Немає даних про тренування</Text>
            <Text style={styles.emptyGraphSubText}>Додайте тренування щоб побачити прогрес</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Прогрес навантаження</Text>
        <View style={styles.graph}>
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{Math.round(maxLoad)}кг</Text>
            <Text style={styles.axisLabel}>{Math.round(maxLoad * 0.75)}кг</Text>
            <Text style={styles.axisLabel}>{Math.round(maxLoad * 0.5)}кг</Text>
            <Text style={styles.axisLabel}>{Math.round(maxLoad * 0.25)}кг</Text>
            <Text style={styles.axisLabel}>0кг</Text>
          </View>
          <View style={styles.plotArea}>
            {totalLoadData.map((data, index) => (
              <View key={index} style={styles.dataPoint}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${(data.totalLoad / maxLoad) * 100}%`,
                        backgroundColor: Colors.dark.primary 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dateLabel}>
                  {new Date(data.date).toLocaleDateString('uk-UA', { 
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
                <Text style={styles.loadLabel}>
                  {Math.round(data.totalLoad)}кг
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const menuItems = [
    { icon: Activity, title: 'Statistics & Progress', screen: 'statistics' },
    { icon: Calendar, title: 'Workout History', screen: 'workoutHistory' },
    { icon: Award, title: 'Goals & Achievements', screen: 'goals' },
    { icon: History, title: 'Body Measurements', screen: 'measurements' },
    { icon: Lock, title: 'Privacy Settings', screen: 'privacy' },
    { icon: InfoIcon, title: 'About & Help', screen: 'about' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color={Colors.dark.primary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileCard}>
        <LinearGradient
          colors={[Colors.dark.primary, Colors.dark.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        />
        <View style={styles.profileAvatar}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg' }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileDetails}>
          Age: {userProfile.age} • Weight: {userProfile.weight}kg • Height: {userProfile.height}cm
        </Text>
        <View style={styles.goalChip}>
          <Text style={styles.goalText}>
            Goal: {userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1)} Weight
          </Text>
        </View>
      </View>

      {renderLoadGraph()}

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <item.icon color={Colors.dark.primary} size={20} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <ChevronRight color={Colors.dark.textSecondary} size={20} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconContainer, styles.logoutIcon]}>
              <LogOut color="#FF5252" size={20} />
            </View>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>FitTrack v1.0.0</Text>
      </View>

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
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    borderRadius: Layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.radius.xl,
    backgroundColor: Colors.dark.card,
    paddingVertical: Layout.spacing.xl,
    overflow: 'hidden',
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    borderWidth: 3,
    borderColor: Colors.dark.primary,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  profileDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  goalChip: {
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  goalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.primary,
  },
  graphContainer: {
    backgroundColor: Colors.dark.card,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    height: 300,
  },
  graphTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  graph: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
  },
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: Layout.spacing.sm,
  },
  axisLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  plotArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
    paddingTop: Layout.spacing.md,
  },
  dataPoint: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  barContainer: {
    width: '100%',
    height: '85%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    minHeight: 4,
    borderRadius: Layout.radius.sm,
  },
  dateLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.dark.textSecondary,
    marginTop: 4,
    transform: [{ rotate: '-45deg' }],
  },
  loadLabel: {
    position: 'absolute',
    top: -20,
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.dark.primary,
  },
  emptyGraph: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyGraphText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  emptyGraphSubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  menuSection: {
    marginHorizontal: Layout.spacing.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    marginBottom: Layout.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    borderRadius: Layout.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutIcon: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FF5252',
  },
  versionInfo: {
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  spacer: {
    height: 100,
  },
});
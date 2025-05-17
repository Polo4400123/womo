import { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ChevronRight, Calendar, Clock, Star } from 'lucide-react-native';
import { programs } from '@/data/programs';
import { WorkoutProgram } from '@/types';

export default function ProgramsScreen() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<WorkoutProgram[]>(programs);
  
  const levels = ['All', 'beginner', 'intermediate', 'advanced'];

  const handleLevelSelect = (level: string) => {
    const newLevel = level === selectedLevel ? null : level;
    setSelectedLevel(newLevel);
    
    if (newLevel === null || newLevel === 'All') {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter(program => program.level === newLevel);
      setFilteredPrograms(filtered);
    }
  };

  const renderProgramItem = ({ item }: { item: WorkoutProgram }) => (
    <TouchableOpacity style={styles.programCard}>
      <Image source={{ uri: item.image }} style={styles.programImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.programDetails}>
          <View style={styles.programHeader}>
            <Text style={styles.programName}>{item.name}</Text>
            {item.isFavorite && <Star color={Colors.dark.primary} fill={Colors.dark.primary} size={18} />}
          </View>
          
          <Text style={styles.programDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.programStats}>
            <View style={styles.programStat}>
              <Calendar color={Colors.dark.primary} size={16} />
              <Text style={styles.programStatText}>{item.duration}</Text>
            </View>
            <View style={styles.programStat}>
              <Clock color={Colors.dark.primary} size={16} />
              <Text style={styles.programStatText}>{item.days.length} days</Text>
            </View>
          </View>
          
          <View style={[styles.levelBadge, getLevelStyle(item.level)]}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const getLevelStyle = (level: string) => {
    switch(level) {
      case 'beginner':
        return styles.beginnerLevel;
      case 'intermediate':
        return styles.intermediateLevel;
      case 'advanced':
        return styles.advancedLevel;
      default:
        return styles.beginnerLevel;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Programs</Text>
      </View>

      <View style={styles.levelsContainer}>
        <FlatList
          data={levels}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.levelButton,
                selectedLevel === item && styles.selectedLevelButton
              ]}
              onPress={() => handleLevelSelect(item)}
            >
              <Text 
                style={[
                  styles.levelButtonText,
                  selectedLevel === item && styles.selectedLevelText
                ]}
              >
                {item === 'All' ? 'All Levels' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.levelsList}
        />
      </View>

      <FlatList
        data={filteredPrograms}
        keyExtractor={(item) => item.id}
        renderItem={renderProgramItem}
        contentContainerStyle={styles.programsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No programs found</Text>
            <Text style={styles.emptySubText}>Try selecting a different level</Text>
          </View>
        )}
      />
    </View>
  );
}

// Import needed at the top of component
import { LinearGradient } from 'expo-linear-gradient';

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
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
  },
  levelsContainer: {
    marginBottom: Layout.spacing.md,
  },
  levelsList: {
    paddingHorizontal: Layout.spacing.lg,
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.dark.card,
  },
  selectedLevelButton: {
    backgroundColor: Colors.dark.primary,
  },
  levelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.text,
  },
  selectedLevelText: {
    color: '#000000',
  },
  programsList: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 100,
  },
  programCard: {
    height: 220,
    borderRadius: Layout.radius.lg,
    marginBottom: Layout.spacing.lg,
    overflow: 'hidden',
  },
  programImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  programDetails: {
    padding: Layout.spacing.lg,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.dark.text,
    marginBottom: 4,
    flex: 1,
  },
  programDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.md,
  },
  programStats: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  programStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
  },
  programStatText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  levelBadge: {
    position: 'absolute',
    top: Layout.spacing.lg,
    right: Layout.spacing.lg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.radius.lg,
  },
  beginnerLevel: {
    backgroundColor: 'rgba(174, 252, 65, 0.8)',
  },
  intermediateLevel: {
    backgroundColor: 'rgba(24, 160, 251, 0.8)',
  },
  advancedLevel: {
    backgroundColor: 'rgba(255, 82, 82, 0.8)',
  },
  levelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#000000',
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
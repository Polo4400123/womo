import { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, TextInput, Modal } from 'react-native';
import { Calendar as CalendarIcon, Clock, Dumbbell, ChevronLeft, ChevronRight, Plus, X, CircleMinus as MinusCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { exercises } from '@/data/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WorkoutSession = {
  id: string;
  date: string;
  duration: string;
  type: string;
  exercises: WorkoutExercise[];
};

type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const MONTHS = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

const WORKOUTS_STORAGE_KEY = '@workouts';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);
      if (savedWorkouts) {
        setWorkoutSessions(JSON.parse(savedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const saveWorkouts = async (workouts: WorkoutSession[]) => {
    try {
      await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  };

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    let firstDayIndex = firstDay.getDay() || 7;
    firstDayIndex = firstDayIndex - 1;
    
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  }, [currentMonth]);

  const selectedDateWorkouts = workoutSessions.filter(session => 
    session.date === selectedDate.toISOString().split('T')[0]
  );

  const hasWorkout = (date: Date) => {
    return workoutSessions.some(session => 
      session.date === date.toISOString().split('T')[0]
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getPreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return {
      name: MONTHS[date.getMonth()],
      year: date.getFullYear()
    };
  };

  const getNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    return {
      name: MONTHS[date.getMonth()],
      year: date.getFullYear()
    };
  };

  const addExercise = (exercise: typeof exercises[0]) => {
    setSelectedExercises([...selectedExercises, { 
      id: exercise.id, 
      name: exercise.name, 
      sets: 3, 
      reps: 12,
      weight: 0 
    }]);
    setShowExerciseSelector(false);
  };

  const updateSets = (index: number, sets: number) => {
    const newExercises = [...selectedExercises];
    newExercises[index].sets = sets;
    setSelectedExercises(newExercises);
  };

  const updateReps = (index: number, reps: number) => {
    const newExercises = [...selectedExercises];
    newExercises[index].reps = reps;
    setSelectedExercises(newExercises);
  };

  const updateWeight = (index: number, weight: number) => {
    const newExercises = [...selectedExercises];
    newExercises[index].weight = weight;
    setSelectedExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const saveWorkout = () => {
    if (workoutDuration && selectedExercises.length > 0) {
      const newWorkout: WorkoutSession = {
        id: Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0],
        duration: workoutDuration,
        type: 'Силове тренування',
        exercises: selectedExercises,
      };

      const updatedWorkouts = [...workoutSessions, newWorkout];
      setWorkoutSessions(updatedWorkouts);
      saveWorkouts(updatedWorkouts);
    }

    setShowAddWorkout(false);
    setWorkoutDuration('');
    setSelectedExercises([]);
  };

  const prevMonth = getPreviousMonth();
  const nextMonth = getNextMonth();

  const renderAddWorkoutModal = () => (
    <Modal
      visible={showAddWorkout}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Додати тренування</Text>
            <TouchableOpacity onPress={() => setShowAddWorkout(false)}>
              <X color={Colors.dark.text} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Тривалість тренування (хв)</Text>
            <TextInput
              style={styles.input}
              value={workoutDuration}
              onChangeText={setWorkoutDuration}
              placeholder="Наприклад: 60"
              placeholderTextColor={Colors.dark.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Вправи</Text>
            {selectedExercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <TouchableOpacity onPress={() => removeExercise(index)}>
                    <MinusCircle color={Colors.dark.error} size={20} />
                  </TouchableOpacity>
                </View>
                <View style={styles.exerciseDetails}>
                  <View style={styles.exerciseInput}>
                    <Text style={styles.inputLabel}>Підходи:</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.sets.toString()}
                      onChangeText={(value) => updateSets(index, parseInt(value) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.exerciseInput}>
                    <Text style={styles.inputLabel}>Повтори:</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.reps.toString()}
                      onChangeText={(value) => updateReps(index, parseInt(value) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.exerciseInput}>
                    <Text style={styles.inputLabel}>Вага (кг):</Text>
                    <TextInput
                      style={styles.numberInput}
                      value={exercise.weight.toString()}
                      onChangeText={(value) => updateWeight(index, parseInt(value) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addExerciseButton}
              onPress={() => setShowExerciseSelector(true)}
            >
              <Plus color={Colors.dark.primary} size={20} />
              <Text style={styles.addExerciseText}>Додати вправу</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
            <Text style={styles.saveButtonText}>Зберегти тренування</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderExerciseSelectorModal = () => (
    <Modal
      visible={showExerciseSelector}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Вибрати вправу</Text>
            <TouchableOpacity onPress={() => setShowExerciseSelector(false)}>
              <X color={Colors.dark.text} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.exerciseList}>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseOption}
                onPress={() => addExercise(exercise)}
              >
                <Text style={styles.exerciseOptionName}>{exercise.name}</Text>
                <Text style={styles.exerciseOptionDetail}>
                  {exercise.muscle} • {exercise.equipment}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Графік тренувань</Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.monthNavigator}>
            <View style={styles.adjacentMonth}>
              <Text style={styles.adjacentMonthText}>{prevMonth.name}</Text>
              <Text style={styles.adjacentMonthYear}>{prevMonth.year}</Text>
            </View>
            
            <View style={styles.currentMonth}>
              <Text style={styles.currentMonthText}>
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
            </View>
            
            <View style={styles.adjacentMonth}>
              <Text style={styles.adjacentMonthText}>{nextMonth.name}</Text>
              <Text style={styles.adjacentMonthYear}>{nextMonth.year}</Text>
            </View>
          </View>

          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthButton}>
              <ChevronLeft color={Colors.dark.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthButton}>
              <ChevronRight color={Colors.dark.text} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendar}>
            <View style={styles.weekDays}>
              {DAYS.map(day => (
                <Text key={day} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {daysInMonth.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    date && selectedDate.toDateString() === date.toDateString() && styles.selectedDay,
                    date && isToday(date) && styles.todayCell,
                  ]}
                  onPress={() => date && setSelectedDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <View style={styles.dayCellContent}>
                      <Text style={[
                        styles.dayText,
                        selectedDate.toDateString() === date.toDateString() && styles.selectedDayText,
                        isToday(date) && styles.todayText,
                      ]}>
                        {date.getDate()}
                      </Text>
                      {hasWorkout(date) && (
                        <View style={[
                          styles.workoutIndicator,
                          selectedDate.toDateString() === date.toDateString() && styles.selectedWorkoutIndicator,
                        ]} />
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.workoutsContainer}>
          <View style={styles.workoutsHeader}>
            <Text style={styles.workoutsTitle}>Тренування</Text>
            <TouchableOpacity 
              style={styles.addWorkoutButton}
              onPress={() => setShowAddWorkout(true)}
            >
              <Plus color={Colors.dark.primary} size={20} />
              <Text style={styles.addWorkoutText}>Додати</Text>
            </TouchableOpacity>
          </View>

          {selectedDateWorkouts.length > 0 ? (
            selectedDateWorkouts.map((workout) => (
              <TouchableOpacity key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTime}>
                    <Clock color={Colors.dark.primary} size={20} />
                    <Text style={styles.timeText}>{workout.duration} хв</Text>
                  </View>
                  <View style={styles.workoutType}>
                    <Dumbbell color={Colors.dark.textSecondary} size={16} />
                    <Text style={styles.typeText}>{workout.type}</Text>
                  </View>
                </View>
                <View style={styles.exercisesList}>
                  {workout.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseRow}>
                      <Text style={styles.exerciseRowName}>{exercise.name}</Text>
                      <Text style={styles.exerciseRowDetails}>
                        {exercise.sets} підходів • {exercise.reps} повторів • {exercise.weight} кг
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <CalendarIcon color={Colors.dark.textSecondary} size={40} />
              <Text style={styles.emptyText}>Немає тренувань</Text>
              <Text style={styles.emptySubText}>День відпочинку</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderAddWorkoutModal()}
      {renderExerciseSelectorModal()}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const DAY_CELL_SIZE = Math.floor((width - Layout.spacing.lg * 2) / 7);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
  },
  calendarContainer: {
    backgroundColor: Colors.dark.card,
    margin: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  adjacentMonth: {
    alignItems: 'center',
    opacity: 0.5,
  },
  adjacentMonthText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  adjacentMonthYear: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  currentMonth: {
    alignItems: 'center',
  },
  currentMonthText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.dark.text,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Layout.spacing.lg,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
  },
  monthButton: {
    padding: Layout.spacing.sm,
  },
  calendar: {
    marginTop: Layout.spacing.md,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  weekDayText: {
    width: DAY_CELL_SIZE,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellContent: {
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.radius.md,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: Layout.radius.md,
  },
  dayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  selectedDayText: {
    color: '#000000',
  },
  todayText: {
    color: Colors.dark.primary,
  },
  workoutIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.dark.primary,
    marginTop: 4,
  },
  selectedWorkoutIndicator: {
    backgroundColor: '#000000',
  },
  workoutsContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  workoutsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.dark.text,
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Layout.radius.lg,
  },
  addWorkoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.primary,
    marginLeft: 4,
  },
  workoutCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  workoutTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.sm,
  },
  workoutType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginLeft: Layout.spacing.xs,
  },
  exercisesList: {
    marginTop: Layout.spacing.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
  },
  exerciseRowName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.dark.text,
  },
  exerciseRowDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.dark.text,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  emptySubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.dark.text,
  },
  formGroup: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    color: Colors.dark.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  exerciseItem: {
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  exerciseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.text,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseInput: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.radius.sm,
    padding: Layout.spacing.sm,
    color: Colors.dark.text,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(174, 252, 65, 0.1)',
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    justifyContent: 'center',
  },
  addExerciseText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.primary,
    marginLeft: Layout.spacing.sm,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseOption: {
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  exerciseOptionName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  exerciseOptionDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
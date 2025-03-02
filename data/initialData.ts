import { Exercise, WorkoutPlan } from '../types';

export const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    instructions: [
      'Start in a plank position with your hands slightly wider than shoulder-width apart.',
      'Lower your body until your chest nearly touches the floor.',
      'Push yourself back up to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'bodyweight',
    equipment: [],
    repetitions: 10,
    sets: 3,
    difficultyLevel: 'beginner',
    tips: [
      'Keep your core tight throughout the movement.',
      'Don\'t let your hips sag or pike up.',
      'For an easier variation, do push-ups on your knees.'
    ],
    commonMistakes: [
      'Flaring elbows out too wide',
      'Not going through full range of motion',
      'Holding breath during the exercise'
    ],
    isFavorite: false
  },
  {
    id: '2',
    name: 'Squats',
    description: 'A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.',
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Bend your knees and lower your hips as if sitting in a chair.',
      'Keep your chest up and back straight.',
      'Lower until thighs are parallel to the ground (or as low as comfortable).',
      'Push through your heels to return to standing position.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    category: 'bodyweight',
    equipment: [],
    repetitions: 15,
    sets: 3,
    difficultyLevel: 'beginner',
    tips: [
      'Keep your weight in your heels.',
      'Ensure your knees track over your toes, not inward.',
      'Maintain a neutral spine throughout the movement.'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Rising onto toes',
      'Rounding the back'
    ],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Plank',
    description: 'An isometric core exercise that strengthens the abdominals, back, and shoulders.',
    instructions: [
      'Start in a push-up position, then bend your elbows 90 degrees and rest your weight on your forearms.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core and hold the position.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'bodyweight',
    equipment: [],
    duration: 30,
    difficultyLevel: 'beginner',
    tips: [
      'Don\'t let your hips rise or drop.',
      'Look at a spot on the floor to keep your neck neutral.',
      'Breathe normally throughout the hold.'
    ],
    commonMistakes: [
      'Sagging hips',
      'Raising buttocks too high',
      'Holding breath'
    ],
    isFavorite: false
  },
  {
    id: '4',
    name: 'Lunges',
    description: 'A unilateral lower body exercise that targets the quadriceps, hamstrings, and glutes.',
    instructions: [
      'Stand with feet hip-width apart.',
      'Step forward with one leg and lower your body until both knees are bent at 90-degree angles.',
      'Push through the front heel to return to the starting position.',
      'Repeat with the other leg.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1174&q=80',
    category: 'bodyweight',
    equipment: [],
    repetitions: 10,
    sets: 3,
    difficultyLevel: 'beginner',
    tips: [
      'Keep your upper body straight and shoulders back.',
      'Step far enough forward that your knee stays behind your toes.',
      'Keep your weight centered between both legs.'
    ],
    commonMistakes: [
      'Front knee extending past toes',
      'Leaning forward too much',
      'Not stepping far enough forward'
    ],
    isFavorite: false
  },
  {
    id: '5',
    name: 'Dumbbell Bicep Curls',
    description: 'An isolation exercise that targets the biceps muscles.',
    instructions: [
      'Stand with feet shoulder-width apart, holding a dumbbell in each hand.',
      'Keep your elbows close to your torso and palms facing forward.',
      'Curl the weights up to shoulder level while keeping your upper arms stationary.',
      'Lower the dumbbells back to the starting position.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'equipment',
    equipment: ['dumbbells'],
    repetitions: 12,
    sets: 3,
    difficultyLevel: 'beginner',
    tips: [
      'Keep your back straight and shoulders relaxed.',
      'Control the movement both up and down.',
      'Use a weight that allows you to maintain proper form.'
    ],
    commonMistakes: [
      'Swinging the weights',
      'Using momentum instead of muscle',
      'Moving the elbows away from the body'
    ],
    isFavorite: false
  },
  {
    id: '6',
    name: 'Mountain Climbers',
    description: 'A dynamic full-body exercise that elevates heart rate and engages multiple muscle groups.',
    instructions: [
      'Start in a high plank position with your hands directly under your shoulders.',
      'Bring one knee toward your chest, then quickly switch legs.',
      'Continue alternating legs in a running motion.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'cardio',
    equipment: [],
    duration: 30,
    difficultyLevel: 'intermediate',
    tips: [
      'Keep your core engaged throughout the exercise.',
      'Maintain a steady pace.',
      'Keep your hips level and don\'t let them rise too high.'
    ],
    commonMistakes: [
      'Letting hips rise too high',
      'Moving too slowly',
      'Not engaging the core'
    ],
    isFavorite: false
  },
  {
    id: '7',
    name: 'Jumping Jacks',
    description: 'A classic cardio exercise that works the whole body and increases heart rate.',
    instructions: [
      'Stand with your feet together and arms at your sides.',
      'Jump and spread your feet beyond shoulder width while raising your arms above your head.',
      'Jump again and return to the starting position.',
      'Repeat at a quick pace.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'cardio',
    equipment: [],
    duration: 30,
    difficultyLevel: 'beginner',
    tips: [
      'Land softly on the balls of your feet.',
      'Keep a steady rhythm.',
      'Breathe naturally throughout the exercise.'
    ],
    commonMistakes: [
      'Landing flat-footed',
      'Not extending arms fully',
      'Moving too slowly'
    ],
    isFavorite: false
  },
  {
    id: '8',
    name: 'Downward Dog',
    description: 'A yoga pose that stretches the hamstrings, calves, and shoulders while strengthening the arms and legs.',
    instructions: [
      'Start on your hands and knees with hands slightly in front of your shoulders.',
      'Lift your knees off the floor and push your hips up and back.',
      'Straighten your legs as much as comfortable and press your heels toward the floor.',
      'Create an inverted V shape with your body.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
    category: 'flexibility',
    equipment: [],
    duration: 30,
    difficultyLevel: 'beginner',
    tips: [
      'Spread your fingers wide for better support.',
      'Keep your neck relaxed by looking toward your feet.',
      'Pedal your feet to deepen the stretch in your calves.'
    ],
    commonMistakes: [
      'Rounding the back',
      'Locking the elbows',
      'Putting too much weight on the wrists'
    ],
    isFavorite: false
  },
  {
    id: '9',
    name: 'Burpees',
    description: 'A high-intensity full-body exercise that combines a squat, push-up, and jump.',
    instructions: [
      'Start standing, then squat down and place your hands on the floor.',
      'Jump your feet back into a plank position.',
      'Perform a push-up (optional).',
      'Jump your feet back to your hands, then explosively jump up with arms overhead.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593476123561-9516f2097158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
    category: 'hiit',
    equipment: [],
    repetitions: 10,
    sets: 3,
    difficultyLevel: 'advanced',
    tips: [
      'Focus on form rather than speed, especially when learning.',
      'Modify by stepping back instead of jumping if needed.',
      'Land softly from the jump to protect your joints.'
    ],
    commonMistakes: [
      'Sagging hips in the plank position',
      'Not fully extending during the jump',
      'Rushing through the movement with poor form'
    ],
    isFavorite: false
  },
  {
    id: '10',
    name: 'Kettlebell Swings',
    description: 'A dynamic exercise that targets the posterior chain, including the hamstrings, glutes, and lower back.',
    instructions: [
      'Stand with feet shoulder-width apart, holding a kettlebell with both hands.',
      'Hinge at the hips and swing the kettlebell between your legs.',
      'Thrust your hips forward to swing the kettlebell up to chest height.',
      'Let the kettlebell fall back down and repeat.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'equipment',
    equipment: ['kettlebell'],
    repetitions: 15,
    sets: 3,
    difficultyLevel: 'intermediate',
    tips: [
      'The power comes from your hips, not your arms.',
      'Keep your back flat throughout the movement.',
      'Maintain a soft bend in your knees.'
    ],
    commonMistakes: [
      'Squatting instead of hinging',
      'Using arms to lift the kettlebell',
      'Rounding the back'
    ],
    isFavorite: false
  }
];

export const initialWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Full Body Blast',
    description: 'A comprehensive workout targeting all major muscle groups for a complete full-body session.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Full Body',
    difficultyLevel: 'intermediate',
    duration: 30,
    exercises: [
      { exerciseId: '7', duration: 60, restAfter: 15 },
      { exerciseId: '1', repetitions: 12, sets: 3, restAfter: 30 },
      { exerciseId: '2', repetitions: 15, sets: 3, restAfter: 30 },
      { exerciseId: '3', duration: 45, restAfter: 15 },
      { exerciseId: '4', repetitions: 10, sets: 3, restAfter: 30 },
      { exerciseId: '6', duration: 45, restAfter: 15 },
      { exerciseId: '9', repetitions: 8, sets: 3, restAfter: 45 }
    ],
    isFavorite: false
  },
  {
    id: '2',
    name: 'Abs & Core Crusher',
    description: 'Focus on strengthening your core with this targeted abdominal and lower back workout.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Core',
    difficultyLevel: 'intermediate',
    duration: 20,
    exercises: [
      { exerciseId: '3', duration: 45, restAfter: 15 },
      { exerciseId: '6', duration: 45, restAfter: 15 },
      { exerciseId: '3', duration: 45, restAfter: 15 },
      { exerciseId: '6', duration: 45, restAfter: 15 },
      { exerciseId: '3', duration: 60, restAfter: 15 }
    ],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Upper Body Strength',
    description: 'Build strength in your chest, shoulders, arms, and upper back with this focused workout.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Upper Body',
    difficultyLevel: 'intermediate',
    duration: 25,
    exercises: [
      { exerciseId: '7', duration: 60, restAfter: 15 },
      { exerciseId: '1', repetitions: 12, sets: 3, restAfter: 30 },
      { exerciseId: '5', repetitions: 12, sets: 3, restAfter: 30 },
      { exerciseId: '10', repetitions: 15, sets: 3, restAfter: 30 }
    ],
    isFavorite: false
  },
  {
    id: '4',
    name: 'Lower Body Strength',
    description: 'Target your quads, hamstrings, glutes, and calves with this lower body focused workout.',
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lower Body',
    difficultyLevel: 'intermediate',
    duration: 25,
    exercises: [
      { exerciseId: '7', duration: 60, restAfter: 15 },
      { exerciseId: '2', repetitions: 15, sets: 3, restAfter: 30 },
      { exerciseId: '4', repetitions: 12, sets: 3, restAfter: 30 },
      { exerciseId: '10', repetitions: 15, sets: 3, restAfter: 30 }
    ],
    isFavorite: false
  },
  {
    id: '5',
    name: 'Flexibility & Mobility',
    description: 'Improve your range of motion, reduce stiffness, and enhance recovery with this stretching routine.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
    category: 'Flexibility',
    difficultyLevel: 'beginner',
    duration: 20,
    exercises: [
      { exerciseId: '8', duration: 60, restAfter: 15 },
      { exerciseId: '8', duration: 60, restAfter: 15 },
      { exerciseId: '8', duration: 60, restAfter: 15 }
    ],
    isFavorite: false
  },
  {
    id: '6',
    name: 'Quick HIIT Blast',
    description: 'A short but intense workout to get your heart rate up and burn calories efficiently.',
    imageUrl: 'https://images.unsplash.com/photo-1593476123561-9516f2097158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
    category: 'HIIT',
    difficultyLevel: 'advanced',
    duration: 15,
    exercises: [
      { exerciseId: '7', duration: 30, restAfter: 10 },
      { exerciseId: '6', duration: 30, restAfter: 10 },
      { exerciseId: '9', repetitions: 8, sets: 2, restAfter: 20 },
      { exerciseId: '7', duration: 30, restAfter: 10 },
      { exerciseId: '6', duration: 30, restAfter: 10 },
      { exerciseId: '9', repetitions: 8, sets: 2, restAfter: 20 }
    ],
    isFavorite: false
  }
];
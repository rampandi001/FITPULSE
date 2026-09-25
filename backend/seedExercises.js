const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Exercise = require("./models/Exercise");

dotenv.config();

const exercises = [
  {
    name: "Barbell Bench Press",
    category: "CHEST",
    level: "INTERMEDIATE",
    equipment: "BARBELL",
    image: "/images/bench-press.jpg",
  },
  {
    name: "Dumbbell Incline Press",
    category: "CHEST",
    level: "INTERMEDIATE",
    equipment: "DUMBBELLS",
    image: "/images/incline-press.jpg",
  },
  {
    name: "Weighted Dips",
    category: "CHEST",
    level: "INTERMEDIATE",
    equipment: "DIP BARS",
    image: "/images/dips.jpg",
  },
  {
    name: "Barbell Squat",
    category: "LEGS",
    level: "INTERMEDIATE",
    equipment: "BARBELL",
    image: "/images/squat.jpg",
  },
  {
    name: "Conventional Deadlift",
    category: "BACK",
    level: "ADVANCED",
    equipment: "BARBELL",
    image: "/images/deadlift.jpg",
  },
  {
    name: "Pull Ups",
    category: "BACK",
    level: "INTERMEDIATE",
    equipment: "BODYWEIGHT",
    image: "/images/pull-up.jpg",
  },
  {
    name: "Barbell Row",
    category: "BACK",
    level: "INTERMEDIATE",
    equipment: "BARBELL",
    image: "/images/barbell-row.jpg",
  },
  {
    name: "Dumbbell Shoulder Press",
    category: "SHOULDERS",
    level: "INTERMEDIATE",
    equipment: "DUMBBELLS",
    image: "/images/shoulder-press.jpg",
  },
  {
    name: "Barbell Bicep Curl",
    category: "ARMS",
    level: "BEGINNER",
    equipment: "BARBELL",
    image: "/images/bicep-curl.jpg",
  },
  {
    name: "Tricep Pushdown",
    category: "ARMS",
    level: "BEGINNER",
    equipment: "CABLE",
    image: "/images/tricep-pushdown.jpg",
  },
  {
    name: "Leg Press",
    category: "LEGS",
    level: "INTERMEDIATE",
    equipment: "MACHINE",
    image: "/images/leg-press.jpg",
  },
  {
    name: "Dumbbell Lunges",
    category: "LEGS",
    level: "BEGINNER",
    equipment: "DUMBBELLS",
    image: "/images/lunges.jpg",
  },
];

const seedExercises = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for exercise seed ✅"
    );

    await Exercise.deleteMany({});

    await Exercise.insertMany(exercises);

    console.log(
      `${exercises.length} exercises inserted successfully ✅`
    );

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );
  } catch (error) {
    console.error(
      "EXERCISE SEED ERROR:",
      error
    );

    process.exit(1);
  }
};

seedExercises();
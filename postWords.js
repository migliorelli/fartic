(async () => {
  // prettier-ignore
  const animals = [
    "dog", "cat", "lion", "tiger", "elephant", "giraffe", "bear", "wolf", "fox", "rabbit",
    "horse", "cow", "sheep", "goat", "chicken", "duck", "pig", "deer", "monkey", "zebra",
    "panda", "koala", "crocodile", "snake", "frog", "fish", "shark", "whale", "dolphin", "octopus",
    "penguin", "eagle", "hawk", "owl", "parrot", "peacock", "squirrel", "mouse", "rat", "bat",
    "kangaroo", "hedgehog", "raccoon", "otter", "seal", "crab", "lobster", "jellyfish", "ant", "bee"
];

  // prettier-ignore
  const foods = [
    "apple", "banana", "grape", "orange", "watermelon", "strawberry", "blueberry", "cherry", "peach", "pear",
    "pineapple", "mango", "kiwi", "lemon", "lime", "carrot", "potato", "tomato", "cucumber", "broccoli",
    "onion", "garlic", "pepper", "spinach", "lettuce", "corn", "rice", "bread", "cheese", "butter",
    "egg", "beef", "pork", "fish", "shrimp", "lobster", "crab", "pasta", "pizza",
    "burger", "sandwich", "soup", "salad", "cake", "cookie", "ice cream", "chocolate", "candy", "popcorn"
];

  // prettier-ignore
  const flags = [
    "USA", "Canada", "Mexico", "Brazil", "Argentina", "UK", "France", "Germany", "Italy", "Spain",
    "Portugal", "Netherlands", "Belgium", "Russia", "China", "Japan", "India", "Australia", "New Zealand", "South Korea",
    "North Korea", "Vietnam", "Thailand", "Philippines", "Malaysia", "Indonesia", "Turkey", "Egypt", "South Africa", "Kenya",
    "Nigeria", "Ghana", "Ethiopia", "Morocco", "Saudi Arabia", "Israel", "Iran", "Iraq", "Pakistan", "Afghanistan",
    "Greece", "Sweden", "Norway", "Denmark", "Finland", "Iceland", "Switzerland", "Austria", "Poland", "Ukraine"
];

  // prettier-ignore
  const jobs = [
    "doctor", "nurse", "teacher", "engineer", "scientist", "artist", "musician", "actor", "chef", "pilot",
    "farmer", "police", "firefighter", "dentist", "lawyer", "writer", "journalist", "architect", "mechanic", "plumber",
    "electrician", "carpenter", "driver", "cashier", "waiter", "bartender", "programmer", "designer", "photographer", "model",
    "manager", "secretary", "technician", "veterinarian", "pharmacist", "soldier", "astronaut", "biologist", "chemist", "economist",
    "psychologist", "therapist", "accountant", "librarian", "translator", "coach", "judge", "politician", "gardener", "tailor"
];

  // prettier-ignore
  const objects = [
    "chair", "table", "bed", "sofa", "lamp", "clock", "phone", "computer", "book", "pen",
    "pencil", "bag", "shoe", "hat", "shirt", "jacket", "key", "wallet", "umbrella", "bottle",
    "glass", "plate", "fork", "spoon", "knife", "pan", "bowl", "mirror", "candle", "watch",
    "camera", "radio", "television", "remote", "fan", "heater", "toaster", "blender", "microwave", "fridge",
    "backpack", "scissors", "notebook", "speaker", "pillow", "blanket", "towel", "ring", "necklace", "bracelet"
];

  // prettier-ignore
  const verbs = [
    "run", "walk", "jump", "swim", "dance", "sing", "write", "read", "eat", "drink",
    "sleep", "wake", "sit", "stand", "talk", "listen", "watch", "play", "work", "study",
    "drive", "ride", "cook", "paint", "draw", "build", "clean", "open", "close", "buy",
    "sell", "teach", "learn", "help", "catch", "throw", "carry", "push", "pull", "climb",
    "smile", "cry", "laugh", "shout", "think", "dream", "try", "win", "lose", "fix"
];

  const wordLists = [animals, foods, flags, jobs, objects, verbs];

  // { content: string; themeIds: number[] }
  const words = wordLists.flatMap((wordList, index) =>
    wordList.map((word) => ({ content: word, themeId: index + 2 }))
  );

  try {
    const res = await fetch("http://localhost:3000/words/create/multiples", {
      body: JSON.stringify({
        words,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error((await res.json()).message);
    }

    console.log("Success.");
  } catch (err) {
    console.error("Error:", err);
  }
})();

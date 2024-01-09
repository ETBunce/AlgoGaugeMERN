import { codeText } from "./algorithmCodeText";
import { SortingAlgorithmsKeys } from "./algorithmKeys";

// Constants file for the frontend, contains info about the different algorithms, enums, and keys (rather than hardcoding)
const basename = process.env.PUBLIC_URL;

export const DataOrderings = {
  RANDOM: "Random",
  REPEATED_VALUES: "Repeated Values",
  CHUNKS: "Chunks",
  REVERSE_ORDER: "Reverse Order",
  ORDERED: "Ordered",
};

// export const SortingAlgorithmsKeys = {
//   BUBBLE: "Bubble",
//   SELECTION: "Selection",
//   INSERTION: "Insertion",
//   QUICK: "Quick",
//   MERGE: "Merge",
//   HEAP: "Heap",
//   // TODO:  TIM: "Tim",
// };

export { SortingAlgorithmsKeys };

export const HashingAlgorithmsKeys = {
  // SHA1: "SHA-1",
  // SHA224: "SHA-224",
  // SHA256: "SHA-256",
  // SHA384: "SHA-384",
  CLOSED: "Closed",
  OPEN: "Open",
  CLOSED_LINEAR: "Closed Linear",
  CLOSED_QUADRATIC: "Closed Quadratic",
  CUCKOO: "Cuckoo",
};

export const Mode = {
  SORTING: "Sorting",
  HASHING: "Hashing",
  DATA_STRUCTURES: "Data Structures",
  BRAD: "Brad",
};

export const Limits = {
  MAX_INPUT_SIZE: 1000,
  MIN_INPUT_SIZE: 1,
};

export const DefaultInputSizeTrack = [
  10, 500, 1000, 2000, 3000, 4000, 5000, 10000, 50000, 100000, 500000,
];

export const SortingAlgorithms = {

  [SortingAlgorithmsKeys.BUBBLE]: {
    video: basename + "/videos/BubbleSort.mp4",
    explanation: `Compare pairs of values then swap the larger to the right. Repeat for each pair. Repeat for all pairs until the largest value has 'bubbled' to the right.\nRepeat prior algorithm to find the second largest number, then third largest number, etc.`,
    img: basename + "/pics/algorithms/Bubble-sort.gif",
    bigThetaForBestCase: "Θ(n^2)",
    bigThetaForAverageCase: "Θ(n^2)",
    bigThetaForWorstCase: "Θ(n^2)",
    memoryAverage: "Θ(1)",
    memoryWorst: "Θ(1)",
    isStable: "Yes",
    optimizesRepeatedValues: "No",
    cacheFriendly: "Some",
    speculativeExecutionFriendly: "No",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Some Odd-Even",
    interestingFacts: [
      "Contrary to popular belief 'bubble' is spelled with 3 b's",
    ],
    inputSizeTrack: [
      10, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000, 50000, 100000,
    ],
    attribution: `Swfung8, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons`,
    code: codeText[SortingAlgorithmsKeys.BUBBLE],
  },

  [SortingAlgorithmsKeys.SELECTION]: {
    video: basename + "/videos/SelectionSort.mp4",
    explanation:
      "Go find the smallest number. Look among all unsorted values. Ensure the smallest gets swapped to the left.\nRepeat prior algorithm to find the second smallest number, then third smallest number, etc.",
    img: basename + "/pics/algorithms/selectionsortgif.gif",
    attribution:
      "Joestape89, CC BY-SA 3.0 <http://creativecommons.org/licenses/by-sa/3.0/>, via Wikimedia Commons",
    bigThetaForBestCase: "Θ(n^2)",
    bigThetaForAverageCase: "Θ(n^2)",
    bigThetaForWorstCase: "Θ(n^2)",
    memoryAverage: "Θ(1)",
    memoryWorst: "Θ(1)",
    isStable: "Yes",
    optimizesRepeatedValues: "No",
    cacheFriendly: "No",
    speculativeExecutionFriendly: "Often for most data (if done right)",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Some",
    interestingFacts: [
      "It's called 'Selection' because it 'selects' the smallest value!",
    ],
    inputSizeTrack: [
      10, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000, 50000, 100000,
    ],
    code: codeText[SortingAlgorithmsKeys.SELECTION],
  },

  [SortingAlgorithmsKeys.INSERTION]: {
    video: basename + "/videos/InsertionSort.mp4",
    explanation:
      "Take the next unsorted value. Look back through the sorted set of values and insert this unsorted value into its correct spot.\nRepeat prior algorithm to sort the next number, then the next number after that, etc.",
    img: basename + "/pics/algorithms/insertionsortgif.gif",
    attribution:
      "Swfung8, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons",
    bigThetaForBestCase: "Θ(n)",
    bigThetaForAverageCase: "Θ(n^2)",
    bigThetaForWorstCase: "Θ(n^2)",
    memoryAverage: "Θ(1)",
    memoryWorst: "Θ(1)",
    isStable: "Yes",
    optimizesRepeatedValues: "No",
    cacheFriendly: "Some",
    speculativeExecutionFriendly: "Yes",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Some",
    interestingFacts: ["This is the fastest algorithm for small arrays"],
    inputSizeTrack: [
      10, 100, 500, 1000, 2000, 3000, 4000, 5000, 10000, 50000, 100000,
    ],
    code: codeText[SortingAlgorithmsKeys.INSERTION],
  },
  [SortingAlgorithmsKeys.QUICK]: {
    video: basename + "/videos/QuickSort.mp4",
    explanation:
      "Select a pivot. Organize the container into two parts: A) all values less than the pivot, and B) all values greater or equal to the pivot.\nRecursively repeat for the set A and set B.",
    img: basename + "/pics/algorithms/quicksortgif.gif",
    attribution:
      "en:User:RolandH, CC BY-SA 3.0 <http://creativecommons.org/licenses/by-sa/3.0/>, via Wikimedia Commons",
    bigThetaForBestCase: "Θ(n log n)",
    bigThetaForAverageCase: "Θ(n log n)",
    bigThetaForWorstCase: "Θ(n^2)",
    memoryAverage: "Θ(log n)",
    memoryWorst: "Θ(n)",
    isStable: "No",
    optimizesRepeatedValues: "No",
    cacheFriendly: "Yes",
    speculativeExecutionFriendly: "No",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Some",
    interestingFacts: [
      "This is one of the most commonly used algorithms today, although maybe more complex variants",
    ],
    inputSizeTrack: [
      10, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
      10000000,
    ],
    code: codeText[SortingAlgorithmsKeys.QUICK],
  },
  [SortingAlgorithmsKeys.MERGE]: {
    video: basename + "/videos/MergeSort.mp4",
    explanation:
      "Generalizes this concept: Merging together two sorted sets is easy. So repeat that process.\nStarts by recursively splitting lists in half to generate indexes.\nOn recursive unwinding, merges sorted sets together.",
    img: basename + "/pics/algorithms/mergesortgif.gif",
    attribution:
      "Nuno Nogueira (Nmnogueira), CC BY-SA 2.5 <https://creativecommons.org/licenses/by-sa/2.5>, via Wikimedia Commons",
    bigThetaForBestCase: "Θ(n log n)",
    bigThetaForAverageCase: "Θ(n log n)",
    bigThetaForWorstCase: "Θ(n log n)",
    memoryAverage: "Θ(n)",
    memoryWorst: "Θ(n)",
    isStable: "Yes",
    optimizesRepeatedValues: "No",
    cacheFriendly: "Yes",
    speculativeExecutionFriendly: "Some",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Yes!",
    interestingFacts: [
      "Merge sort type algorithms allowed large data sets to be sorted on early computers that had small random access memories by modern standards.",
    ],
    inputSizeTrack: [
      10, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
      10000000,
    ],
    code: codeText[SortingAlgorithmsKeys.MERGE],
  },

  [SortingAlgorithmsKeys.HEAP]: {
    video: basename + "/videos/HeapSort.mp4",
    explanation:
      "Uses a max heap to find a largest value.\nMoves the max heap value to the end of the set.\nReheaps to find the next largest value, and moves that to the second to the end.",
    img: basename + "/pics/algorithms/heapsortgif.gif",
    attribution:
      "Nagae, CC BY-SA 3.0 <http://creativecommons.org/licenses/by-sa/3.0/>, via Wikimedia Commons",
    bigThetaForBestCase: "Θ(n log n)",
    bigThetaForAverageCase: "Θ(n log n)",
    bigThetaForWorstCase: "Θ(n log n)",
    memoryAverage: "Θ(1)",
    memoryWorst: "Θ(1)",
    isStable: "No",
    optimizesRepeatedValues: "No",
    cacheFriendly: "No",
    speculativeExecutionFriendly: "No",
    optimizesOrderedRuns: "No",
    hasParallelOptions: "Some",
    interestingFacts: [
      "I actually don't know what a max heap is but it sure sounds fancy!",
    ],
    inputSizeTrack: [
      10, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
      10000000,
    ],
    code: codeText[SortingAlgorithmsKeys.HEAP],
  },

  // TODO [SortingAlgorithmsKeys.TIM]: {
  //   video: basename + "/videos/TimSort.mp4",
  //   explanation:
  //     "A mix of Insertion Sort and Merge Sort.\nA bit more complicated, as such no code examples.\nMain purpose: Optimizes with existing runs of data, which show up in many real world data sets.",
  //   img: basename + "/pics/algorithms/timgif.gif",
  //   attribution: "Monty python and the holy grail",
  //   bigThetaForBestCase: "Θ(n)",
  //   bigThetaForWorstCase: "Θ(n log n)",
  //   bigThetaForAverageCase: "Θ(n log n)",
  //   memoryAverage: "Θ(n)",
  //   memoryWorst: "Θ(n)",
  //   isStable: "Yes",
  //   optimizesRepeatedValues: "Yes",
  //   cacheFriendly: "Some",
  //   speculativeExecutionFriendly: "Some",
  //   optimizesOrderedRuns: "Yes",
  //   hasParallelOptions: "Some",
  //   interestingFacts:
  //     ["Tim made this to make use of any portions of data that were already sorted, making it more efficient if there are random chunks of sorted data"],
  //   inputSizeTrack: [
  //     10, 100, 500, 1000, 2000, 3000, 4000, 5000, 6000, 10000, 50000,
  //   ],
  // },
};

export const HashingAlgorithms = {
  // [HashingAlgorithmsKeys.SHA1]: {},
  // [HashingAlgorithmsKeys.SHA224]: {},
  // [HashingAlgorithmsKeys.SHA256]: {},
  // [HashingAlgorithmsKeys.SHA384]: {},
  [HashingAlgorithmsKeys.CLOSED]: {
    explanation:
      "A hash table based on open addressing (sometimes referred to as closed hashing) stores all elements directly in the hash table array, i.e. it has at most one element per bucket\nO(n) at worst case, O(1) average",
    notableTraits: [
      "Predictable memory usage",
      "Less memory overhead",
      "Memory locality",
    ],
    inputSizeTrack: [
      10, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
      10000000,
    ],
  },
  [HashingAlgorithmsKeys.OPEN]: {
    explanation:
      "A key is always stored in the bucket it's hashed to. Collisions are dealt with using separate data structures on a per-bucket basis. An arbitrary amount of keys per bucket\nO(1) up to a point",
    notableTraits: [
      "Theoretically no maximum load factor, performance will degrade the larger the load factor is.",
      "Easier removal, no issues with clustering, typically better than closed hashing with larger load factors",
    ],
  },
  [HashingAlgorithmsKeys.CLOSED_LINEAR]: {
    explanation:
      "Same as closed hashing but when a bucket is full it uses an i+1 function to find the next unoccupied bucket\nO(1) up to a point",
    notableTraits: [
      "Good cache performance since it's linear in memory, however it tends to make long chains of occupied buckets since it only uses the next one",
    ],
  },
  [HashingAlgorithmsKeys.CLOSED_QUADRATIC]: {
    explanation:
      "Same as closed hashing but when a bucket is full it uses an i+x^2 function to find the next unoccupied bucket\nO(n)",
    notableTraits: [
      "This makes less problems with clustering, however if a key goes to the same occupied space as another key it will still follow in its footsteps and create a similar problem as linear (just more spread out)",
    ],
  },
  [HashingAlgorithmsKeys.CUCKOO]: {
    explanation:
      "Uses two arrays of equal size and resolves collisions by evicting keys and sending them to the other array. Named after the way that cuckoo chicks will simply push eggs out of their nest to make room for themselves\nWorst case is O(n), best case is O(1) getting worse until 50% load factor (any higher than that cannot function)",
    notableTraits: [
      "As opposed to most other hash tables, it achieves constant time worst-case complexity for lookups.",
    ],
  },
};

export const Status = {
  RUNNING: "running",
  FAILED: "failed",
  SUCCESS: "success",
  WAITING: "waiting",
};

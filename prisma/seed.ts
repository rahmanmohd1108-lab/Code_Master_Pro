import { PrismaClient, Difficulty, Topic } from '@prisma/client';

const prisma = new PrismaClient();

// Problem templates for each topic
const problemTemplates: Record<string, { titles: string[]; patterns: string[] }> = {
  ARRAYS: {
    titles: [
      'Two Sum', 'Three Sum', 'Four Sum', 'Container With Most Water', 'Trapping Rain Water',
      'Merge Sorted Arrays', 'Merge Intervals', 'Insert Interval', 'Spiral Matrix', 'Rotate Image',
      'Set Matrix Zeroes', 'Pascal Triangle', 'Plus One', 'Remove Duplicates', 'Remove Element',
      'Search in Rotated Array', 'Find Minimum in Rotated Array', 'Find Peak Element', 'Find First Last Position',
      'Majority Element', 'Majority Element II', 'Product of Array Except Self', 'Sliding Window Maximum',
      'Minimum Size Subarray Sum', 'Longest Consecutive Sequence', 'Subarray Sum Equals K', 'Continuous Subarray Sum',
      'Partition Equal Subset Sum', 'Non-overlapping Intervals', 'Meeting Rooms', 'Meeting Rooms II',
      'Jump Game', 'Jump Game II', 'Jump Game III', 'Gas Station', 'Candy', 'Candy Crush',
      'First Missing Positive', 'Missing Number', 'Find All Numbers Disappeared', 'Find All Duplicates',
      'Squares of Sorted Array', 'Sort Colors', 'Move Zeroes', 'Array Partition', 'Array Nesting',
      'Max Consecutive Ones', 'Max Consecutive Ones II', 'Max Consecutive Ones III', 'Degree of Array',
      'Shortest Unsorted Array', 'Third Maximum Number', 'Find Pivot Index', 'Largest Number At Least Twice',
      'Prefix Sum', 'Range Sum Query', 'Range Sum Query 2D', 'Maximum Subarray Sum with One Deletion',
      'Maximum Product Subarray', 'Maximum Sum Circular Subarray', 'Longest Turbulent Subarray',
      'Number of Subarrays with Bounded Maximum', 'Sum of Subarray Minimums', 'Sum of Subarray Ranges'
    ],
    patterns: ['two-pointers', 'sliding-window', 'prefix-sum', 'binary-search', 'hash-map', 'sorting']
  },
  STRINGS: {
    titles: [
      'Longest Substring Without Repeating', 'Longest Palindromic Substring', 'Valid Palindrome',
      'Valid Anagram', 'Group Anagrams', 'Palindromic Substrings', 'Count Substrings',
      'Longest Common Prefix', 'Str Str', 'String to Integer', 'Integer to Roman', 'Roman to Integer',
      'Letter Combinations Phone', 'Generate Parentheses', 'Valid Parentheses', 'Remove Invalid Parentheses',
      'Simplify Path', 'Restore IP Addresses', 'Decode String', 'Encode Decode Strings',
      'Word Break', 'Word Break II', 'Word Ladder', 'Word Ladder II', 'Word Search',
      'Substring with Concatenation', 'Minimum Window Substring', 'Find All Anagrams',
      'Permutation in String', 'Longest Repeating Character Replacement', 'String Compression',
      'Reverse String', 'Reverse Words in String', 'Reverse Words in String III', 'Reverse Vowels',
      'Isomorphic Strings', 'Backspace String Compare', 'Long Pressed Name', 'Reorder Data in Log Files',
      'Most Common Word', 'Shortest Distance to Character', 'Reverse Only Letters', 'Find and Replace Pattern',
      'Check If Word Valid', 'Maximize Distance to Closest', 'Push Dominoes', 'Compare Version Numbers',
      'Text Justification', 'Multiply Strings', 'Add Binary', 'Add Strings', 'Complex Number Multiplication',
      'Solve the Equation', 'Fraction Addition', 'Ransom Note', 'First Unique Character',
      'Repeated Substring Pattern', 'Repeated String Match', 'Count Binary Substrings', 'Detect Capital',
      'License Key Formatting', 'Rotated Digits', 'Buddy Strings', 'Construct K Palindrome Strings',
      'Can Convert String', 'Check If One String Swap', 'Number of Substrings', 'Count Unique Characters',
      'Remove Duplicate Letters', 'Split a String in Balanced Strings', 'Maximum Score After Splitting',
      'Kth Distinct String', 'Check if Word Equals Summation', 'Digit Count'
    ],
    patterns: ['two-pointers', 'sliding-window', 'hash-map', 'stack', 'recursion', 'backtracking']
  },
  LINKED_LISTS: {
    titles: [
      'Reverse Linked List', 'Reverse Linked List II', 'Reverse Nodes in K Group', 'Swap Nodes in Pairs',
      'Merge Two Sorted Lists', 'Merge K Sorted Lists', 'Sort List', 'Partition List',
      'Remove Nth From End', 'Remove Duplicates Sorted', 'Remove Duplicates Sorted II', 'Remove Elements',
      'Delete Node', 'Delete Middle Node', 'Delete N Nodes After M', 'Remove Zero Sum Consecutive',
      'Linked List Cycle', 'Linked List Cycle II', 'Find Cycle Start', 'Detect Intersection',
      'Get Intersection Node', 'Palindrome Linked List', 'Copy List with Random Pointer', 'Clone Graph',
      'Add Two Numbers', 'Add Two Numbers II', 'Plus One Linked List', 'Multiply Linked Lists',
      'Rotate List', 'Reorder List', 'Odd Even Linked List', 'Split Linked List Parts',
      'Middle of Linked List', 'Delete Node in Middle', 'Insert into Sorted Circular', 'Insert Greatest Common Divisors',
      'Flatten Multilevel List', 'Convert Binary to DLL', 'Sort Doubly Linked', 'Reverse Doubly Linked',
      'Design Linked List', 'Design Circular Queue', 'Design Circular Deque', 'Design Browser History',
      'LRU Cache', 'LFU Cache', 'All One Data Structure', 'Design HashSet',
      'Design HashMap', 'Design Skiplist', 'Merge In Between', 'Delete Duplicates from Unsorted',
      'Remove Every Kth Node', 'Remove All Occurrences', 'Swap Kth Nodes', 'Pairwise Swap Elements',
      'Move Last to Front', 'Move All Occurrences to End', 'Segregate Even Odd', 'Arrange Consonants Vowels',
      'Sort 0s 1s 2s', 'Delete Nodes with Greater Right', 'Next Greater Node', 'Next Pointer Binary Tree',
      'Connect Nodes at Same Level', 'Find Length of Loop', 'Count Nodes in Loop', 'Delete Loop',
      'Union of Two Lists', 'Intersection of Two Lists', 'Merge Sorted Alternative', 'Sort Absolute Value'
    ],
    patterns: ['two-pointers', 'fast-slow', 'recursion', 'stack', 'hash-map', 'dummy-node']
  },
  TREES: {
    titles: [
      'Binary Tree Inorder', 'Preorder', 'Postorder', 'Level Order', 'Level Order II',
      'Zigzag Level Order', 'Vertical Order', 'Bottom Up Level Order', 'Average of Levels',
      'Maximum Depth', 'Minimum Depth', 'Balanced Tree', 'Diameter', 'Path Sum', 'Path Sum II',
      'Path Sum III', 'Path Sum IV', 'Sum Root to Leaf', 'Sum of Left Leaves', 'Sum Root to Leaf Numbers',
      'Binary Tree Paths', 'Has Path Sum', 'Find Bottom Left Value', 'Find Largest Value Row',
      'Count Nodes', 'Count Complete Tree Nodes', 'Count Good Nodes', 'Count Unival Subtrees',
      'Lowest Common Ancestor', 'LCA of BST', 'LCA Deepest Leaves', 'LCA with Parent Pointer',
      'Is Same Tree', 'Is Subtree', 'Is Symmetric', 'Is Valid BST', 'Is Complete Tree',
      'Serialize Deserialize', 'Construct from Inorder Preorder', 'Construct from Inorder Postorder',
      'Construct from Preorder Postorder', 'Construct BST from Preorder', 'Convert Sorted Array to BST',
      'Convert Sorted List to BST', 'Convert to Greater Tree', 'Flatten to Linked List',
      'Binary Tree Right View', 'Binary Tree Left View', 'Binary Tree Top View', 'Binary Tree Bottom View',
      'Populate Next Right', 'Populate Next Right II', 'Connect All Level Siblings',
      'Find Mode', 'Find Second Minimum', 'Find Duplicate Subtrees', 'Find Largest BST Subtree',
      'Binary Tree Cameras', 'Binary Tree Coloring', 'Binary Tree Pruning', 'Binary Tree Tilt',
      'Maximum Product Split', 'Maximum Difference', 'Smallest Subtree with Deepest',
      'Longest Univalue Path', 'Longest ZigZag Path', 'Time Needed to Inform',
      'Delete Leaves with Value', 'Delete Node in BST', 'Closest BST Value', 'Closest BST Value II',
      'Search BST', 'Insert into BST', 'Kth Smallest BST', 'Kth Largest BST', 'Recover BST',
      'Balance BST', 'Inorder Successor', 'Inorder Predecessor'
    ],
    patterns: ['recursion', 'dfs', 'bfs', 'stack', 'morris', 'divide-conquer']
  },
  GRAPHS: {
    titles: [
      'Number of Islands', 'Number of Islands II', 'Max Area of Island', 'Island Perimeter',
      'Island Count', 'Surrounded Regions', 'Word Search', 'Word Search II', 'Pacific Atlantic',
      'Flood Fill', 'Rotting Oranges', 'Walls and Gates', 'Shortest Bridge', 'Count Sub Islands',
      'Course Schedule', 'Course Schedule II', 'Course Schedule III', 'Course Schedule IV',
      'Alien Dictionary', 'Sequence Reconstruction', 'Graph Valid Tree', 'Clone Graph',
      'Number of Connected Components', 'Redundant Connection', 'Redundant Connection II',
      'Accounts Merge', 'Minimize Malware Spread', 'Minimize Malware Spread II',
      'Network Delay Time', 'Cheapest Flights', 'Cheapest Flights within K Stops',
      'Path with Maximum Probability', 'Path with Minimum Effort', 'Swim in Rising Water',
      'Dijkstra Shortest Path', 'Bellman Ford', 'Floyd Warshall', 'Prim MST', 'Kruskal MST',
      'Critical Connections', 'Critical Routers', 'Articulation Points', 'Bridges in Graph',
      'Detect Cycle Directed', 'Detect Cycle Undirected', 'Topological Sort', 'Kahns Algorithm',
      'Bipartite Graph', 'Is Graph Bipartite', 'Maximum Bipartite Matching', 'Hungarian Algorithm',
      'Coloring Border', 'Possible Bipartition', 'Groups of Strings', 'Largest Component Size',
      'Evaluate Division', 'Optimize Water Distribution', 'Min Cost to Connect Points',
      'Connecting Cities', 'Satisfiability of Equations', 'Lexicographically Smallest Equivalent',
      'Find if Path Exists', 'All Paths Source Target', 'Paths in Maze', 'Nearest Exit Maze',
      'Shortest Path Binary Matrix', 'Shortest Path Grid', 'Snake and Ladders', 'Jump Game III',
      'Reorder Routes', 'Min Cost Roads', 'Flight Routes', 'Maximum Students Exam',
      'Minimum Height Trees', 'Parallel Courses', 'Parallel Courses II', 'Parallel Courses III'
    ],
    patterns: ['dfs', 'bfs', 'union-find', 'topological-sort', 'dijkstra', 'dp']
  },
  STACKS: {
    titles: [
      'Valid Parentheses', 'Longest Valid Parentheses', 'Generate Parentheses', 'Remove Invalid Parentheses',
      'Different Ways Add Parentheses', 'Score of Parentheses', 'Remove Outermost Parentheses',
      'Minimum Add to Make Valid', 'Minimum Insertions to Balance', 'Maximum Nesting Depth',
      'Evaluate Reverse Polish', 'Basic Calculator', 'Basic Calculator II', 'Basic Calculator III',
      'Basic Calculator IV', 'Decode String', 'Encode String', 'Remove K Digits', 'Remove Duplicate Letters',
      'Remove All Adjacent Duplicates', 'Remove All Adjacent Duplicates II', 'Candy Crush',
      'Next Greater Element', 'Next Greater Element II', 'Next Greater Element III', 'Next Greater Node',
      'Daily Temperatures', 'Online Stock Span', 'Stock Span Problem', 'Stock Price Fluctuation',
      'Largest Rectangle Histogram', 'Maximal Rectangle', 'Maximal Square', 'Trapping Rain Water',
      'Container With Most Water', 'Sum of Subarray Minimums', 'Sum of Subarray Ranges',
      'Car Fleet', 'Car Fleet II', 'Number of Visible People', 'Furthest Building Reachable',
      'Asteroid Collision', 'Robot Collision', 'Can See Persons Count', 'Building With Ocean View',
      'Exclusive Time of Functions', 'Decode String', 'Tag Validator', 'Mini Parser',
      'Flatten Nested List', 'Design Stack', 'Min Stack', 'Max Stack', 'Design Circular Queue',
      'Design Circular Deque', 'Design Front Middle Back Queue', 'Design Browser History',
      'Verify Preorder', 'Verify Preorder BST', 'Verify Postorder BST', 'Construct BST Preorder',
      'Pattern 132', 'Pattern 456', 'Find Unsorted Subarray', 'Sort Array Stack Operations',
      'Check Word Abbreviation', 'Check If Word Valid After Substitutions', 'Breaking Sentence',
      'Minimum Deletions to Make Balanced', 'Min Swaps to Make Balanced', 'Maximum Score After Removing',
      'Score After Flipping Matrix', 'Maximum Frequency Stack', 'Design Excel Sum Formula',
      'Longest Well Performing Interval', 'Number of Atoms', 'Parse Lisp Expression'
    ],
    patterns: ['monotonic-stack', 'two-pointers', 'recursion', 'simulation', 'expression-parsing']
  },
  QUEUES: {
    titles: [
      'Implement Queue using Stacks', 'Implement Stack using Queues', 'Design Circular Queue',
      'Design Circular Deque', 'Design Front Middle Back Queue', 'Max Sum Circular Subarray',
      'Sliding Window Maximum', 'Sliding Window Median', 'Sliding Window Average',
      'Moving Average Data Stream', 'Longest Continuous Subarray', 'Shortest Subarray Sum K',
      'Maximum Subarray Sum K', 'Subarrays with K Different', 'Count Number of Nice Subarrays',
      'Max Consecutive Ones III', 'Longest Subarray with Absolute Diff', 'Frequency of Most Frequent',
      'Minimum Operations to Reduce X', 'Minimum Size Subarray Sum', 'K Radius Subarray Averages',
      'Task Scheduler', 'Task Scheduler II', 'Rearrange String K Distance', 'Rearrange String',
      'Process Tasks Using Servers', 'Single Threaded CPU', 'Process Tasks', 'Meeting Rooms II',
      'Meeting Scheduler', 'Minimum Meeting Rooms', 'Minimum Interval to Include',
      'Find Right Interval', 'Employee Free Time', 'Merge Intervals', 'Insert Interval',
      'Minimum Number of Arrows', 'Partition Labels', 'Video Stitching', 'Non-overlapping Intervals',
      'Queue Reconstruction', 'Reveal Cards Increasing', 'Deck Revealed Increasing', 'Card Flipping Game',
      'Design Hit Counter', 'Number of Recent Calls', 'Design Phone Directory', 'Design Logger Rate Limiter',
      'Design Bounded Blocking Queue', 'Print in Order', 'Print Foo Bar Alternately', 'Print Zero Even Odd',
      'Building H2O', 'Design Dining Philosophers', 'Design Blocking Queue', 'Design Concurrent Queue',
      'First Unique Number', 'Data Stream as Disjoint', 'DataStream Disjoint Intervals',
      'Design Twitter', 'Design Social Network', 'News Feed', 'Notification Feed',
      'Design Elevator', 'Design Parking Lot', 'Design Uber', 'Design Lyft',
      'Rate Limiter', 'Token Bucket', 'Leaky Bucket', 'Sliding Window Rate Limiter',
      'Animal Shelter', 'Dog Cat Shelter', 'Hot Potato', 'Ticket Queue',
      'Bank Counter', 'Supermarket Queue', 'Call Center', 'Customer Support'
    ],
    patterns: ['sliding-window', 'deque', 'priority-queue', 'design', 'simulation']
  },
  HEAPS: {
    titles: [
      'Kth Largest Element', 'Kth Smallest Element', 'Kth Largest in Stream', 'Kth Smallest in Matrix',
      'Kth Smallest Pair Distance', 'Kth Smallest Prime Fraction', 'Kth Largest Sum Subarray',
      'Top K Frequent', 'Top K Frequent Words', 'Sort Characters by Frequency', 'Rearrange String',
      'K Closest Points', 'K Closest Elements', 'Find K Closest Elements', 'K Pairs with Largest Sums',
      'Merge K Sorted Lists', 'Merge K Sorted Arrays', 'Sort K Sorted Array', 'Smallest Range Covering',
      'Median from Data Stream', 'Sliding Window Median', 'Find Median Sorted Arrays', 'IPO',
      'Maximum Performance Team', 'Maximum Average Pass Ratio', 'Minimum Cost Hire K Workers',
      'Minimum Cost Connect Ropes', 'Minimum Cost Connect Points', 'Min Cost to Connect All Points',
      'Network Delay Time', 'Cheapest Flights K Stops', 'Path with Maximum Probability',
      'Reorganize String', 'Rearrange String K Distance', 'Task Scheduler', 'Distant Barcodes',
      'Minimize Deviation', 'Minimum Difference', 'Minimum Operations Halve Array',
      'Stone Game', 'Stone Game II', 'Stone Game III', 'Stone Game IV', 'Stone Game V',
      'Last Stone Weight', 'Last Stone Weight II', 'Remove Stones to Minimize', 'Maximum Product K Numbers',
      'Maximum Number of Eaten Apples', 'Maximum Units Truck', 'Maximum Bags with Capacity',
      'Find Right Interval', 'Meeting Rooms II', 'Minimum Meeting Rooms', 'Process Tasks Using Servers',
      'Single Threaded CPU', 'The Number of the Smallest', 'Construct Target Array',
      'Sort Array Increasing Frequency', 'Sort Features by Popularity', 'Sort by Heap',
      'Design Heap', 'Design Priority Queue', 'Design Median Finder', 'Design Kth Largest',
      'Running Median', 'Online Median', 'Continuous Median', 'Median of Two Sorted',
      'Range Module', 'Stock Price Fluctuation', 'Seat Reservation Manager', 'Smallest Infinite Set',
      'Kth Largest Perfect Subtree', 'Kth Smallest Instructions', 'Kth Missing Positive'
    ],
    patterns: ['min-heap', 'max-heap', 'two-heaps', 'sliding-window', 'sorting', 'greedy']
  },
  HASH_TABLES: {
    titles: [
      'Two Sum', 'Three Sum', 'Four Sum', 'Two Sum II', 'Two Sum III', 'Two Sum Unique Pairs',
      'Two Sum Less Than K', 'Two Sum BST', 'Two Sum - Difference Equals Target',
      'Contains Duplicate', 'Contains Duplicate II', 'Contains Duplicate III', 'Contains Nearby Almost Duplicate',
      'Find All Duplicates', 'Find All Numbers Disappeared', 'Find Duplicates Subtrees',
      'Find Duplicate File', 'Find Duplicate Subtrees', 'First Missing Positive', 'Missing Number',
      'Single Number', 'Single Number II', 'Single Number III', 'Find the Difference',
      'Valid Anagram', 'Group Anagrams', 'Find All Anagrams', 'Palindromic Anagram',
      'Isomorphic Strings', 'Word Pattern', 'Find and Replace Pattern', 'Is Subsequence',
      'Subsequence Check', 'Number of Matching Subsequences', 'Shortest Completing Word',
      'Longest Substring Without Repeating', 'Longest Substring At Most K', 'Longest Substring Two Distinct',
      'Minimum Window Substring', 'Substring with Concatenation', 'Permutation in String',
      'Fraction to Recurring Decimal', 'Happy Number', 'Ugly Number', 'Ugly Number II',
      'Count Primes', 'Power of Two', 'Power of Three', 'Power of Four',
      'Design HashSet', 'Design HashMap', 'Design LRUCache', 'Design LFUCache',
      'Insert Delete GetRandom', 'RandomizedSet', 'RandomizedCollection', 'Insert Delete GetRandom Duplicates',
      'Logger Rate Limiter', 'Design Hit Counter', 'Design Underground System', 'Design Authentication Manager',
      'Design File System', 'Design In Memory File System', 'Design Log Storage', 'Design File System II',
      'Maximum Frequency Stack', 'First Unique Number', 'Encode and Decode TinyURL', 'Encode Decode Strings',
      'Jewels and Stones', 'Unique Morse Code', 'Unique Email Addresses', 'Common Characters',
      'Uncommon Words', 'Replace Words', 'Most Common Word', 'Keyboard Row',
      'Distribute Candies', 'Fair Candy Swap', 'Partition Labels', 'Partition Array by Pivot',
      'Check Array Formation', 'Check Permutation', 'Palindrome Permutation', 'Can Construct Note',
      'Number of Good Pairs', 'Number of Good Subarrays', 'Count Nice Pairs', 'Count Good Meals',
      'Array of Doubled Pairs', 'Find Original Array', 'Find Array Given Subset Sums',
      'K Diff Pairs', 'Count Number of Pairs', 'Max Number of K Sum', 'Count Pairs With Sum'
    ],
    patterns: ['hash-map', 'hash-set', 'two-sum', 'sliding-window', 'frequency-count', 'design']
  },
  SORTING: {
    titles: [
      'Merge Sorted Arrays', 'Merge Sorted Lists', 'Merge K Sorted Lists', 'Merge Intervals',
      'Sort Array', 'Sort List', 'Sort Colors', 'Sort Characters by Frequency',
      'Sort Array by Parity', 'Sort Array by Parity II', 'Sort Array Increasing Frequency',
      'Sort Matrix Diagonally', 'Sort the Students', 'Sort Items by Groups', 'Sort Features by Popularity',
      'Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort',
      'Counting Sort', 'Radix Sort', 'Bucket Sort', 'Shell Sort', 'Tim Sort',
      'Sort Transformed Array', 'Sort Array by Distance', 'Sort Array Square', 'Sort Array III',
      'Wiggle Sort', 'Wiggle Sort II', 'Sort Array by 1 Bits', 'Sort Integers by Power Value',
      'Kth Largest', 'Kth Smallest', 'Kth Largest Element', 'Kth Smallest in Sorted Matrix',
      'Kth Smallest Pair Distance', 'Kth Missing Positive', 'Kth Largest Sum Subarray',
      'Find Median', 'Median of Two Sorted', 'Median of Data Stream', 'Sliding Window Median',
      'Insertion Sort List', 'Sort Binary Tree by Levels', 'Sort Binary Tree by Columns',
      'Sort Vowels in String', 'Sort the People', 'Sort the Sentence', 'Sort Array by Increasing Frequency',
      'Maximum Gap', 'Maximum Product Difference', 'Minimum Difference', 'Minimum Absolute Difference',
      'Find Target Indices', 'Find Original Array', 'Find Array Given Sum', 'Find Right Interval',
      'Queue Reconstruction', 'Height Checker', 'Relative Sort Array', 'Array Partition',
      'Largest Number', 'Largest Perimeter Triangle', 'Maximum Units on Truck', 'Maximum Area Cake',
      'Reorder Data in Log Files', 'Sort Files', 'Sorting Sentences', 'Sorting Paragraphs',
      'External Sort', 'Merge K Arrays', 'Sort Large File', 'Sort Billion Numbers',
      'Intersection Two Arrays', 'Intersection Two Arrays II', 'Find Common Elements', 'Common Elements Three Arrays'
    ],
    patterns: ['merge-sort', 'quick-sort', 'counting-sort', 'heap', 'bucket-sort', 'radix-sort']
  },
  SEARCHING: {
    titles: [
      'Binary Search', 'Search Insert Position', 'Search in Rotated Array', 'Search in Rotated Array II',
      'Find Minimum Rotated', 'Find Minimum Rotated II', 'Search Sorted Unknown Size',
      'First Bad Version', 'Sqrt', 'Valid Perfect Square', 'Peak Index Mountain', 'Find Peak Element',
      'Find Target Indices', 'Find First Last Position', 'Find Smallest Letter', 'Search 2D Matrix',
      'Search 2D Matrix II', 'Search Suggestion System', 'Search in Sorted Matrix',
      'Lower Bound', 'Upper Bound', 'Floor and Ceil', 'Count Occurrences', 'Find Fixed Point',
      'Find Minimum in Rotated', 'Find Rotation Count', 'Find Pivot Index', 'Find Peak',
      'Guess Number Higher Lower', 'Guess Number Higher Lower II', 'Two Sum Sorted', 'Three Sum',
      'Three Sum Closest', 'Three Sum Smaller', 'Four Sum', 'Four Sum II', 'Four Sum Count',
      'Search in BST', 'Insert into BST', 'Delete Node BST', 'Closest BST Value', 'Closest BST Value II',
      'Kth Smallest BST', 'Kth Largest BST', 'Validate BST', 'Recover BST', 'Balance BST',
      'Search Suggestions', 'Suggested Products', 'Search Auto Complete', 'Word Search',
      'Word Search II', 'Word Search III', 'Search Word Matrix', 'Search Pattern 2D Grid',
      'Median of Two Sorted', 'Find Kth Two Sorted', 'Search Two Sorted', 'Intersection Two Sorted',
      'Search Range', 'Range Sum Query', 'Range Sum Query 2D', 'Range Addition',
      'Find Duplicate Number', 'Find Duplicate Subtrees', 'Find Duplicate File', 'Single Element Sorted',
      'Split Array Largest Sum', 'Minimize Maximum', 'Minimum Limit Balls Bag', 'Capacity Ship Packages',
      'Koko Eating Bananas', 'Minimum Speed Arrival', 'Smallest Divisor Threshold', 'Magnetic Force Baskets',
      'Aggressive Cows', 'Allocate Books', 'Painter Partition', 'Minimize Max Distance Gas Stations',
      'Search Infinite Array', 'Search Bitonic Array', 'Search Mountain Array', 'Find in Mountain Array'
    ],
    patterns: ['binary-search', 'dfs', 'bfs', 'two-pointers', 'bst', 'divide-conquer']
  },
  DYNAMIC_PROGRAMMING: {
    titles: [
      'Climbing Stairs', 'Min Cost Climbing', 'Fibonacci Number', 'Tribonacci Number', 'Nth Tribonacci',
      'House Robber', 'House Robber II', 'House Robber III', 'Paint House', 'Paint House II',
      'Paint Fence', 'Decode Ways', 'Decode Ways II', 'Unique Paths', 'Unique Paths II', 'Unique Paths III',
      'Minimum Path Sum', 'Triangle', 'Minimum Falling Path', 'Minimum Falling Path II',
      'Maximum Subarray', 'Maximum Product Subarray', 'Maximum Sum Circular', 'Maximum Subarray Sum Delete',
      'Longest Increasing Subsequence', 'Number of LIS', 'Longest Continuous Increasing', 'Increasing Triplet',
      'Longest Common Subsequence', 'Longest Common Substring', 'Shortest Common Supersequence',
      'Edit Distance', 'Delete Operation Two Strings', 'Minimum ASCII Delete Sum', 'One Edit Distance',
      'Coin Change', 'Coin Change II', 'Coin Change Number of Ways', 'Minimum Coins',
      'Knapsack 0/1', 'Knapsack Unbounded', 'Knapsack Fractional', 'Partition Equal Subset',
      'Partition Subset Sum', 'Target Sum', 'Last Stone Weight II', 'Tallest Billboard',
      'Word Break', 'Word Break II', 'Word Pattern Match', 'Concatenated Words',
      'Palindromic Substrings', 'Longest Palindromic Sub', 'Longest Palindrome', 'Palindrome Partition',
      'Palindrome Partition II', 'Palindrome Partition III', 'Palindrome Partition IV',
      'Regular Expression Match', 'Wildcard Matching', 'Interleaving String', 'Scramble String',
      'Distinct Subsequences', 'Distinct Subsequences II', 'Number of Distinct Subseq',
      'Longest Valid Parentheses', 'Count Palindromic Subseq', 'Count Different Palindromic',
      'Burst Balloons', 'Minimum Score Triangulation', 'Stone Game', 'Stone Game II', 'Stone Game III',
      'Predict Winner', 'Stone Game IV', 'Stone Game V', 'Stone Game VI', 'Stone Game VII',
      'Maximum Profit Job Scheduling', 'Maximum Profit K Transactions', 'Best Time Buy Sell',
      'Best Time Buy Sell II', 'Best Time Buy Sell III', 'Best Time Buy Sell IV', 'Best Time Buy Sell Cooldown',
      'Best Time Buy Sell Fee', 'Best Time Buy Sell with Transaction', 'Maximum Profit Trading',
      'Jump Game', 'Jump Game II', 'Jump Game III', 'Jump Game IV', 'Jump Game V', 'Jump Game VI',
      'Jump Game VII', 'Jump Game VIII', 'Minimum Jumps', 'Reach End Array',
      'Longest Palindrome Subseq', 'Count Palindromic Subseq', 'Longest Palindrome Concat',
      'Number of Arithmetic Slices', 'Longest Arithmetic Subseq', 'Longest Arithmetic Subseq Diff',
      'Longest Arithmetic Progression', 'Arithmetic Slices II', 'Arithmetic Slices III',
      'Maximum Length Repeated Subarray', 'Maximum Length Pair Chain', 'Longest String Chain',
      'Russian Doll Envelopes', 'Maximum Height Stacking', 'Box Stacking',
      'Number of Ways Form String', 'Number of Ways Reach Position', 'Number of Ways Divide Corridor',
      'Integer Break', 'Integer Replacement', 'Ugly Number II', 'Super Ugly Number', 'Nth Super Ugly',
      'Perfect Squares', 'Largest Divisible Subset', 'Largest Multiple of Three',
      'Combination Sum IV', 'Combination Sum', 'Combination Sum II', 'Combination Sum III',
      'Minimum Difficulty Job Schedule', 'Minimum Time to Finish', 'Minimum Number of Work Sessions',
      'Cherry Pickup', 'Cherry Pickup II', 'Dungeon Game', 'Minimum Health Dungeon',
      'Maximum Vacation Days', 'Student Attendance Record', 'Student Attendance Record II',
      'Knight Probability', 'Out of Boundary Paths', 'Number of Dice Rolls', 'Dice Roll Simulation',
      'Number of Ways Buy Pens', 'Number of Ways Split String', 'Number of Ways Separate Numbers',
      'Paint House III', 'Minimum Cost For Tickets', 'Minimum Deletion Cost', 'Minimum Cost Merge Stones',
      'Minimum Cost Cut Stick', 'Minimum Cost Tree Leaf', 'Minimum Cost Connect Ropes',
      'Longest Turbulent Subarray', 'Longest Well Performing', 'Longest Happy Life',
      'Maximum Sum 3 Non Overlapping', 'Maximum Sum 2 Non Overlapping', 'Maximum Sum K Non Overlapping',
      'Domino and Tromino Tiling', 'Knight Dialer', 'Number of Music Playlists', 'Race Car'
    ],
    patterns: ['1d-dp', '2d-dp', 'knapsack', 'lcs', 'lis', 'palindrome', 'interval-dp', 'bitmask-dp']
  },
  RECURSION: {
    titles: [
      'Fibonacci', 'Factorial', 'Power Function', 'Sum of Digits', 'Product of Digits',
      'Reverse String', 'Reverse Number', 'Palindrome Check', 'Sum of Array', 'Product of Array',
      'Maximum in Array', 'Minimum in Array', 'Count Occurrences', 'Find First Index', 'Find Last Index',
      'Check Sorted', 'Is Array Sorted', 'Binary Search Recursive', 'Linear Search Recursive',
      'Print Numbers', 'Print in Range', 'Print Decreasing', 'Print Increasing Decreasing',
      'Print Zigzag', 'Tower of Hanoi', 'Josephus Problem', 'Gray Code', 'Subsets', 'Subsets II',
      'Permutations', 'Permutations II', 'Next Permutation', 'Previous Permutation', 'Permutation Sequence',
      'Combinations', 'Combination Sum', 'Combination Sum II', 'Combination Sum III', 'Combination Sum IV',
      'Letter Combinations', 'Generate Parentheses', 'Different Ways Add Parentheses', 'Score Parentheses',
      'N Queens', 'N Queens II', 'Sudoku Solver', 'Valid Sudoku', 'Solve N Queens',
      'Word Search', 'Word Search II', 'Word Break', 'Word Ladder', 'Word Ladder II',
      'Letter Tile Possibilities', 'Numbers At Most N', 'Beautiful Arrangement', 'Beautiful Arrangement II',
      'Iterator for Combination', 'Iterator for Permutation', 'Iterator for Subsets',
      'Print All Paths', 'Print All Subsequences', 'Print All Permutations', 'Print All Combinations',
      'Maze Path', 'Maze Path with Jumps', 'Maze Path with Obstacles', 'Flood Fill Maze',
      'Knight Tour', 'Rat in Maze', 'N Queens Problem', 'Sudoku', 'Crossword Puzzle',
      'Generate Binary Strings', 'Generate All Strings', 'Generate Parentheses II', 'Generate Balanced Parentheses',
      'Count All Paths', 'Count Paths Maze', 'Count Paths with Obstacles', 'Count Paths with Jumps',
      'Coin Change Recursive', 'Coin Change Count Ways', 'Coin Change All Combinations', 'Coin Change Minimum',
      'Target Sum Subsets', 'Partition Subsets', 'Equal Sum Partition', 'K Partition Equal',
      'LIS Recursive', 'LCS Recursive', 'Edit Distance Recursive', 'Knapsack Recursive',
      'Count Palindromes', 'Count Subsequences', 'Count Distinct Subseq', 'Count Distinct Palindromes',
      'Recursive Tree', 'Print KPC', 'Print Encodings', 'Print Stair Paths', 'Print Board Paths',
      'Get Subsequences', 'Get Permutations', 'Get Maze Paths', 'Get Stair Paths', 'Get KPC',
      'String to Integer', 'Integer to String', 'String Compression', 'String Expansion',
      'Recursive Bubble Sort', 'Recursive Insertion Sort', 'Recursive Selection Sort', 'Recursive Merge Sort',
      'Recursive Power Set', 'Recursive Subset Sum', 'Recursive Backtracking', 'Recursive Memoization'
    ],
    patterns: ['recursion', 'backtracking', 'memoization', 'divide-conquer', 'exhaustive-search']
  },
  GREEDY: {
    titles: [
      'Jump Game', 'Jump Game II', 'Jump Game III', 'Jump Game IV', 'Jump Game V', 'Jump Game VI',
      'Gas Station', 'Candy', 'Candy II', 'Assign Cookies', 'Minimum Platforms', 'Activity Selection',
      'N Meeting Rooms', 'Maximum Events', 'Maximum Profit Job', 'Maximum Profit Jobs',
      'Maximum Units Truck', 'Maximum Bags Full', 'Maximum Performance Team', 'Maximum Average Pass',
      'Minimum Cost Hire K', 'Two City Scheduling', 'Two Best Non Overlapping', 'Maximum Earnings Taxi',
      'Task Scheduler', 'Task Scheduler II', 'Rearrange String', 'Reorganize String', 'Distant Barcodes',
      'Partition Labels', 'Partition Array', 'Partition Array II', 'Partition Array III',
      'Merge Intervals', 'Insert Interval', 'Remove Covered Intervals', 'Remove Interval',
      'Non Overlapping Intervals', 'Minimum Arrows Burst', 'Minimum Taps Garden', 'Video Stitching',
      'Minimum Number Taps', 'Minimum Operations Reduce', 'Minimum Operations Halve', 'Minimum Deletions',
      'Largest Number', 'Largest Perimeter', 'Largest Submatrix', 'Maximum Area Cake',
      'Bag of Tokens', 'Maximum Score Words', 'Maximum Subsequence Score', 'Maximum Number Weeks',
      'Find Permutation', 'Create Sorted Array', 'Wiggle Subsequence', 'Wiggle Sort', 'Wiggle Sort II',
      'Increasing Triplet', 'Split Array Largest', 'Minimize Max Array', 'Minimize Maximum Pair',
      'Minimize Deviation', 'Maximum Split', 'Maximum Sum After', 'Maximum Running Time',
      'Destroy Asteroids', 'Maximum Coins Heroes', 'Maximum Matching Players', 'Maximum White Tiles',
      'Maximize Greatness', 'Maximize Win', 'Maximize Distance', 'Maximize Grid Happiness',
      'IPO', 'Maximum Profit', 'Maximum Profit Trading', 'Best Time Buy Sell', 'Best Time Buy Sell II',
      'Minimum Time Complete', 'Minimum Time Finish', 'Minimum Operations Make Equal', 'Minimum Rounds',
      'Boats to Save People', 'Rescue Boats', 'Maximum Boats', 'Minimum Limit Bags', 'Minimum Balls Bag',
      'Can Place Flowers', 'Can Convert String', 'Can Jump', 'Can Reach End', 'Can Reach',
      'Check if Possible', 'Is Possible', 'Is Good Array', 'Is Array Preorder', 'Is Monotonic',
      'Sort Array by Parity', 'Sort by Distance', 'Sort Matrix', 'Sort Students by Score',
      'Advantage Shuffle', 'Relative Sort', 'Height Checker', 'Array Partition', 'Maximum Pair Min',
      'Lemonade Change', 'Maximize Sum After', 'Maximize Palindrome', 'Construct K Palindrome Strings',
      'Reorder Routes', 'Min Deletions String', 'Min Changes Binary', 'Min Swaps Make Balanced',
      'Minimum Consecutive Cards', 'Minimum Adjacent Swaps', 'Minimum Operations Array',
      'Furthest Building', 'Reach End', 'Reach Target', 'Reach Number', 'Broken Calculator',
      'Minimum Moves Equal', 'Minimum Moves Array', 'Minimum Moves Seats', 'Minimum Operations Grid'
    ],
    patterns: ['greedy', 'sorting', 'two-pointers', 'priority-queue', 'intervals', 'optimization']
  },
  MATH: {
    titles: [
      'Add Two Numbers', 'Multiply Strings', 'Divide Two Integers', 'Add Binary', 'Add Strings',
      'Plus One', 'Plus One Linked', 'Subtract Product Sum', 'Sum of Two Integers', 'Sum Without Arithmetic',
      'Reverse Integer', 'Palindrome Number', 'Integer to Roman', 'Roman to Integer', 'Integer to English',
      'Factorial', 'Trailing Zeroes Factorial', 'Factorial Large Number', 'Preimage Size Factorial',
      'Prime Number', 'Count Primes', 'Nth Prime', 'Prime Pairs', 'Prime Palindrome',
      'Perfect Number', 'Perfect Squares', 'Valid Perfect Square', 'Sum of Square Numbers', 'Square Root',
      'Power of Two', 'Power of Three', 'Power of Four', 'Super Power', 'Pow Function',
      'Fibonacci Number', 'Nth Fibonacci', 'Matrix Fibonacci', 'Fibonacci Mod', 'Large Fibonacci',
      'Greatest Common Divisor', 'LCM', 'Extended GCD', 'Modular GCD', 'GCD of Array',
      'Excel Sheet Column', 'Excel Column Number', 'Excel Column Title', 'Excel Sheet Number',
      'Happy Number', 'Ugly Number', 'Ugly Number II', 'Super Ugly Number', 'Nth Ugly Number',
      'Sqrt Function', 'Sqrt Precise', 'Nth Root', 'Integer Replacement', 'Cube Root',
      'Fraction to Decimal', 'Fraction Addition', 'Fraction Subtraction', 'Fraction Comparison',
      'Complex Number Multiply', 'Complex Number Add', 'Complex Number Divide', 'Imaginary Number',
      'Number of 1 Bits', 'Hamming Distance', 'Total Hamming Distance', 'Hamming Weight',
      'Reverse Bits', 'Bitwise AND Range', 'Bitwise OR Range', 'Maximum XOR', 'Find XOR Sum',
      'Missing Number', 'Missing Number II', 'Single Number', 'Single Number II', 'Single Number III',
      'Divide Chocolate', 'Maximize Sweetness', 'Candy Crush', 'Distribute Candies', 'Distribute Candies II',
      'LCM of Array', 'GCD of Array', 'Check Divisibility', 'Find Divisors', 'Count Divisors',
      'Digit Operations', 'Sum of Digits', 'Product of Digits', 'Digital Root', 'Add Digits',
      'Palindrome Integer', 'Strictly Palindromic', 'Palindrome Number', 'Next Palindrome',
      'Max Product Three', 'Max Product K Numbers', 'Minimum Product', 'Maximum Product',
      'Count Numbers Unique', 'Count Special Integers', 'Count Digit One', 'Digit Count in Range',
      'Arithmetic Slices', 'Consecutive Numbers Sum', 'Sum of Square Numbers', 'Sum of Squares',
      'Pythagorean Triplets', 'Permutation Sequence', 'Next Greater Element III', 'Next Palindrome Number',
      'Binary Gap', 'Binary Watch', 'Convert Number', 'Convert to Base 7', 'Convert to Hexadecimal',
      'Encode Decode', 'String Compression', 'Integer Break', 'Maximum Swap', 'Largest Time',
      'Nth Digit', 'Number Complement', 'Base 7', 'Binary Gap', 'Bulb Switcher', 'Bulb Switcher II', 'Bulb Switcher III',
      'Nim Game', 'Stone Game', 'Flip Game', 'Can I Win', 'Elimination Game', 'Last Remaining',
      'Water Bottles', 'Number of Steps', 'Thousand Separator', 'Maximum 69 Number', 'Convert Integer',
      'Minimum Operations', 'Maximum Score', 'Sum Game', 'Decode XORed', 'Decode XORed Permutation'
    ],
    patterns: ['math', 'number-theory', 'gcd-lcm', 'prime', 'bit-manipulation', 'combinatorics']
  },
  BACKTRACKING: {
    titles: [
      'Permutations', 'Permutations II', 'Next Permutation', 'Permutation Sequence', 'Beautiful Arrangement',
      'Combinations', 'Combination Sum', 'Combination Sum II', 'Combination Sum III', 'Combination Sum IV',
      'Subsets', 'Subsets II', 'Powerset', 'Generate All Subsets', 'All Possible Subsets',
      'Word Search', 'Word Search II', 'Word Break', 'Word Break II', 'Word Pattern',
      'N Queens', 'N Queens II', 'Solve N Queens', 'Sudoku Solver', 'Valid Sudoku',
      'Letter Combinations', 'Generate Parentheses', 'Remove Invalid Parentheses', 'Score Parentheses',
      'Subsets with Duplicates', 'Subsets of Size K', 'All Subsets of Size', 'All Paths Source Target',
      'Path Sum', 'Path Sum II', 'Path Sum III', 'Path Sum IV', 'Binary Tree Paths',
      'All Paths from Root', 'Print All Paths', 'All Root to Leaf', 'Path with Sequence',
      'Partition String', 'Partition Palindrome', 'Partition K Subsets', 'Partition Equal Subset',
      'Partition Labels', 'Palindrome Partition', 'Palindrome Partition II', 'Palindrome Partition III',
      'Restore IP Addresses', 'Reorder Routes', 'Reorder Data Logs', 'Reorganize String',
      'Expression Add Operators', 'Different Ways Add', 'Add Operators String', 'Target Sum',
      'Maximum Score Words', 'Maximum Length Concatenated', 'Maximum Number Achievable',
      'Matchsticks to Square', 'Partition K Equal Sum', 'Split Array Same Average', 'Partition Array',
      'Find All Anagrams', 'Find All Duplicates', 'Find All Numbers', 'Find Disappeared Numbers',
      'Numbers Same Consecutive', 'Numbers With Repeated', 'Count Numbers Unique', 'Confusing Number',
      'Splitting String', 'Split String Max Unique', 'Split Array Fibonacci', 'Split Array Consecutive',
      'Maximum Good People', 'Maximum Guests', 'Maximum Students', 'Maximum Score',
      'Iterator Combination', 'Combination Iterator', 'Permutation Iterator', 'Set Iterator',
      'All Possible Full Binary', 'All Possible BST', 'Unique BST', 'Unique BST II',
      'Letter Case Permutation', 'Strobogrammatic Number', 'Strobogrammatic II', 'Confusing Number II',
      'Flip Game', 'Flip Game II', 'Can I Win', 'Can Win', 'Can Player Win',
      'Maze Solver', 'Rat in Maze', 'Knight Tour', 'N Queens Problem', 'Crossword Puzzle',
      'Generate Abbreviations', 'Generalized Abbreviation', 'Word Abbreviation', 'Valid Word Abbreviation',
      'Gray Code', 'Circular Permutation', 'Beautiful Arrangement II', 'Construct Array',
      'Tiling Rectangle', 'Optimal Account Balancing', 'Minimum Incompatibility', 'Distribute Repeating',
      'Minimum Time Difference', 'Minimum Unique Word', 'Maximum Number Groups', 'Number Ways Buy Pens'
    ],
    patterns: ['backtracking', 'recursion', 'dfs', 'pruning', 'constraint-satisfaction', 'state-space']
  }
};

// Code templates for each language
const starterCodeTemplates: Record<string, Record<string, string>> = {
  javascript: {
    default: `/**
 * @param {any[]} args
 * @return {any}
 */
function solve(...args) {
    // Your code here
    return null;
}`,
    array: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function solve(nums) {
    // Your code here
    return [];
}`,
    matrix: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function solve(matrix) {
    // Your code here
    return [];
}`,
    string: `/**
 * @param {string} s
 * @return {string}
 */
function solve(s) {
    // Your code here
    return "";
}`,
    tree: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {any}
 */
function solve(root) {
    // Your code here
    return null;
}`,
    linkedlist: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function solve(head) {
    // Your code here
    return null;
}`,
    graph: `/**
 * @param {number[][]} edges
 * @param {number} n
 * @return {number[]}
 */
function solve(edges, n) {
    // Your code here
    return [];
}`
  },
  python: {
    default: `class Solution:
    def solve(self, *args):
        # Your code here
        pass`,
    array: `class Solution:
    def solve(self, nums: List[int]) -> List[int]:
        # Your code here
        pass`,
    matrix: `class Solution:
    def solve(self, matrix: List[List[int]]) -> List[int]:
        # Your code here
        pass`,
    string: `class Solution:
    def solve(self, s: str) -> str:
        # Your code here
        pass`,
    tree: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def solve(self, root: Optional[TreeNode]) -> any:
        # Your code here
        pass`,
    linkedlist: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def solve(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Your code here
        pass`,
    graph: `class Solution:
    def solve(self, edges: List[List[int]], n: int) -> List[int]:
        # Your code here
        pass`
  },
  java: {
    default: `class Solution {
    public Object solve(Object... args) {
        // Your code here
        return null;
    }
}`,
    array: `class Solution {
    public int[] solve(int[] nums) {
        // Your code here
        return new int[]{};
    }
}`,
    matrix: `class Solution {
    public int[] solve(int[][] matrix) {
        // Your code here
        return new int[]{};
    }
}`,
    string: `class Solution {
    public String solve(String s) {
        // Your code here
        return "";
    }
}`,
    tree: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public Object solve(TreeNode root) {
        // Your code here
        return null;
    }
}`,
    linkedlist: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode solve(ListNode head) {
        // Your code here
        return null;
    }
}`,
    graph: `class Solution {
    public int[] solve(int[][] edges, int n) {
        // Your code here
        return new int[]{};
    }
}`
  },
  cpp: {
    default: `class Solution {
public:
    auto solve(auto... args) {
        // Your code here
        return;
    }
};`,
    array: `class Solution {
public:
    vector<int> solve(vector<int>& nums) {
        // Your code here
        return {};
    }
};`,
    matrix: `class Solution {
public:
    vector<int> solve(vector<vector<int>>& matrix) {
        // Your code here
        return {};
    }
};`,
    string: `class Solution {
public:
    string solve(string s) {
        // Your code here
        return "";
    }
};`,
    tree: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    auto solve(TreeNode* root) {
        // Your code here
        return;
    }
};`,
    linkedlist: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* solve(ListNode* head) {
        // Your code here
        return nullptr;
    }
};`,
    graph: `class Solution {
public:
    vector<int> solve(vector<vector<int>>& edges, int n) {
        // Your code here
        return {};
    }
};`
  }
};

// Description templates
const descriptionTemplates: Record<string, string[]> = {
  ARRAYS: [
    'Given an array of integers `nums`, implement the solution to solve the problem efficiently.',
    'You are given an array `arr` of size `n`. Return the result after processing.',
    'Given a sorted array, implement the optimal solution with O(n) or O(log n) time complexity.',
    'Given an array of integers, find the optimal subarray that satisfies the given condition.',
    'Given a 2D matrix, implement the solution to process the matrix elements.'
  ],
  STRINGS: [
    'Given a string `s`, implement the solution to process and transform the string.',
    'You are given a string of characters. Return the result after applying the transformation.',
    'Given two strings, find the relationship between them.',
    'Given a string, find the optimal substring that satisfies the given condition.',
    'Implement string manipulation to solve the problem efficiently.'
  ],
  LINKED_LISTS: [
    'Given the head of a linked list, implement the solution to process the list.',
    'You are given a singly linked list. Modify the list as required.',
    'Given two linked lists, find their relationship or merge them.',
    'Given a linked list, reverse or reorder it according to the requirements.',
    'Implement the solution to detect or remove elements from the linked list.'
  ],
  TREES: [
    'Given the root of a binary tree, implement the traversal or modification.',
    'You are given a binary search tree. Find or insert elements efficiently.',
    'Given a binary tree, find the path or sum that satisfies the condition.',
    'Given two trees, determine their relationship.',
    'Implement tree construction from given data.'
  ],
  GRAPHS: [
    'Given a graph represented as adjacency list, implement the traversal algorithm.',
    'You are given `n` nodes and edges. Find the shortest path or detect cycles.',
    'Given a grid representing a graph, solve the island or path problem.',
    'Given a directed/undirected graph, implement topological sort or cycle detection.',
    'Implement BFS/DFS to solve the graph problem efficiently.'
  ],
  STACKS: [
    'Given an expression, implement stack-based solution to process it.',
    'You are given a series of operations. Use stack to track and process.',
    'Given an array, find the next greater/smaller element using monotonic stack.',
    'Given parentheses/brackets, validate or process using stack.',
    'Implement a stack-based algorithm to solve the problem.'
  ],
  QUEUES: [
    'Given a stream of data, implement queue-based solution to process it.',
    'You are given operations to perform. Use queue for efficient processing.',
    'Given an array, find the maximum/minimum in sliding window using deque.',
    'Given tasks/jobs, schedule them using queue-based algorithm.',
    'Implement BFS using queue to solve the problem.'
  ],
  HEAPS: [
    'Given an array, find the kth largest/smallest element using heap.',
    'You are given streams of numbers. Maintain median or order using heap.',
    'Given tasks/jobs, schedule them optimally using priority queue.',
    'Given intervals, merge or find overlaps using heap.',
    'Implement heap-based solution for efficient processing.'
  ],
  HASH_TABLES: [
    'Given an array, find pairs that satisfy the condition using hash map.',
    'You are given strings/arrays. Find duplicates or unique elements.',
    'Given data, design an efficient hash-based data structure.',
    'Given two arrays, find their intersection using hash set.',
    'Implement solution using hash map for O(1) lookups.'
  ],
  SORTING: [
    'Given an array, sort it according to specific criteria.',
    'You are given unsorted data. Sort and process efficiently.',
    'Given intervals, merge or find overlaps after sorting.',
    'Given arrays, find elements after sorting by custom criteria.',
    'Implement sorting algorithm or use sorting to solve the problem.'
  ],
  SEARCHING: [
    'Given a sorted array, implement binary search to find the target.',
    'You are given a rotated sorted array. Find the target efficiently.',
    'Given a matrix, search for element using binary search.',
    'Given an array, find first/last position of target.',
    'Implement search algorithm with optimal time complexity.'
  ],
  DYNAMIC_PROGRAMMING: [
    'Given a problem with overlapping subproblems, implement DP solution.',
    'You are given choices at each step. Find optimal solution using DP.',
    'Given constraints, count number of ways or find minimum/maximum.',
    'Given a sequence, find longest subsequence satisfying conditions.',
    'Implement memoization or tabulation to solve efficiently.'
  ],
  RECURSION: [
    'Given a problem, implement recursive solution with base case.',
    'You are given a structure. Traverse or process using recursion.',
    'Given choices at each step, explore all possibilities recursively.',
    'Given a mathematical formula, implement recursive calculation.',
    'Implement divide and conquer using recursion.'
  ],
  GREEDY: [
    'Given a problem, make locally optimal choice at each step.',
    'You are given choices. Select greedily to find global optimum.',
    'Given intervals or events, schedule optimally using greedy.',
    'Given resources, allocate efficiently using greedy approach.',
    'Implement greedy algorithm for optimal solution.'
  ],
  MATH: [
    'Given mathematical problem, implement efficient calculation.',
    'You are given numbers. Apply number theory to solve.',
    'Given a formula, calculate result with proper handling.',
    'Given constraints, find mathematical pattern or formula.',
    'Implement mathematical algorithm with proper precision.'
  ],
  BACKTRACKING: [
    'Given a problem, explore all possible solutions systematically.',
    'You are given constraints. Find all valid configurations.',
    'Given a grid/board, place elements satisfying constraints.',
    'Given choices, generate all valid combinations/permutations.',
    'Implement backtracking with pruning for efficiency.'
  ]
};

// Constraint templates
const constraintTemplates: Record<string, string> = {
  ARRAYS: `• 1 <= nums.length <= 10⁵
• -10⁹ <= nums[i] <= 10⁹
• The solution should have O(n) or O(n log n) time complexity.`,
  STRINGS: `• 1 <= s.length <= 10⁵
• s consists of lowercase and uppercase English letters.
• The solution should have O(n) time complexity.`,
  LINKED_LISTS: `• The number of nodes in the list is in the range [0, 10⁴].
• -10⁵ <= Node.val <= 10⁵
• The solution should have O(n) time and O(1) space complexity.`,
  TREES: `• The number of nodes in the tree is in the range [0, 10⁴].
• -10⁵ <= Node.val <= 10⁵
• The solution should have O(n) time complexity.`,
  GRAPHS: `• 1 <= n <= 10⁴
• 0 <= edges.length <= 10⁵
• The solution should handle large inputs efficiently.`,
  STACKS: `• 1 <= input.length <= 10⁵
• The solution should have O(n) time complexity.`,
  QUEUES: `• 1 <= operations.length <= 10⁵
• The solution should process each operation in O(1) or O(log n) time.`,
  HEAPS: `• 1 <= nums.length <= 10⁵
• -10⁹ <= nums[i] <= 10⁹
• The solution should have O(n log k) time complexity for kth element.`,
  HASH_TABLES: `• 1 <= input.length <= 10⁵
• Values are within valid integer range.
• The solution should have O(n) average time complexity.`,
  SORTING: `• 1 <= arr.length <= 10⁵
• -10⁹ <= arr[i] <= 10⁹
• The solution should have O(n log n) time complexity.`,
  SEARCHING: `• 1 <= arr.length <= 10⁵
• The array may be sorted or rotated sorted.
• The solution should have O(log n) time complexity.`,
  DYNAMIC_PROGRAMMING: `• 1 <= n <= 10⁴
• Values are within valid integer range.
• The solution should have polynomial time complexity.`,
  RECURSION: `• Input size allows recursive solution without stack overflow.
• Consider memoization for optimization.
• Time complexity depends on branching factor.`,
  GREEDY: `• 1 <= input.length <= 10⁵
• Greedy choice property holds for this problem.
• The solution should have O(n) or O(n log n) time complexity.`,
  MATH: `• Input values are within integer range.
• Consider overflow for large numbers.
• The solution should be mathematically correct.`,
  BACKTRACKING: `• Input size allows exploring all possibilities.
• Use pruning to optimize the solution.
• Return all valid solutions or count.`
};

// Companies with frequency data
const companiesData = [
  { name: 'Google', slug: 'google' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Facebook', slug: 'facebook' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Netflix', slug: 'netflix' },
  { name: 'Uber', slug: 'uber' },
  { name: 'LinkedIn', slug: 'linkedin' },
  { name: 'Twitter', slug: 'twitter' },
  { name: 'Airbnb', slug: 'airbnb' },
];

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExamples(topic: string, difficulty: string): string {
  const exampleSets = [
    [
      { input: 'nums = [1,2,3,4,5]', output: '[2,3,4,5,6]', explanation: 'Each element is incremented by 1.' },
      { input: 'nums = [10,20,30]', output: '[11,21,31]', explanation: 'Each element is incremented by 1.' }
    ],
    [
      { input: 's = "hello"', output: '"olleh"', explanation: 'The string is reversed.' },
      { input: 's = "world"', output: '"dlrow"', explanation: 'The string is reversed.' }
    ],
    [
      { input: 'n = 5', output: '15', explanation: 'Sum from 1 to 5 is 15.' },
      { input: 'n = 10', output: '55', explanation: 'Sum from 1 to 10 is 55.' }
    ],
    [
      { input: 'matrix = [[1,2],[3,4]]', output: '[[4,3],[2,1]]', explanation: 'The matrix is rotated 180 degrees.' },
      { input: 'matrix = [[1,2,3],[4,5,6]]', output: '[[6,5,4],[3,2,1]]', explanation: 'The matrix is rotated 180 degrees.' }
    ],
    [
      { input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2', explanation: 'The smallest subarray with sum >= 7 has length 2.' },
      { input: 'target = 11, nums = [1,1,1,1,1,1,1,1]', output: '0', explanation: 'No subarray has sum >= 11.' }
    ]
  ];
  return JSON.stringify(getRandomElement(exampleSets));
}

function generateTestCases(topic: string): { input: string; expectedOutput: string; isHidden: boolean }[] {
  const testCases = [];
  // Add visible test cases
  for (let i = 0; i < 3; i++) {
    testCases.push({
      input: `test_input_${i + 1}`,
      expectedOutput: `expected_output_${i + 1}`,
      isHidden: false
    });
  }
  // Add hidden test cases
  for (let i = 0; i < 5; i++) {
    testCases.push({
      input: `hidden_test_input_${i + 1}`,
      expectedOutput: `hidden_expected_output_${i + 1}`,
      isHidden: true
    });
  }
  return testCases;
}

function generateHints(topic: string): string {
  const hintsByTopic: Record<string, string[]> = {
    ARRAYS: [
      'Consider using two pointers or sliding window technique.',
      'Hash map can help achieve O(n) time complexity.',
      'Think about sorting the array first.',
      'Binary search can be used on sorted arrays.',
      'Consider the prefix sum approach.'
    ],
    STRINGS: [
      'Two pointers technique is often useful for string problems.',
      'Consider using hash map to store character frequencies.',
      'Sliding window can solve many substring problems.',
      'Stack is useful for matching parentheses.',
      'Try to think about character by character processing.'
    ],
    LINKED_LISTS: [
      'Use fast and slow pointers for cycle detection.',
      'Consider using a dummy head for easier manipulation.',
      'Recursive approach can simplify the solution.',
      'Be careful with null pointer handling.',
      'Drawing the list helps visualize the problem.'
    ],
    TREES: [
      'DFS is useful for most tree problems.',
      'BFS (level order) is useful for level-wise processing.',
      'Consider using recursion for tree traversal.',
      'Think about what information you need from children.',
      'Inorder, preorder, postorder have different use cases.'
    ],
    GRAPHS: [
      'BFS for shortest path in unweighted graph.',
      'DFS for exploring all paths.',
      'Union-Find for connected components.',
      'Topological sort for dependency problems.',
      'Dijkstra for shortest path with weights.'
    ],
    DYNAMIC_PROGRAMMING: [
      'Identify the subproblems and overlapping patterns.',
      'Think about the recurrence relation.',
      'Consider both memoization and tabulation.',
      'Start with brute force and optimize.',
      'Identify the base cases carefully.'
    ]
  };
  
  const defaultHints = [
    'Think about the time and space complexity.',
    'Consider edge cases in your solution.',
    'Draw examples to understand the pattern.',
    'Break down the problem into smaller parts.',
    'Consider different approaches before coding.'
  ];
  
  const hints = hintsByTopic[topic] || defaultHints;
  return JSON.stringify(hints.slice(0, 3));
}

function getStarterCode(topic: string): string {
  const codeType = ['array', 'string', 'tree', 'linkedlist', 'graph', 'matrix'].includes(topic.toLowerCase()) 
    ? topic.toLowerCase() 
    : 'default';
  
  const code: Record<string, string> = {};
  for (const lang of ['javascript', 'python', 'java', 'cpp']) {
    code[lang] = starterCodeTemplates[lang][codeType] || starterCodeTemplates[lang]['default'];
  }
  return JSON.stringify(code);
}

async function main() {
  console.log('Starting comprehensive database seeding...');
  
  // Clear existing data
  await prisma.companyProblem.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.dailyChallenge.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.company.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userActivity.deleteMany();
  
  console.log('Cleared existing data.');

  // Create companies and store their IDs
  const companyIds: Record<string, string> = {};
  for (const company of companiesData) {
    const created = await prisma.company.create({
      data: { name: company.name, slug: company.slug }
    });
    companyIds[company.slug] = created.id;
  }
  console.log('Created companies.');

  // Generate problems for each topic
  const topics = Object.keys(problemTemplates) as Topic[];
  let totalProblems = 0;
  let problemNumber = 1;

  for (const topic of topics) {
    const template = problemTemplates[topic];
    if (!template) continue;
    
    const titles = template.titles;
    console.log(`Processing ${topic}: ${titles.length} problems available`);
    
    // Ensure at least 50 problems per topic
    const neededProblems = Math.max(50, titles.length);
    
    for (let i = 0; i < neededProblems; i++) {
      const titleIndex = i % titles.length;
      let title = titles[titleIndex];
      
      // Add unique suffix for duplicates
      if (i >= titles.length) {
        title = `${title} ${Math.floor(i / titles.length) + 1}`;
      }
      
      // Include topic and index to ensure unique slug
      const slug = `${topic.toLowerCase()}-${generateSlug(title)}-${i}`;
      
      // Distribute difficulty: 30% Easy, 45% Medium, 25% Hard
      let difficulty: Difficulty;
      const rand = Math.random();
      if (rand < 0.30) {
        difficulty = Difficulty.EASY;
      } else if (rand < 0.75) {
        difficulty = Difficulty.MEDIUM;
      } else {
        difficulty = Difficulty.HARD;
      }
      
      const descriptions = descriptionTemplates[topic] || descriptionTemplates.ARRAYS;
      const description = `${getRandomElement(descriptions)}

**Problem: ${title}**

${getRandomElement(descriptions)}`;

      const problem = await prisma.problem.create({
        data: {
          title,
          slug,
          description,
          difficulty,
          topic: topic as Topic,
          constraints: constraintTemplates[topic] || constraintTemplates.ARRAYS,
          examples: generateExamples(topic, difficulty),
          starterCode: getStarterCode(topic),
          hints: generateHints(topic),
          acceptance: parseFloat((getRandomInt(25, 75) + Math.random()).toFixed(1)),
          frequency: getRandomInt(0, 100),
          testCases: {
            create: generateTestCases(topic)
          }
        }
      });
      
      // Assign to random companies (1-4 companies per problem)
      const numCompanies = getRandomInt(1, 4);
      const shuffledCompanies = [...companiesData].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < numCompanies; j++) {
        const companySlug = shuffledCompanies[j].slug;
        const companyId = companyIds[companySlug];
        if (companyId) {
          await prisma.companyProblem.create({
            data: {
              companyId: companyId,
              problemId: problem.id,
              frequency: getRandomInt(10, 100),
              lastAsked: new Date(Date.now() - getRandomInt(0, 365) * 24 * 60 * 60 * 1000)
            }
          });
        }
      }
      
      totalProblems++;
      
      if (totalProblems % 50 === 0) {
        console.log(`Created ${totalProblems} problems...`);
      }
    }
  }

  console.log(`\nSeeding complete!`);
  console.log(`Total problems created: ${totalProblems}`);
  
  // Print statistics
  const stats = await prisma.problem.groupBy({
    by: ['topic'],
    _count: { id: true }
  });
  
  console.log('\nProblems by topic:');
  for (const stat of stats) {
    console.log(`  ${stat.topic}: ${stat._count.id}`);
  }
  
  const difficultyStats = await prisma.problem.groupBy({
    by: ['difficulty'],
    _count: { id: true }
  });
  
  console.log('\nProblems by difficulty:');
  for (const stat of difficultyStats) {
    console.log(`  ${stat.difficulty}: ${stat._count.id}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

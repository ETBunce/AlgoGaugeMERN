import { SortingAlgorithmsKeys } from './algorithmKeys.js'

export const codeText = {
    [SortingAlgorithmsKeys.BUBBLE]: `template <typename T>
    class Bubble : public BaseSort <T> {
    public:
      Bubble(const unsigned int capacity) : BaseSort<T>("Bubble", capacity) {}
      void runSort();
    private:
    };
    
    template <typename T>
    void Bubble<T>::runSort() {
      for (unsigned int round = 0; round < this->capacity - 1; round++) {
        for (unsigned int i = 0; i < this->capacity - 1 - round; i++) {
          if (this->arr[i + 1] < this->arr[i]) {
            T temp = this->arr[i];
            this->arr[i] = this->arr[i + 1];
            this->arr[i + 1] = temp;
          }
        }
      }
    }`,

    [SortingAlgorithmsKeys.INSERTION]: `template <typename T>
    class Insertion : public BaseSort<T> {
    public:
      Insertion(const unsigned int capacity) : BaseSort<T>("Insertion", capacity) {};
      void runSort();
    private:
    };
    
    template <typename T>
    void Insertion<T>::runSort() {
      // The outer loop's job is to...
      // Obtain the leftmost unsorted value, iterates one index to the right each round.  Starts at 1
      for (unsigned int i = 1; i < this->capacity; i++) {
        // The inner loop's job is to...  
        // Take the leftmost unsorted value, walk to the left (back to index 0), swapping along the way until
        // no swaps are needed, or until we get to index 0.      
        unsigned int j = i;
        while (j > 0 && this->arr[j] < this->arr[j - 1]) {
          T temp = this->arr[j];
          this->arr[j] = this->arr[j - 1];
          this->arr[j - 1] = temp;
          j--;
        }
      }
    }`,

    [SortingAlgorithmsKeys.HEAP]: `template <typename T>
    class Heap : public BaseSort<T> {
    public:
      Heap(const unsigned int capacity) : BaseSort<T>("Heap", capacity) {};
      void runSort();
    private:
      void heapify(unsigned int lastUnsortedIndex, unsigned int parent);
    };
    
    template <typename T>
    void Heap<T>::heapify(unsigned int lastUnsortedIndex, unsigned int parent) {
      // Find largest among root, left child and right child
      unsigned int largest = parent;
      unsigned int left = 2 * parent + 1;
      unsigned int right = 2 * parent + 2;
    
      if (left < lastUnsortedIndex && this->arr[left] > this->arr[largest])
        largest = left;
    
      if (right < lastUnsortedIndex && this->arr[right] > this->arr[largest])
        largest = right;
    
      // Swap and continue heapifying if root is not largest
      if (largest != parent) {
        T temp = this->arr[parent];
        this->arr[parent] = this->arr[largest];
        this->arr[largest] = temp;
        heapify(lastUnsortedIndex, largest);
      }
    }
    
    template <typename T>
    void Heap<T>::runSort() {
    
      // Put tree in max heap (all parents bigger than their children)
      unsigned int  i = this->capacity / 2;
      while (i > 0) {
        i--;
        heapify(this->capacity, i);
      }
    
      // Swap root to sorted position, re-heap, repeat.
      unsigned int lastUnsortedIndex = this->capacity;
      while (lastUnsortedIndex > 0) {
        lastUnsortedIndex--;
        T temp = this->arr[0];
        this->arr[0] = this->arr[lastUnsortedIndex];
        this->arr[lastUnsortedIndex] = temp;
        heapify(lastUnsortedIndex, 0);
      }
    }
    
    template <typename T, unsigned int K>
    class MinHeap {
    public:
      MinHeap(T* sourceArray, unsigned int sourceArraySize);
      void insert(T* item);
      //T getAndReplace(const T& replacement);
      T getSmallest();
    private:
      T* heap[K]; // Make this a stack array and not a heap array for performance.  It's a pointer existing array values and pointer arithmetic
      unsigned int size;
      T* sourceArray{ nullptr };
      unsigned int sourceArraySize{ 0 };
      //SortSubArrays subArrayIndexes[k];
    };
    
    template <typename T, unsigned int K>
    MinHeap<T, K>::MinHeap(T* sourceArray, unsigned int sourceArraySize) {
      this->sourceArray = sourceArray;
      this->sourceArraySize = sourceArraySize;
      for (unsigned int i = 0; i < K; i++) {
    
        //if ((i * sourceArraySize) / K == 0) {
        this->insert(sourceArray + (i * sourceArraySize) / K);
        //}
        //else {
        //	this->insert(sourceArray + (i * sourceArraySize) / K + 1);
        //}
        //	unsigned int extra = sourceArraySize % K;
        //	this->insert(sourceArray + (i * (sourceArraySize + extra)) / K);
        //}
        //else {
        //	this->insert(sourceArray + (i * sourceArraySize) / K);
        //}
        //subArrayIndexes[i].rangeStartIndex = sourceArraySize * i / K;
        //subArrayIndexes[i].currentIndex = sourceArraySize * i / K;
        //subArrayIndexes[i].rangeEndIndex = sourceArraySize * (i+1) / K;
      }
    }
    
    template <typename T, unsigned int K>
    void MinHeap<T, K>::insert(T* item) {
    
      unsigned int currIndex = size;
    
      heap[size] = item;
      size++;
    
      // Work upward
      while (currIndex > 0 && *heap[currIndex] < *heap[(currIndex - 1) / 2]) {
        //swap
        T* temp = heap[currIndex];
        heap[currIndex] = heap[(currIndex - 1) / 2];
        heap[(currIndex - 1) / 2] = temp;
        currIndex = (currIndex - 1) / 2;
      }
    }
    
    template <typename T, unsigned int K>
    T MinHeap<T, K>::getSmallest() {
    
      // Get top, replace it with the last item to keep the tree balanced
      T retVal = *heap[0];
    
      // See if this subarray has more values or not.  
      if (((int(heap[0] - sourceArray) + 2) * K - 1) % sourceArraySize >= K) {
        // We're still within a subarray, use the next value of the subarray
        heap[0] = heap[0] + 1;
      }
      else {
        // This sub array is done.  Put the last leaf of the heap at root
        if (size == 0) {
          cout << "break here" << endl;
        }
        heap[0] = heap[size - 1];
        size--;
      }
    
      // Work downward
      unsigned int parent = 0;
      while (true) {
        unsigned int left = 2 * parent + 1;
        unsigned int right = 2 * parent + 2;
        unsigned int smallest = parent;
        if (left < size && *heap[left] < *heap[smallest])
          smallest = left;
    
        if (right < size && *heap[right] < *heap[smallest])
          smallest = right;
    
        if (smallest != parent) {
          T* temp = heap[parent];
          heap[parent] = heap[smallest];
          heap[smallest] = temp;
          // Prepare for next loop
          parent = smallest;
        }
        else {
          break;
        }
      }
    
      return retVal;
    
    }
    
    template <typename T, unsigned int K>
    class HeapKMerge : public BaseSort<T> {
    public:
      HeapKMerge(const unsigned int capacity) : BaseSort<T>("Heap - K-Way Merge", capacity) {}
      void runSort();
    private:
      void runSort(unsigned int firstIndex, unsigned int lastIndex);
    
    };
    
    template <typename T, unsigned int  K>
    void HeapKMerge<T, K>::runSort() {
      runSort(0, this->capacity);
    }
    
    template <typename T, unsigned int K>
    void HeapKMerge<T, K>::runSort(unsigned int firstIndex, unsigned int lastIndex) {
    
      if (lastIndex - firstIndex < 2) {
        return;
      }
    
      unsigned int numValues = lastIndex - firstIndex;
      for (unsigned int i = 0; i < K; i++) {
        runSort(firstIndex + numValues * i / K, firstIndex + numValues * (i + 1) / K);
      }
    
      T* arrayCopy = new T[numValues];
      for (unsigned int i = 0; i < numValues; i++) {
        arrayCopy[i] = this->arr[firstIndex + i];
      }
    
      // Build heap.  First put all values in the heap.
      MinHeap<T, K> minHeap(arrayCopy, numValues);
    
      unsigned int itemsSorted = 0;
    
      while (itemsSorted < numValues) {
    
        this->arr[firstIndex + itemsSorted] = minHeap.getSmallest();
    
        itemsSorted++;
      }
      delete[] arrayCopy;
    
    }`,

    [SortingAlgorithmsKeys.MERGE]: `template <typename T>
    class Merge : public BaseSort<T> {
    public:
      Merge(const unsigned int capacity) : BaseSort<T>("merge", capacity) {}
      void runSort();
    private:
      void runSort(unsigned int firstIndex, unsigned int lastIndex);
    };
    
    
    template <typename T>
    void Merge<T>::runSort() {
      runSort(0, this->capacity);
    }
    
    template <typename T>
    void Merge<T>::runSort(unsigned int firstIndex, unsigned int lastIndex) {
      if (lastIndex - firstIndex < 2) {
        return;
      }
    
      // Find a middle
      unsigned int middleIndex = (lastIndex - firstIndex) / 2 + firstIndex;
    
      runSort(firstIndex, middleIndex);
      runSort(middleIndex, lastIndex);
    
      unsigned int leftHalfSize = middleIndex - firstIndex;
      T* leftArray = new T[leftHalfSize];
      for (unsigned int i = 0; i < leftHalfSize; i++) {
        leftArray[i] = this->arr[firstIndex + i];
      }
      unsigned int rightHalfSize = lastIndex - middleIndex;
      T* rightArray = new T[rightHalfSize];
      for (unsigned int i = 0; i < rightHalfSize; i++) {
        rightArray[i] = this->arr[middleIndex + i];
      }
      unsigned int leftIndex = 0;
      unsigned int rightIndex = 0;
      unsigned int arrIndex = firstIndex;
    
      while (leftIndex < leftHalfSize && rightIndex < rightHalfSize) {
        if (leftArray[leftIndex] <= rightArray[rightIndex]) {
          this->arr[arrIndex] = leftArray[leftIndex];
          leftIndex++;
        }
        else {
          this->arr[arrIndex] = rightArray[rightIndex];
          rightIndex++;
        }
        arrIndex++;
      }
      while (leftIndex < leftHalfSize) {
        this->arr[arrIndex] = leftArray[leftIndex];
        leftIndex++;
        arrIndex++;
      }
      while (rightIndex < rightHalfSize) {
        this->arr[arrIndex] = rightArray[rightIndex];
        rightIndex++;
        arrIndex++;
      }
      delete[] leftArray;
      delete[] rightArray;
    
    }
    
    template <typename T, unsigned int K>
    class ArrayKMerge : public BaseSort<T> {
    public:
      ArrayKMerge(const unsigned int capacity) : BaseSort<T>("Array K-Way Merge", capacity) {}
      void runSort();
    private:
      void runSort(unsigned int firstIndex, unsigned int lastIndex);
    };
    
    template <typename T, unsigned int  K>
    void ArrayKMerge<T, K>::runSort() {
      runSort(0, this->capacity);
    }
    
    struct KIndexes {
      unsigned int kthStartIndex{ 0 };
      unsigned int kthCurrentIndex{ 0 };
      unsigned int kthEndIndex{ 0 };
    };
    
    template <typename T, unsigned int K>
    void ArrayKMerge<T, K>::runSort(unsigned int firstIndex, unsigned int lastIndex) {
    
      if (lastIndex - firstIndex < 2) {
        return;
      }
    
      unsigned int numValues = lastIndex - firstIndex;
      KIndexes indexes[K];
      T* arrayCopy = new T[numValues];
    
      for (unsigned int i = 0; i < K; i++) {
        indexes[i].kthStartIndex = numValues * i / K;
        indexes[i].kthEndIndex = numValues * (i + 1) / K;
        runSort(firstIndex + indexes[i].kthStartIndex, firstIndex + indexes[i].kthEndIndex);
      }
      for (unsigned int i = 0; i < numValues; i++) {
        arrayCopy[i] = this->arr[firstIndex + i];
      }
      for (unsigned int i = 0; i < K; i++) {
        indexes[i].kthCurrentIndex = indexes[i].kthStartIndex;
      }
    
      unsigned int itemsSorted = 0;
    
      while (itemsSorted < numValues) {
        // Scan across all arrays looking for the smallest
        int arrayWithSmallestValue = -1;
        for (unsigned int i = 0; i < K; i++) {
          if (indexes[i].kthCurrentIndex < indexes[i].kthEndIndex) {
            if (arrayWithSmallestValue == -1) {
              arrayWithSmallestValue = i;
            }
            else if (arrayCopy[indexes[i].kthCurrentIndex] < arrayCopy[indexes[arrayWithSmallestValue].kthCurrentIndex]) {
              arrayWithSmallestValue = i;
            }
          }
        }
        // We've found the smallest, move it in
        this->arr[firstIndex + itemsSorted] = arrayCopy[indexes[arrayWithSmallestValue].kthCurrentIndex];
        indexes[arrayWithSmallestValue].kthCurrentIndex++;
        itemsSorted++;
      }
      delete[] arrayCopy;
      
      
    }template <typename T, unsigned int K>
    class ArrayKMerge : public BaseSort<T> {
    public:
      ArrayKMerge(const unsigned int capacity) : BaseSort<T>("Array K-Way Merge", capacity) {}
      void runSort();
    private:
      void runSort(unsigned int firstIndex, unsigned int lastIndex);
    };
    
    template <typename T, unsigned int  K>
    void ArrayKMerge<T, K>::runSort() {
      runSort(0, this->capacity);
    }
    
    struct KIndexes {
      unsigned int kthStartIndex{ 0 };
      unsigned int kthCurrentIndex{ 0 };
      unsigned int kthEndIndex{ 0 };
    };
    
    template <typename T, unsigned int K>
    void ArrayKMerge<T, K>::runSort(unsigned int firstIndex, unsigned int lastIndex) {
    
      if (lastIndex - firstIndex < 2) {
        return;
      }
    
      unsigned int numValues = lastIndex - firstIndex;
      KIndexes indexes[K];
      T* arrayCopy = new T[numValues];
    
      for (unsigned int i = 0; i < K; i++) {
        indexes[i].kthStartIndex = numValues * i / K;
        indexes[i].kthEndIndex = numValues * (i + 1) / K;
        runSort(firstIndex + indexes[i].kthStartIndex, firstIndex + indexes[i].kthEndIndex);
      }
      for (unsigned int i = 0; i < numValues; i++) {
        arrayCopy[i] = this->arr[firstIndex + i];
      }
      for (unsigned int i = 0; i < K; i++) {
        indexes[i].kthCurrentIndex = indexes[i].kthStartIndex;
      }
    
      unsigned int itemsSorted = 0;
    
      while (itemsSorted < numValues) {
        // Scan across all arrays looking for the smallest
        int arrayWithSmallestValue = -1;
        for (unsigned int i = 0; i < K; i++) {
          if (indexes[i].kthCurrentIndex < indexes[i].kthEndIndex) {
            if (arrayWithSmallestValue == -1) {
              arrayWithSmallestValue = i;
            }
            else if (arrayCopy[indexes[i].kthCurrentIndex] < arrayCopy[indexes[arrayWithSmallestValue].kthCurrentIndex]) {
              arrayWithSmallestValue = i;
            }
          }
        }
        // We've found the smallest, move it in
        this->arr[firstIndex + itemsSorted] = arrayCopy[indexes[arrayWithSmallestValue].kthCurrentIndex];
        indexes[arrayWithSmallestValue].kthCurrentIndex++;
        itemsSorted++;
      }
      delete[] arrayCopy;
    }`,

    [SortingAlgorithmsKeys.QUICK]: `template <typename T>
    class Quick : public BaseSort<T> {
    public:
      Quick(const unsigned int capacity) : BaseSort<T>("Quick", capacity) {};
      void runSort();
    private:
      void runSort(unsigned int first, unsigned int last);
      unsigned int quickSortPartition(unsigned int first, unsigned int last);
    };
    
    template <typename T>
    void Quick<T>::runSort() {
      runSort(0, this->capacity);
    }
    
    template <typename T>
    void Quick<T>::runSort(unsigned int first, unsigned int last) {
      if (first < last) {
        // Obtain a pivot, move all values smaller to the left of pivot
        // and all values larger to the right of pivot
        unsigned int pivotLocation = quickSortPartition(first, last);
        runSort(first, pivotLocation);
        runSort(pivotLocation + 1, last);
      }
    }
    
    template <typename T>
    unsigned int Quick<T>::quickSortPartition(unsigned int first, unsigned int last) {
      T pivot;
      unsigned int index;
      unsigned int smallIndex;
      T temp;
      pivot = this->arr[first];
      smallIndex = first;
      for (index = first + 1; index < last; index++) {
        if (this->arr[index] < pivot) {
          smallIndex++;
          //swap
          temp = this->arr[smallIndex];
          this->arr[smallIndex] = this->arr[index];
          this->arr[index] = temp;
        }
      }
      // swap pivot into its final spot
      temp = this->arr[first];
      this->arr[first] = this->arr[smallIndex];
      this->arr[smallIndex] = temp;
    
      return smallIndex;
    }`,

    [SortingAlgorithmsKeys.SELECTION]: `template <typename T>
    class Selection : public BaseSort<T> {
    public:
      Selection(const unsigned int capacity) : BaseSort<T>("Selection", capacity) {};
      void runSort();
    private:
    };
    
    template <typename T>
    void Selection<T>::runSort() {
      // The outer loop's job is to...
      // Each time the outer loop iterators, it works with the leftmost/unsorted index value
      for (unsigned int i = 0; i < this->capacity - 1; i++) {
        // The inner loop's job is to...  
        // Compare the current index to the rest of the unsorted region
        for (unsigned int j = i + 1; j < this->capacity; j++) {
          // We have an i (the index we hope to sort) and a j (a candidate to check)
          if (this->arr[j] < this->arr[i]) {
            T temp = this->arr[i];
            this->arr[i] = this->arr[j];
            this->arr[j] = temp;
          }
        }
      }
    }`,
}
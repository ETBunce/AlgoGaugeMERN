#include <iostream>

using namespace std;

int main(int argc, char *argv[]) {

    if (argc > 1) {
        cout << argv[1];
    } else {
        cout << "Hello world!";
    }

    return 0;
}
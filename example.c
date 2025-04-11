#include<stdio.h>

struct app{
    int a;
    int b;
    char str[50];
};

int main(){
    struct app b;
    b.a = 45;
    printf("%d", b.a);
}
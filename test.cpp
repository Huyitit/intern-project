#include <bits/stdc++.h>

using namespace std;

class sinhvien{
    private:
        char masv[20];
        char hoten[30];
        int tuoi;
        float diem;

    public:
        void nhap();
        void xuat();

};

void   sinhvien::nhap(){
    cout << " nhap ma sinh vien: ";
    fflush(stdin);
    gets(masv);

    cout << " nhap ho va ten: ";
    fflush(stdin);
    gets(hoten);

    cout << " nhap tuoi : ";
    cin >> tuoi;

    cout << " nhap diem sinh vien: ";
    cin >> diem;

    cout << endl;


}
void sinhvien::xuat(){
    cout << "ma sv:" << masv << endl;
    cout << "Ho va ten: " << hoten << endl;
    cout << "tuoi: " << tuoi << endl;
    cout << "diem sv:" << diem << endl;

}

int main(){
    sinhvien a, b;

    cout << " nhap thong tin sinh vien A"<< endl;
    a.nhap();
    cout << " nhap thong tin sinh vien B"<< endl;
    b.nhap();

    cout << " thong tin sinh vien da nhap:"<< endl;
    cout << "[Sinh vien A]"<< endl;
    a.xuat();
    cout << "[Sinh vien B]"<< endl;
    b.xuat();

return 0;


}
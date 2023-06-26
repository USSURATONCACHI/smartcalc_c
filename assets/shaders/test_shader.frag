#version 330 core

out vec4 out_color;

in vec2  f_tex_pos;      // Fragment position in world coordinates


#define STEP_X 0.01
#define STEP_Y 0.01
#define MSAA 16

float render(vec2 pos, vec2 step);
float function(vec2 pos);
bool does_intersect(vec2 pos, vec2 step);
float draw_msaa(vec2 pos);

bool sign_changes(float a, float b) {
    if ((a < 0 && b > 0) || (a > 0 && b < 0))
        return abs(a - b) < 10; // This 10 is arbitrary. It should be a high as possible, while not allowing for artifacts

    return false;
}

void main() {
    vec2 pos = (f_tex_pos - vec2(400, 300)) * vec2(STEP_X, -STEP_Y);
    //float brightness = does_intersect(pos, vec2(STEP_X, STEP_Y)) ? 1.0 : 0.0;
    float val = function(pos);
    vec3 bgc = vec3(0.0);//vec3(val, 0.0, -val);
    out_color = vec4(bgc + vec3(draw_msaa(pos)), 1.0);
}

float function(vec2 pos) {
    float x = pos.x;
    float y = pos.y;

    // Здесь нужно написать функцию
    // Например, если у нас есть формула y = 2*x + 3,
    // то мы просто заменяем равно на минус:
    // (y) - (2*x + 3)
    // и пишем эту формулу в return:
    // return y - 2*x - 3;
    // Знак не играет роли, можно все умножить на -1:
    // return 2*x + 3 - y; // - это будет эквивалетно формуле выше

    // Примеры формул:

    //return y - x;                 // Прямая линия y = x
    //return x*x + y*y - 1;         // Формула круга x^2 + y^2 = 1
    //return y - x*x;               // Парабола y = x^2
    //return y - 1.0/x;             // Гипербола y = 1 / x
    //return sin(x) - cos(y);       // График плиточной сетки
    //return mod(x, y);             // Хз, что это но очень прикольно выглядит       
    //return sin(x * x) - y;        // Более интересная вариация синусоиды
    
    return sin(cos(tan(x*y))) - (sin(cos(tan(x))) + sin(cos(tan(y))));  // Большой фрактальный график
    
    // Можно отобразить сразу две формулы, для этого их нужно просто перемножить:
    //return (sin(x) - y) * (x*x + y*y - 1);  // Синусоида + круг
    //return (sin(y) - x) * (cos(x) - y);     // Вертикальная + горизонтальая синусоида
}

bool does_intersect(vec2 pos, vec2 step) {
    float 
        lb = function(pos + vec2(0.0, step.y)), 
        rb = function(pos + step), 
        lt = function(pos), 
        rt = function(pos + vec2(step.x, 0.0));

    bool does_pass = 
        sign_changes(lb, rb) ||
        sign_changes(lt, rt) ||
        sign_changes(lb, lt) ||
        sign_changes(rb, rt) ||
        
        sign_changes(lt, rb) ||
        sign_changes(rt, lb);

    return does_pass;
}
float render(vec2 pos, vec2 step) {
    return does_intersect(pos, step) ? 1.0 : 0.0;
}

float draw_msaa(vec2 pos) {
    float total_color = 0.0;
    vec2 step = vec2(STEP_X, STEP_Y);

    float bxy = float(int(pos.x + pos.y) & 1);
    float nbxy = 1. - bxy;
    
    // NAA x1
    ///=========
    if (MSAA == 1) {
        total_color = render(pos + step  * vec2(0.0), step);
    } else
    // MSAA x2
    ///=========
    if (MSAA == 2) {
        //step /= sqrt(2.0);
        total_color = (
            render(pos + step  * vec2(0.33 * nbxy, 0.), step) + 
            render(pos + step  * vec2(0.33 * bxy, 0.33), step)) / 2.;
    } else
    // MSAA x3
    ///=========
    if (MSAA == 3) {
        //step /= sqrt(2.0);
        total_color = (
            render(pos + step  * vec2(0.66 * nbxy, 0.), step) + 
            render(pos + step  * vec2(0.66 * bxy, 0.66), step) + 
            render(pos + step  * vec2(0.33, 0.33), step)) / 3.;
    } else
    // MSAA x4
    ///=========
    if (MSAA == 4) { // rotate grid
        //step /= 2.0;
        total_color = (
            render(pos + step  * vec2(0.33, 0.1), step) + 
            render(pos + step  * vec2(0.9, 0.33), step) + 
            render(pos + step  * vec2(0.66, 0.9), step) + 
            render(pos + step  * vec2(0.1, 0.66), step)) / 4.;
    } else
    // MSAA x5
    ///=========
    if (MSAA == 5) { // centre rotate grid
        //step /= 2.0;
        total_color = (
            render(pos + step  * vec2(0.33, 0.2), step) + 
            render(pos + step  * vec2(0.8, 0.33), step) + 
            render(pos + step  * vec2(0.66, 0.8), step) + 
            render(pos + step  * vec2(0.2, 0.66), step) + 
            render(pos + step  * vec2(0.5,  0.5), step)) / 5.;
    } else
    // SSAA x9
    ///=========
    if (MSAA == 9) {  // centre grid 3x3
        //step /= 3;
        total_color = (
        render(pos + step  * vec2(0.17,  0.2), step) + 
        render(pos + step  * vec2(0.17, 0.83), step) + 
        render(pos + step  * vec2(0.83, 0.17), step) + 
        render(pos + step  * vec2(0.83, 0.83), step) +
        render(pos + step  * vec2(0.5,  0.17), step) + 
        render(pos + step  * vec2(0.17,  0.5), step) + 
        render(pos + step  * vec2(0.5,  0.83), step) + 
        render(pos + step  * vec2(0.83,  0.5), step) +
        render(pos + step  * vec2(0.5,   0.5), step) * 2.) / 10.;
    } else
    // SSAA x16
    ///=========
    if (MSAA == 16) { // classic grid 4x4
        //step /= 4.0;
        total_color = (
            render(pos + step  * vec2(0.00, 0.00), step) + 
            render(pos + step  * vec2(0.25, 0.00), step) + 
            render(pos + step  * vec2(0.50, 0.00), step) + 
            render(pos + step  * vec2(0.75, 0.00), step) +
            render(pos + step  * vec2(0.00, 0.25), step) + 
            render(pos + step  * vec2(0.25, 0.25), step) + 
            render(pos + step  * vec2(0.50, 0.25), step) + 
            render(pos + step  * vec2(0.75, 0.25), step) +
            render(pos + step  * vec2(0.00, 0.50), step) + 
            render(pos + step  * vec2(0.25, 0.50), step) + 
            render(pos + step  * vec2(0.50, 0.50), step) + 
            render(pos + step  * vec2(0.75, 0.50), step) +
            render(pos + step  * vec2(0.00, 0.75), step) + 
            render(pos + step  * vec2(0.25, 0.75), step) + 
            render(pos + step  * vec2(0.50, 0.75), step) + 
            render(pos + step  * vec2(0.75, 0.75), step)) / 16.;
    }

    return total_color;
}

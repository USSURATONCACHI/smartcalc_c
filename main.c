#include <stdio.h>

#define RAYGUI_IMPLEMENTATION
#include <raylib.h>
#include <raygui.h>

int main() {
    const int screenWidth = 800;
    const int screenHeight = 600;

    InitWindow(screenWidth, screenHeight, "smartcalc - verdaqui");
    bool should_exit = false;

    Shader shader = LoadShader("assets/shaders/test_shader.vert", "assets/shaders/test_shader.frag");
    Texture2D texture = LoadTexture("assets/img/white_pixel.png");

    Rectangle rectangle = { 0, 0, 800, 600 };

    SetTargetFPS(60);

    // Main game loop
    while (!WindowShouldClose() && !should_exit) {
        BeginDrawing();
        ClearBackground(RAYWHITE);

        BeginShaderMode(shader);

        Vector2 position = { rectangle.x, rectangle.y };
        DrawTexturePro(texture, rectangle, rectangle, position, 0.0f, WHITE);

        EndShaderMode();

        EndDrawing();
    }

    UnloadShader(shader);
    UnloadTexture(texture);
    CloseWindow();

    return 0;
}
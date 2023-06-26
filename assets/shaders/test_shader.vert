#version 330 core

layout (location = 0) in vec2 vertexPosition;
layout (location = 1) in vec2 vertexTexCoord;

out vec2 f_tex_pos;
uniform mat4 mvp;

void main()
{
    f_tex_pos = vertexTexCoord;
    gl_Position = mvp * vec4(vertexPosition, 0.0, 1.0);
}
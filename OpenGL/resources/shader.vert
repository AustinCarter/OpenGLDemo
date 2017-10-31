#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

//layout (location = 1) in vec3 aColor;
//layout (location = 2) in vec2 aTexCoord;

/*out vec3 ourColor;
out vec2 TexCoord;*/

out vec3 Normal;
out vec3 FragPos;


uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
	FragPos = vec3(model * vec4(aPos,1.0));
	Normal = mat3(transpose(inverse(model))) * aNormal;  //in a real app praobabls should make this matrix and send via a uniform to minimize the amout of times it needs to be calculated
	
	gl_Position =  projection * view * model * vec4(aPos, 1.0);
	//ourColor = aColor;
	//TexCoord = vec2(aTexCoord.x, aTexCoord.y);
}

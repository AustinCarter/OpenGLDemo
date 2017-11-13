#version 330 core

out vec4 FragColor;

in vec2 TexCoords;

in vec3 FragPos;  
in vec3 Normal; 

/*struct Material {
    sampler2D diffuse; //used for taking in a lighting map
    sampler2D specular;    
    float shininess;
}; */

struct PointLight {    
    vec3 position;
    
    float constant;
    float linear;
    float quadratic;  

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};  
uniform PointLight pointLight;

struct SpotLight {    
    vec3 position;
    vec3 direction;
    float cutOff;
    float cutOffOuter;
    
    float constant;
    float linear;
    float quadratic;  

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform SpotLight spotLight;

vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

    
uniform float shininess;
uniform sampler2D texture_diffuse1;
uniform sampler2D texture_specular1;

uniform vec3 viewPos;
//uniform Material material;


void main()
{    

     // properties
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    vec3 result = CalcSpotLight(spotLight, norm, FragPos, viewDir);  

    result += CalcPointLight(pointLight, norm, FragPos, viewDir);    
    
    FragColor = vec4(result, 1.0);
}

vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = light.ambient * vec3(texture(texture_diffuse1, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(texture_diffuse1, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(texture_specular1, TexCoords));
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    float theta = dot(lightDir, normalize(-light.direction));
    float epsilon = light.cutOff - light.cutOffOuter;
    float intensity = clamp((theta - light.cutOffOuter) / epsilon, 0.0, 1.0);  
        
    diffuse *= intensity;
    specular *= intensity;
    return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = light.ambient * vec3(texture(texture_diffuse1, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(texture_diffuse1, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(texture_specular1, TexCoords));
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}

/*vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - FragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
     float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
     //attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));      
    // combine results
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
    vec3 specular = light.specular * spec * vec3(texture(texture_specular1, TexCoords));
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
}*/
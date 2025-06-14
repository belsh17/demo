package com;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.service.JwtService;

import com.JwtProperties;

import lombok.RequiredArgsConstructor;

//protect all endpoints except /api/auth/**
//Configure JwtEncoder and JwtDecoder
@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    private final JwtProperties jwtProperties;
    private final ResourceLoader resourceLoader;

    @Bean
    public JwtEncoder jwtEncoder() throws Exception {
        RSAPublicKey publicKey = loadPublicKey(jwtProperties.getPublicKey());
        RSAPrivateKey privateKey = loadPrivateKey(jwtProperties.getPrivateKey());

        var jwk = new RSAKey.Builder(publicKey)
            .privateKey(privateKey)
            .build();
        
            return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(jwk)));
    }

    @Bean 
    public JwtDecoder jwtDecoder() throws Exception {
        return NimbusJwtDecoder.withPublicKey(loadPublicKey(jwtProperties.getPublicKey())).build();
    }

    @Bean
    public JwtService jwtService(JwtEncoder jwtEncoder){
        return new JwtService(jwtEncoder, jwtProperties);
    }

    private RSAPublicKey loadPublicKey(String location) throws Exception{
        //Resource resource = resourceLoader.getResource(location);
        Resource resource = new ClassPathResource("jwt/app.pub");
        try(InputStream is = resource.getInputStream()){
            String key = new String(is.readAllBytes())
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s","");
            byte[] decoded = Base64.getDecoder().decode(key);
            var spec = new X509EncodedKeySpec(decoded);
            System.out.println("Resource exists? " + resource.exists());
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
        }
    }

     private RSAPrivateKey loadPrivateKey(String location) throws Exception{
        //Resource resource = resourceLoader.getResource(location);
         Resource resource = new ClassPathResource("jwt/app.key");
        try(InputStream is = resource.getInputStream()){
            String key = new String(is.readAllBytes())
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s","");
            byte[] decoded = Base64.getDecoder().decode(key);
            var spec = new PKCS8EncodedKeySpec(decoded);
            return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
        }
    }

    //kept secret and used to create digital signatures
    // private RSAPrivateKey privateKey;

    // //shared and used to verify signatures
    // private RSAPublicKey publicKey;

    //private Duration ttl;
    //private final JwtProperties jwtProperties;

    // @Bean
    // public JwtEncoder jwtEncoder(){
    //     final var jwk = new RSAKey.Builder(publicKey)
    //         .privateKey(privateKey).build();

    //     return new NimbusJwtEncoder(
    //         new ImmutableJWKSet<>(new JWKSet(jwk)));
    // }

    // @Bean 
    // public JwtDecoder jwtDecoder(){
    //     return NimbusJwtDecoder.withPublicKey(publicKey).build();
    // }

    // @Bean 
    // public JwtService jwtService(
    //     JwtEncoder jwtEncoder,
    //     JwtProperties jwtProperties
    // ){
    //     return new JwtService(jwtEncoder, jwtProperties);
    // }
    // public JwtService jwtService(
    //     @Value("${spring.application.name}") final String appName,
    //     final JwtEncoder jwtEncoder){
    //         return new JwtService(appName, ttl, jwtEncoder);
    //     }    
}

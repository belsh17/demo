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
//defines beans for encoding and decoding JWTs using the RSA keys.
@Configuration
@RequiredArgsConstructor
public class JwtConfig {

    //contains the path to the RSA key field
    private final JwtProperties jwtProperties;
    private final ResourceLoader resourceLoader;

    //creates JwtEncoder bean using RSA keys and Nimbus library
    //private key - used to sign tokens using RS256 algo.
    @Bean
    public JwtEncoder jwtEncoder() throws Exception {
        //loads public and private keys from file
        RSAPublicKey publicKey = loadPublicKey(jwtProperties.getPublicKey());
        RSAPrivateKey privateKey = loadPrivateKey(jwtProperties.getPrivateKey());

        //build the JWK (Json Web Key) with the RSA keys
        var jwk = new RSAKey.Builder(publicKey)
            .privateKey(privateKey)
            .build();
        
        //return a nimbusJwtEncoder with the JWKSet
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(jwk)));
    }

    //creates JwtDecoder bean verifies JWTs using public RSA key
    @Bean 
    public JwtDecoder jwtDecoder() throws Exception {
        return NimbusJwtDecoder
        .withPublicKey(loadPublicKey(jwtProperties.getPublicKey()))
        .build();
    }

    //registers JwtService bean which uses an encoder and JWT properties
    @Bean
    public JwtService jwtService(JwtEncoder jwtEncoder){
        return new JwtService(jwtEncoder, jwtProperties);
    }

    private RSAPublicKey loadPublicKey(String location) throws Exception{
        //Resource resource = resourceLoader.getResource(location);
        //load public key file from classpath
        Resource resource = new ClassPathResource("jwt/app.pub");
        try(InputStream is = resource.getInputStream()){
            String key = new String(is.readAllBytes())
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s","");
            //decode base64 and reconstruct the key
            byte[] decoded = Base64.getDecoder().decode(key);
            var spec = new X509EncodedKeySpec(decoded);
            System.out.println("Resource exists? " + resource.exists());
            return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
        }
    }

     private RSAPrivateKey loadPrivateKey(String location) throws Exception{
        //Resource resource = resourceLoader.getResource(location);
        //load private key file from classpath
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

}

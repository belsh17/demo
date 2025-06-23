package com.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

import org.springframework.stereotype.Component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    @Value("${jwt.private-key}")
    private String privateKeyPath;

     @Value("${jwt.public-key}")
    private String publicKeyPath;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void initKeys() throws Exception {
        this.privateKey = loadPrivateKey(privateKeyPath);
        this.publicKey = loadPublicKey(publicKeyPath);
        System.out.println("Loaded RSA successfully");
    }

    private PrivateKey loadPrivateKey(String path) throws Exception{
        ClassPathResource resource = new ClassPathResource(path);
        byte[] keyBytes = resource.getInputStream().readAllBytes();

        String key = new String(keyBytes)
            .replaceAll("-----BEGIN (.*)-----", "")
            .replaceAll("-----END (.*)-----", "")
            .replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    private PublicKey loadPublicKey(String path) throws Exception{
        ClassPathResource resource = new ClassPathResource(path);
        byte[] keyBytes = resource.getInputStream().readAllBytes();

        String key = new String(keyBytes)
            .replaceAll("-----BEGIN (.*)-----", "")
            .replaceAll("-----END (.*)-----", "")
            .replaceAll("\\s+", "");

        byte[] decoded = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    public String generateShortLivedToken(String username, long ttlMillis){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + ttlMillis);

        //System.out.println("GENERATING TOKEN with secretKey = " + secretKey);
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(privateKey, SignatureAlgorithm.RS256)
            //.signWith(SignatureAlgorithm.RS256, privateKey)
            .compact();
    }

    //private final String SECRET_KEY ="";

    public boolean validateToken(String token){
        try{
            Jwts.parser()
                .setSigningKey(publicKey)
                .parseClaimsJws(token);
            return true;
        }catch(JwtException | IllegalArgumentException e){
            return false;
        }
    }

    public String extractUsername(String token){

        //System.out.println("VERIFYING TOKEN WITH secretKey = " + secretKey);
        System.out.println("STATE token: " + token);
        return Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .build()
            //.setSigningKey(publicKey)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

}

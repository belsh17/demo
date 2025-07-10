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

    //inject the path to the RSA private key from application.properties
    @Value("${jwt.private-key}")
    private String privateKeyPath;

    ////inject the path to the RSA public key
     @Value("${jwt.public-key}")
    private String publicKeyPath;

    //fields to hold loaded key instances
    private PrivateKey privateKey;
    private PublicKey publicKey;

    //called after the bean is constructed to initialize keys
    @PostConstruct
    public void initKeys() throws Exception {
        this.privateKey = loadPrivateKey(privateKeyPath); //load private key for signing JWTs
        this.publicKey = loadPublicKey(publicKeyPath); //load public key for validating JWTs
        System.out.println("Loaded RSA successfully");
    }

    //load the rsa private key from the specified file path
    private PrivateKey loadPrivateKey(String path) throws Exception{
        ClassPathResource resource = new ClassPathResource(path);
        byte[] keyBytes = resource.getInputStream().readAllBytes();

        //remove PEM (Privacy Enhanced Mail = base64 encoded string wrapped with header and footer lines) headers/footers and whitespaces
        String key = new String(keyBytes)
            .replaceAll("-----BEGIN (.*)-----", "")
            .replaceAll("-----END (.*)-----", "")
            .replaceAll("\\s+", "");

            //decode and convert to PKCS8 format - storing private keys
        byte[] decoded = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        return KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    //load the RSA public key from the specified file path
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

    //generate short lived JWT token using the private key
    public String generateShortLivedToken(String username, long ttlMillis){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + ttlMillis);

        //System.out.println("GENERATING TOKEN with secretKey = " + secretKey);
        return Jwts.builder()
            .setSubject(username) //sets subject
            .setIssuedAt(now) //set issued time
            .setExpiration(expiry) //set expiration time
            .signWith(privateKey, SignatureAlgorithm.RS256) //sign using RSA private key
            //.signWith(SignatureAlgorithm.RS256, privateKey)
            .compact();
    }

    //private final String SECRET_KEY ="";

    //va;idates the token signature and expiration using the public key
    public boolean validateToken(String token){
        try{
            Jwts.parser()
                .setSigningKey(publicKey) //sets public key for signature verification
                .parseClaimsJws(token); //parse and validate token
            return true;
        }catch(JwtException | IllegalArgumentException e){
            return false; //invaliud signature, expired token, or malformed
        }
    }

    //extracts the username from a valid JWT token
    public String extractUsername(String token){

        //System.out.println("VERIFYING TOKEN WITH secretKey = " + secretKey);
        System.out.println("STATE token: " + token);
        return Jwts.parserBuilder()
            .setSigningKey(publicKey) //use public key to verify signature 
            .build()
            //.setSigningKey(publicKey)
            .parseClaimsJws(token) //parse the JWT
            .getBody()
            .getSubject(); //return the subject field
    }

}

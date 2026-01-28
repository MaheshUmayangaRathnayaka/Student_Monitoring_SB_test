package com.spms.controller;

import com.spms.dto.SignInRequest;
import com.spms.dto.SignUpRequest;
import com.spms.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    @Autowired
    AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest signInRequest) {
        log.info("Sign in request for user: {}", signInRequest.getUsernameOrEmail());
        return authService.authenticateUser(signInRequest);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        log.info("Sign up request for user: {}", signUpRequest.getUsername());
        return authService.registerUser(signUpRequest);
    }
}
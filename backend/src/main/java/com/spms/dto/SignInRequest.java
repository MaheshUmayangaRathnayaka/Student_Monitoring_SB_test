package com.spms.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class SignInRequest {
    @NotBlank
    private String usernameOrEmail;
    
    @NotBlank
    private String password;
}
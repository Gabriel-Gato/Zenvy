package com.Zenvy.dto;

public record AlterarSenhaRequest(
        String currentPassword,
        String newPassword
) {}

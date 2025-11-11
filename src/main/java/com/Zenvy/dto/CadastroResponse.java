package com.Zenvy.dto;

public record CadastroResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String fotoPerfil,
        AuthResponse auth

) {
}

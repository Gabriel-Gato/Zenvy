package com.Zenvy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CadastroRequest(

        @NotBlank(message = "O nome é obrigatório")
        @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]+$", message = "O nome deve conter apenas letras")
        String nome,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, max = 100, message = "A senha deve ter entre 8 e 100 caracteres")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]+$",
                message = "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais")
        String senha,

        @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?9?\\d{4}-?\\d{4}$",
                message = "Telefone inválido. Use o formato (XX) 9XXXX-XXXX")
        String telefone,

        @Size(max = 500, message = "A URL da foto deve ter no máximo 500 caracteres")
        @Pattern(regexp = "^(?i)(https?://.*\\.(jpg|jpeg|png|gif|webp))?$",
                message = "URL da foto inválida")
        String fotoPerfil

) {
}

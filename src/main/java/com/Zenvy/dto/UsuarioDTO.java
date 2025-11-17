package com.Zenvy.dto;

import com.Zenvy.models.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String fotoPerfil;
    private String role;

    public UsuarioDTO(Usuario u) {
        this.id = u.getId();
        this.nome = u.getNome();
        this.email = u.getEmail();
        this.telefone = u.getTelefone();
        this.fotoPerfil = u.getFotoPerfil();
        this.role = u.getRole().name();
    }
}

package com.Zenvy.dto;

import com.Zenvy.models.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter


public class HospedeDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String foto;

    private static final String BASE_IMAGE_URL = "http://localhost:8080/uploads/fotosUsuarios/";

    public HospedeDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.foto = usuario.getFotoPerfil() != null ? BASE_IMAGE_URL + usuario.getFotoPerfil() : null;
    }
}
